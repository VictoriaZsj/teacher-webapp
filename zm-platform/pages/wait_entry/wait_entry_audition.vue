<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" class="search-form">
            <el-form-item label="笔试状态">
                <el-select v-model="search_data.writtenTestState" placeholder="请选择">
                  <el-option
                    v-for="item in optionsSearch.writtenTestState"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="沟通结果">
                <el-select v-model="search_data.communicateResults" placeholder="请选择">
                  <el-option
                    v-for="item in optionsSearch.communicateResults"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="老师状态">
                <el-select v-model="search_data.teacherStatus" placeholder="请选择">
                  <el-option
                    v-for="item in optionsSearch.teacherStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工作性质">
                <el-select v-model="search_data.natureOfJob" placeholder="请选择">
                  <el-option
                    v-for="item in optionsSearch.natureOfJob"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报名科目">
                <el-select v-model="search_data.registrationSubject" placeholder="请选择">
                  <el-option
                    v-for="item in optionsSearch.registrationSubject"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报名年级">
                <el-select v-model="search_data.registrationGrade" placeholder="请选择">
                  <el-option
                    v-for="item in optionsSearch.registrationGrade"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="培训时间">
              <el-date-picker
                 :editable="false"
                type="date"
                v-model="search_data.timeOfTrain"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="报名时间">
              <el-date-picker
                 :editable="false"
                type="date"
                v-model="search_data.timeOfEnroll"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="面试时间">
              <el-date-picker
                 :editable="false"
                type="date"
                v-model="search_data.timeOfAudition"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="搜索关键词">
              <el-input
                v-model="search_data.keyWords"
                placeholder="搜索关键词">
              </el-input>
            </el-form-item>
            <el-form-item label="跟进人">
              <el-input v-model="search_data.personOfFolling" placeholder="跟进人"></el-input>
            </el-form-item>
            <el-form-item label="QQ">
              <el-input v-model="search_data.QQ" placeholder="QQ"></el-input>
            </el-form-item>
            <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>

        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <el-button @click="openDialog" size="small" type="text" v-if="checkPermission('tea:process:export-excel')">修改状态</el-button>
                <el-button size="small" type="text" v-if="checkPermission('tea:process:export-excel')">催笔试</el-button>
                <el-button size="small" type="text" v-if="checkPermission('tea:process:export-excel')">培训通知</el-button>
                <el-button size="small" type="text" v-if="checkPermission('tea:process:export-excel')">跑单</el-button>
                <el-button size="small" type="text" v-if="checkPermission('tea:process:export-excel')">移交</el-button>
            </div>

            <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
                <el-table-column align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column v-if="checkPermission('tea:process:common-info')" align="center" label="姓名" width="120" fixed>
                    <template scope="scope">
                        <el-button size="small" type="text" @click="userDetail(scope.row.id, scope.row.name, scope.row.mobile)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column v-else prop="name" align="center" label="姓名" width="120" fixed>
                </el-table-column>
                <el-table-column prop="workType" align="center" label="笔试状态" width="120">
                </el-table-column>
                <el-table-column prop="jobType" align="center" label="沟通结果" width="120">
                </el-table-column>
                <el-table-column prop="mobile" align="center" label="沟通次数" width="130">
                </el-table-column>
                <el-table-column prop="qq" align="center" label="沟通备注" width="180">
                </el-table-column>
                <el-table-column prop="email" header-align="center" label="报名时间" width="190">
                </el-table-column>
                <el-table-column prop="applyGrade" align="center" label="面试时间" width="100">
                </el-table-column>
                <el-table-column prop="applySubject" align="center" label="培训时间" width="100">
                </el-table-column>
                <el-table-column prop="salary" align="center" label="老师状态" width="100">
                </el-table-column>
                <el-table-column prop="remark" align="center" label="预约面试">
                </el-table-column>
                <el-table-column prop="remark" align="center" label="预约培训">
                </el-table-column>
                <el-table-column prop="remark" align="center" label="操作">
                  <template scope="scope">
                      <el-button size="small" type="text" >预约面试时间</el-button>
                      <el-button size="small" type="text" >预约培训时间</el-button>
                  </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>

        </div>

        <el-dialog title="待培训的配置（修改后10s生效）" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
            <el-tabs v-model="userDetailTabNumber" @tab-click="userDetailTab" class="order_dialog_body">
                <el-tab-pane label="基本信息/简历" name="first">
                  <basic-message class="mg-20" :options="options" :user-info="userDetailData" @audit="teaMesAudit"></basic-message>
                </el-tab-pane>
                <el-tab-pane label="笔试信息" name="second">
                  <written-record></written-record>
                </el-tab-pane>
                <el-tab-pane label="预约记录" name="third">
                  <order-record></order-record>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!-- 审核对话框 -->
        <el-dialog title="审核" v-model="teaMesAuditDialog" size="small" >
          <tea-mes-audit></tea-mes-audit>
        </el-dialog>

    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import { gradeSubject,optionsSearch,options } from '../../../src/data/index.js';
