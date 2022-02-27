<template>
  <el-dialog title="招师跟进" class="spectial" v-model="dialogVisible" width="90%" @close="resetForm('ruleForm')">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="老师姓名" v-if="!isBatch">
         <span>{{teaName}}</span>
      </el-form-item>
      <el-form-item label="视频状态" v-if="!isBatch&&parentPage==='interview'">
         <span>{{state | videoStateFilter}}</span>
      </el-form-item>
      <el-form-item label="培训状态" v-if="!isBatch&&parentPage==='train'">
         <span>{{state | trainStateFilter}}</span>
      </el-form-item>
      <el-form-item label="资料状态" v-if="!isBatch&&parentPage==='entry'">
         <span>{{state | introStateFilters}}</span>
      </el-form-item>
      <el-form-item label="跟进结果" prop="optResultType">
        <el-radio-group v-model="ruleForm.optResultType" @change="optResultTypeChange">
          <el-radio v-for="(item,index) in followResult[parentPage]"  :key="index" :label="item.code">
            {{item.name}}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="预约培训" prop="appointTrainTimeStr" v-if="ruleForm.optResultType == 210">
        <el-date-picker
          v-model="ruleForm.appointTrainTimeStr"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="面试时间" prop="appointInterviewTimeStr" v-if="ruleForm.optResultType == 110 ">
        <el-date-picker
          v-model="ruleForm.appointInterviewTimeStr"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="待跟进原因" prop="followUpReason" v-if="ruleForm.optResultType == 120">
        <el-select v-model="ruleForm.followUpReason" placeholder="请选择">
          <el-option v-for="(item,index) in followUpReason[parentPage]" :key="index"
            :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下次跟进时间" prop="nextFollowUpTime" v-if="ruleForm.optResultType == 120">
        <el-date-picker
          v-model="ruleForm.nextFollowUpTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="淘汰原因" prop="outReason" v-if="ruleForm.optResultType == 198">
        <el-select v-model="ruleForm.outReason" placeholder="请选择">
          <el-option v-for="(item,index) in outReason[parentPage]" :key="index"
            :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="放弃原因" prop="outReason" v-if="ruleForm.optResultType == 199">
        <el-select v-model="ruleForm.outReason" placeholder="请选择" key="outReason2">
          <el-option v-for="(item,index) in waiveReason[parentPage]" :key="index"
            :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="跟进记录" v-if="!isBatch">
        <el-table
          v-if="!isBatch"
          :data="tableData"
          border
          style="width:100%;">
          <el-table-column
            prop="createdTime"
            align="center"
            label="操作时间">
          </el-table-column>
          <el-table-column
            prop="optUserName"
            align="center"
            label="操作人">
          </el-table-column>
          <el-table-column
            prop="stageStateStr"
            align="center"
            label="状态操作">
          </el-table-column>
          <el-table-column
            prop="processStageStr"
            align="center"
            label="操作阶段">
          </el-table-column>
          <el-table-column
            prop="optTypeStr"
            align="center"
            label="操作类型">
          </el-table-column>
          <el-table-column
            prop="optDetail"
            align="center"
            label="操作详情">
          </el-table-column>
          <el-table-column
            prop="remark"
            align="center"
            label="备注">
          </el-table-column>
        </el-table>
        <el-pagination
         @current-change="handleCurrentChange"
          :page-size="10"
          layout="prev, pager, next"
          v-bind:total="total">
        </el-pagination>

      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
