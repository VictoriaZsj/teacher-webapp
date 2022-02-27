<template>
  <div class="oc-salary">
    <p class="fail-content">
      <span>{{checkStr}}老师定薪状态不满足或未入库，无法发offer，</span>
      <span class="f-weight">请联系招师专员处理后再发</span></p>
    <el-table :data="offerNCData">
      <el-table-column prop="name" align="center" label="老师名称" min-width="100">
      </el-table-column>
      <el-table-column prop="mobile" align="center" label="手机号" min-width="100">
      </el-table-column>
      <el-table-column prop="followPerson" align="center" label="招师专员" min-width="100">
      </el-table-column>
      <el-table-column prop="fixedSalaryState" align="center" label="定薪状态" min-width="120">
        <template scope="scope" >
          <span>
          {{scope.row.fixedSalaryState | fixedSalaryStateFilter}}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer close-check">
      <el-button type="primary" @click="confirmCheckSalary()">关闭</el-button>
    </span>
  </div>
</template>

<script>
export default {
  props: [
    'offerNoticeCheckData', 'offerCheckType', 'hasUnCheckIn'
  ],
  components: {},
  data () {
      return {
        offerNCData: [],
        checkStr: '', // 列表头部提醒文案
      }
  },
  computed: {
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 初始化定薪状态校验数据
    initData() {
      this.offerNCData = this.offerNoticeCheckData;
      let successCount = 0; // 定薪校验成功数量
      let failCount = 0; // 定薪校验失败数量
      for(let i = 0; i < this.offerNCData.length; i++) {
        if (this.offerNCData[i].fixedSalaryState == 2) {
          successCount += 1;
        } else {
          failCount += 1;
        }
      }
      // 批量offer通知时，如发送失败，则给出校验
      if (this.hasUnCheckIn && this.hasUnCheckIn === '批量未入库') {
        successCount = 0;
        failCount = this.offerNoticeCheckData.length;
      }
      this.checkStr = this.offerCheckType === '单个' ? '以下' :
      `选中${this.offerNoticeCheckData.length}条，${successCount}条发送成功，${failCount}条发送失败，失败清单如下，`;
    },
    confirmCheckSalary() {
      this.$emit('cancel');
    }
  },
  filters:{
    fixedSalaryStateFilter(val) {
      let salaryVal = '';
      switch (val) {
        case 0:
          salaryVal = '未定薪';
          break;
        case 1:
          salaryVal = '定薪待审核';
          break;
        case 2:
          salaryVal = '已定薪[未入库]';
          break;
        default:
        }
      return salaryVal;
    }
  },
}
</script>
<style lang="less" scoped>
.oc-salary {
  .fail-content {
    font-size: 14px;
    padding-bottom: 30px;
    .f-weight {
      font-weight: bold;
    }
  }
  .close-check {
    display: block;
    width: 100%;
    text-align: right;
    margin-top: 25px;
  }
}
</style>
