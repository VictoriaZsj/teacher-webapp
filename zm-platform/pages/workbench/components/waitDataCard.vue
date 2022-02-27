<template>
	<data-card title="待面数据" type="3" :tipType="tipType" :tools="tools" :refreshing="refreshing" @refresh="handleRefresh"
						 @data-type-change="handleDataTypeChange">
		<template slot="content">
			<div class="primary" :class="primaryClass">
				<span class="label">次日待面数：</span>
				<el-tooltip placement="right" popper-class="channel-tip">
					<div slot="content">
						<p>非个人渠道：{{allData.otherChannelCount}}</p>
						<p>个人渠道：{{allData.personalChannelCount}}</p>
					</div>
					<span class="num">{{allData.awaitInterviewCount}}</span>
				</el-tooltip>
			</div>
			<div class="normal"><span class="label">预测到面数：</span><span class="num">{{allData.evaluateInterviewCount}}</span>
			</div>
			<div class="normal"><span class="label">平均待面数：</span><span class="num">{{allData.avgAwaitInterviewCount}}</span>
			</div>
			<div class="normal top"><span class="label">最高待面数：</span><span
							class="num">{{allData.maxAwaitInterviewCount}}</span>
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
  name: 'WaitDataCard',
  components: { DataCard, TopUser },
  mixins: [authMixins],
  data() {
    return {
      tools: ['select', 'refresh'],
      refreshing: false,
      params: {
        orgCode: '',
        optionType: '0',
      },
      allData: {},
    };
  },
  computed: {
    primaryClass() {
      let {
        awaitInterviewCount,
        avgAwaitInterviewCount,
        maxAwaitInterviewCount,
      } = this.allData;
      return {
        top: !this.isOrg && awaitInterviewCount === maxAwaitInterviewCount,
        bottom: !this.isOrg && awaitInterviewCount < avgAwaitInterviewCount,
      };
    },
    tipType() {
      let {
        awaitInterviewCount,
        avgAwaitInterviewCount,
        maxAwaitInterviewCount,
      } = this.allData;
      if(this.isOrg || maxAwaitInterviewCount === 0) return '';
      if (awaitInterviewCount < avgAwaitInterviewCount) {
        return 'bad';
      } else if (awaitInterviewCount === maxAwaitInterviewCount) {
        return 'good';
      } else if(awaitInterviewCount > avgAwaitInterviewCount){
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
        url: `/api/dataView/statistics/awaitInterview`,
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