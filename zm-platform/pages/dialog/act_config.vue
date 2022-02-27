<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">活动链接</el-col>
        <el-col :span="20">
          <el-select v-model="option.link" placeholder="请选择活动链接">
              <el-option label="周一" :value="1"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">活动时间</el-col>
        <el-col :span="20">
          <el-date-picker :editable="false" v-model="actDateArea" type="daterange" align="right" placeholder="选择日期" @change="chooseActDate">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">可推荐对象</el-col>
        <el-col :span="20">
          <el-select v-model="option.recomendUser" placeholder="请选择活动链接">
              <el-option label="1对1全职" :value="1"></el-option>
              <el-option label="1对1兼职" :value="2"></el-option>
              <el-option label="少儿全职" :value="3"></el-option>
              <el-option label="少儿兼职" :value="4"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">计算延迟天数</el-col>
        <el-col :span="20">
          <el-input v-model="option.day" placeholder="请输入天数"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">活动标题</el-col>
        <el-col :span="20">
          <el-input v-model="option.title" placeholder="请输入活动标题"></el-input>
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
import modifyInterviewState from '../../api/action/modifyInterviewState'

export default {
    data() {
        return {
            actDateArea:[],
            option:{
              link:'',
              recomendUser:'',
              day:'',
              title:'',
              startActTime:'',
              endActTime:''
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
        chooseActDate() {
            if(this.actDateArea[0] == null){
                this.option.startActTime = "";
                this.option.endActTime = "";
            }else{
              let sDate = new Date(this.actDateArea[0]).getTime();
              let eDate = new Date(this.actDateArea[1]).getTime();
              this.option.startActTime = this.$DateTool.format(sDate,'yyyy-MM-dd') + " 00:00:00";
              this.option.endActTime = this.$DateTool.format(eDate,'yyyy-MM-dd') + " 23:59:59";

            }
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
          this.$emit("confirm");
        },
        default () {

        },
    },
    mounted:function(){

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
</style>
