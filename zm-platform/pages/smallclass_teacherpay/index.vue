<template>
  <div class="context" v-if="checkPermission('api:teachers:minClassSalary')">
    <Spin size="large" fix v-if="tableLoading"></Spin>
    <div class="context-body">
      <el-form :inline="true" :model="search_data">
        <el-form-item label="工作性质">
          <el-select v-model="search_data.workTypeOrdinal" placeholder="请选择">
            <el-option label="兼职" value="0"></el-option>
            <el-option label="全职" value="1"></el-option>
            <el-option label="校招全职" value="2"></el-option>
            <el-option label="公校兼职" value="3"></el-option>
            <el-option label="全职学科班主任" value="4"></el-option>
            <el-option label="全部" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段">
          <div class="block">
            <el-date-picker
              v-model="searchDateArea"
              type="month"
              placeholder="请选择">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="关键词">
            <el-input v-model="search_data.nameOrMobile" placeholder="输入老师姓名或手机号"></el-input>
        </el-form-item>
        <el-button class="search-btn" size="small" type="normal" icon="search" @click="search()">搜索</el-button>
      </el-form>
      <el-row class="text-right">
        <!-- <el-button type="text" @click="salaryCalculation()">薪资计算</el-button> -->
        <el-button type="text" @click="batchReview(salaryId, checkState)">批量审核</el-button>
        <el-button type="text" @click="batchPayment(salaryId, paidStatu)">批量支付</el-button>
        <el-button type="text" @click="exportExcel(salaryId)">导出excel</el-button>
      </el-row>
      <el-table :data="tableData" @selection-change="selectTable" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="讲师姓名" width="120" align="center">
          <template scope="scope">
            <el-button @click="toSalary(scope.row.teaName, scope.row.teaId, scope.row.yearMonth)" size="small" type="text">{{ scope.row.teaName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120" align="center"></el-table-column>
        <el-table-column prop="workType" label="工作性质" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="payWay" label="支付方式" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="payAccount" label="支付账号" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="yearMonth" label="月份" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="salary" label="课程薪资" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="checkState" label="审核状态" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="paidStatus" label="是否支付" show-overflow-tooltip align="center"></el-table-column>
      </el-table>
      <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>
    </div>
    <!-- 老师的薪资 -->
    <el-dialog  size="large" :title='teaName' v-model="dialogTableVisible">
      <el-row>
        <el-col :span="6"><div class="grid-content bg-purple">小班课测评课</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">小班正式课</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">奖惩补贴</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">应发薪资</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><div class="grid-content bg-purple-light">{{ gridData.mintestLessonSalary }}元</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">{{ gridData.minRegularLessonSalary }}元</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">{{ gridData.bonusSalary }}元</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">{{ gridData.paySalary }}元</div></el-col>
      </el-row>
      <!-- 课时与薪资明细 -->
      <el-form :inline="true" :model="salary_details_data">
        <el-form-item label="课时和薪资明细">
            <!-- <el-select v-model="salary_details_data.entryType" placeholder="请选择"> -->
                <!-- <el-option label="全部" value="0"></el-option> -->
                <!-- <el-option label="小班课" value="1"></el-option> -->
                <!-- <el-option label="1对1" value="2"></el-option> -->
            <!-- </el-select> -->
            <!-- <el-button-group>
              <el-button size="small" icon="arrow-left" @click="toLeft()"></el-button>
              <el-button size="small" @click="toRight()"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group> -->
        </el-form-item>
      </el-form>
      <el-table :data="salary_details_table">
        <el-table-column label="学生姓名" width="150" align="center">
          <template scope="scope">
            <!-- <el-button @click="toViewStudents(scope.row.lesId)" size="small" type="text">{{ scope.row.stuNames }}</el-button> -->
            <span  @click="toViewStudents(scope.row.lesId)" class="stuNameLink">{{ scope.row.stuNames }}</span>
          </template>
        </el-table-column>
        <el-table-column property="courseType" label="课程类型" width="200" align="center"></el-table-column>
        <el-table-column property="subject" label="学科" align="center"></el-table-column>
        <el-table-column property="classTime" label="上课时间" align="center"></el-table-column>
        <el-table-column property="lesDuration" label="时长(分钟)" align="center"></el-table-column>
        <el-table-column property="lesStatus" label="课程情况" align="center"></el-table-column>
        <el-table-column property="lesMoney" label="薪资(元)" align="center"></el-table-column>
      </el-table>
      <!-- <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="salary_details_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="salary_details_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination> -->
      <!-- 补录奖励补贴 -->
      <el-form :inline="true" :model="reward_subsidies_data">
        <el-form-item label="补录奖励补贴">
            <!-- <el-select v-model="salary_details_data.entryType" placeholder="请选择"> -->
                <!-- <el-option label="全部" value="0"></el-option> -->
                <!-- <el-option label="小班课" value="1"></el-option> -->
                <!-- <el-option label="1对1" value="2"></el-option> -->
            <!-- </el-select> -->
            <!-- <el-button-group>
              <el-button size="small" icon="arrow-left"></el-button>
              <el-button size="small"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group> -->
        </el-form-item>
      </el-form>
      <el-table :data="reward_subsidies_table">
        <el-table-column property="detailInfo" label="奖惩和补贴信息" width="700" align="center"></el-table-column>
        <el-table-column property="transferTime" label="时间" width="200" align="center"></el-table-column>
        <el-table-column property="bonus" label="补贴额" align="center"></el-table-column>
        <el-table-column property="bonusType" label="补贴形式" align="center"></el-table-column>
        <el-table-column property="isChecked" label="审核情况" align="center"></el-table-column>
      </el-table>
      <!-- <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="reward_subsidies_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="reward_subsidies_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination> -->
    </el-dialog>
    <!-- 查看学生上课状态 -->
    <el-dialog title="查看学生上课状态" v-model="viewStudentsTableVisible">
      <!-- <el-input v-model="search_data.nameOrMobile" placeholder="输入老师姓名或手机号"></el-input> -->
      <p>共有{{viewStudentsData.length}}名学生</p>
      <el-table :data="viewStudentsData">
        <el-table-column property="stuName" label="学生姓名" width="150" align="center"></el-table-column>
        <el-table-column property="stuMobile" label="学生手机号" width="200" align="center"></el-table-column>
        <el-table-column property="classState" label="上课状态" align="center"></el-table-column>
      </el-table>
      <!-- <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination> -->
    </el-dialog>
    <div v-show="progressState" class="dataLoading">
      <div class="rollPanel">
        <div class="roll">
        </div>
        <div class="rollText">

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 搜索表单
      search_data: {
        workTypeOrdinal: '',
        queryDate: '',
        nameOrMobile: '',
        pageNo: 1,//number
        pageSize: 10,//number
      },
      progressState:false,
      // 表格内容
      tableData: [],
      multipleSelection: [],
      dialogTableVisible: false,
      // 老师薪资
      gridData: {},
      // 课时与薪资明细
      salary_details_data: {
        entryType: '1',
        classType: '',
        pageNo: 1,//number
        pageSize: 10,//number
      },
      // 课时薪资明细表
      salary_details_table: [],
      // 补录与奖励补贴
      reward_subsidies_data: {
        entryType: '1',
        classType: '',
        pageNo: 1,//number
        pageSize: 10,//number
      },
      // 补录与奖励补贴表格
      reward_subsidies_table: [],
      viewStudentsTableVisible: false,
      // 学生上课情况
      viewStudentsData: [],
      // 表单数据
      table_data: [],
      tableLoading: false,
      table_data_total: 0,
      // 被选择的用户
      salaryId: [],
      checkState: [],
      paidStatu: [],
      searchDateArea: '',
      teaName: ''
    }
  },
  methods: {
    // 是否有权限
    checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
    },
    toggleSelection(pageSize) {
      this.size = pageSize;
      this.getTableData();
    },
    handleSelectionChange(currentPage) {
      this.page = currentPage;
      this.getTableData();
    },
    // 选择单行
    selectRow(select) {
      // this.selectedIds = select.map(item => {
      //   return item.id;
      // });
      // this.selectedTypes = unique(
      //   select.map(item => {
      //     return item.auditStatus;
      //   })
      // );
      // this.selectedAuditStatus = select.map(item => {
      //   return item.auditStatus;
      // })
    },
    // 全选
    selectAll(select) {
      // this.selectedIds = select.map(item => {
      //   return item.id;
      // });
      // this.selectedTypes = unique(
      //   select.map(item => {
      //     return item.auditStatus;
      //   })
      // );
      // this.selectedAuditStatus = select.map(item => {
      //   return item.auditStatus;
      // })
    },
    selectTable(val) {
      let ids = [];
      let states = [];
      let status = [];
      val.forEach((value) => {
        ids.push(value.salaryId.toString());
        states.push(value.checkState.toString());
        status.push(value.paidStatus.toString());
      });
      this.salaryId = ids;
      this.checkState = states;
      this.paidStatu = status;
    },
    // 老师薪资表
    toSalary (teaName, teaId, yearMonth) {
      this.dialogTableVisible = true;
      this.getGridData(teaName, teaId, yearMonth);
      // this.getGridData(teaName,'40','2018-04');
    },
    // 学生上课状态
    toViewStudents (lesId) {
      this.viewStudentsTableVisible = true;
      this.getViewStudentsData(lesId);
      // this.getViewStudentsData('56');
    },
    // 获取表单数据
    getTableData() {
      this.$Fetch({
          url: '/api/minClass/queryMinClassSalary',
          method: 'post',
          data: this.search_data
      }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.tableData = data.list;
            this.table_data_total = data.total;
          } else {
            this.$Message({
                message
            });
          }
          this.tableLoading = false;
      });
    },
    // 查询
    search() {
      if ( this.searchDateArea != '' || this.search_data.workTypeOrdinal != '' || this.search_data.nameOrMobile != '') {
        if (this.searchDateArea == undefined ||  this.searchDateArea == '') {
          this.search_data.queryDate = (new Date()).format('yyyy-MM');
        } else {
          this.search_data.queryDate = this.searchDateArea.format('yyyy-MM');
        }
        this.tableLoading = true;
        this.search_data.pageNo = 1;
        this.getTableData();
      } else {
        this.$Message({
            message: '请输入要搜索的内容',
        });
      }
    },
    // 获取老师薪资数据
    getGridData (teaName,teaId,yearMonth) {
      this.$Fetch({
          url: '/api/minClass/getSalaryDetail',
          method: 'post',
          data: {
            teaId: teaId,
            yearMonth: yearMonth,
          }
      }).then((result) => {
          this.teaName = '老师'+teaName+'的薪资';
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.gridData = data;
            this.reward_subsidies_table = data.minBonusDetailDto;
            this.salary_details_table = data.minCourseDetailDto;
          } else {
            this.$Message({
                message
            });
          }
          this.tableLoading = false;
      });
    },
    // 查看学生上课状态
    getViewStudentsData (lesId) {
      this.$Fetch({
          url: `/api/minClass/getStudentClassState?lesId=${lesId}`,
          method: 'post',
      }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            if (data) {
              this.viewStudentsData = data;
            }
          } else {
            this.$Message({
                message
            });
          }
          this.tableLoading = false;
      });
    },
    handleSizeChange(pageSize) {
        this.search_data.pageSize = pageSize;
        // this.currentPage = 1;
        this.search_data.pageNo = 1;
        this.tableLoading = true;
        this.getTableData();
    },
    handleCurrentChange(currentPage) {
      // this.currentPage = currentPage;
      this.search_data.pageNo = currentPage;
      this.tableLoading = true;
      this.getTableData();
    },
    // 薪资计算(调用薪资计算接口)
    salaryCalculation () {
    },
    // 批量审核(调用批量审核接口)
    batchReview (salaryIdList, checkState) {
      if (salaryIdList == '') {
        this.$Message({
            message: '请选择未审核的数据'
        });
        return;
      }
      let itemState = checkState.filter(function (item) {
        return item == '未审核';
      });
      if ( itemState != '') {
        this.$Fetch({
          url: '/api/minClass/batchCheck',
          method: 'post',
          data: {
            salaryIdList: salaryIdList
          }
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
              this.$Message({
                  message
              });
              this.getTableData();
            } else {
              this.$Message({
                  message
              });
            }
            this.tableLoading = false;
        });
      } else {
        this.$Message({
            message: '请选择未审核的数据'
        });
        return;
      }
    },
    // 批量支付(调用批量支付接口)
    batchPayment (salaryIdList, paidStatu) {
      if (salaryIdList == '') {
        this.$Message({
            message: '请选择未支付的数据'
        });
        return;
      }
      let itemStatu = paidStatu.filter(function (item) {
        return item == '未支付';
      });
      if (itemStatu != '') {
        this.$Fetch({
          url: '/api/minClass/batchPaid',
          method: 'post',
          data: {
            salaryIdList: salaryIdList
          }
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
              this.$Message({
                  message
              });
              this.getTableData();
            } else {
              this.$Message({
                  message
              });
            }
            this.tableLoading = false;
        });
      } else {
        this.$Message({
            message: '请选择未支付的数据'
        });
      }
    },
    // 导出excel(调用导出excel接口)
    exportExcel (salaryIdList) {
      if(salaryIdList.length == 0){
        this.$Message({
            message:"请选择老师"
        });
        return;
      }
      let _this = this;
      const url = `/api/teacher-web/api/minClass/salaryExport`;
      //window.open(url, '_blank');
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.responseType = "blob";
      _this.progressState = true;
      xhr.onprogress = function (e) {
          //_this.rate = e.loaded/e.total;
      };
      xhr.onload = function () {
          _this.progressState = false;
          if (this.status === 200) {
              let timestrump = new Date().getTime();
              let blob = new Blob([this.response], {type: 'application/vnd.ms-excel'}),
              fileName = '小班课薪资.xlsx';
              _this.downFile(blob, fileName);
          }
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({salaryIdList:salaryIdList}));
    },
    downFile (blob, fileName) {
      var link = document.createElement('a');
      if(window.webkitURL.createObjectURL){
        link.href = window.webkitURL.createObjectURL(blob);
      }else{
        link.href = window.URL.createObjectURL(blob);
      }
      link.download = fileName;
      document.body.appendChild(link);
      link.style.display = "none";
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    toLeft (val) {
      alert(val);
    },
    toRight (val) {
      alert(val);
    },
    initDate() {
      this.searchDateArea = new Date();
    }
  },
  mounted () {
    this.initDate();
    this.search_data.queryDate = (new Date()).format('yyyy-MM');
    this.search_data.workTypeOrdinal = '5';
    this.getTableData();
  }
}
</script>

<style>
@import "../../../src/styles/smallclass_teacherpay/index.less";
</style>
