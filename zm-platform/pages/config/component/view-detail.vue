<template>
  <div>
    <el-dialog title="查看活动详情" class="spectial" v-model="dialogVisible">
      <el-form label-width="120px">
        <el-form-item label="活动名称：">
          <p>{{info.activitytitle}}</p>
        </el-form-item>
        <el-form-item label="渠道类型：">
          <p>{{info.channelTypeLabel}}</p>
        </el-form-item>
        <el-form-item label="BU：">
          <p>{{info.bus|buFilter}}</p>
        </el-form-item>
        <el-form-item label="老师性质：">
          <p>{{info.timetypes|timetypeFilter}}</p>
        </el-form-item>
        <el-form-item label="活动开始时间：">
          <p>{{info.activitystarttime}}</p>
        </el-form-item>
        <el-form-item label="活动结束时间：">
          <p>{{info.activityendtime}}</p>
        </el-form-item>
        <el-form-item label="活动奖励规则：">
          <el-button
            size="small"
            type="text"
            v-for="(item,index) in info.ruleNames?info.ruleNames.split(','):[]"
            :key="index"
            @click="goToRuleDetail(info.ruleIds.split(',')[index])"
          >{{item}}</el-button>
        </el-form-item>
        <el-form-item label="奖励截止天数：">
          <p>{{info.delaydays}}</p>
        </el-form-item>
        <el-form-item label="活动介绍链接：">
          <p>{{info.linkName}}</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <AddEdit ref="addEdit"></AddEdit>
  </div>
</template>
<script>
import AddEdit from "./../../activity_billing_management/addEdit.vue";
export default {
  components: {
    AddEdit
  },
  data() {
    return {
      dialogVisible: false,
      info: {
        bus:'',
        timetypes:''
      }
    };
  },
  methods: {
    init(row) {
      this.dialogVisible = true;
      this.info = row;
    },
    goToRuleDetail(ruleId) {
      this.$Fetch({
        url:
          "/api/zm-teacher-recruit-web/channel/activityRewardRule/getRuleDetail",
        method: "post",
        data: {
          ruleId
        }
      }).then(result => {
        this.$refs.addEdit.showDialog(result.data, true);
      });
    }
  },
  filters: {
    buFilter(val) {
      const _ = ["", "1对1", "少儿", "陪练","","优课"];
      return val
        .split(",")
        .map(item => {
          return _[item];
        })
        .join("、");
    },
    timetypeFilter(val) {
      const _ = ["兼职", "全职", "校招全职"];
      return val
        .split(",")
        .map(item => {
          return _[item];
        })
        .join("、");
    }
  }
};
</script>
<style lang="less" scoped>
  .el-button {
    white-space: normal;
    text-align: left;
  }
</style>

