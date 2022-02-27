<template>
  <div>
    <el-dialog title="补发邮件" top="5%" custom-class="send-ulti-signdialog" v-model="sendSignEmaildialogVisible" @close="cancelSendSignEmail">
      <el-form :inline="true" :model="formData" class="search-form send-search-form">
        <el-form-item label="关键词">
          <el-input v-model="formData.key" placeholder="支持姓名/手机号/teaID查询"></el-input>
        </el-form-item>
        <el-button icon="search" type="normal" style="margin-top: 8px;" size="small" @click="searchData">搜 索</el-button>
      </el-form>
      <el-table :data="teacherSignDtoData" @selection-change="selectTable" v-loading="tableLoading" ref="sendList" style="width:100%;">
        <el-table-column align="center" type="selection" width="50"></el-table-column>
        <el-table-column prop="teacherName" align="center" minWidth="80" label="姓名">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" :disabled="scope.row.teacherName && scope.row.teacherName.length<16" :content="scope.row.teacherName" placement="top">
              <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 150px;">
                {{scope.row.teacherName}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="teacherId" align="center" minWidth="100" label="teaID"></el-table-column>
        <el-table-column prop="mobile" align="center" minWidth="130" label="手机号">
          <template scope="scope">
            <span v-if="scope.row.teacherId==rowId && textMobile">{{textMobile}}</span>
            <el-button type="text" size="small" @click="getTeacherSecretInfo(scope.row,'mobile')"
                        class="detailsBtn" v-else>点击查看信息</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="email" align="center" minWidth="150" label="邮箱">
          <template scope="scope">
            <span v-if="scope.row.teacherId==rowId && textEmail">{{textEmail}}</span>
            <el-button type="text" size="small" @click="getTeacherSecretInfo(scope.row,'email')"
                        class="detailsBtn" v-else>点击查看信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="formData.pageNo" :page-size="formData.pageSize"
        layout="total, prev, pager, next" v-bind:total="total">
      </el-pagination>
      <div style="float: right;padding: 30px 0;">
        <el-button @click="cancelSendSignEmail">取消</el-button>
        <el-button :loading="sendSignEmailVisible" @click="sendSignEmail" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import signTeacherSignList from '../../../api/action/signTeacherSignList';
import getTeacherSecretInfo from '../../../api/select/getTeacherSecretInfo';
import sendSignEmail from '../../../api/action/sendSignEmail';

export default {
  data() {
    return {
      sendSignEmaildialogVisible: false,
      sendSignEmailVisible: false,
      tableLoading: false,
      checkList: [],
      formData: {
        key: '',
        pageNo: 1,
        pageSize: 10,
      },
      teacherSignDtoData: [],
      total: 0,
      rowId: '',
      textMobile: '',
      textEmail: '',
    }
  },
  methods: {
    init() {
      this.sendSignEmaildialogVisible = true;
    },
    sendSignEmail() {
      if(this.checkList.length==0) return this.$Message.warning('请至少选中1位老师');
      this.sendSignEmailVisible = true;
      this.$MessageBox.confirm(`是否补发邮件?`, '提示', {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        showClose: false,
      }).then(() => {
        sendSignEmail({"teaIds": this.checkList}).then(res=>{
          if(res.code==0) {
            this.sendSignEmaildialogVisible = false;
            this.$Message.success(res.message || '发送成功');
          } else {
            this.$Message.error(res.message || '发送失败')
          }
        }).catch(err=>{
          this.$Message.error(err || '补发失败 请稍后再试');
        })
        this.sendSignEmailVisible = false;
      }).catch(() => {
        this.sendSignEmailVisible = false;
      });
    },
    cancelSendSignEmail() {
      this.checkList = [];
      this.teacherSignDtoData = [];
      this.total = 0;
      this.$refs.sendList.clearSelection();
      this.sendSignEmaildialogVisible = false;
      this.formData = {
        key: '',
        pageNo: 1,
        pageSize: 10,
      };
    },
    searchData() {
      this.formData.pageNo = 1;
      this.signTeacherSignList();
    },
    // 获取列表
    signTeacherSignList() {
      this.tableLoading = true;
      let params = { ...this.formData };
      signTeacherSignList(params).then(res=>{
        this.tableLoading = false;
        if(res.code==0 && res.data) {
          this.teacherSignDtoData = res.data.list;
          this.total = res.data.total;
        }
      }).catch(err=>{
        this.tableLoading = false;
        if(err.message) return this.$Message.error(err || '获取列表失败 请稍后再试');
      })
    },
    selectTable(val) {
      this.checkList = [];
      this.checkList = val.map(r=>{
        return r.teacherId;
      })
    },
    // 查询手机号邮箱
    getTeacherSecretInfo(row,infoType) {
      let parm = {
        teaId: row.teacherId,
        infoType,
      };
      this.rowId = row.teacherId;
      this.textMobile = '';
      this.textEmail = '';
      getTeacherSecretInfo(parm).then(data => {
        if(infoType=='mobile') {
          this.textMobile = data;
        } else if (infoType=='email') {
          this.textEmail = data;
        }
      }).catch(message => {
        this.$Message({message});
      });
    },
    handleSizeChange(val) {
      this.formData.pageNo = 1;
      this.formData.pageSize = val;
      this.signTeacherSignList();
    },
    handleCurrentChange(val) {
      this.formData.pageNo = val;
      this.signTeacherSignList();
    },
  },
}
</script>

<style lang="less">
.send-search-form {
  padding: 0 20px 20px 0;
  .el-form-item__label {
    min-width: 40px;
  }
}
.send-ulti-signdialog {
  .el-dialog__body {
    background: #fff !important;
  }
  width: 950px !important;
}
</style>
