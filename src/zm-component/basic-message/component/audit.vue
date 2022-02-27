<template>
  <transition name="slide-down">
    <div @click="cancel()" class="dialogBack">
        <div @click.stop="contentClick($event)" class="dialog-content">
          <div class="dialog-body">
            <el-form label-position="left" label-width="120px">
              <el-form-item label="审核结果"  style="width: 320px !important;">
                <el-select v-model="options.state" placeholder="请选择审核结果">
                  <el-option label="通过" :value="2" />
                  <el-option label="不通过" :value="3" />
                </el-select>

              </el-form-item>
              <el-form-item label="说明" style="width: 650px !important;">
                <el-input v-model="options.remark" type="textarea" ></el-input>
              </el-form-item>
            </el-form>
            <!-- <br>
            <br>
              <span style="font-size:14px;">历次审核结果:</span>
            <br>-->
            <br>
            <table v-if="!!auditData && auditData.length > 0" class="dialog-tabel">
              <thead>
                <th width="150px">操作时间</th>
                <th width="100px">审核人</th>
                <th width="100px">审核结果</th>
                <th>备注</th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in auditData">
                  <td>{{item.createdAt}}</td>
                  <td>{{item.reviewer}}</td>
                  <td>{{item.state | stateFilter}}</td>
                  <td>{{item.reviewMark}}</td>
                </tr>
              </tbody>
            </table>
            <div v-else style="text-align:center;font-size:14px;">暂无数据</div>

          </div>
          <div class="dialog-control">
            <el-button @click="cancel">取消</el-button>
            <el-button :loading="confirmState" @click="confirm" type="primary">审核</el-button>
          </div>
        </div>
    </div>
  </transition>
</template>
<script>

  import reviewTeaPersonalInfo from '../API/reviewTeaPersonalInfo'
  import getReviewList from '../API/getReviewList'


  export default {
    data() {
      return {
          confirmState:false,
          auditData:null,
          options:{
              state:2,
              remark:''
          },
          API:{
            reviewTeaPersonalInfo:null,
            getReviewList:null
          },
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
    props:[
      "tea-id",
      "auditing-introduce-info-permission",//个人介绍审核(权限)
      "review-tea-personal-info",
      "get-review-list",
      "audit-state"
    ],
    computed:{

    },
    methods:{
      cancel(){
        this.$emit("cancel");
      },
      contentClick(e){
        e.preventDefault();
      },
      apiSetting(){
        if(!!this.reviewTeaPersonalInfo){
          this.API.reviewTeaPersonalInfo = this.reviewTeaPersonalInfo;
        }else{
          this.API.reviewTeaPersonalInfo = reviewTeaPersonalInfo;
        }
        if(!!this.getReviewList){
          this.API.getReviewList = this.getReviewList;
        }else{
          this.API.getReviewList = getReviewList;
        }
      },
      getReviewData() {
        this.API.getReviewList({
          teaId: this.teaId
        }).then(data => {
          this.auditData = data;
        }).catch(message => {
          this.$Message({
            message
          });
        });
      },
      confirm () {
          if(!this.auditingIntroduceInfoPermission){
            this.$Message({
              message: "您暂时没有权限审核个人介绍"
            });
            return;
          }

          if((this.auditState + "") == "0"){
            this.$Message({
              message: "请提交个人资料"
            });
            return;
          }
          if((this.auditState + "") == "2"){
            this.$Message({
              message: "该教师已是审核通过状态,无需审核"
            });
            return;
          }
          if((this.auditState + "") == "3"){
            this.$Message({
              message: "该教师已是审核不通过状态,无需审核"
            });
            return;
          }


          this.confirmState = true;
          Object.assign(this.options,{teaId:this.teaId});

          this.API.reviewTeaPersonalInfo(this.options).then(data => {
              this.$Message({
                  message: "操作成功"
              });
              this.$emit("confirm" , Object.assign({}, this.options));
              this.default();
          }).catch(message => {
              this.$Message({
                  message: message
              });
              this.confirmState = false;
          });
      },
      default () {
        this.options = {
          state:2,
          remark:''
        }
        this.confirmState = false;
      }
    },
    mounted:function(){
      this.apiSetting();
      this.getReviewData();
    }
  }
</script>
