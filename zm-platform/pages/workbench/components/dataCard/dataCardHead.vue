<template>
	<div class="card-head">
		<span class="title">{{title}}</span>
		<div class="tools">
      <slot name="head-form"></slot>
			<el-select v-if="tools.includes('select') && hasSelect" class="select" v-model="dataType" @change="handleDataTypeChange">
				<el-option v-for="(item, index) in dataTypeOptions" :key="index" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-radio-group v-if="tools.includes('radio')" class="radio" v-model="cycle" @change="handleCycleChange">
				<el-radio-button label="0">日</el-radio-button>
				<el-radio-button label="1">周</el-radio-button>
			</el-radio-group>
			<el-date-picker v-if="tools.includes('date')" class="date" v-model="date" type="daterange"
											placeholder="选择日期范围" @change="handleDateChange">
			</el-date-picker>
			<el-button v-if="tools.includes('search')" type="primary" class="search" @click="handleRefresh">查询</el-button>
			<span v-if="tools.includes('setting')" class="iconfont icon-shezhi" @click="handleSetting"></span>
			<span v-if="tools.includes('refresh')" class="iconfont icon-refresh" :class="{rotate: refreshing}" @click="handleRefresh"></span>
      <slot name="head-tools"></slot>
		</div>
	</div>
</template>
<script>

export default {
  name: 'DataCardHead',
  data() {
    return {
      cycle: '0',
      dataType: '0',
      date: this.defaultDate,
    };
  },
  props: {
    defaultDate:{
      type: Array,
      default(){
        return [];
      }
    },
    title: {
      type: String,
      default: '',
    },
    tools: {
      type: Array,
      default(){
        return [];
      },
    },
    refreshing: {
      type: Boolean,
      default: false,
    }
  },
  watch:{

  },
  computed: {
    dataTypeOptions() {
      return this.$store.state.workbench.dataTypeOptions;
    },
    authInfo() {
      return this.$store.state.workbench.authInfo;
    },
    hasSelect() {
      return this.authInfo.roleCode !== 0
    }
  },
  methods: {
    handleCycleChange() {
      this.$emit('cycle-change', this.cycle);
    },
    handleDataTypeChange() {
      this.$emit('data-type-change', this.dataType);
    },
    handleDateChange(){
      this.$emit('date-change',this.date);
    },

    handleRefresh() {
      this.$emit('refresh');
    },
    handleSetting() {
      this.$emit('setting');
    }
  },
  mounted(){
    // console.log('deFaultDate:',this.defaultDate)
  }
};
</script>
<style lang="less" scoped>
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 54px;
  border-bottom: 1px solid #e1e1e1;
}
.title {
  font-size: 16px;
  color: #333333;
  margin: 0 16px 0 20px;
  font-weight: bold;
}
.tools {
  display: flex;
  align-items: center;
  padding-right: 10px;
}
.select {
  width: 66px;
  height: 24px;
  margin-right: 10px;
}
.radio {
  margin-right: 10px;
}
.search {
  margin-right: 10px;
  height: 32px;
  padding: 8px 15px;
  border-radius: 4px;
}
.date {
  margin-right: 10px;
}
.iconfont {
  color: #1d91fc;
}
.icon-refresh {
  cursor: pointer;
  margin-right: 10px;
}
.icon-shezhi {
  cursor: pointer;
  margin-right: 10px;
}
</style>
<style lang="less">
.card-head {
  .el-button--primary {
    background-color: #1D91FC;
    border-color: #1D91FC;
  }
  .el-input__icon:after {
    vertical-align: -10px;
  }
  .el-icon-caret-top:before {
    content: "\e70e";
  }
  .select {
    .el-input__icon + .el-input__inner {
      padding-right: 25px;
      height: 24px;
    }
    .el-input__icon {
      width: 28px;
      line-height: 24px;
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transform: translateY(-45%) scale(0.45) rotateZ(180deg);
      &.is-reverse {
        transform: translateY(-55%) scale(0.45);
      }
    }
  }
  .select-recommend {
    .el-input__icon + .el-input__inner {
      height: 32px;
    }
    width: 100px;
  }
  .radio {
    font-size: 0;
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #1d91fc;
      background: #fff;
      border-color: #1d91fc;
    }
    .el-radio-button__inner {
      height: 24px;
      padding: 5px 10px;
      font-size: 12px;
    }
  }
  .date {
    .el-input__inner {
      height: 32px;
    }
  }
}

.rotate {
  animation: rotate 1.2s infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
