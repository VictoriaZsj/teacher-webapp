<template>
  <transition name="fade">
    <div @click="cancel" v-show="show" class="preview-back">
      <transition name="fade-content">
        <div v-show="show" class="preview-content">
          <img :src="imgPath" alt="">
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'time-remark',
    props: {
      show:{
        type:Boolean,
        default:false
      },
      imgPath: {
        type:String,
        default:""
      }
    },
    methods:{
      stop(){

      },
      cancel(){
        this.$emit("close")
      }
    }
  }
</script>

<style lang="less" scoped>
  .preview-back{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 3000;
    background-color: rgba(0,0,0,0.5);
  }
  .preview-content{
    width: 500px;
    height: 90%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .preview-content img{
    max-height: 100%;
    max-width: 100%;
  }

  .fade-content-enter-active{
    animation:fade-content-enter ease .2s;
  }
  .fade-content-leave-active{
    animation:fade-content-leave ease .2s;
  }
  .fade-enter-active{
    animation:dialog-enter ease .3s;
  }
  .fade-leave-active{
    animation:dialog-leave ease .3s;
  }
  @keyframes fade-content-enter {
    from {
      transform: translate(-50%,-90%);
    }
    to {
      transform: translate(-50%,-70%);
    }
  }
  @keyframes fade-content-leave {
    from {
      transform: translate(-50%,-70%);
    }
    to {
      transform: translate(-50%,-90%);
    }
  }

  @keyframes dialog-enter {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes dialog-leave {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
