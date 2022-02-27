<template>
  <div>
    <div class="content">
      <!-- <el-row>
        <el-col :span="4">移交至</el-col>
        <el-col :span="20">
            <el-select v-model="options.transferBu" placeholder="请选择">
                <el-option label="掌门1对1" value="1"></el-option>
                <el-option label="掌门少儿" value="2"></el-option>
                <el-option label="掌门陪练" value="3"></el-option>
            </el-select>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="4">移交状态</el-col>
        <el-col :span="20">
            <el-select v-model="options.transferStatus" placeholder="请选择">
                <el-option v-for="(item,index) in recoveryStateData" :key="index" :value="item.state" :label="item.stateStr"></el-option>
            </el-select>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="4">移交原因</el-col>
        <el-col :span="20">
            <el-select v-model="options.transferReasonType" placeholder="请选择">
              <el-option label="渠道" :value="4"></el-option>
              <el-option label="转介绍" :value="5"></el-option>
              <el-option label="BOSS" :value="6"></el-option>
              <el-option label="其他" :value="3"></el-option>
            </el-select>
        </el-col>
      </el-row>

      <el-row v-show="options.transferReasonType == 3">
        <el-col :span="4">其他原因</el-col>
        <el-col :span="20">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入原因"
            v-model="options.transferOtherReason">
          </el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">移交对象</el-col>
        <el-col :span="20">
          <el-input style="width:182px;" v-model="searchContent" placeholder="请输入姓名或手机号以检索"></el-input>
        </el-col>
      </el-row>
      <el-row style="padding:0px;">
          <el-col :span="24">
              <el-radio-group class="choose" v-model="options.toCommissionerId">
                <el-radio v-for="(item,index) in MayTransferComissioners" v-if="isAccord(item)" :key="index"  style="width:45%;" :label="item.toCommissionerId">{{item.comissionerName}}</el-radio>
              </el-radio-group>
          </el-col>
      </el-row>


    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
import transferTeacher from '../../api/action/transferTeacher';

export default {
    data() {
        return {
            buttonState:false,
            searchContent:"",
            options:{
                transferReasonType:'',
                toCommissionerId:'',
                // transferBu:'',
                // transferStatus:'',
                transferOtherReason:''
            }
        }
    },
    props:{
        currentID:null,
        MayTransferComissioners:Array,
        recoveryStateData:null,
        viewState:false, //false表示页面关闭，true表示页面展开
        selectedDataList: Array, // 当选选中的老师列表
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }
      }
    },
    methods:{
        isAccord (value) {
          return (value.comissionerName.indexOf(this.searchContent) != -1 || value.mobile.indexOf(this.searchContent) != -1)
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
            this.buttonState = true;
            Object.assign(this.options,{teacherIds:[].concat(this.currentID)});
            // 若该讲师状态不是“待分配、待预约面试”  中的任何一种，均为移交失败，保存时给予提示
            if (this.options.transferReasonType && this.options.transferReasonType == 5) {
              let match = true;
              for(let i = 0; i < this.selectedDataList.length; i++) {
                if (!this.selectedDataList[i].interviewStateStr) {
                  match = false;
                  break;
                }
                if (this.selectedDataList[i].interviewStateStr != '待分配' && this.selectedDataList[i].interviewStateStr != '待预约') {
                  match = false;
                  break;
                }
              }
              if (!match) {
                this.buttonState = false;
                this.$Message({
                    message: '讲师状态不符合转介绍，请选择其他原因，更改原因后可正常移交'
                });
                return;
              }
            }
            transferTeacher(this.options).then(data => {
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
          this.options = {
            transferReasonType:'',
            toCommissionerId:'',
            // transferBu:'',
            // transferStatus:'',
            transferOtherReason:''
          };
          this.buttonState = false;
        }
    }
}
</script>
<style scoped>
    .content{
      max-height: 400px;
      overflow-y: auto;
    }
    .control{
      text-align: right;
      padding-top: 20px;
      background-color: white;
    }
    .el-row{
        padding: 10px;
    }
    .el-row div:first-child{
        line-height: 30px;
    }
    .el-row:after{
        content: '';
        display: table;
        clear: both;
    }
    .el-dialog .el-radio-group.choose{
        width: 100%;
        background-color: transparent;
    }
</style>
