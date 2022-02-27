<template>
    <div>
        <el-dialog :white="true" title="兼职转全职报名表" v-model="toFullTimeDialog" size="small" @close="closeToFullTimeDialog">
            <el-form :model="toFullTimeForm" ref="toFullTimeForm" label-width="120px" class="parttime-change-status">
                <el-form-item label="姓名">
                    {{toFullTimeForm.teaName}}
                </el-form-item>
                <el-form-item label="手机号">
                    {{mobile}}
                </el-form-item>
                <el-form-item label="邮箱">
                    {{email}}
                </el-form-item>
                <el-form-item label="报名年级">
                    <el-select v-model="toFullTimeForm.newGrade" @change="newGradeChange" placeholder="请选择">
                        <el-option v-for="(item, index) in gradeOptions"
                            :label="item.label" :value="item.label" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="报名科目">
                    <el-select v-model="toFullTimeForm.newSubject" placeholder="请选择">
                        <el-option v-for="(itema, indexKey) in subjectOptions"
                            :label="itema.label" :value="itema.label" :key="indexKey" />
                    </el-select>
                </el-form-item>
                <el-form-item label="老师性质">
                    <el-radio v-model="toFullTimeForm.newTimeType" label="1">全职</el-radio>
                    <el-radio v-model="toFullTimeForm.newTimeType" label="2">校招全职</el-radio>
                </el-form-item>
                <el-form-item label="是否快速入职">
                    <el-radio v-model="toFullTimeForm.isFastEntry" :label="0">允许快速入职</el-radio>
                    <el-radio v-model="toFullTimeForm.isFastEntry" :label="1">仍然需要全职面试和培训</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button @click="toFullTimecancel">取消</el-button>
                    <el-button type="primary" :loading="loading" @click="submitToFullTime">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :white="true" title="提示" v-model="pendingDialog" size="small" @close="closePendingDialog">
            <div class="pending">
                <p>该老师已在兼职转全职中</p>
                <p>目前状态为: <span>{{pendingDialogStatus}}</span></p>
                <p>请至全职招师流程中查看</p>
                <p class="btn"><el-button @click="pendingDialogCancel">关 闭</el-button></p>
            </div>
        </el-dialog>
        <el-dialog :white="true" title="兼职转全职报名表" v-model="waitForDialog" size="small" @close="closeWaitForDialog">
            <div class="solving">
                <div class="content" v-show="!isSoon">
                    <i class="el-icon-circle-check"></i>
                    <p>提交成功!</p>
                    <p>该老师已进入全职招师流程。</p>
                    <p>还需进行面试培训和入职手续办理才能成为全职老师哦！</p>
                    <!-- <p class="action">注：若面试培训不通过，仍然可以继续兼职。</p> -->
                </div>
                <div class="content" v-show="isSoon">
                    <i class="el-icon-circle-check"></i>
                    <p>提交成功!</p>
                    <p>该老师已进入全职招师流程。</p>
                    <p>还需确认入职信息和签署合同才能成为全职老师哦！</p>
                </div>
                <p class="btn">
                    <el-button @click="waitForDialogCancel">关 闭</el-button>
                </p>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import getTeacherSecretInfo from '../../api/select/getTeacherSecretInfo';
import fetch from '../../../src/utils/fetch'
/**
 * 兼职转全职dialog
 */
