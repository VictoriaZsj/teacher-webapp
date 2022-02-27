<template>
  <div @click="closeImg()" class="previewPanel">
    <img @click.stop="selectImg()" :src="path">
  </div>
</template>
<script>

export default {
    data() {
        return {
        }
    },
    props:{
        path:null,
    },
    methods:{
      selectImg () {

      },
      closeImg () {
        this.$emit("closePreviewImg");
      }
    },
    mounted() {
      let _this = this;
      if(!window.isAddEscHideImg){
        document.addEventListener("keyup",function(e){
              let code = e.charCode || e.keyCode;
      				if (code == 27) {//配置
                _this.$emit("closePreviewImg");
      				}
    		});
      }
      window.isAddEscHideImg = true;
    }
}
</script>
<style scoped>
    .previewPanel{
      position: fixed;
      top:0;
      left:0;
      right:0;
      bottom: 0;
      z-index: 9999;
      background-color: rgba(0,0,0,0.8);
    }
    .previewPanel img{
      max-width: 80%;
      max-height: 80%;
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
</style>
