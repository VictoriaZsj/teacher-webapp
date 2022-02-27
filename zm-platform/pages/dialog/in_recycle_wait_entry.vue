<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">原因</el-col>
        <el-col :span="20">
            <el-select v-model="options.reason" placeholder="请选择">
                <el-option v-for="(item,index) in reasonData" :key="index" :label="item.label" :value="item.value"></el-option>
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

import newEntryMultiStandUp from '../../api/action/newEntryMultiStandUp'
import newEntryOneStandUp from '../../api/action/newEntryOneStandUp'

export default {
    data() {
        return {
            buttonState:false,
            options:{
              reason:'',
              remark:''
            }
        }
    },
    props:{
        currentID:null,
        mode:null,
        type:null,
        viewState:false//false表示页面关闭，true表示页面展开
    },
    computed:{
      reasonData(){
        return [{
          value:'2401',
          label:'入职资料审核不通过'
        },{
          value:'2402',
          label:'监课考核不通过'
        }]
      }
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
          this.$MessageBox.confirm("确定要跑单吗？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.buttonState = true;
            if(Object.prototype.toString.call(this.currentID) === '[object Array]'){
                Object.assign(this.options,{teaIds:this.currentID});
                newEntryMultiStandUp(this.options).then(data => {
                  this.default();
                  this.$Message({
                      message: "操作成功"
                  });
                  this.$emit("confirm");
                }).catch(message => {
                  this.buttonState = false;
                  this.$Message({
                      message: message
                  });
                });
            }else{
                Object.assign(this.options,{teaId:this.currentID});
                newEntryOneStandUp(this.options).then(data => {
                  this.default();
                  this.$emit("confirm");
                }).catch(message => {
                  this.buttonState = false;
                  this.$Message({
                      message: message
                  });
                });
            }
          }).catch(message => {

          });


        },
        default () {
          this.options = {
            reason:30,
            remark:''
          }
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
    .trainTopicContent{
        line-height: 30px;
    }
</style>
