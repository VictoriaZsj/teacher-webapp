<template>
  <el-dialog
    v-model="visible"
    title="绑定期间累计获得新讲师"
    class="binding-tea-table"
  >
    <el-table
        :data="table_data"
      >
        <el-table-column
          prop="teaName"
          align="center"
          label="讲师姓名"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="teaMobile"
          align="center"
          label="手机号码"
        >
          <template scope="prop">
            <el-button
              v-if="
                prop.row.teaMobile && prop.row.teaMobile.indexOf('***') !== -1
              "
              type="text"
              size="small"
              @click="queryMobile(prop.row)"
              >点击查看手机号</el-button
            >
            <span v-else>{{ prop.row.teaMobile }}</span>
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
  </el-dialog>
</template>
<script>
import { listBindAfterTeas } from 'api/commissionerAndChannel';
import getTeacherSecretInfo from 'api/select/getTeacherSecretInfo'; // 获取手机号

export default {
  data() {
    return {
      visible: false,
      search_data: {
        bindId: '',
        pageNo: 1,
        pageSize: 10,
      },
      table_data: [],
      table_data_total: 0,
      tableLoading: false,
    };
  },
  methods: {
    init(id) {
      this.search_data = {
        bindId: id,
        pageNo: 1,
        pageSize: 10,
      };
      this.getTableData();
      this.visible = true;
    },
    // 查询手机号
    queryMobile(row) {
      getTeacherSecretInfo({teaId: row.teaId, infoType: 'mobile'}).then(res => {
        row.teaMobile = `${res}`;
      }).catch(err => {
        this.$message.error(err);
      })
    },
    // 列表查询
    getTableData() {
      this.tableLoading = true;
      listBindAfterTeas(this.search_data)
        .then((result) => {
          const { data, code, msgContent, msgCode } = result.data;
          if (code === 200 && msgCode === '200') {
            this.table_data = data.list;
            this.table_data_total = data.total;
          } else {
            this.$Message.warning(msgContent);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
      this.$emit('upStatistic');
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
  },
}
</script>
<style lang="scss">
.binding-tea-table {
  .el-dialog__body, .el-dialog__footer {
    background: #fff;
  }
}
</style>
