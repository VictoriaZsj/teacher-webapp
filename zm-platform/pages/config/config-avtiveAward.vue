

<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form" style="overflow:visible;">
      <el-form-item label="渠道关键字">
        <el-input v-model="search_data.agentName" placeholder="渠道名称或手机号查询"></el-input>
      </el-form-item>
      <el-form-item label="渠道类型">
        <el-select v-model="search_data.agentType" placeholder="请选择">
          <el-option label="全部"
                     value=""></el-option>
          <el-option v-for="(item,index) in channelType"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search_data.state" placeholder="请选择">
          <el-option v-for="(item,index) in payStatus"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="奖励月份">
        <el-date-picker :editable="false" v-model="month" type="month" placeholder="选择月"></el-date-picker>
      </el-form-item>
      <el-form-item label="代理类型变更">
        <el-select v-model="search_data.isQuit" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in isQuitOption"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="search-btn" type="normal" size="small" @click="exportList()">
          导出
        </el-button>
        <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small"
                   @click="search">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <div class="table-head">
        <span>共{{table_data_total}}笔奖励</span>
        <el-button size="small" :loading="batchPayLoading" @click="pays()" type="text">批量支付</el-button>
      </div>
      <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column v-for="(item,index) in tableTitle"
                         :prop="item.prop"
                         :key="index"
                         :align="item.align"
                         :label="item.label">
          <template scope="scope">
            <span v-if="item.prop==='agentName' && scope.row.isQuit===1" class="isQuit">离职</span>
            <span v-if="item.prop==='agentName' && scope.row.isQuit===2" class="isQuit">外转内</span>
            <p style="padding-right: 17px" v-if="item.prop==='agentName'">{{scope.row[item.prop]}}</p>
            <span v-else-if="item.prop==='agentType'">{{channelType.length>0?channelType.find(channelItem => channelItem.value == scope.row[item.prop]).label:''}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
            <el-button  type="text" @click="getReferMobile(scope.row)"
                        size="small" class="detailsBtn" v-if="item.prop==='agentMobile'&&!scope.row.currentRow">点击获取手机号</el-button>
            <span v-if="item.prop==='agentMobile'&&scope.row.mobile&&scope.row.currentRow">{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" label="状态">
          <template scope="scope">
            {{scope.row.state|stateFilter}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <el-button v-if="scope.row.state == 2" size="small" @click="pay(scope.row)"
                       type="text">支付
            </el-button>
            <el-button size="small" @click="seeInstore(scope.row.agentId,scope.row.month,scope.row.state)" type="text">
              查看名单
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize"
                     layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>

      <!--添加dialog-->
      <el-dialog :white="true" title="查看名单" v-model="storeDialog" size="large">
        <in-list :viewState="storeDialog"
                 :id="currentID"
                 :state="state"
                 :month="currentMonth"></in-list>
      </el-dialog>

      <!--导出下载结算数据表-->
    <el-dialog title=导出下载结算数据表 v-model="asyncVisible" @close="closeDownload" class="create-form" size="middle">
      <el-form :inline="true" class="search-form" :model="monthForm" style="overflow:visible;">
        <el-form-item label="奖励月份">
          <el-date-picker :editable="false" v-model="month" type="month" placeholder="选择月"></el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="startDownload">点我导出</el-button>
      </el-form>
      <el-form :inline="true" class="search-form" :model="monthForm" style="overflow:visible;">
        <p>1.由于数据量较大，所以下载速度会比较慢，点击【点我导出】后，系统会自动下载，下载完成后，在下方列表 点击【下载】即可下载已导出的表格</p>
        <p>2.当前弹窗只保留近一个月的导出表格</p>
      </el-form>
      <el-table class="" :data="asyncTableData">
        <el-table-column prop="updatedTime" label="导出时间" align="center">
        </el-table-column>
        <el-table-column prop="fileName" label="导出表格名称" align="left" width=200>
        </el-table-column>
        <el-table-column prop="createdBy" label="下载状态" align="center">
          <template scope="scope">
            {{scope.row.state == 1 ? '成功' : '下载中...'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <span v-if="scope.row.state === 0">
              下载中...
            </span>
            <el-button
              style="font-size: 12px;"
              v-if="scope.row.state === 1"
              @click="disciplineDetail(scope.row)"
              type="text"
            >下载</el-button>

          </template>
        </el-table-column>
        <template slot="empty">
          <p class="t-l">当前无已导出表格，</p>
          <p class="t-l">请点击<span class="c-blue">【点我导出】</span>按钮，进行导出</p>
        </template>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="asyncHandleSizeChange"
          @current-change="asynchHandleCurrentChange"
          :current-page="monthForm.pageNo"
          :page-size="monthForm.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, prev, pager, next, sizes, jumper"
          v-bind:total="asyncTotal"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="asyncVisible = false">关 闭</el-button>
        <el-button type="primary" @click="asyncVisible = false">后台下载</el-button>
      </div>
    </el-dialog>

    </div>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
  import inStoreList from '../dialog/in_list';
  import getChannelType from '../../api/action/getChannelType';
  import commonCascade from '../../api/select/commonCascade';
  import  {getMobileInfo}  from '../../api/select/getTeacherNum'; // 获取手机号


  const payStatus = [
    {label: '全部', value: ''},
    {label: '待支付', value: '2'},
    {label: '已支付', value: '3'},
    {label: '已取消', value: '1'},
  ];
  const tableTitle = [
    {prop: "month", label: "奖励月份", width: "", align: 'center'},
    {prop: "agentName", label: "渠道名称", width: "", align: 'center'},
    {prop: "agentMobile", label: "渠道手机号", width: "", align: 'center'},
    {prop: "agentType", label: "渠道类型", width: "", align: 'center'},
    {prop: "award", label: "奖励金额", width: "", align: 'center'},
    {prop: "suppoedAward", label: "应结金额", width: "", align: 'center'},
    {prop: "entryPeople", label: "奖励人数", width: "", align: 'center'},
  ];
  export default {
    data() {
      return {
        asyncVisible: false, // 导出下载结算数据表显示标识
        value1: '',
        asyncTableData: [], // 异步下载列表数据
        asyncTotal: 0, // 异步下载总数量
        downloadMonth: '', // 异步下载月份选择
        monthForm: { // 搜索条件
          pageNo: 1,
          pageSize: 10,
        },
        batchAuditLoading: false,
        batchPayLoading: false,
        tableLoading: false,
        table_data: [],
        table_data_total: 0,
        storeDialog: false,
        currentID: '',
        currentMonth: '',
        selectName: [],
        channelType: [],
        isQuitOption: [],
        payStatus,
        tableTitle,
        month: '',
        state:'',
        search_data: {
          month: '',
          agentName: '',
          state: '',
          agentType: '',
          isQuit: '',
          teaReferKeywords:''
        },
        setIntervalExport: null,
        setIntervalNum: 0,
      }
    },
    filters: {
      stateFilter(val) {
        if (val == "1") {
          return "已取消";
        }
        if (val == "2") {
          return "待支付";
        }
        if (val == "3") {
          return "已支付";
        }
      }
    },
    async created() {
      getChannelType()
        .then((data) => {
          this.channelType = data;
        })
        .catch((err) => {
        });
      let res = await commonCascade([{"dictCode":"CHANNEL_CHANGE_STATE"}]);
      this.isQuitOption = res.children || []
    },
    methods: {
      // 获取手机号信息
      getReferMobile(row){
        /**
         * 因 SEM-1635 改成getMobileInfo接口.
         */
        row.mobile= "正在查询...";
        getMobileInfo(row.agentId).then(mobile => {
          row.mobile = mobile;
          row.currentRow = true;
        }).catch(err => {
          err.message && this.$Message.error(err.message)
        });
      },
      asyncHandleSizeChange(pageSize) {
        this.monthForm.pageSize = pageSize;
        this.monthForm.pageNo = 1;
        this.getDownloadData();
      },
      asynchHandleCurrentChange(currentPage) {
        this.monthForm.pageNo = currentPage;
        this.getDownloadData();
      },
      getDownloadData() {
        this.setIntervalNum ++;  // 五分钟停止掉接口
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/channelRec/agent/agentAward/exportFileList',
          method: 'post',
          data: this.monthForm
        }).then(data => {
          if (data.msgCode === '200') {
            this.asyncTableData = data.data.records;
            this.asyncTotal = data.data.total;
            if(!data.data.records.filter(r=>r.state === 0).length || this.setIntervalNum>100) {
              window.clearInterval(this.setIntervalExport);
            }
          } else {
            this.$Message.error({
              message: data.msgContent
            });
            this.asyncTableData = [];
            this.asyncTotal = 0;
          }
        }).catch(message => {
          // this.$Message({
          //   message
          // });
        });
      },
      // 开始导出数据
      startDownload(val) {
        if (!this.month) {
          this.$Message.info('请选择奖励月份');
          return;
        }
        let params = {
          activeTitle: val.activeTitle || '',
          agentId: val.agentId || '',
          agentName: this.search_data.agentName,
          agentType: this.search_data.agentType,
          month: this.setMonth(this.month),
          state: this.search_data.state,
        }
        for (let key in params) {
          if(!params[key]) delete params[key]
        }
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/channelRec/agent/agentAward/exportAsync',
          method: 'post',
          data: params,
        })
        this.setIntervalExport = setInterval(() => {
          this.getDownloadData();
        }, 3000);
        this.$Message.info('导出成功 请在列表第一条数据下载');
      },
      disciplineDetail(row) {
        window.location.href= row.fileOssUrl
      },
      closeDownload() {
        window.clearInterval(this.setIntervalExport);
      },
      exportList() {
        window.clearInterval(this.setIntervalExport);
        this.setIntervalNum = 0;
        this.asyncVisible = true;
        this.getDownloadData();
        // this.monthForm.month = this.search_data.month || '';
        // let param = JSON.parse(JSON.stringify(this.monthForm));
        // param.month = this.search_data.month;
        // let data = {...this.search_data};
        // let form = document.createElement('form');
        // form.setAttribute('method', 'get');
        // form.setAttribute('action', '/api/zm-teacher-recruit-web/channelRec/agent/agentAward/export');
        // form.setAttribute('target', '_self');
        // form.style.display = 'hidden';
        // for (let key in data) {
        //   let input = document.createElement('input');
        //   input.setAttribute('type', 'hidden');
        //   input.setAttribute('name', key);
        //   input.setAttribute('value', data[key]);
        //   form.appendChild(input)
        // }
        // document.body.appendChild(form);
        // form.submit();
        // document.body.removeChild(form);
      },
      checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
      },
      selectTable(val) {
        let ids = [];
        val.forEach((value) => {
          let p = {
            agentId: value.agentId,
            month: value.month,
            state: value.state
          };
          ids.push(p);
        });
        this.selectName = ids;
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
      // 返回年月入参
      setMonth(monthVal) {
        let date = '';
        if (!!monthVal) {
          let y = monthVal.getFullYear();
          let m = monthVal.getMonth() + 1;
          if (m >= 10) {
            date = "" + y + m;
          } else {
            date = "" + y + +"0" + m;
          }
        }
        return date;
      },
      getTableData() {
        this.search_data.month = this.setMonth(this.month);
        this.setMonth();
        this.tableLoading = true;
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/channelRec/agent/queryAgentAward',
          method: 'post',
          data: this.search_data
        }).then(data => {
          this.tableLoading = false;
          if (data.msgCode === '200') {
            this.table_data = data.data.records;
            this.table_data_total = data.data.total;
          } else {
            this.$Message.error({
              message: data.msgContent
            });
            this.table_data = [];
            this.table_data_total = 0;
          }
          this.$sdk.sendEvent({
            eventId: 'click_teacher_agent_queryAgentAward',
            eventParam: this.search_data
          });
        }).catch(message => {
          this.tableLoading = false;
          this.$Message({
            message
          });
        });
      },
      // 查询
      search() {
        this.search_data.pageNo = 1;
        this.getTableData();
      },
      seeInstore(id, month,state) {
        this.currentID = id;
        this.currentMonth = month;
        this.state = state;
        this.storeDialog = true;
      },
      setParms() {
        let p = {
          isWaitPay: false,
          list: []
        };
        for (let i = 0; i < this.selectName.length; i++) {
          if (this.selectName[i].state !== '2') {
            p.isWaitPay = true;
            return p
          } else {
            p.list.push({
              agentId: this.selectName[i].agentId,
              month: this.selectName[i].month
            })
          }
        }
        return p;
      },
      pays() {
        if (this.selectName.length <= 0) {
          this.$Message({
            message: "请选择数据"
          });
          return;
        }
        let result = this.setParms();
        if (result.isWaitPay) {
          this.$Message({
            message: "未满足条件的数据"
          });
          return;
        }
        this.sendRequest([...result.list])
      },
      pay(row) {
        this.sendRequest([{
          agentId: row.agentId,
          month: row.month
        }])
      },
      sendRequest(param) {
        this.$MessageBox.confirm(`确定支付吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.batchPayLoading = true;
          this.$Fetch({
            url: '/api/zm-teacher-recruit-web/channelRec/agent/payAgentAward',
            method: 'post',
            data: {payAgentAwardCmds: param}
          }).then(data => {
            this.batchPayLoading = false;
            let code = data.msgCode === '200';
            if (code) this.getTableData();
            this.$Message({
              type: code ? 'success' : 'error',
              message: code ? '操作成功' : data.msgContent
            });
          }).catch(message => {
            this.batchPayLoading = false;
            this.$Message({
              message: message
            });
          });
        }).catch(message => {
          this.operationsState = false;
        });
      }
    },
    computed: {
      permission: function () {
        return this.$store.getters.permission;
      }
    },
    mounted() {
      this.search();
    },
    components: {
      'in-list': inStoreList
    }
  }
</script>

<style lang="less" scoped>
  .isQuit {
    position: absolute;
    top: 10px;
    right: 0;
    color: #cc6666;
    font-size: 10px;
    line-height: 12px;
    transform: rotate(45deg);
  }
  .t-l {
    text-align: left;
  }
  .c-blue {
    color: blue;
  }
</style>
