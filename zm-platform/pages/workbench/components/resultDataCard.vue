<template>
	<data-card v-loading="false" type="4" title="面试结果" :tools="tools" @data-type-change="handleDataTypeChange"
						 @cycle-change="handleCycleChange" @refresh="handleRefresh">
		<template slot="content">
			<div class="link"><span class="label">面试通过：</span>
				<el-tooltip :open-delay="200" placement="right" popper-class="channel-tip">
					<div slot="content">
						<p>非个人渠道：{{allData.passOtherChannelCount}}</p>
						<p>个人渠道：{{allData.passPersonalChannelCount}}</p>
					</div>
					<span class="num" @click="handleJump('pass')">{{allData.passCount}}</span>
				</el-tooltip>
			</div>
			<div class="link"><span class="label">面试不通过：</span>
				<el-tooltip :open-delay="200" placement="right" popper-class="channel-tip">
					<div slot="content">
						<p>非个人渠道：{{allData.unPassOtherChannelCount}}</p>
						<p>个人渠道：{{allData.unPassPersonalChannelCount}}</p>
					</div>
					<span class="num" @click="handleJump('unpass')">{{allData.unPassCount}}</span>
				</el-tooltip>
			</div>
			<div class="link"><span class="label">待二面：</span>
				<el-tooltip :open-delay="200" placement="right" popper-class="channel-tip">
					<div slot="content">
						<p>非个人渠道：{{allData.secondInterviewOtherChannelCount}}</p>
						<p>个人渠道：{{allData.secondInterviewPersonalChannelCount}}</p>
					</div>
					<span class="num" @click="handleJump('second')">{{allData.secondInterviewCount}}</span>
				</el-tooltip>
			</div>
			<div class="link"><span class="label">面试缺席：</span>
				<el-tooltip :open-delay="200" placement="right" popper-class="channel-tip">
					<div slot="content">
						<p>非个人渠道：{{allData.absenceOtherChannelCount}}</p>
						<p>个人渠道：{{allData.absencePersonalChannelCount}}</p>
					</div>
					<span class="num" @click="handleJump('absence')">{{allData.absenceCount}}</span>
				</el-tooltip>
			</div>
		</template>
	</data-card>
</template>
<script>
import DataCard from './dataCard/dataCard';
import TopUser from './dataCard/topUser';
import authMixins from './mixins/auth';

export default {
  name: 'ResultDataCard',
  components: { DataCard, TopUser },
  mixins: [authMixins],
  data() {
    return {
      tools: ['select', 'radio', 'refresh'],
      params: {
        orgCode: '',
        timeType: '0',
        optionType: '0',
      },
      allData: {},
    };
  },
  methods: {
    handleSearch() {
      this.refreshing = true;
      this.$Fetch({
        url: `/api/dataView/statistics/interview/result`,
        method: 'get',
        params: {
          ...this.params,
        },
      })
        .then(result => {
          let { data, code, message } = result;
          if (code === '0') {
            this.allData = data;
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
    handleJump(type) {
      let origin = `${location.protocol}//${location.host}`;
      let path = `${origin}${location.pathname}#`;
      if (type === 'pass') {
        window.open(`${path}/full_times/pre_training?interviewState=2`);
      } else if (type === 'second') {
        window.open(`${path}/full_times/pre_training?interviewState=10`);
      } else if (type === 'absence') {
        window.open(`${path}/full_times/pre_training?interviewState=11`);
      } else if (type === 'unpass') {
        window.open(
          `${origin}/tea-library/tea-recycle.html?recycleCondition=302`
        );
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>