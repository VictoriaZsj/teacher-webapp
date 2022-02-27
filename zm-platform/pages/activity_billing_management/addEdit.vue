<template>
  <el-dialog :title="dialogTitle"
             v-model="dialogShow"
             size="middle"
             :white="true"
             @close="cancelSubmit"
             :close-on-click-modal="isView"
             :close-on-press-escape="isView"
             center>
    <div class="reward-item">
      <el-row>
        <el-col class="required" :span="4">奖励规则名称:</el-col>
        <el-col :span="20">
          <el-input :disabled="isView" style="width:100%" :maxlength="100" v-model="ruleName"
                    placeholder="请输入奖励规则名称"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">学段:</el-col>
        <el-col :span="20">
          <el-select :disabled="isView" style="width:86%;"
                     multiple
                     placeholder="请选择"
                     filterable
                     @change="selectGrade"
                     v-model="ruleList[0].gradeCode">
            <el-option v-for="(item,index) in gradeHobbyList"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-checkbox :disabled="isView" @change="selectFullGrade(grade_all)" v-model="grade_all"
                       style="vertical-align: top;margin-top: 5px;">
            全选
          </el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">科目:</el-col>
        <el-col :span="20">
          <el-select :disabled="isView" style="width:86%;"
                     multiple
                     placeholder="请选择"
                     filterable
                     @change="selectSub"
                     v-model="ruleList[0].subjectCode">
            <el-option v-for="(item,index) in subjectList"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-checkbox :disabled="isView" @change="selectFullSub(sub_all)" v-model="sub_all"
                       style="vertical-align: top;margin-top: 5px;">全选
          </el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">学校:</el-col>
        <el-col :span="20">
          <el-select :disabled="isView" style="width:86%;"
                     multiple
                     placeholder="请选择"
                     filterable
                     @change="selectSchool"
                     v-model="ruleList[0].schoolCode">
            <el-option v-for="(item,index) in schoolList"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-checkbox :disabled="isView" @change="selectFullSchool(school_all)"
                       style="vertical-align: top;margin-top: 5px;"
                       v-model="school_all">全选
          </el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="required" :span="4">奖励规则:</el-col>
        <el-col :span="20">
          <div v-for="(_item,_index) in ruleList[0].rewardDetailList" :key="_index" class="reward-rule">
            <!-- <span v-if="_index == 0">推荐人数></span> -->
            <span>推荐人数>=</span>
            <input :disabled="isView" class="rule-input" type="text" v-model="_item.recommendednumber">
            <span>入职奖励（元/人）</span>
            <input :disabled="isView" class="rule-input" type="text" v-model="_item.recommendedrewardamount">
            <span>转正奖励（元/人）</span>
            <input :disabled="isView" class="rule-input" type="text" v-model="_item.regularrewardamount">
            <span>入职</span>
            <input :disabled="isView" class="rule-input" type="text" v-model="_item.entrytime">
            <span>月奖励（元/人）</span>
            <input :disabled="isView" class="rule-input" type="text" v-model="_item.entryrewardamount">
            <span v-if="!isView" @click="addRewardList(0,_index)" class="icon-add">+</span>
            <span v-if="!isView" @click="delRewardList(0,_index)" class="icon-del">-</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="!isView" class="control">
      <el-button @click="dialogShow = false,cancelSubmit">取消</el-button>
      <el-button @click="submit" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import getSubject from '../../api/select/getSubject';
  import getSchool from '../../api/select/getSchool';
  import getPhase from '../../api/select/getPhase';

  const rewardRule = {
    entryrewardamount: '月奖励',
    entrytime: '入职',
    recommendednumber: '推荐人数',
    recommendedrewardamount: '入职奖励',
    regularrewardamount: '转正奖励',
  };
  export default {
    name: "addEdit",
    data() {
      return {
        isView: false,
        school_all: false,
        sub_all: false,
        grade_all: false,
        dialogShow: false,
        dialogTitle: '',
        gradeHobbyList: [],
        schoolList: [],
        subjectList: [],
        id: '',
        ruleName: '',//规则名称
        ruleList: [
          {
            grade: [],//年级
            gradeCode: [],
            rewardDetailList: [
              {
                entryrewardamount: '',//入职后奖励金额
                entrytime: '',//入职时间（月）
                recommendednumber: '',//推荐人数
                recommendedrewardamount: '',//推荐奖励金额
                regularrewardamount: '',//转正奖励金额
                // status: 0//状态：1在用，0废弃
              }
            ],
            school: [],//学校
            schoolCode: [],
            subject: [],//科目
            subjectCode: []
          }
        ]
      }
    },
    created() {
      let p1 = getPhase({});
      let p2 = getSchool({});
      let p3 = getSubject({});
      Promise.all([p1, p2, p3]).then((result) => {
        this.gradeHobbyList = result[0].children;
        this.schoolList = result[1].children;
        this.subjectList = result[2].children;
        this.getAgentReward();
      }).catch((error) => {

      });
    },
    methods: {
      selectGrade() {
        let curLen = this.ruleList[0].gradeCode.length;
        let allLen = this.getAllGradeCode().length;
        if (curLen == allLen) {
          this.grade_all = true;
        } else {
          this.grade_all = false;
        }
      },
      selectFullGrade(check) {
        if (check) {
          this.ruleList[0].gradeCode = this.getAllGradeCode();
        } else {
          this.ruleList[0].gradeCode = [];
        }
      },
      getAllGradeCode() {
        let codeList = [];
        for (let i = 0; i < this.gradeHobbyList.length; i++) {
          codeList.push(this.gradeHobbyList[i].value);
        }
        return codeList;
      },
      selectSub() {
        let curLen = this.ruleList[0].subjectCode.length;
        let allLen = this.getAllSubCode().length;
        if (curLen == allLen) {
          this.sub_all = true;
        } else {
          this.sub_all = false;
        }
      },
      selectFullSub(check) {
        if (check) {
          this.ruleList[0].subjectCode = this.getAllSubCode();
        } else {
          this.ruleList[0].subjectCode = [];
        }
      },
      getAllSubCode() {
        let codeList = [];
        for (let i = 0; i < this.subjectList.length; i++) {
          codeList.push(this.subjectList[i].value);
        }
        return codeList;
      },
      selectSchool() {
        let curLen = this.ruleList[0].schoolCode.length;
        let allLen = this.getAllSchoolCode().length;
        if (curLen == allLen) {
          this.school_all = true;
        } else {
          this.school_all = false;
        }
      },
      selectFullSchool(check) {
        if (check) {
          this.ruleList[0].schoolCode = this.getAllSchoolCode();
        } else {
          this.ruleList[0].schoolCode = [];
        }
      },
      getAllSchoolCode() {
        let codeList = [];
        for (let i = 0; i < this.schoolList.length; i++) {
          codeList.push(this.schoolList[i].value);
        }
        return codeList;
      },
      isRuleName() {
        if (this.ruleName.replace(/ /g, '') === '') {
          this.$Message({
            type: 'error',
            message: '请填写【奖励规则名称】'
          });
          return true
        }
        return false
      },
      isAward() {
        let ruleLength = this.ruleList[0].rewardDetailList.length;
        let reg = /^\d*$/;
        for (let i = 0; i < ruleLength; i++) {
          for (const key in this.ruleList[0].rewardDetailList[i]) {
            if (!reg.test(this.ruleList[0].rewardDetailList[i][key])) {
              this.$Message.error({
                message: '【奖励规则】第【' + (i + 1) + '】行的' + '【' + rewardRule[key] + '】不能小于0且为整数'
              });
              return true;
            }
            if (this.ruleList[0].rewardDetailList[i][key].replace(/ /g, '') === '') {
              this.$Message.error({
                message: '【奖励规则】第【' + (i + 1) + '】行的' + '【' + rewardRule[key] + '】未填写'
              });
              return true;
            }
          }
        }
        return false;
      },
      submit() {
        if (this.isRuleName()) return;
        if (this.isAward()) return;
        let param = this.disposeParam();
        if (this.dialogTitle === '新增') {
          this.addRule(param);
        } else {
          this.updateRule(param);
        }
      },
      disposeParam() {
        let param = {
          ruleList: [{}],
          ruleName: this.ruleName
        };
        if (this.grade_all) {
          param.ruleList[0].grade = '全部';
          param.ruleList[0].gradeCode = 'all';
        } else {
          let grade = [];
          this.ruleList[0].gradeCode.forEach((item, index) => {
            for (let i = 0; i < this.gradeHobbyList.length; i++) {
              if (item === this.gradeHobbyList[i].value) {
                grade.push(this.gradeHobbyList[i].label);
                break;
              }
            }
          });
          this.ruleList[0].grade = grade;
          param.ruleList[0].grade = this.ruleList[0].grade.join(',');
          param.ruleList[0].gradeCode = this.ruleList[0].gradeCode.join(',');
        }
        if (this.school_all) {
          param.ruleList[0].school = '全部';
          param.ruleList[0].schoolCode = 'all';
        } else {
          let school = [];
          this.ruleList[0].schoolCode.forEach((item, index) => {
            for (let i = 0; i < this.schoolList.length; i++) {
              if (item === this.schoolList[i].value) {
                school.push(this.schoolList[i].label);
                break;
              }
            }
          });
          this.ruleList[0].school = school;
          param.ruleList[0].school = this.ruleList[0].school.join(',');
          param.ruleList[0].schoolCode = this.ruleList[0].schoolCode.join(',');
        }
        if (this.sub_all) {
          param.ruleList[0].subject = '全部';
          param.ruleList[0].subjectCode = 'all';
        } else {
          let subject = [];
          this.ruleList[0].subjectCode.forEach((item, index) => {
            for (let i = 0; i < this.subjectList.length; i++) {
              if (item === this.subjectList[i].value) {
                subject.push(this.subjectList[i].label);
                break;
              }
            }
          });
          this.ruleList[0].subject = subject;
          param.ruleList[0].subject = this.ruleList[0].subject.join(',');
          param.ruleList[0].subjectCode = this.ruleList[0].subjectCode.join(',');
        }
        param.ruleList[0].rewardDetailList = this.ruleList[0].rewardDetailList;
        return param
      },
      addRule(param) {
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/channel/activityRewardRule/add',
          method: 'post',
          data: param
        }).then((data) => {
          this.responseDispose(data);
        }).catch(message => {
          this.$Message.error({
            message
          });
        })
      },
      updateRule(param) {
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/channel/activityRewardRule/update',
          method: 'post',
          data: {
            id: this.id,
            isDelete: 0,
            ...param
          }
        }).then((data) => {
          this.responseDispose(data);
        }).catch(message => {
          this.$Message.error({
            message
          });
        })
      },
      responseDispose(data) {
        if (data.msgCode === '200') {
          this.$Message({
            type: 'success',
            message: '操作成功'
          });
          this.$emit('updateList',);
          this.dialogShow = false;
          this.cancelSubmit();
        } else {
          this.$Message.error({
            message: data.msgContent
          });
        }
      },
      cancelSubmit() {
        this.id = '';
        this.school_all = false;
        this.sub_all = false;
        this.grade_all = false;
        this.ruleName = '';
        setTimeout(() => {
          this.ruleList = [{
            grade: [],//年级
            gradeCode: [],
            rewardDetailList: [
              {
                entryrewardamount: '',//入职后奖励金额
                entrytime: '',//入职时间（月）
                recommendednumber: '',//推荐人数
                recommendedrewardamount: '',//推荐奖励金额
                regularrewardamount: '',//转正奖励金额
                // status: 0//状态：1在用，0废弃
              }
            ],
            school: [],//学校
            schoolCode: [],
            subject: [],//科目
            subjectCode: []
          }];
        }, 200)
      },
      editParamDispose(info) {
        let rewardDetailList = [];
        info.ruleList[0].rewardDetailList.forEach((item, index) => {
          rewardDetailList[index] = {};
          for (const key in item) {
            if (key !== 'status') {
              rewardDetailList[index][key] = item[key]?String(item[key]):'0';
            }
          }
        });
        this.ruleName = info.ruleName;
        this.ruleList[0].rewardDetailList = rewardDetailList;
        this.ruleList[0].grade = [];
        if (info.ruleList[0].gradeCode === 'all') {
          this.selectFullGrade(true);
        } else {
          this.ruleList[0].gradeCode = info.ruleList[0].gradeCode === '' ? [] : info.ruleList[0].gradeCode.split(',');
        }
        this.ruleList[0].school = [];
        if (info.ruleList[0].schoolCode === 'all') {
          this.selectFullSchool(true);
        } else {
          this.ruleList[0].schoolCode = info.ruleList[0].schoolCode === '' ? [] : info.ruleList[0].schoolCode.split(',');
        }
        this.ruleList[0].subject = [];
        if (info.ruleList[0].subjectCode === 'all') {
          this.selectFullSub(true);
        } else {
          this.ruleList[0].subjectCode = info.ruleList[0].subjectCode === '' ? [] : info.ruleList[0].subjectCode.split(',');
        }
        this.selectSchool();
        this.selectGrade();
        this.selectSub();
      },
      showDialog(info, view) {
        this.dialogShow = true;
        this.isView = view ? true : false;
        this.dialogTitle = info ? '修改' : '新增';
        if (info) {
          this.id = info.id;
          this.editParamDispose(info);
        } else {
          this.selectFullSchool(true);
          this.selectFullSub(true);
          this.selectFullGrade(true);
          this.school_all = true;
          this.sub_all = true;
          this.grade_all = true;
        }
      },
      addRewardList(mainIndex, subIndex) {
        this.ruleList[mainIndex].rewardDetailList.push({
          recommendednumber: '',//推荐人数
          recommendedrewardamount: '',//推荐奖励金额
          regularrewardamount: '',//转正奖励金额
          entrytime: '',//入职时间（月）
          entryrewardamount: ''//入职后奖励金
        });
      },
      delRewardList(mainIndex, subIndex) {
        if (this.ruleList[mainIndex].rewardDetailList.length == 1) {
          return;
        }
        this.ruleList[mainIndex].rewardDetailList.splice(subIndex, 1);
      },
    }
  }
</script>

<style scoped>
  .required::before {
    content: '*';
    color: red;
  }

  .el-row {
    padding: 10px;
  }

  .el-row:after {
    content: '';
    display: table;
    clear: both;
  }

  .icon-add {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 26px;
    font-size: 26px;
    line-height: 14px;
    cursor: pointer;
    text-align: center;
  }

  .icon-del {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
    font-size: 26px;
    line-height: 14px;
    cursor: pointer;
    text-align: center;
  }

  .reward-rule {
    position: relative;
    padding: 10px;
  }

  .rule-input {
    width: 40px;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #ededed;
  }

  .control {
    text-align: right;
    padding-top: 20px;
    background-color: white;
  }
</style>
