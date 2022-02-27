<style scoped>
  .dami-pwd-input{
    display: inline-block;
    position: relative;
    width: 60%;
  }
  .dami-pwd-input input{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #ededed;
    box-sizing: border-box;
    color: #808080;
    font-size: 12px;
    height: 30px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    padding-right: 30px;
  }
  .dami-pwd-input img{
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    right: 5px;
    top:50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

</style>

<template>
  <div class="dami-pwd-input">
    <input :type="inputType" :disabled="disabled" :value="value" @input="$emit('input', $event.target.value)" placeholder="输入邮箱账号对应密码">
    <span @click="changeInputType"></span>
    <img @click="changeInputType" :src="viewImgPath">
  </div>
</template>

<script>
  let showImg = require('./show.png');
  let hideImg = require('./hide.png');

  export default {
    name: 'pwdInput',
    data (){
      return{
        inputType:'password',//text
        viewImgPath:hideImg
      }
    },
    props:['value','show',"disabled"],
    watch:{
      show(){
        this.inputType = 'password';
        this.viewImgPath = hideImg;
      }
    },
    methods:{
      changeInputType(){
        if(this.inputType == 'text'){
          this.inputType = 'password';
          this.$emit('turnPassword')//加密
          this.viewImgPath = hideImg;
        }else{
          this.inputType = 'text';
          this.$emit('turnText')//解密
          this.viewImgPath = showImg;
        }
      }
    },
    mounted (){
    }
  }
</script>
