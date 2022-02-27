<!--
 * @Author       : zhangmen
 * @Date         : 2021-02-22 10:24:38
 * @LastEditors  : rijian.chen
 * @LastEditTime : 2021-03-01 16:17:27
 * @FilePath     : \teacher-webapp\zm-platform\pages\config_interviewed\dialog\edit.vue
-->
<template>
  <el-dialog
    v-model="visible"
    title="标签详情"
    class="config-interviewed-detial"
  >
    <el-form
      :model="from_data"
      label-position="left"
      label-width="100px"
      ref="formDataRef"
    >
      <div class="bg-f4f5f5">
        <div class="mw292">
          <el-form-item label="标签名称：" prop="name">
            {{ from_data.name || '' }}
          </el-form-item>
          <el-form-item label="标签描述：" prop="limitDesc">
            {{ from_data.limitDesc || '' }}
          </el-form-item>
          <el-form-item label="标签类型：" prop="limitType">
            {{ from_data.limitTypeStr || '' }}
          </el-form-item>
        </div>
      </div>
      <div class="mt10 bg-f4f5f5">
        <el-form-item
          label="时间段/上限："
          prop="appoint"
        ></el-form-item>
        <div
          style="display:flex;margin-bottom: 10px;"
          v-for="(item, index) in from_data.appointLimitTimeConfigList"
          :key="index"
        >
          <div style="width:100px">
            {{ `${item.timeFrom} ~ ${item.timeTo}` }}
          </div>
          <div>{{ item.limitCount }}</div>
        </div>
        <el-form-item label="生效时间：" class="init-margin">{{
          from_data.dayStr
        }}</el-form-item>
      </div>

      <div class="mt10 bg-f4f5f5">
        <condition ref="filterCondition"></condition>
      </div>
    </el-form>
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
          limitTypeStr: '',
          dayStr: '',
        };
      }
    },
  },
  methods: {
    async open(id) {
      this.visible = true;
      if (id) {
        const detail = await appointLimitDetail({ id });

        if (detail.data.code === '0') {
          this.from_data = Object.assign(this.from_data, detail.data.data);
          this.from_data.limitTypeStr = this.parseLimitTypeStr();
          this.from_data.dayStr = this.getDayStr();
          this.$refs.filterCondition.init(
            'show',
            detail.data.data.filterCondition.tagInfoDtoList || []
          );
        } else {
          this.$message.warning(detail.data.message);
        }

      }
    },
    parseLimitTypeStr() {
      const arr = this.tagTypeOpetion.filter(
        item => item.value === this.from_data.limitType
      );
      let str = '';
      if (arr.length) {
        str = arr[0].label;
      }
      return str;
    },
    getDayStr() {
      let start = '';
      let end = '';
      this.dayOption.forEach(item => {
        if (item.value === this.from_data.from) {
          start = `${item.label}(早)`;
        }
        if (item.value === this.from_data.to) {
          end = `${item.label}(晚)`;
        }
      });

      return `${start} ${start ? '~' : ''} ${end}`;
    },
  },
};
</script>
<style lang="less">
.config-interviewed-detial {
  .el-form-item{
    margin-bottom: 10px;
  }
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
    padding: 0;
    color: #333;
  }
  .el-form-item__content {
    line-height: initial;
  }
  .bg-f4f5f5 {
    background-color: #f4f5f5;
    padding: 10px;
  }
  .mw292 {
    max-width: 292px;
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
