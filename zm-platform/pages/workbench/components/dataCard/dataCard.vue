<template>
	<div class="card-container">

		<data-card-head :title="title" :tools="tools" :refreshing="refreshing" @refresh="handleRefresh"
										@setting="handleSetting" @data-type-change="handleDataTypeChange" @cycle-change="handleCycleChange"
                     @date-change='handleDateChange' :default-date='defaultDate'>
                     <div slot="head-form"><slot name="head-form"></slot></div>
                     <div slot="head-tools"><slot name="head-tools"></slot></div>
		</data-card-head>

		<div class="content">
			<slot name="content"></slot>
		</div>
		<div v-if="tipType" class="tip" :class="tipClass">
			<span class="tip-icon" :class="iconClass"></span><span class="text">{{text[tipType]}}</span>
		</div>
	</div>
</template>
<script>
import DataCardHead from './dataCardHead';
export default {
  name: 'DataCard',
  data() {
    return {
      text: {
        good: '太棒了，今日最佳，犒劳下自己',
        normal: '你很棒哦，已经超过平均水平啦',
        bad: '尚未达到平均值，请继续努力哦',
      },
    };
  },
  components: {
    DataCardHead,
  },
  props: {
    defaultDate:{
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: '',
    },
    tipType: {
      type: String,
      default: '',
    },
    tools: {
      type: Array,
      default() {
        return [];
      },
    },
    refreshing: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconClass() {
      return {
        'tip-icon-bad': this.tipType === 'bad',
        'tip-icon-good': this.tipType === 'good',
        'tip-icon-normal': this.tipType === 'normal',
      };
    },
    tipClass() {
      return {
        'tip-bad': this.tipType === 'bad',
        'tip-good': this.tipType === 'good',
        'tip-normal': this.tipType === 'normal',
      };
    },
  },
  methods: {
    handleCycleChange(val) {
      this.$emit('cycle-change', val);
    },
    handleRefresh() {
      this.$sdk.sendEvent({
        eventId: 'zhaoshi_click_dashboard_refreshbutton',
        eventParam: {
          position: this.type,
        },
      });
      this.$emit('refresh');
    },
    handleDataTypeChange(val) {
      this.$emit('data-type-change', val);
    },
    handleSetting() {
      this.$emit('setting');
    },
    handleDateChange(val){
     this.$emit('date-change',val);
    }
  },
};
</script>
<style lang="less" scoped>
.card-container {
  width: 100%;
  // height: 100%;
  background: #fff;
  border-radius: 4px;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  .tip {
    height: 44px;
    margin: 0 20px 20px;
    line-height: 44px;
    border-radius: 8px;
    &-good {
      background: rgba(245, 36, 45, 0.1);
      color: #f5242d;
    }
    &-normal {
      background: rgba(196, 140, 26, 0.1);
      color: #ff9700;
    }
    &-bad {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    .tip-icon {
      display: inline-block;
      margin: 0 10px 0 16px;
      font-size: 28px;
      width: 44px;
      height: 44px;
      vertical-align: top;
      &.tip-icon-bad {
        background: url(../../../../../src/assets/icon-bad.png) no-repeat center;
      }
      &.tip-icon-normal {
        background: url(../../../../../src/assets/icon-normal.png) no-repeat center;
      }
      &.tip-icon-good {
        background: url(../../../../../src/assets/icon-good.png) no-repeat center;
      }
    }
    .text {
      display: inline-block;
      line-height: 44px;
      height: 44px;
      font-size: 12px;
    }
  }
}
</style>
