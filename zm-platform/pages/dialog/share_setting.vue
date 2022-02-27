<template>
  <div>
    <div style="overflow:hidden;" class="content">
      <el-row>
        <el-col :span="4">分享标题</el-col>
        <el-col :span="20">
            <el-input type="textarea" :rows="2" v-model="option.sharetitle" placeholder="请输入分享标题"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">分享内容</el-col>
        <el-col :span="20">
            <el-input type="textarea" :rows="2" v-model="option.shareContent" placeholder="请输入分享内容"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">分享缩略图</el-col>
        <el-col :span="20">
          <zm-upload
            v-if="token"
            :upToken="token"
            :uploadId="'uploadInvite'"
            class="btn"
            :url="option.sharethumbnail"
            @update:url="val => option.sharethumbnail = val"  style="float: left; width:80px;">
          </zm-upload>
          <img-box :imgsrc="option.sharethumbnail" style="float:left; margin-right:10px;"></img-box>
          <span style="color:red;">*图片大小应在50kb以内</span>
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
import saveActivtyShareConfig from '../../api/action/saveActivtyShareConfig';
import agentActivtyConfig from '../../api/select/agentActivtyConfig';

import imgBox from '../agent_referral/imgbox.vue';

export default {
    data() {
        return {
            token:'',
            buttonState:false,
            option:{
              shareContent:'',	//分享内容
              sharethumbnail:'',	//分享缩略图	string	body	true
              sharetitle:'',	//分享标题
            }
        }
    },
    props:{
        configLinkId:"",
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else{
          this.getAgentActivtyConfig();
        }
      }
    },
    methods:{
        getAgentActivtyConfig(){
          if(!this.configLinkId){
            return;
          }
          agentActivtyConfig({agentActivityId:this.configLinkId}).then(data => {
            this.option.shareContent = data.shareContent;	//分享内容
            this.option.sharethumbnail = data.sharethumbnail;	//分享缩略图	string	body	true
            this.option.sharetitle = data.sharetitle;	//分享标题
          }).catch(message => {
            this.$Message({
                message: message
            });
          });
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
          if(this.configLinkId){
            this.option.id = this.configLinkId;
          }
          this.buttonState = true;
          saveActivtyShareConfig(this.option).then(data => {
            this.$emit("confirm");
            this.buttonState = false;
          }).catch(message => {
            this.$Message({
                message: message
            });
            this.buttonState = false;
          });
        },
        default () {
          this.option = {
            shareContent:'',	//分享来源:QQ,微信，朋友圈。。。(待定)	string	body	true
            sharethumbnail:'',	//分享缩略图	string	body	true
            sharetitle:'',	//分享标题
          }
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
    },
    mounted:function(){
      this._getQiniuToken();
      this.getAgentActivtyConfig();
    },
    components:{
        imgBox
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
