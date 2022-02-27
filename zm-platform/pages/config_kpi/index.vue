<template>
    <div class="context config-kpi" v-if="checkPermission('tea:kpi:config')">
        <Spin size="large" fix v-if="tableLoading"></Spin>
        <!--<div class="context-head_bottom">
                <el-button @click="create"  type="normal" class="create-btn">新增专员</el-button>
            </div>-->
        <div class="context-body">
            <el-form :inline="true" :model="search_data">
                <el-form-item label="关键词">
                    <el-input v-model="search_data.keyWord" placeholder="输入姓名或手机号"></el-input>
                </el-form-item>
                <el-button class="search-btn" size="small" type="normal" icon="search" @click="search">搜索</el-button>
            </el-form>
            <el-table :data="table_data" style="width:100%">
                <el-table-column prop="name" label="专员姓名" width="120" align="center">
                </el-table-column>
                <el-table-column prop="recruitDictType" label="招师类型" align="center" width="120">
                </el-table-column>
                <el-table-column prop="kpiDictType" label="KPI类型" align="center" width="150">
                </el-table-column>
                <el-table-column prop="checkRanges" label="考核范围" align="center" width="120">
                </el-table-column>
                <el-table-column prop="totalTaskNumber" label="总任务量" align="center">
                </el-table-column>
                <el-table-column prop="completedNumber" label="完成量" align="center">
                </el-table-column>
                <el-table-column prop="completedPercent" label="完成率" align="center">
                </el-table-column>
                <el-table-column prop="operatorName" width="150" label="操作者" align="center">
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showConfig(scope.row.comissionerId)">配置KPI</el-button>
                        <el-button type="text" size="small" @click="showDetail(scope.row.comissionerId)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>
        </div>
        <!--查看详细名单弹窗 -->
        <el-dialog title="详细名单" v-model="showDetailDialog" size="large" @close="closeDetailDialog">
            <Spin size="large" fix v-if="detailLoading"></Spin>
            <el-table :data="detailData" max-height="350" style="width: 100%">
                <el-table-column prop="checkRanges" label="考核范围" align="center" width="120">
                </el-table-column>
                <el-table-column prop="totalTask" label="总任务量" align="center" width="100">
                </el-table-column>
                <el-table-column prop="chinese" label="语文">
                </el-table-column>
                <el-table-column prop="math" label="数学">
                </el-table-column>
                <el-table-column prop="english" label="英语">
                </el-table-column>
                <el-table-column prop="physics" label="物理">
                </el-table-column>
                <el-table-column prop="chemistry" label="化学">
                </el-table-column>
                <el-table-column prop="biology" label="生物">
                </el-table-column>
                <el-table-column prop="daniel" label="理综">
                </el-table-column>
                <el-table-column prop="politics" label="政治">
                </el-table-column>
                <el-table-column prop="history" label="历史">
                </el-table-column>
                <el-table-column prop="geography" label="地理">
                </el-table-column>
                <el-table-column prop="theHeddle" label="文综">
                </el-table-column>
                <el-table-column prop="mathematicalOlympiad" label="奥数">
                </el-table-column>
                <el-table-column prop="science" label="科学">
                </el-table-column>

                <el-table-column prop="totalCompletedPercent" align="center" label="总完成率" width="100">
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--kpi配置弹窗dialog-->
        <el-dialog title="名单配置" class="kpi-config" v-model="showConfigDialog" size="small" @close="closeConfigDialog">
            <el-form :model="configData">
                <el-form-item label="KPI类型：">
                    <!--{{ configData.kpiType }}-->
                    参培数
                </el-form-item>
                <el-form-item label="考核时间：">
                    <el-select v-model="configData.checkYear" placeholder="请选择" @change="changeDate()">
                        <el-option label="2016" value="2016"></el-option>
                        <el-option label="2017" value="2017"></el-option>
                        <el-option label="2018" value="2018"></el-option>
                    </el-select>
                    第
                    <el-select v-model="configData.checkMonth" placeholder="请选择" @change="changeDate()">
                        <el-option label="1" :value="1"></el-option>
                        <el-option label="2" :value="2"></el-option>
                        <el-option label="3" :value="3"></el-option>
                        <el-option label="4" :value="4"></el-option>
                        <el-option label="5" :value="5"></el-option>
                        <el-option label="6" :value="6"></el-option>
                        <el-option label="7" :value="7"></el-option>
                        <el-option label="8" :value="8"></el-option>
                        <el-option label="9" :value="9"></el-option>
                        <el-option label="10" :value="10"></el-option>
                        <el-option label="11" :value="11"></el-option>
                        <el-option label="12" :value="12"></el-option>
                    </el-select>
                    月
                </el-form-item>
                <el-form-item label="科目指标">
                    <div class="config-data-list" v-for="(item,index) in configDataList" :key="index">
                        {{ item.itemLabel }}：
                        <el-input v-model="item.itemValue"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="总任务量">
                    {{ configDataTotal }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeConfigDialog">取 消</el-button>
                <el-button type="primary" @click="updateConfig" :loading="updateConfigLoad">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import { allSubject } from '../../../src/data/index.js';
export default {
    data() {
        return {
            // 表单数据
            table_data: [],
            tableLoading: true,
            table_data_total: 0,
            // 表单查询条件
            search_data: {
                keyWord: '',
                pageNo: 1,//number
                pageSize: 10,//number
            },
            page_size: 10,

            // 表单的显示和隐藏
            // tableShow:false,

            // 详细名单弹窗
            showDetailDialog: false,
            // 详细名单弹窗loading
            detailLoading: true,
            // 详细名单数据
            detailData: [],

            // 配置弹窗dialog
            showConfigDialog: false,
            // 保存修改后的配置
            updateConfigLoad: false,
            // 名单配置数据
            configData: {},
            // 科目列表
            configDataList: [],
            // in
            configId:'',
        }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },

        // 获取表单数据
        getTableData() {
            this.$Fetch({
                url: '/api/kpiConfig/getKpiList',
                method: 'post',
                data: this.search_data
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.table_data = data.list;
                    this.table_data_total = data.total;
                } else {
                    this.$Message({
                        message
                    });
                }
                this.tableLoading = false;
            });
        },
        handleSizeChange(pageSize) {
            this.search_data.pageSize = pageSize;
            // this.currentPage = 1;
            this.search_data.pageNo = 1;
            this.tableLoading = true;
            this.getTableData();
        },
        handleCurrentChange(currentPage) {
            // this.currentPage = currentPage;
            this.search_data.pageNo = currentPage;
            this.tableLoading = true;
            this.getTableData();
        },
        // 查询
        search() {
            this.tableLoading = true;
            this.search_data.pageNo = 1;
            this.getTableData();
        },

        // 查看人员详情
        showDetail(id) {
            this.detailLoading = true;
            this.showDetailDialog = true;
            this.$Fetch({
                url: `/api/kpiConfig/getKpiInfo?comissionerId=${id}`,
                method: 'get',
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.detailData = data;
                    this.detailLoading = false;
                } else {
                    this.$Message({
                        message
                    });
                }
            });
        },
        // 关闭详细名单弹窗
        closeDetailDialog() {
            this.nameDetailData = [];
            this.nameDetailLoading = true;
            this.showNameDetailDialog = false;
        },

        // 查看配置
        showConfig(id) {

            if(id) this.configId = id;
            this.$Fetch({
                url: '/api/kpiConfig/getKpiConigDetails?comissionerId=' + this.configId,
                method: 'get',
            }).then((result) => {
                const code = result.code;
                const data = result.data;
                const message = result.message;
                if (code == 0) {
                    this.configData = data;
                    this.configDataList = [];

                    Object.keys(this.configData.subjectTarget).forEach(subjectItem => {
                        this.configDataList.push({
                            itemLabel: allSubject[subjectItem],
                            itemValue: this.configData.subjectTarget[subjectItem]
                        });
                    });
                    this.$nextTick(()=>{
                        this.showConfigDialog = true;
                    });
                } else {
                    this.$Message({
                        message
                    });
                }
            });
        },
        closeConfigDialog() {
            this.showConfigDialog = false;
            this.configDataList = [];
            this.configData = {};
        },
        // 更改日期
        changeDate() {
            if(!this.showConfigDialog) return;
            this.$Fetch({
                url: '/api/kpiConfig/getDetailsByYearOrMonth',
                method: 'post',
                data:{
                    checkMonth:this.configData.checkMonth,
                    checkYear:this.configData.checkYear,
                    commissionerId:this.configId
                }
            }).then((result) => {
                const code = result.code;
                const data = result.data;
                const message = result.message;
                if (code == 0) {
                    // this.configData = data;
                    this.configDataList = [];
                    Object.keys(data.subjectTarget).forEach(subjectItem => {
                        this.configDataList.push({
                            itemLabel: allSubject[subjectItem],
                            itemValue: data.subjectTarget[subjectItem]
                        });
                    });
                } else {
                    this.$Message({
                        message
                    });
                }
            });
        },
        // 保存名单配置
        updateConfig() {
            this.updateConfigLoad = true;

            const subjectTarget = {};
            this.configDataList.forEach((value, index) => {
                subjectTarget[index] = parseInt(value.itemValue || 0);
            });
            this.$Fetch({
                url: '/api/kpiConfig/updateOrCreateKpiConigDetails',
                method: 'post',
                data: {
                    checkMonth: this.configData.checkMonth,
                    checkYear: this.configData.checkYear,
                    commissionerId: this.configData.commissionerId,
                    subjectTarget,
                }
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                if (code == 0) {
                    this.$Message({
                        message: result.message,
                        type: 'success'
                    });
                    this.showConfigDialog = false;
                }
                else {
                    this.$Message({
                        message: result.message,
                    });
                }
                this.updateConfigLoad = false;
            });
        },
    },
    mounted() {
        // 获取表单初始数据
        this.getTableData();
    },

    computed: {
        configDataTotal: function () {
            return this.configDataList.reduce((sum, value) => {
                return sum + parseInt(value.itemValue || 0);
            }, 0);
        },
    },
}
</script>
<style lang="less">
@import "../../../src/styles/config_kpi/index.less";
</style>






