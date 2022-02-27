<template>
  <div>
    <div class="content">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <div v-for="(item,index) in option" :key="index" class="reward-item">
        <el-row>
          <el-col :span="4">适用年级:</el-col>
          <el-col :span="20">
            <el-select style="width:86%;" @change="selectGrade(index)" multiple v-model="item.gradeCode" placeholder="请选择">
                <el-option v-for="(item,index) in gradeHobbyList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-checkbox @change="selectFullGrade(index,item.grade_all)" style="vertical-align: top;margin-top: 5px;" v-model="item.grade_all">全选</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">适用科目:</el-col>
          <el-col :span="20">
            <el-select style="width:86%;" @change="selectSub(index)" multiple v-model="item.subjectCode" placeholder="请选择">
                <el-option v-for="(item,index) in subjectList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-checkbox @change="selectFullSub(index,item.sub_all)" style="vertical-align: top;margin-top: 5px;" v-model="item.sub_all">全选</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">适用学校:</el-col>
          <el-col :span="20">
            <el-select style="width:86%;" @change="selectSchool(index)" multiple filterable v-model="item.schoolCode" placeholder="请选择">
                <el-option v-for="(item,index) in schoolList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-checkbox @change="selectFullSchool(index,item.scholl_all)" style="vertical-align: top;margin-top: 5px;" v-model="item.scholl_all">全选</el-checkbox>
          </el-col>
        </el-row>
        <div v-for="(_item,_index) in item.rewardDetailList" :key="_index" class="reward-rule">
          <!-- <span v-if="_index == 0">推荐人数></span> -->
          <span>推荐人数>=</span>
          <input class="rule-input" type="text" v-model="_item.recommendednumber">
          <span>奖励（元/人）</span>
          <input class="rule-input" type="text" v-model="_item.recommendedrewardamount">
          <span>转正奖励（元/人）</span>
          <input class="rule-input" type="text" v-model="_item.regularrewardamount">
          <span>入职</span>
          <input class="rule-input" type="text" v-model="_item.entrytime">
          <span>月奖励（元/人）</span>
          <input class="rule-input" type="text" v-model="_item.entryrewardamount">
          <span @click="addRewardList(index,_index)" class="icon-add">+</span>
          <span @click="delRewardList(index,_index)" class="icon-del">-</span>
        </div>
        <span @click="addOption(index)" class="icon-add">+</span>
        <span @click="delOption(index)" class="icon-del">-</span>
      </div>

    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
import getSubject from '../../api/select/getSubject';
import getSchool from '../../api/select/getSchool';
import getPhase from '../../api/select/getPhase';
import saveActivtyAwardConfig from '../../api/action/saveActivtyAwardConfig';
import agentActivtyConfig from '../../api/select/agentActivtyConfig';
import { deepCopy } from '../../../src/utils/assist';

