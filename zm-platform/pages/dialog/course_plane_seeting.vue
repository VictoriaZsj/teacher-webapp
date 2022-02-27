<template>
  <div>
    <div class="content">
      <Spin size="large" fix v-if="tableLoading"></Spin>

      <el-row v-if="!tableLoading">
        <el-col :span="4">排课设置</el-col>
        <el-col :span="20" style="line-height:30px;">
            <el-radio v-model="options.recommend" :label="1">建议排课</el-radio>
            <el-radio v-model="options.recommend" :label="0">不建议排课</el-radio>
        </el-col>
      </el-row>


      <el-row v-if="options.recommend == 1 && !tableLoading">
        <el-col :span="4">Offer通知</el-col>
        <el-col :span="6">
          <el-select v-model="options.offerNoticeFlag" placeholder="Offer通知">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row v-if="options.recommend == 1 && !tableLoading">
        <el-col :span="4">排课次数</el-col>
        <el-col :span="6">
          <el-input v-model="options.lessonCount" placeholder="请输入排课次数"></el-input>
        </el-col>
      </el-row>

      <el-row v-if="options.recommend == 1 && !tableLoading">
        <el-col :span="4">上班班次</el-col>
        <el-col :span="20">
          <course-plane-seeting-item v-for="(item,index) in options.timeListStr" :key="index" :course-time-data.sync="item" :index="index" @itemControl="itemControl"></course-plane-seeting-item>
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
import coursePlaneSeetingItem from './course_plane_seeting_item';
import arrangeConfig from '../../api/action/arrangeConfig'
import getArrangeConfigByTeaId from '../../api/select/getArrangeConfigByTeaId'

export default {
    data() {
        return {
            tableLoading:false,
            buttonState:false,
            options:{
                recommend:1,
                offerNoticeFlag:1,
                lessonCount:'10',
                timeListStr:[{
                    weekNum:1,
                    startTime:'08:00',
                    endTime:'22:00'
                },{
                    weekNum:2,
                    startTime:'08:00',
                    endTime:'22:00'
                },{
                    weekNum:3,
                    startTime:'08:00',
                    endTime:'22:00'
                },{
                    weekNum:4,
                    startTime:'08:00',
                    endTime:'22:00'
                },{
                    weekNum:5,
                    startTime:'08:00',
                    endTime:'22:00'
                },{
                    weekNum:6,
                    startTime:'08:00',
                    endTime:'22:00'
                },{
                    weekNum:7,
                    startTime:'08:00',
                    endTime:'22:00'
                }]
            }
        }
    },
    props:{
        currentID:null,
        type:null,
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      "options.recommend":function(val){
        if(val == "1"){
          this.default();
        }
      },
      viewState (val) {
        if(!val){
          this.default();
        }else{
          this.open();
        }
      }
    },
    mounted(){
      this.open();
    },
    methods:{
        itemControl (index) {
            if(index == 0){
                if(this.options.timeListStr.length == 7){
                  return;
                }
                this.options.timeListStr.push({
                    weekNum:'',
                    startTime:'',
                    endTime:''
                });
            }else{
                this.options.timeListStr.splice(index,1);
            }
        },
        open () {
          if(Object.prototype.toString.call(this.currentID) === '[object Array]' && this.currentID.length > 1){
            return;
          }
          let teaId = this.currentID;
          if(Object.prototype.toString.call(this.currentID) === '[object Array]' && this.currentID.length == 1){
              teaId = this.currentID[0];
          }
          this.tableLoading = true;
          let parm = {
            teaId:teaId,
            type:this.type
          }
          getArrangeConfigByTeaId(parm).then(data => {
            Object.assign(this.options,data);
            this.options.offerNoticeFlag = 1;
            this.tableLoading = false;
          }).catch(message => {
            this.$Message({
                message: message
            });
            this.options.lessonCount = '10';
            this.tableLoading = false;
          });
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
          this.buttonState = true;
          Object.assign(this.options,{teaIds:[].concat(this.currentID)});
          Object.assign(this.options,{type:this.type});
          arrangeConfig(this.options).then((data,message) => {
              this.$emit("confirm");
              this.default();
              if(!!data.message){
                this.$Message({
                    message: data.message
                });
              }
          }).catch(message => {
              this.$Message({
                  message: message
              });
              this.buttonState = false;
          });
        },
        default () {
          this.options = {
              recommend:1,
              offerNoticeFlag:1,
              lessonCount:'10',
              timeListStr:[{
                  weekNum:1,
                  startTime:'08:00',
                  endTime:'22:00'
              },{
                  weekNum:2,
                  startTime:'08:00',
                  endTime:'22:00'
              },{
                  weekNum:3,
                  startTime:'08:00',
                  endTime:'22:00'
              },{
                  weekNum:4,
                  startTime:'08:00',
                  endTime:'22:00'
              },{
                  weekNum:5,
                  startTime:'08:00',
                  endTime:'22:00'
              },{
                  weekNum:6,
                  startTime:'08:00',
                  endTime:'22:00'
              },{
                  weekNum:7,
                  startTime:'08:00',
                  endTime:'22:00'
              }]
          };
          this.buttonState = false;
        }
    },
    components:{
        'course-plane-seeting-item':coursePlaneSeetingItem
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
