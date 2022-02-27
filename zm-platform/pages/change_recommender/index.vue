<template>
  <div class="change-recommender">
    <div class="search-form">
      <el-form>
        <el-form-item label="讲师">
          <el-input v-model="searchParam.mobileOrName" @keyup.enter.native="search" placeholder="支持姓名/手机号"></el-input>
          <button class="btn" @click.stop="search()">查询</button>
          <router-link class="btn" tag="button" to="/recommender_list" >查看变更记录</router-link>
        </el-form-item>
      </el-form>
    </div>
    <div class="notify" v-if="!flag">
      <div>请输入讲师姓名或手机号，查找后变更推荐人</div>
    </div>
    <div v-else>
      <el-table
        :data="tableData"
        style="width: 100%"
        border>
        <el-table-column
          v-for="(item,index) in tableTitle"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width">
        </el-table-column>
        <el-table-column
          label="操作"
          width="160px"
          align="center">
          <template scope="scope">
            <el-button
              v-if="scope.row.canModify"
              size="small"
              type="text"
              @click.stop="handleChangeRecommender(scope.row)">
              变更推荐人
            </el-button>
            <el-button
              v-else
              size="small"
              type="text"
              disabled>
              不可变更
            </el-button>
            <el-button
              size="small"
              type="text"
              :disabled="!scope.row.channelId"
              @click.stop="handleConnectedActivities(scope.row)">
              查看关联活动
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :current-page="searchParam.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchParam.pageSize"
        layout="sizes,prev, pager, next"
        @size-change="sizeChange"
        @current-change="currentChange"
        :total="pageTotal">
      </el-pagination> -->
      <el-dialog
        title="选择新的推荐人"
        v-model="recommenderDialog"
        width="30%"
      >
        <edit-recommender ref="emitRecommender" :recommender="recommender"/>
        <div class="btn-group">
          <el-button
            class="btn"
            @click.stop="handleCancel"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            class="btn"
            @click="handleSubmit"
          >
            提交
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="查看活动"
        v-model="connectedActivitiesDialog"
        width="30%"
      >
        <connected-activities :tableData="activitiesData"/>
        <div class="btn-group">
          <el-button
            type="primary"
            class="btn"
            @click="handleActivitiesCancel"
          >
            关闭
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import editRecommender from './editRecommender'
  import connectedActivities from './connectedActivities'
  import { getNotAttrWithEmpty } from "../../../src/utils/assist";
  const tableTitle = [
    {prop: "teaName", label: "讲师姓名", width: "80px", align: 'center'},
    {prop: "teaMobile", label: "讲师手机号", width: "100px", align: 'center'},
    {prop: "teaStatus", label: "讲师状态", width: "", align: 'center'},
    {prop: "channelName", label: "渠道名称", width: "", align: 'center'},
    {prop: "channelType", label: "渠道类型", width: "", align: 'center'},
    {prop: "channelMobile", label: "渠道手机号", width: "", align: 'center'},
    {prop: "registerTime", label: "报名时间", width: "", align: 'center'},
    {prop: "entryTime", label: "入库/入职时间", width: "", align: 'center'},
    // {prop: "channelActivityName", label: "渠道活动名称", width: "", align: 'center'},
    // {prop: "rewardDistributeStatus", label: "奖励发放状态", width: "", align: 'center'},
  ]
  export default {
    name: 'changeRecommender',
    data() {
      return {
        tableTitle: [...tableTitle],
        tableData: [],
        pageTotal: 0,
        searchParam: {
          // pageNo: 1,
          // pageSize: 10,
          mobileOrName: ''
        },
        flag: false,
        recommenderDialog: false,
        connectedActivitiesDialog: false,
        activitiesData: [],
        recommender: {}
      }
    },
    components: {
      editRecommender,
      connectedActivities
    },
    methods: {
      checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
      },
      search() {
        this.getTableData()
      },
      getTableData() {
        if (!this.searchParam.mobileOrName) {
          this.$Message({
            type: 'warning',
            message: '请输入讲师姓名/手机号'
          })
          return
        }
        this.$Fetch({
          url: "/api/zm-teacher-recruit-web/api/change-recommender/query/tea-recommend",
          data: getNotAttrWithEmpty({ ...this.searchParam }),
          method: "post"
        })
          .then(res => {
            const {code, data} = res
            if (code === 200) {
              this.tableData = data
              this.flag = true
            }
          })
      },
      handleChangeRecommender(row) {
        if (!this.checkPermission('changeRecommender:edit')) {
          this.$Message({
            type: 'warning',
            message: '暂无变更推荐人权限'
          })
          return
        }
        this.recommender = row
        this.recommenderDialog = true
      },
      handleCancel() {
        this.recommenderDialog = false
      },
      handleSubmit() {
        this.$refs.emitRecommender.handleSubmitForm(() => {
          this.recommenderDialog = false
          this.getTableData()
        })
      },
      handleConnectedActivities(row) {
        const {channelId, teaUserId} = row
        this.$Fetch({
          url: "/api/zm-teacher-recruit-web/api/change-recommender/query/activity-record",
          data: {channelId, teaUserId},
          method: "post"
        })
          .then(res => {
            const {code, data} = res
            if (code === 200) {
              this.activitiesData = data
              this.connectedActivitiesDialog = true
            }
          })
      },
      handleActivitiesCancel() {
        this.connectedActivitiesDialog = false
      }
    },
  }
</script>

<style lang="less" scoped>
  .change-recommender{
    min-height: 560px;
    padding: 20px;
    background-color: #fff;
    .search-form{
      .btn{
        width: 90px;
        height: 30px;
        line-height: 30px;
        background-color: #fff;
        outline: none;
        border: 1px solid #409eff;
        border-radius: 5px;
        color: #606266;
        margin-left: 20px;
        &:hover{
          cursor: pointer;
        }
      }
    }
    .notify{
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
    .btn-group{
      margin: 20px 0;
      text-align: right;
      .btn{
        border-radius: 5px;
      }
    }
  }

</style>
