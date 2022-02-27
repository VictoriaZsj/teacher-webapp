<template>
    <div class="context" v-if="permission">
        <main-tab v-if="titleList" :titleList="titleList" :activeIndex="activeIndex" @onTabClick="handleTabClick"></main-tab>
        <div class="dashboard-head">
            <el-date-picker :editable="false" v-model="date" type="daterange" align="right" size="small" placeholder="选择日期范围">
            </el-date-picker>
            <el-button type="text" icon="search" size="small" @click="search">搜索</el-button>
            <span class="icon-fullscreen" @click="fullscreen('.dashboard-iframe')"></span>
        </div>
        <iframe class="dashboard-iframe" allowfullscreen src="" frameborder="0"></iframe>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>
<script>
export default {
    name: 'Dashboard',
    props: {
        permissionName: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            date: [],
            titleList: false,
            activeIndex: 0,
        };
    },
    computed: {
        permission: function() {
            return this.$store.getters.permission;
        }
    },
    methods: {
        fullscreen(e) {
            const ele = document.querySelector(e);
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            } else if (ele.mozRequestFullscreen) {
                ele.mozRequestFullscreen();
            } else if (ele.msRequestFullscreen) {
                ele.msRequestFullscreen();
            } else if (ele.webkitRequestFullscreen) {
                ele.webkitRequestFullscreen();
            }
        },
        search() {
            const month = (new Date().getMonth() < 9 ? "0" : 0) + (new Date().getMonth() + 1);
            const year = new Date().getFullYear();
            const lastDay = new Date(year, month, 0).getDate();

            let start, end;
            console.log("this.date", this.date);
            if (this.date.length === 0) {
                this.date.push(this.$DateTool.parse(`${year}-${month}-01`, 'yyyy-MM-dd'));
                this.date.push(this.$DateTool.parse(`${year}-${month}-${lastDay}`, 'yyyy-MM-dd'));
                start = `${year}-${month}-01`;
                end = `${year}-${month}-${lastDay}`;
            } else {
                start = this.$DateTool.format(this.date[0], 'yyyy-MM-dd');
                end = this.$DateTool.format(this.date[1], 'yyyy-MM-dd');
            }
            const dashboardName = this.$store.state.menu.cName;
            const reports = this.$store.state.menu.reports;
            // const iframeSrc = `http://120.26.117.71:8080/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2Finteractive&reportUnit=%2Freports%2Finteractive%2F${dashboardName}&standAlone=true&decorate=no&j_username=jasperreader&j_password=zUq-FFm-Aug-fw8&开始时间=${start}%2000:00:00&结束时间=${end}%2023:59:59`;
            const iframeSrc = `https://report01.zmlearn.com/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2F${reports}&reportUnit=%2Freports%2F${reports}%2F${dashboardName}&standAlone=true&decorate=no&j_username=jasperreader&j_password=zUq-FFm-Aug-fw8&开始时间=${start}%2000:00:00&结束时间=${end}%2023:59:59`;
            console.log("dashboardName", dashboardName);
            console.log("iframeSrc", iframeSrc);
            document.querySelector(".dashboard-iframe").src = iframeSrc;
        },
        handleTabClick(clickTarget) {
            const index = clickTarget.index;
            this.activeIndex = index;
            this.$store.commit('UPDATE_MENUCNAME',this.$route.meta.cName[index]);
            this.date = [];
            this.search();
        },

    },
    mounted() {
        if (this.$route.meta.titleList) {
            this.titleList = this.$route.meta.titleList;
        }

        setTimeout(function(){
            console.log("dashboard permission",this.permission);
            if (this.permission) {
                this.search();
            }
        }.bind(this),500);
    },
    watch: {
        "$route"() {
            this.date = [];
            this.activeIndex = 0;
            if (this.$route.meta.titleList) {
                this.titleList = this.$route.meta.titleList;
            } else {
                this.titleList = false;
            }
            if (this.permission) {
                this.$nextTick(function(){
                    this.search();
                });
            } else {
                this.search();
            }
        },
        // setPermission(val) {
        //     if (val) {
        //         this.$nextTick(() => {
        //             this.search();
        //         });
        //     }
        // },
        deep: true
    }
};
</script>
