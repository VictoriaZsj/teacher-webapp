<template>
	<data-card title="漏斗数据" :tools="tools" @data-type-change='handleDataTypeChange'
  @refresh="handleRefresh" @date-change='handleDateChange' :default-date='defaultDate'>
		<template slot="content">
			<div style="padding: 40px; color: #ccc; height: 100%;width: 100%; text-align: center">
            <!-- <img src="~zm-images/no-content.png" /> -->

            <div class="funnel">
              <div class="funnelImgDiv">
                 <img src="../../../../src/images/funnel.png" class="funnelImg"/>
                 <span class="num num1">{{funnelData.assignCount}}</span>
                 <span class="num num2">{{funnelData.appointInterviewCount}}</span>
                 <span class="num num3">{{funnelData.interviewCount}}</span>
                 <span class="num num4">{{funnelData.appointTrainCount}}</span>
                 <span class="num num5">{{funnelData.trainPassCount}}</span>
                 <span class="rate rate1">{{funnelData.appointInterviewRate}}%</span>
                 <span class="rate rate2">{{funnelData.interviewRate}}%</span>
                 <span class="rate rate3">{{funnelData.appointTrainRate}}%</span>
                 <span class="rate rate4">{{funnelData.trainPassRate}}%</span>
              </div>
              <div class="item item1"><p>阶段目标：</p><p>拒绝轻易放弃名单，及时跟进 </p></div>
              <div class="item item2"><p>阶段目标：</p><p>调整心态，严格把关，积极引导</p></div>
              <div class="item item3"><p>阶段目标：</p><p>检查课件、缺席跟进、缺席警告</p></div>
              <div class="item item4"><p>阶段目标：</p><p>及时跟进、培训提醒、细心答</p></div>
              <div class="item item5"><p>阶段目标：</p><p>上课提醒、不要请假，备好资料</p></div>

            </div>
            <!-- <p>暂无数据</p> -->
      </div>

		</template>
	</data-card>
</template>
<script>
import DataCard from './dataCard/dataCard';
import TopUser from './dataCard/topUser';
import authMixins from './mixins/auth';
function getCountDays() {
          var curDate = new Date();
        /* 获取当前月份 */
          var curMonth = curDate.getMonth();
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
  }
  var day=getCountDays();
  const start=new Date().setDate(1);
  const end = new Date()

export default {
  name: 'FunnelDataCard',
  components: { DataCard, TopUser },
  mixins: [authMixins],
  data() {
    return {
      tools: ['select','search','date'],
      params: {
        orgCode: '',
        optionType: '0',
        rateType:0,
        endTime:'',
        startTime:''
      },
      defaultDate:[this.$DateTool.format(start, "yyyy-MM-dd") + " 00:00:00",this.$DateTool.format(end, "yyyy-MM-dd") + " 23:59:59"],
      funnelData:[]
    };
  },
  methods: {
    handleSearch(){
      let id=window.localStorage.getItem('ZM_USERID')
      this.$Fetch({
        url: `/api/dataView/statistics/funnel/result`,
        method: 'post',
        data: {
            "currentUserId":id,
            "endTime": this.params.endTime?this.params.endTime:this.$DateTool.format(end, "yyyy-MM-dd") + " 23:59:59",
            "optionType": this.params.optionType,
            "orgCode": this.params.orgCode,
            "startTime": this.params.startTime?this.params.startTime:this.$DateTool.format(start, "yyyy-MM-dd") + " 00:00:00"
          }
      }).then(result=>{
        let { data, code, message } = result;
        if (code === '0') {
          this.funnelData=data

        } else {
          this.$Message.error({
            message,
          });
        }
      })
    }
  },
  mounted(){
      // this.params.startTime=this.$DateTool.format(start, "yyyy-MM-dd") + " 00:00:00"
      // this.params.endTime=this.$DateTool.format(end, "yyyy-MM-dd") + " 23:59:59"
  }
};
</script>
<style lang="less" scoped>
  .funnel{
    position: relative;
    .funnelImgDiv{
        position: absolute;
        height: 100%;
        right: 0;
        .funnelImg{
          display: block;
          height: 100%
        }
        .num{
          display: inline-block;
          width: 100px;
          left: 25px;
          font-size: 22px;
          color: #ffffff;
          position: absolute;
        }
        .num1{
          top: 38px;
        }
        .num2{
          top: 128px;
        }
        .num3{
           top: 218px;
        }
        .num4{
           top: 312px;
        }
        .num5{
           top: 402px;
        }
        .rate{
          right: 0;
          display: inline-block;
          width: 100px;
          color: #000000;
          position: absolute;
        }
        .rate1{
          top:68px;
        }
        .rate2{
          top:179px;
        }
        .rate3{
          top:314px;
        }
        .rate4{
          top:410px;
        }
      }
    .item{
      display: flex;
      flex-flow: column;
      justify-content:center ;
      height: 80px;
      text-align: left;
      padding-left: 30px;
      width: 65%;
      border-radius:5px;
      margin-bottom: 12px;
      color: #000000;

      p:first-child{
        margin-bottom: 10px;
        font-weight: 400;
      }
      P:nth-child(2n){
        color: #717070;
      }

    }

    .item1{
      background-color: #F9F5FF;
    }
    .item2{
      background-color: #F3F8FF;
    }
    .item3{
      background-color: #EEFFFD;
    }
    .item4{
      background-color: #FFFAF1;
    }
    .item5{
      background-color: #E9F2E8;
    }
  }
</style>
