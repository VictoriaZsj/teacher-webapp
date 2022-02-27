<template>
	<data-card title="30日趋势" :tools="tools" @data-type-change='handleDataTypeChange' @refresh="handleRefresh" @date-change='handleDateChange' :default-date='defaultDate'>
		<template slot="content">


     <div class="tab">
        <div v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{active: activeTab === item.value}"
							 @click="handleClick(item)">{{item.label}}
        </div>
     </div>

      <div id="interview" class="item" >
          <!-- <p class="tiheighttle">按BU</p> -->
      </div>
      <div style="padding: 40px; color: #ccc; height: 100%;width: 100%; text-align: center"  v-show='!hasData'>
				<img src="~zm-images/no-content.png" />
				<p>暂无数据</p>
			</div>
		</template>
	</data-card>
</template>
<script>
import DataCard from './dataCard/dataCard';
import TopUser from './dataCard/topUser';
import authMixins from './mixins/auth';
import echarts from 'echarts';


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
// var echarts = require('echarconst end = new Date();
export default {

  name: 'TrendDataCard',
  components: { DataCard, TopUser },
  mixins: [authMixins],


  data() {
    return {
      obj1:{},
      obj2:{},
      tools: ['select','search','date'],
      hasData:null,
      tabs: [
        // {
        //   label: '到面率',
        //   value: 0,
        // },
        // {
        //   label: '参培率',
        //   value: 1,
        // }
      ],
      // defaultDate:[start,end],
      params: {
        orgCode: '',
        optionType: '0',
        rateType:0,
        startTime:'',
        endTime:''
      },
     defaultDate:[this.$DateTool.format(start, "yyyy-MM-dd") + " 00:00:00",this.$DateTool.format(end, "yyyy-MM-dd") + " 23:59:59"],
     activeTab: 0,
     typeData:[],
     highestData:[],
    };
  },
   computed: {
    dataTypeOptions() {
      return this.$store.state.workbench.dataTypeOptions;
    }
   },

  methods: {

    handleTypeChange(type){
    },
    handleClick(item) {
      if (item.value === this.activeTab) {
        return;
      } else {
        this.activeTab = item.value;
        this.params.rateType= item.value
        this.handleSearch()
      }
    },
    handleSearch(){

      this.$Fetch({
        url: `/api/dataView/statistics/rateList`,
        method: 'post',
        data: {
            "endTime": this.params.endTime?this.params.endTime:this.$DateTool.format(end, "yyyy-MM-dd") + " 23:59:59",
            "optionType": this.params.optionType,
            "orgCode": this.params.orgCode,
            "rateType": this.params.rateType,
            "startTime": this.params.startTime?this.params.startTime:this.$DateTool.format(start, "yyyy-MM-dd") + " 00:00:00"
          }

      }).then(result=>{
        let { data, code, message } = result;

        if (code === '0') {
          this.hasData=data;
          this.typeData=data.rateTypeDtoList[0];
          this.highestData=data.rateTypeDtoList[1];
          this.getCharts(this.highestData,this.typeData);
        } else {
          this.$Message.error(
            message
          );
        }
      }).catch(err=>{
        this.$Message.error(
            err
          );
      })
    },
    getCharts(highestData,typeData){
        let higeX=highestData.rateDtoList.map(item=>{
            return item.targetDate.split(' ')[0]
        });
        let option = {
          tooltip: {
              trigger: 'axis',
              formatter: "{b}<br/><span style='color:#FFCD4F;margin-right:5px'>●</span>{a0}：{c0}%<br/><span style='color:#54C6FF;margin-right:5px'>●</span>{a1}：{c1}%<br/>"
          },
          legend: {
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: higeX,
              axisLabel: {
                  formatter: (value=>{
                    return  value.slice(5)
                  })
              }
          },
          yAxis: {
              type: 'value',
              axisLabel: {
                  formatter: '{value}%'
              }
          },

          series: [
              {
                  name: highestData.type,
                  type: 'line',
                  data: highestData.rateDtoList,
                  lineStyle:{
                    type :'solid',
                    color:'#FFCD4F'
                  },
                  itemStyle:{
                    color:'#FFCD4F'
                  },


              },
              {
                  name: typeData.type,
                  type: 'line',
                  data: typeData.rateDtoList,
                  lineStyle:{
                    type :'solid',
                    color:'#54C6FF'
                  },
                  itemStyle:{
                    color:'#54C6FF'
                  },

              }
          ]
        };
        this.obj1.setOption(option);
      }
    },
    mounted(){

      if(this.has('tea:workbench:come')&&!this.has('tea:workbench:train')){
        this.tabs=[{
          label: '到面率',
          value: 0,
        }]
        this.activeTab=0
      }else if(!this.has('tea:workbench:come')&&this.has('tea:workbench:train')){

        this.tabs=[
        {
          label: '参培率',
          value: 1,
        }]
        this.activeTab=1
      }else if(this.has('tea:workbench:come')&&this.has('tea:workbench:train')){
        this.tabs=[ {
          label: '到面率',
          value: 0,
        },
        {
          label: '参培率',
          value: 1,
        }]
      }else{
        this.tabs=[]
      }
      this.params.rateType=this.activeTab;
      this.handleSearch()
       this.obj1 = echarts.init(document.getElementById('interview'));

    }
};
</script>
<style lang="less" scoped>
.tab {
    padding: 10px 20px 20px;
  display: flex;
  margin-bottom: 20px;
  .tab-item {
    cursor: pointer;
    position: relative;
    margin-right: 33px;
    font-size: 14px;
    color: #4a4a4a;
    &.active {
      color: #1d91fc;
      &::after {
        position: absolute;
        content: '';
        height: 2px;
        width: 80%;
        background: #1d91fc;
        bottom: -8px;
        left: 10%;
      }
    }
  }

}
.item{
    min-height:500px;
  }
</style>
