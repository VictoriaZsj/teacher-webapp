<template>
    <div class="context context-referral">
        <main-tab :titleList="titleList" :activeIndex="activeIndex" @onTabClick="handleTabClick"></main-tab>
        <div class="context-body">
            <el-form :model="referralConfig" ref="ruleForm" :rules="rules">
                <Spin fix v-if="spinFlag" style="top:0px;z-index:1001;"></Spin>
                <el-form-item label="推荐招师类型:"  class="zm-form-item img-item">
                    <el-select v-model="referralConfig.recommendRecruitType" multiple placeholder="请选择">
                        <el-option label="兼职" value="0"></el-option>
                        <el-option label="全职" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="编辑介绍页面:" prop='recommendImage' class="zm-form-item img-item">
                    <zm-upload @qiniu-suc="uploadSuccess" v-if="token" :upToken="token" :uploadId="'uploadRecommendImage'" class="btn" :url="referralConfig.recommendImage" @update:url="val => referralConfig.recommendImage = val"></zm-upload>
                    <img-box :imgsrc="referralConfig.recommendImage"></img-box>
                    <span class="tip">点击图片查看大图</span>
                </el-form-item>
                <el-form-item  label="配置代理信息:" prop='agentInfo' class="zm-form-item">
                    <el-select v-model="referralConfig.agentInfo" multiple placeholder="请选择">
                        <el-option label="姓名" value="0"></el-option>
                        <el-option label="学校" value="1"></el-option>
                        <el-option label="手机号" value="2"></el-option>
                        <el-option label="验证码" value="3"></el-option>
                        <el-option label="支付宝账号" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="编辑分享页面:" prop='shareImage' class="zm-form-item img-item">
                    <zm-upload @qiniu-suc="uploadSuccess" v-if="token" :upToken="token" :uploadId="'uploadShareImage'" class="btn" :url="referralConfig.shareImage" @update:url="val => referralConfig.shareImage = val"></zm-upload>
                    <img-box :imgsrc="referralConfig.shareImage"></img-box>
                    <span class="tip">点击图片查看大图</span>
                </el-form-item>
                <el-form-item  label="配置分享图标:" prop='weixinShareImage' class="zm-form-item img-item">
                    <zm-upload @qiniu-suc="uploadSuccess" v-if="token" :upToken="token" :uploadId="'uploadWeixinShareImage'" class="btn" :url="referralConfig.weixinShareImage" @update:url="val => referralConfig.weixinShareImage = val"></zm-upload>
                    <img-box :imgsrc="referralConfig.weixinShareImage"></img-box>
                </el-form-item>
                <el-form-item label="配置分享主标题:" prop='shareTitle' class="zm-form-item">
                    <el-input v-model="referralConfig.shareTitle" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="配置分享副标题:" prop='shareTitle2' class="zm-form-item">
                    <el-input v-model="referralConfig.shareTitle2" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item :label="activeTabName+'奖励规则:'" class="zm-form-item">
                    <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="referralConfig.rule" :maxlength="200"></el-input> -->
                    <!-- <el-table ref='table' :data="tableData" style="width:300px;">
                        <el-table-column :label="'推荐人数(≥人)'" align="center">
                            <template scope="scope">
                                <div>
                                    <el-input v-model="scope.row.num"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="'奖励(元/人)'" align="center">
                            <template scope="scope">
                                <el-input v-model="scope.row.points"></el-input>
                            </template>
                        </el-table-column>
                    </el-table> -->
                    <div class="rule-wrapper">
                        <ul class="rule-item">
                            <li>推荐人数(人)≥
                                <el-input placeholder="0" disabled></el-input>
                            </li>
                            <li>奖励(元/人)
                                <el-input v-model.number="referralConfig.firstAmount"></el-input>
                            </li>
                        </ul>
                        <ul class="rule-item">
                            <li>推荐人数(人)≥
                                <el-input v-model.number="referralConfig.firstCount"></el-input>
                            </li>
                            <li>奖励(元/人)
                                <el-input v-model.number="referralConfig.secondAmount"></el-input>
                            </li>
                        </ul>
                        <ul class="rule-item">
                            <li>推荐人数(人)≥
                                <el-input v-model.number="referralConfig.secondCount"></el-input>
                            </li>
                            <li>奖励(元/人)
                                <el-input v-model.number="referralConfig.thirdAmount"></el-input>
                            </li>
                        </ul>
                    </div>
                </el-form-item>
                <el-form-item label="教师APP宣传:" prop='publicTitle' class="zm-form-item">
                    <el-input v-model="referralConfig.publicTitle" :maxlength="50"></el-input>
                    <span class="text">这条是公共的，显示在我的推荐顶部的宣传语</span>
                </el-form-item>
                <el-form-item label="" class="zm-form-item">
                    <el-button class="search-btn" type="info" size="small" @click="confirm('ruleForm')">确认</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import imgBox from './imgbox.vue';
    // import axios from 'axios';
    export default {
        data() {
            return {
                activeIndex:0,
                activeTabName:'兼职',
                referralConfig:{
                    recommendImage:'',
                    agentInfo:[],
                    shareImage:'',
                    weixinShareImage:'',
                    shareTitle:'',
                    shareTitle2:'',
                    firstAmount:'',
                    secondCount:'',
                    secondAmount:'',
                    firstCount:'',
                    thirdAmount:'',
                    publicTitle:'',
                    recommendRecruitType:''
                },
                title:'',
                rules:{
                    recommendRecruitType: [
                        { type: 'array', message: '请选择一个选项', trigger: 'change' }
                    ],
                    type: [
                        { type: 'array', required: true, message: '请选择一个选项', trigger: 'change' }
                    ],
                    recommendImage: [
                        { type:'string',required: true, message: '请上传',trigger:'change'}
                    ],
                    agentInfo: [
                        { type: 'array', required: true, message: '请选择一个选项', trigger: 'change' }
                    ],
                    shareChannel: [
                        { type: 'array', required: true, message: '请选择一个选项', trigger: 'change' }
                    ],
                    shareImage: [
                        { required: true, message: '请上传', trigger: 'change' }
                    ],
                    weixinShareImage: [
                        { required: true, message: '请上传', trigger: 'change' }
                    ],
                    shareTitle: [
                        { required: true, message: '请输入', trigger: 'blur' },
                    ],
                    shareTitle2: [
                        { required: true, message: '请输入', trigger: 'blur' },
                    ],
                    rule: [
                        { required: true, message: '请输入', trigger: 'blur' },
                    ],
                    publicTitle: [
                        { required: true, message: '请输入', trigger: 'blur' },
                    ],
                },
                token:'',
                spinFlag:false,
                tableData:[
                    {num:0,points:35},
                    {num:5,points:40},
                    {num:10,points:50}
                ]
            }
        },
        props: {
            titleList: {
                type: Array
            }
        },
        computed: {
            formDataSearch() {
                let temp = {};
                for(let key in this.referralConfig) {
                    if ( typeof this.referralConfig[key] === 'string' || typeof this.referralConfig[key] === 'number') {
                        temp[key] = this.referralConfig[key];
                    } else if ( typeof this.referralConfig[key] === 'object' && Object.prototype.toString.call(this.referralConfig[key]) === '[object Array]' ) {
                        temp[key] = this.referralConfig[key].join(',');
                    }
                }
                temp.workType = this.workType;
                return temp;
            },
            workType() {
                if (this.activeIndex === 0) {
                    return 0;
                } else if (this.activeIndex === 1) {
                    return 2;
                }
            }
        },
        methods:{
            handleTabClick(tab) {
                this.activeIndex = tab.index;

                this.activeTabName = tab.item;

                this._getAgent(this.workType);
            },
            confirm(formName) {
                // let rules= this.tableData;
                if(this.referralConfig.firstCount >= this.referralConfig.secondCount || this.referralConfig.firstAmount >= this.referralConfig.secondAmount || this.referralConfig.secondAmount >= this.referralConfig.thirdAmount) {
                    this.$Message({
                        message:'奖励规则有误,请按顺序'
                    })
                    return;
                }
                // for(var i=1;i<rules.length;i++) {
                //     if(rules[i-1].num >= rules[i].num) {
                //         this.$Message({
                //             message:'奖励规则有误,请按顺序'
                //         })
                //         return;
                //     }
                //     if(rules[i-1].points >= rules[i].points) {
                //         this.$Message({
                //             message:'奖励规则有误,请按顺序'
                //         })
                //         return;
                //     }
                // }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this._updateAgent(this.formDataSearch);
                    } else {
                        return false;
                    }
                });
            },
            uploadSuccess() {
                this.$Message({
                    message:'上传成功',
                    type:'success'
                })
            },
            add() {
                // this.tableData.splice(this.tableData.length - 1,0,{name:'',points:''})
                this.tableData.push({num:'',points:''})
            },
            deleteRow(row) {
                this.tableData.splice(row.$index,1);
            },
            checkPermission(PermissionName) {
                return (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1;
            },
            // 获取数据
            _getAgent(workType) {
                // if (!this.checkPermission('perm:tea:agent:get-agent')) {
                //     return false;
                // }
                let api = '/api/agent/getAgent';
                this.spinFlag = true;
                this.$Fetch({
                    url:api,
                    method:'post',
                    params:{workType}
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        for(let key in data) {
                            if(key === 'agentInfo') {
                                data['agentInfo'] = data['agentInfo'].split(',');
                            }
                            if(key === 'recommendRecruitType') {
                                if(data['recommendRecruitType']) {
                                    data['recommendRecruitType'] = data['recommendRecruitType'].split(',');
                                } else {
                                    data['recommendRecruitType'] = [];
                                }
                            }
                        }
                        if(!!data){
                          this.referralConfig = data;
                        }

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
                    this.spinFlag = false;
                })
            },
            // 更新数据
            _updateAgent(options) {
                this.$Fetch({
                    url:'/api/agent/updateAgent',
                    method:'post',
                    data:options
                }).then((result) => {
                    // const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.$Message({
                            message:'数据修改成功',
                            type:'success'
                        })
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
                    this.$sdk.sendEvent({
                      eventId: 'click_teacher_agent_updateAgent',
                      eventParam: options
                    });
                })
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
                }).catch(message => {
                    console.log(message);
                });
            }
        },
        mounted() {
            this._getQiniuToken();
            this._getAgent(this.workType);
        },
        components:{
            imgBox
        }
    }
</script>

<style lang="less">
    @text-color:#02ab09;
    .context-referral{
        .zm-form-item{
            display:flex;
            align-items:flex-start;
            margin-bottom:25px;
            &.img-item{
                .el-form-item__content{
                    display:flex;
                    align-items:flex-start;
                    .btn{
                        margin-right:20px;
                    }
                }
            }
            .tip{
                padding-left:10px;
                color:@text-color;
                line-height:20px;
            }
            .el-input,{
                width:70%;
            }
            .el-select{
                width:70%;
            }
            .text{
                color:@text-color;
            }
            .search-btn{
                margin-left:130px;
                float:none;
            }
            .el-form-item__label{
                width:130px;
                text-align:right;
                margin-right:20px;
            }
            .el-form-item__content{
                width:100%;
                .el-checkbox-group{
                    display:flex;
                    .el-checkbox{
                        margin-right:10px;
                        display:flex;
                        align-items:center;
                        &__label{
                            color:#808080;
                        }
                    }
                }
            }
            .rule-wrapper{
                display: flex;
                flex-direction: column;
                .rule-item{
                    display: flex;
                    li{
                        width: 400px;
                        display:flex;
                        margin-right:30px;
                    }
                }
            }
        }
    }
</style>
