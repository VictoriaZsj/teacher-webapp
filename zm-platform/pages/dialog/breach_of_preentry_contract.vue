<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">备注</el-col>
        <el-col :span="20">
          <el-input type="textarea" :rows="6" v-model="options.remark" placeholder="请输入备注"></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>

import multiStandUpTryOut from '../../api/action/multiStandUpTryOut'

export default {
    data() {
        return {
            buttonState:false,
            options:{
                remark:''
            }
        }
    },
    props:{
        currentID:null,
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }
      }
    },
    methods:{
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
            this.buttonState = true;
            Object.assign(this.options,{teaIds:[].concat(this.currentID)});
            multiStandUpTryOut(this.options).then(data => {
                this.$emit("confirm");
                this.default();
            }).catch(message => {
                this.$Message({
                    message: message
                });
                this.buttonState = false;
            });
        },
        default () {
          this.options = {
              remark:''
          };
          this.buttonState = false;
        }
    }
}
</script>
<style scoped>
    .content{
      max-height: 400px;
      overflow-y: auto;
    }
    .control{
      text-align: right;
      padding-top: 20px;
      background-color: white;
    }
    .el-row{
        padding: 10px;
    }
    .el-row div:first-child{
        line-height: 30px;
    }
    .el-row:after{
        content: '';
        display: table;
        clear: both;
    }
</style>
