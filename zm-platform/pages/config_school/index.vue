<template>
  <div
    class="context config-school"
    v-if="checkPermission('tea:school:member-config')"
  >
    <div class="context-body">
      <div class="search-wrapper">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
          <el-form-item label="学校名称">
            <el-input
              v-model="searchParam.collegeName"
              @change="checkInputCollegeNameHasShifan"
              placeholder="关键字搜索"
            ></el-input>
          </el-form-item>

          <el-form-item label="学院等级">
            <el-select v-model="searchParam.level" placeholder="请选择">
              <el-option
                v-for="item in collegeLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="师范院校">
            <el-select v-model="searchParam.normalSchool" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              class="search-btn"
              size="small"
              type="primary"
              @click="getCollegesDataList"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-warpper right">
        <el-button
          @click="editSchoolHandle()"
          icon="plus"
          size="small"
          type="normal"
          >新增学校</el-button
        >
      </div>
      <div class="table-wrapper" style="margin-top: 20px">
        <el-table
          :data="schoolList"
          border
          style="width: 100%"
          class="data-table"
        >
          <el-table-column prop="id" label="学校ID" width="100" align="center">
          </el-table-column>

          <el-table-column
            prop="collegeName"
            label="学校名称"
            width="180"
            align="center"
          >
            <template scope="{row}">
              <el-popover
                ref="popover1"
                placement="top-start"
                trigger="hover"
                :content="row.collegeName"
              >
              </el-popover>
              <span
                style="width: 160px; display: block"
                class="ellipsis"
                v-popover:popover1
                >{{ row.collegeName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="学校等级"
            width="80"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="commissionerName"
            label="是否是师范类院校"
            width="120"
            align="center"
          >
            <template scope="{row}">
              {{ row.normalSchool == 1 ? '是' : '否' }}
            </template>
          </el-table-column>

          <el-table-column
            prop="province"
            label="所在地"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="schoolProperty"
            label="学院类别"
            width="80"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="schoolNature"
            label="学院资质"
            width="80"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="ranking"
            label="全国排名"
            width="80"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="mark" label="备注" width="180" align="center">
            <template scope="{row}">
              <el-popover
                ref="popover1"
                placement="top-start"
                trigger="hover"
                :content="row.mark"
              >
              </el-popover>
              <span
                style="width: 160px; display: block"
                class="ellipsis"
                v-popover:popover1
                >{{ row.mark }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="updatedBy"
            label="更新人"
            width="120"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="updatedAt"
            label="更新时间"
            width="160"
            align="center"
          >
            <template scope="{row}">
              {{ row.updatedAt | dateTransform }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="commissionerName"
            label="操作"
            align="center"
          >
            <template scope="{row}">
              <el-button type="text" size="small" @click="editSchoolHandle(row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParam.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchParam.pageSize"
          layout="total,sizes, prev, pager, next"
          v-bind:total="tableDataTotal"
        >
        </el-pagination>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog
      :white="true"
      :title="isAdd ? '新增学校' : '编辑学校'"
      v-model="dialogVisible"
      width="30%"
    >
      <el-form
        label-width="100px"
        :model="editParams"
        class="form-inline"
        ref="editForm"
        :rules="rules"
        v-if="dialogVisible"
      >
        <el-form-item label="学校名称" prop="collegeName">
          <el-input
            v-model="editParams.collegeName"
            placeholder="请输入学校名称"
            style="width: 192px"
            :maxlength="50"
          ></el-input>
          <!-- <el-autocomplete
            style="width: 192px"
            v-model="editParams.collegeName"
            :fetch-suggestions="queryCollegeSearchAsync"
            placeholder="请输入学校名称"
            @select="selectCollegeHandle"
          ></el-autocomplete> -->
        </el-form-item>

        <el-form-item label="学院等级" prop="level">
          <el-select v-model="editParams.level" placeholder="请选择">
            <el-option
              v-for="item in collegeLevelOptionsEdit"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="师范院校" prop="normalSchool" required>
          <!-- <el-select v-model="editParams.normalSchool" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select> -->
          <el-radio-group v-model="editParams.normalSchool">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="学校所在地" prop="province">
          <el-select
            filterable
            v-model="editParams.province"
            placeholder="请选择"
          >
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院类别">
          <el-select
            filterable
            v-model="editParams.schoolProperty"
            placeholder="请选择"
          >
            <el-option
              v-for="item in schoolPropertyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院资质">
          <el-select
            filterable
            v-model="editParams.schoolNature"
            placeholder="请选择"
          >
            <el-option
              v-for="item in schoolNatureOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="全国排名">
          <el-input
            :maxlength="6"
            style="width: 186px"
            v-model.number="editParams.ranking"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            :maxlength="50"
            v-model="editParams.remark"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <div v-else style="font-size: 32px; text-align: center; line-height: 80vh">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import {
  queryColleges,
  saveCollege,
  queryCollegesByName,
  getProvinces
} from '../../api/select/schoolConfig';
export default {
  name: 'config_school',
  data() {
    return {
      searchParam: {
        collegeName: '',
        level: '',
        normalSchool: '',
        pageNo: 1,
        pageSize: 10
      },
      collegeLevelOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '985',
          label: '985'
        },
        {
          value: '211',
          label: '211'
        },
        {
          value: '一本',
          label: '一本'
        },
        {
          value: '二本A',
          label: '二本A'
        },
        {
          value: '二本B',
          label: '二本B'
        },
        {
          value: '三本',
          label: '三本'
        },
        {
          value: '专科',
          label: '专科'
        }
      ],
      collegeLevelOptionsEdit: [
        {
          value: '985',
          label: '985'
        },
        {
          value: '211',
          label: '211'
        },
        {
          value: '一本',
          label: '一本'
        },
        {
          value: '二本A',
          label: '二本A'
        },
        {
          value: '二本B',
          label: '二本B'
        },
        {
          value: '三本',
          label: '三本'
        },
        {
          value: '专科',
          label: '专科'
        }
      ],
      schoolNatureOptions: [
        {
          value: '公办',
          label: '公办'
        },
        {
          value: '民办',
          label: '民办'
        }
      ],
      schoolPropertyOptions: [
        {
          value: '综合类',
          label: '综合类'
        },
        {
          value: '理工类',
          label: '理工类'
        },
        {
          value: '师范类',
          label: '师范类'
        },
        {
          value: '农林类',
          label: '农林类'
        },
        {
          value: '政法类',
          label: '政法类'
        },
        {
          value: '医药类',
          label: '医药类'
        },

        {
          value: '财经类',
          label: '财经类'
        },
        {
          value: '民族类',
          label: '民族类'
        },

        {
          value: '语言类',
          label: '语言类'
        },
        {
          value: '艺术类',
          label: '艺术类'
        },
        {
          value: '体育类',
          label: '体育类'
        },
        {
          value: '军事类',
          label: '军事类'
        },
        {
          value: '旅游类',
          label: '旅游类'
        }
      ],
      schoolList: [],
      tableDataTotal: 0,
      dialogVisible: false, // 新增，编辑
      isAdd: false, //是否是新增
      editParams: {
        collegeName: '',
        level: '',
        normalSchool: 0,
        province: '',
        remark: '',
        id: null,
        ranking: null, // 学校排名
        schoolNature: '', // 学院资质
        schoolProperty: '' // 学院类别
      }, //编辑，新增数据参数
      rules: {
        collegeName: [
          { required: true, message: '请输入院校名称', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择学院等级', trigger: 'change' }
        ],
        province: [
          { required: true, message: '请选择学院所在地', trigger: 'change' }
        ]
      },
      provinceList: []
    };
  },
  mounted() {
    this.getCollegesDataList();
    // 获取省份
    this.getProvincesListHandle();
  },
  watch: {
    'editParams.collegeName': function (val) {
      // 新增学校dialog 根据输入的师范
      let has = val.indexOf('师范');
      this.editParams.normalSchool = has > -1 ? 1 : 0;
      // hack，控制字符串长度
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.editParams.collegeName = this.editParams.collegeName.slice(0, 50);
      }, 200);
    }
  },
  methods: {
    checkInputCollegeNameHasShifan() {
      let has = this.searchParam.collegeName.indexOf('师范');
      this.searchParam.normalSchool = has > -1 ? 1 : '';
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    getCollegesDataList() {
      // 获取院校列表
      queryColleges(this.searchParam).then((res) => {
        if (res.code == 0) {
          let { data } = res;
          this.schoolList = data.list;
          this.tableDataTotal = data.total;
        }
      });
    },
    onSubmit() {},
    handleSizeChange(pageSize) {
      this.searchParam.pageSize = pageSize;
      this.searchParam.pageNo = 1;
      this.getCollegesDataList();
    },
    handleCurrentChange(currentPage) {
      this.searchParam.pageNo = currentPage;
      this.getCollegesDataList();
    },
    editSchoolHandle(row) {
      this.dialogVisible = true;
      if (row) {
        // 编辑状态
        this.isAdd = false;
        let {
          collegeName,
          level,
          normalSchool,
          province,
          mark,
          id,
          ranking,
          schoolNature,
          schoolProperty
        } = row;
        this.editParams = {
          collegeName,
          level,
          normalSchool,
          province,
          remark: mark,
          id,
          ranking,
          schoolNature,
          schoolProperty
        };
      } else {
        this.isAdd = true;
        this.editParams = {
          collegeName: '',
          level: '',
          normalSchool: 0,
          province: '',
          remark: '',
          id: null,
          ranking: '',
          schoolNature: '',
          schoolProperty: ''
        };
      }
    },
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          saveCollege(this.editParams)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.getCollegesDataList();
                this.dialogVisible = false;
              } else {
              }
            })
            .catch((err) => {
              this.$message({
                message: err,
                type: 'error'
              });
            });
        } else {
          return false;
        }
      });
    },
    queryCollegeSearchAsync(queryString, cb) {
      queryCollegesByName(queryString).then((res) => {
        let { data } = res;
        let d = data.map((item) => {
          return {
            value: item.collegeName,
            label: item.collegeName,
            ...item
          };
        });
        cb(d);
      });
    },
    selectCollegeHandle(item) {
      if (item.ranking) {
        this.editParams.ranking = item.ranking;
      }
    },
    getProvincesListHandle() {
      getProvinces().then((res) => {
        if (res.code == 0) {
          let { data } = res;
          this.provinceList = data.map((item) => {
            return {
              value: item,
              label: item
            };
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.right {
  display: flex;
  align-items: center;
  margin-top: 5px;
  justify-content: flex-end;
}

.form-inline {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
