<template>
  <div>
    <div class="content">
        <el-row>
          <el-col :span="4">代理名称</el-col>
          <el-col :span="20">
              <el-input v-model="options.name" placeholder="输入代理姓名"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">代理类型</el-col>
          <el-col :span="20">
            <el-select v-model="options.type" placeholder="请选择日期">
                <el-option label="全职" value="1"></el-option>
                <el-option label="兼职" value="2"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">手机号</el-col>
          <el-col :span="20">
              <el-input v-model="options.tel" placeholder="输入代理姓名"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">开户银行</el-col>
          <el-col :span="20">
            <el-select v-model="options.bankName" placeholder="请选择">
                 <el-option label="中国工商银行" value="中国工商银行">中国工商银行</el-option>
                 <el-option label="中国农业银行" value="中国农业银行">中国农业银行</el-option>
                 <el-option label="中国建设银行" value="中国建设银行">中国建设银行</el-option>
                 <el-option label="中国邮政储蓄银行" value="中国邮政储蓄银行">中国邮政储蓄银行</el-option>
                 <el-option label="招商银行" value="招商银行">招商银行</el-option>
                 <el-option label="中国银行" value="中国银行">中国银行</el-option>
                 <el-option label="中国民生银行" value="中国民生银行">中国民生银行</el-option>
                 <el-option label="交通银行" value="交通银行">交通银行</el-option>
                 <el-option label="中信银行" value="中信银行">中信银行</el-option>
                 <el-option label="中国光大银行" value="中国光大银行">中国光大银行</el-option>
                 <el-option label="兴业银行" value="兴业银行">兴业银行</el-option>
                 <el-option label="浦发银行" value="浦发银行">浦发银行</el-option>
                 <el-option label="广发银行" value="广发银行">广发银行</el-option>
                 <el-option label="平安银行" value="平安银行">平安银行</el-option>
                 <el-option label="华夏银行" value="华夏银行">华夏银行</el-option>
                 <el-option label="北京银行" value="北京银行">北京银行</el-option>
                 <el-option label="上海银行" value="上海银行">上海银行</el-option>
                 <el-option label="江苏银行" value="江苏银行">江苏银行</el-option>
                 <el-option label="北京农商银行" value="北京农商银行">北京农商银行</el-option>
                 <el-option label="江苏省农信社" value="江苏省农信社">江苏省农信社</el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">银行卡信息</el-col>
          <el-col :span="20">
            <el-input v-model="options.bankAccount" placeholder="输入代理姓名"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">开户城市</el-col>
          <el-col :span="20">
            <el-input v-model="options.bankCity" placeholder="输入开户城市"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">开户支行</el-col>
          <el-col :span="20">
            <el-input v-model="options.backSub" placeholder="输入支行"></el-input>
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

export default {
    data() {
        return {
            buttonState:false,
            options:{
              name:'',
              type:'',
              tel:'',
              bankName:'',
              bankAccount:'',
              bankCity:'',
              backSub:''
            }
        }
    },
    props:{
        viewState:false//false表示页面关闭，true表示页面展开
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
            this.$emit("confirm");
        },
        default () {
          this.options = {
            name:'',
            type:'',
            tel:'',
            bankName:'',
            bankAccount:'',
            bankCity:'',
            backSub:''
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
      background-color: #f4f5f5;
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
