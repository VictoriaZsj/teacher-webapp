<template>
    <div>
        <div class="dia1">
            <el-dialog
                v-model="dialogVisible"

                :before-close="close">
                <el-button plain slot='title' @click='getTimeNum'>获取标签实时人数</el-button>
                <div style="height:30px">
                <div style="float:right">
                    <span style="margin-right:10px">定时发送</span>
                    <el-switch
                        v-model="regularSend"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change='handleRegularSend'>
                    </el-switch>
                    </div>
                </div>

                <div class="top">
                    <div>
                        <p>获取群链接：钉钉群→右上角【...】→群二维码→群链接→复制链接</p>
                        <p style="color:red" >标签条件需要和消息事件中的约束条件一致，否则会出现收不到邮件的情况，事件ID：E_ZS_TRAIN_NOTICE_B， <span @click="open" style="color:#007fff;cursor:pointer">点击查看</span></p>

                    </div>

                    <div>
                        <el-button @click="addTag()" size="small">+ 新增标签</el-button>
                    </div>
                </div>

                <el-table
                    :data="tableData"
                    :height="height"
                    border
                    style="width: 100%">
                    <el-table-column
                    align="center"
                    label="此标签当前讲师数量"
                    >
                    <template scope='prop'>
                        <p v-show='!prop.row.getNumFlag'>可点击左上角获取</p>
                        <p v-show='prop.row.getNumFlag&&(prop.row.num==null)'>实时人数计算中...</p>
                       <p v-show='prop.row.getNumFlag&&prop.row.num!=null'>{{prop.row.num}}</p>
                    </template>

                     </el-table-column>
                    <el-table-column
                    align="center"
                    prop="tagValue"
                    label="标签名称"
                    >

                    </el-table-column>
                    <el-table-column
                    prop="description"
                    label="标签描述"
                    align="center"
                    >
                    </el-table-column>
                    <el-table-column  label="进群链接"  align="center" width='600px'>
                        <template scope="prop">
                            <div v-for="(item,key) in prop.row.joinUrlList" v-show='prop.row.joinUrlList.length' class="joinUrlList" :key="key">
                                 <el-popover
                                      v-if="item.url"
                                         placement="top-start"
                                            trigger="hover"
                                            :content="item.url"
                                            popper-class="my-popper-d"
                                        >
                                      <!-- <div style="width:200px;word-break:break-word;">
                                      {{item.url}}
                                      </div>   -->
                                     <el-input slot="reference"  v-model="item.url" placeholder="请输入进群链接"   class='inputList'></el-input >

                                 </el-popover>
                                  <el-input v-else  v-model="item.url" placeholder="请输入进群链接"   class='inputList'></el-input >
                                 <el-button type="success" class="leftTag" :class="{'red':item.num==item.maxNum}" v-show="item.urlId">{{item.num}}/{{item.maxNum}}</el-button>
                                 <el-button type="primary" @click='handleAddTag(prop.row.joinUrlList)' class="addTag">增加群</el-button>
                                  <el-button type="primary"   @click='handleDelTag(prop.row.joinUrlList,item,key)' class="delTag">删除群</el-button>
                                 <img class="edit" src='../../../../src/images/edit.jpg' @click="handleNum(item)"></img>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="updateTime"
                        align="center"
                        label="更新时间" width='120'>
                    </el-table-column>
                    <el-table-column
                    align="center"
                        prop="lastOperatorName"
                        label="更新人" width='120'>
                    </el-table-column>
                    <el-table-column align="center" label="操作"  width="200">
                        <template scope="scope">
                            <el-button type="text" @click="editTag(scope.row.id)">编辑</el-button>
                            <el-button type="text" @click="delTag(scope.row.id)">删除</el-button>
                            <el-button type="text" @click="showTag(scope.row.id)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNo"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="total">
                    </el-pagination>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="close">取 消</el-button>
                    <el-button plain @click="confirmNotice('saveAndSend')">保存并立即发送</el-button>
                    <el-button type="primary" @click="confirmNotice('save')">仅保存进群链接</el-button>
                </span>
            </el-dialog>
        </div>
        <el-dialog
            title="删除标签"
            v-model="delDialog"
            width="300px"
            >
            <span></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleDel(tag_id)">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改发送人数上限"
            v-model="editDialog"
            width="20%"
            class="editDialog"
            :close-on-click-modal='false'
            @close='handleCloseNum'
           >
          <div class="titleTip">上限不可低于此进群链接已发送人数</div>
            <br>
          <el-input v-model="maxSendNum" placeholder="" style="width:30%;margin-right:20px" @input="setNum(maxSendNum)" :class="{'tipBoder':tipBoder}"  @focus='handleFocus'></el-input>
          <el-button type="success"  class="leftTag" :class="{'red':saveItem.num==saveItem.maxNum}" v-show="saveItem.urlId">{{saveItem.num}}/{{saveItem.maxNum}}</el-button>
          
          <p style="color:#ea0020" v-show="showTip"> {{showTip}}</p>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialog = false"  style="border-radius:4px;">取 消</el-button>
            <el-button type="primary"  @click="saveSendNum" style="border-radius: 4px;" :disabled="showTip!=''">确 定</el-button>
          </span>
        </el-dialog>
        <tea-tag ref="teaTag" @success="success" > </tea-tag>
    </div>
