<template>
    <div>
        <div id="container">
            <el-button type="info" size="small" :id="uploadId">上传图片</el-button>
            <zm-loading :width="'30'" :height="'30'" v-if="uploading" class="loading"></zm-loading>
        </div>
    </div>
</template>

<script>
    let qiniu = require('qiniujssdk');
    let QiniuJsSDk = new qiniu();
    import { QINIU_BASE_URL } from '../../data/index.js';
    export default {
        data() {
            return {
                uploading:false,
                platform:'teacher_'
            };
        },
        props:{
            url: {
                type:String,
                default:''
            },
            uploadId: {
                type:String,
                default:'pickfiles'
            },
            upToken: {
                type:String,
                default:''
            }
        },
        methods:{
            // 处理token过期 获取新token 再初始化
            handleUpToken() {
                this._getQiniuUpToken((upToken) => {
                    this.uploader.disableBrowse();
                    this.upToken = upToken;
                    this.init();
                });
            },
            // 获取七牛云upToken
            _getQiniuUpToken(cb) {
                this.$Fetch({
                    url:'/api/qiniu/upToken',
                    methods:'get'
                }).then((result) => {
                    if (result.code === '0') {
                        cb(result.data);
                    } else if (result.code === '1') {
                        this.$Message({
                            message:result.message
                        });
                    } else {
                        this.$Message({
                            message:'调用获取七牛UpToken'+result.message,
                            type:'error'
                        });
                    }
                });
            },
            // 初始化七牛云sdk
            init() {
                let that = this;
                this.uploader = QiniuJsSDk.uploader({
                    runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                    browse_button: that.uploadId,         // 上传选择的点选按钮，必需
                    // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                    // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                    // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                    uptoken : that.upToken, // uptoken是上传凭证，由其他程序生成
                    // uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                    // uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
                    //    // do something
                    //     // let uptoken;
                    //     // that._getQiniuUpToken((upToken) => {
                    //     //     console.log('upToken================>',upToken)
                    //     //     // uptoken = upToken;
                    //     // });
                    //     console.log('===================',that._getQiniuUpToken());
                    //     return 'D3T4cbncJQukSg8pBLMrelz1VQhIYj72lCfGzHVf:E7mzEzL9NhQPBME4hWGaXk9luKE=:eyJzY29wZSI6InptLW1hcmtldCIsInJldHVybkJvZHkiOiJ7XCJrZXlcIjpcIiQoa2V5KVwiLFwiaGFzaFwiOlwiJChldGFnKVwiLFwiYnVja2V0XCI6XCIkKGJ1Y2tldClcIixcImZzaXplXCI6JChmc2l6ZSl9IiwiZGVhZGxpbmUiOjE1MDY0ODM1NDB9';
                    // },
                    get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                    // downtoken_url: '/downtoken',
                    // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                    // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                    // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                    domain: QINIU_BASE_URL,     // bucket域名，下载资源时用到，必需
                    container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
                    max_file_size: '100mb',             // 最大文件体积限制
                    flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
                    max_retries: 3,                     // 上传失败最大重试次数
                    dragdrop: true,                     // 开启可拖曳上传
                    drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                  // 分块上传时，每块的体积
                    auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    //x_vars : {
                    //    查看自定义变量
                    //    'time' : function(up,file) {
                    //        var time = (new Date()).getTime();
                                // do something with 'time'
                    //        return time;
                    //    },
                    //    'size' : function(up,file) {
                    //        var size = file.size;
                                // do something with 'size'
                    //        return size;
                    //    }
                    //},
                    // 可以使用该参数来限制上传文件的类型，大小等，该参数以对象的形式传入，它包括三个属性：
                    filters : {
                        max_file_size : '100mb',
                        prevent_duplicates: false,
                        // Specify what files to browse for
                        mime_types: [
                            {title : "Image files", extensions : "jpg,jpeg,png"}, // 限定jpg,gif,png后缀上传
                        ]
                    },
                    init: {
                        'FilesAdded': function() {
                            // 参数 up, files
                            // plupload.each(files, function(file) {
                            //     console.log('file==========>',file);
                            //     // 文件添加进队列后，处理相关的事情
                            // });
                        },
                        'BeforeUpload': function() {
                            // 每个文件上传前，处理相关的事情 up, file
                            if (that.uploading) {
                                return false;
                            }
                        },
                        'UploadProgress': function() {
                                // 每个文件上传时，处理相关的事情 up, file
                            // var progress = new FileProgress(file, 'fsUploadProgress');
                            // var chunk_size = that.plupload.parseSize(this.getOption('chunk_size'));
                            // progress.setProgress(file.percent + "%", file.speed, chunk_size);
                            that.uploading = true;
                        },
                        'FileUploaded': function(up, file, info) {
                                // up, file, info
                                // 每个文件上传成功后，处理相关的事情
                                // 其中info是文件上传成功后，服务端返回的json，形式如：
                                // {
                                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                //    "key": "gogopher.jpg"
                                //  }
                                // 查看简单反馈
                            var domain = up.getOption('domain');
                            var res = JSON.parse(info.response);
                            var sourceLink = domain +"/"+ res.key; //获取上传成功后的文件的Url
                            that.uploading = false;
                            that.$emit('qiniu-suc', sourceLink);
                            that.$emit('update:url',sourceLink);
                        },
                        'Error': function(up, err, errTip) {
                            //上传出错时，处理相关的事情
                            that.$Message({
                                message:'七牛云:'+errTip,
                                type:'error'
                            });
                        },
                        // 'UploadComplete': function() {
                        //         //队列文件处理完毕后，处理相关的事情
                        // },
                        'Key': function(up, file) {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在unique_names: false，save_key: false时才生效
                            // do something with key here
                            let time =  new Date();
                            let mSeconds = time % 1000;
                            let date = that.$DateTool.format(time, 'yyyyMMddHHmmss');

                            let nameArr = file.name.split('.');
                            let filetype = nameArr[nameArr.length - 1];
                            filetype = filetype?'.'+filetype:'';

                            let result = that.platform + date + mSeconds + filetype;
                            return result;
                        }
                    }
                });
            }
        },
        mounted() {
            // this._getQiniuUpToken((upToken) => {
            //     this.upToken = upToken;
            //     this.init();
            // });
            this.init();
        },
    };
</script>
<style scoped lang="less">
    #container{
        color:black;
        display:flex;
        align-items:center;
        justify-content:flex-start;
        width:100px;
        .loading{
            height:28px;
        }
    }
</style>
