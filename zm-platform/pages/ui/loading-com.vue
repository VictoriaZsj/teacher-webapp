<!--导出提醒-->
<template>
  <div>
    <div v-if="progressState" class="dataLoading ">
      <div class="rollPanel">
        <div class="roll">
        </div>
        <div class="rollText">数据请求中...</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data () {
      return {
        progressState: false
      }
    },
}
</script>
<style scoped>
.dataLoading{
  position: fixed;
  top:0;
  left:0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.3);
  z-index: 9999;
  color: white;
}
.rollPanel{
  position: absolute;
  width: 60px;
  height: 100px;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
}
.roll{
  width: 60px;
  height: 60px;
  border-radius: 50px;
  border: 1px solid white;
  border-top-width: 0px;
  animation: rotate .5s linear infinite;
}
.rollText{
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  white-space: nowrap;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
