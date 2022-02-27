<template>
    <div class="full-time-container" v-if="permission">
      <div class="context-head">
          <div class="tabPart">
              <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true">
                  <el-menu-item v-if="checkPermission('tea:reserve:wait-reserve')" index="/wait_entry">面试管理</el-menu-item>
                  <el-menu-item v-if="checkPermission('tea:interview:wait-interview')" index="/wait_entry/wait_entry_cultivate">培训管理</el-menu-item>
              </el-menu>
          </div>
      </div>
      <!--<keep-alive>-->
      <router-view></router-view>
      <!--</keep-alive>-->
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import { gradeSubject } from '../../../src/data/index.js';
export default {
    data() {
        return {
        }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {

    }
}
</script>
