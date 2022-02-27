<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form" style="overflow:visible;">
      <el-form-item label="活动名称">
        <el-input v-model="search_data.activitytitle" placeholder="输入活动标题"></el-input>
      </el-form-item>
      <el-form-item label="活动渠道类型">
        <el-select v-model="search_data.channelTypes" clearable placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="(item,index) in channelType"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动状态">
        <el-select v-model="search_data.status" clearable placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="(item,index) in status_list"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间段">
        <el-date-picker
          :editable="false"
          v-model="searchActDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期"
          @change="chooseActDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动奖励">
        <el-select v-model="search_data.ruleIds" placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="(item,index) in active_award"
            :key="index"
            :label="item.ruleName"
            :value="item.id"
          >{{item.ruleName}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="search-btn" type="normal" size="small" @click="add()">新建</el-button>
        <el-button
          id="preTrainingSearchBtn"
          class="search-btn"
          icon="search"
          type="normal"
          size="small"
          @click="getTableData"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <span>共{{table_data_total}}个活动</span><br><br>
      <el-table :data="table_data" style="width:100%">
        <el-table-column prop="id" align="center" label="活动ID"></el-table-column>
        <el-table-column prop="activitytitle" align="center" label="活动名称"></el-table-column>
        <el-table-column align="center" label="活动渠道类型">
          <template  scope="scope">
            {{channelType.length>0?scope.row.channelTypes.split(',').map((channelTypeItem)=>{return channelType.find(channelItem=>channelItem.value == channelTypeItem).label}).join('、'):''}}
          </template>
        </el-table-column>
        <el-table-column prop="activitystarttime" align="center" label="活动开始时间">
          <template scope="scope">{{renderTime(scope.row.activitystarttime)}}</template>
        </el-table-column>
        <el-table-column prop="activityendtime" align="center" label="活动结束时间">
          <template scope="scope">{{renderTime(scope.row.activityendtime)}}</template>
        </el-table-column>
        <el-table-column prop="signNums" align="center" label="报名人数"></el-table-column>
        <el-table-column prop="entryNums" align="center" label="入库人数"></el-table-column>
        <el-table-column prop="ruleNames" align="center" label="活动奖励规则">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.ruleNames" placement="top-start">
              <p class="width-10">{{scope.row.ruleNames}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="linkName" align="center" label="活动介绍链接">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.linkName" placement="top-start">
              <p class="width-10">{{scope.row.linkName}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="活动状态">
          <template scope="scope">{{scope.row.status | statueFilter}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="60">
          <template scope="scope">
            <el-button size="small" type="text" @click="openShareSetting(scope.row)">分享配置</el-button>
            <el-button
              v-if="scope.row.status === 0 || scope.row.status === 1"
              size="small"
               @click="openEditTrain('edit',scope.row)"
              type="text"
            >修改</el-button>
            <el-button
              v-if="scope.row.status === 0 || scope.row.status === 1"
              size="small"
              @click="stop(scope.row.id,0)"
              type="text"
            >停用</el-button>
            <el-button
              v-if="scope.row.status == 3"
              size="small"
              @click="stop(scope.row.id,1)"
              type="text"
            >启用</el-button>
            <el-button
              v-if="scope.row.status == 2 || scope.row.status == 3"
              size="small"
              @click="view(scope.row.id)"
              type="text"
            >查看数据</el-button>
            <el-button
              size="small"
              @click="viewDetail(scope.row)"
              type="text"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search_data.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="search_data.pageSize"
        layout="sizes, prev, pager, next"
        v-bind:total="table_data_total"
      ></el-pagination>
    </div>
    <!--添加dialog-->
    <creat-active ref="creatActiveDialog" :channel-type="channelType"></creat-active>
    <share-config ref="shareConfigDialog"></share-config>
    <view-detail ref="viewDetailComponent"></view-detail>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import CreatActive from "../dialog/creat_active";
import shareConfig from "../dialog/share_config";
import getChannelType from './../../api/action/getChannelType';
import viewDetail from './component/view-detail.vue'

const status_list = [
  {
    label: "未开始",
    value: "0"
  },
  {
    label: "进行中",
    value: "1"
  },
  {
    label: "已结束",
    value: "2"
  },
  {
    label: "已关闭",
    value: "3"
  }
];
export default {
  components: { CreatActive, shareConfig,viewDetail },
  data() {
    return {
      searchActDateArea: [],
      channelType: [],
      status_list: status_list,
      active_award: [],
      search_data: {
        activitystarttime: "",
        activityendtime: "",
        activitytitle: "",
        channelTypes: "",
        status: "",
        ruleIds: "",
        time: "",
        pageNo: 1,
        pageSize: 10,
      },
      table_data: [],
      table_data_total: 0,
      tableLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  filters: {
    statueFilter(val) {
      if (val == "0") {
        return "未开始";
      }
      if (val == "1") {
        return "进行中";
      }
      if (val == "2") {
        return "已结束";
      }
      if (val == "3") {
        return "已关闭";
      }
      return "";
    }
  },
  created() {
    getChannelType()
      .then((data) => {
        this.channelType = data;
      })
      .catch((err) => {
      });
  },
  methods: {
    renderTime(date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    // 查询
    getTableData() {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/activity/query",
        method: "post",
        data: this.search_data
      }).then(result => {
        const data = result.data;
        const code = result.msgCode;
        const message = result.msgContent;
        if (code == 200) {
          this.table_data = data.records;
          this.table_data_total = data.total;
        } else {
          this.$Message({
            message
          });
        }
      });
    },
    getQueryConfig() {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/activity/queryConfig",
        method: "post",
        data: {
          ruleName: ""
        }
      }).then(result => {
        const data = result.data;
        const code = result.msgCode;
        const message = result.msgContent;
        if (code == 200) {
          this.active_award = data.rewardRules;
        } else {
          this.$Message({
            message
          });
        }
      });
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
    chooseActDate() {
      if (this.searchActDateArea[0] == null) {
        this.search_data.activitystarttime = "";
        this.search_data.activityendtime = "";
      } else {
        let sDate = new Date(this.searchActDateArea[0]).getTime();
        let eDate = new Date(this.searchActDateArea[1]).getTime();
        this.search_data.activitystarttime =
          this.$DateTool.format(sDate, "yyyy-MM-dd") + " 00:00:00";
        this.search_data.activityendtime =
          this.$DateTool.format(eDate, "yyyy-MM-dd") + " 23:59:59";
      }
    },
    add() {
      this.$refs.creatActiveDialog.init();
    },
    openEditTrain(_edit, _data){
        this.$refs.creatActiveDialog.editData(_edit, _data);
    },
    stop(id,status){
        this.$Fetch({
            url: "/api/zm-teacher-recruit-web/api/activity/enableOff",
            method: "post",
            data: {
                actId: id,
                enableOff: status,
            }
        }).then(result => {
            const data = result.data;
            const code = result.msgCode;
            const message = result.msgContent;
            if (code == 200) {
                this.$Message({
                    message
                });
                this.getTableData();
            } else {
                this.$Message({
                    message
                });
            }
        });
    },
    openShareSetting(data){
        this.$refs.shareConfigDialog.openInit(data);
    },
    view(id){
        this.$router.push("/config/teaData",);
        this.$router.push({ name: '渠道管理-渠道招师数据',  query: { id: id } })
    },
    viewDetail(row){
      let channelTypeLabel = this.channelType.length>0?
        row.channelTypes.split(',').map((channelTypeItem)=>{
        return this.channelType.find(channelItem=>channelItem.value == channelTypeItem).label}).join('、')
        :'';
        row.channelTypeLabel = channelTypeLabel;
      this.$refs.viewDetailComponent.init(row);
    }
  },
  computed: {
    permission: function() {  
      return this.$store.getters.permission;
    }
  },
  mounted() {
    this.getTableData();
    this.getQueryConfig();
  }
};
</script>
<style lang="less" scoped>
.width-10{
  width:100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>