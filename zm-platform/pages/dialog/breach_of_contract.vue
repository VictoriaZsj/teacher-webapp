<template>
  <div>
    <div class="content">
        <el-row>
          <el-col :span="4">跑单至</el-col>
          <el-col :span="20">
              <el-select v-model="options.standUpToType" placeholder="请选择">
                  <el-option value="102" label="回收站" ></el-option>
                  <el-option value="105" label="小班课流程" ></el-option>
              </el-select>
          </el-col>
        </el-row>
      <el-row v-show="options.standUpToType == 102">
        <el-col :span="4">跑单原因</el-col>
        <el-col :span="20">
            <el-select v-model="options.reason" placeholder="请选择">
                <el-option value="1" label="入职时间"></el-option>
                <el-option value="2" label="毕业时间"></el-option>
                <el-option value="3" label="职业发展"></el-option>
                <el-option value="4" label="找兼职"></el-option>
                <el-option value="5" label="科目不符"></el-option>
                <el-option value="6" label="学历不符"></el-option>
                <el-option value="7" label="主动放弃"></el-option>
                <el-option value="8" label="无法联系"></el-option>
                <el-option value="10" label="其他"></el-option>
                <el-option value="11" label="兼职1"></el-option>
                <el-option value="12" label="兼职2"></el-option>
                <el-option value="13" label="预约面试跑单"></el-option>
                <el-option value="14" label="面试不通过"></el-option>
                <el-option value="15" label="预约培训跑单"></el-option>
                <el-option value="16" label="培训不通过"></el-option>
                <el-option value="17" label="怀孕"></el-option>
            </el-select>
        </el-col>
      </el-row>
      <el-row v-show="options.standUpToType == 105">
        <el-col :span="4">小班课年级</el-col>
        <el-col :span="20">
            <el-select v-model="options.smallGrade" placeholder="请选择">
                <el-option value="小二" label="小二"></el-option>
                <el-option value="小三" label="小三"></el-option>
            </el-select>
        </el-col>
      </el-row>
      <el-row v-show="options.standUpToType == 105">
        <el-col :span="4">小班课科目</el-col>
        <el-col :span="20">
            <el-select v-model="options.smallSubject" placeholder="请选择">
                <el-option value="语文" label="语文"></el-option>
                <el-option value="英文" label="英文"></el-option>
                <el-option value="奥数" label="奥数"></el-option>
            </el-select>
        </el-col>
      </el-row>
      <el-row v-show="options.standUpToType == 105">
        <el-col :span="4">小班课求职类型</el-col>
        <el-col :span="20">
            <el-select v-model="options.timeType" placeholder="请选择">
                <el-option value="0" label="兼职"></el-option>
                <el-option value="1" label="全职"></el-option>
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

import batchStandUp from '../../api/action/batchStandUp'
import standUp from '../../api/action/standUp'

export default {
    data() {
        return {
            buttonState:false,
            options:{
                reason:'1',
                smallGrade:'小二',
                smallSubject:'语文',
                timeType:'0',
                standUpToType:'102',
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
                Object.assign(this.options,{teacherIds:this.currentID});
                batchStandUp(this.options).then(data => {
                    this.$emit("confirm");
                    this.default();
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                    this.buttonState = false;
                });
            }else{
                Object.assign(this.options,{teacherId:this.currentID});
                standUp(this.options).then(data => {
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
              reason:'1',
              smallGrade:'小二',
              smallSubject:'语文',
              timeType:'0',
              standUpToType:'102',
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
