<template>
    <div class="panel">
        <div class="progress">
            <div id="current" class="current" :style="{width:wid+'px'}">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                wid:0
            };
        },
        props:{
            rate: {
                type:Number,
                default:0
            }
        },
        watch:{
            rate(val){
                this.width = val * 200;
            }
        }
    };
</script>
<style scoped lang="less">
    .panel{
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom: 0;
        z-index: 2001;
        background-color: rgba(0,0,0,0.8);
    }
    .progress{
      width: 200px;
      height: 40px;
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      background-color: red;
    }
    .current{
      width: 0px;
      height: 100px;
      background-color: blue;
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
@keyframes rotate {
    0%{
      transform:rotate(0deg);
    }
    100%{
      transform:rotate(360deg);
    }
}
</style>
