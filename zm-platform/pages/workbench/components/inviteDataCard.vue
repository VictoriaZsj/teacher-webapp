<template>
	<data-card :tipType="tipType" type="1" title="约面数据" :tools="tools" @data-type-change="handleDataTypeChange"
						 @cycle-change="handleCycleChange" @refresh="handleRefresh">
		<template slot="content">
			<div class="primary" :class="primaryClass">
				<span class="label">约面数：</span>
				<el-tooltip placement="right" popper-class="channel-tip">
					<div slot="content">
						<p>非个人渠道：{{allData.otherChannelCount}}</p>
						<p>个人渠道：{{allData.personalChannelCount}}</p>
					</div>
					<span class="num">{{allData.appointInterviewCount}}</span>
				</el-tooltip>

			</div>
			<div class="normal"><span class="label">平均约面数：</span><span class="num">{{allData.avgAppointInterviewCount}}</span>
			</div>
			<div class="normal top"><span class="label">最高约面数：</span><span
							class="num">{{allData.maxAppointInterviewCount}}</span>
				<top-user :users="allData.championNames"></top-user>
			</div>
		</template>
	</data-card>
</template>
<script>
import DataCard from './dataCard/dataCard';
import TopUser from './dataCard/topUser';
import authMixins from './mixins/auth';

export default {
  name: 'InviteDataCard',
  components: { DataCard, TopUser },
  mixins: [authMixins],
  data() {
    return {
      tools: ['select', 'radio', 'refresh'],
      refreshing: false,
      params: {
        orgCode: '',
        timeType: '0',
        optionType: '0',
      },
      allData: {},
    };
  },
  computed: {
    primaryClass() {
      let {
        appointInterviewCount,
        avgAppointInterviewCount,
        maxAppointInterviewCount,
      } = this.allData;
      return {
        top: !this.isOrg && appointInterviewCount === maxAppointInterviewCount,
        bottom: !this.isOrg && appointInterviewCount < avgAppointInterviewCount,
      };
    },
    tipType() {
      let {
        appointInterviewCount,
        avgAppointInterviewCount,
        maxAppointInterviewCount,
      } = this.allData;
      if (this.isOrg || maxAppointInterviewCount === 0) return '';
      if (appointInterviewCount < avgAppointInterviewCount) {
        return 'bad';
      } else if (appointInterviewCount === maxAppointInterviewCount) {
        return 'good';
      } else if(appointInterviewCount > avgAppointInterviewCount){
        return 'normal';
      }

      return '';
    },
    isOrg() {
      return this.roleCode === 1 || (this.roleCode === 2 && this.params.optionType !== '1')
    }
  },
  methods: {
    handleSearch() {
      this.refreshing = true;
      this.$Fetch({
        url: `/api/dataView/statistics/appointInterview`,
        method: 'get',
        params: {
          ...this.params,
        },
      })
        .then(result => {
          let { data, code, message } = result;
          if (code === '0') {
            this.allData = data;
            this.allData.championNames = data.championNames || [];
          } else {
            this.$Message.error({
              message,
            });
          }

          this.refreshing = false;
        })
        .catch(message => {
          this.refreshing = false;
          this.$Message.error({
            message,
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.normal{
    display: flex;
    justify-content: flex-start
}

</style>