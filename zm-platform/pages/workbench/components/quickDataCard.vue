<template>
	<data-card title="快捷功能入口">
		<template slot="content">
			<div class="quick-container">
				<el-button class="quick-btn" v-for="(item, index) in quickLinks" @click="handleClick(item)" :key="index">
					{{item.label}}</el-button>
			</div>
		</template>
	</data-card>
</template>
<script>
import DataCard from './dataCard/dataCard';

export default {
  name: 'ComeDataCard',
  components: { DataCard },
  data() {
    return {
      tipType: 'normal',
      quickLinks: [
        {
          label: '全职招师-面试管理',
          url: `${location.pathname}#/full_times/pre_training`,
          type: '_blank',
          permission: 'recruit:process:fulltime',
          event: '1',
        },
        {
          label: '老师库-老师查询',
          url: '/tea-library/tea-search.html',
          type: '_blank',
          event: '2',
        },
        {
          label: '老师库-入库老师',
          url: '/tea-library/tea-library.html',
          type: '_blank',
          event: '3',
        },
        {
          label: '老师库-人才库',
          url: '/tea-library/tea-recycle.html',
          type: '_blank',
          event: '4',
        },
        {
          label: '工作台数据报表',
          url: `${location.pathname}#/report_forms/workbenchReport`,
          type: '_blank',
          permission: 'report-workbench',
          event: '5',
        },
      ],
    };
  },
  methods: {
    handleClick(item) {
      this.$sdk.sendEvent({
        eventId: 'zhaoshi_click_dashboard_shortcut_button',
        eventParam: {
          shortcut_button: item.event
        }
      });
      if (
        !item.permission ||
        this.$store.getters.permissionList.includes(item.permission)
      ) {
        window.open(location.origin + item.url, '_blank');
      } else {
        this.$Message.error({
          message: '无权限，请联系相应人员开通权限',
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.quick-container {
  padding: 20px 8px 12px 20px;
  .quick-btn {
    margin-right: 12px;
    margin-left: 0px;
    color: #1d91fc;
    border-color: #1d91fc;
    border-radius: 4px;
    margin-bottom: 8px;
  }
}
</style>