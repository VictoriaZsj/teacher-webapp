<template>
  <div>
    <div class="content">
      <el-form label-position="left" label-width="120px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="options.state">
            <el-radio  :label="2">通过</el-radio>
            <el-radio  :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="options.desc" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <br>
      <br>
        历次审核结果:
      <br>
      <br>
      <table v-if="auditData.length > 0" class="auditTabel">
        <thead>
          <th width="150px">审核时间</th>
          <th width="100px">审核人</th>
          <th width="100px">审核结果</th>
          <th>备注</th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in auditData">
            <td>{{item.createdAt}}</td>
            <td>{{item.reviewer}}</td>
            <td>{{item.checkStateStr}}</td>
            <td>{{item.reviewMark}}</td>
          </tr>
        </tbody>
      </table>
      <div v-else style="text-align:center;">暂无数据</div>

    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>

import reviewTeaPersonalInfo from '../../api/action/reviewTeaPersonalInfo'

export default {
  data() {
    return {
        buttonState:false,
        options:{
            state:2,
            desc:''
        }
    }
  },
  filters:{
    stateFilter (val) {
      if(val == 2){
        return "通过";
      }
      if(val == 3){
        return "不通过";
      }
    }
  },
  props:{
    auditData:Array,
    currentID:null,
    teaCheckState:null,
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
    cancel(){
      this.$emit("cancel");
    },
    confirm () {
      if(this.teaCheckState == null){
        this.$Message({
            message: "该教师状态未知,无法进行审核操作"
        });
        return;
      }
      if(this.teaCheckState == 0){
        this.$Message({
            message: "请提交资料"
        });
        return;
      }
        if(this.teaCheckState == 2){
          this.$Message({
              message: "该教师已经是审核通过状态,无需审核"
          });
          return;
        }
        if(this.teaCheckState == 3){
          this.$Message({
              message: "该教师已经是审核不通过状态,无需审核"
          });
          return;
        }
        this.buttonState = true;
        Object.assign(this.options,{teaId:this.currentID});
        reviewTeaPersonalInfo(this.options).then(data => {
            console.log(data);
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
          state:2,
          desc:''
      }
      this.buttonState = false;
    }
  },
  mounted:function(){
  }
}
</script>
<style scoped media="screen">
  .content{
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    margin: -20px;
  }
  .control{
    text-align: right;
    padding-top: 20px;
    background-color: white;
  }
  .el-form-item .logo{
    width: 100px;
    height: 150px;
  }
  .auditTabel{
      width: 100%;
      text-align: center;
  }
</style>
