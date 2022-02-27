<template>
  <transition name="slide-down">
    <div @click="cancel()" class="dialogBack">
      <div @click.stop="contentClick($event)" id="teaEntryAudit" class="dialog-content">
        <div class="dialog-body">
          <el-form label-position="left" label-width="120px">
            <el-form-item label="姓名">
              {{name}}
            </el-form-item>
            <el-form-item label="审核结果" style="width: 320px !important;">
              <el-select v-model="options.entryState" placeholder="请选择审核情况">
                <el-option label="通过" :value="2"></el-option>
                <el-option label="不通过" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="options.entryState == 3" label="问题信息模块" style="width: 320px !important;">
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
          <!-- <br>
          <br>
            <span style="font-size:14px;">历次审核结果:</span>
          <br>-->
          <br>
          <table v-if="auditData.length > 0" class="dialog-tabel">
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
        <div class="dialog-control">
          <el-button @click="cancel">取消</el-button>
          <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>

import newEntryAudit from '../API/newEntryAudit'
import getAuditRecords from '../API/getAuditRecords'
import getEntryState from '../API/getEntryState'

export default {
  data() {
    return {
        buttonState:false,
        auditData:[],
        materialProblem:[],
        options:{
            entryState:2,
            remark:''
        },
        API:{
          newEntryAudit:null,
          getAuditRecords:null,
          getEntryState:null
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
    "teaId":null,
    "name":"",
    "new-entry-audit":null,
    "get-audit-records":null,
    "get-entry-state":null
  },
  methods:{
    contentClick(e){
      e.preventDefault();
    },
    getAuditState(){
      let parm = {
        teaId:this.teaId
      };
      this.$BMloading("teaEntryAudit")
      this.API.getEntryState(parm).then(data => {
        this.$BMloadingFinish("teaEntryAudit")
        if(!!data.entryMaterialProblem){
          this.materialProblem = data.entryMaterialProblem.split(',');
        }
      }).catch(message => {
        console.log("getEntryState异常:",message)
        this.$BMloadingFinish("teaEntryAudit")
        this.$Message({
            message: message
        });
      })
    },
    getData(){
      let parm = {
        teaId:this.teaId
      };
      this.API.getAuditRecords(parm).then(data => {
        this.auditData = data;
      }).catch(message => {
        console.log("getAuditRecords异常:",message)
        this.$Message({
            message: message
        });
      })
    },
    apiSetting(){
      if(!!this.newEntryAudit){
        this.API.newEntryAudit = this.newEntryAudit;
      }else{
        this.API.newEntryAudit = newEntryAudit;
      }
      if(!!this.getAuditRecords){
        this.API.getAuditRecords = this.getAuditRecords;
      }else{
        this.API.getAuditRecords = getAuditRecords;
      }
      if(!!this.getEntryState){
        this.API.getEntryState = this.getEntryState;
      }else{
        this.API.getEntryState = getEntryState;
      }
    },
    cancel(){
      this.$emit("cancel");
    },
    confirm () {
        this.buttonState = true;
        Object.assign(this.options,{teaId:this.teaId});
        this.options.materialProblem = this.materialProblem.toString();
        this.options.result = this.options.entryState;

        this.API.newEntryAudit(this.options).then(data => {
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
      this.materialProblem = [];
      this.options = {
          entryState:0,
          remark:''
      };
    }
  },
  mounted:function(){
    this.apiSetting();
    this.getData();
    this.getAuditState();
  }
}
</script>
