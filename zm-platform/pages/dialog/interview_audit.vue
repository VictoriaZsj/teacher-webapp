<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="16">
          <video src="../../../src/assets/test.mp4" controls="controls" controlsList="nodownload" class="interview-vedio"></video>
        </el-col>
        <el-col :span="8">
          <el-form :inline="true">
            <el-form-item label="授课风格">
                <el-select v-model="options.teaBu" placeholder="请选择">
                    <el-option label="亲切" value="1"></el-option>
                    <el-option label="正常" value="2"></el-option>
                    <el-option label="严肃" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="面试评价">
                <el-select v-model="options.teaBu" placeholder="请选择">
                    <el-option label="特别优秀" value="1"></el-option>
                    <el-option label="优秀" value="2"></el-option>
                    <el-option label="一般" value="3"></el-option>
                    <el-option label="较差" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年级偏好">
                <el-select v-model="options.teaBu" placeholder="请选择">
                    <el-option label="特别优秀" value="1"></el-option>
                    <el-option label="优秀" value="2"></el-option>
                    <el-option label="一般" value="3"></el-option>
                    <el-option label="较差" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="教师备注">
              <el-input
                placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item label="面试结果">
                <el-select v-model="options.teaBu" placeholder="请选择">
                    <el-option label="面试通过" value="1"></el-option>
                    <el-option label="面试不通过" value="2"></el-option>
                    <el-option label="待二面" value="3"></el-option>
                </el-select>
            </el-form-item>

          </el-form>
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

export default {
    data() {
        return {
            buttonState:false,
            options:{
              teaBu:'',//授课风格
              teaBu:'',//面试评价
              teaBu:'',//年级偏好
              teaBu:'',//备注
              teaBu:''//面试结果
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

        },
        default () {

          this.buttonState = false;
        }
    }
}
</script>
<style scoped>
  video::-internal-media-controls-download-button {
    display:none;
  }
  video::-webkit-media-controls-enclosure {
    overflow:hidden;
  }
  video::-webkit-media-controls-panel {
    width: calc(100% + 30px);
  }
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
    .interview-vedio{
      width: 100%;
      height: 250px;
    }
</style>
