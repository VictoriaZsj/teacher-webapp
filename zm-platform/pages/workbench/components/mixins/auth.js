export default {
  data() {
    return {
      roleCode: 0,
      orgCode: "",
      currentRole:''
    };
  },
  created() {
    let authInfo = this.$store.state.workbench.authInfo;
    if (authInfo.roleCode === undefined) {
      let fn = this.$store.watch(
        (state) => {
          return state.workbench.authInfo;
        },
        (authInfo) => {
          if (authInfo.roleCode !== undefined) {
            this.disposeAuthInfo(authInfo);
            this.handleSearch();
            fn();
          }
        }
      );
    } else {
      this.disposeAuthInfo(authInfo);
      this.handleSearch();
    }
  },
  computed:{
    permissionList() {
      return this.$store.getters.permissionList;
    }
  },
  methods: {
    handleCycleChange(val) {
      this.params.timeType = val;
      this.handleSearch();
    },
    getCountDays() {
        var curDate = new Date();
      /* 获取当前月份 */
        var curMonth = curDate.getMonth();
      /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
      curDate.setMonth(curMonth + 1);
      /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
      curDate.setDate(0);
      /* 返回当月的天数 */
      return curDate.getDate();
    },

    handleRefresh() {
      let offset=( Date.parse(new Date(this.params.endTime).format('yyyy-MM-dd'))-Date.parse(new Date(this.params.startTime).format('yyyy-MM-dd')))/(3600*1000*24)
      if(offset>31){
        this.$Message.error('日期范围不能超过1个月！')
      }else{
        this.handleSearch();
      }

    },
    disposeAuthInfo(info) {
      let { roleCode, orgDtoList } = info;
      if (roleCode === 1) {
        //管理员
      } else if (roleCode === 2) {
        //招师专员
        this.orgCode = orgDtoList[0] ? orgDtoList[0].orgCode : "";
        this.params.orgCode = this.orgCode;
      } else {
        this.params.optionType = "1";
      }
      this.roleCode = roleCode;
      this.currentRole=this.roleCode
    },
    handleDataTypeChange(val) {
      if (val === "0") {
        if (this.roleCode === 2) {
          this.params.orgCode = this.orgCode;
        } else {
          this.params.orgCode = "";
        }
        this.params.optionType = "0";
      } else if (val === "1") {
        this.params.orgCode = "";
        this.params.optionType = "1";
      } else if (val) {
        this.params.orgCode = val;
        this.params.optionType = "2";
      }
      this.handleSearch();
    },
    handleDateChange(val){
      this.params.startTime=new Date(val[0]).format('yyyy-MM-dd 00:00:00')
      this.params.endTime=new Date(val[1]).format('yyyy-MM-dd 23:59:59')
    },
    has(name) {
      return this.permissionList.includes(name);
    }
  },
};