export default {
    data () {
        return {
            loading: false,
            toFullTimeDialog: false,
            gradeOptions: [],
            subjectOptions: [],
            toFullTimeForm: {},
            // 若已提交兼职转全职
            pendingDialog: false,
            pendingDialogStatus: '',
            // 等待面试
            waitForDialog: false,
            // 是否允许快速入职
            isSoon: true,
            email: '',
            mobile: '',
        }
    },
    methods: {
        closeToFullTimeDialog () {
            this.toFullTimeDialog = false
        },
        toFullTimecancel () {
            this.toFullTimeDialog = false
        },
        submitToFullTime () {
            let {newGrade, newSubject, isFastEntry,
                teaId, newTimeType} = this.toFullTimeForm
            if (newGrade==='') {
                this.$Message({message:'请选择报名年级'})
                return
            }
            if (newSubject==='') {
                this.$Message({message:'请选择报名科目'})
                return
            }
            if (newTimeType==='') {
                this.$Message({ message:'请选择老师性质'})
                return
            }
            if (isFastEntry==='') {
                this.$Message({message:'请选择是否快速入职'})
                return
            }
            this.loading = true
            let param = {
                "grade": newGrade, // 报名年级 
                "subject": newSubject, // 报名科目 ,
                "isFastEntry": isFastEntry, // 是否快速入职 是0 否1 ,
                "teaId": teaId, // 老师ID ,
                "timeType": newTimeType // 工作类型 兼职0 全职1 校招全职2 公校兼职3 全职学科班主任4
            }
            fetch({
                url: '/api/partTimeTeacherFlow/partTimeToFullTime',
                method: 'post', data: param
            }).then((res) => {
                this.loading = false
                if (res.code == 0) {
                    this.toFullTimeDialog = false
                    setTimeout(_=>{ // 美化渐出渐入
                        this.waitForDialog = true
                        if (this.toFullTimeForm.isFastEntry===0) {
                            // 允许快速入职
                            this.isSoon = true
                        } else if (this.toFullTimeForm.isFastEntry===1){
                            // 仍然需要全职面试和培训
                            this.isSoon = false
                        }
                    }, 240)
                }
            }).catch((err) => {
                this.loading = false
                this.$Message({message: err})
            });
        },
        closePendingDialog () {
            this.$emit('getTableData')
            console.log('closePendingDialog')
        },
        pendingDialogCancel () {
            this.pendingDialog = false
        },
        waitForDialogCancel () {
            this.waitForDialog = false
            this.$emit('getTableData')
        },
        closeWaitForDialog () {
            this.waitForDialogCancel()
        },
        // 查询手机号和邮箱 getTeacherSecretInfo
        // 'mobile' // 'email'
        findMonileAndEmail (type) {
            let parm = {
                teaId: this.toFullTimeForm.teaId,
                infoType: type
            };
            getTeacherSecretInfo(parm).then(res => {
                if (type==='mobile') {
                    this.mobile = res
                } else if (type==='email'){
                    this.email = res
                }
            })
        },
        getSelectList () {
            this.$set(this.toFullTimeForm,'newGrade', '')
            this.$set(this.toFullTimeForm,'newSubject', '')
            this.$set(this.toFullTimeForm,'isFastEntry', '')
            this.$set(this.toFullTimeForm,'newTimeType', '')
            
            this.findMonileAndEmail('email')
            this.findMonileAndEmail('mobile')
            // 默认带入兼职的科目 subject
            let cascade = [{
                "dictCode":"PHASE", // 全职
                "bizCategory":"common",
                "filterMap":{"ZM_BU": this.toFullTimeForm.teaBu}
            }]
            fetch({
                url: '/api/cascade/dict/service',
                method: 'post',
                data: cascade
            }).then((res) => {
                if (res.code == '0') {
                    this.gradeOptions = res.data.children
                }

            }).catch((err) => {
                this.$Message({message: err})
            });
        },
        newGradeChange (code) {
            let cascade = [{
                "dictCode": "BASIC_SUBJECTS",
                "bizCategory": "common",
                "filterMap": {
                    "ZM_BU": this.toFullTimeForm.teaBu,
                    "PHASE": code
                }
            }]
            fetch({
                url: '/api/cascade/dict/service',
                method: 'post',
                data: cascade
            }).then(res => {
                if (res.code == '0') {
                    this.toFullTimeForm.newSubject = ''
                    this.subjectOptions = res.data.children
                }

            }).catch((err) => {
                this.$Message({message: err})
            });
        }
    }
}
</script>
<style lang="less" scoped>
.pending{
    text-align: center;
    p{
        font-size: 15px;
        padding-top: 15px;
        span{
            color: #ff6400;
        }
    }
    .btn{
        padding-top: 35px;
    }
}
.solving{
    width: 500px;
    margin: 0 auto;
    p{
        font-size: 14px;
        padding-top: 15px;
    }
    .action{
        color: #ccc;
    }
    .btn{
        text-align: center;
        padding-top: 35px;
    }
    .content {
        position: relative;
        padding-left: 80px;
        i{
            position: absolute;
            left: 0;
            top: 50px;
            font-size: 53px;
            color: #4aae4f;
        }
    }
}
</style>

