<template>
  <div>
    <div class="content">
      <el-form :model="options" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="签约类型" >
          <el-input v-model="signType" disabled style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="time">
          <!-- <zm-datepicker type="day" v-model="options.time"></zm-datepicker> -->
          <el-date-picker
            style="width:50%"
            v-model="options.time"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约主体" >
          <el-input v-model="signBody" disabled style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="合同时长" >
          <el-input v-model="contractTime" disabled style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input type="textarea" :rows="2" v-model="options.remark" placeholder="请输入备注" style="width:50%"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
  import entryOneSignContract from '../../api/action/entryOneSignContract';
  import entryMultiSignContract from '../../api/action/entryMultiSignContract';
  import fetch from '../../../src/utils/fetch'
  export default {
    data() {
      return {
        buttonState:false,
        today:'',
        rules:{
          time: [
            { type:'date',required: true, message: '请选择入职时间', trigger: 'change' }
          ],
        },
        data:{},
        signBody:'',
        contractTime:'',
        signType:'',
        options:{
          time:'',
          remark:'',
        }
      }
    },
    props:{
      row:{},
      currentID:null,
      viewState:false //false表示页面关闭，true表示页面展开
    },

    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else {
          this.init();
          let date = new Date();
          this.today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " 00:00:00";
        }
      },
      'options.time':function(val){
      }

    },
    methods:{
      cancel () {
        this.$emit("cancel");
      },
      confirm () {
        this.$MessageBox.confirm("确定要签合同吗？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.buttonState = true;
          let params = {...this.options}
          if(Object.prototype.toString.call(this.currentID) === '[object Array]'){
            params=this.handle(params)
            params = Object.assign({}, params, {teaIds:this.currentID});
            entryMultiSignContract(params).then(data => {
              this.default();
              this.$Message({
                message: "操作成功"
              });
              this.$emit("confirm");
            }).catch(message => {
              this.buttonState = false;
              this.$Message({
                message: message
              });
            });
          }else{
            params = Object.assign(params,{teaId:this.currentID});
            // this.handle(params)
            entryOneSignContract(params).then(data => {
              this.default();
              this.$emit("confirm");
            }).catch(message => {
              this.buttonState = false;
              this.$Message({
                message: message
              });
            });
          }
        }).catch(message => {
        });


      },
      default () {
        this.options = {
          time:'',
          remark:''
        };
        this.buttonState = false;
      },
      init(){
        fetch({
          url: '/api/sign/signInfo',
          method: 'get',
          params:{
            signType:0,
            teaId:this.currentID
          },
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.data=data;
            this.signBody=data.signBodyDesc
            this.signType=data.signTypeDesc
            this.contractTime=data.contractTime
          }
          else {

          }
        })
          .catch((err) => {
            if (err) {
              console.log(err);
            }
            reject(err);
          });
      }

    },
    mounted(){
      this.init();
    }
  };
</script>
<style scoped>
  .content{
    max-height: 400px;
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
  .trainTopicContent{
    line-height: 30px;
  }
</style>
