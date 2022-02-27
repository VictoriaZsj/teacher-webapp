<style lang="less" scoped>

</style>

<template>
    <div class="full-time-container" v-if="permission">
      <el-form :inline="true" :model="search_data" class="search-form" style="overflow:visible;">
            <el-form-item label="所属BU">
                <el-select v-model="search_data.bu" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="1对1" value="1"></el-option>
                    <el-option label="少儿" value="2"></el-option>
                    <el-option label="陪练" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工作性质">
                <el-select v-model="search_data.timetype" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="兼职" value="0"></el-option>
                    <el-option label="全职" value="1"></el-option>
                    <el-option label="校招全职" value="2"></el-option>
                    <el-option label="公校兼职" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="代理姓名">
                <el-input v-model="search_data.agentName" placeholder="输入代理姓名"></el-input>
            </el-form-item>
            <!-- <el-form-item label="参加活动">
                <el-input v-model="search_data.activeTitle" placeholder="输入活动标题"></el-input>
            </el-form-item> -->
            <el-form-item label="代理手机号">
                <el-input v-model="search_data.agentMobile" placeholder="输入代理手机号"></el-input>
            </el-form-item>
            <el-form-item label="讲师姓名">
                <el-input v-model="search_data.teaName" placeholder="输入讲师姓名"></el-input>
            </el-form-item>
            <el-form-item label="讲师手机号">
                <el-input v-model="search_data.teaMobile" placeholder="输入讲师手机号"></el-input>
            </el-form-item>

            <!-- <el-form-item label="讲师状态">
                <el-select v-model="search_data.teaStatus" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待预约" value="0"></el-option>
                    <el-option label="待面试" value="1"></el-option>
                    <el-option label="待二面" value="10"></el-option>
                    <el-option label="面试缺席" value="11"></el-option>
                    <el-option label="待预约培训" value="2"></el-option>
                    <el-option label="待培训通知" value="20"></el-option>
                    <el-option label="待培训" value="3"></el-option>
                    <el-option label="培训延期" value="21"></el-option>
                    <el-option label="培训缺席" value="22"></el-option>
                    <el-option label="待入职" value="4"></el-option>
                    <el-option label="已入职" value="5"></el-option>
                    <el-option label="已入库" value="30"></el-option>
                    <el-option label="转正" value="40"></el-option>
                    <el-option label="已淘汰" value="50"></el-option>
                    <el-option label="已离职" value="6"></el-option>
                    <el-option label="申请离职" value="24"></el-option>
                    <el-option label="回收站" value="7"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="报名时间">
                <el-date-picker :editable="false" v-model="signDateArea" type="daterange" align="right" placeholder="选择日期" @change="chooseSignDate" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="入职时间">
                <el-date-picker :editable="false" v-model="searchInworkDateArea" type="daterange" align="right" placeholder="选择日期" @change="chooseInworkDate" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="入库时间">
                <el-date-picker :editable="false" v-model="searchInstoreDateArea" type="daterange" align="right" placeholder="选择日期" @change="chooseInstoreDate" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>
        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
              共 {{agentCount}} 名代理，推荐 {{teaCount}} 人，入职/入库 {{entryCount}} 人
            </div>
            <el-table :data="table_data" style="width:100%">
                <el-table-column prop="agentName" align="center" label="代理姓名" >
                </el-table-column>
                <!-- <el-table-column prop="activeTitle" align="center" label="参加活动" >
                </el-table-column> -->
                <el-table-column prop="agentMobile" align="center" label="代理手机号" >
                </el-table-column>
                <el-table-column prop="teaName" align="center" label="讲师姓名" >
                </el-table-column>
                <el-table-column prop="teaMobile" align="center" label="讲师手机号" >
                </el-table-column>
                <el-table-column prop="teaStatus" align="center" label="讲师状态" >
                </el-table-column>
                <el-table-column prop="applyTime" align="center" label="报名时间" >
                </el-table-column>
                <el-table-column prop="entryTime" align="center" label="入库/入职时间" >
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>


        </div>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import queryAgentData from '../../api/select/queryAgentData';