export default {
    data() {
        return {
            buttonState:false,
            tableLoading:false,
            gradeHobbyList:[],
            schoolList:[],
            subjectList:[],
            option:[
              {
                grade:[],//年级
                gradeCode:[],//年级
                grade_all:false,
                subject:[],//科目
                subjectCode:[],//科目
                sub_all:false,
                school:[],//学校
                schoolCode:[],//学校
                scholl_all:true,//默认全选
                rewardDetailList:[
                  {
                    recommendednumber:'',//推荐人数
                    recommendedrewardamount:'',//推荐奖励金额
                    regularrewardamount:'',//转正奖励金额
                    entrytime:'',//入职时间（月）
                    entryrewardamount:''//入职后奖励金
                  }
                ]
              }
            ]
        }
    },
    props:{
        configLinkId:"",
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else{
          this.getAgentReward();
        }
      }
    },
    methods:{
        selectSub(index){
          let curLen = this.option[index].subjectCode.length;
          let allLen = this.getAllSubCode().length;
          if(curLen == allLen){
            this.option[index].sub_all = true;
          }else{
            this.option[index].sub_all = false;
          }
        },
        selectFullSub(index,state){
          if(!!state){
            this.option[index].subjectCode = this.getAllSubCode();
          }else{
            this.option[index].subjectCode = [];
          }
        },
        selectGrade(index){
          let curLen = this.option[index].gradeCode.length;
          let allLen = this.getAllGradeCode().length;
          if(curLen == allLen){
            this.option[index].grade_all = true;
          }else{
            this.option[index].grade_all = false;
          }
        },
        selectFullGrade(index,state){
          if(!!state){
            this.option[index].gradeCode = this.getAllGradeCode();
          }else{
            this.option[index].gradeCode = [];
          }
        },
        selectSchool(index){
          let curLen = this.option[index].schoolCode.length;
          let allLen = this.getAllSchoolCode().length;
          if(curLen == allLen){
            this.option[index].scholl_all = true;
          }else{
            this.option[index].scholl_all = false;
          }
        },
        selectFullSchool(index,state){
          if(!!state){
            this.option[index].schoolCode = this.getAllSchoolCode();
          }else{
            this.option[index].schoolCode = [];
          }
        },
        getAllGradeCode(){
          let codeList = [];
          for(let i = 0; i < this.gradeHobbyList.length; i++){
            codeList.push(this.gradeHobbyList[i].value);
          }
          return codeList;
        },
        getAllSubCode(){
          let codeList = [];
          for(let i = 0; i < this.subjectList.length; i++){
            codeList.push(this.subjectList[i].value);
          }
          return codeList;
        },
        getAllSchoolCode(){
          let codeList = [];
          for(let i = 0; i < this.schoolList.length; i++){
            codeList.push(this.schoolList[i].value);
          }
          return codeList;
        },
        getAgentReward(){
          if(!this.configLinkId){
            this.$Message({
                message: "未设置活动ID"
            });
            return;
          }
          this.tableLoading = true;
          agentActivtyConfig({agentActivityId:this.configLinkId}).then(data => {
            this.tableLoading = false;
            if(!!data.ruleList){
              let _option = data.ruleList;
              for(let i = 0; i < _option.length; i++){
                if(!!_option[i].gradeCode){
                  if(_option[i].gradeCode == 'all'){
                    _option[i].gradeCode = this.getAllGradeCode();
                    _option[i].grade_all = true;
                  }else{
                    _option[i].gradeCode = _option[i].gradeCode.split(',');
                    _option[i].grade_all = false;
                  }
                }else {
                  _option[i].gradeCode = [];
                  _option[i].grade_all = false;
                }
                if(!!_option[i].subjectCode){
                  if(_option[i].subjectCode == 'all'){
                    _option[i].subjectCode = this.getAllSubCode();
                    _option[i].sub_all = true;
                  }else{
                    _option[i].subjectCode = _option[i].subjectCode.split(',');
                    _option[i].sub_all = false;
                  }
                }else {
                  _option[i].subjectCode = [];
                  _option[i].sub_all = false;
                }
                if(!!_option[i].schoolCode){
                  if(_option[i].schoolCode == "all"){
                    _option[i].schoolCode = this.getAllSchoolCode();
                    _option[i].scholl_all = true;
                  }else{
                    _option[i].schoolCode = _option[i].schoolCode.split(',');
                    _option[i].scholl_all = false;
                  }
                }else {
                  _option[i].schoolCode = [];
                  _option[i].scholl_all = false;
                }

              }
              this.option = _option;
            }else{
              this.selectFullSchool(0,true)
            }
          }).catch(message => {
            this.tableLoading = false;
            this.$Message({
                message: message
            });
          });
        },
        cancel () {
            this.$emit("cancel");
        },
        getGradeText(data){
          let textList = [];
          for(let i = 0; i < data.length; i++){
            textList.push(this.gradeText(data[i]));
          }
          return textList.toString();
        },
        gradeText(item){
          let text = "";
          for(let i = 0; i < this.gradeHobbyList.length; i++){
            if(this.gradeHobbyList[i].value == item){
              text = this.gradeHobbyList[i].label;
              break;
            }
          }
          return text;
        },
        getSubjectText(data){
          let textList = [];
          for(let i = 0; i < data.length; i++){
            textList.push(this.subjectText(data[i]));
          }
          return textList.toString();
        },
        subjectText(item){
          let text = "";
          for(let i = 0; i < this.subjectList.length; i++){
            if(this.subjectList[i].value == item){
              text = this.subjectList[i].label;
              break;
            }
          }
          return text;
        },
        getSchoolText(data){
          let textList = [];
          for(let i = 0; i < data.length; i++){
            textList.push(this.schoolText(data[i]));
          }
          return textList.toString();
        },
        schoolText(item){
          let text = "";
          for(let i = 0; i < this.schoolList.length; i++){
            if(this.schoolList[i].value == item){
              text = this.schoolList[i].label;
              break;
            }
          }
          return text;
        },
        format(_option){
          let item = null,
              option = _option;
          for(let i = 0; i < option.length; i++){
            item = option[i];
            if(item.grade_all){
              item.grade = "全部";//年级
              item.gradeCode = "all";//年级
            }else{
              item.grade = this.getGradeText(item.gradeCode);//年级
              item.gradeCode = item.gradeCode.toString();//年级
            }
            if(item.sub_all){
              item.subject = "全部";//科目
              item.subjectCode = "all";//科目
            }else{
              item.subject = this.getSubjectText(item.subjectCode);//科目
              item.subjectCode = item.subjectCode.toString();//科目
            }
            if(item.scholl_all){
              item.school = "全部";//学校
              item.schoolCode = "all";//学校
            }else{
              item.school = this.getSchoolText(item.schoolCode);//学校
              item.schoolCode = item.schoolCode.toString();//学校
            }
          }
          return option;
        },
        confirm () {
          if(!this.configLinkId){
            this.$Message({
                message: "未设置活动ID"
            });
            return;
          }
          if(this.ruleValid()){
            //类型转换
            let _option = deepCopy(this.option);
            _option = this.format(_option);
            this.buttonState = true;
            let parm =  {
                "id": this.configLinkId,
                "ruleList": _option
            };
            saveActivtyAwardConfig(parm).then(data => {
              this.$Message({
                  message: "操作成功"
              });
              this.buttonState = false;
              this.$emit("confirm");
              this.default();
            }).catch(message => {
              this.buttonState = false;
              this.$Message({
                  message: message
              });
            });
          }
        },
        ruleValid(){
          //判断年级 科目 学校是否选择
          let len = this.option.length,
              item = null,
              subItem = null,
              error = "";
          for(let i = 0; i < len; i++){
            item = this.option[i];
            if(!item.gradeCode){
              error = "请选择年级";
              break;
            }
            if(!item.subjectCode){
              error = "请选择科目";
              break;
            }
            if(!item.schoolCode){
              error = "请选择学校";
              break;
            }
            let subLen = 0;
            subLen = item.rewardDetailList.length;
            let subError = "";
            let prevSubItem = null;
            for(let j = 0; j < subLen; j++){
              subItem = item.rewardDetailList[j];
              if(this.isNull(subItem.recommendednumber) || this.isNull(subItem.recommendedrewardamount) || this.isNull(subItem.regularrewardamount) || this.isNull(subItem.entrytime) || this.isNull(subItem.entryrewardamount)){
                subError = "请完善奖励规则";
                break;
              }
              if(isNaN(subItem.recommendednumber)){
                subError = "推荐人数应为数字";
                break;
              }else if(subItem.recommendednumber < 0){
                subError = "推荐人数应该大于0";
                break;
              }else if(parseInt(subItem.recommendednumber, 10) != subItem.recommendednumber){
                subError = "推荐人数应为整数";
                break;
              }
              if(isNaN(subItem.recommendedrewardamount)){
                subError = "推荐奖励金额应为数字";
                break;
              }
              if(subItem.regularrewardamount != ""){
                if(isNaN(subItem.regularrewardamount)){
                  subError = "转正奖励金额应为数字";
                  break;
                }
              }
              if(subItem.entrytime != ""){
                if(isNaN(subItem.entrytime)){
                  subError = "入职时间（月）应为数字";
                  break;
                }else if(subItem.entrytime <= 0){
                  subError = "入职时间（月）应该大于0";
                  break;
                }else if(parseInt(subItem.entrytime, 10) != subItem.entrytime){
                  subError = "入职时间（月）应为整数";
                  break;
                }
              }
              if(subItem.entryrewardamount != ""){
                if(isNaN(subItem.entryrewardamount)){
                  subError = "入职后奖励金应为数字";
                  break;
                }
              }

              if(prevSubItem != null){
                if(parseInt(subItem.recommendednumber) <= parseInt(prevSubItem.recommendednumber)){
                  //
                  subError = "推荐人数大小应按顺序递增";
                  break;
                }
              }
              prevSubItem = subItem;
            }
            if(!!subError){
              error = subError;
              break;
            }
          }
          if(!!error){
            this.$Message({
                message: error
            });
            return false;
          }
          return true;
        },
        isNull(val){
          return val == null || typeof val == "undefined";
        },
        addOption(index){
          this.option.push({
            grade:[],//年级
            gradeCode:[],//年级
            grade_all:false,
            subject:[],//科目
            subjectCode:[],//科目
            sub_all:false,
            school:[],//学校
            schoolCode:[],//学校
            scholl_all:true,
            rewardDetailList:[
              {
                recommendednumber:'',//推荐人数
                recommendedrewardamount:'',//推荐奖励金额
                regularrewardamount:'',//转正奖励金额
                entrytime:'',//入职时间（月）
                entryrewardamount:''//入职后奖励金
              }
            ]
          });
          this.selectFullSchool(index+1,true)
        },
        delOption(index){
          if(this.option.length == 1){
            return;
          }
          this.option.splice(index,1);
        },
        addRewardList(mainIndex,subIndex){
          this.option[mainIndex].rewardDetailList.push({
            recommendednumber:'',//推荐人数
            recommendedrewardamount:'',//推荐奖励金额
            regularrewardamount:'',//转正奖励金额
            entrytime:'',//入职时间（月）
            entryrewardamount:''//入职后奖励金
          });
        },
        delRewardList(mainIndex,subIndex){
          if(this.option[mainIndex].rewardDetailList.length == 1){
            return;
          }
          this.option[mainIndex].rewardDetailList.splice(subIndex,1);
        },
        default () {
          this.option = [
            {
              grade:[],//年级
              gradeCode:[],//年级
              subject:[],//科目
              subjectCode:[],//科目
              school:[],//学校
              schoolCode:[],//学校
              scholl_all:false,
              rewardDetailList:[
                {
                  recommendednumber:'',//推荐人数
                  recommendedrewardamount:'',//推荐奖励金额
                  regularrewardamount:'',//转正奖励金额
                  entrytime:'',//入职时间（月）
                  entryrewardamount:''//入职后奖励金
                }
              ]
            }
          ];
        }
    },
    mounted:function(){
      let p1 = getPhase({});
      let p2 = getSchool({});
      let p3 = getSubject({});
      Promise.all([p1, p2, p3]).then((result) => {
        this.gradeHobbyList = result[0].children;
        this.schoolList = result[1].children;
        this.subjectList = result[2].children;
        this.getAgentReward();
      }).catch((error) => {

      })

      // getPhase({}).then(data => {
      //   this.gradeHobbyList = data.children;
      // }).catch(message => {
      //   this.$Message({
      //       message: message
      //   });
      // });
      // getSchool({}).then(data => {
      //   this.schoolList = data.children;
      // }).catch(message => {
      //   this.$Message({
      //       message: message
      //   });
      // });
      // getSubject({}).then(data => {
      //   this.subjectList = data.children;
      // }).catch(message => {
      //   this.$Message({
      //       message: message
      //   });
      // });

    },
    components:{

    }
}
</script>
<style scoped>
    .content{
      max-height: 400px;
      overflow-y: auto;
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
    .reward-item{
      position: relative;
      padding-bottom:20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .icon-add{
      position: absolute;
      width: 20px;
      height: 20px;
      top:10px;
      right:26px;
      font-size: 26px;
      line-height: 14px;
      cursor: pointer;
      text-align: center;
    }
    .icon-del{
      position: absolute;
      width: 20px;
      height: 20px;
      top:10px;
      right:10px;
      font-size: 26px;
      line-height: 14px;
      cursor: pointer;
      text-align: center;
    }
    .reward-rule{
      position: relative;
      padding: 10px;
    }
    .rule-input{
      width: 40px;
      border-left: none;
      border-right: none;
      border-top: none;
      border-bottom: 1px solid #ededed;
    }
</style>
