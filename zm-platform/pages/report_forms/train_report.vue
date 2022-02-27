<template>
    <div class="personal-report">
        <div class="search-warpper">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="报名时间">
                    <div class="noneIcon">
                        <el-date-picker v-model="searchTime" type="datetimerange"
                            :clearable="false" format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="专员姓名">
                    <el-input v-model="searchData.commissionerName" placeholder="请输入专员姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search-btn" size="small" type="normal"  @click="handleSearchOrExport($event, true)" v-if="checkPermission('report-train-report-export')">导出excel</el-button>
                    <el-button class="search-btn" size="small" type="normal" icon="search" @click="handleSearchOrExport">搜索</el-button> 
                </el-form-item>
            </el-form>
        </div>
        <div class="table-warpper">
            <el-table :data="tableData" border style="width: 100%">
                 <!-- fixed='left' -->
                <el-table-column prop="recruitCommissionerName" label="专员姓名"></el-table-column>
                <el-table-column prop="teaRating" label="级别"></el-table-column>
                <el-table-column prop="assignTeaCnt" label="分配名单人数"></el-table-column>
                <el-table-column prop="reservedTeaCnt" label="待预约人数"></el-table-column>
                <el-table-column prop="communicatTeaCnt" label="沟通人数"></el-table-column>
                <el-table-column prop="communicatRate" label="沟通率"></el-table-column>
                <el-table-column prop="appointInterviewCnt" label="约面人数"></el-table-column>
                <el-table-column prop="waitInterviewCnt" label="待面人数"></el-table-column>
                <el-table-column prop="passInterviewCnt" label="面试通过人数"></el-table-column>
                <el-table-column prop="unpassInterviewCnt" label="面试不通过人数"></el-table-column>
                <el-table-column prop="waitSecondInterviewCnt" label="待二面人数"></el-table-column>
                <el-table-column prop="arriveInterviewRate" label="到面率"></el-table-column>
                <el-table-column prop="waitTrainedCnt" label="待培训人数"></el-table-column>
                <el-table-column prop="passTrainedCnt" label="培训通过人数"></el-table-column>
                <el-table-column prop="unpassTrainedCnt" label="培训不通过人数"></el-table-column>
                <el-table-column prop="attendTrainedRate" label="参培率"></el-table-column>
                <el-table-column prop="regularEnrollCnt" label="正式入职人数"></el-table-column>
            </el-table>
            <div style="margin-top: 20px;">
                <el-pagination @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchData.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="searchData.pageSize"
                    layout="sizes, prev, pager, next"
                    v-bind:total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
const config = require('@config/index.js');
import { formatDate } from '../../../src/components/date-picker/util.js';
import fetch from '../../../src/utils/fetch'
export default {
    data () {
        return {
            total: 0,
            searchTime: [],
            searchData: {
                'commissionerName': '',
                "pageNo": 1,
                "pageSize": 10,
                "searchStartTime": '',
                "searchEndTime": '',
            },
            tableData: []
        }
    },
    created () {
        // 默认选择一周内的数据
        const format = 'yyyy-MM-dd';
        let old = formatDate(new Date(((new Date).getTime())-7*24*60*60*1000), format)
        let start = formatDate(new Date, format)
        this.searchTime[0] = `${old} 00:00:00`
        this.searchTime[1] = `${start} 00:00:00`
        this.handleSearchOrExport()
    },
    methods: {
        // 搜索
        handleSearchOrExport ($event, isExport=false) {
            if (!this.searchTime[0]) {
                this.$Message.error('请选择报名时间段!'); 
                return
            }
            let {pageNo, pageSize, sort, sortType, commissionerName} = this.searchData
            let options = {
                sort,
                sortType,
                pageNo,
                pageSize,
                commissionerName,
                "searchStartTime": formatDate(this.searchTime[0], 'yyyy-MM-dd HH:mm:ss'),
                "searchEndTime": formatDate(this.searchTime[1], 'yyyy-MM-dd HH:mm:ss'),
            }
            // 导出
            if (isExport) {
                let BASE = process.env.NODE_ENV === 'development' ? config.dev.proxypath : ''
                open(`${BASE}/api/teacher-web/api/report/export?sort=${sort||''}&sortType=${sortType||''}&pageNo=${pageNo||''}&pageSize=${pageSize||''}&searchStartTime=${options.searchStartTime||''}&searchEndTime=${options.searchEndTime||''}&reportType=6`)
                return
            }
            fetch({
                url: '/api/report/trainReport',
                method: 'post',
                data: options
            }).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list
                    this.total = res.data.total
                }
            })
            .catch((err) => {
                if (err) {
                    this.$Message.error(err);
                }
            });
        },
        // 查询权限
        checkPermission(PermissionName){
            return (this.$store.getters.permissionList || []).indexOf(PermissionName)>-1
        },
        // 查询权限
        checkPermission(PermissionName){
            return (this.$store.getters.permissionList || []).indexOf(PermissionName)>-1
        },
        handleCurrentChange (val) {
            this.searchData.pageNo = val
            this.handleSearchOrExport()
        },
        handleSizeChange (val) {
            this.searchData.pageNo = 1
            this.searchData.pageSize = val
            this.handleSearchOrExport()
        }
    }
}
</script>

<style scoped lang="less">
  .personal-report{
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    .search-warpper{
      margin: 20px 0 20px 10px;
    }
    .table-warpper{
      width: 100%;
      min-height: 500px;
      margin-top: 40px;
    }
  }
</style>