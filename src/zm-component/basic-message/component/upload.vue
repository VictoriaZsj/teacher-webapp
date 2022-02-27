<template>
    <div class="dami-upload">
      <div v-for="(item,index) in fileIDList" :key="item.fileID" class="dami-upload-item">
        <span v-show="item.imgSrc" @click="del(item,index)" class="del-img-icon">&times;</span>
        <img @click="preview(item,index)" :id="item.imgID" :src="!item.imgSrc ? addImgIcon : item.imgSrc" alt="" />
        <input v-show="(multiple == true && !item.imgSrc) || (multiple == false && !item.imgSrc)" type="file" @change="fileSelect(item.fileID,item.imgID,index)" :id="item.fileID" />
      </div>
      <preview-img :show="previewState" @close="closePreview" :imgPath="imgPath"></preview-img>
    </div>
</template>
<script>
    let addImgIcon = require('./upload.png');
    import previewImg from './preview-img'

    export default {
        name: 'upload',
        data () {
            return {
              addImgIcon:addImgIcon,
              previewState:false,
              imgPath:"",
              fileIDList:[
                {
                  imgID:"img-"+new Date().getTime(),
                  fileID:"dami-"+new Date().getTime(),
                  edit:false,
                  imgSrc:""
                }
              ]
            };
        },
        props:['multiple','action-url'],
        methods:{
          del(item,index){
            if(item.imgSrc == ""){
              return;
            }
            if(this.multiple == false){
              this.fileIDList = [
                {
                  imgID:"img-"+new Date().getTime(),
                  fileID:"dami-"+new Date().getTime(),
                  edit:false,
                  imgSrc:""
                }
              ]
              return;
            }
            this.fileIDList.splice(index,1);
          },
          preview(item,index){
            if(item.imgSrc == ""){
              return;
            }
            this.imgPath = item.imgSrc;
            this.previewState = true;
          },
          closePreview(){
            console.log("fff")
            this.previewState = false;
          },
          reset(){
            this.fileIDList = [
              {
                imgID:"img-"+new Date().getTime(),
                fileID:"dami-"+new Date().getTime(),
                edit:false,
                imgSrc:""
              }
            ]
          },
          initData(data){
            if(data.length == 0){
              return;
            }
            this.fileIDList = [];
            for(let i = 0; i < data.length; i++){
              this.fileIDList.push({
                imgID:"img-"+new Date().getTime() + i,
                fileID:"dami-"+new Date().getTime() + i,
                edit:true,
                imgSrc:data[i]
              });
            }
            if(this.multiple){
              this.fileIDList.push({
                imgID:"img-"+new Date().getTime(),
                fileID:"dami-"+new Date().getTime(),
                edit:false,
                imgSrc:""
              });
            }

          },
          upload(callback){
            let result = {
              code:1,
              message:''
            };
            if(!this.actionUrl){
              result.code = 0;
              result.message = "请配置图片上传URL";
              callback(result);
              return;
            }



            let fileList = [];
            for(let i = 0; i < this.fileIDList.length; i++){
              let fileID = this.fileIDList[i].fileID;
              if(document.getElementById(fileID).value != ""){
                fileList.push(fileID);
              }
            }
            if(fileList.length == 0){
              result.code = -1;
              result.message = "用户没有选择图片";
              result.oldImgpath = [];
              for(let i = 0; i < window.vueInstence.fileIDList.length; i++){
                let item = window.vueInstence.fileIDList[i];
                if(item.edit){
                  result.oldImgpath.push(item.imgSrc);
                }
              }

              callback(result);
              return;
            }
            window.MGFile.load(this.actionUrl, fileList, result => {
              callback(result);
            });
          },
          getFileUrl(sourceId) {
            if(document.getElementById(sourceId).value == ""){
              return "";
            }
            var url;
              if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
                url = document.getElementById(sourceId).value;
              } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
              } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
              }
            return url;
          },
          fileSelect(sourceID,imgID,index){
            var imgName = document.getElementById(sourceID).value;
            var idx = imgName.lastIndexOf(".");
            var ext = imgName.substr(idx+1).toUpperCase();
            ext = ext.toLowerCase();

            if (ext != 'jpg' && ext != 'png' && ext != 'jpeg' && ext != 'gif'){
                alert("只能上传.jpg  .png  .jpeg  .gif类型的文件!");
                document.getElementById(sourceID).value = "";
                return;
            }
            let size = document.getElementById(sourceID).files[0].size/1024/1024;
            if(size > 4){
              alert("图片大小不可以超过4兆!");
              document.getElementById(sourceID).value = "";
              return;
            }

            var url = this.getFileUrl(sourceID);
            var imgPre = document.getElementById(imgID);
            if(url == ""){
              url = addImgIcon;
            }
            imgPre.src = url;
            let _item = this.fileIDList[index];
            _item.imgSrc = url;
            this.fileIDList.splice(index,1,_item);
            if(this.multiple == true){
              this.fileIDList.push({
                imgID:"img-"+new Date().getTime(),
                fileID:"dami-"+new Date().getTime(),
                edit:false,
                imgSrc:""
              });
            }
          },
          initUpload(){
            (function (window) {
                var obj = {};
                obj.load = function (url, fileId, callback) {
                    var formData = new FormData();
                    if (typeof fileId == "string") {
                        var file = document.getElementById(fileId).files;
                        formData.append("MultipartFile", file[0]);
                    }
                    if (typeof fileId == "object") {
                        for (var a = 0; a < fileId.length; a++) {
                            var file = document.getElementById(fileId[a]).files;
                            formData.append("MultipartFile", file[0]);
                        }
                    }
                    var ajx = new XMLHttpRequest();
                    ajx.open("post", url, true);
                    ajx.onload = function () {
                        if (ajx.readyState == 4 && ajx.status == 200) {
                          let result = JSON.parse(ajx.responseText);
                          result.oldImgpath = [];
                          for(let i = 0; i < window.vueInstence.fileIDList.length; i++){
                            let item = window.vueInstence.fileIDList[i];
                            if(item.edit){
                              result.oldImgpath.push(item.imgSrc);
                            }
                          }
                          callback(result);
                        } else {
                          callback({
                            code:1,
                            message:'文件上传出错'
                          });
                        }
                    }
                    ajx.send(formData);
                }
                window.MGFile = obj;
            })(window);
          }
        },
        components:{
          'preview-img':previewImg
        },
        mounted () {
          this.initUpload();
          window.vueInstence = this;
        }
    };
</script>
<style scoped>
  .dami-upload{

  }
  .dami-upload-item{
    position: relative;
    width: 50px;
    height: 50px;
    display: inline-block;
    margin-right: 5px;
    margin-top: 5px;
  }
  .dami-upload-item .del-img-icon{
    display: inline-block;
    top: -5px;
    right: -6px;
    position: absolute;
    cursor: pointer;
    width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 18px;
    z-index: 10;
    text-align: center;
  }
  .dami-upload-item img,.dami-upload-item input[type='file']{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  }
  .dami-upload-item img{
    z-index: 0;
    max-width: 100%;
    max-height: 100%;
  }
  .dami-upload-item input[type='file']{
    opacity: 0;
    z-index: 1;
    width: 100%;
  }
</style>
