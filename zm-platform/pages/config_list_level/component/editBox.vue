<template>
  <div class="level-list-set-condition">
    <el-dialog
      :title="`${pageType==='edit'?'编辑':'查看'}名单等级条件`"
      v-model="dialogVisible"
      @close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名单等级名称">
          <el-input v-model="ruleForm.tagName" disabled></el-input>
        </el-form-item>
        <el-form-item label="名单等级描述" prop="description">
          <el-input
            v-model="ruleForm.description"
            :disabled="pageType==='show'"
            placeholder="描述等级定义，方便后续查看"
          ></el-input>
        </el-form-item>
        <el-form-item label="筛选条件">
          <!-- 没用，占位 -->
        </el-form-item>
        <div class="list-box">
          <template v-if="pageType==='edit'">
            <el-button
              type="primary"
              size="small"
              @click="addItemToConditions"
              :disabled="conditions.length>=5"
            >
              <i class="el-icon-plus"></i> 添加条件组
            </el-button>
            <span>&nbsp;&nbsp;最多添加5组</span>
          </template>

          <div style="max-height:400px;overflow:auto;">
            <template v-for="(item,index) in conditions">
              <el-select
                v-if="index>0"
                class="or-select"
                v-model="item.judgeTypeOuter"
                placeholder="请选择"
                :key="'select'+index"
                :disabled="pageType==='show'"
              >
                <el-option label="且" value="AND"></el-option>
                <el-option label="或" value="OR"></el-option>
              </el-select>
              <div class="item" :key="'box'+index">
                <div class="left">
                  <div>
                    <el-button
                      size="small"
                      @click="addItemToruleInfoDtoList(index)"
                      v-if="pageType==='edit'"
                    >
                      <i class="el-icon-plus"></i> 添加条件
                    </el-button>
                    <el-select
                      class="or-select"
                      v-model="item.judgeTypeInner"
                      placeholder="请选择"
                      :disabled="pageType==='show'"
                    >
                      <el-option label="且" value="AND"></el-option>
                      <el-option label="或" value="OR"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="right">
                  <div v-for="(child,idx) in item.ruleInfoDtoList" :key="'child'+idx">
                    <p>{{child.ruleName|ruleNameFilter}}</p>
                    <p>{{child.ruleType|ruleTypeFilter}}</p>
                    <p>
                      <el-tooltip
                        effect="dark"
                        :content="child.ruleValue|ruleValueFilter(child.ruleName)"
                        placement="top"
                      >
                        <span>{{child.ruleValue|ruleValueFilter(child.ruleName)}}</span>
                      </el-tooltip>
                    </p>
                    <p v-show="pageType==='edit'">
                      <i class="el-icon-edit" @click="setruleInfoDtoListItem(index,idx,child)"></i>
                      <i class="el-icon-delete" @click="removeruleInfoDtoListItem(index,idx)"></i>
                    </p>
                  </div>
                </div>
                <i
                  class="el-icon-close delete"
                  v-if="pageType==='edit'"
                  @click="removeItemToConditions(index)"
                ></i>
              </div>
            </template>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div style="text-align:right;" v-if="pageType==='edit'">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <set-condition
      ref="setConditionComponent"
      :optionDict="optionDict"
      @success="addItemToruleInfoDtoListBack"
    ></set-condition>
  </div>
</template>



