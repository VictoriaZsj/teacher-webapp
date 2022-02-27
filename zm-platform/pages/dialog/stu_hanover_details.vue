<template>
  <div>
    <div class="content">
        <Spin size="large" fix v-if="tableLoading"></Spin>
        <el-tabs type="border-card" @tab-click="selTabs">
            <el-tab-pane key="oneToOneList" :label="`1对1课的正式学生(${oneToOneListNum})`" data-index="0">
                <div class="stu_title">
                    最近一个月上课学生数 <span class="stu_title_red">{{allstudentNum}}</span> 名，已交接 <span class="stu_title_red">{{haveBeenHandoverNum}}</span> 名学生，不需交接 <span class="stu_title_red">{{noHandoverNum}}</span> 名学生，还有 <span class="stu_title_red">{{notHandoverNum}}</span> 名未交接
                </div>

                <div class="stu_data">
                    <el-table class="fixed-noscroll"  :data="table_data" style="width:100%">
                    <el-table-column align="center" prop="stuName" label="学生姓名">
                    </el-table-column>
                    <el-table-column align="center" prop="subject" label="上课科目">
                    </el-table-column>
                    <el-table-column align="center" prop="grade" label="上课年级" >
                    </el-table-column>
                    <el-table-column align="center" prop="frequency" label="上课频率" >
                    </el-table-column>
                    <el-table-column align="center" key="textVersion" prop="textVersion" label="教材版本" v-if="bu!=2">
                    </el-table-column>
                    <el-table-column align="center" prop="knowledgePoint" label="知识点" >
                    </el-table-column>
                    <el-table-column align="center" :formatter="transformDate" width="140" prop="lastClassTime" label="最近一次上课时间" >
                    </el-table-column>
                    <el-table-column align="center" prop="stuCondition" label="学生上课情况" >
                        <template scope="scope">
                            <el-tooltip  effect="dark" :content="scope.row.stuCondition" placement="top">
                                <p class="width-80">{{scope.row.stuCondition}}</p>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="附件" >
                        <template scope="scope">
                            <p class="more-attachment-box" :style="{height:scope.row.showMorePic?'auto':'20px'}">
                                <template v-for="(item,index) in scope.row.handoverPicUrls">
                                    <a :key="index" :href="item" target="_blank">{{item | picFilter}}</a><br :key="index">
                                </template>
                            </p>
                            <span class="more-attachmen-btn" v-if="!scope.row.showMorePic&&scope.row.handoverPicUrls&&scope.row.handoverPicUrls.length>1" @click="showMorePic(scope.$index)">查看更多</span>

                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="state" label="交接状态">
                        <template scope="scope" >
                            {{scope.row.state | stateFilter}}
                            <el-button style="font-size: 12px;" v-if="scope.row.state=='0' && fromFullTime===1" @click="setStateFn(scope.row, '0')" type="text">不需要交接</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="remark" label="备注" >
                    </el-table-column>

                    <el-table-column align="center" label="操作" fixed="right" width="120">
                        <template scope="scope" >
                            <el-button v-if="fromFullTime===0 && scope.row.state == 0 && (scope.row.grade == '初三' || scope.row.grade == '初四' || scope.row.grade == '高三' || scope.row.grade == '高四')" size="small" @click="notHeadmaster(scope.row.stuId)" type="text">不需要交接</el-button>
                            <el-button v-if="scope.row.state == 0" size="small" @click="urgeHeadmasterAction(scope.row.stuId, '班主任')" type="text">催班主任</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane key="childClassStuList" :label="`小班课班级数量(${childClassListNum})`" data-index="1" v-if="bu == 2">
                <div class="stu_title">
                    小班课数量<span class="stu_title_red">{{childClassNum}}</span>，
                    已交接<span class="stu_title_red">{{haveBeenHandoverClassNum}}</span>个班级，
                    未交接<span class="stu_title_red">{{notHandoverClassNum}}</span>班级
                </div>

                <div class="stu_data">
                <div style="overflow:auto"  v-if="sel_tab_index==1">
                    <table border="0" cellpadding="0" cellspacing="0" class="class-number-table">
                        <tr>
                            <th>班级名称/班级ID</th>
                            <th>上课科目</th>
                            <th>上课年级</th>
                            <th>最近一次上课时间</th>
                            <th>学生姓名</th>
                            <th>学生上课情况</th>
                            <th>交接状态</th>
                            <th>操作</th>
                        </tr>
                        <template v-for="(item,index) in table_data">
                            <tr  v-for="(child,i) in item" :key="index+'-'+i" >
                                <td :rowspan="item.length" v-if="i===0">班级<br>({{child.classId}})</td>
                                <td :rowspan="item.length" v-if="i===0">{{child.subject}}</td>
                                <td :rowspan="item.length" v-if="i===0">{{child.grade}}</td>
                                <td :rowspan="item.length" v-if="i===0">{{transformDateFilter(child.lastClassTime)}}</td>
                                <td>{{child.stuName}}</td>
                                <td>
                                    <el-tooltip  effect="dark" :content="child.stuCondition" placement="top">
                                        <p class="width-270">{{child.stuCondition}}</p>
                                    </el-tooltip>
                                </td>
                                <td>
                                    <template >
                                        {{child.state | stateFilter}}
                                        <el-button style="font-size: 12px;" v-if="child.state=='0' && fromFullTime===1" @click="setStateFn(child, '1')" type="text">不需要交接</el-button>
                                    </template>
                                </td>
                                <td>
                                    <template >
                                        <el-button v-if="fromFullTime===0 && child.state == 0 && (child.grade == '初三' || child.grade == '初四' || child.grade == '高三' || child.grade == '高四')" size="small" @click="notHeadmaster(child.stuId)" type="text">不需要交接</el-button>
                                        <el-button v-if="child.state == 0" size="small" @click="urgeHeadmasterAction(child.stuId, '班主任')" type="text">催班主任</el-button>
                                    </template>
                                </td>
                            </tr>
                        </template>
                    </table>
                    <p v-if="table_data_total<=0" style="text-align:center;line-height:40px;">暂无数据</p>
                </div>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane key="testListNum" :label="`测评课(${testListNum})`" data-index="2">
                <div class="stu_title">
                    最近一个月上课学生数 <span class="stu_title_red">{{allstudentNum}}</span> 名，已交接 <span class="stu_title_red">{{haveBeenHandoverNum}}</span> 名学生，不需交接 <span class="stu_title_red">{{noHandoverNum}}</span> 名学生，还有 <span class="stu_title_red">{{notHandoverNum}}</span> 名未交接
                </div>

                <div class="stu_data">
                    <el-table class="fixed-noscroll"  :data="table_data" style="width:100%">
                    <el-table-column align="center" prop="stuName" label="学生姓名">
                    </el-table-column>
                    <el-table-column align="center" prop="subject" label="上课科目">
                    </el-table-column>
                    <el-table-column align="center" prop="grade" label="上课年级" >
                    </el-table-column>
                    <el-table-column align="center" prop="textVersion" label="教材版本" >
                    </el-table-column>
                    <el-table-column align="center" prop="knowledgePoint" label="知识点" >
                    </el-table-column>
                    <el-table-column align="center" :formatter="transformDate" prop="lesStartTime" label="测评课预约时间" >
                    </el-table-column>
                    <el-table-column align="center" prop="state" label="交接状态" >
                        <template scope="scope" >
                            {{scope.row.state | stateFilter}}
                            <el-button style="font-size: 12px;" v-if="scope.row.state=='0' && fromFullTime===1" @click="setStateFn(scope.row, '2')" type="text">不需要交接</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" fixed="right" width="120">
                        <template scope="scope" >
                            <el-button v-if="fromFullTime===0 && scope.row.state == 0 && (scope.row.grade == '初三' || scope.row.grade == '初四' || scope.row.grade == '高三' || scope.row.grade == '高四')" size="small" @click="notHeadmaster(scope.row.stuId)" type="text">不需要交接</el-button>
                            <el-button v-if="scope.row.state == 0" size="small" @click="urgeHeadmasterAction(scope.row.stuId, '销售')" type="text">催销售</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane key="testNotClassList" :label="`测评课已转化未上正式课学生(${testNotClassListNum})`" data-index="3" v-if="bu == 1">
                <div class="stu_title">
                    测评课已转化，但未开正式课的学生： <span class="stu_title_red">{{table_data_total}}</span>
                </div>

                <div class="stu_data">
                    <el-table class="fixed-noscroll"  :data="table_data" style="width:100%">
                    <el-table-column align="center" prop="stuName" label="学生姓名">
                    </el-table-column>
                    <el-table-column align="center" prop="subject" label="上课科目">
                    </el-table-column>
                    <el-table-column align="center" prop="grade" label="上课年级" >
                    </el-table-column>
                    <el-table-column align="center" prop="textVersion" label="教材版本" >
                    </el-table-column>
                    <el-table-column align="center" prop="knowledgePoint" label="知识点" >
                    </el-table-column>
                    <el-table-column align="center" :formatter="transformDate" prop="lesStartTime" label="测评课预约时间" >
                    </el-table-column>
                    <el-table-column align="center" prop="state" label="交接状态" >
                        <template scope="scope" >
                            不需要交接
                        </template>
                    </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>
