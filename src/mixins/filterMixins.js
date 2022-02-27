export default {
    filters: {
        entryStateFilters(val){ // 入职资料审核状态
            let text = "";
            if(val == "0"){
                text = "待提交";
            }
            if(val == "1"){
                text = "待审核";
            }
            if(val == "2"){
                text = "审核通过";
            }
            if(val == "3"){
                text = "审核不通过";
            }
            return text;
        },
        timeTypeFilters (val) { // 工作性质
            let text = "";
            let _val = val + "";
            switch (_val) {
                case '0':
                    text = "兼职";
                    break;
                case '1':
                    text = "全职";
                    break;
                case '2':
                    text = "校招全职";
                    break;
                case '3':
                    text = "公校兼职";
                    break;
                case '4':
                    text = "学科班主任";
                    break;
                default:
                    break;
            }
            return text;
        },
        introStateFilters (val) {
            let text = "";
            let _val = val + "";
            switch (_val) {
                case '0':
                    text = "待提交";
                    break;
                case '1':
                    text = "待审核";
                    break;
                case '2':
                    text = "审核通过";
                    break;
                case '3':
                    text = "审核不通过";
                    break;
                default:
                    text = "-";
                    break;
            }
            return text;
        },
        recommendFilters (val) { //是否可排课
            if(val == 0){
                return "不建议排课";
            }
            if(val == 1){
                return "建议排课";
            }
            return "";
        },
        teaBuFilter (val) { //BU
            if(val == "1"){
                return "1对1";
            }
            if(val == "2"){
                return "少儿";
            }
            if(val == "3"){
                return "陪练";
            }
            return "";
        },
        teaStateFilter(val) {
            if (val == 3) {
                return '待培训';
            }
            if (val == 5) {
                return '已完善资料';
            }
            if (val == 8) {
                return '已签协议';
            }
            if (val == 9) {
                return '待入库';
            }
        },
        trainResultFilter(val) {
            if (val == 2) {
                return '培训通过';
            }
            if (val == 4) {
                return '培训延期';
            }
            return '暂无';
        },
        dataStateFilter(val) {
            if (val == 0) {
                return '待提交';
            }
            if (val == 1) {
                return '待审核';
            }
            if (val == 2) {
                return '审核通过';
            }
            if (val == 3) {
                return '审核不通过';
            }
            return '暂无';
        },
        trainStateFilter(val) {
            if (val == 0) {
                return '待培训';
            }
            if (val == 1) {
                return '培训中';
            }
            return '-';
        },
        majorTeacherFilter (val) { //是否主课老师
            if(val == "1"){
                return "是";
            }
            if(val == "0"){
                return "否";
            }
            return "";
        },
        interviewResultFilter (val) { // 面试结果
            if (val == 2) {
                return '待二面';
            }
            return '暂无';
        },
        communicateResultFilter(val) { // 面试沟通结果 确认面试1，延迟面试2，放弃面试3，未联系到4 ,
            switch (val + '') {
                case '1':
                    return '确认面试';
                case '2':
                    return '延迟面试';
                case '3':
                    return '放弃面试';
                case '4':
                    return '未联系到';
                default: 
                    return '';
            }
        },
        videoStateFilter(val) { // 视频状态:待提交0 待审核1 待重新提交2
            switch (val + '') {
                case '0':
                    return '待提交';
                case '1':
                    return '待审核';
                case '2':
                    return '待重新提交';
                default:
                    return '';
            }
        },
        followUpResultFilter(val) {
            switch (val + '') {
                case '1':
                    return '预约面试';
                case '4':
                    return '待跟进';
                default:
                    return '';
            }
        },
        readyAtFilter(val) {
            let sec = (new Date() - new Date(val))/1000;
            return Math.floor(sec/3600/24) + '天';
        },
        blackFilter(val) {
            if (val == 0) {
                return '否';
            }
            if (val == 1) {
                return '是';
            }
        }
    }
}