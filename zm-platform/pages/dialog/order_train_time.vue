<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">培训时间</el-col>
        <el-col :span="20">
            <zm-datepicker :mindate="today" type="minute" v-model="options.trainTime"></zm-datepicker>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-col :span="4">培训主题</el-col>
        <el-col class="trainTopicContent" :span="20">
            <el-select style="width:193px;" v-model="trainTopicID" placeholder="请选择">
                <el-option v-for="(item,index) in trainTopicList" :key="index" :label="item.trainTheme" :value="item.trainNo"></el-option>
            </el-select>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="4">备注</el-col>
        <el-col :span="20">
          <el-input type="textarea" :rows="2" v-model="options.remark" placeholder="请输入备注"></el-input>
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
import getTrainTopic from '../../api/select/getTrainTopic'
import appointMultiTrainTime from '../../api/action/appointMultiTrainTime'
import appointOneTrainTime from '../../api/action/appointOneTrainTime'

export default {
    data() {
        return {
            buttonState:false,
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
              }
            },
            today:'',
            trainTopicList:[],
            trainTime:'',
            trainTopicID:'',
            options:{
              trainTime:'',
              remark:''
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
        getTrainDic () {
          let dic = {};
          let len = this.trainTopicList.length;
          let item = null;
          for(var i = 0; i < len; i++){
            item = this.trainTopicList[i];
            if(item.trainNo == this.trainTopicID){
              dic = item;
            }
          }
          return dic;
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
            Object.assign(this.options,this.getTrainDic());
            this.buttonState = true;
            if(Object.prototype.toString.call(this.currentID) === '[object Array]'){
                Object.assign(this.options,{teaIds:this.currentID});
                appointMultiTrainTime(this.options).then(data => {
                  this.default();
                  this.$emit("confirm");
                }).catch(message => {
                  this.buttonState = false;
                  this.$Message({
                      message: message
                  });
                });
            }else{
                Object.assign(this.options,{teaId:this.currentID});
                appointOneTrainTime(this.options).then(data => {
                  this.default();
                  this.$emit("confirm");
                }).catch(message => {
                  this.buttonState = false;
                  this.$Message({
                      message: message
                  });
                });
            }
        },
        default () {
          this.options = {
            trainTime:'',
            remark:''
          };
          this.trainTime = '';
          this.trainTopicID = '';
          this.trainTopicList = [];
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