<script>

import { newLsetStuNotHander } from '../../api/select/toPartTimeJob';

import getLeaveTeacherStudentInfo from '../../api/select/getLeaveTeacherStudentInfo';
import urgeHeadmaster from '../../api/action/urgeHeadmaster';
import notHeadmaster from '../../api/action/notHeadmaster';

export default {
    data() {
        return {
            fromFullTime: 0, // 是否从全职转兼职来的
            sel_tab_index: "0",
            table_data: [],
            tableLoading: false,
            table_data_total: 0,
            allstudentNum: '', //上课学生数 ,
            haveBeenHandoverNum: '', //已交接学生数 ,
            noHandoverNum: '',//不需交接多少名学生
            notHandoverNum: '', //未交接学生数
            childClassNum:'',
            haveBeenHandoverClassNum:'',
            notHandoverClassNum:'',
            search_data:{
                pageSize: 10,
                pageNo: 1
            },
            fromFullTime: 0, // 是否从全职转兼职来的
            oneToOneListNum:0,
            testListNum:0,
            testNotClassListNum:0,
            childClassListNum:0,
        }
    },
    props:{
        currentID: null,
        viewState: false, // false表示页面关闭，true表示页面展开
        bu: ''
    },
    watch:{
        viewState (val) {
            if(!val){
                this.default();
            }else{
                this.search();
            }
        }
    },
    filters:{
        stateFilter(val){
            if(val == "0"){
                return "未交接";
            }
            if(val == "1"){
                return "已交接";
            }
            if(val == "2"){
                return "不需交接";
            }
            if(val == "-1"){
                return "废弃";
            }
            return "";
        },
        picFilter(val){
            //文件名格式化：abcedf.png  =>  ab...df.png
            const xiegang_index = val.lastIndexOf('/');
            const dian_index = val.lastIndexOf('.');
            return val.slice(xiegang_index + 1).slice(0,2) + '...' + val.slice(dian_index-2,dian_index) + val.slice(dian_index)
        }
    },
    mounted:function(){
        this.search();
    },
    methods:{
        setStateFn (scope, index) {
            this.$MessageBox.confirm(`确定该学生不需要交接吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = {"stuId": scope.stuId, "teaId": scope.teaId}
                newLsetStuNotHander(param).then(res => {
                    // 提交后刷新页面
                    this.refreshTabs(index)
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                });
            }).catch(_=>{});
        },
        transformDate(row, column) {
            return this.$DateTransform(row[column.property]);
        },
        transformDateFilter(time) {
            return this.$DateTransform(time);
        },
        notHeadmaster(stuId){
            this.$MessageBox.confirm(`确定该学生不需要交接吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let parm = {
                    teaId:this.currentID,
                    stuId:stuId
                };
                notHeadmaster(parm).then(data => {
                    this.getTableData();
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                });
            }).catch(message => {
                this.$Message({
                    message: message
                });
            });
        },
        urgeHeadmasterAction(stuId, teaName){
            this.$MessageBox.confirm(`确定执行催${teaName}操作吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let parm = {
                    teaId: this.currentID,
                    stuId: stuId
                };
                urgeHeadmaster(parm).then(data => {
                    this.getTableData();
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                });
            })
        },
        transformClassNumberData(list){
            const _ = {};
            list.forEach(item => {
                _[item.classId]?_[item.classId].push(item):_[item.classId]=[item];
            });
            const arr = [];
            for(let key in _){
                arr.push(_[key])
            }
            return arr;
        },
        getTableData(){
            this.search_data.teaId = this.currentID;
            this.search_data.stuType = this.sel_tab_index;
            this.tableLoading = true;

            this.$Fetch({
                url: "/api/newLeave/getLeaveTeacherStudentNum",
                method: "post",
                data: {
                    teaId:this.search_data.teaId
                }
            })
            .then(result => {
                if (result.code == 0) {
                    this.oneToOneListNum = result.data.oneToOneListNum||0;
                    this.testListNum = result.data.testListNum||0;
                    this.testNotClassListNum = result.data.testNotClassListNum||0;
                    this.childClassListNum = result.data.childClassListNum||0;
                } else {
                    this.$Message({
                        message: result.message,
                        type: "error"
                    });
                }
            })
            .catch(message => {
                this.$Message({
                    message
                });
            });
            getLeaveTeacherStudentInfo(this.search_data).then(data => {
                this.fromFullTime = data.transferPost // 等于'1'来自全职转兼职
                this.allstudentNum = data.allstudentNum; //上课学生数 ,
                this.haveBeenHandoverNum = data.haveBeenHandoverNum; //已交接学生数 ,
                this.noHandoverNum = data.noHandoverNum; //已交接学生数 ,

                this.notHandoverNum = data.notHandoverNum; //未交接学生数
                this.childClassNum = data.childClassNum||0;
                this.haveBeenHandoverClassNum = data.haveBeenHandoverClassNum||0;
                this.notHandoverClassNum = data.notHandoverClassNum||0;
                this.table_data_total = data.leaveHandoverDetailDtos.total;
                if(this.search_data.stuType === '1'){//小班课班级数量-TAB 数据单独处理一下
                    this.table_data = this.transformClassNumberData(data.leaveHandoverDetailDtos.list||[])
                }else{
                    this.table_data = data.leaveHandoverDetailDtos.list;
                };
                this.tableLoading = false;
            }).catch(message => {
                this.$Message({
                    message: message||'接口出错了...'
                });
                this.tableLoading = false;
            });
        },
        handleSizeChange(pageSize) {
            this.search_data.pageSize = pageSize;
            this.search_data.pageNo = 1;
            this.getTableData();
        },
        handleCurrentChange(currentPage) {
            this.search_data.pageNo = currentPage;
            this.getTableData();
        },
        // 查询
        search() {
            this.search_data.pageNo = 1;
            this.getTableData();
        },
        default () {
            this.sel_tab_index = "0";
            this.table_data = [];
            this.tableLoading = false;
            this.table_data_total = 0,
            this.allstudentNum = ''; //上课学生数 ,
            this.haveBeenHandoverNum = ''; //已交接学生数 ,
            this.noHandoverNum = ''; //不需交接多少名学生
            this.notHandoverNum = ''; //未交接学生数
            this.search_data = {
                pageSize: 10,
                pageNo: 1
            };
            this.getTableData();
        },
        commonTabs () {
            this.table_data = [];
            this.tableLoading = false;
            this.table_data_total = 0,
            this.allstudentNum = ''; //上课学生数 ,
            this.haveBeenHandoverNum = ''; //已交接学生数 ,
            this.noHandoverNum = ''; //不需交接多少名学生
            this.notHandoverNum = ''; //未交接学生数
            this.search_data = {
                pageSize: 10,
                pageNo: 1
            };
            this.getTableData();
        },
        selTabs(el) {
            this.sel_tab_index = el.$attrs['data-index'];
            this.commonTabs()
        },
        refreshTabs(index) {
            this.sel_tab_index = index
            this.commonTabs()
        },
        showMorePic(index){
            this.$set(this.table_data[index],'showMorePic',true)
        }
    }
}
</script>
<style lang="less" scoped>
    .content{
      max-height: 400px;
      overflow-y: auto;
      position: relative;
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
    .stu_title{
        margin-bottom: 10px;
    }
    .stu_title_red{
      color: red;
    }
    .width-80{
        width:80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .width-270{
        width:270px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .class-number-table{
        min-width:630px;
        width:100%;
        border:1px solid #ccc;
        tr{
            border-bottom: 1px solid #f4f5f5;
        }
        th{
            background-color: #f4f5f5;
            border-bottom: 1px solid #ccc;
            border-right:1px solid #ccc;
            font-weight: normal;
            height: 40px;
        }
        td{
            height: 40px;
            text-align: center;
            border-bottom: 1px solid #ccc;
            border-right:1px solid #ccc;
        }
    }
    .more-attachmen-btn{
        color: #20a0ff;
        cursor: pointer;
    }
    .more-attachment-box{
        height: 20px;
        overflow: hidden;
    }
</style>
