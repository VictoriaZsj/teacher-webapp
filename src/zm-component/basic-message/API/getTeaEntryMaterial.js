import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'
/**
 *
 方法说明 获取教师入职资料信息
 *
 @method getTeaEntryMaterial
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回数据
 {
   code:1,
   data:{
     name:'',//姓名
     teaGender:'',//性别
     nation:'',//民族
     idCard:'',//身份证号
     idCardValidityDay:'',//身份证有效时间 时间戳格式
     birthday:'',//出生日期 字符串格式
     household:'',//户籍性质 1城镇 0农村
     teaMarital:'',//婚姻状况 0否 1是
     mobile:'',//手机号
     email:'',//邮箱
     emergencyContactRelation:'',//紧急联系人
     emergencyContact:'',//紧急联系方式
     houseProv:'',//户籍所在地(省)
     houseCity:'',//户籍所在地(市)
     houseArea:'',//户籍所在地(区/县)
     houseAddress:'',//户籍所在地(详细地址)
     teaCity:'',//现居地址(市)
     teaArea:'',//现居地址(区/县)
     teaAddress:'',//现居地址(详细地址)
     teaTaughtStuGrade:'',//年级
     teaGoodFirst:'',//科目
     teaEdu:'',//最高学历
     teaSuoshuSchool:'',//毕业学校
     teacherCertificate:'',//教师资格证 1有 0无
     entryTime:'',//入掌门时间 时间戳格式
     bankName:'',//开户银行
     bankProvince:'',//开户省
     bankCity:'',//开户市
     bankBranch:'',//开户支行
     bankAccount:'',//银行卡号
     entryRemark:'',//备注
     educationInfos:[
       {
         fromyear:'',//起终时间 开始年
         frommonth:'',//起终时间 开始月
         toyear:'',//起终时间 结束年
         tomonth:'',//起终时间 结束月
         schoolname:'',//就读学校
         submajor:'',//所学专业
         proveName:'',//证明人
         proveMobile:'',//证明人联系方式
       }
     ],//教育经历
     workExperiences:[
       {
         fromyear:'',//起终时间 开始年
         frommonth:'',//起终时间 开始月
         toyear:'',//起终时间 结束年
         tomonth:'',//起终时间 结束月
         company:'',//公司名称
         position:'',//职位名称
         hrName:'',//公司HR姓名
         hrMobile:'',//公司HR联系方式
       }
     ],//工作经历
     familyMembers:[
       {
         relationship:'',//与本人关系
         memberName:'',//姓名
         workUnit:'',//工作单位
         liveProv:'',//居住地(省)
         liveCity:'',//居住地(市)
         liveArea:'',//居住地(区/县)
         liveAddress:'',//居住地(详细地址
         memberMobile:'',//联系方式
       }
     ],//家庭成员
     attachmentInfos:[
       {
         url:'',//下载地址
         name:''//附件名称
       }
     ]//相关扫描件


   },
   message:''
 }
 */
export default function getTeaEntryMaterial (options) {
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teacher-web/api/newEntry/getTeaEntryMaterial',
            method: 'get',
            params: options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
            } else {
                reject(message);
            }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}
