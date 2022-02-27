<template>
  <div>
    <div class="content">
        <el-row>
          <el-col :span="4">预约结果</el-col>
          <el-col :span="20">
              <el-select ID="communicateResultType" v-model="options.communicateResultType" placeholder="请选择">
                  <el-option label="打标签" value="1022"></el-option>
                  <el-option label="QQ审核中" value="1023"></el-option>
                  <el-option label="微信审核中" value="1024"></el-option>
                  <el-option label="电话联系" value="1016"></el-option>
                  <el-option label="1次挂断" value="1"></el-option>
                  <el-option label="2次挂断" value="2"></el-option>
                  <el-option label="时间待定" value="1025"></el-option>
                  <el-option label="条件符合" value="4"></el-option>

              </el-select>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="4">预约次数</el-col>
          <el-col :span="20">
              <el-input style="width:182px;" v-model="options.connectNumber" placeholder="请输入预约次数"></el-input>
          </el-col>
        </el-row> -->

        <el-row v-if="options.communicateResultType == 4">
          <el-col :span="4">面试时间</el-col>
          <el-col :span="20">
              <zm-datepicker :mindate="today" type="minute" v-model="intInterviewTime"></zm-datepicker>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">备注</el-col>
          <el-col :span="20">
            <el-input type="textarea" :rows="2" v-model="options.remark" placeholder="请输入备注"></el-input>
          </el-col>
        </el-row>
    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button ID="InterviewTimeDialogBtn" :loading="buttonState" @click="confirmReady" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>

import appointInterviewTime from '../../api/action/appointInterviewTime'

export default {
    data() {
        return {
            buttonState:false,
            today:'',
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
              }
            },
            intInterviewTime:'',
            options:{
              appointInterviewTime:'',//	预约时间	string	条件下必选: 4-条件符合下, 预约时间必选
              communicateResultType:'',//	沟通结果	number	必选
              connectNumber:'',//	沟通次数	number	必选
              remark:''//	备注	string	可选
            }
        }
    },
    props:{
        currentID:null,
        interviewstate:null,
        viewState:false//false表示页面关闭，true表示页面展开
    },
    mounted:function(){
        let date = new Date();
        this.setNextDays();
        this.today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " 00:00:00";
        window.orderInterviewTimeDialog = this;
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }
      }
    },
    methods:{
        setNextDays(){
          let date = new Date();
          date.setDate(date.getDate()+1);//设置天数 +1 天
          this.intInterviewTime = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " 10:00:00";
        },
        cancel () {
            this.$emit("cancel");
        },
        confirmReady(){
          if(this.options.communicateResultType == "4" && (!!this.interviewstate && (this.interviewstate == 2 || this.interviewstate == 20))){
            this.$MessageBox.confirm(`该用户已面试通过，如果要重新预约面试，用户状态会改为待预约，确定修改吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.confirm();
            }).catch(message => {
              // this.$Message({
              //     message: message
              // });
            });
          }else{
            this.confirm();
          }
        },
        confirm () {
            this.buttonState = true;
            Object.assign(this.options,{teaId:this.currentID});
            this.options.appointInterviewTime = this.intInterviewTime;
            appointInterviewTime(this.options).then(data => {
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
            appointInterviewTime:'',//	预约时间	string	条件下必选: 4-条件符合下, 预约时间必选
            communicateResultType:'',//	沟通结果	number	必选
            connectNumber:'',//	沟通次数	number	必选
            remark:''//	备注	string	可选
          };
          this.buttonState = false;
        }
    }
}
</script>
<style scoped>
    .content{
      max-height: 400px;
      overflow-y: visible;
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
</style>
