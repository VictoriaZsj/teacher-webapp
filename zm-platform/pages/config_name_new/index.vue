<template>
  <div class="context config-name" v-if="checkPermission('tea:recruit:entry-config')">
    <Spin size="large" fix v-if="ptSubject"></Spin>
      <el-form :inline="true" :model="search_data" class="search-form">
        <el-form-item label="报名页名称">
          <el-input v-model="search_data.entryName" placeholder="输入报名页名称"></el-input>
        </el-form-item>
        <el-form-item label="招师类型">
          <el-select v-model="search_data.entryType" placeholder="选择招师类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="兼职" :value="0"></el-option>
            <el-option label="全职" :value="1"></el-option>
            <el-option label="校招全职" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="search-btn" @click="newCreate('','')" type="normal" size="small">创建报名页</el-button>
        <el-button class="search-btn" icon="search" type="normal" size="small" @click="fetchTab">查询</el-button>
      </el-form>
    <div class="context-body">
      <p>共{{table_data_total}}条</p><br>
      <el-table :data="table_data">
        <el-table-column width="90" label="报名页名称">
          <template scope="scope">{{ scope.row.entryName }}</template>
        </el-table-column>

        <el-table-column width="90" label="招师类型">
          <template scope="scope">
            <span v-if="scope.row.entryType==0">兼职</span>
            <span v-if="scope.row.entryType==1">全职</span>
            <span v-if="scope.row.entryType==2">校招全职</span>
          </template>
        </el-table-column>
        <el-table-column width="90" label="默认报名页">
          <template scope="scope">
            <span>{{scope.row.isDefault?'是':'否'}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="operatorName" label="操作者" width="90" align="center"></el-table-column>

        <el-table-column
          prop="updatedTime"
          :formatter="transformDate"
          label="更新时间"
          width="180"
          align="center"
        ></el-table-column>

        <el-table-column label="操作" align="center">
          <template scope="scope">
            <div v-if="scope.row.entryType==0" style="display: inline-block">
              <el-button
                type="text"
                size="small"
                @click="showGradeSub(scope.row.entryConfigId)"
              >年级科目配置</el-button>
              <el-button
                v-show="search_data.bu == '1' || search_data.bu == '2'"
                type="text"
                size="small"
                @click="showSchollConfig(scope.row)"
              >学校配置</el-button>
              <el-button
                v-show="search_data.bu == '1' || search_data.bu == '2'"
                type="text"
                size="small"
                @click="showGradeConfig(scope.row)"
              >年级配置</el-button>
            </div>
            <div v-else style="display: inline-block">
              <el-button
                type="text"
                size="small"
                @click="showGradeSub(scope.row.entryConfigId)"
              >年级科目配置</el-button>
            </div>&nbsp;&nbsp;&nbsp;
            <el-button type="text" size="small" @click="newCreate(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="del(scope.row.entryConfigId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="search_data.pageNo"
        :page-size="10"
        layout=" prev, pager, next"
        v-bind:total="table_data_total"
      ></el-pagination>
    </div>

    <!--创建报名&重命名-->
    <el-dialog :title="createtitle" v-model="createVisible" class="create-form">
      <el-form :model="entryData">
        <el-form-item label="请选择bu类型：">
          <el-select @change="buChange" v-model="entryData.bu" placeholder="请选择">
            <el-option label="1对1" value="1"></el-option>
            <el-option label="少儿" value="2"></el-option>
            <el-option label="陪练" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择报名类型：">
          <el-select @change="entryChange" v-model="entryData.entryType" placeholder="请选择">
            <el-option label="兼职" value="0"></el-option>
            <el-option label="公校兼职" value="1"></el-option>
            <el-option label="全职" value="2"></el-option>
            <el-option label="校招全职" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写渠道名称：">
          <el-input @change="inputChange" v-model="entryData.entryName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="定义链接地址：">
          <span>{{entryData.entryUrl}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="postEntryData">确 定</el-button>
      </div>
    </el-dialog>

    <!--重命名-->
    <el-dialog :title="createtitle" v-model="renameVisible" class="create-form">
      <el-form>
        <el-form-item label="请选择bu类型：">
          <el-select @change="rebuChange" v-model="reEntryData.bu" placeholder="请选择">
            <el-option label="1对1" value="1"></el-option>
            <el-option label="少儿" value="2"></el-option>
            <el-option label="陪练" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择报名类型：">
          <el-select @change="reentryChange" v-model="ntryNameLabel" placeholder="请选择">
            <el-option value="兼职"></el-option>
            <el-option value="公校兼职"></el-option>
            <el-option value="全职"></el-option>
            <el-option value="校招全职"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写渠道名称：">
          <el-input @change="reinputChange" v-model="reEntryData.entryName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="定义链接地址：">
          <span>{{reEntryData.entryUrl}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renameVisible = false">取 消</el-button>
        <el-button type="primary" @click="rePostEntryData">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改全职配置-->
    <el-dialog
      title="年级科目配置（10秒钟后生效）"
      size="large"
      v-model="fulltimeRe"
      class="fulltime-form"
      @close="restorePhase"
    >
        <div v-for="(item,index) in phaseList" class="subject" :key="index">
          <div class="sub-title">
            配置{{phaseList[index].label}}学科
            <el-button
              style="margin-right:14px;"
              @click="phaseListHarry(index)"
              :type="item.harry ? 'primary' : 'default'"
              size="small"
            >急缺</el-button>
            <el-button
              style="margin-right:14px;"
              @click="phaseListFull(index)"
              :type="item.ample ? 'primary' : 'default'"
              size="small"
            >充足</el-button>

            <el-button
              @click="phaseListFullSelect(index)"
              :type="item.full ? 'primary' : 'default'"
              size="small"
            >全选</el-button>
          </div>
          <div class="btn-container">
            <template v-for="(_item,_index) in phaseSubject[index]">
              <el-button
                :key="_index"
                @click="phaseSubjectSelect(index,_index)"
                :type="_item.select ? 'primary' : 'default'"
                size="small"
              >{{_item.label}}</el-button>
              <input type="checkbox"
                :key="'a'+_index"
                v-show="_item.select"
                @change="subPhaseHarrySelect(_item.harry,index,_index)"
                v-model="_item.harry">急缺
              <input type="checkbox"
                :key="'b'+_index"
                v-show="_item.select"
                @change="subPhaseFullSelect(_item.ample,index,_index)"
                v-model="_item.ample">充足
            </template>
          </div>
        </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="restorePhase">取 消</el-button>
        <el-button type="primary" @click="gradeSubConfig">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="学校配置"
      size="large"
      top="5%"
      v-model="schoolModel"
      class="parttime-form"
      @close="cleseSchoolSub"
    >
      <config-school ref="configSchool" :entryConfigId="entryConfigId" :bu="bu"></config-school>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleseSchoolSub">取 消</el-button>
        <el-button type="primary" @click="confirmSchollSubConfig">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="老师年级配置"
      size="large"
      top="5%"
      v-model="gradeModel"
      class="parttime-form"
      @close="handlerChoseGrade"
    >
      <config-grade ref="configGrade" :entryConfigId="entryConfigId" :bu="bu"></config-grade>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerChoseGrade">取 消</el-button>
        <el-button type="primary" @click="handlerConfirmGrade">确 定</el-button>
      </div>
    </el-dialog>

    <edit ref="editDialog" @successBack="fetchTab"></edit>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>



<script>
import getPhase from "../../api/select/getPhase";
import getSchool from "../../api/select/getSchool";
import getSubject from "../../api/select/getSubject";
import configSchool from "./config-school.vue";
import configGrade from "./config-grade.vue";
import edit from "./components/edit.vue";

export default {
  components: {
    edit,
    configSchool,
    configGrade
  },
  data() {
    return {
      table_data_total: 0,
      search_data: {
        bu: "1",
        pageNo: 1,
        pageSize:10,
        entryName:'',
        entryType:''
      },
      entytype: "",
      renameVisible: false,
      ntryNameLabel: "",
      tableShow: true,
      ptSchool: true,
      schoolData: [],
      baseSubject: [],
      school_sub_list: [],
      ptSubject: true,
      ptDialog: true,
      ptDialogPlus: false,
      fullDialog: true,
      phaseList: [], //学段偏好
      phaseSubject: [], //对应科目
      schoolModel: false,
      table_data: [],
      entryConfigId: "",
      configTitle: "",
      entryConfigType: "",
      // 创建还是修改
      createtitle: "",
      // 创建报名表单隐藏
      createVisible: false,
      // 报名表单数据
      entryData: {
        bu: "1",
        entryName: "",
        entryType: "0",
        entryUrl: ""
      },
      // 重命名报名表单数据
      reEntryData: {
        bu: "1",
        entryName: "",
        entryType: "0",
        entryConfigId: "",
        entryUrl: ""
      },
      // 全职报名
      fulltime: false,
      fulltimeRe: false,
      // 兼职报名
      parttime: false,
      // 配置信息,选择的年级
      chosed_grade: [0, 0, 0],
      // 全职选择的科目
      chosed_subject_xx: [[0, 0, 0, 0, 0], [false, false, false, false, false]],
      chosed_subject_cz: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [false, false, false, false, false, false, false, false, false, false]
      ],
      chosed_subject_gz: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ]
      ],
      //学科
      chosed_subject_xk: [[0, 0, 0], [false, false, false]],
      chosed_subject_xk_sub: [],
      // 学校列表
      school_list: [],
      // 选择的学校
      chosed_school: [],
      // 兼职科目列表
      pt_subject: [],
      km: [],
      km_s: [],
      km_plus: [],
      pt_loading: true,
      // 兼职配置详情
      pt_chosed_detail: [],
      // 选择学校下拉
      schoolDown: true,
      // 按钮种类控制
      button_type: ["", "primary"],
      // 年级配置
      gradeModel: false,
      // 列表中bu
      bu: ""
    };
  },
  methods: {
    del(id) {
      this.$MessageBox.confirm(`确定删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFun(id);
      }).catch(() => {
        console.log('取消成功');
      });
		},
		deleteFun(entryConfigId){
      this.$Fetch({
        url:"/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/removeEntryConfig",
        method: "post",
				data: {
					entryConfigId
				}
      })
        .then(res => {
          if (res.msgCode === "200") {
            this.$Message.success("删除成功");
            this.fetchTab();
          } else {
            this.$Message.error(res.msgContent);
          }
        })
        .catch(err => {
          this.$Message({
            type: "error",
            message: err
          });
        });
		},
    newCreate(row) {
      this.$refs.editDialog.show(row);
    },
    handleCurrentChange(val) {
      this.search_data.pageNo = val;
      this.fetchTab();
    },
    cleseSchoolSub() {
      this.schoolModel = false;
      this.$refs.configSchool.handlerReset();
    },
    haveData(parm, key) {
      let have = false;
      for (let _key in parm) {
        if (_key == key) {
          have = true;
        }
      }
      return have;
    },
    initSchoolSub(perm) {
      for (let j = 0; j < this.schoolData.length; j++) {
        let _item = this.schoolData[j];
        if (this.haveData(perm, _item.value)) {
          _item.select = true;
          let _subList = perm[_item.value];
          let _sub = [].concat(JSON.parse(JSON.stringify(this.baseSubject))); //拷贝数组
          //设置选中和加急状态
          if (_subList != null) {
            let _subList1 = _subList[0];
            let _subList2 = _subList[1];
            for (let m = 0; m < _sub.length; m++) {
              let _index = _subList1.indexOf(_sub[m].value);
              if (_index != -1) {
                _sub[m].select = true;
              }
              if (_subList2[_index] == "1") {
                _sub[m].harry = true;
              }
            }
          }
          let data = {
            schoolText: _item.label,
            schoolCode: _item.value,
            full: false,
            subData: _sub
          };
          this.school_sub_list.push(data);
        }
      }
    },
    getItemFromSchoolData(schoolvalue) {
      let item = null;
      for (let i = 0; i < this.schoolData.length; i++) {
        if (this.schoolData[i].value == schoolvalue) {
          item = this.schoolData[i];
          break;
        }
      }
      return item;
    },
    confirmSchollSubConfig() {
      this.$refs.configSchool.handlerClickConfirm();
      this.$nextTick(() => (this.schoolModel = false));
    },
    schollSubFull(item, index) {
      item.full = !item.full;
      for (let i = 0; i < item.subData.length; i++) {
        item.subData[i].select = item.full;
      }
      this.school_sub_list.splice(index, 1, item);
    },
    select_school_sub(item, index, _item, _index) {
      _item.select = !_item.select;
      item.subData.splice(_index, 1, _item);
      //设置全选状态
      if (_item.select) {
        let isfull = true;
        for (let i = 0; i < item.subData.length; i++) {
          if (item.subData[i].select == false) {
            isfull = false;
            break;
          }
        }
        item.full = isfull;
      } else {
        item.full = false;
      }
      this.school_sub_list.splice(index, 1, item);
    },
    selectSchool(item) {
      let _sub = [].concat(JSON.parse(JSON.stringify(this.baseSubject))); //拷贝数组
      item.select = !item.select;
      if (item.select) {
        let data = {
          schoolText: item.label,
          schoolCode: item.value,
          full: false,
          subData: _sub
        };
        this.school_sub_list.push(data);
      } else {
        for (let i = 0; i < this.school_sub_list.length; i++) {
          if (this.school_sub_list[i].schoolCode == item.value) {
            this.school_sub_list.splice(i, 1);
            break;
          }
        }
      }
    },
    // 学校配置
    showSchollConfig(row) {
      this.entryConfigId = row.entryConfigId;
      this.bu = row.bu;
      this.schoolModel = true;
      this.$nextTick(() => {
        if (this.entryConfigId && this.bu && this.schoolModel)
          this.$refs.configSchool.getDistrictData();
      });
    },
    // 年级科目配置
    showGradeSub(id) {
      if (this.phaseList.length == 0 || this.phaseSubject.length == 0) {
        this.$Message({
          message: "尚未从远端读取到年级科目字典信息，无法进行配置"
        });
        return;
      }
      this.entryConfigId = id;
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/searchEntryConfigDetailByConfigId",
        method: "post",
        data: {
          entryConfigId: this.entryConfigId,
          entryConfigType: 0
        }
      })
        .then(result => {
          if (result.msgCode == 200) {
            this.fulltimeRe = true;
            this.translateGradeSub(result.data||{});
          } else {
            this.$Message({
              message: result.msgContent
            });
          }
        })
        .catch(message => {
          this.$Message({
            message
          });
        });
    },
    /**
     * 年级配置
     */
    showGradeConfig(row) {
      this.entryConfigId = row.entryConfigId;
      this.bu = row.bu;
      this.gradeModel = true;
      this.$nextTick(() => {
        if (this.entryConfigId && this.bu && this.gradeModel)
          this.$refs.configGrade.getGradeData();
      });
    },
    /**
     * 年级配置 关闭弹框
     */
    handlerChoseGrade() {
      this.gradeModel = false;
    },
    /**
     * 年级配置弹框 确认
     */
    handlerConfirmGrade() {
      this.$refs.configGrade.handlerClickConfirm();
      this.gradeModel = false;
    },
    translateGradeSub(data) {
      for (let key in data.extraParam) {
        this.setPhaseStatue(key, data.extraParam[key]);
      }
      for (let _key in data.param) {
        this.setSubStatue(_key, data.param[_key]);
      }
    },
    setPhaseStatue(key, harryFull) {
      let harry = harryFull[0];
      let ample = harryFull[1];

      let index = this.getIndexByKeyForPhase(key);
      if (index != -1) {
        let _data = this.phaseList[index];
        _data.select = true;
        _data.harry = harry == "0" ? false : true;
        _data.ample = ample == "0" ? false : true;
        this.phaseList.splice(index, 1, _data);
      }
    },
    setPhaseStatueFull(key) {
      let index = this.getIndexByKeyForPhase(key);
      if (index != -1) {
        let _data = this.phaseList[index];
        _data.full = true;
        this.phaseList.splice(index, 1, _data);
      }
    },
    getIndexByKeyForPhase(key) {
      let index = -1;
      for (let j = 0; j < this.phaseList.length; j++) {
        if (this.phaseList[j].value == key) {
          index = j;
          break;
        }
      }
      return index;
    },
    getIndexByKeyForPhaseSubject(index, key) {
      let _index = -1;
      for (let j = 0; j < this.phaseSubject[index].length; j++) {
        if (this.phaseSubject[index][j].value == key) {
          _index = j;
          break;
        }
      }
      return _index;
    },
    setSubStatue(key, data) {
      let index = this.getIndexByKeyForPhase(key);
      if (index == -1) {
        return;
      }
      let _data = this.phaseSubject[index];

      let _selectSub = data[0];
      let _harrySub = data[1];
      let _fullSub = data[2];

      for (let j = 0; j < _selectSub.length; j++) {
        let _index = this.getIndexByKeyForPhaseSubject(index, _selectSub[j]);
        if (_index != -1) {
          _data[_index].select = true;
          if (_harrySub[j] == "1") {
            _data[_index].harry = true;
          } else {
            _data[_index].harry = false;
          }
          if (_fullSub[j] == "1") {
            _data[_index].ample = true;
          } else {
            _data[_index].ample = false;
          }
        }
      }
      this.phaseSubject.splice(index, 1, _data);
      //判断是否需要加上全选
      let full = true;
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].select == false) {
          full = false;
          break;
        }
      }
      let __data = this.phaseList[index];
      __data.full = full;
      this.phaseList.splice(index, 1, __data);
    },
    entryChange() {
      if (this.entryData.entryName != "") {
        this.inputChange();
      }
    },
    subPhaseHarrySelect(harryState, mainIndex, subIndex) {
      if (!!harryState) {
        //设置充足为false
        let _data = this.phaseSubject[mainIndex];
        _data[subIndex].ample = false;
        this.phaseSubject.splice(mainIndex, 1, _data);
      }
    },
    subPhaseFullSelect(fullState, mainIndex, subIndex) {
      if (!!fullState) {
        //设置充足为false
        let _data = this.phaseSubject[mainIndex];
        _data[subIndex].harry = false;
        this.phaseSubject.splice(mainIndex, 1, _data);
      }
    },
    phaseListHarry(index) {
      let statue = this.phaseList[index].harry ? false : true;
      let _data = this.phaseList[index];
      _data.harry = statue;
      if (!!_data.harry) {
        _data.ample = false;
      }
      this.phaseList.splice(index, 1, _data);
    },
    phaseListFull(index) {
      let statue = this.phaseList[index].ample ? false : true;
      let _data = this.phaseList[index];
      _data.ample = statue;
      if (!!_data.ample) {
        _data.harry = false;
      }
      this.phaseList.splice(index, 1, _data);
    },
    phaseListFullSelect(index) {
      let statue = this.phaseList[index].full ? false : true;
      let _data = this.phaseList[index];
      _data.full = statue;
      this.phaseList.splice(index, 1, _data);
      this.phaseSubjectSelectFull(index, statue);
    },
    phaseSubjectSelect(mainIndex, subIndex) {
      let statue = this.phaseSubject[mainIndex][subIndex].select ? false : true;
      let _data = this.phaseSubject[mainIndex];
      _data[subIndex].select = statue;
      this.phaseSubject.splice(mainIndex, 1, _data);
      //判断是否需要设置全选
      let full = true;
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].select == false) {
          full = false;
          break;
        }
      }
      let __data = this.phaseList[mainIndex];
      __data.full = full;
      this.phaseList.splice(mainIndex, 1, __data);
    },
    phaseSubjectSelectFull(mainIndex, statue) {
      let len = this.phaseSubject[mainIndex].length;
      let _data = this.phaseSubject[mainIndex];
      for (let i = 0; i < len; i++) {
        _data[i].select = statue;
      }
      this.phaseSubject.splice(mainIndex, 1, _data);
    },
    restorePhase() {
      this.fulltimeRe = false;
      let len = this.phaseSubject.length;
      for (let i = 0; i < len; i++) {
        let item = this.phaseSubject[i];
        let itemLen = item.length;
        for (let j = 0; j < itemLen; j++) {
          item[j].select = false;
          item[j].harry = false;
        }
      }

      // let _len = this.phaseList.length;
      for (let m = 0; m < len; m++) {
        this.phaseList[m].select = false;
        this.phaseList[m].harry = false;
        this.phaseList[m].full = false;
      }
    },
    gradeSubConfig() {
      let len = this.phaseSubject.length;
      let SelectGrade = [];
      let SelectSub = [];
      for (let i = 0; i < len; i++) {
        let __data = this.phaseSubject[i];
        let __len = __data.length;

        let someSelect = false;
        let sub = {
          code: this.phaseList[i].value,
          sub: []
        };
        for (let j = 0; j < __len; j++) {
          if (__data[j].select) {
            someSelect = true;
            sub.sub.push({
              code: __data[j].value,
              harry: __data[j].harry,
              ample: __data[j].ample
            });
          }
        }
        if (someSelect) {
          //保存年级
          SelectGrade.push({
            code: this.phaseList[i].value,
            harry: this.phaseList[i].harry,
            ample: this.phaseList[i].ample
          });
        }
        if (sub.sub.length != 0) {
          SelectSub.push(sub);
        }
      }

      if (SelectGrade.length == 0) {
        this.$Message({
          message: "请至少选择一项"
        });
        return;
      }

      let extraParam = {};
      let param = {};
      for (let m = 0; m < SelectGrade.length; m++) {
        // let _p = {};
        let _harry = SelectGrade[m].harry ? 1 : 0;
        let _ample = SelectGrade[m].ample ? 1 : 0;
        extraParam[SelectGrade[m].code] = [_harry, _ample];
      }
      for (let n = 0; n < SelectSub.length; n++) {
        param[SelectSub[n].code] = [[], [], []];
        let _sub = SelectSub[n].sub;
        let _len = _sub.length;
        for (let j = 0; j < _len; j++) {
          param[SelectSub[n].code][0].push(_sub[j].code);
          param[SelectSub[n].code][1].push(_sub[j].harry ? 1 : 0);
          param[SelectSub[n].code][2].push(_sub[j].ample ? 1 : 0);
        }
      }
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/upsertEntryConfig",
        method: "post",
        data: {
          entryConfigId: this.entryConfigId,
          entryConfigType: 0,
          param: JSON.stringify(param),
          extraParam: JSON.stringify(extraParam)
        }
      })
        .then(() => {
          this.$Message({
            message: "修改成功，10秒后生效！",
            type: "success"
          });

          this.restorePhase();
        })
        .catch(message => {
          this.$Message({
            message
          });
        });
    },
    initPhase() {
      this.phaseList = [];
      this.phaseSubject = [];
      let parm = {};
      // if(this.search_data.bu != ""){
      //   parm.bu = this.search_data.bu;
      // }
      getPhase(parm)
        .then(data => {
          this.phaseList = data.children;
          //初始化是否急缺和选择和全选
          let _len = this.phaseList.length;
          for (let i = 0; i < _len; i++) {
            this.phaseList[i].harry = false;
            this.phaseList[i].ample = false;
            this.phaseList[i].select = false;
            this.phaseList[i].full = false;
          }
          //根据学段获取科目
          this.getPhaseSubject();
        })
        .catch(() => {});
    },
    getSubjectByBu() {
      this.baseSubject = [];
      let parm = {
        bu: this.search_data.bu
      };
      return getSubject(parm);
    },
    getPhaseSubject() {
      let len = this.phaseList.length;
      this.phaseSubject = [];

      this.chosed_subject_xk = [[], []];

      this.chosed_subject_xk_sub = [];

      let promiseList = [];
      for (let i = 0; i < len; i++) {
        this.chosed_subject_xk[0].push(0);
        this.chosed_subject_xk[1].push(false);
        let parm = {
          bu: this.search_data.bu,
          phase: this.phaseList[i].value
        };
        promiseList.push(getSubject(parm));
      }

      window.chosed_subject_xk = this.chosed_subject_xk;

      Promise.all(promiseList)
        .then(data => {
          let _len = data.length;
          for (let i = 0; i < _len; i++) {
            let _c = data[i].children;
            //初始化是否急缺和选择
            let __len = _c.length;
            for (let j = 0; j < __len; j++) {
              _c[j].harry = false;
              _c[j].ample = false;
              _c[j].select = false;
            }
            this.phaseSubject.push(_c);
          }
        })
        .catch(() => {
          console.log("异常");
        });
    },
    buChange() {
      if (this.entryData.bu != "") {
        this.inputChange();
      }
    },
    inputChange() {
      if (this.entryData.entryName != "") {
        this.$Fetch({
          url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/generateEntryUrl",
          method: "post",
          data: this.entryData
        })
          .then(result => {
            if (result.msgCode == 200) {
              this.entryData.entryUrl = result.data;
            } else {
              this.$Message({
                message: result.msgContent,
                type: "error"
              });
            }
          })
          .catch(message => {
            this.$Message({
              message
            });
          });
      }
    },
    rebuChange() {
      this.reinputChange();
    },
    reentryChange() {
      var type;
      if (this.ntryNameLabel == "兼职") {
        type = 0;
      } else if (this.ntryNameLabel == "公校兼职") {
        type = 1;
      } else if (this.ntryNameLabel == "全职") {
        type = 2;
      } else if (this.ntryNameLabel == "校招全职") {
        type = 3;
      }
      this.reEntryData.entryType = type;
      if (this.reEntryData.entryName != "") {
        this.reinputChange();
      }
    },
    reinputChange() {
      if (this.reEntryData.entryName != "") {
        this.$Fetch({
          url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/generateEntryUrl",
          method: "post",
          data: this.reEntryData
        })
          .then(result => {
            if (result.msgCode == 200) {
              this.reEntryData.entryUrl = result.data;
            } else {
              this.$Message({
                message: result.msgContent,
                type: "error"
              });
            }
          })
          .catch(message => {
            this.$Message({
              message
            });
          });
      }
    },

    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    // 转化时间格式
    transformDate(row, column) {
      return this.$DateTransform(row[column.property]);
    },
    fullTimeInt() {
      // 数据初始化
      this.configTitle = "";
      this.chosed_grade = [0, 0, 0];
      (this.chosed_subject_xk = [[0, 0, 0], [false, false, false]]),
        (this.chosed_subject_xx = [
          [0, 0, 0, 0, 0],
          [false, false, false, false, false]
        ]);
      this.chosed_subject_cz = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [false, false, false, false, false, false, false, false, false, false]
      ];
      this.chosed_subject_gz = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ]
      ];
    },
    // 重命名报名类型-点击确定
    rePostEntryData() {
      this.$Fetch({
        url: "/api/1.0.0/recruitEntryConfig/updateEntryConfig",
        method: "post",
        data: this.reEntryData
      })
        .then(result => {
          if (result.code == 0) {
            this.$Message({
              message: "重命名成功",
              type: "success"
            });
            this.renameVisible = false;
            this.fetchTab();
          } else {
            this.$Message({
              message: result.message,
              type: "error"
            });
          }
        })
        .catch(message => {
          this.$Message({
            message
          });
        });
    },

    // 新增报名类型-点击按钮
    create() {
      this.createtitle = "新增报名类型";
      this.entryData = {
        bu: "1",
        entryName: "",
        entryType: "0",
        entryUrl: ""
      };
      this.entryData.bu = this.search_data.bu;
      if (this.entryData.bu == "3") {
        this.entryData.entryType = "2";
      }
      this.createVisible = true;
    },
    // 新增报名类型-点击确定
    postEntryData() {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/createEntryConfig",
        method: "post",
        data: this.entryData
      })
        .then(result => {
          if (result.msgCode == 200) {
            this.$Message({
              message: "添加成功",
              type: "success"
            });
            this.createVisible = false;
            this.fetchTab();
          } else {
            this.$Message({
              message: result.msgContent,
              type: "error"
            });
          }
        })
        .catch(message => {
          this.$Message({
            message
          });
        });
    },
    // 重命名
    rename(entryName, entryUrl, entryConfigId, entryType, bu) {
      this.createtitle = "修改报名类型";
      if (entryType == 0) {
        this.ntryNameLabel = "兼职";
      } else if (entryType == 1) {
        this.ntryNameLabel = "公校兼职";
      } else if (entryType == 2) {
        this.ntryNameLabel = "全职";
      } else if (entryType == 3) {
        this.ntryNameLabel = "校招全职";
      }

      this.reEntryData = {
        bu,
        entryName,
        entryType,
        entryUrl,
        entryConfigId
      };
      this.renameVisible = true;
    },
    // 修改全职科目
    config(subject, grade) {
      if (grade == 0) {
        this.chosed_subject_xx = Array.from(this.chosed_subject_xx);

        if (subject == "all") {
          if (this.chosed_subject_xx[0].toString() == [1, 1, 1, 1, 1]) {
            this.chosed_subject_xx[0] = [0, 0, 0, 0, 0];
          } else {
            this.chosed_subject_xx[0] = [1, 1, 1, 1, 1];
          }
        } else {
          if (this.chosed_subject_xx[0][subject] == 0) {
            this.chosed_subject_xx[0][subject] = 1;
          } else {
            this.chosed_subject_xx[0][subject] = 0;
          }
        }
      } else if (grade == 1) {
        this.chosed_subject_cz = Array.from(this.chosed_subject_cz);
        if (subject == "all") {
          if (
            this.chosed_subject_cz[0].toString() ==
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          ) {
            this.chosed_subject_cz[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          } else {
            this.chosed_subject_cz[0] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
          }
        } else {
          if (this.chosed_subject_cz[0][subject] == 0) {
            this.chosed_subject_cz[0][subject] = 1;
          } else {
            this.chosed_subject_cz[0][subject] = 0;
          }
        }
      } else if (grade == 2) {
        this.chosed_subject_gz = Array.from(this.chosed_subject_gz);
        if (subject == "all") {
          if (
            this.chosed_subject_gz[0].toString() ==
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          ) {
            this.chosed_subject_gz[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          } else {
            this.chosed_subject_gz[0] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
          }
        } else {
          if (this.chosed_subject_gz[0][subject] == 0) {
            this.chosed_subject_gz[0][subject] = 1;
          } else {
            this.chosed_subject_gz[0][subject] = 0;
          }
        }
      }
    },
    buSelect(val) {
      this.search_data.bu = val;
      this.fetchTab();
      this.initPhase();
    },
    fetchTab() {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/searchEntryConfigList",
        method: "post",
        data: this.search_data
      })
        .then(result => {
          this.table_data = result.data.records;
          this.table_data_total = result.data.total;
          this.tableShow = false;
          this.$sdk.sendEvent({
            eventId: 'click_teacher_recruitEntryConfig_searchEntryConfigList',
            eventParam: this.search_data
          });
        })
        .catch(message => {
          this.$Message({
            message
          });
        });
    }
  },
  mounted() {
    this.fetchTab();
    this.initPhase();
    getSchool()
      .then(data => {
        this.schoolData = data.children;
        for (let i = 0; i < this.schoolData.length; i++) {
          this.schoolData[i].select = false;
        }
      })
      .catch(message => {});
    let url1 =
      "/api/dict/getDictByGroupCode?groupCode=UNIVERSITIES&bu=" +
      this.search_data.bu;
    // 获取兼职学校列表
    this.$Fetch({
      url: url1,
      method: "get"
    })
      .then(result => {
        const data = result.data;

        data.forEach((value, index) => {
          this.school_list.push(value.itemName);
          this.chosed_school.push(0);
        });
        this.ptSchool = false;
      })
      .catch(message => {
        this.$Message({
          message
        });
      });
    // 获取兼职科目列表
    let url2 =
      "/api/dict/getOneDictByGroupCode?groupCode=ALL_SUBJECT&bu" +
      this.search_data.bu;
    this.$Fetch({
      url: url2,
      method: "get"
    })
      .then(result => {
        const data = result.data;
        let pt_subject = [];
        //let chosed_school = [];
        let km = [];
        let km_s = [];
        let km_plus = [];
        data.forEach((value, index) => {
          pt_subject.push(value.itemName);
          km.push(0);
          km_s.push(1);
          km_plus.push(false);
        });

        this.pt_subject = pt_subject; //科目列表
        this.km = km; //科目默认未全选
        this.km_s = km_s; //科目全选
        this.km_plus = km_plus; //科目默认不急缺

        this.ptSubject = false;
      })
      .catch(message => {
        this.$Message({
          message
        });
      });
  }
};
</script>
<style lang="less">
@import "../../../src/styles/config_name/index.less";
input[type="checkbox"] {
  height: 18px;
  width: 18px;
  border-radius: 3px;
  -webkit-appearance: none;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  outline: none;
  vertical-align: middle;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}

input[type="checkbox"]:checked {
  background:#007fff url('./components/r.png') center no-repeat;
  background-size:82%;
}
</style>
