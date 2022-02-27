<template>
  <div style="position:relative;">
    <Spin size="large" fix v-if="tableLoading"></Spin>
    <div class="content">
      <el-form label-position="left" label-width="120px">
        <el-form-item label="姓名">
          {{name}}
        </el-form-item>
        <el-form-item label="审核结果">
          <el-radio-group v-model="options.entryState">
            <el-radio  :label="2">通过</el-radio>
            <el-radio  :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="options.entryState == 3" label="问题信息模块">
          <el-select v-model="materialProblem" multiple  placeholder="请选择" >
            <el-option label="基本信息" value="基本信息"></el-option>
            <el-option label="教学背景" value="教学背景"></el-option>
            <el-option label="银行卡信息" value="银行卡信息"></el-option>
            <el-option label="备注" value="备注"></el-option>
            <el-option label="教育经历" value="教育经历"></el-option>
            <el-option label="工作经历" value="工作经历"></el-option>
            <el-option label="家庭成员" value="家庭成员"></el-option>
            <el-option label="相关扫描件" value="相关扫描件"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="说明">
          <el-input v-model="options.remark" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <br>
      <br>
        历次审核结果:
      <br>
      <br>
      <table v-if="auditData.length > 0" class="auditTabel">
        <thead>
          <th width="150px">审核时间</th>
          <th width="100px">审核人</th>
          <th width="100px">审核结果</th>
          <th>备注</th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in auditData">
            <td>{{item.opreateTime }}</td>
            <td>{{item.opreateName }}</td>
            <td>{{item.opreateResult }}</td>
            <td>{{item.remark }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else style="text-align:center;">暂无数据</div>

    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
    <!-- <div style="text-align:right; padding-top:20px;" v-if="teaCheckState+'' != '0'">
      无需审核
    </div> -->
  </div>
</template>
<script>

import newEntryAudit from '../../api/action/newEntryAudit'
import getAuditRecords from '../../api/select/getAuditRecords'
import getEntryState from '../../api/select/getEntryState'

export default {
  data() {
    return {
        buttonState:false,
        auditData:[],
        teaCheckState:-1,
        tableLoading:false,
        materialProblem:[],
        options:{
            entryState:0,
            remark:''
        }
    }
  },
  filters:{
    stateFilter (val) {
      if(val == 2){
        return "通过";
      }
      if(val == 3){
        return "不通过";
      }
    }
  },
  props:{
    currentID:null,
    name:"",
    viewState:false//false表示页面关闭，true表示页面展开
  },
  watch:{
    viewState (val) {
      if(!val){
        this.default();
      }else{
        this.getData();
        this.getAuditState();
      }
    }
  },
  methods:{
    getAuditState(){
      let parm = {
        teaId:this.currentID
      };
      this.tableLoading = true;
      getEntryState(parm).then(data => {
        this.tableLoading = false;
        // this.options.entryState = data.entryState;
        this.teaCheckState = data.entryState;
        // this.options.remark = data.remark;
        if(!!data.entryMaterialProblem){
          this.materialProblem = data.entryMaterialProblem.split(',');
        }

      }).catch(message => {
        console.log("getEntryState异常:",message)
        this.tableLoading = false;
        this.$Message({
            message: message
        });
      })
    },
    getData(){
      let parm = {
        teaId:this.currentID
      };
      getAuditRecords(parm).then(data => {
        this.auditData = data;
      }).catch(message => {
        console.log("getAuditRecords异常:",message)
        this.$Message({
            message: message
        });
      })
    },
    cancel(){
      this.$emit("cancel");
    },
    confirm () {
        if(this.teaCheckState == 2){
          this.$Message({
              message: "该教师已经是审核通过状态,无需审核"
          });
          return;
        }
        this.buttonState = true;
        Object.assign(this.options,{teaId:this.currentID});
        this.options.materialProblem = this.materialProblem.toString();
        this.options.result = this.options.entryState;

        newEntryAudit(this.options).then(data => {
            this.$emit("confirm");
            this.default();
        }).catch(message => {
            this.$Message({
                message: message
            });
            this.buttonState = false;
        });
    },
    default () {
      this.buttonState = false;
      this.auditData = [];
      this.teaCheckState = -1;
      this.tableLoading = false;
      this.materialProblem = [];
      this.options = {
          entryState:0,
          remark:''
      };
    }
  },
  mounted:function(){
    this.getData();
    this.getAuditState();
  }
}
</script>
<style scoped media="screen">
  .content{
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    margin: -20px;
  }
  .control{
    text-align: right;
    padding-top: 20px;
    background-color: white;
  }
  .el-form-item .logo{
    width: 100px;
    height: 150px;
  }
  .auditTabel{
      width: 100%;
      text-align: center;
  }
</style>