</template>

<script>
    import teaTag from './teaTag'
    import fetch from '../../../../src/utils/fetch';
    import { MessageBox } from 'element-ui';
import treeVue from '../../../../src/components/tree/tree.vue';

    export default {
        data(){
            return{
                showTip:'',
                tipBoder:false
                ,
                maxSendNum:"",
                editDialog:false,
                isEdit:true,
                isMouse:false,
                delDialog:false,
                dialogVisible:false,
                tableData:[],
                pageSize:20,
                pageNo:1,
                total:0,
                teacherIds:[],
                tag_id:'',
                regularSend:false,
                breakFlag:false,
                delIds:[],
                saveItem:{},
                height:300
            }
        },
        components:{
            teaTag
        },
        props:{
            showQun_LinkDialog:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            maxSendNum(val){
                  console.log(999999)
                  if(val=='0'){
                         this.maxSendNum=''
                          this.tipBoder=true
                         this.showTip='上限必须大于0';
                    }
                // const validRule = /^1[0-9]{10}$/;
                // if (!validRule.test(val)) {
                //     this.maxSendNum = val;
                // }
            },
            tableData:{
                handler:(val)=>{
                },
                deep:true
            }
        },
        methods:{
            // aaa(event){
            //     return /[\d]/.test(String.fromCharCode(event.keyCode))
            // },
                handleCloseNum(){
                    this.showTip='';
                    this.tipBoder=false
                },
                setNum(url) {
                     setTimeout(() => {
                        
                        var reg = /^\d+$/;
                        if (!reg.test(url)) {
                        let copy = String(url);
                        let copyLength = copy.length;
                       this.maxSendNum = copy.substring(0, copyLength - 1);
                        }
                    }, 0);
                    console.log("dataKey", url);
                    if(!url){
                        this.showTip='';
                    }else if(url==0){
                         this.maxSendNum=''
                          this.tipBoder=true
                         this.showTip='上限必须大于0';
                    }else if(url&&url<this.saveItem.num){
                    this.showTip='上限不可低于已发送人数';
                     this.tipBoder=true
                        
                    }else if(url>5000){
                        this.showTip='上限不可高于5000';
                        this.tipBoder=true
                        
                    }else{
                         this.showTip='';
                         this.tipBoder=false
                    }
                   
                 },
                // console.log(999999)
                // item.url=item.url.replace(/[^\.\d]/g,'');
                // item.url=item.url.replace('.','')
            
            handleFocus(){
                this.showTip='';
                this.tipBoder=false
            },
            handleNum(item){
              this.saveItem=item;
              this.maxSendNum=this.saveItem.maxNum;
              this.editDialog=true;
              // this.$Fetch({
              //   url: `/api/teacherTrainNotice/getTagTeacherNum`,
              //   method: 'POST',
              //   data:{
              //     ids: [item.id]
              //   }
              // }).then((res) => {
              //   const { code, data, message } = res;
              //   item.num=data[0].num
              //
              //   console.log('getTagTeacherNum',data[0].num)
              //
              // }).catch(err=>{
              //   this.$Message.error('err:'+err)
              // })
            },
            saveSendNum(){
                if(!this.maxSendNum){
                    this.showTip='请设置发送人数上限';
                    this.tipBoder=true
                    return
                }else{
                this.showTip=''
                this.tipBoder=false
                }
                this.$Fetch({
                    url: `/api/teacherTrainNotice/updateMaxSendNum`,
                    method: 'post',
                    data: {
                       "maxSendNum": this.maxSendNum,
                       "urlId": this.saveItem.urlId
                    }
                }).then((res) => {
                    const { code, data, message } = res;
                    this.maxSendNum='';
                    this.$Message.success('修改成功')
                    this.editDialog=false ;
                     this.getList();
                     setTimeout( this.getTimeNum,1000)
                    
                }).catch(err=>{
                    this.$Message.error('err:'+err)
                })
            },
            getTimeNum(){
                let flag=this.tableData.some(item=>{
                    return item.getNumFlag&&item.num==null
                })
                if(flag){
                    this.$message.warning('还有数据未计算完毕，不可再次获取')
                    return false
                }
                this.tableData.forEach(item=>{
                    item.getNumFlag=true;
                    item.num=null;
                    this.$Fetch({
                    url: `/api/teacherTrainNotice/getTagTeacherNum`,
                    method: 'POST',
                    data:{
                       ids: [item.id]
                    }
                    }).then((res) => {
                        const { code, data, message } = res;
                            item.num=data[0].num

                        console.log('getTagTeacherNum',data[0].num)

                    }).catch(err=>{
                        this.$Message.error('err:'+err)
                    })
                })

            },
            getRegularSend(){
                this.$Fetch({
                    url: `/api/teacherTrainNotice/getRegularlySend`,
                    method: 'post',
                }).then((res) => {
                    const { code, data, message } = res;
                    this.regularSend=data.sysValue
                    // this.$Message.success('')

                }).catch(err=>{
                    this.$Message.error('err:'+err)
                })
            },
            handleRegularSend(){
                 this.$Fetch({
                    url: `/api/teacherTrainNotice/putRegularlySend`,
                    method: 'post',
                    data: {
                       regularSend:this.regularSend
                    }
                }).then((res) => {
                    const { code, data, message } = res;

                    // this.$Message.success('')

                }).catch(err=>{
                    this.$Message.error('err:'+err)
                })
            },
            handleDelTag(arr,item,index){
                let callback=()=>{
                     if(arr.length==1&&index==0){
                     arr.splice(index,1)
                    arr.push({
                        url:''
                    })

                    }else{
                        arr.splice(index,1)
                    }
                }
                if(item.urlId){
                    this.$MessageBox.confirm('确认删除当前群链接?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.delIds.push(item.urlId)
                            callback()
                        }).catch(() => {

                        });
                }else{
                    callback()
                }


            },
            handleAddTag(arr){
                arr.push({
                    url:''
                })
            },

            onBlur(row){
                row.isBlur=true
            },
            onFocus(row){
                row.isBlur=false
            },
            handleMouseOver(row){
                row.isMouse=true;
            },
            saveUrl(row){
                this.$Fetch({
                    url: `/api/teacherTrainNotice/updateJoinUrl`,
                    method: 'post',
                    data: {
                        id:row.id,
                        joinUrl:row.joinUrl
                    }
                }).then((res) => {
                    const { code, data, message } = res;
                    row.isEdit=true
                    this.$Message.success(message)

                }).catch(err=>{
                    this.$Message.error('err:'+err)
                })
            },
            handleChange(val,row){
                if(val){
                    row.isEdit=false
                }else{
                    row.isEdit=true
                }


            },
            handleIconClick(){

            },
            open(){
                let url=''
                process.env.NODE_ENV == 'development'?url='https://p-test.zmlearn.com/message/#/msg-center/event':process.env.NODE_ENV == 'uat'?url='http://p.uat.zmops.cc/message/#/msg-center/event':url='https://www.zmlearn.com/message/#/msg-center/event'
                window.open(url)
            },
            success(){
                this.getList()
            },
            editTag(id){
                this.$refs.teaTag.init('edit',id)
            },
            showTag(id){
                this.$refs.teaTag.init('show',id)
            },

            addTag(){
                this.$refs.teaTag.init('add')
            },

            delTag(id){

            this.$MessageBox.confirm(`删除标签后，不可恢复，请谨慎处理`, '删除标签', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tag_id=id
                this.handleDel(id)
                })
            },
            handleDel(id){
                this.$Fetch({
                url: `/api/teacherTrainNotice/deleteTag`,
                method: 'post',
                data: {
                    id:id
                }
            }).then((res) => {
                const { code, data, message } = res;
                this.tag_id=''
                this.getList();
                this.delDialog=false;
                this.$Message.success(message)

            }).catch(err=>{
                this.$Message.error('err:'+err)
            })
            },


            handleSizeChange(val){
                this.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val){
                this.pageNo = val;
                this.getList();
            },
            close(){
                this.dialogVisible = false
                this.$emit('close',false)
            },
            confirmNotice(type){

                this.breakFlag=false
                 let trainNoticeTagDtos=[]

                 trainNoticeTagDtos= this.tableData.map(item=>{
                    let arr =item.joinUrlList.map(i=>{
                        if(i.url==''){
                            this.breakFlag=true
                        };
                        return {
                            urlId:i.urlId,
                            url:i.url
                        }
                    });
                    return {
                        id:item.id,
                        joinUrlList:arr
                    }
                });
                // if(this.breakFlag){
                //     this.$Message.warning('请补充所有进群链接')
                //     return
                // }
                console.log('trainNoticeTagDtos:',trainNoticeTagDtos)

                this.$Fetch({
                    url: `/api/teacherTrainNotice/updateJoinUrls`,
                    method: 'post',
                    data: {
                        "teaIds": this.teacherIds,
                        "optType":type,
                        "delIds":this.delIds,
                        "trainNoticeTagDtos":trainNoticeTagDtos
                    }}).then((res) => {
                        let {code,data,message}=res;
                        if(code==0){
                            // this.teacherIds=[]
                            if(type=='save'){
                                this.$Message.success(
                                    '保存成功'
                                )
                                this.getList();
                            }else{


                                        // let strArr=[];
                                        // data.forEach(i=>{

                                        //     strArr.push(i.teaName)
                                        //     this.teacherIds.push(i.teaId)
                                        // });

                                        // let teaName=strArr.slice(0,2).join(',');
                                        // if(data.length>1){
                                        //     teaName=teaName+'...';
                                        // }
                                        // this.$MessageBox.confirm(`提示：${teaName}不存在当前配置的标签中，可能无法收到邮件，请新增/完善标签条件`, '提示', {
                                        //     confirmButtonText: '去完善标签',
                                        //     type: 'warning'
                                        // }).then(() => {
                                        //     data.forEach(item=>{
                                        //         this.teacherIds.push(item.teaId)
                                        //     })
                                        // })

                                // let html= `<p>发送成功${data.successNum}条，发送失败${data.failNum}条</p>`

                                // if(data.failNum){
                                //     html+=`</br><p>发送失败原因：${data.failMessage}</p><span>提示：请手动补充进群链接<span>`
                                // }
                                this.dialogVisible = false
                                this.$emit('close',false,'success')

                                let html= `发送成功${data.successNum}条，发送失败${data.failNum}条;`

                                if(data.failNum){
                                    html+=`发送失败原因：${data.failMessage}  ；提示：请手动补充进群链接`
                                }
                                this.$alert(html ,'',{
                                    dangerouslyUseHTMLString:true,
                                    confirmButtonText: '我知道了',
                                    center: true
                                }).then(() => {


                                })
                            }
                        }else{

                        }
                }).catch(message => {
                        this.$Message.error(message);
                    })
            },
            init(val,list){
                this.pageNo=1;
                this.dialogVisible=val;
                this.teacherIds=list;
                this.getList();
                this.getRegularSend()
            },
            getList(){
                fetch({
                url: `/api/teacherTrainNotice/selectTagList`,
                method: 'post',
                data: {
                    pageNo : this.pageNo ,
                    pageSize:this.pageSize
                }
            }).then((res) => {
                const { code, data, message } = res;
                if (code == 0 && (data !== null || data !== '')) {
                  this.tableData=data.list;
                //   this.tableData=this.tableData.concat(this.tableData)
                //   this.tableData=this.tableData.concat(this.tableData)
                  if(this.tableData.length>3){
                      this.height=500
                  }else{
                      this.height=300
                  }
                  this.tableData.forEach(item=>{
                      this.$set(item,'getNumFlag',false)
                      this.$set(item,'num',null)
                      if(!item.joinUrlList||item.joinUrlList.length==0){
                          item.joinUrlList=[];
                          item.joinUrlList.push(
                              {
                                  url:'',
                              }
                          )
                      }
                    //   this.$set(item,'isBlur',true)
                  })
                  this.total=data.total
                } else {
                  reject("数据不存在");
                }
            })
            }
        },

       
        mounted(){

        }
    }
