<template>
	<div style="margin-bottom: 20px">
		<data-card title="今日目标" type="5" :tools="tools" @setting="handleSetting" @refresh="handleRefresh" @data-type-change="handleDataTypeChange">
			<template slot="content">
				<div class="goal-container" :class="{'has-one': allData.length === 1, 'no-one': allData.length === 0}">
					<div v-for="(item, index) in allData" :key="index" class="goal-item">
						<div class="ball">
							<canvas-ball v-if="item.targetCount" :num="item.completion"></canvas-ball>
							<span>{{item.completion  | transPer}}</span>
						</div>

						<div class="ball-data">
							<h5>{{item.targetBu | transTitle}}</h5>
							<p><span>目标：</span><i>{{item.targetCount}}</i></p>
							<p><span>已完成：</span><i>{{item.finishCount}}</i></p>
							<p><span>未完成：</span><i>{{item.targetCount - item.finishCount | transCount}}</i></p>
						</div>
					</div>
					<div class="goal-item no-content" v-if="!allData.length">
						<div>
							<img src="~zm-images/no-content.png" />
						</div>
						<p>暂无数据</p>
					</div>
				</div>
			</template>
		</data-card>
		<el-dialog title="设置个人目标" v-model="dialogShow" center custom-class="goal-setting-dialog">
			<p class="tip">注：变更过设置，默认为次日0点生效，新任务开始时间会覆盖掉上次设置的结束时间</p>
			<el-tabs v-model="activeBu" type="card" @tab-click="handleClick">
				<el-tab-pane label="1对1" name="1">
					<goal-form ref="goalForm1" bu='1'>
					</goal-form>
				</el-tab-pane>
				<el-tab-pane label="少儿" name="2" >
					<goal-form ref="goalForm2" bu='2'>
					</goal-form>
				</el-tab-pane>
			</el-tabs>
			<div class="control">
				<el-button @click="dialogShow = false">取消</el-button>
				<el-button @click="handleSubmit" type="primary">确定</el-button>
			</div>
		</el-dialog>
	</div>

