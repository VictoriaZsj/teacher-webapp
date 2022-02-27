<template>
  <div class="record-container">
    <el-form
      class="record-seach-form"
      label-width="100px"
      :model="ruleForm"
      ref="ruleForm"
      :inline="true"
    >
      <el-form-item label="院校等级" >
          <el-select v-model="ruleForm.schoolLevels"  multiple clearable placeholder="请选择">
              <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="最高学历">
        <el-select v-model="ruleForm.edu" clearable placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否毕业">
        <el-select v-model="ruleForm.graduation" clearable placeholder="请选择">
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教资情况">
        <el-select
          v-model="ruleForm.certificateSituation"
          clearable
          style="min-height: 33px"
        >
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投递邮箱">
        <el-input
          clearable
          v-model="ruleForm.deliveryEmailAccount"
          placeholder="输入接收的邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-select v-model="ruleForm.compareType" clearable style="width: 60px">
          <el-option
            v-for="item in options6"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        -
        <el-input
          v-model.number="ruleForm.age"
          style="width: 120px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="老师">
        <el-input
          v-model="ruleForm.teaNameOrMobile"
          placeholder="支持姓名/手机号查询"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="跟进结果">
        <el-select v-model="ruleForm.followResult" clearable>
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="失败/淘汰原因">
        <el-input
          v-model="ruleForm.failedReason"
          clearable
          placeholder="失败/淘汰关键字查询"
        ></el-input>
      </el-form-item>
      <el-form-item label="投递时间">
        <el-date-picker
          v-model="followTime"
          clearable
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="chooseActDate"
        >
        </el-date-picker>
      </el-form-item>
      <br />
        <el-button class="search-btn" type="normal" size="small" @click="search">搜索</el-button>

    </el-form>
    <br />
    <br />
    <br />
    <div>
      批量选择：
      <el-radio-group v-model="followObj.top" @change="handleMulti">
        <el-radio :label="500">前500条</el-radio>
        <el-radio :label="1000">前1000条</el-radio>
        <el-radio :label="2000">前2000条</el-radio>
      </el-radio-group>

      <el-button
        style="margin-left: 20px"
        size="small"
        type="text"
        @click="followObj.top = ''"
        >取消选择</el-button
      >
      <div style="float: right">
        <el-button
          type="text"
          size="small"
          @click="handleFollow_func"
          v-show="checkPermission('tea:resume:followUpBtn')"
          >批量跟进</el-button
        >
        <el-button
          type="text"
          size="small"
          @click="uploadDia = true"
          v-show="checkPermission('tea:resume:uploadBtn')"
          >导出</el-button
        >
        <el-button
          type="text"
          size="small"
          @click="uploadListDia = true"
          v-show="checkPermission('tea:resume:uploadBtn')"
          >查看导出结果</el-button
        >
      </div>
    </div>

    <br />
    <el-table
      ref="multipleTable"
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column
        align="center"
        :width="item.width ? item.width : '120'"
        :label="item.label"
        :key="index"
        v-for="(item, index) in tableConfig"
      >
        <template scope="prop">
          <el-button
            type="text"
            v-if="item.prop == 'name'"
            size="small"
            @click="openImg(prop.row.ossAttachmentUrl)"
            >{{ prop.row.name }}</el-button
          >
          <span v-else>{{ prop.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="100">
        <template scope="scope">
          <el-button
            @click="handleFollow(scope.row, 'PASS', 'singlePass')"
            type="text"
            size="small"
            v-show="scope.row.followerResult != 'PASS'"
            >通过</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleFollow(scope.row, 'ELIMINATE', 'singleEliminate')"
            v-show="scope.row.followerResult != 'PASS'"
            >淘汰</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next"
    >
    </el-pagination>

    <el-dialog :title="title" v-model="followObjVisible">
      <el-form
        :model="followObj"
        ref="diaForm"
        label-width="150px"
        :rules="rule"
      >
        <el-form-item
          label="跟进结果："
          prop="followResult"
          v-if="way != 'singleEliminate' && way != 'singlePass'"
        >
          <el-radio-group v-model="followObj.followResult">
            <el-radio label="PASS">通过</el-radio>
            <el-radio label="ELIMINATE">淘汰</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="指定推荐人："
          required
          prop="id"
          v-if="way == 'singlePass' || followObj.followResult == 'PASS'"
        >
          <el-select
            style="width: 40%"
            v-model="followObj.id"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="渠道姓名或手机号查询"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :label="item.label"
              :value="item.value"
              @click.native='getType(item.type)'
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label=" 淘汰原因："
          prop="failedReason"
          v-if="followObj.followResult == 'ELIMINATE'"
        >
          <el-select v-model="followObj.failedReason">
            <el-option
              v-for="item in options7"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" v-if="way != 'singlePass'">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            style="width: 60%"
            v-model="followObj.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            followObjVisible = false;
            $refs['multipleTable'].clearSelection();
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="hanldeFollowSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导出" v-model="uploadDia" width="30%">
      <span
        >注意：由于数据量较大，所以下载速度会比较慢，点击【导出】后，系统会自动下载，下载完成后，在列表
        页点击【查看导出结果】即可下载已导出的表格</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDia = false">关 闭</el-button>
        <el-button type="primary" @click="goUpload">后台下载</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导出列表" v-model="uploadListDia" width="30%">
      <el-table ref="multipleTable" :data="tableData_load" border>
        <el-table-column align="center" prop="createTime" label="导出时间">
        </el-table-column>
        <el-table-column align="center" prop="exportName" label="导出表格名称">
        </el-table-column>
        <el-table-column align="center" prop="exportState" label="下载状态">
          <template scope="scope">
            {{ scope.row.exportState == 'EXPORT_SUCCESS' ? '成功' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template scope="scope">
            <el-button
              @click="handleUpload(scope.row.exportFileUrl)"
              type="text"
              size="small"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="total_load"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="pageNo_load"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize_load"
        layout="sizes, prev, pager, next"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDia = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { newRegularControllerDownEcontract } from '../../api/select/electronicContract';
import { formatDate } from '../../../src/components/date-picker/util.js';

import {
  options1,
  options2,
  options3,
  options4,
  options5,
  options6,
  options7,
  tableConfig
} from './optionsConfig';
const start = new Date();
const end = new Date();

import debounce2 from 'lodash';

export default {
  computed: {
    permission: function () {
      return this.$store.getters.permission;
    }
  },
  data() {
    return {
      debounceFn: null,
      value7: '',
      today: new Date(),
      followObjSinglePassVisible: false,
      list: [],
      loading: false,
      followTime: [],
      uploadListDia: false,
      uploadDia: false,
      way: '',
      title: '',
      followObjVisible: false,
      total: 0,
      total_load: 0,
      tableConfig,
      tableData: [],
      tableData_load: [],
      options1,
      options2,
      options3,
      options4,
      options5,
      options6,
      options7,
      pageNo: 1,
      pageSize: 10,
      pageNo_load: 1,
      pageSize_load: 10,
      ruleForm: {
        age: '',
        certificateSituation: '',
        compareType: '',
        deliveryEmailAccount: '',
        deliveryEndTime: '',
        deliveryStartTime: '',
        edu: '',
        failedReason: '',
        followResult: '未处理',
        graduation: '',

        schoolLevels: [],
        teaMobile: '',
        teaName: '',
        teaNameOrMobile: ''
      },
      followObj: {
        id:'',
        channelId:'',
        top: null,
        failedReason: '',
        followResult: '',
        accessEmailMessageIds: [],
        commissionerUserId: '',
        remark: '',
        queryParams: {},
      },
      type:'',
      multipleSelection: [],
      rule: {
        followResult: [
          { required: true, message: '请选择跟进结果', trigger: 'blur' }
        ],
        failedReason: [
          { required: true, message: '请选择淘汰原因', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      last: '',
      interval: null
    };
  },
  mounted() {
    this.search();
    this.getEdu();
    // this.debounceFn=debounce(this.func,2000)
  },
  watch: {
    uploadListDia(val) {
      if (val) {
        this.getUploadList();
        this.interval = setInterval(() => {
          this.getUploadList();
        }, 5000);
      } else {
        clearInterval(this.interval);
      }
    },
    followObjVisible(val) {
      this.followObj.commissionerUserId = '';
      this.followObj.channelId = '';

      if (val) {
        this.$nextTick(() => {
          this.$refs['diaForm'].resetFields();
        });
      }
    }
  },
  methods: {
    getType(type){
      this.type=type
    },
    func(query) {
      let teaName = '';
      let mobile = null;
      if (isNaN(Number(query))) {
        teaName = query;
      } else {
        mobile = Number(query);
      }
      this.$Fetch({
        url: '/api/zm-teacher-recruit-web/api/agentMember/searchHasUserId',
        method: 'post',
        data: {
          teaName: teaName,
          mobile: mobile
        }
      })
        .then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 200 && data.records) {
            this.loading = false;
            this.list = data.records.map((item) => {
              return {
                value: item.userId?item.userId.toString():item.id.toString(),
                label: item.teaName + '(' + item.mobile + ')',
                type: item.userId?'commissionerUserId':'channelId'
              };
            });
            this.loading = false;
          } else {
            this.list = [];
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    },
    remoteMethod(query) {
      this.list = [];
      if (query !== '') {
        this.loading = true;
        debounce2(this.func(query), 2000);
      } else {
        return;
      }
    },

    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    handleMulti(val) {},
    handleUpload(url) {
      window.open(url);
    },
    goUpload() {
      this.$Fetch({
        url: '/api/zmbiz-clue-admin/api/resumeDelivery/asyncExport',
        method: 'post',
        data: Object.assign(this.followObj, this.ruleForm)
      }).then((res) => {
        this.$Message.success(res.data);
        this.uploadDia = false;
      });
    },
    getUploadList() {
      this.uploadDia = false;
      this.$Fetch({
        url: '/api/zmbiz-clue-admin/api/resumeDelivery/exportRecords',
        method: 'post',
        data: {
          pageNo: this.pageNo_load,
          pageSize: this.pageSize_load
        }
      }).then((res) => {
        this.tableData_load = res.data.list;
        this.total_load = res.data.total;
      });
    },
    getEdu() {
      this.$Fetch({
        url: '/api/cascade/dict/service',
        method: 'post',
        data: [{ dictCode: 'TEACHER_DEGREE' }]
      }).then((result) => {
        const data = result.data;
        const code = result.code;
        const message = result.message;
        if (code == 0) {
          this.options2 = data.children;
        } else {
          // reject(message);
        }
      });
    },
    openImg(url) {
      window.open(url);
    },
    handleSelectionChange(val) {
      this.followObj.accessEmailMessageIds = val.map((i) => {
        return i.id;
      });
    },
    search() {
      this.pageNo = 1;
      this.getList();
    },
    chooseActDate() {
      if (this.followTime[0] == null) {
        this.ruleForm.deliveryStartTime = '';
        this.ruleForm.deliveryEndTime = '';
      } else {
        let sDate = new Date(this.followTime[0]).getTime();
        let eDate = new Date(this.followTime[1]).getTime();
        this.ruleForm.deliveryStartTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.ruleForm.deliveryEndTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    getList() {
      if (this.ruleForm.schoolLevels == '') {
        this.ruleForm.schoolLevels = [];
      }
      this.$Fetch({
        url:
          '/api/zmbiz-clue-admin/api/resumeDelivery/getResumeDeliveryRecords',
        method: 'post',
        data: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          ...this.ruleForm
        }
      }).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search();
    },
    handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
      this.getList();
    },
    handleSizeChange2(pageSize) {
      this.pageSize_load = pageSize;
      this.pageNo_load = 1;
      this.getUploadList();
    },
    handleCurrentChange2(currentPage) {
      this.pageNo_load = currentPage;
      this.getUploadList();
    },
    //批量跟进
    handleFollow_func() {
      this.way = 'multi';

      if (this.followObj.accessEmailMessageIds.length || this.followObj.top) {
        this.followObjVisible = true;
        this.title = '批量跟进结果';
      } else {
        this.$Message.warning('至少选中一位老师');
      }
    },
    //单个跟进/淘汰
    handleFollow(row, type, way) {
      this.$refs['multipleTable'].clearSelection();
      this.way = way;
      if (this.way == 'singlePass' || this.way == 'singleEliminate') {
        this.followObj.top = '';
      }
      this.followObj.followResult = type;
      this.followObj.accessEmailMessageIds = [row.id];
      if (this.way == 'singleEliminate') {
        this.followObjVisible = true;
        this.title = '单个淘汰';
      } else if (this.way == 'singlePass') {
        this.followObjVisible = true;
        this.title = '单个通过';
      } else {
        this.hanldeFollowSubmit();
      }
    },
    hanldeFollowSubmit() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          this.handleSubmit();
        }
      });
    },
    handleSubmit() {
      if (this.followObj.top) {
        this.followObj.queryParams = {
          ...this.ruleForm
        };
      } else {
        this.followObj.queryParams = {};
      }

      if(this.type=='channelId'){
        this.followObj.channelId=this.followObj.id;
        this.followObj.commissionerUserId=''
      }else if(this.type=='commissionerUserId'){
        this.followObj.channelId='';
        this.followObj.commissionerUserId=this.followObj.id
      }
      delete this.followObj.id
      this.$Fetch({
        url: '/api/zmbiz-clue-admin/api/resumeDelivery/batchOperateResumeMsg',
        method: 'post',
        data: this.followObj
      })
        .then((res) => {
          if (res.msgCode != 200) {
            this.$Message.error(res.msgContent);
          } else {
            this.$Message.success(res.msgContent);
          }
          this.followObjVisible = false;
          this.reset();
          this.$refs['multipleTable'].clearSelection();
          this.getList();
        })
        .catch((err) => {
          this.reset();
          console.log('err', err);
        });
    },
    reset() {
      this.followObj = {
        failedReason: '',
        followResult: '',
        accessEmailMessageIds: [],
        remark: '',
        top: null
      };
    }
  }
};
</script>

<style lang="less">
.record-container {
  .el-date-editor .el-range-separator {
    line-height: 22px;
  }
  .record-seach-form {
    .el-form-item__content{
      min-width: 192px;
    }
    .el-date-editor--daterange.el-input {
      width: 192px;
    }
  }

  min-height: 100%;
  background-color: #ffffff;
  padding: 10px 20px;

  .el-date-table td.in-range {
    background: #ffffff;
  }

  .el-dialog__body {
    background: #ffffff;
  }
  .el-dialog__footer {
    background: #ffffff;
  }

  .el-input__inner {
    height: 30px !important;
  }
}
</style>
