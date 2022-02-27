<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border>
      <el-table-column 
        v-for="(item,index) in tableTitle"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  const tableTitle = [
    {prop: "channelActivityName", label: "渠道活动名称", width: "", align: 'center'},
    {prop: "rewardDistributeStatus", label: "奖励发放状态", width: "", align: 'center'},
  ]
  export default {
    name: 'connectedActivities',
    props: ['tableData'],
    data() {
      return {
        tableTitle: [...tableTitle],
      }
    },
  }
</script>

<style lang="less" scoped>

</style>