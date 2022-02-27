<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">入职时间</el-col>
        <el-col :span="20">
            <zm-datepicker :mindate="today" type="day" v-model="options.hireTime"></zm-datepicker>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">备注</el-col>
        <el-col :span="20">
          <el-input type="textarea" :rows="2" v-model="options.hireRemark" placeholder="请输入备注"></el-input>
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
import setHireTime from '../../api/action/setHireTime'

export default {
    data() {
        return {
            buttonState:false,
            today:'',
            options:{
            	hireTime:'',
              hireRemark:''
            }
        }
    },
    props:{
        currentID:null,
        viewState:false//false表示页面关闭，true表示页面展开
    },
    mounted () {
      let date = new Date();
      this.today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " 00:00:00";
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }
      }
    },
    methods:{
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
            this.buttonState = true;
            Object.assign(this.options,{teaId:this.currentID});
            setHireTime(this.options).then(data => {
              this.default();
              this.$emit("confirm");
            }).catch(message => {
              this.buttonState = false;
              this.$Message({
                  message: message
              });
            });
        },
        default () {
          this.options = {
            hireTime:'',
            hireRemark:''
          };
          this.buttonState = false;
        }
    }
}
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