<script>
import setCondition from "./setCondition.vue";
export default {
  components: {
    setCondition
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {},
      rules: {
        description: [
          { min: 0, max: 50, message: "长度限制：0-50个字", trigger: "blur" }
        ]
      },
      conditions: [],
      optionDict: {},
      pageType: "edit"
    };
  },
  methods: {
    init(id, type) {
      this.dialogVisible = true;
      this.pageType = type;
      this.getAllLayerTagList(id);
    },
    getAllLayerTagList(id) {
      this.$Fetch({
        url: "/api/1.0.0/teacherTag/getAllLayerRules",
        method: "get"
      })
        .then(result => {
          this.optionDict = Object.assign({}, result);
          window.sessionStorage.setItem(
            "ALLLAYERRULES",
            JSON.stringify(result)
          );
          this.getLayerTagInfoById(id);
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? "接口出错" : message
          );
        });
    },
    getLayerTagInfoById(id) {
      this.$Fetch({
        url: "/api/1.0.0/teacherTag/getLayerTagInfoById?id=" + id,
        method: "get"
      })
        .then(result => {
          this.ruleForm = result.data;
          this.conditions = result.data.tagInfoDtoList;
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? "接口出错" : message
          );
        });
    },
    //添加组
    addItemToConditions() {
      const _length = this.conditions.length;
      let judgeTypeOuter = "";
      if (_length === 0) judgeTypeOuter = "EMPTY";
      this.conditions.push({
        judgeTypeOuter,
        judgeTypeInner: "",
        ruleInfoDtoList: []
      });
    },
    //添加组内条件
    addItemToruleInfoDtoList(index) {
      this.$refs.setConditionComponent.init(index);
    },
    addItemToruleInfoDtoListBack(index, childIndex, obj) {
      if (childIndex === "") {
        //新增
        this.conditions[index].ruleInfoDtoList.push(obj);
      } else {
        //编辑
        this.$set(this.conditions[index].ruleInfoDtoList, childIndex, obj);
      }
    },
    //移除组
    removeItemToConditions(index) {
      this.conditions.splice(index, 1);
      this.conditions.length && (this.conditions[0].judgeTypeOuter = "EMPTY"); //第一个条件组的judgeTypeOuter始终为EMPTY
    },
    //移除组内条件
    removeruleInfoDtoListItem(index, idx) {
      this.conditions[index].ruleInfoDtoList.splice(idx, 1);
    },
    //设置组内条件
    setruleInfoDtoListItem(index, idx, child) {
      this.$refs.setConditionComponent.init(index, idx, child);
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) this.submitFormFun();
      });
    },
    submitFormFun() {
      for (const item of this.conditions) {
        if (
          !item.judgeTypeOuter ||
          !item.judgeTypeInner ||
          item.ruleInfoDtoList.length <= 0
        ) {
          return this.$Message.warning(
            "逻辑关系必填且条件组中至少有一个具体条件"
          );
        }
      }
      this.$Fetch({
        url: "/api/1.0.0/teacherTag/updateLayerTagInfo",
        method: "post",
        data: {
          ...this.ruleForm,
          tagInfoDtoList: this.conditions
        }
      })
        .then(result => {
          if (result.code === "0") {
            this.$Message(result.message || "操作成功");
            this.$emit("success");
            this.closeDialog();
          } else {
            this.$Message(result.message || "操作失败");
          }
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? "接口出错" : message
          );
        });
    },
    closeDialog() {
      this.dialogVisible = false;
      this.conditions = [];
      this.ruleForm = {};
    }
  },
  filters: {
    ruleTypeFilter(val) {
      const _ = {
        IN: "包含",
        NOT_IN: "不包含",
        EQUAL: "等于",
        NOT_EQUAL: "不等于"
      };
      return _[val];
    },
    ruleValueFilter(val, ruleName) {
      const _ = JSON.parse(window.sessionStorage.getItem("ALLLAYERRULES"));
      if (ruleName === "certificateState") {
        if (val.length) {
          const arr = [];
          val.forEach(item => {
            arr.push(
              _[ruleName].permitRuleValue.find(it => it.code == item).name
            );
          });
          return arr.join("、");
        }
        return "";
      } else if (ruleName === "normalSchool") {
        if (val.length) {
          const arr = [];
          val.forEach(item => {
            arr.push(
              _[ruleName].permitRuleValue.find(it => it.code == item).name
            );
          });
          return arr.join("、");
        }
      }
      return val.join("、");
    },
    ruleNameFilter(val) {
      const _ = JSON.parse(window.sessionStorage.getItem("ALLLAYERRULES"));
      return _[val].tagDescription || "--";
    }
  }
};
</script>
<style lang="less">
.level-list-set-condition {
  .el-dialog {
      width: 816px;
  }
  .el-input {
    width: 200px;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .list-box {
    padding-left: 40px;
    .item {
      display: flex;
      border: dashed #007fff 1px;
      padding: 10px 20px;
      margin: 20px 20px 20px 0;
      border-radius: 4px;
      position: relative;
      .left > div {
        display: flex;
        height: 100%;
        align-items: center;
      }
      .right > div {
        display: flex;
        p {
          width: 180px;
          line-height: 30px;
          border: 1px solid #d9d9d9;
          margin: 2px 6px;
          padding: 0 8px;
          flex-shrink: 0;
          border-radius: 2px;
          span{
            display: block;
            width:100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        p:nth-of-type(2) {
          width: 60px;
        }
        p:last-of-type {
          border: none;
          width: 44px;
          margin: 2px 0;
          padding: 0;
        }
      }
      .el-icon-edit,.el-icon-delete,.el-icon-close {
        cursor: pointer;
        color: #20a0ff;
      }
      .delete {
        position: absolute;
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .or-select {
      width: 80px;
      margin: 0 8px;
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
}
</style>
