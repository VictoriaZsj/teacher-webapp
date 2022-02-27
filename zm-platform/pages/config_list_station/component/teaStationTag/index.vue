<template>
  <el-dialog
    :title="`${pageTypeStr}`"
    v-model="dialogVisible"
    top="5vh"
    :append-to-body="true"
    :modal="isModal"
    @close="closeDialog"
    class="tea-station-tag"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="复制岗位：" v-if="pageType == 'copy'">
        <el-select v-model="stationName" filterable placeholder="请选择">
          <el-option
            :label="item.stationName"
            :value="item.stationName"
            v-for="(item, key) in stationList"
            :key="key"
            @click.native="handleChangeCopyStation(item)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位名称：" prop="stationName">
        <el-select
          v-if="pageType !== 'show'"
          v-model="ruleForm.stationName"
          filterable
          placeholder="请选择"
          @change="handleStationNameChange"
        >
          <el-option
            v-for="item in stationNameList"
            :key="item.value"
            :label="item.postName"
            :value="item.postName"
          >
          </el-option>
        </el-select>

        <div v-else>{{ ruleForm.stationName }}</div>
      </el-form-item>
      <el-form-item label="岗位配额：" prop="stationCount">
        <el-input
          v-if="pageType !== 'show'"
          v-model.number="ruleForm.stationCount"
          placeholder="请输入＞0的数字"
        ></el-input>
        <div v-else>
          {{ ruleForm.stationCount }}
        </div>
      </el-form-item>
      <!-- <el-form-item label="统计时间：" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="datetimerange"
            placeholder="请选择统计时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
         </el-form-item> -->
      <el-form-item label="岗位配置：" prop="stationConfig"> </el-form-item>
      <div class="list-box">
        <template v-for="(item, index) in stationConfigDetail">
          <div :key="'select' + index">
            <div :key="'select' + index">
              <el-select
                v-if="index > 0"
                class="or-select"
                v-model="item.judgeTypeOuter"
                placeholder="请选择"
                :key="'select' + index"
                disabled
              >
                <el-option label="且" value="AND"></el-option>
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
                  <div class="right-first" v-if="child.ruleValueName">
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
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <br />
      <br />
      <el-form-item label="岗位要求：" prop="_stationCondition_">
        <template v-if="pageType !== 'show'">
          <el-button
            type="primary"
            @click="addItemToConditions"
            :disabled="
              ruleForm._stationCondition_ &&
                ruleForm._stationCondition_.length >= 5
            "
            >添加条件组
          </el-button>
          <span style="color: #999; font-size: 12px"
            >&nbsp;&nbsp;最多添加5组</span
          >
        </template>
      </el-form-item>

      <div class="list-box">
        <template v-for="(item, index) in ruleForm._stationCondition_">
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
                  <div class="right-first" v-if="child.ruleValueName">
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
                  <div class="right-second" v-if="child.ruleValueName">
                    <p v-show="pageType !== 'show'">
                      <i
                        class="el-icon-edit"
                        @click="
                          setruleInfoDtoListItem(
                            index,
                            idx,
                            child,
                            'stationCondition'
                          )
                        "
                      ></i>
                      <i
                        class="el-icon-delete"
                        @click="
                          removeruleInfoDtoListItem(
                            index,
                            idx,
                            'stationCondition'
                          )
                        "
                      ></i>
                    </p>
                  </div>
                </div>
                <el-button
                  @click="addItemToruleInfoDtoList(index, 'stationCondition')"
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
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          :maxlength="500"
          :max="500"
          :autosize="{ minRows: 4 }"
          placeholder="备注此岗位的一些基本信息，需求方要求等信息"
          v-model="ruleForm.remark"
        >
        </el-input>
      </el-form-item>
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
    <set-condition
      ref="setConditionComponent"
      :allLayerRules="allLayerRules"
      :allLayerRulesItem="allLayerRulesItem"
      :type="type"
      :testAttr="testAttr"
      @success="addItemToruleInfoDtoListBack"
    ></set-condition>
  </el-dialog>
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
      timeout: null,
      stationNameList: [],
      testAttr: '',
      stationName: '',
      type: '',
      rowId: '',
      dialogVisible: false,
      loading: false,
      editTag: false,
      ruleForm: {
        stationName: '',
        stationCount: null,
        // date:[],
        remark: '',
        _stationCondition_: [],
      },
      stationConfigDetail: [],
      stationList: [],
      rules: {
        stationCount: [
          {
            type: 'number',
            required: true,
            message: '请输入岗位配额,必须为数字值',
            trigger: 'blur',
          },
          // { type: 'number', message: '必须为数字值',trigger: 'blur'},
        ],

        stationName: [
          { required: true, message: '请输入岗位名称' },
          { min: 0, max: 50, message: '长度限制：0-20个字', trigger: 'blur' },
        ],
        // date:[
        //    {type:'array', required: true, message: '请填写统计时间', trigger: 'blur' },
        // ],
        _stationCondition_: [
          {
            type: 'array',
            required: true,
            message: '请选择岗位要求',
            trigger: 'blur',
          },
        ],
        _stationConfig_: [
          {
            type: 'array',
            required: true,
            message: '请选择岗位配置',
            trigger: 'blur',
          },
        ],
      },
      dictLabel: {
        IN: '包含',
        NOT_IN: '不包含',
        EQUAL: '等于',
        NOT_EQUAL: '不等于',
        BETWEEN: '介于',
        UN_BETWEEN: '不介于',
      },

      pageType: '',
      opacityValue: '',
      allLayerRules: [],
      backup_allLayerRules_config: [],
      backup_allLayerRules_condition: [],
      allLayerRulesItem: [],
      backup_rulesItem_config: [],
      backup_rulesItem_condition: [],
      saveItem: '',
      isLog: false,
    };
  },
  props: {
    isModal: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    pageTypeStr(val) {
      if (
        this.pageType == 'show' ||
        this.pageType == 'add' ||
        this.pageType == 'edit'
      ) {
        return '推荐岗位配置（自动把符合条件的老师配置到对应岗位中）';
      } else if (this.pageType == 'copy') {
        return '复制岗位';
      }
    },
  },
  watch: {
    pageType(val) {
      if (val == 'copy') {
        this.getData();
      }
    },
  },
  mounted() {
    this.getStationNameList();
  },
  methods: {
    handleStationNameChange(val) {
      let item = this.stationNameList.filter(i => {
        return val == i.postName;
      });
      if (Array.isArray(item) && item.length) {
        this.ruleForm.postCode = item[0].postCode;
        this.getStationConfigByPost(item[0]);
      }
    },
    handleChangeCopyStation(row) {
      this.getLayerTagInfoById(row);
    },
    getStationConfigByPost(row) {
      this.$Fetch({
        url: `/api/teacherPost/detail?postCode=${row.postCode}&postVersion=${row.postVersion}`,
        method: 'get',
      })
        .then(result => {
          this.stationConfigDetail = result.data.postConfig.tagInfoDtoList;
          this.stationConfigDetail.forEach(r => {
            r.ruleInfoDtoList.forEach(j => {
              let val = this.backup_rulesItem_config.filter(
                k => k.tagName == j.ruleName
              );
              if (val && val.length) {
                j.ruleNameTag = val[0].tagDescription;
                let ruleValueName = '';
                j.ruleValue.forEach(h => {
                  ruleValueName +=
                    val[0].permitRuleValue.filter(g => g.code == h)[0]?.name +
                    '，';
                });
                j.ruleValueName = ruleValueName;
                j.permitRuleValueOption = val[0].permitRuleValue;
              }
            });
          });
        })
        .catch(message => {
          this.$Message.error(message);
        });
    },
    getStationNameList() {
      this.$Fetch({
        url: '/api/teacherPost/postList',
        method: 'get',
        params: {
          postKey: '',
          status: 1,
        },
      })
        .then(result => {
          this.stationNameList = result.data;
          this.stationNameList.forEach(i => {
            i.value = i.postName;
          });
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? '接口出错' : message
          );
        });
    },

    getData() {
      this.$Fetch({
        url: '/api/teacherStation/stationList',
        method: 'get',
      })
        .then(result => {
          this.stationList = result.data;
          this.stationList.forEach(i => {
            i.value = i.stationName;
          });
        })
        .catch(message => {
          this.$Message.error(
            message && message.length > 100 ? '接口出错' : message
          );
        });
    },
    init(type, row, isLog) {
      this.rowId = row ? row.id : '';
      if (!['show', 'add', 'edit', 'copy'].includes(type))
        return console.error('Function: init缺少参数type: show add edit');
      this.dialogVisible = true;
      this.pageType = type;
      this.isLog = isLog;
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();
      });
      this.getAllLayerTagList(row);
    },
    getAllLayerTagList(row) {
      Promise.all([
        this.$Fetch({
          url: '/api/teacherStationTag/getAllGWConditionLayerRules',
          method: 'get',
        }),
        this.$Fetch({
          url: '/api/teacherStationTag/getAllGWConfigLayerRules',
          method: 'get',
        }),
      ])
        .then(result => {
          if (result && result.length) {
            //岗位配置
            this.backup_allLayerRules_config = result[1].data;
            this.backup_allLayerRules_config.forEach(r => {
              r.groupRule.forEach(j => {
                this.backup_rulesItem_config.push(j);
              });
            });
            //岗位要求
            this.backup_allLayerRules_condition = result[0].data;
            this.backup_allLayerRules_condition.forEach(r => {
              r.groupRule.forEach(j => {
                this.backup_rulesItem_condition.push(j);
              });
            });
          }
          if (row || this.pageType === 'edit' || this.pageType === 'show') {
            this.getLayerTagInfoById(row);
          }
        })
        .catch(message => {
          this.$Message.error(message);
        });
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },

    //详情
    getLayerTagInfoById(row) {
      let detailType = '';
      if (this.pageType == 'show' && this.isLog) {
        detailType = 'log/';
      } else {
        detailType = '';
      }
      this.$Fetch({
        url: `/api/teacherStation/${detailType}detail?stationNumber=${
          row.stationNumber
        }&version=${row.version || row.stationVersion}`,
        method: 'get',
      })
        .then(result => {
          this.ruleForm = { ...result.data };
          this.ruleForm._stationCondition_ =
            result.data.stationCondition.tagInfoDtoList;
          this.stationConfigDetail = result.data.stationConfig.tagInfoDtoList;
          try {
            // 岗位要求
            this.ruleForm._stationCondition_.forEach(r => {
              r.ruleInfoDtoList.forEach(j => {
                let val = this.backup_rulesItem_condition.filter(
                  k => k.tagName == j.ruleName
                );
                if (val && val.length) {
                  j.ruleNameTag = val[0].tagDescription;
                  let ruleValueName = '';
                  j.ruleValue.forEach(h => {
                    if (
                      val[0].tagName == 'birthday' ||
                      val[0].tagName == 'graduationDate'
                    ) {
                      ruleValueName += h + ',';
                    } else {
                      ruleValueName +=
                        val[0].permitRuleValue.filter(g => g.code == h)[0]?.name + ',';
                    }
                  });
                  j.ruleValueName = ruleValueName;
                  j.permitRuleValueOption = val[0].permitRuleValue;
                }
              });
            });
            // 岗位配置
            this.stationConfigDetail.forEach(r => {
              r.ruleInfoDtoList.forEach(j => {
                let val = this.backup_rulesItem_config.filter(
                  k => k.tagName == j.ruleName
                );
                if (val && val.length) {
                  j.ruleNameTag = val[0].tagDescription;
                  let ruleValueName = '';
                  j.ruleValue.forEach(h => {
                    ruleValueName +=
                      val[0].permitRuleValue.filter(g => g.code == h)[0]?.name +
                      '，';
                  });
                  j.ruleValueName = ruleValueName;
                  j.permitRuleValueOption = val[0].permitRuleValue;
                }
              });
            });
          } catch (err) {
            console.error('err:', err);
          }
        })
        .catch(message => {
          this.$Message.error(message);
        });
    },

    //添加组
    addItemToConditions() {
      const _length = this.ruleForm._stationCondition_.length;
      let judgeTypeOuter = '';
      if (_length === 0) judgeTypeOuter = 'EMPTY';
      this.ruleForm._stationCondition_.push({
        judgeTypeOuter,
        judgeTypeInner: '',
        ruleInfoDtoList: [],
      });
    },
    setConditionOrConfig(type) {
      this.type = type;

      if (type == 'stationConfig') {
        this.allLayerRules = this.backup_allLayerRules_config;
        this.allLayerRulesItem = this.backup_rulesItem_config;
      } else if (type == 'stationCondition') {
        this.allLayerRules = this.backup_allLayerRules_condition;
        this.allLayerRulesItem = this.backup_rulesItem_condition;
      }
    },
    //添加组内条件
    addItemToruleInfoDtoList(index, type) {
      this.setConditionOrConfig(type);
      this.$refs.setConditionComponent.init(index);
      let call = () => {
        this.$refs.setConditionComponent.init(index);
      };
      setTimeout(call, 200);
    },
    //设置组内条件
    setruleInfoDtoListItem(index, idx, child, type) {
      this.type = type;
      this.setConditionOrConfig(type);
      let val = JSON.parse(JSON.stringify(child));
      this.$refs.setConditionComponent.init(index, idx, val);
    },
    //具体条件选择完后回显
    addItemToruleInfoDtoListBack(index, childIndex, obj, type) {
      if (childIndex === '') {
        //新增
        if (type == 'stationCondition') {
          this.ruleForm._stationCondition_[index].ruleInfoDtoList.push(obj);
        }
      } else {
        //编辑
        if (type == 'stationCondition') {
          this.$set(
            this.ruleForm._stationCondition_[index].ruleInfoDtoList,
            childIndex,
            obj
          );
        }
      }
    },

    //移除组
    removeItemToConditions(index) {
      this.ruleForm._stationCondition_.splice(index, 1);
      this.ruleForm._stationCondition_.length &&
        (this.ruleForm._stationCondition_[0].judgeTypeOuter = 'EMPTY'); //第一个条件组的judgeTypeOuter始终为EMPTY
    },

    //移除组内条件
    removeruleInfoDtoListItem(index, idx, type) {
      if (type == 'stationCondition') {
        this.ruleForm._stationCondition_[index].ruleInfoDtoList.splice(idx, 1);
      }
    },

    //确定提交
    submitForm() {
      // this.ruleForm.tagType='3';
      this.$refs.ruleForm.validate(valid => {
        if (valid) this.submitFormFun();
      });
    },
    arrHandle(arr) {
      if (arr && arr.length) {
        for (const item of arr) {
          if (
            !item.judgeTypeOuter ||
            !item.judgeTypeInner ||
            item.ruleInfoDtoList.length <= 0
          ) {
            this.$Message.warning('逻辑关系必填且条件组中至少有一个具体条件');
            return false;
          }
        }
        return true;
      }
      return false;
    },
    submitFormFun() {
      let validate1 = this.arrHandle(this.ruleForm._stationCondition_);
      let validate2 = this.arrHandle(this.stationConfigDetail);

      if (validate1 && validate2) {
        if (
          this.ruleForm._stationCondition_ &&
          this.ruleForm._stationCondition_.length
        ) {
          for (const item of this.ruleForm._stationCondition_) {
            item.ruleInfoDtoList.forEach(r => {
              delete r.ruleNameTag;
              delete r.ruleValueName;
              delete r.permitRuleValueOption;
            });
          }
        }
        if (this.stationConfigDetail && this.stationConfigDetail.length) {
          for (const item of this.stationConfigDetail) {
            item.ruleInfoDtoList.forEach(r => {
              delete r.ruleNameTag;
              delete r.ruleValueName;
              delete r.permitRuleValueOption;
            });
          }
        }

        //  this.ruleForm.dateFrom=this.ruleForm.date[0].format('yyyy-MM-dd hh:mm:ss');
        //  this.ruleForm.dateTo=this.ruleForm.date[1].format('yyyy-MM-dd hh:mm:ss');
        // delete this.ruleForm.date;
        let targetObj1 = JSON.parse(
          JSON.stringify(this.ruleForm._stationCondition_)
        );
        let targetObj2 = JSON.parse(JSON.stringify(this.stationConfigDetail));
        delete this.ruleForm._stationCondition_;
        let param = Object.assign(
          this.ruleForm,
          { stationCondition: { tagInfoDtoList: targetObj1 } },
          { stationConfig: { tagInfoDtoList: targetObj2 } }
        );
        if (this.pageType == 'copy') {
          delete this.ruleForm.id;
        }
        this.loading = true;
        this.$Fetch({
          url: '/api/teacherStation/save',
          method: 'post',
          data: param,
        })
          .then(result => {
            if (result.code === '0') {
              this.loading = false;
              this.$Message.success(result.message || '操作成功');
              this.$emit(
                'success',
                result,
                Object.assign(
                  this.ruleForm,
                  {
                    stationCondition: {
                      tagInfoDtoList: this.ruleForm._stationCondition_,
                    },
                  },
                  {
                    stationConfig: { tagInfoDtoList: this.stationConfigDetail },
                  }
                )
              );
              this.closeDialog();
            }
          })
          .catch(message => {
            this.loading = false;
            // this.$emit("success",result,Object.assign(this.ruleForm,{stationCondition:{tagInfoDtoList:this.ruleForm._stationCondition_}},{stationConfig: {tagInfoDtoList:this.stationConfigDetail}}));
            this.$Message.error(message);
          });
      }
    },
    setEdit() {
      this.pageType = 'edit';
    },
    closeDialog() {
      this.dialogVisible = false;
      this.stationName = '';
      this.ruleForm = {
        stationName: '',
        stationCount: null,
        date: [],
        remark: '',
        _stationCondition_: [],
      };
      this.stationConfigDetail = [];
    },
  },
};
</script>
<style lang="less">
.tea-station-tag {
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
    margin-bottom: 5px;
  }
}
.el-tooltip__popper_title {
  max-width: 600px;
  line-height: 20px;
}
</style>
