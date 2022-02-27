<template>
  <div>
    <div class="content">
      <el-row >
        <el-col :span="4">跑单原因</el-col>
        <el-col :span="20">
            <el-select v-model="options.reason" placeholder="请选择">
                <el-option value="20" label="个人介绍不通过"></el-option>
            </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">备注</el-col>
        <el-col :span="20">
          <el-input type="textarea" :rows="2" v-model="options.remark" placeholder="请输入备注"></el-input>
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

import multiStandUp from '../../api/action/multiStandUp'
import oneStandUp from '../../api/action/oneStandUp'

export default {
    data() {
        return {
            buttonState:false,
            options:{
                reason:'20',
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
            if(Object.prototype.toString.call(this.currentID) === '[object Array]'){
                Object.assign(this.options,{teaIds:this.currentID});
                multiStandUp(this.options).then(data => {
                    this.$emit("confirm");
                    this.default();
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                    this.buttonState = false;
                });
            }else{
                Object.assign(this.options,{teaId:this.currentID});
                oneStandUp(this.options).then(data => {
                    this.$emit("confirm");
                    this.default();
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                    this.buttonState = false;
                });
            }
        },
        default () {
          this.options = {
              reason:'20',
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
