
<template>
	<div class="wrapper zm_learn_form">
		<div class="menu-head" v-bind:class="{ 'nav-in':menuIn }">
    
			<div v-if="!isWorkbench" class="menu-title"><i class="el-icon-menu" style="margin-right: 5px"></i>{{$route.name}}
			</div>
			<div v-else class="jitang-title"><i class="iconfont icon-yinhao1"></i>{{randomJiTang}}<i class="iconfont icon-yinhao2"></i></div>
			<div class="attention">
				<el-dropdown trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{username}}<i class="el-icon-caret-bottom el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="clearfix">
							通知
							<el-badge class="mark" :value="0"></el-badge>
						</el-dropdown-item>
						<el-dropdown-item class="clearfix">
							公告
							<el-badge class="mark" :value="0"></el-badge>
						</el-dropdown-item>
						<el-dropdown-item class="clearfix" command="logout">
							退出登录
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>

      
      <div v-if="checkPermission('tea:getLink')">
        <el-popover
          ref="popover5"
          placement="top"
          width="260"
          v-model="visible2">
          <p>{{commissionInfoUrl}}</p>
          <div style="text-align: right; margin: 0">
            <el-button type="text" size="mini" @click="copySpecialLink" data-clipboard-target="div">点击复制链接</el-button>
          </div>
        </el-popover>
        
        <div class="currentLink" v-popover:popover5   >获取专属完善信息链接</div>
        
      </div>
      <div style="float: right;width:400px" v-show="$route.path=='/workbench'">
        <span style="margin-right:10px">学校查询</span>   
        <el-input size='medium' v-model="collegeName" class="topSeachInput" clearable placeholder="学校等级查询（支持模糊查询）" style="width:50%;margin-right:15px;margin-top:19px;"></el-input>
        <el-button type="primary" style="border-radius:5px;height: 32px;padding: 8px 15px;" @click='getList'>查询</el-button>
      </div>
		</div>
     
		<div class="menu-main-left-container" v-bind:class="{ 'menu-in':menuIn }">
      <div class="menu-left-head">
        <span v-if="menuIn" class="logo iconfont icon-logo_mini"></span>
        <span v-else class="logo iconfont icon-logo"></span>
      </div>
			<el-menu-new :default-active="activeLink" :unique-opened="true" :router="true" class="menu-main-left"
									 :collapse="menuIn">
				<template v-for="(item, index) in menuLists">
					<el-submenu-new v-if="item.subMenu" :index="String(index)" class="mainFn2" :key="index">
						<template slot="title">
							<i class="iconfont" style="margin-right: 8px; font-size: 16px" :class="{[item.icon]: true}"></i>
                  <span>{{item.menuName}}</span>
						</template>
						<template v-for="(menu, menuIndex) in item.subMenu">
							<el-menu-item-new :key="menuIndex" @click="menuClick(menu.path)"
																:index="['teajump', 'recycleBinJump'].includes(menu.path) ? '' : menu.path"
																v-if="checkPermission(menu.permission)">

                <span>{{menu.menuName}}</span>
							</el-menu-item-new>
						</template>
					</el-submenu-new>
					<el-menu-item-new v-else :key="index" :index="item.path" @click="menuClick(item.path)">
						<i class="iconfont" style="margin-right: 8px; font-size: 16px" :class="{[item.icon]: true}"></i>
            <span slot="title">
                <el-badge :value="badgeVal" class="nav-badge" v-if="item.menuName=='移交申请管理'">
                  <span>{{item.menuName}}</span>
                </el-badge>
                <span v-else>{{item.menuName}}</span>
            </span>

					</el-menu-item-new>
				</template>
			</el-menu-new>
		</div>
    <div class="menu-left-btn" :class="{'menu-in': menuIn }" @click="toggleClick">
    </div>

		<div class="container" :class="{ 'container-out':menuIn }">
			<router-view></router-view>
		</div>
		<preview-img :path="previewImg.path" @closePreviewImg="hideBigImg" v-show="previewImg.state">
		</preview-img>
		<interview-details @cancel="hideInterviewDetails" :data="interviewDetailsData" :view-state="interviewDetailsState"
											 v-if="interviewDetailsState">
		</interview-details>

    <el-dialog title="查询结果" v-model="dialogTableVisible"  class="topTable">
      <el-table :data="gridData" border v-if='gridData.length>0'>
        <el-table-column property="collegeName" align='center' label="学校" ></el-table-column>
        <el-table-column property="level" align='center' label="等级"></el-table-column>
      </el-table>
      <el-pagination
        background v-if='gridData.length>0'
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="pageNo"
        :page-size="pageSize"
        style="text-align:center"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <h2 v-else style="text-align:center;height:400px;line-height:400px">未查询到结果</h2>
    </el-dialog>
	</div>

