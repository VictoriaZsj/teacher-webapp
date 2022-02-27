export default {
  menuList: [
    {
      menuName: '招师配置',
      index: 1,
      permission: 'tea:config',
      subMenus: [
        {
          menuName: '报名配置',
          link: '/config_name',
          permission: 'tea:recruit:entry-config'
        },
        {
          menuName: '专员配置',
          link: '/config_person',
          permission: 'tea:recruit:member-config'
        },
        {
          menuName: 'kpi配置',
          link: '/config_kpi',
          permission: 'tea:kpi:config'
        },
        {
          menuName: '自动进回收站配置',
          link: '/configRecycle',
          permission: 'recycle:config'
        }
      ]
    },
    {
      menuName: '招师流程',
      index: 2,
      permission: 'tea:process',
      subMenus: [
        {
          menuName: '全职招师',
          link: '/full_time',
          permission: 'tea:process:old'
        },
        {
          menuName: '全职招师重构',
          link: '/full_times',
          permission: 'recruit:process:fulltime'
        }
      ]
    },
    {
      menuName: '数据统计',
      index: 3,
      permission: 'tea:report:all',
      subMenus: [
        {
          menuName: '全职个人科目KPI',
          link: '/dashboard/kemucanpei',
          permission: 'tea:report:full-time-kpi'
        },
        {
          menuName: '全职个人报表',
          link: '/dashboard/geren',
          permission: 'tea:report:full-time'
        },
        {
          menuName: '科目统计',
          link: '/dashboard/kemu',
          permission: 'tea:report:subject'
        },
        {
          menuName: '渠道统计',
          link: '/dashboard/qudao',
          permission: 'tea:report:channel'
        },
        {
          menuName: '学生趋势',
          link: '/dashboard/xuesheng',
          permission: 'tea:report:trend'
        },
        {
          menuName: '招师渠道管理',
          link: '/dashboard/qudaoguanli',
          permission: 'tea:report:channel-manager'
        }
      ]
    },
    {
      menuName: '招师代理',
      index: 4,
      permission: 'tea:agent:get-agent',
      subMenus: [
        {
          menuName: '代理人员管理',
          link: '/agent_list',
          permission: 'tea:agent:agent-member'
        },
        {
          menuName: '代理配置管理',
          link: '/agent_referral',
          permission: 'tea:agent:get-agent'
        }
      ]
    },
    {
      menuName: '老师库',
      index: 5,
      permission: 'api:teachers',
      subMenus: [
        {
          menuName: '小班课薪资',
          link: '/smallclass_teacherpay',
          permission: 'api:teachers:minClassSalary'
        }
      ]
    },
    {
      menuName: '代理配置管理',
      index: 6,
      permission: 'agent-config',
      subMenus: [
        {
          menuName: '代理链接配置',
          link: '/config/link',
          permission: 'agent-link-config'
        },
        {
          menuName: '代理活动配置管理',
          link: '/config/setting',
          permission: 'agent-activity-config'
        },
        {
          menuName: '代理APP配置',
          link: '/config/app',
          permission: 'agent-app-config'
        },
        {
          menuName: '代理文字配置',
          link: '/config/text',
          permission: 'agent-text-config'
        },
        {
          menuName: '代理推荐数据',
          link: '/config/recomend',
          permission: 'agent-recommend-data'
        },
        {
          menuName: '代理薪资数据',
          link: '/config/reward',
          permission: 'agent-salary-data'
        }
      ]
    }
    /*{
      menuName: '全职招师数据报表重构',
      index: 7,
      permission: 'fulltime-report',
      subMenus: [
        {
          menuName: '全职个人报表',
          link: '/smallclass_teacherpay',
          permission: 'report-personal'
        },
        {
          menuName: '全职转化报表',
          link: '/smallclass_teacherpay',
          permission: 'report-conversion'
        },
        {
          menuName: '科目统计报表',
          link: '/smallclass_teacherpay',
          permission: 'report-gradesuject'
        },
        {
          menuName: '渠道统计报表',
          link: '/smallclass_teacherpay',
          permission: 'report-channel'
        }
      ]
    } */
  ]
};
