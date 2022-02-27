<template>
  <div>
    <div class="content">
        <el-row>
          <el-col :span="4">活动链接</el-col>
          <el-col :span="20">
            <el-select v-model="options.linkid" placeholder="请选择">
                <el-option v-for="(item,index) in act_link_data" :key="index" :label="item.linkname" :value="item.id">
                </el-option>
            </el-select>
          </el-col>
        </el-row>




        <el-row>
          <el-col :span="4">活动开始时间</el-col>
          <el-col :span="20">
              <zm-datepicker  type="second" v-model="options.activitystarttime"></zm-datepicker>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">活动结束时间</el-col>
          <el-col :span="20">
              <zm-datepicker  type="second" v-model="options.activityendtime"></zm-datepicker>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">BU</el-col>
          <el-col :span="20">
            <el-select v-model="options.bu" placeholder="请选择">
              <el-option label="1对1" :value="1"></el-option>
              <el-option label="少儿" :value="2"></el-option>
              <el-option label="陪练" :value="3"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">工作性质</el-col>
          <el-col :span="20">
            <el-select v-model="options.timetype" placeholder="请选择">
              <el-option label="兼职" :value="0"></el-option>
              <el-option label="全职" :value="1"></el-option>
              <el-option label="校招全职" :value="2"></el-option>
              <el-option label="公校兼职" :value="3"></el-option>
            </el-select>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="4">结算延迟天数</el-col>
          <el-col :span="20">
            <el-input v-model="options.delaydays" placeholder="请输入结算延迟天数"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">活动标题</el-col>
          <el-col :span="20">
            <el-input v-model="options.activitytitle" placeholder="请输入活动标题"></el-input>
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

import agentLinkList from '../../api/select/agentLinkList';
import saveAgentActivty from '../../api/action/saveAgentActivty';

export default {
    data() {
        return {
            buttonState:false,
            today:'',
            searchActDateArea:[],
            act_link_data:[],
            options:{
              activityendtime:'',	//活动结束时间	string	body	true
              activitystarttime:'',	//活动开始时间	string	body	true
              activitytitle:'',	//活动标题	string	body	true
              delaydays:'',	//延迟天数	integer	body	true
              linkid:'',	//链接id
              bu:'',	//bu
              timetype:''
            }
        }
    },
    props:{
        currentID:null,
        itemdata:null,
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else{
          this.getLinkList();
          this.initData();
        }
      }
    },
    mounted:function(){
      let date = new Date();
      this.today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " 00:00:00";

      this.getLinkList();
      this.initData();
    },
    methods:{
        initData(){
          if(!!this.itemdata){
            Object.assign(this.options,this.itemdata);

          }
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
          this.buttonState = true;
          if(!!this.currentID){
            this.options.id = this.currentID;
          }
          saveAgentActivty(this.options).then(data => {
            this.buttonState = false;
            this.default();
            this.$emit("confirm");
          }).catch(message => {
            this.$Message({
                message
            });
            this.buttonState = false;
          });
        },
        default () {
          this.options = {
            activityendtime:'',	//活动结束时间	string	body	true
            activitystarttime:'',	//活动开始时间	string	body	true
            activitytitle:'',	//活动标题	string	body	true
            delaydays:'',	//延迟天数	integer	body	true
            linkid:'',	//链接id
            bu:'',	//bu
            timetype:''
          };
        },
        getLinkList() {
            agentLinkList().then(data => {
              this.act_link_data = data;
            }).catch(message => {
              this.$Message({
                  message: message
              });
            });
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
