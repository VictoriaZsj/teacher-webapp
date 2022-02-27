<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">邮件正文</el-col>
        <el-col :span="20">
          <!-- <quill-editor
            v-model="options.content"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor> -->
          <div id="editorElem" style="text-align:left"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-show="options.defaultAttachmentList.length > 0" :span="4">默认附件</el-col>
        <el-col :span="20">
          <div v-for="(item,index) in options.defaultAttachmentList" class="defaultAttachment">
            <span class="text">{{item.attachmentName}}</span>
            <span @click="delDefaultAttachment(index)" class="control">删除</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">添加附件</el-col>
        <el-col :span="20">
          <zm-file ref="zmfile"></zm-file>
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

import getOfferMessageInfo from '../../api/select/getOfferMessageInfo'
import sendOffer from '../../api/action/sendOffer'
import E from 'wangeditor'
// import { quillEditor } from 'vue-quill-editor'

export default {
    data() {
        return {
            buttonState:false,
            options:{
                content:'',
                defaultAttachmentList:[],
                defaultAttachment:'',
                files:[]
            },
            editor:null,
            editorOption:{

            }
        }
    },
    props:{
        currentID:null,
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else{
          this.getUserOffer();
        }
      }
    },
    mounted:function(){
      this.editor = new E('#editorElem')
      this.editor.config.onchange = (html) => {
        this.options.content = html
      }
      this.editor.create()

      this.getUserOffer();
    },
    methods:{
        getUserOffer(){
          let parm = {
            teaId:this.currentID
          };
          getOfferMessageInfo(parm).then(data => {
            this.options.content = data.content;
            this.editor.txt.html(this.options.content)
            if(!!data.defaultAttachments){
              this.options.defaultAttachmentList = data.defaultAttachments;
            }
          }).catch(message => {
            console.log("getOfferMessageInfo异常:",message)
          });
        },
        delDefaultAttachment(index){
          this.options.defaultAttachmentList.splice(index,1);
        },
        getFileSize(eleId) {
        		try {
        			var size = 0;
        			size = document.getElementById(eleId).files[0].size;//byte
        			size = size / 1024;//kb
        			size = size / 1024;//mb
        			//alert('上传文件大小为' + size + 'M');
        			return size;
        		} catch (e) {
        			alert("错误：" + e);
        			return -1;
        		}
        },
        isNullFile(eleId){
          let isNull = false;
          if (document.getElementById(eleId).value == "")
          {
            isNull = true;
          }
          return isNull;
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
            let f = this.$refs.zmfile.fileIDs;
            this.buttonState = true;
            this.options.teaId = this.currentID;
            this.options.files = [];
            let error = "";
            let _totalSize = 0;
            for(let i = 0; i < f.length; i++){
              //判断是否全部选择了附件
              if(this.isNullFile(f[i].id)){

              }else{
                //判断是否存在附件大小超过2兆
                let _size = this.getFileSize(f[i].id);
                _totalSize = _totalSize + _size;
                if(_size > 2){
                  error = "第" + (i+1) + "个附件大小超过2兆,请重新上传";
                }else{
                  this.options.files.push(f[i].id);
                }
              }
            }
            if(!!error){
              this.$Message({
                  message: error
              });
              return;
            }
            if(_totalSize > 8){
              this.$Message({
                  message: "附件总和超过8兆,请删除不必要附件"
              });
              return;
            }
            //添加默认附件
            for(let i = 0; i < this.options.defaultAttachmentList.length; i++){
              this.options.defaultAttachment = this.options.defaultAttachment  + this.options.defaultAttachmentList[i].attachmentId + ',';
            }
            if(this.options.defaultAttachment != ''){
              this.options.defaultAttachment = this.options.defaultAttachment.substr(0, this.options.defaultAttachment.length - 1);
            }
            sendOffer(this.options).then(data => {
              this.buttonState = false;
              if(data.code == 0){
                this.$Message({
                    message: "发送成功"
                });
                this.$emit("confirm");
                this.default();
              }else{
                this.$Message({
                    message: data.message
                });
              }

            }).catch(message => {
                this.$Message({
                    message: message
                });
                this.buttonState = false;
            });
        },
        default () {
          this.options = {
              content:'',
              defaultAttachmentList:[],
              defaultAttachment:'',
              files:[]
          };
          this.buttonState = false;
          this.$refs.zmfile.clearData();
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
    .defaultAttachment{
    }
    .defaultAttachment .text{
      margin-right: 10px;
    }
    .defaultAttachment .control{
      cursor: pointer;
    }
</style>