</template>
<script>
import previewImg from './pages/dialog/preview_img';
import interview_details from './pages/dialog/interview_details';
import JI_TANG from './jitang';
import Cookies from "js-cookie";
export default {
  data() {
    return {
      dialogTableVisible:false,
      commissionInfoUrl:'',
      visible2:false,
      permissionList: [],
      interviewDetailsState: false,
      interviewDetailsData: null,
      remark: null,
      previewImg: {
        state: false,
        path: '',
      },
      firstIn: false,
      JI_TANG,
      randomJiTang: '',
      isWorkbench: false,
      badgeVal:null,
      collegeName:'',
      total:0,
      gridData:[],
      pageSize:10,
      pageNo:1
    };
  },

  computed: {
    menuLists() {
      return this.$store.getters.menuList.filter(
        item => this.checkPermission(item.permission) && item.ext1 !== '4'
      );
    },
    menuIn() {
      return !this.$store.getters.menu.opened;
    },
    activeLink() {
      return this.$store.getters.activeLink;
    },
    username() {
      return this.$store.getters.username;
    },
  },
  created() {
    this.randomJiTang = JI_TANG[Math.floor(Math.random() * JI_TANG.length)];
  },
  mounted() {
    this.firstIn = !Cookies.get("menuStatusNew");

  },
  components: {
    'preview-img': previewImg,
    'interview-details': interview_details,
  },
  methods: {
   
    getList(){
      this.gridData=[]
      this.$Fetch({
            url: '/getSchools',
            method: 'post',
            data:{
              collegeName:this.collegeName,
              pageNo:this.pageNo,
              pageSize:this.pageSize
            }
          })
            .then((res) => {
              if(res.data){
                this.dialogTableVisible=true
                this.total=res.data.total;
                this.gridData=res.data.list
              }
                
            }).catch((res)=>{
              this.$Message.error(res)
            })
    },
    handleSizeChange(val) {
        this.pageNo=1;
        this.pageSize=val;
        this.getList()
      },
      handleCurrentChange(val) {
         this.pageNo=val 
         this.getList()
      },
    checkPermission(PermissionName) {
      let temp = false;
      PermissionName.split(' ').forEach(val => {
        if (this.$store.state.permissionList.indexOf(val) > -1) {
          temp = true;
        }
      });
      return temp;
    },
    hideInterviewDetails() {
      this.interviewDetailsState = false;
    },
    showInterviewDetails(data) {
      if (!data) {
        this.$Message({
          message: '数据不存在',
        });
        return;
      }

      this.interviewDetailsData = data;
      this.interviewDetailsState = true;
    },
    toggleClick() {
      this.$store.dispatch('ToggleMenu');
      this.firstIn = false;
    },
    handleCommand(command) {
      if (command == 'logout') {
        window.location.href = window.location.origin + '/logout';
      }
    },
    showBigImg(path) {
      this.previewImg.state = true;
      this.previewImg.path = path;
    },
    hideBigImg() {
      this.previewImg.state = false;
    },
    menuClick(path) {
      if (path === 'teajump') {
        this.toTealib();
      } else if (path === 'recycleBinJump') {
        this.toRecycleBin();
      }
    },
    toTealib() {
      let teaLibUrl =
        window.location.protocol + '//' + window.location.host + '/tea-library';
        window.open(teaLibUrl);
        this.$router.go(-1)
    },
    toRecycleBin() {
      let recycleBinUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        '/tea-library/tea-recycle.html';
      window.open(recycleBinUrl);
      // window.open('https://portal.zmlearn.com/tea-library/tea-recycle.html')
    },
    getInfoUrl(){

      this.$Fetch({
        url: '/api/dataView/commissioner/getCommissionerLink',
        method: 'post',
        data: {}
      }).then(result=>{
        let { data, code, message } = result;

        if (code == '0') {

          this.commissionInfoUrl=data
        } else {

          this.$Message.error(
            message
          );
        }
      }).catch(err=>{
        this.$Message.error(
            err
          );
      })
    },
    getBadgeForTransferApplication(){

      this.$Fetch({
        url: '/api/teacherTransfer/selectPendingTransferRecordCount',
        method: 'get',
      }).then(result=>{
        let { data, code, message } = result;
        if (code == '0') {
         this.badgeVal=data;
        } else {
          this.$Message.error(
            message
          );
        }
      }).catch(err=>{
        this.$Message.error(
            err
          );
      })
    },
    // 点击复制“专属完善信息链接"，复制到粘贴板
    copySpecialLink() {
      this.visible2 = false;
      let tmpInput = document.createElement("input");   // 构建临时input
      tmpInput.value = this.commissionInfoUrl || '';  // 设置内容
  　　document.body.appendChild(tmpInput);    // 添加临时实例
      tmpInput.select();   // 选择实例内容
  　　document.execCommand("Copy");   // 执行复制
  　　document.body.removeChild(tmpInput); // 删除临时实例
    },
  },

  watch: {
    dialogTableVisible(val){
      if(val){
         this.getList()
      }
    },
    menuLists(val){
      let hasTransfer_route=val.some(item=>{
        return item.permission=='tea:transfer:application'
      })
      if(hasTransfer_route){
         this.getBadgeForTransferApplication();
         setInterval(this.getBadgeForTransferApplication,60000)
      }
    },
    visible2(val){
      if(val){
        this.getInfoUrl()
      }
    },
    $route: function() {
      if (this.$route.path === '/workbench') {
        this.isWorkbench = true;
      } else {
        this.isWorkbench = false;
      }
    },
  },
};
</script>
<style lang="less">
@import '../src/styles/index.less';
@import '../src/styles/app.less';
.topTable{
    .el-dialog{
      .el-dialog__body{
       background:#fff;
      .el-table.el-table--fit.el-table--border{
        border-left:1px solid #eee
      }
    }
    }
    
  }
.topSeachInput{
  .el-input__inner{
    height: 32px;
  }
}  
</style>
