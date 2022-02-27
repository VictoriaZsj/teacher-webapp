<template>
  <div class="tea-post-tag">
    <el-dialog
      :title="`${pageTypeStr}老师标签`"
      v-model="dialogVisible"
      top="5vh"
      @close="closeDialog"
    >
      <div
        class="level-list-set-edit"
        v-if="pageType === 'show' && editTag"
        @click="setEdit"
      >
        <el-button class="list-box-botton"> 编辑 </el-button>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="标签名称：" prop="tagName">
          <el-input
            v-if="pageType !== 'show'"
            v-model="ruleForm.tagName"
            placeholder="请输入标签名称，20字内"
            :disabled="pageType !== 'add'"
          ></el-input>
          <div v-else>{{ ruleForm.tagName }}</div>
        </el-form-item>
        <el-form-item label="标签描述：" prop="description">
          <el-input
            v-if="pageType !== 'show'"
            v-model="ruleForm.description"
            placeholder="描述等级定义，方便后续查看，50字内"
          ></el-input>
          <div v-else>
            {{ ruleForm.description }}
          </div>
        </el-form-item>
        <el-form-item label="标签类型：">
          <el-input
            v-if="pageType != 'show'"
            v-model="tagTypeStr"
            disabled
          ></el-input>
          <span v-if="pageType == 'show'">培训通知进群二维码校验</span>
        </el-form-item>
        <el-form-item label="筛选条件：">
          <template v-if="pageType !== 'show'">
            <el-button
              type="primary"
              @click="addItemToConditions"
              :disabled="conditions.length >= 5"
              >添加条件组
            </el-button>
            <span style="color: #999; font-size: 12px"
              >&nbsp;&nbsp;最多添加5组</span
            >
          </template>
        </el-form-item>
        <div class="list-box" style="min-height: 100px">
          <template v-for="(item, index) in conditions">
            <div :key="'select' + index">
              <div :key="'select' + index">
                <el-select
                  v-if="index > 0"
                  class="or-select"
                  v-model="item.judgeTypeOuter"
                  placeholder="请选择"
                  :disabled="pageType === 'show'"
                  :key="'select' + index"
                >
                  <el-option label="且" value="AND"></el-option>
                  <el-option label="或" value="OR"></el-option>
                </el-select>
              </div>
              <div class="item" :key="'box' + index">
                <div class="left">
                  <div>
                    <el-select
                      class="or-select"
                      style="margin-top: -10px"
                      v-model="item.judgeTypeInner"
                      :disabled="pageType === 'show'"
                      placeholder="请选择"
                    >
                      <el-option label="且" value="AND"></el-option>
                      <el-option label="或" value="OR"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="right">
                  <div
                    v-for="(child, idx) in item.ruleInfoDtoList"
                    :key="'child' + idx"
                  >
                    <div class="right-first">
                      <el-tooltip
                        effect="dark"
                        popper-class="el-tooltip__popper_title"
                        :disabled="child.ruleValueName.length < 50"
                        :content="
                          child.ruleNameTag +
                          '-' +
                          dictLabel[child.ruleType] +
                          '-' +
                          child.ruleValueName.substring(
                            0,
                            child.ruleValueName.length - 1
                          )
                        "
                        placement="top"
                      >
                        <p>
                          {{ child.ruleNameTag }}-{{
                            dictLabel[child.ruleType]
                          }}-{{
                            child.ruleValueName.substring(
                              0,
                              child.ruleValueName.length - 1
                            )
                          }}
                        </p>
                      </el-tooltip>
                    </div>
                    <div class="right-second">
                      <p v-show="pageType !== 'show'">
                        <i
                          class="el-icon-edit"
                          @click="setruleInfoDtoListItem(index, idx, child)"
                        ></i>
                        <i
                          class="el-icon-delete"
                          @click="removeruleInfoDtoListItem(index, idx)"
                        ></i>
                      </p>
                    </div>
                  </div>
                  <el-button
                    @click="addItemToruleInfoDtoList(index)"
                    v-if="pageType !== 'show'"
                    class="list-box-botton"
                  >
                    <i class="el-icon-plus"></i>添加具体条件
                  </el-button>
                </div>
                <i
                  class="el-icon-close delete"
                  v-if="pageType !== 'show'"
                  @click="removeItemToConditions(index)"
                ></i>
              </div>
            </div>
          </template>
        </div>
        <br />
        <br />
        <div style="text-align: right" v-if="pageType !== 'show'">
          <el-button @click="closeDialog" size="small">取消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitForm"
            size="small"
            >确定</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <set-condition
      ref="setConditionComponent"
      :allLayerRules="allLayerRules"
      :allLayerRulesItem="allLayerRulesItem"
      @success="addItemToruleInfoDtoListBack"
    ></set-condition>
  </div>
</template>

<script>
import setCondition from './setCondition.vue';
// import fetch  from '../../../src/utils/fetch';

// import { VUE, commonVue, getPermission } from '@lib';

