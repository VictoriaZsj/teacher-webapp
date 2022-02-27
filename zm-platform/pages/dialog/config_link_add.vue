<template>
  <div>
    <div style="overflow:hidden;max-height: 800px; " class="content">
      <el-row>
        <el-col :span="4">链接用途</el-col>
        <el-col :span="20">
            <el-input type="textarea" :rows="2" v-model="option.linkname" placeholder="请输入链接用途"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">邀请好友图片</el-col>
        <el-col :span="20">
          <!--因SEM-1632 改造, 使用zm-uploader组件-->
          <!-- <zm-upload
            v-if="token"
            :upToken="token"
            :uploadId="'uploadInvite'"
            class="btn"
            :url="option.invitfriendpic"
            @update:url="val => option.invitfriendpic = val"  style="float: left; width:80px;">
          </zm-upload> -->
          <zm-uploader @update:url="val => option.invitfriendpic = val" style='float: left; margin-right: 10px;' />
          <img-box :imgsrc="option.invitfriendpic" style="float:left; margin-right:10px;"></img-box>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">我的推荐图片</el-col>
        <el-col :span="20">
          <zm-uploader @update:url="val => option.recommendedpic = val" style='float: left; margin-right: 10px;' />
          <img-box :imgsrc="option.recommendedpic" style="float:left; margin-right:10px;"></img-box>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">推荐攻略图片</el-col>
        <el-col :span="20">
          <zm-uploader @update:url="val => option.recommendedstrategypic = val" style='float: left; margin-right: 10px;' />
          <img-box :imgsrc="option.recommendedstrategypic" style="float:left; margin-right:10px;"></img-box>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">累计收益图片</el-col>
        <el-col :span="20">
          <zm-uploader @update:url="val => option.accumulatedincomepic = val" style='float: left; margin-right: 10px;' />
          <img-box :imgsrc="option.accumulatedincomepic" style="float:left; margin-right:10px;"></img-box>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">推荐规则图片</el-col>
        <el-col :span="20">
          <zm-uploader @update:url="val => option.recommendedrulepic = val" style='float: left; margin-right: 10px;' />
          <img-box :imgsrc="option.recommendedrulepic" style="float:left; margin-right:10px;"></img-box>
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
import imgBox from '../agent_referral/imgbox.vue';
import addAgentLink from '../../api/action/addAgentLink';

export default {
    data() {
        return {
            token:'',
            buttonState:false,
            option:{
              linkname:'',
              invitfriendpic:'',//邀请好友图片
              recommendedpic:'',//我的推荐图片
              recommendedstrategypic:'',//推荐攻略图片
              accumulatedincomepic:'',//累计收益图片
              recommendedrulepic:'',//推荐规则图片
            }
        }
    },
    props:{
        configLinkId:"",
        optiondata:{},
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else{
          this.initOption();
        }
      }
    },
    methods:{
        initOption(){
          if(!!this.configLinkId){
            this.option.linkname = this.optiondata.linkname;
            this.option.invitfriendpic = this.optiondata.invitfriendpic;//邀请好友图片
            this.option.recommendedpic = this.optiondata.recommendedpic;//我的推荐图片
            this.option.recommendedstrategypic = this.optiondata.recommendedstrategypic;//推荐攻略图片
            this.option.accumulatedincomepic = this.optiondata.accumulatedincomepic;//累计收益图片
            this.option.recommendedrulepic = this.optiondata.recommendedrulepic;//推荐规则图片
          }
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
          if(this.configLinkId){
            this.option.id = this.configLinkId;
          }
          this.buttonState = true;
          addAgentLink(this.option).then(data => {
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
            linkname:'',
            invitfriendpic:'',//邀请好友图片
            recommendedpic:'',//我的推荐图片
            recommendedstrategypic:'',//推荐攻略图片
            accumulatedincomepic:'',//累计收益图片
            recommendedrulepic:'',//推荐规则图片
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
      this.initOption();
      this._getQiniuToken();
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
