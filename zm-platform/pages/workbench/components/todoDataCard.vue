<template>
  <div class="todoPageClass">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="待办事项" name="first">
        <awaitMatter></awaitMatter>
      </el-tab-pane>
      <el-tab-pane label="待面/待培" name="second" v-if="permissionList.indexOf('tea:workbench:trainTimePeriod') !== -1">
        <trainTimePeriod></trainTimePeriod>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import awaitMatter from './awaitMatter.vue';
import trainTimePeriod from './trainTimePeriod.vue';

export default {
  name: 'TodoDataCard',
  components: { awaitMatter, trainTimePeriod },
  data() {
    return {
      activeName: 'first',
    };
  },
  computed: {
    permissionList: function () {
      return this.$store.getters.permissionList || [];
    }
  },
};
</script>
<style lang="less">
.todoPageClass {
  background: #fff;
  padding-top: 10px;
  min-height: 450px;
  .el-tabs__content {
    overflow: initial;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid #e4e7ed;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #fff;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border: 1px solid #e4e7ed;
    border-right: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
    border-right: 1px solid #e4e7ed;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border-bottom: none;
    border-top: none;
    border-radius: 0 4px 0 0;
    box-sizing: border-box;
  }
}
</style>
