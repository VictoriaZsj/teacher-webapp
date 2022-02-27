<template>
  <el-dialog title="选择具体条件" v-model="dialogVisible" @close="resetForm" class="set-condtion-box">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="老师基础信息" prop="ruleName">
        <el-select v-model="ruleForm.ruleName" placeholder="请选择" @change="ruleNameChange">
          <el-option v-for="(item,key) in optionDict||{}" :key="key" :label="item.tagDescription" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="判定关系" prop="ruleType">
        <el-select v-model="ruleForm.ruleType" placeholder="请选择">
          <el-option
            v-for="item in (optionDict[ruleForm.ruleName]&&optionDict[ruleForm.ruleName].permitRuleType)||[]"
            :key="item"
            :label="dictLabel[item]"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- permitRuleType如果是['IN','NOT_IN']则多选，[EQUAL,NOT_EQUAL]则单选 -->
      <div
        v-if="['EQUAL','NOT_EQUAL'].includes(optionDict[ruleForm.ruleName]&&optionDict[ruleForm.ruleName].permitRuleType[0])"
        key="ruleValue"
      >
        <el-form-item label="对应选项值" prop="ruleValue">
          <el-select v-model="ruleForm.ruleValue" placeholder="请选择">
            <el-option
              v-for="(item,index) in (optionDict[ruleForm.ruleName]&&optionDict[ruleForm.ruleName].permitRuleValue)||[]"
              :key="index"
              :label="item.name"
              :value="''+item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div key="ruleValueList" v-else>
        <el-form-item label="对应选项值" prop="ruleValueList">
          <el-select v-model="ruleForm.ruleValueList" placeholder="请选择" multiple>
            <el-option
              v-for="(item,index) in (optionDict[ruleForm.ruleName]&&optionDict[ruleForm.ruleName].permitRuleValue)||[]"
              :key="index"
              :label="item.name"
              :value="''+item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <br />
      <br />
      <br />
      <el-form-item>
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

  

<script>
export default {
  props:['optionDict'],
  data() {
    return {
      dialogVisible: false,
      index: "",
      childIndex: "",
      dictLabel: {
        IN: "包含",
        NOT_IN: "不包含",
        EQUAL: "等于",
        NOT_EQUAL: "不等于"
      },
      ruleForm: {
        ruleName: "",
        ruleType: "",
        ruleValue: "",
        ruleValueList: []
      },
      rules: {
        ruleName: [
          { required: true, message: "请选择老师基础信息", trigger: "blur" }
        ],
        ruleType: [
          { required: true, message: "请选择判定关系", trigger: "blur" }
        ],
        ruleValue: [
          { required: true, message: "请选择对应选项值", trigger: "blur" }
        ],
        ruleValueList: [
          {
            type: "array",
            required: true,
            message: "请选择至少一个对应选项值",
            trigger: "blur"
          }
        ]
      }
    };
  }, 
  methods: {
    init(index, idx = "", child = null) { //新增（idx='',child=null） or 编辑
      this.index = index;
      this.childIndex = idx; 
      if (child) {//编辑
        this.ruleForm.ruleName = child.ruleName; 
        const timer = setTimeout(()=>{
          this.ruleForm.ruleType = child.ruleType;
          this.ruleForm.ruleValue = ['EQUAL','NOT_EQUAL'].includes(child.ruleType)?child.ruleValue[0]:"";//单选
          this.ruleForm.ruleValueList = ['IN','NOT_IN'].includes(child.ruleType)?child.ruleValue:[];//多选
          clearTimeout(timer||null);
        },1);
      } 
      this.dialogVisible = true;
      
    },
    ruleNameChange(){ 
      this.ruleForm.ruleType = "";
      this.ruleForm.ruleValue = "";
      this.ruleForm.ruleValueList = [];
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit("success", this.index, this.childIndex, {
            ruleName: this.ruleForm.ruleName,
            ruleType: this.ruleForm.ruleType,
            ruleValue: this.ruleForm.ruleValue
              ? [this.ruleForm.ruleValue]
              : this.ruleForm.ruleValueList
          });
          this.resetForm();
        }
      });
    },
    resetForm() { 
      this.ruleForm = {
        ruleName: "",
        ruleType: "",
        ruleValue: "",
        ruleValueList: []
      };
      this.$refs.ruleForm.resetFields();
      this.index = "";
      this.childIndex = "";
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="less">
.set-condtion-box{
  .el-dialog {
  width: 800px;
  }
  .el-input {
    width: 200px;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .el-dialog__body {
    background-color: #fff !important;
  }
}

</style>