import appConfig from "@config";
// 年级和科目
export const gradeSubject = {
    '小学': ['语文', '数学', '英语', '奥数', '科学','心理'],
    '初中': ['语文', '数学', '英语', '政治', '历史', '地理', '物理', '化学', '生物', '科学','心理'],
    '高中': ['语文', '数学', '英语', '政治', '历史', '地理', '物理', '化学', '生物', '文综', '理综','心理'],
    '少儿': ['语文', '数学', '英语', '奥数', '心理']
};
export const allSubject = ["语文", "数学", "英语", "政治", "历史", "地理", "物理", "化学", "生物", "科学", "奥数", "文综", "理综","心理"];

// 全职招聘流程路由名称信息
export const fullTimePathInfo = ['','/bef_int','/chat_off','/pre_tra','pre_ent','/ent_list','/quit','/recy'];
export const fullTimePathName = ['待预约','待面试','培训通知','待培训','待入职','入职名单','离职名单','回收站'];

export const appAgentList = [{
    'value':'zmTeacher',
    'label':'掌门好老师'
}];


// 七牛云地址
export const QINIU_BASE_URL = appConfig.QINIU_BASE_URL;
