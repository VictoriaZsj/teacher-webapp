<template>
  <!-- 批量发合同结果弹框 -->
  <div class="send_contract_results">
    <div class="section">
      <p>
        提示：共计
        <span class="important">{{
          send_results_info.failCount + send_results_info.successCount
        }}</span>
        条数据，成功
        <span class="green">{{ send_results_info.successCount }}</span> 条，失败
        <span class="red">{{ send_results_info.failCount }}</span>
        条
      </p>
      <p v-if="send_results_info.failedTeachers.length > 0">
        失败清单：
        <!-- {{ failedTeachersStr }} -->
        <span
          class="red"
          v-for="(item, index) in send_results_info.failedTeachers"
          :key="index"
        >
          {{ item.name }}
          {{ index < send_results_info.failedTeachers.length - 1 ? '，' : '' }}
        </span>
        {{
          type == 1
            ? '老师不满足签约条件，请处理后再重新发起'
            : '老师无可匹配的岗位信息，请调整老师BU/工作性质/老师类型，或者是在老师库新增岗位'
        }}
      </p>
    </div>
    <div
      class="section"
      v-if="type == 1 && send_results_info.failedTeachers.length > 0"
    >
      <p>处理方案：列表页【是否可签约】列，点击【处理方案】处理好即可</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'send_contract_results',
  data() {
    return {};
  },
  props: {
    send_results_info: {
      //
      type: Object,
      default: () => {
        return {
          failCount: 0,
          failedTeachers: [],
          successCount: 0
        };
      }
    },
    type: {
      // 1 批量发合同  2 批量重签合同
      type: Number,
      default: 1
    }
  },
  computed: {
    failedTeachersStr() {
      let str = '';
      let length = this.send_results_info.failedTeachers.length;
      this.send_results_info.failedTeachers.forEach((item, index) => {
        str += item.name + `${index < length - 1 ? '，' : ''}`;
      });

      return str;
    }
  }
};
</script>
<style lang="less" scoped>
.red {
  color: red;
}
.important {
  font-weight: bold;
}

.green {
  color: #67c23a;
}

p {
  margin-bottom: 10px;
}
.send_contract_results {
  font-size: 14px;

  .section {
    margin-bottom: 18px;
  }
}
</style>