import basicMessage from '../userInfoItems/basic_message';
import teaMesAudit from '../userInfoItems/tea_mes_audit';
import writtenRecord from '../userInfoItems/written_record';
import orderRecord from '../userInfoItems/order_record';
export default {
    data() {
        return {
            optionsSearch: {

            },
            options:{

            },
            //搜索信息
            search_data:{
              writtenTestState:"",//笔试状态
              communicateResults:"",//沟通结果
              teacherStatus:"",//老师状态
              natureOfJob:"",//工作性质
              registrationSubject:"",//报名科目
              registrationGrade:"",//报名年级
              timeOfTrain:"",//培训时间
              timeOfEnroll:"",//报名时间
              timeOfAudition:"",//面试时间
              keyWords:"",//搜索关键词
              personOfFolling:"",//跟进人
              QQ:"",//QQ
              pageNo: 1,//number
              pageSize: 10,//number
            },
            // 个人基本信息弹窗
            userDetailDialog: false,
            userDetailTabNumber: 'first',
            userDetailId: '',
            userDetailName: '',
            userDetailMobile: '',
            //教师审核
            teaMesAuditDialog:false,
            //用户基本信息
            userDetailData: {
                graduateInfos: [{
                    graduatedSchool: '',
                    graduatedYear: '',
                    education: '',
                }],
                positionType:2
            },
            // 笔试信息
            userDetailDataPlus: '',
            // 预约记录
            userDetailDataReserveRecords: [],
            // 初始table数据
            table_data: [],
            tableLoading: true,
            table_data_total: 0
        }
    },
    methods: {
        openDialog:function(){
          this.userDetailDialog = true;
        },
        teaMesAudit:function(){
          this.teaMesAuditDialog = true;
        },
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        // 获取表单数据
        getTableData() {
            this.tableLoading = true;
            this.$Fetch({
                url: '/api/entry/getTeachers',
                method: 'post',
                data: this.search_data
            }).then((result) => {
                this.tableLoading = false;

                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.table_data = data.list;
                    this.table_data_total = data.total;
                } else {
                    this.$Message({
                        message: "调用后端数据失败"
                    });
                }
            });
        },
        // 转化时间格式
        transformDate(row, column) {
            return this.$DateTransform(row[column.property]);
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
        // 点击用户名查看详情
        userDetail(id, name, mobile) {

        },
        // 关闭用户详情弹窗
        closeUserDetailDialog() {

        },
        // 保存修改后的用户详情
        changeUserDetail() {

        },
        // 用户详情tab键
        userDetailTab(tab, event) {

        },
        selectTable(val) {
            let ids = [];
            val.forEach((value) => {
                ids.push(value.id.toString());
            });
            this.selectName = ids;
        },
        // 表格右上角按钮点击
        tableIconClick(type, name) {


        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
        Object.assign(this.optionsSearch,optionsSearch);
        Object.assign(this.options,options);
        this.$on("search",function(val){
            this.search_data.keyWord = val.keyWord || '';
            this.getTableData();
        });
        this.search_data.keyWord = this.$route.query.keyWord || '';
        // 请求初始表单数据
        this.getTableData();
    },
    components:{
      'basic-message':basicMessage,
      'tea-mes-audit':teaMesAudit,
      'order-record':orderRecord,
      'written-record':writtenRecord
    }
}
</script>
