<style lang="less" scoped>
  .adv-item{
    position: relative;
  }
  .adv-item .icon-add{
    width: 10px;
    height: 10px;
    position: absolute;
    top:5px;
    right: 5px;
    font-size: 25px;
    cursor: pointer;
  }
  .adv-item .icon-del{
    width: 10px;
    height: 10px;
    position: absolute;
    top:5px;
    right: 20px;
    font-size: 25px;
    cursor: pointer;
  }
</style>

<template>
    <div class="full-time-container" v-if="permission">

        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">

            </div>
            <el-table :data="table_data" style="width:100%">
                <el-table-column prop="title" align="center" label="文字位置" >
                </el-table-column>
                <el-table-column prop="type" align="center" label="类型" >
                </el-table-column>
                <el-table-column prop="degreeStr" align="center" label="操作" >
                  <template scope="scope" >
                      <el-button size="small" @click="edit(scope.row.id)" type="text">配置</el-button>
                  </template>
                </el-table-column>
            </el-table>



            <!-- <el-dialog title="推荐攻略 - 攻略文字" v-model="strategyTextDialog" size="small" @close="cancelStrategyTextDialog">
              <el-form label-position="left" label-width="100px">
                  <el-form-item label="所在链接">
                    <el-select @change="strategyTextLinkChange" v-model="strategyText.linkid" placeholder="请选择活动链接">
                        <el-option v-for="(item,index) in agentLinkList_data" :key="index" :label="item.linkname" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内容">
                      <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="strategyText.content">
                      </el-input>
                  </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelStrategyTextDialog">取 消</el-button>
                  <el-button type="primary" :loading="strategyLoading" @click="confirmStrategyTextDialog">确 定</el-button>
              </div>
            </el-dialog> -->

            <el-dialog title="我的推荐 - 滚动公告" v-model="rollAdvDialog" size="small" @close="cancelRollAdvDialog">
              <el-form :inline="true" label-position="left" label-width="100px">
                  <div v-for="(item,index) in rollAdvList" class="adv-item">
                    <el-form-item label="公告">
                      <el-select v-model="item.linkid" placeholder="请选择活动链接">
                          <el-option v-for="(item,index) in agentLinkList_data" :key="index" :label="item.linkname" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input placeholder="最多输入50个中文" v-model="item.content"></el-input>
                    </el-form-item>
                    <span @click="addRollAdv" class="icon-add">+</span>
                    <span @click="delRollAdv(index)" class="icon-del">-</span>
                  </div>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelRollAdvDialog">取 消</el-button>
                  <el-button type="primary" :loading="rollAdvLoading" @click="confirmRollAdvDialog">确 定</el-button>
              </div>
            </el-dialog>

            <el-dialog title="我的推荐 - 弹幕模板" v-model="barrageTempDialog" size="small" @close="cancelBarrageTempDialog">
              <el-form :inline="true" label-position="left" label-width="100px">
                <el-form-item label="模板">
                    <el-input style="width:100px;" placeholder="" v-model="barrageTemp.text1"></el-input>
                    <el-select style="width:100px;" v-model="barrageTemp.type1" placeholder="代理姓名">
                        <el-option label="不显示" value="0"></el-option>
                        <el-option label="代理姓名" value="1"></el-option>
                        <el-option label="讲师姓名" value="2"></el-option>
                    </el-select>
                    <el-input style="width:100px;" placeholder="" v-model="barrageTemp.text2"></el-input>
                    <el-select style="width:100px;" v-model="barrageTemp.type2" placeholder="讲师姓名">
                        <el-option label="不显示" value="0"></el-option>
                        <el-option label="代理姓名" value="1"></el-option>
                        <el-option label="讲师姓名" value="2"></el-option>
                    </el-select>
                    <el-input style="width:100px;" placeholder="" v-model="barrageTemp.text3"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelBarrageTempDialog">取 消</el-button>
                  <el-button type="primary" :loading="barrageTempLoading" @click="confirmBarrageTempDialog">确 定</el-button>
              </div>
            </el-dialog>

            <el-dialog title="我的推荐 - 滚动弹幕" v-model="rollBarrageDialog" size="small" @close="cancelRollBarrageDialog">
              <el-form :inline="true" label-position="left" label-width="100px">
                  <div class="adv-item" v-for="(item,index) in rollBarrageList">
                    <el-form-item label="弹幕">
                      <el-select v-model="item.linkid" placeholder="请选择活动链接">
                          <el-option v-for="(item,index) in agentLinkList_data" :key="index" :label="item.linkname" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input placeholder="最多输入50个中文" v-model="item.content"></el-input>
                    </el-form-item>
                    <span @click="addrollBarrage" class="icon-add">+</span>
                    <span @click="delrollBarrage(index)" class="icon-del">-</span>
                  </div>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelRollBarrageDialog">取 消</el-button>
                  <el-button type="primary" :loading="rollBarrageLoading" @click="confirmRollBarrageDialog">确 定</el-button>
              </div>
            </el-dialog>

        </div>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import queryAgentTextConfig from '../../api/select/queryAgentTextConfig';
