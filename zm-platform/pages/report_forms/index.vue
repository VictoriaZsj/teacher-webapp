<template>
  <div v-if="checkPermission('tea:agent:agent-member')">
    <router-view></router-view>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
  export default {
    methods: {
      checkPermission(PermissionName) {
        return (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1;
      }
    }
  }
</script>

<style scoped>

</style>
