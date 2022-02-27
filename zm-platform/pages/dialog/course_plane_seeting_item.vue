<template>
  <el-row>
    <el-col :span="7">
      <el-select v-model="courseTimeData.weekNum" placeholder="请选择日期">
          <el-option label="周一" :value="1"></el-option>
          <el-option label="周二" :value="2"></el-option>
          <el-option label="周三" :value="3"></el-option>
          <el-option label="周四" :value="4"></el-option>
          <el-option label="周五" :value="5"></el-option>
          <el-option label="周六" :value="6"></el-option>
          <el-option label="周日" :value="7"></el-option>
      </el-select>
    </el-col>
    <el-col :span="7">
      <el-time-select
          :editable="false"
          v-model="courseTimeData.startTime"
          :picker-options="{
            start: '08:00',
            step: '01:00',
            end: '12:00'
          }"
          placeholder="选择时间">
      </el-time-select>
    </el-col>
    <el-col :span="7">
      <el-time-select
          :editable="false"
          v-model="courseTimeData.endTime"
          :picker-options="{
            start: '18:00',
            step: '01:00',
            end: '22:00'
          }"
          placeholder="选择时间">
      </el-time-select>
    </el-col>
    <el-col :span="3">
        <i @click="itemControl" v-if="index == 0" class="el-icon-plus course-setting-item-icon"></i>
        <i @click="itemControl" v-else class="el-icon-minus course-setting-item-icon"></i>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props:{
    courseTimeData:Object,
    index:Number,
    currentID:null,
    viewState:false//false表示页面关闭，true表示页面展开
  },
  methods:{
    itemControl () {
        this.$emit("itemControl",this.index);
    }
  }
}
</script>
<style scoped>
    .el-row{
        padding: 0 0 5px 0 !important;
    }
    .el-row > div{
        padding: 0 5px 0 0;
    }
    .course-setting-item-icon{
        line-height: 30px;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .el-date-editor.el-input{
        width:100% !important;
    }
</style>
