<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="4">老师状态</el-col>
        <el-col :span="20">
            <el-select v-model="options.state" placeholder="请选择">
                <el-option v-for="(item,index) in optionData[type]" :key="index" :label="item.text" :value="item.value"></el-option>
                <!-- <el-option label="待预约" value="0"></el-option>
                <el-option label="待面试" value="1"></el-option>
                <el-option label="待二面" value="10"></el-option>
                <el-option label="面试缺席" value="11"></el-option>
                <el-option label="待培训预约" value="2"></el-option>
                <el-option label="待培训通知" value="20"></el-option>
                <el-option label="培训延期" value="21"></el-option>
                <el-option label="培训缺席" value="22"></el-option> -->
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
import modifyInterviewState from '../../api/action/modifyInterviewState'

export default {
    data() {
        return {
            buttonState:false,
            optionData:[
              [{value:0,text:'待预约'}, {value:1,text:'待面试'}, {value:10,text:'待二面'}, {value:11,text:'面试缺席'}, {value:2,text:'待预约培训'}, {value:20,text:'待培训通知'}, {value:21,text:'培训延期'}, {value:22,text:'培训缺席'}],
              [{value:0,text:'待预约'}, {value:1,text:'待面试'}, {value:10,text:'待二面'}, {value:11,text:'面试缺席'}, {value:2,text:'待预约培训'}, {value:20,text:'待培训通知'}, {value:21,text:'培训延期'}, {value:22,text:'培训缺席'}, {value:3,text:'待入库'}, {value:30,text:'待offer'}, {value:4,text:'待入职'}],
              [{value:0,text:'待预约'}, {value:1,text:'待面试'}, {value:10,text:'待二面'}, {value:11,text:'面试缺席'}, {value:2,text:'待预约培训'}, {value:20,text:'待培训通知'}, {value:21,text:'培训延期'}, {value:22,text:'培训缺席'}, {value:3,text:'待入库'}, {value:30,text:'待offer'}, {value:4,text:'待入职'},{ value:5,text:'待转正'}, {value:40,text:'已转正'}, {value:6,text:'已离职'}, {value:50,text:'已淘汰'}],
              [{value:0,text:'待预约'}, {value:1,text:'待面试'}, {value:10,text:'待二面'}, {value:11,text:'面试缺席'}, {value:2,text:'待预约培训'}, {value:20,text:'待培训通知'}, {value:21,text:'培训延期'}, {value:22,text:'培训缺席'}, {value:3,text:'待入库'}, {value:30,text:'待offer'}, {value:4,text:'待入职'},{ value:5,text:'待转正'}, {value:40,text:'已转正'}, {value:6,text:'已离职'}, {value:50,text:'已淘汰'}],
              [{value:0,text:'待预约'}, {value:1,text:'待面试'}, {value:10,text:'待二面'}, {value:11,text:'面试缺席'}, {value:2,text:'待预约培训'}, {value:20,text:'待培训通知'}, {value:21,text:'培训延期'}, {value:22,text:'培训缺席'}, {value:3,text:'待入库'}, {value:30,text:'待offer'}, {value:4,text:'待入职'},{ value:5,text:'待转正'}, {value:40,text:'已转正'}, {value:6,text:'已离职'}, {value:50,text:'已淘汰'}],
              [{value:0,text:'待预约'}, {value:1,text:'待面试'}, {value:10,text:'待二面'}, {value:11,text:'面试缺席'}, {value:2,text:'待预约培训'}, {value:20,text:'待培训通知'}, {value:21,text:'培训延期'}, {value:22,text:'培训缺席'}, {value:3,text:'待入库'}, {value:30,text:'待offer'}, {value:4,text:'待入职'}],
            ],
            options:{
                state:0,
                remark:''
            }
        }
    },
    props:{
        currentID:null,
        type:null,//0表示面试模块 1表示培训模块 2表示试用期模块 3表示转正模块 4回收站 5表示入职模块
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
            if(window.isEmpty(this.type)){
              return;
            }
            this.buttonState = true;
            Object.assign(this.options,{teaIds:this.currentID});
            Object.assign(this.options,{type:this.type});

            modifyInterviewState(this.options).then(data => {
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
              state:0,
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