</template>
<script>
import DataCard from './dataCard/dataCard';
import TopUser from './dataCard/topUser';
import GoalForm from './dataCard/goalForm';
import CanvasBall from './dataCard/ball';
import authMixins from './mixins/auth';
import Big from 'big.js';
export default {
  name: 'GoalDataCard',
  components: { DataCard, TopUser, GoalForm, CanvasBall },
  mixins: [authMixins],
  data() {
    return {
      dialogShow: false,
      activeBu: '1',
      params: {
        orgCode: '',
        optionType: '0',
        // roleCode: '0'
      },
      tools: ['select', 'refresh'],
      allData: [],
    };
  },
  props: {
    hasSetting: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    hasSetting(val) {
      if(val){
        this.tools = ['select', 'refresh', 'setting']
      }else{
        this.tools = ['select', 'refresh']
      }
    }
  },
  created() {
    if(this.hasSetting){
      this.tools = ['select', 'refresh', 'setting'];
    }
  },
  filters: {
    transPer(val = 0) {
      let bigV = Big(val)
      let per = bigV.times(100);
      if (('' + per).includes('.')) {
        per = per.toFixed(2);
      }
      return per + '%';
    },
    transTitle(val) {
      return val === '1' ? '1对1' : '少儿';
    },
    transCount(val){
      if(val >= 0) {
        return val;
      }else{
        return '超';
      }
    }
  },
  methods: {
    // disposeAuthInfo(info) {
    //   let { roleCode } = info;
    //   this.roleCode = roleCode;
    // },
    //  handleDataTypeChange(val) {
    //   if (val === '0' || val === '1') {
    //     this.params.optionType = val;
    //     this.params.orgCode = '';
    //   } else if (val) {
    //     this.params.optionType = '2';
    //     this.params.orgCode = val;
    //   }
    //   this.handleSearch();
    // },
    handleSetting() {
      this.dialogShow = true;
      this.$sdk.sendEvent({
        eventId: 'zhaoshi_click_dashboard_Personalgoals',
        eventParam: {
          set: 'zhaoshi_click_dashboard_Personalgoals'
        }
      });
    },
    handleSubmit() {
      
      let p2=this.$refs[`goalForm2`].getValues(this.activeBu);
      let p1=this.$refs[`goalForm1`].getValues(this.activeBu);;

      Promise.all([p1, p2]).then((result) => {
        if(result[0]&&result[1]){
            let Param_1v1=''
          let Param_child=''

          result[0].targetBu = '1';
          result[0].startTime = new Date(result[0].startTime).format('yyyy-MM-dd 00:00:00');
          result[0].endTime = new Date(result[0].endTime).format('yyyy-MM-dd 23:59:59');
          Param_1v1=result[0];
       
          result[1].targetBu = '2';
          result[1].startTime = new Date(result[1].startTime).format('yyyy-MM-dd 00:00:00');
          result[1].endTime = new Date(result[1].endTime).format('yyyy-MM-dd 23:59:59');
          Param_child=result[1];

            let id=window.localStorage.getItem('ZM_USERID');
            this.$Fetch({
              url: `/api/dataView/statistics/interview/insertInterviewRecruitTarget`,
              method: 'post',
              data: {
                interviewRecruitTargetDtoList:[
                  {
                    ...Param_1v1,
                  },{
                    ...Param_child
                  }
                ],
                userId:id
              }
            }).then(result=>{
              let { data, code, message } = result;
              if (code === '0') {
                this.$Message.success('设置成功');
                this.dialogShow = false;
                this.handleSearch();
              } else {
                this.$Message.error({
                  message,
                });
              }
            })
          }
        }).catch(errbu=>{
        })
          
    },
    handleClick() {},
    handleSearch() {
      this.refreshing = true;
      this.$Fetch({
        url: `/api/dataView/statistics/interview/getInterviewTargetList`,
        method: 'get',
        params: {
          ...this.params
        }
      }).then(result => {
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
    }
  },
};
</script>
<style lang="less" scoped>
.goal-container {
  display: flex;
  padding: 26px 30px;
  min-height: 168px;
  justify-content: space-between;
  &.has-one {
    justify-content: center;
  }
  &.no-one {
    justify-content: center;
    text-align: center;
    .goal-item {
      display: block;
    }
    div {
      padding-top: 7px;
    }
    p {
      color: #cccccc;
      line-height: 30px;
    }
    img {
      width: 72px;
      height: 72px;
    }
  }
  .goal-item {
    display: flex;
    width: 40%;
    margin-right: 30px;
  }
}
.ball {
  position: relative;
  width: 116px;
  height: 116px;
  margin-right: 30px;
  border-radius: 50%;
  background: #f5f6f7;
  overflow: hidden;
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 116px;
    text-align: center;
    font-size: 24px;
    color: #1d91fc;
  }
}
.ball-data {
  font-size: 0.83em;
  h5 {
    height: 40px;
    line-height: 40px;
    color: #333333;
    font-weight: bold;
  }
  p {
    height: 20px;
    line-height: 20px;
    margin-bottom: 8px;
    color: #999999;
    i {
      color: #4a4a4a;
      font-style: normal;
    }
  }
}
</style>

<style lang="less">
.goal-setting-dialog {
  width: 500px;
  border-radius: 4px;
  .el-dialog__header {
    padding-bottom: 0;
    border: 0;
  }
  .el-dialog__body {
    padding-right: 0;
    padding-left: 0;
    padding-top: 4px;
    background: #fff;
    border-radius: 4px;
    .tip {
      padding-bottom: 12px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e1e1e1;
      color: #ef4c4f;
      text-indent: 20px;
    }
    .el-tabs__header {
      .el-tabs__nav-wrap {
        padding-left: 20px;
        z-index: 1;
      }
      .el-tabs__item {
        background: #fafafa;
        color: #4a4a4a;
        margin-right: 4px;
        width: 116px;
        text-align: center;
        border: 1px solid #d9d9d9;
        &.is-active {
          background: #fff;
          color: #1d91fc;
          border-bottom-color: #fff;
        }
      }
      &::after {
        display: block;
        position: relative;
        width: 100%;
        content: '';
        border-bottom: 1px solid #e1e1e1;
      }
    }
  }

  .control {
    text-align: right;
    padding-right: 30px;
    padding-top: 20px;
    .el-button {
      border-radius: 4px;
      padding: 10px 18px;
    }
  }
}
</style>