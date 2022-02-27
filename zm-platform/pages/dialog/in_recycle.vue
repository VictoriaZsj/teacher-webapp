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
import multiStandUpRegular from '../../api/action/multiStandUpRegular'

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
          value:'30',
          label:'违纪'
        }];
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
          this.buttonState = true;
          Object.assign(this.options,{teaIds:[].concat(this.currentID)});
          multiStandUpRegular(this.options).then(data => {
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
