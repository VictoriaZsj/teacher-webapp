<template>
  <div class="content">
    <el-table :data="historyRecord" style="width:100%">
      <el-table-column align="center" label="姓名" width="200">
        <template scope="{row = {}}">
          <p>姓名 {{row.name | noRecordFilter}}</p>
          <p>手机号： {{row.moblie | noRecordFilter}}</p>
          <p>身份证号码：{{ row.idcard | noRecordFilter }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="面试" width="300">
        <template scope="{row = {}}">
          <p>{{ row.interviewTime}}</p>
          <p>面试结果：{{ row.interviewResult | noRecordFilter}}</p>
          <p>面试详情：<span v-if="!!row.interviewEvaluateJson" @click="showDetails(row.interviewEvaluateJson)" class="detailsBtn">详情</span></p>
          <p>面试备注：{{ row.interviewRemark | noRecordFilter}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="培训" width="300">
        <template scope="{row = {}}">
          <p>{{ row.trainTime }}</p>
          <p>培训结果：{{ row.trainResult | noRecordFilter}}</p>
          <p>未通过原因：{{ row.trainResultReason | noRecordFilter}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="进入回收站">
        <template scope="{row = {}}">
          <p>进入回收站原因：{{ row.recycleReason | noRecordFilter }}</p>
          <p>进入回收站所处阶段：{{ row.recyclePreviou | noRecordFilter }}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    historyRecord: {
      type: Array,
      default: []
    }
  },
  methods: {
    transformDate(row, column) {
      return this.$DateTransform(row[column.property])
    },
    showDetails(data) {
      this.$root.$children[0].showInterviewDetails(data)
    }
  },
  filters: {
    noRecordFilter(value) {
      if (value) return value
      return '暂无记录'
    }
  }
}
</script>

<style scoped media="screen">
.content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  margin: -20px;
  background-color: white;
}
.detailsBtn{
  cursor: pointer;
  color: #06C;
}
</style>