import agentLinkList from '../../api/select/agentLinkList';
import agentTextConfig from '../../api/action/agentTextConfig';
import savaAgentTextConfig from '../../api/action/savaAgentTextConfig';

import queryAgentBarrageTemplate from '../../api/select/queryAgentBarrageTemplate';
import agentBarrageTemplate from '../../api/action/agentBarrageTemplate';

export default {
    data() {
        return {
          strategyLoading:false,
          rollAdvLoading:false,
          barrageTempLoading:false,
          rollBarrageLoading:false,
          table_data:[
            // {
            //   id:1,
            //   title:'推荐攻略',
            //   type:'攻略文字'
            // },
            {
              id:2,
              title:'我的推荐',
              type:'滚动公告'
            },
            {
              id:3,
              title:'我的推荐',
              type:'弹幕模板'
            },
            {
              id:4,
              title:'我的推荐',
              type:'滚动弹幕'
            }
          ],
          agentLinkList_data:[],
          strategyText:{
            linkid:'',
            content:''
          },
          rollAdvList:[
            {
              linkid:'',
              text:''
            }
          ],
          barrageTemp:{
            text1:'',
            text2:'',
            text3:'',
            type1:'',
            type2:''
          },
          rollBarrageList:[
            {
              linkid:'',
              content:''
            }
          ],
          tableLoading:false,
          // strategyTextDialog:false,
          rollAdvDialog:false,
          barrageTempDialog:false,
          rollBarrageDialog:false,
          currentID:""
        }
    },
    filters:{
      textFilter(val){
        let v = "";
        if(val == "1"){
          v = "攻略文字";
        }
        if(val == "2"){
          v = "滚动公告";
        }
        if(val == "3"){
          v = "弹幕模板";
        }
        if(val == "4"){
          v = "滚动弹幕";
        }
        return v;
      }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        strategyTextLinkChange(){
          let parm = {
            linkid:this.strategyText.linkid,
            position:'1',	//文字位置:1推荐攻略，2我的推荐
            type:'1'	//文字类型:1攻略文字，2滚动公告，3滚动弹幕
          };
          queryAgentTextConfig(parm).then(data => {
            if(data.length > 0){
              this.strategyText.content = data[0].content;
            }else{
              this.strategyText.content = ""
            }
          }).catch(message => {
            this.$Message({
                message
            });
          });
        },
        addRollAdv(){
          this.rollAdvList.push({
            linkid:'',
            text:''
          });
        },
        getAgentLinkList(){
          agentLinkList().then(data => {
            this.agentLinkList_data = data;
          }).catch(message => {
            this.$Message({
                message
            });
          });
        },
        delRollAdv(index){
          if(this.rollAdvList.length == 1){
            return;
          }
          this.rollAdvList.splice(index,1);
        },
        addrollBarrage(){
          this.rollBarrageList.push({
            linkid:'',
            content:''
          });
        },
        delrollBarrage(index){
          if(this.rollBarrageList.length == 1){
            return;
          }
          this.rollBarrageList.splice(index,1);
        },
        edit(id){
          if(id == "1"){
            // this.openStrategyTextDialog();
          }
          if(id == "2"){
            this.openRollAdvDialog();
          }
          if(id == "3"){
            this.openBarrageTempDialog();
          }
          if(id == "4"){
            this.openRollBarrageDialog();
          }
        },
        // openStrategyTextDialog(){
        //   this.strategyTextDialog = true;
        // },
        // confirmStrategyTextDialog(){
        //   let parm = {
        //     position:'1',	//文字位置:1推荐攻略，2我的推荐
        //     type:'1'	//文字类型:1攻略文字，2滚动公告，3滚动弹幕
        //   };
        //   Object.assign(parm,this.strategyText);
        //   this.strategyLoading = true;
        //   savaAgentTextConfig(parm).then(data => {
        //     this.$Message({
        //         message:"操作成功"
        //     });
        //     this.strategyLoading = false;
        //     this.strategyTextDialog = false;
        //   }).catch(message => {
        //     this.strategyLoading = false;
        //     this.$Message({
        //         message
        //     });
        //   });
        // },
        // cancelStrategyTextDialog(){
        //   this.strategyTextDialog = false;
        // },
        openRollAdvDialog(){
          let parm = {
            position:'2',	//文字位置:1推荐攻略，2我的推荐
            type:'2'	//文字类型:1攻略文字，2滚动公告，3滚动弹幕
          };
          queryAgentTextConfig(parm).then(data => {
            this.rollAdvList = data;
            if(this.rollAdvList.length == 0){
              this.rollAdvList.push({
                linkid:'',
                text:''
              });
            }
            this.rollAdvDialog = true;
          }).catch(message => {
            this.$Message({
                message
            });
          });
        },
        confirmRollAdvDialog(){
          let parm = {
            position:'2',
            type:'2'
          };
          //内容不可以大于50
          let error = "";
          for(let i = 0; i < this.rollAdvList.length; i++){
            let item = this.rollAdvList[i];
            if(item.content.length > 50){
              error = "公告内容文字不可以大于50字"
              break;
            }
          }
          if(error != ""){
            this.$Message({
                message:error
            });
            return;
          }
          parm.activityTextDtoList = this.rollAdvList;
          this.rollAdvLoading = true;
          agentTextConfig(parm).then(data => {
            this.rollAdvLoading = false;
            this.rollAdvDialog = false;
          }).catch(message => {
            this.rollAdvLoading = false;
            this.$Message({
                message
            });
          });
        },
        cancelRollAdvDialog(){
          this.rollAdvDialog = false;
        },
        openBarrageTempDialog(){
          queryAgentBarrageTemplate().then(data => {
            if(data.length > 0){
              this.barrageTemp = data[0];
            }
            this.barrageTempDialog = true;
          }).catch(message => {
            this.$Message({
                message
            });
          });

        },
        confirmBarrageTempDialog(){
          let parm = {};
          Object.assign(parm,this.barrageTemp);
          this.barrageTempLoading = true;
          agentBarrageTemplate(parm).then(data => {
            this.barrageTempLoading = false;
            this.barrageTempDialog = false;
          }).catch(message => {
            this.barrageTempLoading = false;
            this.$Message({
                message
            });
          });

        },
        cancelBarrageTempDialog(){
          this.barrageTempDialog = false;
        },
        openRollBarrageDialog(){
          let parm = {
            position:'2',	//文字位置:1推荐攻略，2我的推荐
            type:'4'	//文字类型:1攻略文字，2滚动公告，3滚动弹幕
          };
          queryAgentTextConfig(parm).then(data => {
            this.rollBarrageList = data;
            if(this.rollBarrageList.length == 0){
              this.rollBarrageList.push({
                linkid:'',
                content:''
              });
            }
            this.rollBarrageDialog = true;
          }).catch(message => {
            this.$Message({
                message
            });
          });
        },
        confirmRollBarrageDialog(){
          let parm = {
            position:'2',
            type:'4'
          };
          //内容不可以大于50
          let error = "";
          for(let i = 0; i < this.rollBarrageList.length; i++){
            let item = this.rollBarrageList[i];
            if(item.content.length > 50){
              error = "滚动弹幕文字不可以大于50字"
              break;
            }
          }
          if(error != ""){
            this.$Message({
                message:error
            });
            return;
          }
          parm.activityTextDtoList = this.rollBarrageList;
          this.rollBarrageLoading = true;
          agentTextConfig(parm).then(data => {
            this.rollBarrageLoading = false;
            this.rollBarrageDialog = false;
          }).catch(message => {
            this.rollBarrageLoading = false;
            this.$Message({
                message
            });
          });
        },
        cancelRollBarrageDialog(){
          this.rollBarrageDialog = false;
        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
      this.getAgentLinkList();
    },
    components:{

    }
}
</script>
