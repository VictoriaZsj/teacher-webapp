import childRooter from "../pages/iframe_report/iframe";

export default [
  // 首页
  {
    path: "/",
    redirect: "/workbench",
    component: (resolve) => require(["../pages/home"], resolve),
    name: "首页",
  },
  {
    path: "/workbench",
    name: "招师工作台",
    component: (resolve) =>
      require(["../pages/workbench/index.vue"], resolve),
    meta: { permissionName: "tea:workbench" },
  },
  {
    path: "/resume_record",
    name: "简历投递记录",
    component: (resolve) =>
      require([
        "../pages/resume_manage/resume_record.vue",
      ], resolve),
    meta: {
      permissionName: "tea:resume:record",
    },
  },
  {
    path: "/resume_list",
    name: "简历汇总报表",
    component: (resolve) =>
      require([
        "../pages/resume_manage/resume_list.vue",
      ], resolve),
    meta: {
      permissionName: "tea:resume:list",
    },
  },
  // 报名配置
  {
    path: "/config_name",
    component: (resolve) =>
      require(["../pages/config_name/index.vue"], resolve),
    name: "招师配置-报名配置",
    meta: {
      permissionName: "tea:recruit:entry-config",
    },
  },
  {
    path: "/config_name_new",
    component: (resolve) =>
      require(["../pages/config_name_new/index.vue"], resolve),
    name: "招师配置-报名配置（新）",
    meta: {
      permissionName: "tea:recruit:config_name_new",
    },
  },

  // 约面/约培上限配置
  {
    path: "/config/interviewed",
    component: (resolve) =>
      require(["../pages/config_interviewed/index.vue"], resolve),
    name: "招师配置-约面/约培上限配置",
    meta: {
      permissionName: "tea:config:interviewed",
    },
  },

  // 移交申请管理
  {
    path: "/teacher/transferApplication",
    component: (resolve) =>
      require(["../pages/transferApplication/index.vue"], resolve),
    name: "移交申请管理",
    meta: {
      permissionName: "tea:transfer:application",
    },
  },

  // 专员配置
  {
    path: "/config_person",
    component: (resolve) => require(["../pages/config_person"], resolve),
    name: "招师配置-招师专员配置",
    meta: { permissionName: "tea:recruit:member-config" },
  },

  // KPI配置
  {
    path: "/config_kpi",
    component: (resolve) => require(["../pages/config_kpi"], resolve),
    name: "招师配置-KPI配置",
    meta: {
      permissionName: "tea:kpi:config",
    },
  },

  // 自动进回收站配置
  {
    path: "/configRecycle",
    component: (resolve) => require(["../pages/configRecycle"], resolve),
    name: "招师配置-自动进回收站配置",
    meta: {
      permissionName: "tea:recycle:config",
    },
  },
  // 名单等级配置
  {
    path: "/config/list_level",
    component: (resolve) => require(["../pages/config_list_level"], resolve),
    name: "招师配置-名单等级配置",
    meta: {
      permissionName: "tea:config:list-level",
    },
  },
  // 推荐岗位标签配置
  {
    path: "/config/station",
    component: (resolve) => require(["../pages/config_list_station"], resolve),
    name: "招师配置-推荐岗位标签配置",
    meta: {
      permissionName: "tea:config:station",
    },
  },
  // tab UI
  {
    path: "/tab",
    component: (resolve) => require(["../pages/tab"], resolve),
    name: "tab UI",
  },

  // 培训签到
  {
    path: "/arrive",
    component: (resolve) => require(["../pages/autoCom"], resolve),
    name: "培训签到",
  },

  // 全职招师
  {
    path: "/full_time",
    component: (resolve) => require(["../pages/full_time"], resolve),
    children: [
      {
        path: "",
        name: "招师流程-全职招师",
        component: (resolve) =>
          require(["../pages/full_time_dir/book.vue"], resolve),
        meta: {
          permissionName: "tea:process:old",
        },
      },
      {
        path: "bef_int",
        name: "招师流程-全职招师-待面试",
        component: (resolve) =>
          require(["../pages/full_time_dir/before_interview.vue"], resolve),
        meta: {
          permissionName: "tea:interview:wait-interview",
        },
      },
      {
        path: "book",
        name: "招师流程-全职招师-待预约",
        component: (resolve) =>
          require(["../pages/full_time_dir/book.vue"], resolve),
        meta: {
          permissionName: "tea:reserve:wait-reserve",
        },
      },
      {
        path: "chat_off",
        name: "招师流程-全职招师-培训通知",
        component: (resolve) =>
          require(["../pages/full_time_dir/chat_offer.vue"], resolve),
        meta: {
          permissionName: "tea:offer:wait-offer",
        },
      },
      {
        path: "pre_tra",
        name: "招师流程-全职招师-待培训",
        component: (resolve) =>
          require(["../pages/full_time_dir/pre_training.vue"], resolve),
        meta: {
          permissionName: "tea:train:wait-train",
        },
      },
      {
        path: "pre_ent",
        name: "招师流程-全职招师-待入职",
        component: (resolve) =>
          require(["../pages/full_time_dir/pre_entry.vue"], resolve),
        meta: {
          permissionName: "tea:entry:wait-entry",
        },
      },
      {
        path: "ent_list",
        name: "招师流程-全职招师-入职名单",
        component: (resolve) =>
          require(["../pages/full_time_dir/entry_list.vue"], resolve),
        meta: {
          permissionName: "tea:entried:will-have-money",
        },
      },
      {
        path: "quit",
        name: "招师流程-全职招师-离职名单",
        component: (resolve) =>
          require(["../pages/full_time_dir/quit.vue"], resolve),
        meta: {
          permissionName: "tea:over:far-far-away",
        },
      },
      {
        path: "recy",
        name: "招师流程-全职招师-回收站",
        component: (resolve) =>
          require(["../pages/full_time_dir/recycle.vue"], resolve),
        meta: {
          permissionName: "tea:recycle:recycle-bin",
        },
      },
      // ...其他子路由
    ],
  },
  // 全职招师重构
  {
    path: "/full_times",
    component: (resolve) => require(["../pages/full_times"], resolve),
    children: [
      {
        path: "",
        name: "招师流程-全职招师-待分配名单管理",
        component: (resolve) =>
          require(["../pages/full_times_dir/distribution.vue"], resolve),
        meta: {
          permissionName: "unassgin",
        },
      },
      {
        path: "pre_training",
        name: "招师流程-全职招师-面试管理",
        component: (resolve) =>
          require(["../pages/full_times_dir/pre_training.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:interview",
        },
      },

      {
        path: "bef_int",
        name: "招师流程-全职招师-培训管理",
        component: (resolve) =>
          require(["../pages/full_times_dir/before_interview.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:train",
        },
      },
      {
        path: "wait_entry",
        name: "招师流程-全职招师-入职管理",
        component: (resolve) =>
          require(["../pages/full_times_dir/wait_entry.vue"], resolve),
        meta: {
          permissionName: "tea:process:ftime:entry:manage",
        },
      },
      {
        path: "pre_ent",
        name: "招师流程-全职招师-试用期管理",
        component: (resolve) =>
          require(["../pages/full_times_dir/pre_entry.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:tryOut",
        },
      },
      {
        path: "ent_list",
        name: "招师流程-全职招师-转正管理",
        component: (resolve) =>
          require(["../pages/full_times_dir/entry_list.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:regular",
        },
      },
      {
        path: "leave_list",
        name: "招师流程-全职招师-离职管理",
        component: (resolve) =>
          require(["../pages/full_times_dir/leave.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:leave",
        },
      },
      {
        path: "recy",
        name: "招师流程-全职招师-回收站",
        component: (resolve) =>
          require(["../pages/full_times_dir/recycle.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:recycle",
        },
      },
      {
        path: "batchCheckPreTraining",
        name: "招师流程-全职招师-面试管理-批量审核",
        component: (resolve) =>
          require(["../pages/full_times_dir/batchCheck.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:interview",
        },
      },
      {
        path: "batchCheckBefInt",
        name: "招师流程-全职招师-培训管理-批量审核",
        component: (resolve) =>
          require(["../pages/full_times_dir/batchCheck.vue"], resolve),
        meta: {
          permissionName: "recruit:process:fulltime:train",
        },
      },
      // ...其他子路由
    ],
  },
  {
    path: "/importExcel",
    name: "招师流程-全职招师—待分配名单管理-导入",
    component: (resolve) =>
      require(["../pages/full_times_dir/importExcel.vue"], resolve),
    meta: {
      permissionName: "unassgin",
    },
  },
  // 兼职招师
  {
    path: "/part_time",
    component: (resolve) => require(["../pages/part_time"], resolve),
    name: "招师流程-兼职招师",
    meta: {
      permissionName: "recruit:process:parttime",
    },
    children: [
      {
        path: "",
        name: "招师流程-兼职招师-面试管理",
        component: (resolve) =>
          require(["../pages/part_time_dir/interview.vue"], resolve),
        meta: {
          permissionName: "recruit:process:parttime:interview",
        },
      },
      {
        path: "train",
        name: "招师流程-兼职招师-培训管理",
        component: (resolve) =>
          require(["../pages/part_time_dir/train.vue"], resolve),
        meta: {
          permissionName: "recruit:process:parttime:train",
        },
      },
      {
        path: "store",
        name: "招师流程-兼职招师-入库管理",
        component: (resolve) =>
          require(["../pages/part_time_dir/store.vue"], resolve),
        meta: {
          permissionName: "recruit:process:parttime:store",
        },
      },
      {
        path: "recycle",
        name: "招师流程-兼职招师-回收站",
        component: (resolve) =>
          require(["../pages/part_time_dir/recycle.vue"], resolve),
        meta: {
          permissionName: "recruit:process:parttime:recycle",
        },
      },
      {
        path: "entry",
        name: "招师流程-兼职招师-入职管理",
        component: (resolve) =>
          require(["../pages/part_time_dir/entry.vue"], resolve),
        meta: {
          permissionName: "recruit:process:parttime:entry",
        },
      },
      // ...其他子路由
    ],
  },
  {
    path: "/exchange/sign",
    component: (resolve) =>
      require(["../pages/exchange_sign/index.vue"], resolve),
    name: "换签/续签流程",
    meta: {
      permissionName: "recruit:exchangeSign",
    },
  },
  //  培训列表
  {
    path: "/train_list",
    component: (resolve) =>
      require(["../pages/part_time_dir/trainList.vue"], resolve),
    name: "兼职招师流程-培训列表",
    meta: {
      permissionName: "recruit:process:trainlist",
    },
  },
  // 数据统计
  {
    path: "/dashboard",
    component: (resolve) => require(["../pages/dashboard"], resolve),
    children: [
      {
        path: "geren",
        name: "数据统计-全职个人报表",
        meta: {
          permissionName: "tea:report:full-time",
          cName: ["全职个人报表", "时间统计"],
          titleList: ["个人统计", "时间统计"],
        },
      },
      {
        path: "kemucanpei",
        name: "数据统计-全职个人科目KPI",
        meta: {
          permissionName: "tea:report:full-time-kpi",
          cName: ["科目参培数分布"],
        },
      },
      {
        path: "kemu",
        name: "数据统计-科目统计",
        meta: {
          permissionName: "tea:report:subject",
          cName: ["科目统计", "科目入职统计"],
          titleList: ["科目统计", "入职统计"],
        },
      },
      {
        path: "qudao",
        name: "数据统计-渠道统计",
        meta: {
          permissionName: "tea:report:channel",
        },
      },
      {
        path: "qudaoguanli",
        name: "数据统计-渠道管理",
        meta: {
          permissionName: "tea:report:channel-manager",
          cName: ["全职招师渠道管理", "兼职招师渠道管理"],
          titleList: ["全职", "兼职"],
          reports: "招师渠道报表",
        },
      },
      {
        path: "xuesheng",
        name: "数据统计-学生趋势",
        meta: {
          permissionName: "tea:report:trend",
        },
      },
    ],
  },
  // 代理配置管理
  {
    path: "/agent_referral",
    component: (resolve) => require(["../pages/agent_referral"], resolve),
    name: "招师代理-代理配置管理",
  },
  // 代理人员管理
  {
    path: "/agent_list",
    component: (resolve) => require(["../pages/agent_list"], resolve),
    name: "招师代理-代理人员管理",
    children: [
      {
        path: "",
        name: "招师代理-代理人员管理-内部",
        component: (resolve) =>
          require(["../pages/agent_list/agent_in.vue"], resolve),
      },
      {
        path: "agent_out",
        name: "招师代理-代理人员管理-外部",
        component: (resolve) =>
          require(["../pages/agent_list/agent_out.vue"], resolve),
      },
    ],
  },
  // 老师库
  {
    path: "/smallclass_teacherpay",
    component: (resolve) =>
      require(["../pages/smallclass_teacherpay"], resolve),
    name: "老师库-小班课老师薪资",
    meta: {
      permissionName: "api:teachers:minClassSalary",
    },
  },
  // 数据统计
  {
    path: "/config/link",
    name: "招师代理-代理链接管理",
    component: (resolve) =>
      require(["../pages/config/config-link.vue"], resolve),
    meta: {
      permissionName: "agent-link-config",
    },
  },
  {
    path: "/config/setting",
    name: "招师代理-代理配置管理",
    component: (resolve) =>
      require(["../pages/config/config-setting.vue"], resolve),
    meta: {
      permissionName: "agent-activity-config",
    },
  },
  {
    path: "/config/text",
    name: "招师代理-代理文字管理",
    component: (resolve) =>
      require(["../pages/config/config-text.vue"], resolve),
    meta: {
      permissionName: "agent-text-config",
    },
  },
  {
    path: "/config/recomend",
    name: "招师代理-代理推荐数据",
    component: (resolve) =>
      require(["../pages/config/config-recomend.vue"], resolve),
    meta: {
      permissionName: "agent-recommend-data",
    },
  },
  {
    path: "/config/reward",
    name: "招师代理-代理薪资数据",
    component: (resolve) =>
      require(["../pages/config/config-reward.vue"], resolve),
    meta: {
      permissionName: "agent-salary-data",
    },
  },
  {
    path: "/config/app",
    name: "招师代理-代理APP管理",
    component: (resolve) =>
      require(["../pages/config/config-app.vue"], resolve),
    meta: {
      permissionName: "agent-app-config",
    },
  },
  // 全职招师数据报表重构
  // {
  //     path: '/report_forms/personalReport',
  //     name: '数据统计 > 全职个人报表',
  //     component: resolve => require(['../pages/report_forms/personal_report.vue'], resolve),
  //     meta: {permissionName: 'report-personal'},
  // },
  // {
  //     path: '/report_forms/conversionReport',
  //     name: '数据统计 > 全职转化报表',
  //     component: resolve => require(['../pages/report_forms/conversion_report.vue'], resolve),
  //     meta: {permissionName: 'report-conversion'},
  //     // 导出	按钮	report-conversion-export		否	/api/report/fullTime/export
  // },
  // {
  //     path: '/report_forms/subjectReport',
  //     name: '数据统计 > 全职科目统计报表',
  //     component: resolve => require(['../pages/report_forms/subject_report.vue'], resolve),
  //     meta: {permissionName: 'report-gradesuject'},
  //     // 导出	按钮	report-gradesuject-export		否	/api/report/fullTime/export
  // },
  // {
  //     path: '/report_forms/channelReport',
  //     name: '数据统计 > 全职渠道统计报表',
  //     component: resolve => require(['../pages/report_forms/channel_report.vue'], resolve),
  //     meta: {permissionName: 'report-channel'},
  //     // 导出	按钮	report-channel-export		否	/api/report/fullTime/export
  // },
  {
    path: "/report_forms/trainReport",
    name: "数据统计 > 陪练招师报表",
    component: (resolve) =>
      require(["../pages/report_forms/train_report.vue"], resolve),
    meta: {
      permissionName: "report-train-report",
    },
  },
  {
    path: "/report_forms/workbenchReport",
    name: "招师报表 > 工作台数据报表",
    component: (resolve) =>
      require(["../pages/report_forms/workbench_report.vue"], resolve),
    meta: { permissionName: "report-workbenchReport" },
  },
  {
    path: "/report_forms/funnelTable",
    name: "数据统计 > 招师专员漏斗报表",
    component: (resolve) =>
      require(["../pages/report_forms/funnelTable.vue"], resolve),
    meta: {
      permissionName: "funnelTable",
    },
  },
  {
    path: "/report_forms/addFriendAndBind",
    name: "数据统计 > 企微好友绑定明细",
    component: (resolve) => require(['../pages/report_forms/add_friend_and_bind.vue'], resolve),
    meta: {
      permissionName: 'addFriendAndBind'
    }
  },
  {
    path: "/report_forms/trainReport",
    name: "数据统计 > 招师专员漏斗报表",
    component: (resolve) =>
      require(["../pages/report_forms/train_report.vue"], resolve),
    meta: {
      permissionName: "report-train-report",
    },
  },
  {
    path: "/data_audit/personalIntroductionAudit",
    name: "资料审核 > 个人介绍审核",
    component: (resolve) =>
      require([
        "../pages/data_audit/personal_introduction_audit.vue",
      ], resolve),
    meta: {
      permissionName: "tea:info:audit",
    },
  },
  // 专员&渠道
  {
    path: "/commissionerAndChannel",
    name: "专员&渠道",
    component: (resolve) =>
      require([
        "../pages/commissionerAndChannel/index.vue",
      ], resolve),
    meta: {
      permissionName: "tea:commissioner:channel",
    },
  },
  //渠道管理
  {
    path: "/channel_management/list",
    component: (resolve) => require(["../pages/channel_management"], resolve),
    name: "招师代理-渠道管理",
    meta: {
      permissionName: "channelManagement:list",
    },
  },
  {
    path: "/config/activity_billing_management",
    component: (resolve) =>
      require(["../pages/activity_billing_management"], resolve),
    name: "渠道管理-渠道活动计费规则配置",
    meta: {
      permissionName: "channelManagement:billing",
    },
  },
  {
    path: "/config/activity",
    name: "渠道管理-渠道活动管理",
    component: (resolve) =>
      require(["../pages/config/config-activity.vue"], resolve),
    meta: {
      permissionName: "channelManagement:activity",
    },
  },
  {
    path: "/config/teaData",
    name: "渠道管理-渠道招师数据",
    component: (resolve) =>
      require(["../pages/config/config-teaData.vue"], resolve),
    meta: {
      permissionName: "channelManagement:teaData",
    },
  },
  {
    path: "/config/avtiveAward",
    name: "渠道管理-渠道活动奖励结算管理",
    component: (resolve) =>
      require(["../pages/config/config-avtiveAward.vue"], resolve),
    meta: {
      permissionName: "channelManagement:avtiveAward",
    },
  },
  {
    path: "/change_recommender",
    name: "变更推荐人",
    component: (resolve) =>
      require(["../pages/change_recommender/index.vue"], resolve),
    meta: {
      permissionName: "change_recommender:recommender",
    },
  },
  {
    path: "/recommender_list",
    name: "变更推荐人",
    component: (resolve) =>
      require(["../pages/change_recommender/recommenderList.vue"], resolve),
    // meta: { permissionName: 'change_recommender:recommender' }
  },
  // 招师管理
  {
    path: "/teacherManage/commissionerSwitchIntroduce",
    name: "专员转介绍",
    component: (resolve) =>
      require([
        "../pages/tea-manage/commissionerSwitchIntroduce.vue",
      ], resolve),
    meta: {
      permissionName: "tea:tacherManage:commissionerSwitchIntroduce",
    },
  },
  // 全职招师-面试管理-批量审核薪资
  // {
  //     path: '/preTraining/batchCheck',
  //     name: '批量审核薪资',
  //     component: resolve =>
  //         require(['../pages/full_times_dir/subpage/batch-check.vue'], resolve),
  //     meta: { permissionName: 'recruit:process:fulltime:interview' }
  // },
  {
    path: "/teacherManage/recommend",
    name: "专员推荐注册表",
    component: (resolve) =>
      require([
        "../pages/tea-manage/commissionerRecommendRegist.vue",
      ], resolve),
    meta: {
      permissionName: "tea:tacherManage:recommend",
    },
  },
  // 院校库配置
  {
    path: "/config_school",
    component: (resolve) => require(["../pages/config_school"], resolve),
    name: "招师配置-院校库配置",
    meta: { permissionName: "tea:school:member-config" },
  },
  ...childRooter,
]
