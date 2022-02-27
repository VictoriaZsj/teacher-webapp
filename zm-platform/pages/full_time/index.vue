<template>
    <div class="context" v-if="checkPermission('tea:process:old')">
        <div class="context-head">
            <div class="tabPart">
                <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true">
                    <el-menu-item v-if="checkPermission('tea:reserve:wait-reserve')" index="/full_time">待预约</el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:interview:wait-interview')" index="/full_time/bef_int">待面试</el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:offer:wait-offer')" index="/full_time/chat_off">培训通知</el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:train:wait-train')" index="/full_time/pre_tra">待培训</el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:entry:wait-entry')" index="/full_time/pre_ent">待入职</el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:entried:will-have-money')" index="/full_time/ent_list">入职名单</el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:over:far-far-away')" index="/full_time/quit">离职名单</el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:recycle:recycle-bin')" index="/full_time/recy">回收站</el-menu-item>
                    <el-input placeholder="姓名/手机号码" v-model="searchData" width="150" size="small" icon="search" :on-icon-click="search"></el-input>
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
import { fullTimePathInfo } from '../../../src/data/index';
export default {
    data() {
        return {
            searchData: '',
            keyWord:''
        }
    },
    mixins:[Emitter],
    methods: {
        checkPermission(PermissionName) {
            return (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1;
        },
        search() {
            this.$Fetch({
                url: `/api/recruit/common-search?keyWord=${this.searchData}`,
                method: 'get',
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    const path = `/full_time${fullTimePathInfo[data.state]}`;
                    const keyWord = this.searchData;
                    // this.broadcast('processTable','search',{ keyWord });
                    this.$children[1].$emit('search',{keyWord})
                    this.$router.push({ path, query: { keyWord } });
                } else {
                    this.$Message({
                        message
                    });
                }
            });
        }
    },
    computed: {
        tabs_title() {
            return this.$store.state.tabs_title;
        },
        activeIndex() {
            return "book";
        },
    },
    mounted() {
    },

}
</script>
