<template>
	<div class="workbench" v-loading="loading" v-if="loading || permission">
		<p class="top-tip">更新时间：<span>实时更新</span></p>
		<div class="data-container" v-if="has('tea:workbench:core')">
			<invite-data-card></invite-data-card>
			<come-data-card></come-data-card>
			<wait-data-card></wait-data-card>
			<result-data-card></result-data-card>
		</div>
		<div class="todo-container" style="flex:1">
			<div class="todo-left-container" v-if="has('tea:workbench:goalData') || has('tea:workbench:quick')">
				<goal-data-card :has-setting="has('tea:workbench:goalDataSetting')" v-if="has('tea:workbench:goalData')" ></goal-data-card>
				<!-- <quick-data-card v-if="has('tea:workbench:quick')"></quick-data-card> -->
        <transfer-application/>
			</div>
			<div class="todo-right-container" style="width:49.4%;">
				<todo-data-card></todo-data-card>
			</div>
		</div>
    <div class="todo-container">
			<div class="todo-left-container"  v-if="has('tea:workbench:come')||has('tea:workbench:train')">
				<trend-data-card ></trend-data-card>
			</div>
			<div class="todo-right-container" v-if="has('tea:workbench:funnel')">
				<funnel-data-card></funnel-data-card>
			</div>
		</div>
	</div>
	<div v-else style="font-size: 24px;text-align:center;line-height: 80vh;">暂无操作权限，请联系对应的人员开通权限，路径：招师系统-招师工作台</div>
</template>
<script>
import InviteDataCard from './components/inviteDataCard';
import ComeDataCard from './components/comeDataCard';
import WaitDataCard from './components/waitDataCard';
import ResultDataCard from './components/resultDataCard';
import GoalDataCard from './components/goalDataCard';
import TransferApplication from './components/transferApplication';
import TodoDataCard from './components/todoDataCard';
import TrendDataCard from './components/trendDataCard';
import FunnelDataCard from './components/funnelDataCard';

export default {
  name: 'Dashboard',
  components: {
    InviteDataCard,
    ComeDataCard,
    WaitDataCard,
    ResultDataCard,
    GoalDataCard,
    TransferApplication,
    TodoDataCard,
    TrendDataCard,
    FunnelDataCard
  },
  props: {
    permissionName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    loading() {
      return this.$store.state.workbench.loading;
    },
    permission() {
      return this.$store.getters.permission;
    },
    permissionList() {
      return this.$store.getters.permissionList;
    },
  },
  methods: {
    has(name) {
      return this.permissionList.includes(name);
    }
  },
};
</script>
<style lang="less" scoped>
.workbench {
  min-width: 1300px;
  min-height: 100%;
}
.data-container,
.todo-container {
  display: flex;
  margin-bottom: 20px;
}
.todo-left-container,
.todo-right-container {
  width: 100%;
  margin-right: 20px;
}
.todo-right-container {
  margin-right: 0px;
}
.todo-left-container {
  display: flex;
  flex-direction: column;
}
.top-tip {
  margin-bottom: 10px;
  line-height: 1.5;
  color: #999;
  span {
    color: #1d91fc;
  }
}
</style>
<style lang="less">
.channel-tip.el-tooltip__popper {
    font-size: 14px;
    line-height: 1.5;
}
.workbench {
  .data-container {
    .content {
      padding: 10px 20px;
      min-height: 150px;
      .primary {
        height: 32px;
        margin-bottom: 10px;
        line-height: 32px;
        .label {
          font-size: 16px;
        }
        .num {
          font-size: 24px;
          vertical-align: -2px;
        }
      }
      .normal {
        height: 20px;
        margin-bottom: 10px;
        line-height: 20px;
        .label {
          font-size: 12px;
        }
        .num {
          font-size: 14px;
          vertical-align: -1px;
        }
      }
      .link {
        height: 20px;
        margin-top: 10px;
        line-height: 20px;
        .label {
          font-size: 12px;
        }
        .num {
          font-size: 18px;
          vertical-align: -1px;
          color: #1D91FC;
          cursor: pointer;
        }
      }
      .label {
        color: #999999;
      }
      .num {
        color: #4a4a4a;
      }
      .top {
        .num {
          color: #f5242d;
        }
      }
      .bottom {
        .num {
          color: #52c41a;
        }
      }
    }
  }
}
</style>
