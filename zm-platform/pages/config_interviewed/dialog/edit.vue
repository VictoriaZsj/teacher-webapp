<!--
 * @Author       : zhangmen
 * @Date         : 2021-02-22 10:24:38
 * @LastEditors  : rijian.chen
 * @LastEditTime : 2021-03-08 11:21:13
 * @FilePath     : \teacher-webapp\zm-platform\pages\config_interviewed\dialog\edit.vue
-->
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    class="config-interviewed-editDialog"
  >
    <el-form
      :model="from_data"
      label-position="left"
      label-width="100px"
      :rules="formRules"
      ref="formDataRef"
    >
      <div class="bg-f4f5f5">
        <div class="mw292">
          <el-form-item label="标签名称" prop="name">
            <el-input
              v-model="from_data.name"
              placeholder="创建后不可变更，20字内"
              :maxlength="20"
              :disabled="!!this.from_data.id"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签描述" prop="limitDesc">
            <el-input
              v-model="from_data.limitDesc"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签类型" prop="limitType">
            <el-select
              v-model="from_data.limitType"
              placeholder="用于区分约面/约培标签"
              class="mw292"
              :disabled="!!this.from_data.id"
            >
              <el-option
                v-for="(item, index) in tagTypeOpetion"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="mt10 bg-f4f5f5">
        <el-form-item
          class="init-margin"
          label="时间段/上限"
          prop="appoint"
        ></el-form-item>
        <div class="colorf5f5f5">
          约面/培时，会校验下方配置的人数上限（每日）；未配置上限条件不校验上限（可约成功）
        </div>
        <appointLimitTime
          ref="appointLimitTime"
          :isCheckChange="visible"
          :isInit="isInit"
        ></appointLimitTime>

        <el-form-item label="生效时间" class="init-margin"></el-form-item>
        <div class="colorf5f5f5">周期性时间，每周都按照此规则上限控制</div>
        <div class="using-time">
          <el-select
            placeholder="每周X（早）"
            v-model="from_data.from"
            @change="handleStartDayChange"
            class="width120"
          >
            <el-option
              v-for="item in dayOption"
              :key="item.value"
              :label="item.label + '(早)'"
              :value="item.value"
            ></el-option>
          </el-select>
          <div style="margin: 0 10px">-</div>
          <el-select
            placeholder="每周X（晚）"
            v-model="from_data.to"
            @change="handleStopDayChange"
            class="width120"
          >
            <el-option
              v-for="item in dayOption"
              :key="item.value"
              :label="item.label + '(晚)'"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="mt10 bg-f4f5f5">
        <condition
          ref="filterCondition"
          @updata="handleUpdataCondition"
        ></condition>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="isSubmit"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import appointLimitTime from './appointLimitTime.vue';
import condition from './condition.vue';
import { appointLimitDetail } from '../../../api/teacherConfig';

export default {
  components: { appointLimitTime, condition },
  props: {
    tagTypeOpetion: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      visible: false,
      from_data: {
        name: '', // 标签名称
        limitDesc: '', // 标签描述
        limitType: '', // 标签类型
        appointLimitTimeConfigList: [], // 时间段/上限
        from: '', // 生效开始时间
        to: '', // 生效结束时间
        filterCondition: {
          // 筛选条件
          tagInfoDtoList: [],
        },
      },
      formRules: {
        name: [
          {
            required: true,
            type: 'string',
            message: '请输入标签名称',
            trigger: 'change',
          },
        ],
        limitType: [
          {
            required: true,
            type: 'number',
            message: '请选择标签类型',
            trigger: 'change',
          },
        ],
      },
      dayOption: [
        { label: '每周一', value: 1 },
        { label: '每周二', value: 2 },
        { label: '每周三', value: 3 },
        { label: '每周四', value: 4 },
        { label: '每周五', value: 5 },
        { label: '每周六', value: 6 },
        { label: '每周日', value: 7 },
      ],
      title: '配置约面/约培人数上限',
      isSubmit: false,
      isInit: false,
    };
  },
  watch: {
    visible: function(v) {
      if (!v) {
        //关闭弹窗 重置数据
        this.from_data = {
          name: '', // 标签名称
          limitDesc: '', // 标签描述
          limitType: '', // 标签类型
          appointLimitTimeConfigList: [], // 时间段/上限
          from: '', // 生效开始时间
          to: '', // 生效结束时间
          filterCondition: {
            // 筛选条件
            tagInfoDtoList: [],
          },
        };
        this.$refs.formDataRef.resetFields();
        this.$refs.appointLimitTime.resetTimes();
        this.$refs.filterCondition.resetData();
      }
    },
  },
  methods: {
    async open(id) {
      this.visible = true;
      this.isInit = true;
      if (id) {
        const detail = await appointLimitDetail({ id });

        if (detail.data.code === '0') {
          this.from_data = Object.assign(this.from_data, detail.data.data);
          this.$refs.filterCondition.init(
            'edit',
            detail.data.data.filterCondition.tagInfoDtoList || []
          );
          this.$refs.appointLimitTime.proposTimes(
            this.from_data.appointLimitTimeConfigList || []
          );
        } else {
          this.$message.warning(detail.data.message);
        }

      } else {
        this.$nextTick(() => {
          this.$refs.filterCondition.init('edit');
        })
      }
      setTimeout(() => {this.isInit = false;},0)
    },
    handleUpdataCondition(data) {
      this.from_data.filterCondition.tagInfoDtoList = [...data];
    },
    handleSubmit() {
      this.$refs.formDataRef.validate(v => {
        if (!v) return;
        const AppointLimitTime = this.$refs.appointLimitTime.getAppointLimitTime();
        const tagInfoDtoList = this.$refs.filterCondition.getFilterCondition();
        if (!AppointLimitTime || !Array.isArray(AppointLimitTime)) {
          this.$message.warning(AppointLimitTime);
          return;
        }
        if (!this.from_data.from || !this.from_data.to) {
          this.$message.warning('生效时间有误');
          return;
        }
        if (!Array.isArray(tagInfoDtoList) || !tagInfoDtoList.length) {
          this.$message.warning(tagInfoDtoList || '筛选条件未设置');
          return;
        }

        this.from_data.appointLimitTimeConfigList = [...AppointLimitTime];
        this.from_data.filterCondition.tagInfoDtoList = [...tagInfoDtoList];
        this.$emit('submit', this.from_data, this.dialogStatuChange);
      });
    },
    dialogStatuChange(b) {
      this.visible = b;
    },
    handleStopDayChange(val) {
      if (!this.visible || !val) return;
      if (!this.from_data.from) {
        this.$message.warning('请选择开始生效时间');
        this.from_data.to = '';
        return;
      }
      if (this.from_data.from > val) {
        this.$message.warning('结束时间不能小于开始时间');
        this.from_data.to = '';
      }
    },
    handleStartDayChange() {
      if (this.isInit) return;
      this.from_data.to = '';
    },
  },
};
</script>
<style lang="less">
.config-interviewed-editDialog {
  .mt10 {
    margin-top: 10px;
  }
  .body {
    text-align: left;
  }
  .el-dialog__body,
  .el-dialog__footer {
    background: #fff;
  }
  .el-form-item__label {
    color: #333;
  }
  .bg-f4f5f5 {
    background-color: #f4f5f5;
    padding: 10px;
  }
  .mw292 {
    max-width: 292px;
  }
  .init-margin {
    margin: 0;
  }
  .colorf5f5f5 {
    color: #b1b1b1;
  }
  .width120 {
    width: 120px;
  }
  .using-time {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
