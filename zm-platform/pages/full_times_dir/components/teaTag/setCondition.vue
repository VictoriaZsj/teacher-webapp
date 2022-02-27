<template>
  <el-dialog title="选择具体条件" top="5vh" :destroy-on-close="true" v-model="dialogVisible" @close="resetForm" class="set-condtion-box">
    <div class="content">
      <div class="left">
        <el-menu
        background-color='#ffffff'
          :default-active="defaultActive"
          class="el-menu-vertical-demo">
          <el-submenu v-for="(item,i) in allLayerRules" :key="item.groupName" :index="i+''">
            <template slot="title">
              <span>{{item.groupName}}</span>
            </template>
            <el-menu-item v-for="ele in item.groupRule" :key="ele.tagName" :index="ele.tagName">
              <div @click="getPermitRuleValue(ele)">
                {{ele.tagDescription}}
              </div>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="right">
        <div>
          <el-select
            class="or-select"

            v-model="judgeTypeInner"
            placeholder="请选择"
          >
            <template v-if="multiple">
              <el-option label="包含" value="IN"></el-option>
              <el-option label="不包含" value="NOT_IN"></el-option>
            </template>
            <template v-else>
              <el-option label="等于" value="EQUAL"></el-option>
              <el-option label="不等于" value="NOT_EQUAL"></el-option>
            </template>
          </el-select>
          <div class="warning-span" v-if="judgeTypeInnerStatus && !judgeTypeInner">请选择逻辑关系</div>
        </div>
        <div class="menu">
           <div :class="codeArr.includes(item.code)?'checked':''" v-for="item in rightOption" @click="getCode(item)" :key="item.code">
            <el-tooltip effect="dark" popper-class="el-tooltip__popper_title" :disabled="item.name.length<45" :content="item.name" placement="top">
              <p>{{item.name}}</p>
            </el-tooltip>
           </div>
        </div>
        <div class="warning-span" v-if="codeArrStatus && codeArr.length==0">请选择具体条件</div>
      </div>
    </div>
    <div style="text-align:right;margin-top: 20px;">
      <el-button @click="resetForm(false)" size="small">取消</el-button>
      <el-button type="primary" @click="resetForm(true)" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import fetch from '../../assets/js/fetch';

export default {
  props:['allLayerRules','allLayerRulesItem'],
  data() {
    return {
      index: '',
      childIndex: '',
      dialogVisible: false,
      defaultActive: '',
      leftOption: [],
      rightOption: [],
      judgeTypeInner: '',
      judgeTypeInnerStatus: false,
      codeArr: [],
      codeArrStatus: false,
      multiple: false,
      newObject: {},
      resObject: {},
    };
  },
  methods: {
    async init(index, idx = "", child = null) { //新增（idx='',child=null） or 编辑
      this.index = index;
      this.childIndex = idx;
      this.dialogVisible = true;
      if (child) {//编辑
        this.multiple = ['EQUAL','NOT_EQUAL'].includes(child.ruleType)?false:true;
        this.rightOption = child.permitRuleValueOption || [];
        this.defaultActive = child.ruleName;
        this.codeArr = child.ruleValue;
        this.judgeTypeInner = child.ruleType;
      } else {
        this.multiple = this.allLayerRules[0].groupRule[0].permitRuleType.includes('EQUAL')?false:true;
        this.rightOption = this.allLayerRules[0].groupRule[0].permitRuleValue || [];
        this.defaultActive = this.allLayerRules[0].groupRule[0].tagName;
      }
    },

    getPermitRuleValue(val) {
      this.newObject = val;
      this.codeArr = [];
      this.judgeTypeInner = '';
      // permitRuleType如果是['IN','NOT_IN']则多选，[EQUAL,NOT_EQUAL]则单选
      this.multiple = val.permitRuleType.includes('EQUAL') ? false : true;
      this.rightOption = val.permitRuleValue;
    },

    getCode(item) {
      if(this.codeArr.includes(item.code)) {
       this.codeArr = this.codeArr.filter(r=>r!==item.code);
      } else {
        if(this.multiple) {
          this.codeArr.push(item.code)
        } else {
          this.codeArr = [item.code];
        }
      }
    },

    resetForm(val) {
      if(val) {
        if(!this.judgeTypeInner) {
          return this.judgeTypeInnerStatus = true;
        } else {
          this.judgeTypeInnerStatus = false;
        }
        if(this.codeArr.length==0) {
          return this.codeArrStatus = true;
        } else {
          this.codeArrStatus = false;
        }
        try {
          let ruleValueName = '';
          this.codeArr.forEach(r=>{
            let val = this.rightOption.filter(j=>j.code===r);
            ruleValueName += val[0].name+',';
          })
          let ruleNameTag = '';
          this.allLayerRulesItem.forEach(r=> {
            if(r.tagName===(this.newObject.tagName || this.defaultActive)) ruleNameTag = r.tagDescription
          })
          this.$emit("success", this.index, this.childIndex, {
            ruleName: this.newObject.tagName || this.defaultActive,
            ruleType: this.judgeTypeInner,
            ruleValue: this.codeArr,
            permitRuleValueOption: this.rightOption,
            ruleNameTag,
            ruleValueName,
          });
        } catch (err) {
          console.log(err);
        }
        this.dialogVisible = false;
      }
      this.defaultActive = "";
      this.codeArr = [];
      this.judgeTypeInner = '';
      this.newObject = {};
      this.judgeTypeInnerStatus = false;
      this.codeArrStatus = false;
      this.dialogVisible = false;
    },
  }
};
</script>
<style lang="less">
.set-condtion-box{
  .el-dialog__body {
    padding: 15px 20px 20px 20px;
  }
  .el-dialog {
    width: 1000px;
  }
  .el-menu{
    background-color: #ffffff;
    .is-active{
      background-color: #eeeeee;
    }
  }
  .el-menu-vertical-demo::-webkit-scrollbar{
    display:none;
  }
  .el-menu-vertical-demo {
    background-color: #ffffff;
    width: 250px;
    border-radius: 5px;
    min-height: 70vh;
    max-height: 70vh;
    border-bottom: 1px solid rgba(220,222,227,1);
    overflow-y: auto;
    > .el-submenu__title {
      border-radius: 5px 5px 0 0;
    }
    .el-submenu__title {
      height: 40px;
      line-height: 40px;
      background: rgba(247,248,250,1);
      border-bottom: 1px solid rgba(220,222,227,1);
    }
    .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
    .el-menu:last-child {
      border-bottom: 1px solid rgba(220,222,227,1);
    }
  }
  .content {
    display: flex;
  }
  .left {
    border-radius:5px;
    border-top: 1px solid rgba(220,222,227,1);
    border-left: 1px solid rgba(220,222,227,1);
  }
  .right {
    border-radius:5px;
    border:1px solid rgba(220,222,227,1);
    margin-left: 15px;
    width: 100%;
    min-height: 70vh;
    max-height: 70vh;
    overflow: auto;
    > div{
      margin: 15px;
    }
    .menu {
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      > div {
        height: 30px;
        line-height: 28px;
        min-width: 80px;
        text-align: center;
        cursor: pointer;
        padding: 0 15px;
        margin: 0 10px 10px 0;
        border-radius:15px;
        border:1px solid rgba(0,0,0,0.1);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
      }
      .checked {
        background: #f1f5fb;
        border:1px solid #f1f5fb;
        color:#4098FF;
      }
    }
    .or-select {
      width: 120px;
      .el-input {
        width: 100%;
      }
    }
  }
  .warning-span {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 2px;
    padding-left: 3px;
    position: absolute;
  }
}
</style>
