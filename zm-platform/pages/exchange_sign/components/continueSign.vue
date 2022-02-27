<template>
  <div>
    <div class="content">
      <el-form :model="options" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="签约类型" >
          <el-input v-model="signTypeDesc" disabled style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="续签时间" prop="signTime">
          <el-date-picker
            style="width:50%"
            v-model="options.signTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="即合同开始时间">
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
  // import entryOneSignContract from '../../api/action/entryOneSignContract';
  // import entryMultiSignContract from '../../api/action/entryMultiSignContract';
  import fetch from '../../../../src/utils/fetch'
  import signMultiSign from '../../../api/action/signMultiSign';

  export default {
    data() {
      return {
        buttonState:false,
        today:'',
        rules:{
          signTime: [
            { type:'date',required: true, message: '请选择续签时间', trigger: 'change' }
          ],
        },
        data:{},
        signBody:'',
        contractTime:'',
        signTypeDesc:'',
        options:{
          signTime:'',
          remark:'',
          signType:'2'
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
    },
    methods:{
      cancel () {
        this.$emit("cancel");
      },
      confirm () {
         this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$MessageBox.confirm("确定要续签合同吗？", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.buttonState = true;
              this.options.signTime=Date.parse(this.options.signTime)
              this.options.signType='2'
              let params = {...this.options}
              params = Object.assign(params,{teacherIds:[this.row.teacherId]});
                // this.handle(params)

                signMultiSign(params).then(res => {
                  this.$emit("confirm");
                  let {code,data,message}=res;
                  this.$Message.success(message);
                  this.default();
                }).catch(message => {

                  this.buttonState = false;
                  this.$Message({
                    message: message
                  });
                });
            })
          }
        })
      },
      default () {
        this.options = {
          signTime:'',
          remark:''
        };
        this.buttonState = false;
      },

      init(){
        fetch({
          url: '/api/sign/signInfo',
          method: 'get',
          params:{
            signType:2,
            teaId:this.row.teacherId
          },
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.data=data;
            this.signBody=data.signBodyDesc
            this.signTypeDesc=data.signTypeDesc
            this.contractTime=data.contractTime
            this.options.signTime=new Date(data.signTime)
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
