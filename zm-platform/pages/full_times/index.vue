<template>
    <div class="full-times-context" v-if="checkPermission('recruit:process:fulltime')">
        <div class="context-head">
            <div class="tabPart tabPartLarge">
                <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true" v-if="showRouteFlg"><!--v-show="showRouteFlg"-->
                    <el-menu-item v-if="checkPermission('unassgin')" index="/full_times"> 待分配管理({{unAssign_count}}) </el-menu-item>
                    <el-menu-item v-if="checkPermission('recruit:process:fulltime:interview')" index="/full_times/pre_training"> 面试管理({{pre_training_count}}) </el-menu-item>
                    <el-menu-item v-if="checkPermission('recruit:process:fulltime:train')" index="/full_times/bef_int"> 培训管理({{before_interview_count}}) </el-menu-item>
                    <el-menu-item v-if="checkPermission('tea:process:ftime:entry:manage')" index="/full_times/wait_entry"> 入职管理({{entrynum_count}}) </el-menu-item>
                    <el-menu-item v-if="checkPermission('recruit:process:fulltime:tryOut')" index="/full_times/pre_ent"> 试用期管理({{pre_entry_count}}) </el-menu-item>
                    <el-menu-item v-if="checkPermission('recruit:process:fulltime:regular')" index="/full_times/ent_list"> 转正管理({{entry_list_count}}) </el-menu-item>
                    <el-menu-item v-if="checkPermission('recruit:process:fulltime:leave')" index="/full_times/leave_list"> 离职管理({{leave_list_count}}) </el-menu-item>
                    <!-- <el-menu-item v-if="checkPermission('recruit:process:fulltime:recycle')" index="/full_times/recy"> 回收站({{recycle_count}}) </el-menu-item> -->
                    <!-- <el-input placeholder="姓名/手机号码" v-model="searchData" width="150" size="small" icon="search" :on-icon-click="search"></el-input> -->
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
import overview from '../../api/select/overview';

export default {
    data() {
        return {
          searchData: '',
          keyWord:'',
          unAssign_count:0,
          pre_training_count:0,//面试管理个数
          entrynum_count:0,
          before_interview_count:0,//培训管理个数
          pre_entry_count:0,//试用期管理个数
          leave_list_count:0,//离职数目
          entry_list_count:0,//转正管理个数
          recycle_count:0,//回收站管理个数
          showRouteFlg: true, // 是否显示顶部子菜单
        }
    },
    mixins:[Emitter],
    methods: {
        checkPermission(PermissionName) {
          // 批量审核薪资页，隐藏顶部route菜单
          if (window.location.href.indexOf('/full_times/batchCheck') > -1 ) {
            this.showRouteFlg = false;
          } else {
            this.showRouteFlg = true;
          }
          return (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1;
        },
        getOverview () {
          overview().then(data => {
            if(!!data.unAssign){//招聘管理
              this.unAssign_count = data.unAssign;
            }
            if(!!data.recruit){//招聘管理
              this.pre_training_count = data.recruit;
            }
            if(!!data.training){//培训管理
              this.before_interview_count = data.training;
            }
            if(!!data.tryout){//试用期管理
              this.pre_entry_count = data.tryout;
            }
            if(!!data.regular){//转正管理
              this.entry_list_count = data.regular;
            }
            if(!!data.leavenum){//离职管理
              this.leave_list_count = data.leavenum;
            }
            if(!!data.recycle){//回收站管理
              this.recycle_count = data.recycle;
            }
            if(!!data.entrynum){
              this.entrynum_count = data.entrynum;
            }
          }).catch(message => {

          });
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
            }).catch(message => {
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
      this.getOverview();
    },

}
</script>
<style lang="less">
@import "../../../src/styles/full_time/index.less";
</style>