export default {
    data() {
        return {
          currentID:"",
          tableLoading:false,
          table_data:[],
          table_data_total:0,
          agentCount:0,
          entryCount:0,
          teaCount:0,
          search_data:{
            bu:'',
            activeId:'',
            timetype:'',
            agentName:'',//代理姓名
            activeTitle:'',//活动标题
            agentMobile:'',//代理手机号
            teaName:'',//讲师姓名
            teaMobile:'',//讲师手机号
            // teaStatus:'',//讲师状态
            applyTimeStart:'',
            applyTimeEnd:'',
            readAtStart:'',
            readAtEnd:'',
            entryTimeStart:'',
            entryTimeEnd:'',
            pageSize:10,
            pageNo:1
          },
          signDateArea:[],
          searchInworkDateArea:[],
          searchInstoreDateArea:[],
          pickerOptions: {
              shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                  }
              }, {
                  text: '最近一个月',
                  onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                  }
              }, {
                  text: '最近三个月',
                  onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                  }
              }]
          },
        }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        handleSizeChange(pageSize) {
            this.search_data.pageSize = pageSize;
            this.search_data.pageNo = 1;
            this.getTableData();
        },
        handleCurrentChange(currentPage) {
            this.search_data.pageNo = currentPage;
            this.getTableData();
        },
        chooseSignDate(){
          if(this.signDateArea[0] == null){
              this.search_data.applyTimeStart = "";
              this.search_data.applyTimeEnd = "";
          }else{
            let sDate = new Date(this.signDateArea[0]).getTime();
            let eDate = new Date(this.signDateArea[1]).getTime();
            this.search_data.applyTimeStart = this.$DateTool.format(sDate,'yyyy-MM-dd') + " 00:00:00";
            this.search_data.applyTimeEnd = this.$DateTool.format(eDate,'yyyy-MM-dd') + " 23:59:59";
          }
        },
        getTableData(){
          this.tableLoading = true;
          queryAgentData(this.search_data).then(data => {
            this.agentCount=data.agentCount;
            this.entryCount=data.entryCount;
            this.teaCount=data.teaCount;

            this.table_data = data.agentDataList.list;
            this.table_data_total = data.agentDataList.total;
            this.tableLoading = false;
          }).catch(message => {
            this.tableLoading = false;
            this.$Message({
                message: message
            });
          });
        },
        chooseInworkDate(){
          if(this.searchInworkDateArea[0] == null){
              this.search_data.entryTimeStart = "";
              this.search_data.entryTimeEnd = "";
          }else{
            let sDate = new Date(this.searchInworkDateArea[0]).getTime();
            let eDate = new Date(this.searchInworkDateArea[1]).getTime();
            this.search_data.entryTimeStart = this.$DateTool.format(sDate,'yyyy-MM-dd') + " 00:00:00";
            this.search_data.entryTimeEnd = this.$DateTool.format(eDate,'yyyy-MM-dd') + " 23:59:59";
          }
        },
        chooseInstoreDate(){
          if(this.searchInstoreDateArea[0] == null){
              this.search_data.readAtStart = "";
              this.search_data.readAtEnd = "";
          }else{
            let sDate = new Date(this.searchInstoreDateArea[0]).getTime();
            let eDate = new Date(this.searchInstoreDateArea[1]).getTime();
            this.search_data.readAtStart = this.$DateTool.format(sDate,'yyyy-MM-dd') + " 00:00:00";
            this.search_data.readAtEnd = this.$DateTool.format(eDate,'yyyy-MM-dd') + " 23:59:59";
          }
        },
        // 查询
        search() {
            this.search_data.pageNo = 1;
            this.getTableData();
            this.search_data.activeId = "";
        },
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
      if(!!this.$route.query.id){
        this.search_data.activeId = this.$route.query.id;
      }else{
        this.search_data.activeId = "";
      }
      this.search();
    },
    components:{
    }
}
</script>
