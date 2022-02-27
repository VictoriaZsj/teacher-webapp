<template>
  <div class="set-post-condition">

    <el-dialog
      :title="`${pageTypeStr}`"
      v-model="dialogVisible"
      top="5vh"
      :append-to-body='true'
      :modal='isModal'
      @close="closeDialog"
    >
    <!-- <div class="level-list-set-edit" v-if="pageType==='show' && editTag" @click="setEdit">
      <el-button

        class="list-box-botton"
      >
        编辑
      </el-button>
    </div> -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >


        <el-form-item label="岗位名称：" prop="postName">
           <el-input
                disabled
            v-model="ruleForm.postName"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属BU" prop="postName">
           <el-input
                disabled
            v-model="ruleForm.bu"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作性质" prop="postName">
           <el-input
                disabled
            v-model="ruleForm.timeType"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位描述：" >
            <el-input
                disabled
                type="textarea"
                v-model="ruleForm.postDesc">
                </el-input>
        </el-form-item>

        <el-form-item label="岗位配置：" prop="stationConfig">
          <span style="color:red">（用于老师匹配岗位，若不设置新入职老师定岗时将无法匹配到此岗位）</span>
        </el-form-item>
       <div class="list-box" >
          <template v-for="(item,index) in ruleForm.stationConfig">
            <div :key="'select'+index">
              <div :key="'select'+index">
                <el-select
                  v-if="index>0"
                  class="or-select"
                  v-model="item.judgeTypeOuter"
                  placeholder="请选择"
                  :key="'select'+index"
                  disabled>
                  <el-option label="且" value="AND" ></el-option>
                </el-select>
              </div>
              <div class="item" :key="'box'+index">
                <div class="left">
                  <div>
                    <el-select
                      class="or-select"

                      style="margin-top: -10px;"
                      v-model="item.judgeTypeInner"
                      :disabled="pageType==='show'"
                      placeholder="请选择"
                    >
                      <el-option label="且" value="AND"></el-option>
                      <el-option label="或" value="OR"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="right">
                  <div v-for="(child,idx) in item.ruleInfoDtoList" :key="'child'+idx" >
                        <div class="right-first"  v-if="child.ruleValueName">
                          <el-tooltip effect="dark" popper-class="el-tooltip__popper_title" :disabled="child.ruleValueName.length<50" :content="child.ruleNameTag+'-'+dictLabel[child.ruleType]+'-'+child.ruleValueName.substring(0,child.ruleValueName.length-1)" placement="top">
                            <p>{{child.ruleNameTag}}-{{dictLabel[child.ruleType]}}-{{child.ruleValueName.substring(0,child.ruleValueName.length-1)}}</p>
                          </el-tooltip>
                        </div>
                  </div>
              </div>
            </div>
            </div>
          </template>
        </div>
        <br>

        <div style="text-align:right;" v-if="pageType!=='show'">
          <el-button type="primary"  @click="dialogVisible=false" size="small">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

