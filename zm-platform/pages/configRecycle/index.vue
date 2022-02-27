<template>
  <div class="context config-person" v-if="checkPermission('tea:recycle:config')">
    <Spin size="large" fix v-if="tableLoading"></Spin>
    <el-table :data="sourceData" style="width:100%">
      <el-table-column prop="timeTypeStr" label="老师类型" width="100" align="center">
      </el-table-column>
      <el-table-column prop="recycleCondition" label="进入回收站的条件" align="center" width="300">
      </el-table-column>
      <el-table-column prop="recycleReason" label="进入回收站的原因" align="center" width="250">
      </el-table-column>
      <el-table-column prop="recycleReleaseDay" label="回收站自动释放的时间" align="center" width="150">
        <template scope="scope">
          <div>{{scope.row.recycleReleaseDay}}天</div>
        </template>
      </el-table-column>
      <el-table-column prop="disabled" label="是否生效" align="center" width="100">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope">
          <el-button type="text" size="small" v-if="checkPermission('tea:recycle:config:edit')" @click="handleEdit(scope.row)">编辑</el-button>
          <!-- <el-button type="text" size="small" @click="showDetail(scope.row.comissionerId)">查看详情</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" v-bind:total="total">
    </el-pagination> -->
    <el-dialog
      title="编辑自动进回收站配置"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <recycle-config ref="recycleConfig" :recycleConfig="recycleConfig" @confirm="recycleConfigConfirm" @cancle="recycleConfigCancle"></recycle-config>
    </el-dialog>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
  import recycleConfig from './recycleConfig'
  import getReleaseConfig from '../../api/action/getReleaseConfig'
  export default {
    components: {
      recycleConfig
    },
    data() {
      return {
        sourceData: [],
        tableLoading: true,
        pageNo: 1,//number
        pageSize: 10,//number
        total: 0,
        dialogVisible: false,
        recycleConfig: {}
      }
    },
    mounted() {
      this.getSourceData()
    },
    methods: {
      checkPermission(permissionName){
        return (this.$store.getters.permissionList || []).indexOf(permissionName)>-1;
      },
      getSourceData() {
        getReleaseConfig()
          .then(res => {
            this.sourceData = res
            this.tableLoading = false
          })
      },
      handleEdit(row) {
        this.dialogVisible = true
        this.recycleConfig = row
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.pageNo = 1
        this.tableLoading = true
        this.getSourceData()
      },
      handleCurrentChange(currentPage) {
        this.pageNo = currentPage
        this.tableLoading = true
        this.getSourceData()
      },
      handleClose() {
        this.dialogVisible = false
      },
      recycleConfigConfirm() {
        this.dialogVisible = false
        this.getSourceData()
      },
      recycleConfigCancle() {
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
