<template>
  <div>
    <div class="content">
      <el-form name="signFormRef" ref="signFormRef" :model="signForm" :rules="signFormRules" label-width="160px" class="offline-sign-form">
        <el-form-item label="入职时间：" prop="time">
          <el-date-picker
              v-model="signForm.time"
              type="date"
              placeholder="请选择">
            </el-date-picker>
        </el-form-item>
         <el-form-item label="签约类型" >
             <el-input v-model="signType" disabled style="width:50%"></el-input>
        </el-form-item>
         <el-form-item label="签约主体" >
             <el-input v-model="signBody" disabled style="width:50%"></el-input>
        </el-form-item>
         <el-form-item label="合同时长" >
             <el-input v-model="contractTime" disabled style="width:50%"></el-input>
        </el-form-item>
         <el-form-item label="上传电子版合同：" prop="settingList" class="mb-20" ref="settringRef">
          <span class="required-star">*</span>
          <upload-common :action="action" v-model="signForm.settingList" :limit="10" :uploadData="uploadData" @callback="callback" ref="uploadCommon" />
        </el-form-item>
       <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" :rows="2" v-model="signForm.remark"
          placeholder="请输入走线下合同的原因" :maxlength="500"></el-input>
        </el-form-item>
      </el-form>


    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirmOfflineSign" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
import uploadCommon from '../full_times_dir/common/uploadOfflineSign.vue';
import saveOfflineSign from '../../api/action/saveOfflineSign';
import fetch from '../../../src/utils/fetch'

export default {
  data() {
    return {
      data:{},
      buttonState:false,
      signForm: {
        time: '', // 入职时间
        remark: '',
        files: [], // 上传文件list
        teaId: '',
        settingList: []
      },
      signBody:'',
      signType:'',
      contractTime:'',
      uploadData: { // 上传电子版合同
        name: null,
        type: '10',
        teaId: ''
      },
      action:  '/api/teacher-web//api/newEntry/uploadOfflineContract',
      limit: {
          default: 5,
          type: Number
      },
      signFormRules: {
        time: [{type: 'date', required: true, message: "请选择入职时间", trigger: "blur"}],
        remark: [{required: true, message: "请输入走线下合同的原因", trigger: "change"}],
      },

    }
  },
  components: { uploadCommon },
  props:{
    currentID:null,
    viewState:false //false表示页面关闭，true表示页面展开
  },

  watch:{
    viewState (val) {
      if(!val){
          this.default();
      }else {
        this.init();
      }

    }
  },
  methods:{
    callback (list, res) {
      this.signForm.files = [];
      for(let i = 0; i < list.length; i++) {
        if (list[i].response && list[i].response.data.length) {
          let obj = list[i].response.data[0];
          this.signForm.files.push({
          fileId: obj.fileId,
          fileName: list[i].name,
          fileUrl:  obj.fileUrl
          });
        }
      }
    },
    cancel () {
        this.$emit("cancel");
    },
    // 线下签合同提交
    confirmOfflineSign () {
      if (!this.signForm.files.length) {
        this.$Message({
          message: "请上传电子版合同"
        });
        return;
      }
      this.signForm.teaId = this.currentID;
      let param = JSON.parse(JSON.stringify(this.signForm));
      // this.handle(param)
      param.time = new Date(param.time).getTime();
      this.buttonState = true;
      this.$refs['signFormRef'].validate(valid => {
        if (!valid) {
          return false;
        }
        saveOfflineSign(param).then(data => {
          this.buttonState = false;
          this.$Message({
              message: "线下合同签订成功"
          });
          setTimeout( () => {
            this.$emit("confirm");
            this.default();
          }, 1500);
        }).catch(message => {
          this.buttonState = false;
          this.$Message({
              message: message
          });
        });
      });
    },
    default () {
      this.signForm = {
        time: '', // 入职时间
        remark: '',
        files: [], // 上传文件list
        teaId: '',
        settingList: []
      };
      this.$refs.uploadCommon.resetFileList(); // 重新打开弹窗，重置已选中的filelist
    },
    init(){
      fetch({
          url: '/api/sign/signInfo',
          method: 'get',
          params:{
              signType:0,
              teaId:this.currentID
          },
          }).then((result) => {
              const data = result.data;
              const code = result.code;
              const message = result.message;
          if (code == 0) {
              this.data=data;
              this.signBody=data.signBodyDesc
              this.signType=data.signTypeDesc
              this.contractTime=data.contractTime
          }
          else {

          }
      })
      .catch((err) => {
          if (err) {
              console.log(err);
          }
          reject(err);
      });
    }
  },
  mounted(){
    this.init();
  }
}


</script>
<style scoped>
  .content{
    max-height: 400px;
  }
  .control{
    text-align: right;
    padding-top: 20px;
    background-color: white;
  }
  .el-form-item {
    height: 60px;
  }
  .mb-20 {
    margin-bottom: 20px;
    height: auto;
  }
  .required-star {
    color: #ff4949;
    margin-right: 4px;
    position: relative;
    left: -119px;
    float: left;
  }
</style>
