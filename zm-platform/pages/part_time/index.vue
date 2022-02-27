<template>
    <div class="part-time-context" v-if="checkPermission('recruit:process:parttime')">
        <div class="context-head">
            <div class="tabPart tabPartLarge">
                <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true">
                    <el-menu-item v-if="checkPermission('recruit:process:parttime:interview')" index="/part_time"> 面试管理 </el-menu-item>
                    <el-menu-item v-if="checkPermission('recruit:process:parttime:train')" index="/part_time/train"> 培训管理 </el-menu-item>
                    <el-menu-item v-if="checkPermission('recruit:process:parttime:entry')" index="/part_time/entry"> 入职管理 </el-menu-item>
                    <!-- <el-menu-item v-if="checkPermission('recruit:process:parttime:store')" index="/part_time/store"> 入库管理 </el-menu-item> -->
                    <!-- <el-menu-item v-if="checkPermission('recruit:process:parttime:recycle')" index="/part_time/recycle"> 回收站 </el-menu-item> -->
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
import Emitter from '../../../src/mixins/emitter';

export default {
    data() {
        return {

        }
    },
    mixins:[Emitter],
    methods: {
        checkPermission(PermissionName) {
            return (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1;
        },
        search() {
        }
    },
    mounted() {
        this.search();
    },
    computed: {

    }
}
</script>
<style lang="less">
@import "../../../src/styles/part_time/index.less";
</style>