export default {
  components: {
    setCondition,
  },
  data() {
    return {
      tagTypeStr: '培训通知进群二维码校验',
      dialogVisible: false,
      loading: false,
      editTag: false,
      ruleForm: {},
      rules: {
        description: [
          { min: 0, max: 50, message: '长度限制：0-50个字', trigger: 'blur' },
        ],
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 0, max: 20, message: '长度限制：0-20个字', trigger: 'blur' },
        ],
      },
      dictLabel: {
        IN: '包含',
        NOT_IN: '不包含',
        EQUAL: '等于',
        NOT_EQUAL: '不等于',
      },
      conditions: [],
      pageType: '',
      opacityValue: '',
      allLayerRules: [],
      allLayerRulesItem: [],
    };
  },
  computed: {
    pageTypeStr(val) {
      if (this.pageType == 'show') {
        return '查看';
      } else if (this.pageType == 'add') {
        return '新增';
      } else if (this.pageType == 'edit') {
        return '编辑';
      }
    },
  },
  methods: {
    init(type, id) {
      if (!['show', 'add', 'edit'].includes(type))
        return console.error('Function: init缺少参数type: show add edit');
      this.dialogVisible = true;
      this.pageType = type;
      this.getAllLayerTagList(id);
      // this.$refs['ruleForm'].resetFields();
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    getAllLayerTagList(id) {
      this.$Fetch({
        url: '/api/teacherTrainNotice/selectAllLayerRules',
        method: 'get',
      })
        .then((result) => {
          this.allLayerRules = [result.data];
          result.data.groupRule.forEach((j) => {
            this.allLayerRulesItem.push(j);
          });

          if (id || this.pageType === 'edit' || this.pageType === 'show')
            this.getLayerTagInfoById(id);
        })
        .catch((message) => {
          this.$Message.error(message);
        });
    },

    getLayerTagInfoById(id) {
      this.$Fetch({
        url: '/api/teacherTrainNotice/selectTagById?id=' + id,
        method: 'get',
      })
        .then((result) => {
          this.ruleForm = result.data;
          this.conditions = result.data.tagInfoDtoList;
          this.conditions.forEach((r) => {
            r.ruleInfoDtoList.forEach((j) => {
              let val = this.allLayerRulesItem.filter(
                (k) => k.tagName == j.ruleName
              );
              j.ruleNameTag = val[0].tagDescription;
              let ruleValueName = '';
              j.ruleValue.forEach((h) => {
                ruleValueName +=
                  val[0].permitRuleValue.filter((g) => g.code == h)[0].name +
                  '，';
              });
              j.ruleValueName = ruleValueName;
              j.permitRuleValueOption = val[0].permitRuleValue;
            });
          });
        })
        .catch((message) => {
          this.$Message.error(message);
        });
    },

    //添加组
    addItemToConditions() {
      const _length = this.conditions.length;
      let judgeTypeOuter = '';
      if (_length === 0) judgeTypeOuter = 'EMPTY';
      this.conditions.push({
        judgeTypeOuter,
        judgeTypeInner: '',
        ruleInfoDtoList: [],
      });
    },

    //添加组内条件
    addItemToruleInfoDtoList(index) {
      this.$refs.setConditionComponent.init(index);
    },

    addItemToruleInfoDtoListBack(index, childIndex, obj) {
      if (childIndex === '') {
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
      this.conditions.length && (this.conditions[0].judgeTypeOuter = 'EMPTY'); //第一个条件组的judgeTypeOuter始终为EMPTY
    },

    //移除组内条件
    removeruleInfoDtoListItem(index, idx) {
      this.conditions[index].ruleInfoDtoList.splice(idx, 1);
    },

    //设置组内条件
    setruleInfoDtoListItem(index, idx, child) {
      let val = JSON.parse(JSON.stringify(child));
      this.$refs.setConditionComponent.init(index, idx, val);
    },

    submitForm() {
      this.ruleForm.tagType = '3';
      this.$refs.ruleForm.validate((valid) => {
        if (valid) this.submitFormFun();
      });
    },

    submitFormFun() {
      if (this.conditions && this.conditions.length === 0)
        return this.$Message.warning('筛选条件不能为空');
      for (const item of this.conditions) {
        if (
          !item.judgeTypeOuter ||
          !item.judgeTypeInner ||
          item.ruleInfoDtoList.length <= 0
        ) {
          this.$Message.warning('逻辑关系必填且条件组中至少有一个具体条件');
          return false;
        }
        item.ruleInfoDtoList.forEach((r) => {
          delete r.ruleNameTag;
          delete r.ruleValueName;
          delete r.permitRuleValueOption;
        });
      }
      delete this.ruleForm.createdAt;
      delete this.ruleForm.updatedAt;
      this.loading = true;
      this.$Fetch({
        url: '/api/teacherTrainNotice/createOrUpdateTag',
        method: 'post',
        data: Object.assign(this.ruleForm, { tagInfoDtoList: this.conditions }),
      })
        .then((result) => {
          if (result.code === '0') {
            this.loading = false;
            this.$Message.success(result.message || '操作成功');
            this.$emit(
              'success',
              result,
              Object.assign(this.ruleForm, { tagInfoDtoList: this.conditions })
            );
            this.closeDialog();
          }
        })
        .catch((message) => {
          this.loading = false;
          this.$emit(
            'success',
            message,
            Object.assign(this.ruleForm, { tagInfoDtoList: this.conditions })
          );
          this.$Message.error(message);
        });
    },

    setEdit() {
      this.pageType = 'edit';
    },

    closeDialog() {
      this.dialogVisible = false;
      this.conditions = [];
      this.ruleForm = {};
    },
  },
};
</script>
<style lang="less">
.tea-post-tag {
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
      border: 1px solid #1d91fc;
      color: #1d91fc;
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
          color: #4098ff;
          height: 30px;
          background: rgba(241, 245, 251, 1);
          border-radius: 15px;
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
        color: #1d91fc;
        border: 1px solid #1d91fc;
        font-weight: 400;
        margin-bottom: 10px;
        margin-right: 11.5%;
      }
      .el-icon-edit,
      .el-icon-delete,
      .el-icon-close {
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
  .el-form-item__label,
  .el-form-item__content {
    margin-bottom: 10px;
  }
  .el-tooltip__popper_title {
    max-width: 600px;
    line-height: 20px;
  }
}
</style>
