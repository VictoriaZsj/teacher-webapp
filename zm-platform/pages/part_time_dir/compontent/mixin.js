import partTimeAction from 'api/action/partTimeAction';
import basicMessage from '../../../../src/zm-component/basic-message/main';
import operationRecord from '../../userInfoItems/operation_record';
import getPhase from 'api/select/getPhase';
import getSubject from 'api/select/getSubject';

export default {
    components:{
        'basic-message': basicMessage,
        'operation-record': operationRecord,

    },
    data() {
      return {
        cipherTId: '',
      }
    },
    data() {
      return {
        cipherTId: '',
      }
    },
    methods: {
        buChange(){
            this.initPhase();
            this.initSubject();
        },
        initPhase(){
            this.search_data.applyGradeCode = "";
            this.phaseList = [];
            let parm = {};
            if(this.search_data.teaBu != ""){
                parm.bu = this.search_data.teaBu;
            }
            getPhase(parm).then(data => {
                this.phaseList = data.children;
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        },
        initSubject(){
            this.search_data.applySubjectCode = "";
            this.basesubList = [];
            let parm = {};
            if(this.search_data.teaBu != ""){
                parm.bu = this.search_data.teaBu;
            }
            getSubject(parm).then(data => {
                this.basesubList = data.children;
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        },
        // 全选
        selectTable(data) {
            this.selectTableArr = data
            this.currentIDs = data.map(item => {
                let {teaId} = item;
                return teaId;
            });
        },
        // 修改状态
        submitTeacherState() {
            if (!this.partTimeTeacherStateForm.state) {
                this.$Message({
                    message: '请选择跑单原因'
                });
                return false;
            }
            if (this.partTimeTeacherStateForm.state == 7 && !this.partTimeTeacherStateForm.state) {
                this.$Message({
                    message: '请选择原因'
                });
                return false;
            }
            let teaIds;
            if (this.changeTeachStatusType) {
                teaIds = [this.currentID];
            } else {
                teaIds = this.currentIDs;
            }
            let data = Object.assign({}, this.partTimeTeacherStateForm, {
                teaIds
            });
            partTimeAction({
                url: '/api/partTimeTeacherFlow/updateState',
                type: 'post',
                data
            }).then(data => {
                this.$Message({
                    message: '修改状态成功'
                });
                this.getTableData();
            }).catch(message => {
                this.$Message({
                    message
                });
            });
            this.interviewAuditSettingDialog = false;
        },
        openInterviewAuditSettingDialog(tId){
            let teaIds;
            if (tId) {
                this.changeTeachStatusType = true;
                teaIds = [tId];
            } else {
                this.changeTeachStatusType = false;
                teaIds = this.currentIDs;
                if (this.currentIDs && this.currentIDs.length == 0) {
                    this.$Message({
                        message: '请先选择老师'
                    });
                    return false;
                }
            }
            partTimeAction({
                url: '/api/partTimeTeacherFlow/getTeacherUpdateState',
                type: 'post',
                data: {
                    teaIds
                }
            }).then(data => {
                let canChangeStatus = [];
                for (let key in data) {
                    canChangeStatus.push({
                        label: data[key],
                        value: key
                    });
                }
                this.canChangeStatus = canChangeStatus;
                this.interviewAuditSettingDialog = true;
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        },
        cancelInterviewAuditSettingDialog(){
            this.interviewAuditSettingDialog = false;
        },
        // 发送通知
        offerNotices(){
            if (this.currentIDs && this.currentIDs.length == 0) {
                this.$Message({
                    message: '请先选择老师'
                });
                return false;
            }
            this.offerNoticesDialog = true;
        },
        confirmOfferNotices(data){
            if (!data.choose) {
                this.$Message({
                    message: '请选择通知类型'
                });
                return false;
            }
            let type = {
                '报名成功通知': 1,
                '面试通知': 2,
                '面试提醒': 3,
                '面试结果通知': 4,
                '培训通知': 5,
                '培训结果通知': 6
            }[data.choose];
            partTimeAction({
                url: '/api/partTimeTeacherFlow/sendMsg',
                type: 'post',
                data: {
                    teaIds: this.currentIDs,
                    type
                }
            }).then(data => {
                this.$Message({
                    message: data
                })
            }).catch(message => {
                message = message || '操作失败';
                this.$Message({
                    message
                });
            })
            this.offerNoticesDialog = false;
        },
        cancelOfferNotices(){
            this.offerNoticesDialog = false;
        },
        // 列表操作
        handleSizeChange(pageSize) {
            this.search_data.pageSize = pageSize;
            this.search_data.pageNo = 1;
            this.tableLoading = true;
            this.getTableData();
        },
        handleCurrentChange(currentPage) {
            this.search_data.pageNo = currentPage;
            this.tableLoading = true;
            this.getTableData();
        },
        // 点击用户名查看详情
        userDetail({teaId, teaName, referMobile, bu, videoState, appointInterviewTime, cipherTId}) {
            this.userDetailId = teaId;
            this.userDetailTime = appointInterviewTime;
            this.cipherTId = cipherTId;
            this.bu = bu;
            this.userDetailName = teaName;
            this.userDetailMobile = referMobile;
            this.userDetailState = videoState;
            this.$nextTick(function(){
                this.userDetailDialog = true;
            });
        },
        // 关闭用户详情弹窗
        closeUserDetailDialog() {
            this.userDetailTabNumber = 'first';
            this.userDetailDialog = false;
        },
        userDetailTab(tab) {
        },
        auth() {
            return null;
        },
        confirm(){
            this.userDetailDialog = false;
            this.userDetailTabNumber = 'first';
            this.getTableData();
        },
        cancel() {
            this.userDetailDialog = false;
            this.userDetailTabNumber = 'first';
        },
    }
}
