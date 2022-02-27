<template>
  <div>
    <div class="content">
        <el-row>
          <el-col :span="4">申请离职时间</el-col>
          <el-col :span="20">
              <el-date-picker
                :editable="false"
                format="yyyy-MM-dd"
                v-model="options.applyTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">实际离职时间</el-col>
          <el-col :span="20">
              <el-date-picker
                :editable="false"
                format="yyyy-MM-dd"
                v-model="options.leaveTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">当前状态</el-col>
          <el-col :span="20">
              <el-select v-model="options.leaveState" placeholder="请选择">
                  <el-option label="试用期" :value="6"></el-option>
                  <el-option label="转正期" :value="7"></el-option>
                  <el-option label="实习期" :value="8"></el-option>
              </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">离职原因</el-col>
          <el-col :span="20">
              <el-select v-model="options.reason" placeholder="请选择">
                  <el-option label="主动离职" :value="27"></el-option>
                  <el-option label="被动离职" :value="28"></el-option>
              </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">备注</el-col>
          <el-col :span="20">
            <el-input type="textarea" :rows="2" v-model="options.mark" placeholder="请输入备注"></el-input>
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
import applicationDeparture from '../../api/action/applicationDeparture'

export default {
    data() {
        return {
            buttonState:false,
            options:{
                applyTime:null,
                leaveTime:null,
                leaveState:6,
                reason:27,
                mark:''
            }
        }
    },
    props:{
        currentID:null,
        type:null,
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
            Object.assign(this.options,{teaId:this.currentID});
            Object.assign(this.options,{type:this.type});
            applicationDeparture(this.options).then(data => {
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
              applyTime:null,
              leaveTime:null,
              leaveState:6,
              reason:27,
              mark:''
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
    .trainTopicContent{
        line-height: 30px;
    }
</style>
