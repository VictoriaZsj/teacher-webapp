<template>
  <div class="appoint-limit-time">
    <!-- 新增/编辑 -->
    <div
      class="appoint-limit-time-item"
      v-for="(timeTtem, index) in times"
      :key="index"
    >
      <el-select
        placeholder="开始时间"
        class="width120"
        v-model="timeTtem.timeFrom"
        @change="handleStartTimeChange(timeTtem, index)"
      >
        <el-option
          v-for="item in start_time"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div style="margin: 0 10px">-</div>
      <el-select
        placeholder="结束时间"
        class="width120"
        v-model="timeTtem.timeTo"
        @change="handleEndTimeChange(timeTtem, index)"
      >
        <el-option
          v-for="item in end_time"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div class="width120 ml10">
        <el-input
          type="number"
          :min="1"
          placeholder="可约人数上限"
          v-model="timeTtem.limitCount"
          @keyup.native="parseNumber"
        ></el-input>
      </div>
      <div class="handle-icon ml10">
        <icon
          class="el-icon-delete"
          v-if="times.length > 1"
          @click.native="handleRemove(index)"
        ></icon>
        <icon
          class="el-icon-plus ml10"
          v-if="index === times.length - 1"
          @click.native="handleAdd"
        ></icon>
      </div>
    </div>
    <!-- 纯展示 -->
  </div>
</template>
<script>
import icon from '../../../../src/components/icon/icon.vue';
import recycleConfigVue from '../../configRecycle/recycleConfig.vue';
export default {
  components: { icon },
  props: {
    isCheckChange: {
      type: Boolean,
      default: false,
    },
    isInit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      start_time: [
        {
          label: '8:00',
          value: '8:00',
          disabled: false,
        },
        {
          label: '9:00',
          value: '9:00',
          disabled: false,
        },
        {
          label: '10:00',
          value: '10:00',
          disabled: false,
        },
        {
          label: '11:00',
          value: '11:00',
          disabled: false,
        },
        {
          label: '12:00',
          value: '12:00',
          disabled: false,
        },
        {
          label: '13:00',
          value: '13:00',
          disabled: false,
        },
        {
          label: '14:00',
          value: '14:00',
          disabled: false,
        },
        {
          label: '15:00',
          value: '15:00',
          disabled: false,
        },
        {
          label: '16:00',
          value: '16:00',
          disabled: false,
        },
        {
          label: '17:00',
          value: '17:00',
          disabled: false,
        },
        {
          label: '18:00',
          value: '18:00',
          disabled: false,
        },
        {
          label: '19:00',
          value: '19:00',
          disabled: false,
        },
        {
          label: '20:00',
          value: '20:00',
          disabled: false,
        },
        {
          label: '21:00',
          value: '21:00',
          disabled: false,
        },
        {
          label: '22:00',
          value: '22:00',
          disabled: false,
        },
        {
          label: '23:00',
          value: '23:00',
          disabled: false,
        },
      ],
      end_time: [
        {
          label: '8:59',
          value: '8:59',
          disabled: false,
        },
        {
          label: '9:59',
          value: '9:59',
          disabled: false,
        },
        {
          label: '10:59',
          value: '10:59',
          disabled: false,
        },
        {
          label: '11:59',
          value: '11:59',
          disabled: false,
        },
        {
          label: '12:59',
          value: '12:59',
          disabled: false,
        },
        {
          label: '13:59',
          value: '13:59',
          disabled: false,
        },
        {
          label: '14:59',
          value: '14:59',
          disabled: false,
        },
        {
          label: '15:59',
          value: '15:59',
          disabled: false,
        },
        {
          label: '16:59',
          value: '16:59',
          disabled: false,
        },
        {
          label: '17:59',
          value: '17:59',
          disabled: false,
        },
        {
          label: '18:59',
          value: '18:59',
          disabled: false,
        },
        {
          label: '19:59',
          value: '19:59',
          disabled: false,
        },
        {
          label: '20:59',
          value: '20:59',
          disabled: false,
        },
        {
          label: '21:59',
          value: '21:59',
          disabled: false,
        },
        {
          label: '22:59',
          value: '22:59',
          disabled: false,
        },
        {
          label: '23:59',
          value: '23:59',
          disabled: false,
        },
      ],
      times: [
        {
          timeFrom: '',
          timeTo: '',
          limitCount: '',
        },
      ],
    };
  },
  methods: {
    parseNumber(e) {
      e.target.value = e.target.value.replace(/-|[+]|[\.]/g, '');
      if (e.target.value<0) {
        e.target.value = 0
      }
    },

    proposTimes(times) {
      if (times.length) {
        this.times = [...times];
      } else {
        this.resetTimes();
      }
    },

    handleStartTimeChange(item, index) {
      if (this.isInit) return;
      item.timeTo = '';
    },

    handleEndTimeChange(item, index) {
      if (!this.isCheckChange || !item.timeTo) return;
      const timeTo = item.timeTo ? item.timeTo.split(':')[0] : 0;
      const timeFrom = item.timeFrom ? item.timeFrom.split(':')[0] : 0;
      if (!item.timeFrom) {
        item.timeTo = '';
        this.$Message.warning('请设置开始时间');
        return;
      }
      if (Number(timeFrom) > Number(timeTo)) {
        item.timeTo = '';
        this.$Message.warning('结束时间不能小于开始时间');
        return;
      }
      // this.checkTimes(item, index);
    },

    // checkTimes(item, index) {
    //   const timeTo = item.timeTo ? item.timeTo.split(':')[0] : 0;
    //   const timeFrom = item.timeFrom ? item.timeFrom.split(':')[0] : 0;
    //   this.times.forEach((it, i) => {
    //     const timeTo2 = it.timeTo ? it.timeTo.split(':')[0] : 0;
    //     const timeFrom2 = it.timeFrom ? it.timeFrom.split(':')[0] : 0;
    //     if (index===i || !timeTo || !timeFrom || !timeTo2 || !timeFrom2) return;
    //     if ((timeFrom > timeFrom2 && timeTo<timeFrom2) || (timeFrom <= timeFrom2 && timeTo2 < timeFrom)) {
    //       this.$Message.warning('该时间段重复');
    //       item.timeTo = '';
    //       item.timeFrom = ''
    //     }
    //   });
    // },

    getAppointLimitTime() {
      let err = null;
      let t = [];
      this.times.forEach((item, i) => {
        const timeTo = item.timeTo ? item.timeTo.split(':')[0] : 0;
        const timeFrom = item.timeFrom ? item.timeFrom.split(':')[0] : 0;
        if (!timeTo || !timeFrom || !item.limitCount) {
          err = `请完善时间段/上限：第${i + 1}条`;
        } else {
          for (let i = Number(timeFrom); i < Number(timeTo) + 1; i++) {
            t.push(i);
          }
        }
      });
      if (err) {
        return err;
      }
      return this.times;
    },
    handleRemove(i) {
      this.times.splice(i, 1);
    },
    handleAdd() {
      if (this.times.length>15) {
        this.$message.warning('不能超过15条')
        return
      }
      this.times.push({
        timeFrom: '',
        timeTo: '',
        limitCount: '',
      });
    },

    resetTimes() {
      this.times = [
        {
          timeFrom: '',
          timeTo: '',
          limitCount: '',
        },
      ];
    },
  },
};
</script>
<style lang="less">
.appoint-limit-time {
  .appoint-limit-time-item {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .handle-icon {
      .ivu-icon {
        cursor: pointer;
      }
    }
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .width120 {
    width: 120px;
  }
  .ml10 {
    margin-left: 10px;
  }
}
</style>