/**
 * 1. 组件名：【招师跟进】
 * 2. UI样式：弹框（el-dialo）
 * 3. 使用该组件的父组件 3 个：
 *              【招师流程-兼职招师-面试管理 pages\part_time_dir\interview.vue】
 *              【招师流程-兼职招师-培训管理 pages\part_time_dir\train.vue】
 *              【招师流程-兼职招师-入职管理 pages\part_time_dir\entry.vue】
 * 4. 公共参数含义：
 *              parent-page:父组件 => (interview：面试管理)、(train：培训管理)、(entry：入职管理)
 *              isBatch:是否为批量操作 => (true:是)、(false:否)
*/
import {formatDate} from '@/components/date-picker/util';
import getReasonDictionary from '../../../api/select/getReasonDictionary'; // 获取跟进结果数据字典
import fetch from '@/utils/fetch';
export default {
  props:['parent-page'],
  data() {
    return {
      dialogVisible: false,
      isBatch:true,
      teaName:'',
      state:'',
      ruleForm: {
        optResultType :'',
        appointTrainTimeStr :'',
        appointInterviewTimeStr:'',
        followUpReason :'',
        nextFollowUpTime:'',
        outReason:'',
        remark:'',
        teaIds:[]
      },
      rules: {
        appointTrainTimeStr: [{ required: true, message: '请选择', trigger: 'change' }],
        appointInterviewTimeStr: [{ required: true, message: '请选择', trigger: 'change' }],
        nextFollowUpTime: [{ required: true, message: '请选择', trigger: 'change' }],
        optResultType: [{ required: true, message: '请选择', trigger: 'change' }],
        followUpReason: [{ required: true, message: '请选择', trigger: 'change' }],
        outReason: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      followResult:{//跟进结果
        interview:[{name:'预约面试',code:'110'},{name:'待跟进',code:'120'},{name:'淘汰',code:'198'},{name:'主动放弃',code:'199'}],
        train:[{name:'预约培训',code:'210'},{name:'淘汰',code:'198'},{name:'主动放弃',code:'199'}],
        entry:[{name:'淘汰',code:'198'},{name:'主动放弃',code:'199'}]
      },
      followUpReason:{//待跟进
        interview:[], // 待跟进
        train:[],
        entry:[]
      },
      outReason:{//淘汰原因
        interview:[], // 淘汰
        train:[],
        entry:[]
      },
      waiveReason:{//放弃原因
        interview:[], // {name:'态度恶劣',code:'407'},{name:'无面试意愿',code:'402'},{name:'个人原因',code:'403'}
        train:[],
        entry:[]
      },
      tableData: [],
      list:[],
      total:0,
      followReasonOptions: {
        reasonType: 'partTimeReason'
      }, // 跟进结果入参
    };
  },
  watch:{
    'ruleForm.optResultType'(_new,_old){
      this.ruleForm.followUpReason = '';
      this.ruleForm. outReason  = '';
      // this.ruleForm.appointTrainTimeStr = _new=='210'?this.setTimeStr(210): '';
      // this.ruleForm.appointInterviewTimeStr = _new=='110'?this.setTimeStr(110): '';
      this.ruleForm.nextFollowUpTime = _new=='120'?this.setTimeStr(120): '';
    },
    'ruleForm.appointTrainTimeStr'(_new,_old){
      if(typeof _new === 'string') return;
      this.ruleForm.appointTrainTimeStr = formatDate(_new, 'yyyy-MM-dd HH:mm:ss');
    },
    'ruleForm.nextFollowUpTime'(_new,_old){
      if(typeof _new === 'string') return;
      this.ruleForm.nextFollowUpTime = formatDate(_new, 'yyyy-MM-dd HH:mm:ss');
    },
    'ruleForm.appointInterviewTimeStr'(_new,_old){
      if(typeof _new === 'string') return;
      this.ruleForm.appointInterviewTimeStr = formatDate(_new, 'yyyy-MM-dd HH:mm:ss');
    },
  },
  methods: {
    // 切换跟进结果类型
    optResultTypeChange(val) {
      switch (this.parentPage) {
        // 面试管理
        case 'interview':
          if (val === '120') this.followReasonOptions.groupCode = 'followUpReason'
          if (val === '198') this.followReasonOptions.groupCode = 'obsoleteReason'
          if (val === '199') this.followReasonOptions.groupCode = 'giveUpReason'
          break;
        // 培训管理
        case 'train':
          if (val === '198') this.followReasonOptions.groupCode = 'obsoleteReasonOfTrain';
          if (val === '199') this.followReasonOptions.groupCode = 'giveUpReasonOfTrain';
          break;
        // 入职管理
        case 'entry':
          if (val === '198') this.followReasonOptions.groupCode = 'obsoleteReasonOfEntry';
          if (val === '199') this.followReasonOptions.groupCode = 'giveUpReasonOfEntry';
          break;
        default:
          this.followReasonOptions = {};
      }
      // 获取跟进结果数据字典
      getReasonDictionary(this.followReasonOptions)
      .then(res => {
        switch (this.parentPage) {
          // 面试管理
          case 'interview':
            if (this.followReasonOptions.groupCode == 'followUpReason') {
              this.followUpReason['interview'] = res;
            }
            if (this.followReasonOptions.groupCode === 'obsoleteReason') {
              this.outReason['interview'] = res;
            }
            if (this.followReasonOptions.groupCode === 'giveUpReason') {
              this.waiveReason['interview'] = res;
            }
            break;
          // 培训管理
          case 'train':
            if (this.followReasonOptions.groupCode === 'obsoleteReasonOfTrain') {
              this.outReason['train'] = res;
            }
            if (this.followReasonOptions.groupCode === 'giveUpReasonOfTrain') {
              this.waiveReason['train'] = res;
            }
            break;
          // 入职管理
          case 'entry':
            if (this.followReasonOptions.groupCode === 'obsoleteReasonOfEntry') {
              this.outReason['entry'] = res;
            }
            if (this.followReasonOptions.groupCode === 'giveUpReasonOfEntry') {
              this.waiveReason['entry'] = res;
            }
            break;
          default:
            console.log('default');
        }
      })
    },
    show(isBatch,teaIds,teaName,state,time) {
      this.dialogVisible = true;
      this.isBatch = isBatch;
      this.ruleForm.teaIds = teaIds;
      this.teaName = teaName;
      this.state = state;
      if(!isBatch){
        this.getFollowUpLog(teaIds[0]);
        this.ruleForm.appointInterviewTimeStr = this.parentPage === 'interview'? time:this.setTimeStr(110);
        this.ruleForm.appointTrainTimeStr = this.parentPage === 'train'?time:this.setTimeStr(210);
      }
    },
    setTimeStr(key){//默认为当日 加上 3/1天的10点00分00秒
      if(this.parentPage === 'entry') return;
      const _time = new Date();
      const _nowDayNum = +new Date(_time.getFullYear()+'-'+(_time.getMonth()+1)+'-'+_time.getDate()+' 00:00:00');
      if(key===110){
        const _sanAfterDay = _nowDayNum + 3*24*60*60*1000 + 10*60*60*1000;
        return formatDate(_sanAfterDay, 'yyyy-MM-dd HH:mm:ss');
      }else{
        const _oneAfterDay = _nowDayNum + 1*24*60*60*1000 + 10*60*60*1000;
        return formatDate(_oneAfterDay, 'yyyy-MM-dd HH:mm:ss');
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) this.submitFormFun();
      });
    },
    submitFormFun(){
      fetch({
          url: '/api/zm-teacher-recruit-web/api/partTimeTeacherFlow/fllow_up',
          method: 'post',
          data: this.ruleForm
      }).then((result) => {
        const {code,message,data} = result;
        if (code == 0) {
          this.$Message.success('操作成功');
          this.resetForm('ruleForm');
          this.$emit('successBack');
        } else {
          this.$Message.error(message);
        }
      })
      .catch((err) => {
          this.$Message.error({message:err});
      });
    },
    getFollowUpLog(teaId){
      fetch({
          url: '/api/zm-teacher-recruit-web/biz/common/follow_up_log',
          method: 'get',
          params: {teaId}
      }).then((result) => {
        const {code,message,data} = result;
        if (code == 0) {
          this.list = data;
          this.sliceData(1);
          this.total = data.length;
        } else {
          this.$Message.error(message);
        }
      })
      .catch((err) => {
          this.$Message.error({message:err});
      });
    },
    sliceData(n){
      this.tableData = this.list.slice((n-1)*10,(n-1)*10+9);
    },
    handleCurrentChange(val){
      this.sliceData(val);
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
      this.ruleForm.remark = '';
    }
  },
  filters:{
    videoStateFilter(val) { // 视频状态:待提交0 待审核1 待重新提交2
      switch (val + '') {
        case '0':
            return '待提交';
        case '1':
            return '待审核';
        case '2':
            return '待重新提交';
        default:
            return '--';
      }
    },
    trainStateFilter(val) {
        if (val == 0) {
            return '待培训';
        }
        if (val == 1) {
            return '培训中';
        }
        return '--';
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
                text = "--";
                break;
        }
        return text;
    },
  }
}
</script>
<style lang="less" scoped>
.el-textarea{
  width:300px;
}
.el-form-item{
  margin-bottom: 20px;
}
.el-table{
  border: 1px solid #e5e5e5;
}
</style>

<style lang="less">
  .spectial{
    .el-dialog__body,.el-dialog__footer{
      background-color: #fff;
    }
  }
</style>
