<template>
  <div class="condition">
    <div>
      筛选条件
      <span v-if="pageType !== 'show'">
        <el-button
          type="primary"
          size="small"
          @click.native="addItemToConditions"
          >添加条件组</el-button
        >
        最多添加5组
      </span>
    </div>
    <div class="list-box" v-if="stationCondition.length">
      <template v-for="(item, index) in stationCondition">
        <div :key="'select' + index">
          <div :key="'select' + index" v-if="index > 0">
            <el-select
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
            <div class="right" v-if="item.ruleInfoDtoList">
              <div
                v-for="(child, idx) in item.ruleInfoDtoList"
                :key="'child' + idx"
              >
                <div class="right-first" v-if="child.ruleValueName">
                  <el-tooltip
                    effect="dark"
                    popper-class="el-tooltip__popper_title"
                    :disabled="child.ruleValueName.length < 18"
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
                      {{ child.ruleNameTag }}-{{ dictLabel[child.ruleType] }}-{{
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
                size="small"
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
    <setCondition
      ref="setConditionComponent"
      :allLayerRules="allLayerRules"
      :allLayerRulesItem="allLayerRulesItem"
      :type="pageType"
      @success="addItemToruleInfoDtoListBack"
    ></setCondition>
  </div>
</template>
<script>
import setCondition from '../../config_list_station/component/teaStationTag/setCondition.vue';

import { getAllFilterConditionLayerRules } from '../../../api/teacherConfig';

export default {
  components: { setCondition },
  data() {
    return {
      stationCondition: [],
      allLayerRulesItem: [],
      allLayerRules: [],
      pageType: '',
      backup_allLayerRules_config: [],
      backup_rulesItem_config: [],
      dictLabel: {
        IN: '包含',
        NOT_IN: '不包含',
        EQUAL: '等于',
        NOT_EQUAL: '不等于',
        BETWEEN: '介于',
        UN_BETWEEN: '不介于',
      },
    };
  },
  methods: {
    // 初始化数据
    async init(type, stationCondition) {
      await this.getAllFilterConditionLayerRules();
      this.pageType = type; // ['show', 'add', 'edit', 'copy']
      if (stationCondition && Array.isArray(stationCondition)) {
        this.stationCondition = [...stationCondition];
        // 回显中文
        this.stationCondition.forEach(r => {
          r.ruleInfoDtoList.forEach(j => {
            let val = this.backup_rulesItem_config.filter(
              k => k.tagName == j.ruleName
            );
            if (val && val.length) {
              j.ruleNameTag = val[0].tagDescription;
              let ruleValueName = '';
              j.ruleValue.forEach(h => {
                ruleValueName +=
                  val[0].permitRuleValue.filter(g => g.code == h)[0].name +
                  '，';
              });
              j.ruleValueName = ruleValueName;
              j.permitRuleValueOption = val[0].permitRuleValue;
            }
          });
        });
      }
    },
    resetData() {
      this.stationCondition = [];
      this.pageType = '';
    },
    getFilterCondition() {
      let str = this.stationCondition.length ? null : '请添加条件组';
      this.stationCondition.forEach((item, index) => {
        if (!item.ruleInfoDtoList.length) {
          str = `第${index + 1}条件组，具体条件不能为空`;
          return;
        }
      });

      return str || [...this.stationCondition];
    },
    // 获取具体条件配置
    async getAllFilterConditionLayerRules() {
      await getAllFilterConditionLayerRules().then(res => {
        this.backup_allLayerRules_config = res.data.data;

        res.data.data.forEach(r => {
          r.groupRule.forEach(j => {
            this.backup_rulesItem_config.push(j);
          });
        });
      });
    },

    //添加组
    addItemToConditions() {
      const _length = this.stationCondition.length;
      if (_length > 4) {
        this.$message.warning('最多只能添加五组条件');
        return;
      }
      let judgeTypeOuter = 'AND';
      if (_length === 0) judgeTypeOuter = 'EMPTY';
      this.stationCondition.push({
        judgeTypeOuter,
        judgeTypeInner: 'AND',
        ruleInfoDtoList: [],
      });
    },
    //添加组内条件
    addItemToruleInfoDtoList(index) {
      this.setConditionOrConfig();
      this.$refs.setConditionComponent.init(index);
    },
    //设置组内条件
    setruleInfoDtoListItem(index, idx, child) {
      this.setConditionOrConfig();
      let val = JSON.parse(JSON.stringify(child));
      this.$refs.setConditionComponent.init(index, idx, val);
    },
    //移除组
    removeItemToConditions(index) {
      this.stationCondition.splice(index, 1);
      this.stationCondition.length &&
        (this.stationCondition[0].judgeTypeOuter = 'EMPTY'); //第一个条件组的judgeTypeOuter始终为EMPTY
    },
    //具体条件选择完后回显
    addItemToruleInfoDtoListBack(index, childIndex, obj) {
      if (childIndex === '') {
        //新增
        this.stationCondition[index].ruleInfoDtoList.push(obj);
      } else {
        //编辑
        this.$set(
          this.stationCondition[index].ruleInfoDtoList,
          childIndex,
          obj
        );
      }
      this.$emit('updata', this.stationCondition);
    },

    //移除组内条件
    removeruleInfoDtoListItem(index, idx) {
      this.stationCondition[index].ruleInfoDtoList.splice(idx, 1);
    },
    setConditionOrConfig() {
      this.allLayerRules = this.backup_allLayerRules_config;
      this.allLayerRulesItem = this.backup_rulesItem_config;
    },
  },
};
</script>

<style lang="less">
.condition {
  .list-box {
    padding: 0 20px;
    .item {
      display: flex;
      border: solid #ededed 1px;
      padding: 10px 20px 0 20px;
      margin: 10px 30px 0 0;
      border-radius: 4px;
      position: relative;
      width: 98%;
      left: -10px;
      background: #fff;
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
          .el-tooltip__popper_title {
            max-width: 600px;
            line-height: 20px;
          }
        }
        .right-second {
          line-height: 30px;
          padding-left: 10px;
          min-width: 64px;
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
        right: -24px;
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
}
</style>