</script>
<style lang="less" >




    .top{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .dia1{

        .el-dialog--small{
            width: 75%;
        }
        .el-dialog__body{
            width: 100%;
            background-color: #ffffff;
            .el-table .cell{
            width: 90%;
            }
            .el-table .el-input__inner{
            padding-right: 25px;
            }
        }
    }

    .edit{
        right: 10px;
        top:22px;
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin-top: 6px;
        margin-right: 20px;
        z-index: 0;
       float: right;
    }
    .isEdit{

    }
    .qun_link{
        overflow: hidden;
        word-break: break-all;word-wrap: break-word;
    }
    .joinUrlList{
        text-align:left;
        margin-bottom: 10px;
        .leftTag{
            min-width:75px;
               border: 1px solid #d4f1ae;
                background: #ebf9dd;
                color: #7dd608;
                border-radius: 5px;
            &.red{
            background: #fbdedb;
            border: 1px solid red;
            color: red;
            &.el-button--success:focus{
                    border:  1px solid red;
                background: #fbdedb;
                color:red;
                }
                 &.el-button--success:hover{
                    border:  1px solid red;
                background: #fbdedb;
                color:red;
                }
            }
        }
        .delTag{
                border: 1px solid red;
                background: #fff;
                color: red;
                border-radius: 5px;
                float: right;
            }
        .addTag{
            border: 1px solid #007fff;
            background: #fff;
            color: #007fff;
            border-radius: 5px;
            float:right;
            margin-left: 10px;
        }

        .inputList{
            width:40%;
            margin-right:10px;
            .el-input__inner{
                color: #409eff;
                border-radius: 15px;
                background-color: #f5f9fb;
            }
        }
      .editDialog{
        
        .el-dialog{
           .el-dialog__header{
               border:none
           }
          .el-dialog__body{
            background: #fff;
          }
          .el-dialog__title{
            font-size: 20px;
          }
          .el-dialog__footer{
            background: #fff;
            .dialog-footer{
                .el-button{
                    border-radius: 5px;
                }
            }
            
          }
          
        }

      }
    }
     .leftTag{
                min-width:75px;
               border: 1px solid #d4f1ae;
                background: #ebf9dd;
                color: #7dd608;
                border-radius: 5px;
                &.red{
                background: #fbdedb;
                border: 1px solid red;
                color: red;
                }  
                &.el-button--success:focus{
                    border: 1px solid #d4f1ae;
                background: #ebf9dd;
                color: #7dd608;
                }
                 &.el-button--success:hover{
                    border: 1px solid #d4f1ae;
                background: #ebf9dd;
                color: #7dd608;
                }
        }
        .el-dialog__body{
            padding-top: 0;

            background: #fff;
          }
          .el-dialog__footer{
            background: #fff;
           
            
          }
          .titleTip{
            font-size: 14px;
            padding: 9px 20px;
            margin: 0 -20px;
            height: 40px;
            background: rgb(238, 238, 238);
            color: #7b7b7bee;
          }
          .tipBoder{
              .el-input__inner{
                  border-color:red
              }
          }

          .my-popper-d{
              width:200px;word-break:break-word;
          }
</style>
