<template>
    <div>
      <div class="content">
          <div v-if="userDetailDataPlus.length == 0" class="nodata">
            暂无数据
          </div>
          <div v-else class="writtenScore" v-for="(item,index) in userDetailDataPlus" :key="index">
            报名科目:{{ item.subject }}
            <img :src="item.filePath" alt="笔试相关图片" width="500">
          </div>
      </div>
    </div>
</template>
<script>
export default {
  props:{
    userDetailDataPlus:Array
  },
  methods:{
    transformDate(row, column) {
        return this.$DateTransform(row[column.property]);
    }
  }
}
</script>
<style scoped media="screen">
  .content{
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    margin: -20px;
    background-color: white;
  }
  .control{
    text-align: right;
    padding-top: 20px;
    margin-top: 20px;
    background-color: #f4f5f5;
  }
  .nodata{
    text-align: center;
  }
</style>
