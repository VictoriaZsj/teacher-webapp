<template>
  <div>
    <div class="content">
        <el-row>
          <el-col :span="4">活动链接</el-col>
          <el-col :span="20">
            <el-select v-model="options.linkId" placeholder="请选择">
                <el-option v-for="(item,index) in act_link_data" :key="index" :label="item.linkname" :value="item.id">
                </el-option>
            </el-select>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="4">对应app</el-col>
          <el-col :span="20">
            <el-select v-model="options.app" placeholder="请选择">
              <el-option v-for="(item,index) in appAgentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">对应代理类型</el-col>
          <el-col :span="20">
            <el-select v-model="options.agentType" placeholder="请选择">
              <el-option label="一对一全职" value="full_time_1v1"></el-option>
              <el-option label="一对一兼职" value="part_time_1v1"></el-option>
              <el-option label="少儿" value="child"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">标题</el-col>
          <el-col :span="20">
            <el-input v-model="options.title" placeholder="请输入标题"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">图片</el-col>
          <el-col :span="20">
            <!--因 SEM-1633 问题, 弃用-->
            <zm-upload
              v-if="false && token"
              :upToken="token"
              :uploadId="'uploadInvite'"
              class="btn"
              :url="options.img"
              @update:url="val => options.img = val"  style="float: left; width:80px;">
            </zm-upload>
            <zm-uploader @update:url="val => options.img = val" style='float: left; margin-right: 10px;' />
            <img-box :imgsrc="options.img" style="float:left; margin-right:10px;"></img-box>
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
import addAgentAppConfig from '../../api/action/addAgentAppConfig';
import updateAgentAppConfig from '../../api/action/updateAgentAppConfig';
import imgBox from '../agent_referral/imgbox.vue';

import { appAgentList } from '../../../src/data/index.js';

export default {
    data() {
        return {
            token:'',
            buttonState:false,
            act_link_data:[],
            appAgentList:appAgentList,
            options:{
              linkId:'',	//链接id
              app:'',	//bu
              agentType:'',
              title:'',
              img:''
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
      this.getLinkList();
      this.initData();
      this._getQiniuToken();
    },
    components:{
        imgBox
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
          let promise = null;
          if(!!this.currentID){
            this.options.id = this.currentID;
            promise = updateAgentAppConfig;
          }else{
            promise = addAgentAppConfig;
          }
          promise(this.options).then(data => {
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
            linkId:'',	//链接id
            app:'',	//bu
            agentType:'',
            title:'',
            img:''
          }
        },
        getLinkList() {
            agentLinkList().then(data => {
              this.act_link_data = data;
            }).catch(message => {
              this.$Message({
                  message: message
              });
            });
        },
        // 七牛云token;
        _getQiniuToken() {
            this.$Fetch({
                url:'/api/agent/upToken',
                method:'get'
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.token = data;
                } else if (code == 1) {
                    this.$Message({
                        message:message
                    });
                } else {
                    this.$Message({
                        message:"调用后端数据失败"+message,
                        type:'error'
                    });
                }
            })
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