export default {

  data() {
    return {

      stationNameList:[],
      testAttr:'',
      stationName:'',
      type:'',
      rowId:'',
      dialogVisible: false,

      ruleForm: {
        postCode:'',
        postName:'',
        postVersion:'',
        postDesc:'',
        bu:'',
        stationConfig: [],
      },
      stationList:[],
      rules: {


        stationName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' },
          { min: 0, max: 20, message: "长度限制：0-20个字", trigger: "blur" }
        ],

        stationConfig:[
          {  type:'array',required: true, message: '请选择岗位配置', trigger: 'blur' },
        ]
      },
      dictLabel: {
        IN: "包含",
        NOT_IN: "不包含",
        EQUAL: "等于",
        NOT_EQUAL: "不等于",
        BETWEEN: "介于",
        UN_BETWEEN: "不介于"
      },


      pageType: "",
      opacityValue: '',
      allLayerRules: [],
      backup_allLayerRules_config: [],
      backup_allLayerRules_condition: [],
      allLayerRulesItem: [],
      backup_rulesItem_config: [],
      backup_rulesItem_condition: [],
      pageTypeStr:''
    };
  },
  props:{
    isModal:{
      type:Boolean,
      default:true
    }
  },
  computed:{

  },
  watch:{


  },
    mounted(){
    },
  methods: {
    filter_Bu(val){
      switch (val){
        case '1':
          return '1对1';
        case '2':
          return '少儿';
        case '3':
          return '陪练';
        case '5':
          return '优课'
      }
    },
    filter_timeType(val){
      switch (val){
        case 0:
          return '兼职';
        case 1:
          return '全职';
        case 2:
          return '校招全职';
        case 3:
          return '公校兼职';
        case 4:
          return '学科班主任'
      }
    },
    getLayerTagInfoByPost(row){
       this.$Fetch({
        url: `/api/teacherPost/postHistoryDetail?postCode=${row.postCode}&postVersion=${row.postVersion}`,
        method: "get"
      })
        .then(result => {

          this.ruleForm ={...result.data};
          this.ruleForm.bu=this.filter_Bu(this.ruleForm.bu);
          this.ruleForm.timeType=this.filter_timeType(this.ruleForm.timeType);
          this.ruleForm.stationConfig = result.data.postConfig.tagInfoDtoList;
          this.ruleForm.stationConfig.forEach(r=>{
            r.ruleInfoDtoList.forEach(j=>{
              let val = this.backup_rulesItem_config.filter(k=>k.tagName==j.ruleName);
              if(val&&val.length){
              j.ruleNameTag = val[0].tagDescription;
              let ruleValueName = '';
              j.ruleValue.forEach(h=>{
                ruleValueName += val[0].permitRuleValue.filter(g=>g.code==h)[0].name+'，';
              })
              j.ruleValueName = ruleValueName;
              j.permitRuleValueOption = val[0].permitRuleValue;
              }
            })
          })
        }).catch(message => {

          this.$Message.error(
            message
          );
        });
    },


    init(type,row) {
      this.rowId = row ? row.id : '';
      if (!['show', 'add', 'edit','copy'].includes(type)) return console.error('Function: init缺少参数type: show add edit');
      this.dialogVisible = true;
      this.pageType = type;

      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();

      })
      this.pageTypeStr=row.postName+'（'+row.postVersion+'）'
      this.getAllLayerTagList(row)
    },
    getAllLayerTagList(row) {

      this.$Fetch({
        url: '/api/teacherStationTag/getAllGWConfigLayerRules',
        method: "get"
      }).then(result => {
          if(result){
            //岗位配置
            this.backup_allLayerRules_config=result.data
            this.backup_allLayerRules_config.forEach(r=>{
              r.groupRule.forEach(j=>{
                this.backup_rulesItem_config.push(j)
              })
            })

          }
          this.getLayerTagInfoByPost(row)

        }).catch(message => {
            this.$Message.error(message);
          });

      },
    checkPermission(permissionName) {
                return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
    },

    //详情
    closeDialog() {
      this.dialogVisible = false;
      this.stationName=''
      this.ruleForm = {
        stationName:'',
        stationCount:null,
        date:[],
        remark:'',
        stationCondition : [],
        stationConfig : []
      };
    }

  }

};
</script>
<style lang="less">
.set-post-condition {
  .el-tooltip__popper {
    max-width: 600px;
  }
  .el-form-item__label {
  }
  .el-dialog__body {
    padding: 15px 20px 20px 20px;
  }
  .el-form-item__error {
    position: inherit;
  }
  .el-dialog {
    width: 1000px;
  }
  .el-input {
    width: 300px;
  }
  .level-list-set-edit {
    position: absolute;
    right: 60px;
    top: 15px;
    cursor: pointer;
    button {
      border: 1px solid #1D91FC;color: #1D91FC;
    }
  }
  .list-box {
    padding-left: 30px;
    .item {
      display: flex;
      border: solid #ededed 1px;
      padding: 10px 20px 0 20px;
      margin: 10px 30px 0 0;
      border-radius: 4px;
      position: relative;
      width: 98%;
      left: -10px;
      .left > div {
        display: flex;
        height: 100%;
        align-items: center;
      }
      .right {
        width: 90%;
        margin-left: 20px;
      }
      .right > div {
        display: flex;
        justify-content: space-between;
        .right-first {
          font-size: 12px;
          color: #4098FF;
          height: 30px;
          background:rgba(241,245,251,1);
          border-radius:15px;
          line-height: 30px;
          padding: 0 20px;
          width: 120%;
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
        }
        .right-second {
          line-height: 30px;
          padding-left: 10px;
          width: 15%;
        }
      }
      .list-box-botton {
        float: right;
        color: #1D91FC;
        border: 1px solid #1D91FC;
        font-weight: 400;
        margin-bottom: 10px;
        margin-right: 11.5%;
      }
      .el-icon-edit,.el-icon-delete,.el-icon-close {
        cursor: pointer;
        padding-left: 15px;
      }
      .delete {
        position: absolute;
        right: -30px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .or-select {
      width: 100px;
      margin-top: 10px;
      margin-left: -10px;
      .el-input {
        width: 100%;
      }
    }
  }
  .el-dialog__body {
    background-color: #fff !important;
  }
  .el-input__inner {
    border: 1px solid #ededed;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__label,.el-form-item__content {
    margin-bottom: 5px;
  }
}
.el-tooltip__popper_title {
  max-width: 600px;
  line-height: 20px;
}
</style>
