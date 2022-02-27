<template>
<div @click.stop="panelClick" class="vue-datepicker">
  <i @mouseenter="changeIconClose()" @mouseleave="changeIconDate()" @click="clearData()" class="el-input__icon" :class="iconClass"></i>
  <input readonly="readonly" type="text" class="form-control  backWhite" autocomplete="off" disableautocomplete :name="field" :id="field" :value="value" :placeholder="placeholder" @focus="startChoice" @click="startChoice"
      ref="input">
  <div class="vue-datepicker-panels" v-show="dayPanelIsShow || monthPanelIsShow || hourPanelIsShow || minutePanelIsShow">
    <!--年月选择-->
    <div class="vue-datepicker-panel" v-show="monthPanelIsShow">
      <div class="vue-datepicker-month">
        <a class="vue-datepicker-prev" @click="prevYear"> &lt; </a>
        <span>{{ year }}年</span>
        <a class="vue-datepicker-next" @click="nextYear"> &gt; </a>
      </div>
      <table class="vue-datepicker-tb2">
        <col width="33%" />
        <col width="33%" />
        <col width="33%" />
        <tbody>
          <tr v-for="(season, index) in monthArr" :key="index" track-by="$index">
            <td v-for="(m, _index) in season" :key="_index" track-by="$index" @click="choiceMonth(m.id, $event)" :class="classMonth(m.id)">
              <span>{{ m.name }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--日期选择-->
    <div class="vue-datepicker-panel" v-show="dayPanelIsShow">
      <div class="vue-datepicker-month">
        <a class="vue-datepicker-prev" @click="prevMonth"> &lt; </a>
        <span class="vue-datepicker-btn" @click="startChoiceMonth">{{ year }}年 {{ month }}月</span>
        <a class="vue-datepicker-next" @click="nextMonth"> &gt; </a>
      </div>
      <table class="vue-datepicker-tb">
        <thead>
          <tr>
            <th v-for="(d, dIndex) in langConf.week" :key="dIndex">{{ d }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, mIndex) in monthDays" :key="mIndex" track-by="$index">
            <td v-for="(d, dIndex) in m" :key="dIndex" track-by="$index" @click="choiceDay(d, $event)" :class="classDay(d)">
              <span>{{ d }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--小时选择-->
    <div class="vue-datepicker-panel" v-show="hourPanelIsShow">
      <div class="vue-datepicker-month">
        <a class="vue-datepicker-prev" @click="prevDay"> &lt; </a>
        <span class="vue-datepicker-btn" @click="startChoiceDate">{{ year }}年 {{ month }}月 {{day}}日</span>
        <a class="vue-datepicker-next" @click="nextDay"> &gt; </a>
      </div>
      <table class="vue-datepicker-tb2">
        <tbody>
            <thead></thead>
          <tr>
             <td :class="classHour(0)"><span @click="choiceHour(0, $event)"> 0:00 </span></td>
             <td :class="classHour(1)"><span @click="choiceHour(1, $event)"> 1:00 </span></td>
             <td :class="classHour(2)"><span @click="choiceHour(2, $event)"> 2:00 </span></td>
             <td :class="classHour(3)"><span @click="choiceHour(3, $event)"> 3:00 </span></td>
          </tr>
          <tr>
              <td :class="classHour(4)"><span @click="choiceHour(4, $event)"> 4:00 </span></td>
              <td :class="classHour(5)"><span @click="choiceHour(5, $event)"> 5:00 </span></td>
              <td :class="classHour(6)"><span @click="choiceHour(6, $event)"> 6:00 </span></td>
              <td :class="classHour(7)"><span @click="choiceHour(7, $event)"> 7:00 </span></td>
          </tr>
          <tr>
              <td :class="classHour(8)"><span @click="choiceHour(8, $event)"> 8:00 </span></td>
              <td :class="classHour(9)"><span @click="choiceHour(9, $event)"> 9:00 </span></td>
              <td :class="classHour(10)"><span @click="choiceHour(10, $event)"> 10:00 </span></td>
              <td :class="classHour(11)"><span @click="choiceHour(11, $event)"> 11:00 </span></td>
          </tr>
          <tr>
              <td :class="classHour(12)"><span @click="choiceHour(12, $event)"> 12:00 </span></td>
              <td :class="classHour(13)"><span @click="choiceHour(13, $event)"> 13:00 </span></td>
              <td :class="classHour(14)"><span @click="choiceHour(14, $event)"> 14:00 </span></td>
              <td :class="classHour(15)"><span @click="choiceHour(15, $event)"> 15:00 </span></td>
          </tr>
          <tr>
              <td :class="classHour(16)"><span @click="choiceHour(16, $event)"> 16:00 </span></td>
              <td :class="classHour(17)"><span @click="choiceHour(17, $event)"> 17:00 </span></td>
              <td :class="classHour(18)"><span @click="choiceHour(18, $event)"> 18:00 </span></td>
              <td :class="classHour(19)"><span @click="choiceHour(19, $event)"> 19:00 </span></td>
          </tr>
          <tr>
              <td :class="classHour(20)"><span @click="choiceHour(20, $event)"> 20:00 </span></td>
              <td :class="classHour(21)"><span @click="choiceHour(21, $event)"> 21:00 </span></td>
              <td :class="classHour(22)"><span @click="choiceHour(22, $event)"> 22:00 </span></td>
              <td :class="classHour(23)"><span @click="choiceHour(23, $event)"> 23:00 </span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--分钟选择-->
    <div class="vue-datepicker-panel" v-show="minutePanelIsShow">
      <div class="vue-datepicker-month">
        <a class="vue-datepicker-prev" @click="prevHour"> &lt; </a>
        <span class="vue-datepicker-btn" @click="startChoiceHour">{{ year }}年 {{ month }}月 {{day}}日 {{hour}}时</span>
        <a class="vue-datepicker-next" @click="nextHour"> &gt; </a>
      </div>
      <table class="vue-datepicker-tb2">
        <tbody>
            <thead></thead>
          <tr>
             <td :class="classMinute(0)"><span @click="choiceMinute(0, $event)"> 00 </span></td>
             <td :class="classMinute(5)"><span @click="choiceMinute(5, $event)"> 05 </span></td>
             <td :class="classMinute(10)"><span @click="choiceMinute(10, $event)"> 10 </span></td>
             <td :class="classMinute(15)"><span @click="choiceMinute(15, $event)"> 15 </span></td>
          </tr>
          <tr>
              <td :class="classMinute(20)"><span @click="choiceMinute(20, $event)"> 20 </span></td>
              <td :class="classMinute(25)"><span @click="choiceMinute(25, $event)"> 25 </span></td>
              <td :class="classMinute(30)"><span @click="choiceMinute(30, $event)"> 30 </span></td>
              <td :class="classMinute(35)"><span @click="choiceMinute(35, $event)"> 35 </span></td>
          </tr>
          <tr>
              <td :class="classMinute(40)"><span @click="choiceMinute(40, $event)"> 40 </span></td>
              <td :class="classMinute(45)"><span @click="choiceMinute(45, $event)"> 45 </span></td>
              <td :class="classMinute(50)"><span @click="choiceMinute(50, $event)"> 50 </span></td>
              <td :class="classMinute(55)"><span @click="choiceMinute(55, $event)"> 55 </span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: '',
      twoWay: true
    },
    maxdate:{
      type: String,
      default: ''
    },
    mindate:{
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'yyyy-mm-dd'
    },
    placeholder: {
      type: String,
      default: ''
    },
    type:{
      type: String,
      default: 'minute' //minute表示选择到分钟,hour表示选择到小时,day表示选择到天,month表示选择到月
    },
    conf: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    let {
      value,
      conf
    } = this,
    dateObj, year, month, day, hour, minute, second,
    langConf = {
      week: ['日', '一', '二', '三', '四', '五', '六'],
      month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    if (value) {
      dateObj = new Date(value.replace(/-/g, "/"));
    } else {
      dateObj = new Date();
    }
    if (conf) {
      langConf = Object.assign(langConf, conf);
    }
    year = dateObj.getFullYear();
    month = dateObj.getMonth()+1;
    day = dateObj.getDate();
    hour = dateObj.getHours();
    minute = dateObj.getMinutes();
    second = dateObj.getSeconds();

    return {
      langConf,
      dayPanelIsShow: false,
      monthPanelIsShow: false,
      hourPanelIsShow:false,
      minutePanelIsShow:false,
      isMouseOver: false,
      iconClass:'el-icon-date',
      year,
      month,
      day,
      hour,
      minute,
      second
    };
  },
  mounted: function() {
      let that = this;
      document.body.addEventListener("click",function(){
          that.immEndChoice();
      });
  },
  computed: {
    //	日期二维数组（3*4），渲染用
    monthArr() {
      let {
        month
      } = this.langConf,
        res = [];
      for (let i = 0; i <= 3; i++) {
        let temp = [];
        for (let j = 1; j <= 3; j++) {
          let id = i * 3 + j - 1;
          temp.push({
            id,
            name: month[id]
          });
        }
        res.push(temp);
      }
      return res;
    },
    // 当前日期
    curr() {
      let {
        value
      } = this,
      dateObj,
      year = "",
      month = "",
      day = "",
      hour = "",
      minute = "",
      second = "";
      if (value) {
          if (typeof value == 'number') {
              dateObj = new Date(value);
          } else {
              dateObj = new Date(value.replace(/-/g, "/"));
          }
      } else {
        dateObj = new Date();
      }
      year = dateObj.getFullYear();
      month = dateObj.getMonth()+1;
      day = dateObj.getDate();
      hour = dateObj.getHours();
      minute = dateObj.getMinutes();
      second = dateObj.getSeconds();
      return {
        year,
        month,
        day,
        hour,
        minute,
        second
      };
    },
    // 返回当前月的天数数组
    monthDays() {
      let {
        year,
        month
      } = this,
      dayNum;
      //month++;
      // 判断一个月有几天
      if (month == 2) {
        if (year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0)) {
          dayNum = 29;
        } else {
          dayNum = 28;
        }
      } else {
        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
          dayNum = 31;
        } else {
          dayNum = 30;
        }
      }
      // 生成对应星期的日期数组
      let firstDay = new Date(year, month - 1, 1).getDay(),
        dayArr = getDayArr(6, 7),
        row = 0,
        col = firstDay;
      for (let d = 1; d <= dayNum; d++) {
        dayArr[row][col] = d;
        if (col < 6) {
          col++;
        } else {
          col = 0;
          row++;
        }
      }

      return dayArr;
    },
    now() {
      let dateObj = new Date()
      let year = dateObj.getFullYear()
      let month = dateObj.getMonth()+1
      let day = dateObj.getDate()
      return {
        year,
        month,
        day
      };
    }
  },
  methods: {
      //点击文本框弹出日期选择
      startChoice(e) {
        if (e && e.type == 'keypress') {
          e.returnValue = false;
        }
        if (!this.dayPanelIsShow && !this.monthPanelIsShow && !this.hourPanelIsShow && !this.minutePanelIsShow) {
          switch (this.type) {
            case "month":
              this.startChoiceMonth();
              break;
            case "date":
            case "hour":
            case "minute":
              this.startChoiceDate();
              break;
            default:
              this.startChoiceDate();
          }
        }
      },
      illegal () {
        let target = event.target.parentNode;
        let className = target.getAttribute('class');
        return className.indexOf('z-invalid') != -1;
      },
      choiceMonth(m,event) {
        if(this.illegal(event)){
          return;
        }
        this.month = m+1;
        if(this.type == "month"){
          this.loadValue();
          return;
        }
        this.startChoiceDate();
      },
      choiceDay(d,event) {
        if(this.illegal(event)){
          return;
        }
        this.day = d;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        if(this.type == "day"){
          this.loadValue();
          return;
        }
        this.startChoiceHour();
      },
      choiceHour(h,event){
          if(this.illegal(event)){
            return;
          }
          this.hour = h;
          this.minute = 0;
          this.second = 0;
          if(this.type == "hour"){
            this.loadValue();
            return;
          }
          this.startChoiceMinute();
      },
      choiceMinute(M,event){
          if(this.illegal(event)){
            return;
          }
          this.minute = M;
          this.$emit('input', this.dateTimeFormat(this.year, this.month, this.day, this.hour, this.minute, 0));
          this.immEndChoice();

      },
      loadValue(){
        this.$emit('input', this.dateTimeFormat(this.year, this.month, this.day, this.hour, this.minute, this.second));
        this.immEndChoice();
      },
    // 年份+月份选择
    startChoiceMonth() {
      this.monthPanelIsShow = true;
      this.dayPanelIsShow = false;
      this.hourPanelIsShow = false;
      this.minutePanelIsShow = false;
    },
    startChoiceDate() {
      this.monthPanelIsShow = false;
      this.dayPanelIsShow = true;
      this.hourPanelIsShow = false;
      this.minutePanelIsShow = false;
    },
    startChoiceHour() {
      this.monthPanelIsShow = false;
      this.dayPanelIsShow = false;
      this.hourPanelIsShow = true;
      this.minutePanelIsShow = false;
    },
    startChoiceMinute() {
      this.monthPanelIsShow = false;
      this.dayPanelIsShow = false;
      this.hourPanelIsShow = false;
      this.minutePanelIsShow = true;
    },
    // 样式
    classMonth(m) {
      let that = this,
        {
          month,
          year,
          curr
        } = that;
      return {
        'z-on': m == (month-1) && curr.year == year,
        'z-existed': true,
        'z-invalid':this.getZinvalid({m:m})
      };
    },
    classDay(d) {
      let that = this,
        {
          month,
          year,
          curr
        } = that;
      return {
        'z-on': curr.day == d && curr.month == month && curr.year == year,
        'z-existed': d != '',
        'z-invalid':this.getZinvalid({d:d})
      };
    },
    classHour(h){
        let that = this,
          {
            month,
            year,
            day,
            curr
          } = that;
        return {
          'z-on': curr.hour == h && curr.day == day && curr.month == month && curr.year == year,
          'z-existed': true,
          'z-invalid':this.getZinvalid({h:h})
        };
    },
    classMinute(M){
        let that = this,
          {
            month,
            year,
            hour,
            day,
            curr
          } = that;
        return {
          'z-on': curr.minute == M && curr.hour == hour && curr.day == day && curr.month == month && curr.year == year,
          'z-existed': true,
          'z-invalid':this.getZinvalid({M:M})
        };
    },
    getZinvalid (options) {
      if(!this.maxdate && !this.mindate){
        return false;
      }
      let that = this,
        {
          year,
          month,
          day,
          hour,
          minute
        } = that;
      let regularMaxDate = "",
          regularMinDate = "",
          maxDateTime = null,
          minDateTime = null;
      if(this.maxdate  != null){
        regularMaxDate = this.maxdate.replace(/-/g, "/");
        maxDateTime = new Date(regularMaxDate).getTime();
      }
      if(this.mindate  != null){
        regularMinDate = this.mindate.replace(/-/g, "/");
        minDateTime = new Date(regularMinDate).getTime();
      }
      if(options.m != null){
        let currDate =  new Date();
        currDate.setFullYear(year);
        currDate.setMonth(options.m);
        if(!!this.maxdate){
          currDate.setDate(1);
          currDate.setHours(0);
          currDate.setMinutes(0);
          currDate.setSeconds(0);
          let currDateTime = new Date(currDate).getTime();
          if(currDateTime > maxDateTime){
            return true;
          }
        }
        if(!!this.mindate){
          let lastDate = new Date(year,options.m,0);
          currDate.setDate(lastDate.getDate());
          currDate.setHours(23);
          currDate.setMinutes(59);
          currDate.setSeconds(59);
          let currDateTime = new Date(currDate).getTime();
          if(currDateTime < minDateTime){
            return true;
          }
        }
      }
      if(options.d  != null){
        let currDate =  new Date();
        currDate.setFullYear(year);
        currDate.setMonth(month-1);
        currDate.setDate(options.d);
        if(!!this.maxdate){
          currDate.setHours(0);
          currDate.setMinutes(0);
          currDate.setSeconds(0);
          let currDateTime = new Date(currDate).getTime();
          if(currDateTime > maxDateTime){
            return true;
          }
        }
        if(!!this.mindate){
          currDate.setHours(23);
          currDate.setMinutes(59);
          currDate.setSeconds(59);
          let currDateTime = new Date(currDate).getTime();
          if(currDateTime < minDateTime){
            return true;
          }
        }
      }
      if(options.h != null){
        let currDate =  new Date();
        currDate.setFullYear(year);
        currDate.setMonth(month-1);
        currDate.setDate(day);
        currDate.setHours(options.h);
        if(!!this.maxdate){
          currDate.setMinutes(0);
          currDate.setSeconds(0);
          let currDateTime = new Date(currDate).getTime();
          if(currDateTime > maxDateTime){
            return true;
          }
        }
        if(!!this.mindate){
          currDate.setMinutes(59);
          currDate.setSeconds(59);
          let currDateTime = new Date(currDate).getTime();
          if(currDateTime < minDateTime){
            return true;
          }
        }
      }
      if(options.M  != null){
        let currDate =  new Date();
        currDate.setFullYear(year);
        currDate.setMonth(month-1);
        currDate.setDate(day);
        currDate.setHours(hour);
        currDate.setMinutes(options.M);
        currDate.setSeconds(0);
        let currDateTime = new Date(currDate).getTime();
        if(!!this.maxdate && currDateTime > maxDateTime){
          return true;
        }
        if(!!this.mindate && currDateTime < minDateTime){
          return true;
        }
      }
      return false;
    },
    //前一年
    prevYear() {
      this.year--;
    },
    //后一年
    nextYear() {
      this.year++;
    },
    //前一月
    prevMonth() {
      let {
        year,
        month
      } = this;
      if (month > 1) {
        this.month--;
      } else {
        this.year--;
        this.month = 12;
      }
    },
    //后一月
    nextMonth() {
      let {
        year,
        month
      } = this;
      if (month < 12) {
        this.month++;
      } else {
        this.year++;
        this.month = 1;
      }
    },
    prevDay(){
        this.addDate(-1);
    },
    nextDay(){
        this.addDate(1);
    },
    prevHour(){
        this.addHours(-1);
    },
    nextHour(){
        this.addHours(1);
    },
    //立即关闭日期面板
    immEndChoice() {
      this.isMouseOver = true;
      this.dayPanelIsShow = false;
      this.monthPanelIsShow = false;
      this.hourPanelIsShow = false;
      this.minutePanelIsShow = false;
    },
    //点击面板
    panelClick: function() {

    },
    //日期加减
    addDate:function(days){
       let date = this.year + "-" + this.month + "-" + this.day;
       let d = new Date(date.replace(/-/g, "/"));
       d.setDate(d.getDate()+days);
       this.year = d.getFullYear();
       this.month = d.getMonth()+1;
       this.day = d.getDate();
     },
     //时间加减
     addHours:function(hour){
        let date = this.year + "-" + this.month + "-" + this.day + " " + this.hour + ":" + this.minute + ":" + this.second;
        let d = new Date(date.replace(/-/g, "/"));
        d.setHours(d.getHours()+hour);
        this.year = d.getFullYear();
        this.month = d.getMonth()+1;
        this.day = d.getDate();
        this.hour = d.getHours();
    },
    //清除日期
    clearData: function() {
      this.$emit('input', "");
      this.iconClass = "el-icon-date";
    },
    //重置日期
    resetData: function() {
      if (!!this.value) {
        var dateObj = new Date(this.value.replace(/-/g, "/"))
        this.year = dateObj.getFullYear();
        this.month = dateObj.getMonth()+1;
        this.day = dateObj.getDate();
        this.hour = dateObj.getHours();
        this.minute = dateObj.getMinutes();
        this.second = dateObj.getSeconds();
      }
    },
    //日期时间格式化输出
    dateTimeFormat:function(y, M, d, h, m, s, fm) {
      if (!fm) {
        fm = 'yyyy-MM-dd hh:mm:ss';
      }
      M = ('0' + (parseInt(M))).slice(-2);
      d = ('0' + d).slice(-2);
      h = ('0' + h).slice(-2);
      m = ('0' + m).slice(-2);
      s = ('0' + s).slice(-2);
      return fm.replace('yyyy', y)
        .replace('YYYY', y)
        .replace('MM', M)
        .replace('dd', d)
        .replace('hh', h)
        .replace('mm', m)
        .replace('ss', s);
    },
    changeIconClose (type) {
      if(!!this.value && 'in'){
        this.iconClass = "el-icon-close";
      }
    },
    changeIconDate (type) {
      this.iconClass = "el-icon-date";
    }
  }
}

Array.prototype.includes = function(item) {
  var isExsit = false;
  var Len = this.length;
  for (var i = 0; i < Len; i++) {
    var arrItem = this[i];
    if (item == arrItem) {
      isExsit = true;
      break;
    }
  }
  return isExsit;
}

function getDayArr(l1, l2) {
  var mainArr = new Array();
  for (var i = 0; i < l1; i++) {
    var subArr = new Array();
    for (var j = 0; j < l2; j++) {
      subArr.push('');
    }
    mainArr.push(subArr);
  }
  return mainArr;
}




</script>

<style scoped>
@import '../../styles/zm-component/datepicker.css';

</style>
