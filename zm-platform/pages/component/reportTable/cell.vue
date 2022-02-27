<template>
  <div class="cell-wrapper">
    <div class="cell-left">年级</div>
    <div class="cell-right">科目</div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped lang="less">
  .cell-wrapper{
    width: 120px;
    height: 100px;
    box-sizing:border-box;
    background-color:#e5e5e5;
    position: relative;
    vertical-align: middle;
    display: inline-block;
    .cell-left{
        content: "";
        position: absolute;
        left: 1px;
        top: 0;
        right: 0;
        bottom: 0;
        clip-path: polygon(0 0, 0 120px, 120px 50px, 0 0);
        -webkit-clip-path: polygon(0 0, 0 120px, 119px 100px, 0 1px);
        background: #fff;
        line-height: 131px;
        text-align: left;
        box-sizing: border-box;
        padding-left: 24px;
    }
    .cell-right{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        clip-path: polygon(120px 49px, 120px 0, 1px 0, 120px 49px);
        -webkit-clip-path: polygon(120px 99px, 120px 0, 1px 0, 120px 99px);
        background: #fff;
        line-height: 64px;
        text-align: right;
        box-sizing: border-box;
        padding-right: 24px;
    }
  }
</style>