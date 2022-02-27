<template>
    <div class="operation_record">
        <el-row>
            <el-form ref="form" class="operation_record_form" :model="form" label-width="80px">
                <el-form-item label="操作类型">
                    <el-select v-model="form.optType" placeholder="请选择">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option label="信息修改" value="1"></el-option>
                        <el-option label="面试培训" value="2"></el-option>
                        <el-option label="回收站记录" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model="form.optUserName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="操作时间">
                    <el-date-picker
                        v-model="tempTimes"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table
                :data="lists"
                border
                style="width: 100%"
                max-height="250">
                <el-table-column
                    fixed
                    prop="createdAt"
                    align="center"
                    label="操作时间">
                </el-table-column>
                <el-table-column
                    prop="optUserName"
                    align="center"
                    label="操作人">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作类型">
                    <template scope="scope">
                        {{scope.row.optType | optTypeFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="result"
                    align="center"
                    label="操作结果">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    align="center"
                    label="备注">
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination
                v-if="pageCount > 1"
                @size-change="onSubmit"
                @current-change="onSubmit"
                :current-page.sync="form.page.pageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="form.page.pageSize"
                layout="sizes, prev, pager, next"
                :total="pageCount">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
import getRefreshInfo from 'api/select/getRefreshInfo';
import Date from '@/utils/date';
export default {
    data() {
        return {
            tempTimes: null,
            form: {
                createdAtEnd: '',
                createdAtStart: '',
                optType: null,
                page: {
                    pageNo: 1,
                    pageSize: 10
                },
                optUserName: '',
                teaId: this.teaId
            },
            lists: [],
            pageCount: 0
        }
    },
    props: ['tea-id'],
    filters: {
        optTypeFilter(val) {
            switch(val + '') {
                case '1':
                    return '信息修改';
                case '2':
                    return '面试培训';
                case '3':
                    return '回收站记录';
                case '4':
                    return '修改状态';
                default:
                    return '其他';
            }
        }
    },
    methods: {
        onSubmit() {
            getRefreshInfo(this.form).then(data => {
                this.lists = data.list;
                this.pageCount = Math.ceil(data.total/this.form.page.pageSize)
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        }
    },
    watch: {
        tempTimes(val) {
            if(val && val.length > 0) {
                this.form.createdAtStart = val[0] ? Date.format(val[0], 'yyyy-MM-dd HH:mm:ss') : '';
                this.form.createdAtEnd = val[1] ? Date.format(val[1], 'yyyy-MM-dd HH:mm:ss') : '';
            } else {
                this.form.createdAtStart = '';
                this.form.createdAtEnd = '';
            }
        }
    },
    created() {
        this.onSubmit();
    }
}
</script>

<style scoped lang="less">
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.operation_record_form .el-form-item{
    display: inline-block;
    width: 250px;
}
</style>
