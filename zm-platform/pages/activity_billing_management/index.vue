<template>
  <div class="activity-billing-management">
    <div class="search-form">
      <el-form>
        <el-form-item label="规则名称">
          <el-input v-model="searchParam.ruleName" @keyup.enter.native="search" placeholder="请输入规则名称"></el-input>
          <el-button size="small" type="normal" class="search-btn" @click.stop="addRule">新增</el-button>
          <el-button size="small" type="normal" class="search-btn" @click.stop="search(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <br>
    <div>共{{pageTotal}}个奖励规则</div>
    <br>
    <el-table :data="tableData"
              style="width: 100%"
              border>
      <el-table-column v-for="(item,index) in tableTitle"
                       :key="index"
                       :prop="item.prop"
                       :label="item.label"
                       :align="item.align"
                       :width="item.width">
      </el-table-column>
      <el-table-column label="操作"
                       width="160px"
                       align="center">
        <template scope="scope">
          <el-button size="small" v-if="scope.row.isUsed!=='1'" type="text" @click.stop="updateRule(scope.row)">修改
          </el-button>
          <el-button size="small" v-if="scope.row.isUsed!=='1'" type="text" @click.stop="deleteRule(scope.row)">删除
          </el-button>
          <el-button size="small" type="text" @click.stop="viewDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="searchParam.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="searchParam.pageSize"
      layout="sizes,prev, pager, next"
      @size-change="sizeChange"
      @current-change="currentChange"
      :total="pageTotal">
    </el-pagination>
    <AddEdit ref="addEdit" @updateList="search"></AddEdit>
  </div>
</template>

<script>
  import AddEdit from './addEdit';

  const tableTitle = [
    {prop: "id", label: "规则ID", width: "150px", align: 'center'},
    {prop: "ruleName", label: "规则名称", width: "", align: 'center'},
    {prop: "updatedTime", label: "更新时间", width: "170px", align: 'center'}
  ]
  export default {
    name: "index",
    components: {
      AddEdit
    },
    data() {
      return {
        tableTitle: [...tableTitle],
        tableData: [],
        ruleName: '',//规则名称
        pageTotal: 0,
        searchParam: {
          pageNo: 1,
          pageSize: 10,
          ruleName: ''
        }
      }
    },
    created() {
      this.search();
    },
    methods: {
      search(val) {
        if (val === 1) this.searchParam.pageNo = val;
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/channel/activityRewardRule/list',
          method: 'post',
          data: this.searchParam
        }).then((data) => {
          if (data.msgCode === '200') {
            this.tableData = data.data.list;
            this.pageTotal = data.data.totalCount;
          } else {
            this.$Message.error({
              message: data.msgContent
            });
            this.tableData = [];
            this.pageTotal = 0;
          }
          this.$sdk.sendEvent({
            eventId: 'click_teacher_activityRewardRule_list',
            eventParam: this.searchParam
          });
        }).catch(message => {
          this.tableData = [];
          this.pageTotal = 0;
          this.$Message.error({
            message
          })
        })
      },
      viewDetail(row) {
        this.$refs.addEdit.showDialog(row, true);
      },
      updateRule(row) {
        this.$refs.addEdit.showDialog(row);
      },
      deleteRule(row) {
        this.$MessageBox.confirm(`是否删除名称为【${row.ruleName}】的奖励规则？`, '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$Fetch({
              url: '/api/zm-teacher-recruit-web/channel/activityRewardRule/update',
              method: 'post',
              data: {
                isDelete: 1,
                id: row.id
              }
            })
            .then((data) => {
              if (data.msgCode === '200') {
                this.$Message({
                  type: 'success',
                  message: `名称为【${row.ruleName}】的奖励规则删除成功`
                });
                this.search();
              } else {
                this.$Message.error({
                  message: `名称为【${row.ruleName}】的奖励规则删除失败`
                });
              }
              this.$sdk.sendEvent({
                eventId: 'click_teacher_activityRewardRule_updat',
                eventParam: {
                  isDelete: 1,
                  id: row.id
                }
              });
            })
            .catch(message => {
              this.$Message.error({
                message
              });
            })
        }).catch(() => {
        });
      },
      addRule() {
        this.$refs.addEdit.showDialog()
      },
      sizeChange(val) {
        this.searchParam.pageSize = val;
        this.searchParam.pageNo = 1;
        this.search();
      },
      currentChange(val) {
        this.searchParam.pageNo = val;
        this.search();
      }
    }
  }
</script>

<style scoped lang="less">
  .activity-billing-management {
    padding: 20px;
    background: #fff;
  }
</style>
