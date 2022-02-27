<template>
	<data-card title="到面数据" type="2" :tipType="tipType" :refreshing="refreshing" @refresh="handleRefresh" :tools="tools"
						 @cycle-change="handleCycleChange" @data-type-change="handleDataTypeChange">
		<template slot="content">
			<div class="primary" :class="primaryClass">
				<span class="label">到面数：</span>
				<el-tooltip placement="right" popper-class="channel-tip">
					<div slot="content">
						<p>非个人渠道：{{allData.otherChannelCount}}</p>
						<p>个人渠道：{{allData.personalChannelCount}}</p>
					</div>
					<span class="num">{{allData.interviewCount}}</span>
				</el-tooltip>
			</div>
			<!-- <div class="normal"><span class="label">到面率：</span><span class="num">{{getRate(allData.interviewRate)}}</span>
			</div> -->
			<div class="normal"><span class="label">平均到面数：</span><span class="num">{{allData.avgInterviewCount}}</span></div>
			<div class="normal top"><span class="label">最高到面数：</span><span class="num">{{allData.maxInterviewCount}}</span>
				<top-user :users="allData.championNames"></top-user>
			</div>
		</template>
	</data-card>
</template>
<script>
import DataCard from './dataCard/dataCard';
import TopUser from './dataCard/topUser';
import authMixins from './mixins/auth';
import Big from 'big.js';
export default {
  name: 'ComeDataCard',
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
        interviewCount,
        avgInterviewCount,
        maxInterviewCount,
      } = this.allData;
      return {
        top: !this.isOrg && interviewCount === maxInterviewCount,
        bottom: !this.isOrg && interviewCount < avgInterviewCount,
      };
    },
    tipType() {
      let {
        interviewCount,
        avgInterviewCount,
        maxInterviewCount,
      } = this.allData;
      if (this.isOrg || maxInterviewCount === 0) return '';
      if (interviewCount < avgInterviewCount) {
        return 'bad';
      } else if (interviewCount === maxInterviewCount) {
        return 'good';
      } else if(interviewCount > avgInterviewCount){
        return 'normal';
      }
      return '';
    },
    isOrg() {
      return this.roleCode === 1 || (this.roleCode === 2 && this.params.optionType !== '1')
    }
  },
  methods: {
    getRate(val = 0) {
      let bigV = Big(val)
      let per = bigV.times(100);
      if (('' + per).includes('.')) {
        per = per.toFixed(2);
      }
      return per + '%';
    },
    handleSearch() {
      this.refreshing = true;
      this.$Fetch({
        url: `/api/dataView/statistics/interview`,
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