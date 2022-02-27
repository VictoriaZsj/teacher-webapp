<template>
    <div class="context" v-if="checkPermission('tea:agent:agent-member')">
        <div class="context-head">
            <div class="tabPart">
                <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true">
                    <el-menu-item  index="/agent_list">内部代理</el-menu-item>
                    <el-menu-item  index="/agent_list/agent_out">外部代理</el-menu-item>
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
export default {
    data() {
        return {
        }
    },
    methods: {
        checkPermission(PermissionName) {
            // console.log("this.$store.getters.permissionList",this.$store.getters);
            return (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1;
        }
    },
    mounted() {
    }
}
</script>
