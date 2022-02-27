<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">转正结果</el-col>
        <el-col :span="20">
            <el-select v-model="options.state" placeholder="请选择">
                <el-option label="转正" :value="1"></el-option>
                <el-option label="延期" :value="0"></el-option>
            </el-select>
        </el-col>
      </el-row>
      <el-row v-if="options.state">
        <el-col :span="4">转正时间</el-col>
        <el-col :span="20">
          <el-date-picker
            v-model="options.trunRegularTime"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>

      <el-row v-if="options.state">
        <el-col :span="4">是否缴纳社保</el-col>
        <el-col :span="20">
          <el-select v-model="options.socialSecurity" placeholder="请选择">
            <el-option label="请选择" value=''></el-option>
            <el-option label="是" value=1></el-option>
            <el-option label="否" value=0></el-option>
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
import changeToRegular from '../../api/action/changeToRegular'

export default {
    data() {
      return {
        buttonState:false,
        options:{
          state:1,
          mark:'',
          trunRegularTime: '',
          socialSecurity: ''
        }
      }
    },
    props:{
      currentID: null,
      viewState: false//false表示页面关闭，true表示页面展开
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
        if (!this.options.trunRegularTime && this.options.state) {
          this.$Message({
            type: 'warning',
            message: '请选择转正日期'
          })
          return
        }

        if (!this.options.socialSecurity && this.options.state) {
          this.$Message({
            type: 'warning',
            message: '请选择是否缴纳社保'
          })
          return
        }

        this.buttonState = true;
        if (this.options.trunRegularTime) this.options.trunRegularTime = this.timeFormate(this.options.trunRegularTime)
        Object.assign(this.options,{teaIds: [...this.currentID]});
        changeToRegular(this.options).then(data => {
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
          state:1,
          mark:'',
          trunRegularTime: '',
          socialSecurity: ''
        };
        this.buttonState = false;
      },
      /**
     * 日期格式化
     */
    timeFormate(time) {
      let param = new Date(time).getTime()
      return this.$DateTool.format(param,'yyyy-MM-dd')
    },
    /**
     * 默认当前日期
     */
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
