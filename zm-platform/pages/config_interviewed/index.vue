<template>
  <div class="config-interviewed" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="标签名">
        <el-input
          v-model="search_data.name"
          placeholder="标签关键字搜索"
        ></el-input>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select
          v-model="search_data.status"
          clearable
          placeholder="请选择上架状态"
        >
          <el-option
            v-for="(item, index) in invokeType"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签类型">
        <el-select
          v-model="search_data.limitType"
          clearable
          placeholder="请选择标签类型"
        >
          <el-option
            v-for="(item, index) in tagTypeOpetion"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="search-btn" size="small" @click="handleReset"
          >重置</el-button
        >
        <el-button
          class="search-btn"
          icon="search"
          type="primary"
          size="small"
          @click="getTableData"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <div class="btn-warpper">
        <el-button
          v-if="permissionList.indexOf('tea:config:interviewed:add') !== -1"
          @click="handleEditDialog(false)"
          icon="el-icon-plus"
          size="small"
          type="normal"
          class="create-btn"
          ><icon class="el-icon-plus icon-fontSize"></icon>新增配置</el-button
        >
      </div>
      <el-table :data="table_data" style="width: 100%">
        <el-table-column prop="name" align="center" label="标签名" width="120">
          <template scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.name"
              :disabled="scope.row.name && scope.row.name.length < 16"
              placement="top"
            >
              <div
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 120px;
                "
              >
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="limitType" align="center" label="标签类型" width="80px">
          <template scope="scope">
            {{ scope.row.limitType | tagFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="limitDesc" align="center" label="标签描述" width="120px">
          <template scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.limitDesc"
              :disabled="
                scope.row.limitDesc &&
                  scope.row.limitDesc.length < 12
              "
              placement="top"
            >
              <div
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 120px;
                "
              >
                {{ scope.row.limitDesc }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="timeConfigList"
          align="center"
          label="时间段/上限"
          width="120"
        >
          <template scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.timeConfigListStr"
              :disabled="
                scope.row.timeConfigListStr &&
                  scope.row.timeConfigListStr.length < 12
              "
              placement="top"
            >
              <div
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 120px;
                "
              >
                {{ scope.row.timeConfigListStr }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="effectTime"
          align="center"
          label="生效时间"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="上架状态"
          width="60"
        >
          <template scope="scope">
            {{ scope.row.status | statueFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          align="center"
          label="更新时间"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="updatedBy" align="center" label="更新人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="createdBy"
          align="center"
          label="创建人"
        ></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="180">
          <template scope="scope">
            <div>
              <el-button
                size="small"
                @click="handleChangeStatus(scope.row.id)"
                v-if="
                  permissionList.indexOf('tea:config:interviewed:invoke') !==
                    -1 && scope.row.status === 0
                "
                type="text"
                >上架</el-button
              >
              <el-button
                size="small"
                @click="handleChangeStatus(scope.row.id)"
                v-if="
                  permissionList.indexOf('tea:config:interviewed:invoke') !==
                    -1 && scope.row.status === 1
                "
                type="text"
                >下架</el-button
              >
              <el-button
                size="small"
                @click="handleEditDialog(scope.row.id)"
                v-if="
                  permissionList.indexOf('tea:config:interviewed:edit') !==
                    -1 && scope.row.status !== 1
                "
                type="text"
                >编辑</el-button
              >
              <el-button
                size="small"
                @click="handleDelete(scope.row.id)"
                v-if="
                  permissionList.indexOf('tea:config:interviewed:delete') !==
                    -1 && scope.row.status !== 1
                "
                type="text"
                >删除</el-button
              >
              <el-button
                size="small"
                @click="handleDetailDialog(scope.row.id)"
                type="text"
                >查看详情</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search_data.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="search_data.pageSize"
        layout="sizes, prev, pager, next"
        v-bind:total="table_data_total"
      ></el-pagination>
    </div>
    <!-- 新增/编辑 -->
    <edit
      ref="editDlialog"
      @submit="handleSubmit"
      :tagTypeOpetion="tagTypeOpetion"
    ></edit>
    <!-- 新增/编辑 -->
    <detail ref="detailDlialog" :tagTypeOpetion="tagTypeOpetion"></detail>
  </div>
  <div v-else style="font-size: 32px; text-align: center; line-height: 80vh">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import icon from '../../../src/components/icon/icon.vue';
import edit from './dialog/edit.vue';
import detail from './dialog/detail.vue';

import {
  getAppointLimitPage,
  appointLimitChangeStatus,
  appointLimitDelete,
  appointLimitSave,
} from '../../api/teacherConfig';

export default {
  components: { icon, edit, detail },
  data() {
    return {
      invokeType: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '已上架',
          value: 1,
        },
        {
          label: '已下架',
          value: 0,
        },
      ],
      tagTypeOpetion: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '约面上限配置',
          value: 0,
        },
        {
          label: '约培上限配置',
          value: 1,
        },
      ],
      search_data: {
        limitType: '',
        name: '',
        status: '',
        pageNo: 1,
        pageSize: 10,
      },
      table_data: [],
      table_data_total: 0,
      isChangeStatus: false,
      tableLoading: false,
      preview: {
        visible: false,
        url: '',
      },
      audit: {
        visible: false,
        applyIds: [],
        auditState: '',
        refuseReason: '',
        title: '',
        isSubmit: false,
      },
    };
  },
  filters: {
    statueFilter(val) {
      if (val === 0) {
        return '已下架';
      }
      if (val === 1) {
        return '已上架';
      }
      return '';
    },
    tagFilter(val) {
      if (val === 0) {
        return '约面上限配置';
      }
      if (val === 1) {
        return '约培上限配置';
      }
      return '';
    },
  },
  methods: {
    // 查询
    getTableData() {
      this.tableLoading = true;
      getAppointLimitPage(this.search_data)
        .then(result => {
          const { data, code, message } = result.data;
          if (code === '0') {
            this.table_data = data.list;
            this.table_data_total = data.total;
            this.table_data.forEach(item => {
              item.timeConfigListStr = item.timeConfigList.reduce(
                (total, current, currentIndex, arr) => {
                  return (total += `${total?';':''} ${current.timeFrom}~${current.timeTo}(${current.limitCount})`);
                },
                ''
              );
            });
          } else {
            this.$Message({
              message,
            });
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    handleDelete(id) {
      this.$MessageBox
        .confirm(`确定删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.deleteFun({ id });
        });
    },
    deleteFun(params) {
      appointLimitDelete(params).then(res => {
        if (res.data.code === '0') {
          this.$message.success('删除成功');
          this.getTableData();
        } else {
          this.$message.warning(res.data.message);
        }
      });
    },
    handleChangeStatus(id) {
      this.changeStatus({ id });
    },
    changeStatus(params) {
      appointLimitChangeStatus(params)
        .then(res => {
          this.isChangeStatus = false;
          if (res.data.code === '0') {
            this.$message.success('操作成功');
            this.getTableData();
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch(() => {
          this.isChangeStatus = false;
        });
    },
    // 新增/编辑
    handleEditDialog(id) {
      this.$refs.editDlialog.open(id);
    },
    // 保存
    handleSubmit(params, callback) {
      appointLimitSave(params).then(res => {
        if (res.data.code === '0') {
          callback(false);
          this.getTableData();
        } else {
          this.$message.warning(res.data.message);
        }
      });
    },
    handleDetailDialog(id) {
      this.$refs.detailDlialog.open(id);
    },
    handleSizeChange(pageSize) {
      this.search_data.pageSize = pageSize;
      this.search_data.pageNo = 1;
      this.getTableData();
    },
    handleCurrentChange(currentPage) {
      this.search_data.pageNo = currentPage;
      this.getTableData();
    },
    handleReset() {
      this.search_data = {
        limitType: '',
        name: '',
        status: '',
        pageNo: 1,
        pageSize: 10,
      };
    },
  },
  computed: {
    permission: function() {
      return this.$store.getters.permission;
    },
    permissionList: function() {
      return this.$store.getters.permissionList || [];
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>
<style lang="less">
.config-interviewed {
  .context-body {
    .attachments {
      width: 120px;
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      .attachments-item {
        cursor: pointer;
        color: #007fff;
        &:hover {
          color: #4db3ff;
        }
      }
    }
    .btn-warpper {
      .icon-fontSize {
        margin-right: 6px;
      }
    }
  }
}
</style>
