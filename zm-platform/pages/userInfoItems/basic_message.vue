<template>
  <div class="basic_message">
    <div class="content">
      <el-tabs @tab-click="tabClick" v-model="selectMode" tab-position="left" class="rder_dialog_bodys_white"
               :class="{personalInfoPoint:(!!teaPersonalInfoData && teaPersonalInfoData.checkState == 1)}">
        <el-tab-pane label="基本信息" name="info" class="basic-info">
          <el-form :inline="true" :model="baseInfoP" label-width="110px">
            <div class="audit-state">
              <div class="audit-text">
                <span class="audit-title">
                  {{getChinaIdStateStr(baseInfoP.chinaIdState)}}
                </span>
                <template v-if="chinaidState === '1'">
                  <span class="chinaid-content">身份证号：{{chinaIdContent}}</span>
                  <span class="show-chinaid" @click="showChinaidContent">{{showChinaidVal}}</span>
                </template>
              </div>
            </div>
            <el-form-item class="is-required" label="姓名">
              <el-input :disabled="baseInfoP.chinaIdState == '1'" v-model="baseInfoP.teaName"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="baseInfoP.nickName"></el-input>
            </el-form-item>
            <el-form-item label="证件类型">
              <el-select :disabled="baseInfoP.chinaIdState == '1'" v-model="baseInfoP.certificateType"
                        placeholder="请选择">
                <el-option label="身份证" :value="1"/>
                <el-option label="其他证件" :value="2"/>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号">
              <el-input v-if="baseInfoP.chinaIdState == '1'" :disabled="baseInfoP.chinaIdState == '1'"
                        v-model="baseInfoP.chinaId"></el-input>
              <dami-pwd-input v-else :show="viewState" v-model="baseInfoP.chinaId" :permission="true"></dami-pwd-input>

            </el-form-item>
            <el-form-item class="is-required" label="联系电话">
              <span class="mobile-cursor" @click="showMobile('mobile')" v-if="!basicMobileSeen">查看手机号</span>
              <el-input v-if="basicMobileSeen"
              :disabled="!baseInfoP.editMobile||!checkPermission('tea-motify-mobile')"
                        v-model="baseInfoP.teaMobile"></el-input>
            </el-form-item>
            <el-form-item :class="teaStatue > 1 ? 'is-required' : ''" label="性别">
              <el-select v-model="baseInfoP.teaGender" placeholder="请选择">
                <el-option label="男" value="男"/>
                <el-option label="女" value="女"/>
                <el-option label="不确定" value=""/>
              </el-select>
            </el-form-item>
            <el-form-item :class="teaStatue > 1 ? 'is-required' : ''" label="讲师邮箱">
              <el-input v-if="teaStatue < 3" v-model="baseInfoP.teaEmail"></el-input>
              <dami-pwd-input v-else :show="viewState" v-model="baseInfoP.teaEmail" :permission="true"></dami-pwd-input>
            </el-form-item>
            <el-form-item :class="teaStatue > 1 ? 'is-required' : ''" label="讲师QQ">
              <el-input v-if="teaStatue < 3" v-model="baseInfoP.qq"></el-input>
              <dami-pwd-input v-else :show="viewState" v-model="baseInfoP.qq" :permission="true"></dami-pwd-input>
            </el-form-item>
            <el-form-item :class="teaStatue > 1 ? 'is-required' : ''" label="讲师微信">
              <el-input v-if="teaStatue < 3" disabled v-model="baseInfoP.teaWeixin"></el-input>
              <dami-pwd-input v-else :show="viewState" :disabled="true" v-model="baseInfoP.teaWeixin" :permission="true"></dami-pwd-input>
            </el-form-item>

            <el-form-item label="现居住地">
              <el-cascader class="cascader-provinceCityCounty" v-model="provinceCityCounty" :options="provinceCityCountyOptions" @change="handleProvinceCityCountyChange"></el-cascader>
              <el-input class="cascader-teaAddress" v-model="baseInfoP.teaAddress"></el-input>
            </el-form-item>
            <el-form-item label="推荐人手机">
              <el-tooltip class="item" effect="dark" :disabled="!hoverString.length" placement="right">
                <div style="line-height: 20px;" slot="content"><div v-for="(item,i) in hoverString" :key="i">{{item}}<br/></div></div>
                <img class="hover-src" :src="hoverSrc" alt="">
              </el-tooltip>
              <span class="mobile-cursor" @click="showMobile('referMobile')" v-if="!referMobileSeen">查看手机号</span>
              <el-input :disabled="true"
              v-if="referMobileSeen"
              v-model="baseInfoP.referMobile">
              </el-input>
            </el-form-item>
            <el-form-item label="紧急联系人姓名">
              <el-input v-model="baseInfoP.emergencyContactName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item :class="teaStatue > 2 ? 'is-required' : ''" label="紧急联系人关系">
              <el-input v-model="baseInfoP.emergencyContactRelation" placeholder="例：母女，父子等"></el-input>
            </el-form-item>
            <el-form-item :class="teaStatue > 2 ? 'is-required' : ''" label="紧急联系人手机号">
              <span class="mobile-cursor" @click="showMobile('emergencyContactMobile')"
              v-if="!emergencyMobileSeen">查看手机号</span>
              <el-input v-if="emergencyMobileSeen"
              v-model="baseInfoP.emergencyContactMobile"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="baseInfoP.remark"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="教学背景" name="backGround">
          <el-form style="position:relative;" :inline="true" :model="eduBackDataP">
            <el-form-item class="is-required" label="所属BU">
              <el-radio v-model="eduBackDataP.teaBu" label="1" class="min-60">1对1</el-radio>
              <el-radio v-model="eduBackDataP.teaBu" label="2" class="min-60">少儿</el-radio>
              <el-radio v-model="eduBackDataP.teaBu" label="3" class="min-60">陪练</el-radio>
              <el-radio v-if="['full_times', 'wait_entry', 'pre_training', 'bef_int', 'pre_ent', 'ent_list', 'leave_list'].includes(currentRoute)" v-model="eduBackDataP.teaBu" label="5" class="min-60">优课</el-radio>
            </el-form-item>
            <br/>
            <el-form-item label="高中学校">
              <el-input v-model="eduBackDataP.teaSchoolGao" placeholder="请输入高中学校"></el-input>
            </el-form-item>
            <el-form-item label="高考文理科">
              <el-radio v-model="eduBackDataP.teaWenli" label="文">文科</el-radio>
              <el-radio v-model="eduBackDataP.teaWenli" label="理">理科</el-radio>
            </el-form-item>
            <br/>
            <el-form-item label="高考所在地(省)">
              <el-select v-model="eduBackDataP.ceeProvince" placeholder="请选择省份">
                <el-option
                  v-for="(item,index) in proData_edu"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="高考所在地(市)">
              <el-select v-model="eduBackDataP.ceeCity" placeholder="请选择市">
                <el-option
                  v-for="(item,index) in cityData_edu"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="高考成绩">
              <el-select style="width:80px;" v-model="eduBackDataP.ceeSubjectFirst"  placeholder="请选择科目">
                <el-option v-for="(item,index) in hignSchollSub" :key="index" :label="item.label" :value="item.label">
                </el-option>
              </el-select>

              <el-input style="width:90px;" v-model="eduBackDataP.ceeSubjectFirstScore" placeholder="高考分数"></el-input>
              <el-input style="width:60px;" v-model="eduBackDataP.ceeSubjectFirstTotalScore"
                        placeholder="满分"></el-input>
            </el-form-item>
            <el-form-item label="高考成绩">
              <el-select v-model="eduBackDataP.ceeSubjectSecond" style="width:80px;" placeholder="请选择科目">
                <el-option v-for="(item,index) in hignSchollSub" :key="index" :label="item.label"
                           :value="item.label"></el-option>
              </el-select>
              <el-input style="width:90px;" v-model="eduBackDataP.ceeSubjectSecondScore" placeholder="高考分数"></el-input>
              <el-input style="width:60px;" v-model="eduBackDataP.ceeSubjectSecondTotalScore"
                        placeholder="满分"></el-input>
            </el-form-item>
            <el-form-item label="高考成绩">
              <el-select v-model="eduBackDataP.ceeSubjectThird" style="width:80px;" placeholder="请选择科目">
                <el-option v-for="(item,index) in hignSchollSub" :key="index" :label="item.label"
                           :value="item.label"></el-option>
              </el-select>
              <el-input style="width:90px;" v-model="eduBackDataP.ceeSubjectThirdScore" placeholder="高考分数"></el-input>
              <el-input style="width:60px;" v-model="eduBackDataP.ceeSubjectThirdTotalScore"
                        placeholder="满分"></el-input>
            </el-form-item>
            <div v-for="(item,index) in eduBackDataP.graduateInfos" :key="index" class="edu-scholld-item">
              <span class="del" @click="delGraduateInfos(index)">删除</span>
              <el-form-item class="is-required" label="学历" label-width="100px">
                <el-select v-model="item.education" placeholder="请选择">
                  <el-option label="本科" :value="1"></el-option>
                  <el-option label="硕士" :value="2"></el-option>
                  <el-option label="博士" :value="3"></el-option>
                  <el-option label="大专" :value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入学时间" label-width="100px">
                <el-input v-model="item.fromYear" placeholder="入学时间"></el-input>
              </el-form-item>
              <el-form-item class="is-required" label="毕业时间" label-width="100px">
                <el-input v-model="item.graduatedYear" placeholder="毕业时间"></el-input>
              </el-form-item>
              <el-form-item class="is-required" label="毕业院校" label-width="100px">
                <el-input v-model="item.graduatedSchool" placeholder="毕业院校"></el-input>
              </el-form-item>
              <el-form-item label="所学专业" label-width="100px">
                <el-input v-model="item.subMajor" placeholder="所学专业"></el-input>
              </el-form-item>
              <!-- 产品又不上该字段，建议暂时保留 -->
              <!-- <el-form-item label="学习形式">
                <el-select v-model="item.educationForm" class="short" placeholder="请选择">
                  <el-option label="全日制" value="1"></el-option>
                  <el-option label="非全日制" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="毕业证和学位证">
                <el-select v-model="item.certificate" class="short" placeholder="请选择">
                  <el-option label="已取得学信网可查" value="1"></el-option>
                  <el-option label="暂未取得(未毕业)" value="2"></el-option>
                  <el-option label="暂无渠道(肄业)" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否特殊学制">
                <el-select v-model="item.specialEdu" class="short" placeholder="请选择">
                  <el-option label="否" value="0"></el-option>
                  <el-option label="专升本" value="1"></el-option>
                  <el-option label="专插本" value="2"></el-option>
                  <el-option label="成人教育" value="3"></el-option>
                  <el-option label="自考" value="4"></el-option>
                  <el-option label="函授" value="5"></el-option>
                </el-select>
              </el-form-item> -->
            </div>
            <div @click="addEduExperience" class="edu-experience-add">
              添加一条学习经历
              <!-- 全职里面的资料卡 -->
            </div>
            <el-form-item key="classType" class="is-required" label="授课类型">
              <el-select v-if="selectMode == 'backGround'" v-model="eduBackDataP.teacherAttr.courseTypes" multiple
                         placeholder="请选择授课类型">
                <el-option v-for="(item,i) in classTypeData" :key="i" :label="item.label" :value="item.value"></el-option>
              </el-select>

            </el-form-item>
            <el-form-item key="timeType" class="is-required" label="工作性质">
              <el-select v-model="eduBackDataP.teacherAttr.timeType" :disabled="workTypeDisable" placeholder="请选择">
                <el-option label="兼职" :value="0"></el-option>
                <el-option label="全职" :value="1"></el-option>
                <el-option label="校招全职" :value="2"></el-option>
                <el-option label="公校兼职" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <!-- {{eduBackDataP.teacherAttr.teaTaughtStuGradeCode}} -->
            <!-- <el-form-item key="teaTaughtStuGradeCode1" v-if="eduBackDataP.teaBu == '3'" class="is-required" label="学段偏好">
              <el-select v-model="eduBackDataP.teacherAttr.teaTaughtStuGradeCode"
                         :noregvalue="eduBackDataP.teacherAttr.teaTaughtStuGrade"
                         :multiple="(eduBackDataP.state == '0' || eduBackDataP.state == '1') ? false : true"
                         placeholder="请选择">
                <el-option v-for="(item,index) in gradeHobby" :key="index" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            v-if="eduBackDataP.teaBu != '3'" -->
            <el-form-item key="teaTaughtStuGradeCode" class="is-required" :label="eduBackDataP.teaBu != '3' ? '年级偏好' : '学段偏好'">
              <!-- 原来逻辑::::::老师状态非(待面试|已面试)的，不能进行多选:::::: -->
              <!-- :multiple="(eduBackDataP.state == '0' || eduBackDataP.state == '1') ? false : true" -->
              <el-select :multiple="(eduBackDataP.state == '0' || eduBackDataP.state == '1') ? false : true"
                         v-model="eduBackDataP.teacherAttr.teaTaughtStuGradeCode"
                         :noregvalue="eduBackDataP.teacherAttr.teaTaughtStuGrade"
                          placeholder="请选择">
                <el-option v-for="(item,index) in gradeHobby" :key="index" :label="item.label"
                           :value="item.value"></el-option>

              </el-select>
            </el-form-item>
            <el-form-item key="goodFirstSubjectCode"  class="is-required" label="第一擅长科目">
              <el-select v-model="eduBackDataP.teacherAttr.goodFirstSubjectCode"
                         :noregvalue="eduBackDataP.goodFirstSubject" placeholder="请选择">
                <!-- <el-option label="语文" value="1"></el-option> -->
                <el-option v-for="(item,index) in basesubject" :key="index" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="goodSecondSubject" label="第二擅长科目">
              <el-select v-model="eduBackDataP.teacherAttr.goodSecondSubjectCode"
                         :noregvalue="eduBackDataP.goodSecondSubject" placeholder="请选择">
                <!-- <el-option label="语文" value="1"></el-option> -->
                <el-option v-for="(item,index) in basesubject" :key="index" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="teacherCertificate" v-if="eduBackDataP.teaBu != '3'" label="教师资格证">
              <el-select class="teacherCertificate" v-model="eduBackDataP.teacherCertificate" disabled
                         placeholder="请选择">
                <el-option v-for="item in teaCerOptions" :label="item.label" :value="item.value"
                           :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item key="certificatePeriodDesc" v-if="eduBackDataP.teaBu != '3'"
            label="教资阶段">
              <span>{{eduBackDataP.certificatePeriodDesc}}</span>
            </el-form-item>
            <el-form-item key="certificateSubjectDesc" v-if="eduBackDataP.teaBu != '3'"
            label="教资学科"> -->
              <!-- <span>{{eduBackDataP.certificateSubjectDesc}}</span> -->
            <!-- </el-form-item> -->
            <el-form-item key="teaRegion" v-if="eduBackDataP.teaBu != '3'" label="所在分区">
              <el-select v-model="eduBackDataP.teaRegion" placeholder="请选择所在分区">
                <el-option v-for="(item,i) in TeaRegionOption" :key="i" :label="item.label"
                           :value="item.label"></el-option>
                <!-- TeaRegionOption -->

                <!-- <el-option label="北京" value="北京"></el-option>
                <el-option label="上海" value="上海"></el-option>
                <el-option label="江苏" value="江苏"></el-option>
                <el-option label="浙江" value="浙江"></el-option>
                <el-option label="其他" value="其他"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item key="personalAdvantage" v-if="(eduBackDataP.teaBu==1 ||  eduBackDataP.teaBu==2 || eduBackDataP.teaBu==5) && (timeTypeCopy==1 || timeTypeCopy==2)" label="个人优势">
              <el-select multiple filterable collapse-tags v-model="personalAdvantage" placeholder="请选择个人优势">
                <el-option v-for="item in specialAdantageOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="teacherType"  v-if=" (timeTypeCopy==1 || timeTypeCopy==2)" label="老师类型">
              <el-select v-model="teacherType" placeholder="请选择老师类型" :disabled="teaTypeDisable">
                <el-option v-for="item in teaTypeOption" :key="item.value" :label="item.value" :value="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="isOAbinding" v-if="eduBackDataP.teaBu != '3'"
            label="公众号绑定状态">
              <span>{{eduBackDataP.isOAbinding ? '是' : '否'}}</span>
            </el-form-item>
            <br>
            <el-form-item key="isFullTime"  label="学习形式">
              <el-select v-model="eduBackDataP.isFullTime" placeholder="请选择学习形式" :disabled="teaTypeDisable">
                <el-option v-for="item in isFullTimeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="specialSystem"  label="是否特殊学制">
              <el-select v-model="eduBackDataP.specialSystem" placeholder="请选择特殊学制" :disabled="teaTypeDisable">
                <el-option v-for="item in spcialSystemOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="diploma"  label="毕业证和学位证">
              <el-select v-model="eduBackDataP.diploma" placeholder="请选择毕业证和学位证" :disabled="teaTypeDisable">
                <el-option v-for="item in diplomaOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="jobState"  label="求职状态">
              <el-select v-model="eduBackDataP.jobState" placeholder="请选择求职状态" :disabled="teaTypeDisable">
                <el-option v-for="item in jobStateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="currentJob"  label="当前从事职业" v-if="['2', '3'].includes(eduBackDataP.jobState)">
              <el-select v-model="eduBackDataP.currentJob" placeholder="请选择当前从事职业" :disabled="teaTypeDisable">
                <el-option v-for="item in currentJobOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="careerPlan"  label="职业规划">
              <el-select v-model="eduBackDataP.careerPlan" placeholder="请选择职业规划" :disabled="teaTypeDisable">
                <el-option v-for="item in careerPlanOPtions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item key="maritalStatus"  label="婚姻状况">
              <el-select v-model="eduBackDataP.maritalStatus" placeholder="请选择婚姻状况" :disabled="teaTypeDisable">
                <el-option v-for="item in teaMaritalOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- 1对1或少儿 -->
            <div v-if="eduBackDataP.teaBu != '3'">
              <div v-for="(item,index) in eduBackDataP.workInfos" :key="`workInfo-` + index">
                <el-form-item :label="'工作经历-'+(index+1)">
                  {{item.fromDate}}-{{item.toDate}}
                  {{item.company}}
                  {{item.position}}
                </el-form-item>
              </div>
              <br/>

              <div v-for="(item,index) in eduBackDataP.certificateUrls" :key="index">
                <el-form-item label="上传证书">
                  <zm-upload
                    v-if="token"
                    :upToken="token"
                    :uploadId="'uploadShareImageCer'+index"
                    class="btn"
                    :url="item.url"
                    @update:url="val => item.url = val" style="float: left; width:80px;">
                  </zm-upload>
                  <img-box :imgsrc="item.url" style="float:left; margin-right:10px;"></img-box>
                  <span @click="delcerUpload(index)" style="margin-right:5px;">删除</span>
                </el-form-item>
              </div>

              <br/>
              <span style="color:#007fff; cursor:pointer;" @click="addcerUpload()">新增证书</span>

              <!-- <el-form-item class="is-required" label="学生证/学历证书">
                  <img class="gradeRecord" v-for="(item,index) in eduBackDataP.certificateUrls" :src="item"/>
              </el-form-item> -->
            </div>
            <!-- 陪练 -->
            <div v-if="eduBackDataP.teaBu == '3'">
              <el-form-item label="学生水平偏好">
                <el-select v-model="eduBackDataP.teacherAttr.taughtStuLevelCode" multiple placeholder="请选择">
                  <el-option label="启蒙（1-3级）" value="启蒙（1-3级）"></el-option>
                  <el-option label="初级（4-6级）" value="初级（4-6级）"></el-option>
                  <el-option label="中级（7-8级）" value="中级（7-8级）"></el-option>
                  <el-option label="高级（8级以上）" value="高级（8级以上）"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主课老师">
                <el-select v-model="eduBackDataP.teacherAttr.majorTeacher" placeholder="请选择">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="英皇辅导经验">
                <el-select v-model="eduBackDataP.teacherAttr.abrsm" placeholder="请选择">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="教学经验">
                <el-input type="textarea" v-model="eduBackDataP.teacherAttr.teachingExperience"></el-input>
              </el-form-item>
              <br/>
              <el-form-item label="获奖证书">
              <span>
                上传钢琴考级证书、钢琴比赛获奖证书、教师资格证书
              </span>
              </el-form-item>

              <div v-for="(item,index) in eduBackDataP.awardFiles" :key="index">
                <el-form-item label="上传证书">
                  <zm-upload
                    v-if="token"
                    :upToken="token"
                    :uploadId="'uploadShareImage'+index"
                    class="btn"
                    :url="item.ossPath"
                    @update:url="val => item.ossPath = val" style="float: left; width:80px;">
                  </zm-upload>
                  <img-box :imgsrc="item.ossPath" style="float:left; margin-right:10px;"></img-box>
                  <span @click="delZmUpload(index)" style="margin-right:5px;">删除</span>
                </el-form-item>
              </div>

              <br/>
              <span style="color:#007fff; cursor:pointer;" @click="addZmUpload()">新增证书</span>
              <br/>

            </div>

          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="teaStatue > 0 && !!teaPersonalInfoData" label="个人介绍" name="introduce">
          <el-row>
            <el-col :span="3">
              <div class="headAvatarImg-container">
                <img id="basecHeadAvatarImg" class="logo"
                     :onerror="restoreLogo(teacherSculptureInit)" :src="teacherSculptureInit">
                <div class="action-container">
                  <el-button class="el-btn" type="info" size="small" @click="preView()">预览</el-button>
                  <zm-upload
                    v-if="token&&!levelDisabled"
                    :upToken="token"
                    :uploadId="'uploadShareImage'"
                    class="btn"
                    @update:url="selectImg">
                  </zm-upload>
                </div>
              </div>
            </el-col>
            <el-col :span="21" class="introduction">
              <el-form :inline="false" :model="teaPersonalInfoData">
                <div v-if="teaPersonalInfoData.checkState == 2 || teaPersonalInfoData.checkState == 3"

                     class="audit-state">
                  <div class="audit-text">
                    <div class="audit-title">
                      {{teaPersonalInfoData.checkStateStr}}
                    </div>
                    <div class="audit-description">
                        <span v-if="teaPersonalInfoData.checkState == 2 && !!teaPersonalInfoData.checkPassReason">
                          理由:{{teaPersonalInfoData.checkPassReason}}
                        </span>
                      <span v-if="teaPersonalInfoData.checkState == 3 && !!teaPersonalInfoData.checkUnPassReason">
                          理由:{{teaPersonalInfoData.checkUnPassReason}}
                        </span>
                    </div>
                  </div>
                </div>
                <div class="tea-name">
                  <span class="name">{{teaPersonalInfoData.userName}}</span>
                  <span>{{teaPersonalInfoData.teaGoodSubject}}</span>
                  <!-- <div v-if="teaPersonalInfoData.checkState == 1" class="wait-audit">
                    待审核
                  </div> -->
                </div>
                <div v-if="levelDisabled">
                  <el-form-item label="教育经历">
                    <div class="mes-content" v-for="(item,index) in teaPersonalInfoData.eduExperiences"
                         :key="index">
                      {{!!item ? item.schoolName : ''}}
                      {{!!item ? item.degree : ''}}
                    </div>
                  </el-form-item>
                  <el-form-item label="高考经历">
                    <div>
                      高考省份-{{teaPersonalInfoData.ceeProvince}}
                    </div>
                    <div class="mes-content ceeSubject" v-if="teaPersonalInfoData.ceeSubjectFirst">
                      {{teaPersonalInfoData.ceeSubjectFirst}}:{{teaPersonalInfoData.ceeSubjectFirstScore}}/{{teaPersonalInfoData.ceeSubjectFirstTotalScore
                      }}
                    </div>
                    <div class="mes-content ceeSubject" v-if="teaPersonalInfoData.ceeSubjectSecond">
                      {{teaPersonalInfoData.ceeSubjectSecond}}:{{teaPersonalInfoData.ceeSubjectSecondScore}}/{{teaPersonalInfoData.ceeSubjectSecondTotalScore
                      }}
                    </div>
                    <div class="mes-content ceeSubject" v-if="teaPersonalInfoData.ceeSubjectThird">
                      {{teaPersonalInfoData.ceeSubjectThird}}:{{teaPersonalInfoData.ceeSubjectThirdScore}}/{{teaPersonalInfoData.ceeSubjectThirdTotalScore
                      }}
                    </div>
                  </el-form-item>
                  <el-form-item label="兴趣爱好">
                    <div class="mes-content">{{teaPersonalInfoData.hobby}}</div>
                  </el-form-item>
                  <el-form-item label="教龄">
                    <div class="mes-content">{{teaPersonalInfoData.teachingAge|teachingAgeFilter}}</div>
                  </el-form-item>
                  <el-form-item label="教学经验">
                    <div class="mes-content">{{teaPersonalInfoData.teachingExperience}}</div>
                  </el-form-item>
                  <el-form-item style="width:100%" label="获奖经历">
                    <div class="awardPanel">
                      <div class="award" v-if="teaPersonalInfoData.awardRecordFirstFile">
                        <div class="awardImg">
                          <img @click="preview(teaPersonalInfoData.awardRecordFirstFile)"
                               :src="teaPersonalInfoData.awardRecordFirstFile"/>
                        </div>
                        获奖竞赛级别:{{teaPersonalInfoData.awardRecordFirstCompetitionLevel}}，获奖科目:{{teaPersonalInfoData.awardRecordFirstSubject}}，获奖级别:{{teaPersonalInfoData.awardRecordFirstLevel}}
                      </div>
                      <div class="award" v-if="teaPersonalInfoData.awardRecordSecondFile">
                        <div class="awardImg">
                          <img @click="preview(teaPersonalInfoData.awardRecordSecondFile)"
                               :src="teaPersonalInfoData.awardRecordSecondFile"/>
                        </div>
                        获奖竞赛级别:{{teaPersonalInfoData.awardRecordSecondCompetitionLevel}}，获奖科目:{{teaPersonalInfoData.awardRecordSecondSubject}}，获奖级别:{{teaPersonalInfoData.awardRecordSecondLevel}}
                      </div>
                      <div class="award" v-if="teaPersonalInfoData.awardRecordThirdFile">
                        <div class="awardImg">
                          <img @click="preview(teaPersonalInfoData.awardRecordThirdFile)"
                               :src="teaPersonalInfoData.awardRecordThirdFile"/>
                        </div>
                        获奖竞赛级别:{{teaPersonalInfoData.awardRecordThirdCompetitionLevel}}，获奖科目:{{teaPersonalInfoData.awardRecordThirdSubject}}，获奖级别:{{teaPersonalInfoData.awardRecordThirdLevel}}
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="专业证书"
                                v-if="eduBackDataP && (eduBackDataP.awardRecordEnglishLevel || eduBackDataP.awardRecordToeflScore || eduBackDataP.awardRecordIeltsScore) || hasCertificate">
                    <div class="mes-content">
                      <template v-if="eduBackDataP.awardRecordEnglishLevel">
                        <p>英语：{{eduBackDataP.awardRecordEnglishLevel}}</p>
                      </template>
                      <template v-if="eduBackDataP.awardRecordToeflScore">
                        <p>托福：{{eduBackDataP.awardRecordToeflScore}}分</p>
                      </template>
                      <template v-if="eduBackDataP.awardRecordIeltsScore">
                        <p>雅思：{{eduBackDataP.awardRecordIeltsScore}}分</p>
                      </template>
                      <ul>
                        <li>教师资格证（{{teaPersonalInfoData.certificateType | certificateTypeFilter}}
                          <span :style="{color: teaPersonalInfoData.certificateState === 2 ? '#007fff' : 'red'}">{{teaPersonalInfoData.certificateState | certificateStateFilter}}</span>）
                        </li>
                        <li>编号：{{teaPersonalInfoData.certificateNum}}</li>
                        <li>第一擅长科目：{{teaPersonalInfoData.teaGoodFirst}}</li>
                        <li>类型：{{teaPersonalInfoData.certificateNum | certificateClassFilter}}</li>
                        <li>颁发年份：{{teaPersonalInfoData.certificateNum | certificateYearFilter}}</li>
                        <li v-if="teacherFilePath">准考证照片：
                          <div class="awardImg">
                            <img @click="preview(teacherFilePath)" :src="teacherFilePath"/>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </el-form-item>
                  <el-form-item label="提分心得">
                    <div class="mes-content">{{teaPersonalInfoData.teachingNotes}}</div>
                  </el-form-item>
                  <el-form-item label="教学风格">
                    <div class="mes-content">{{teaPersonalInfoData.teachingStyle}}</div>
                  </el-form-item>
                  <el-form-item label="个人介绍">
                    <div class="mes-content">{{teaPersonalInfoData.personalIntroduce}}</div>
                  </el-form-item>
                  <el-form-item label="教学特色" v-if="bu===2">
                    <div class="mes-content">{{teaPersonalInfoData.teachFeature}}</div>
                  </el-form-item>
                  <el-form-item label="教学理念" v-if="bu===2">
                    <div class="mes-content">{{teaPersonalInfoData.teachIdea}}</div>
                  </el-form-item>
                  <el-form-item label="教师风采" v-if="bu===2">
                    <div class="mes-content">
                      <div class="fengcaimgbox" v-for="(item,index) in teaPersonalInfoData.personalMien" :key="index"
                           @click="teacherMienShow(item.ossPath)"
                           :style="`background-image:url(${item.ossPath})`"></div>
                    </div>
                  </el-form-item>
                </div>
                <div v-if="!levelDisabled">
                  <el-form-item label="教学风格">
                    <div class="mes-content">{{teaPersonalInfoData.teachingSytle}}</div>
                  </el-form-item>
                  <el-form-item label="　　教龄">
                    <div class="mes-content">{{teaPersonalInfoData.teachingAge|teachingAgeFilter}}</div>
                  </el-form-item>
                  <el-form-item label="教学经验">
                    <div class="mes-content">{{teaPersonalInfoData.teachingExperience}}</div>
                  </el-form-item>
                  <el-form-item label="奖项荣誉">
                    <div class="mes-content lcy_box">
                      <el-input
                        v-if="editTeaPersonalInfoShow"
                        autofocus
                        placeholder="请填写奖项荣誉"
                        v-model="editTeaPersonalInfoData.honors">
                      </el-input>
                      <span v-else>{{editTeaPersonalInfoData.honors}}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="自我评价">
                    <div class="mes-content lcy_box">
                      <el-input
                        placeholder="请填写自我评价"
                        v-if="editTeaPersonalInfoShow"
                        v-model="editTeaPersonalInfoData.selfEvaluate">
                      </el-input>
                      <span v-else>{{editTeaPersonalInfoData.selfEvaluate}}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label=" " v-if="checkPermission('person-intro-edit')&&bu==3">&nbsp;
                    <el-button type="text" size="mini" @click="editTeaPersonalInfoClick" v-if="editBtnShow">编辑
                    </el-button>
                    <el-button type="text" size="mini" @click="sureTeaPersonalInfoClick" v-else>确定</el-button>
                  </el-form-item>
                </div>
                <el-form-item v-if="teaPersonalInfoData.teaVideoUrl" label="个人视频">
                  <span @click="viewVedio" class="vedioFontColor" title="点击预览">个人视频介绍.mp4</span>
                  　<i @click="deleteVedio" title="删除" class="el-icon-close vedioFontColorPointer"></i>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="薪资支付" name="salaryAnPay">
          <el-form :inline="true" :model="salaryAnPaylDataP" label-width="80px">
            <!--涉及到的模块：全职招师中的，待分配管理，面试管理，培训管理，入职管理:需要增加的显示字段-->
            <template v-if="showSaleryFlg">
              <el-form-item label="所属BU:" class="font-highlight" label-width="60px">
                {{saleryInfo.teaBuStr}}
              </el-form-item>
              <el-form-item label="教师资格证:" class="font-highlight"  label-width="80px">
                  <span :class="{'high-light': saleryInfo.certificateTypeStr &&
                  (saleryInfo.certificateTypeStr == '持本学科证' ||
                  saleryInfo.certificateTypeStr == '持本学科合格证' ||
                  saleryInfo.certificateTypeStr == '已持本学科证' ||
                  saleryInfo.certificateTypeStr == '持本学科考试合格证明')}">{{saleryInfo.certificateTypeStr}}</span>
              </el-form-item>
              <el-form-item label="年级偏好&擅长科目:" class="font-highlight" label-width="130px">
                <span :class="{'high-light': saleryInfo.teaTaughtStuGrade && saleryInfo.teaTaughtStuGrade == '高中'}">{{saleryInfo.teaTaughtStuGrade}} </span>
                <span>{{saleryInfo.teaGoodFirst}}</span>
              </el-form-item>
              <el-form-item label="学历&院校属性:" class="font-highlight" label-width="100px">
                <span
                  :class="{'high-light': saleryInfo.topEducationStr && (saleryInfo.topEducationStr == '硕士' || saleryInfo.topEducationStr == '博士')}">{{saleryInfo.topEducationStr}} </span>
                <span :class="{'high-light': saleryInfo.collegeLevel && saleryInfo.collegeLevel == '985'}">{{saleryInfo.collegeLevel}}</span>
              </el-form-item>
              <el-form-item label="院校:" class="font-highlight" label-width="50px">
                {{saleryInfo.topGraduatedSchool}}
              </el-form-item>
            </template>
            <!-- 陪练的等级-->
            <el-form-item v-if="bu==3" label="讲师等级" >
              <el-select v-model="salaryAnPaylDataP.level" placeholder="请选择">
                <el-option v-for="(item,index) in trainLevelData2" :key="index" :label="item.label"
                            :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="bu!=3"  label="讲师等级" >
              <el-select  disabled
                          v-model="salaryAnPaylDataP.level" placeholder="请选择" >
                <el-option @click.native="handleTeaLevel(salaryAnPaylDataP.level)" v-for="(item,index) in trainLevelData" :key="index" :label="item.label"
                            :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="bu!=3" class="is-required" label="基本薪资">
              <el-select disabled
                          :noregvalue="salaryAnPaylDataP.monthSalary" v-model="salaryAnPaylDataP.monthSalary"
                          placeholder="请选择" >
                <el-option v-for="(item,index) in salaryListData" :key="index" :label="item.label"

                            :value="item.labelValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="is-required" v-if="salaryAnPaylDataP.teaBu != 3" label="职位类型">
              <el-select v-model="salaryAnPaylDataP.positionType" placeholder="请选择职位类型">
                <el-option label="坐班" :value="1"></el-option>
                <el-option label="非坐班" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="teaStatue >= 4" label="是否缴纳社保">
              <el-select v-model="salaryAnPaylDataP.socialSecurity" placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户省">
              <el-select :disabled="salaryAnPaylDataP.bankProvinceEmpty"
                          v-model="salaryAnPaylDataP.bankProvince" placeholder="请选择省份">
                <el-option
                  v-for="(item,index) in proData"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户市">
              <el-select :disabled="salaryAnPaylDataP.bankCityEmpty"
                          v-model="salaryAnPaylDataP.bankCity" placeholder="请选择市">
                <el-option
                  v-for="(item,index) in cityData"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户银行">
              <el-select :disabled="salaryAnPaylDataP.bankNameEmpty" v-model="salaryAnPaylDataP.bankName"
                          placeholder="请选择">
                <el-option label="中国工商银行" value="中国工商银行">中国工商银行</el-option>
                <el-option label="中国农业银行" value="中国农业银行">中国农业银行</el-option>
                <el-option label="中国银行" value="中国银行">中国银行</el-option>
                <el-option label="中国建设银行" value="中国建设银行">中国建设银行</el-option>
                <el-option label="交通银行" value="交通银行">交通银行</el-option>
                <el-option label="中信银行" value="中信银行">中信银行</el-option>
                <el-option label="中国光大银行" value="中国光大银行">中国光大银行</el-option>
                <el-option label="华夏银行" value="华夏银行">华夏银行</el-option>
                <el-option label="中国民生银行" value="中国民生银行">中国民生银行</el-option>
                <el-option label="广发银行" value="广发银行">广发银行</el-option>
                <el-option label="平安银行" value="平安银行">平安银行</el-option>
                <el-option label="招商银行" value="招商银行">招商银行</el-option>
                <el-option label="兴业银行" value="兴业银行">兴业银行</el-option>
                <el-option label="浦发银行" value="浦发银行">浦发银行</el-option>
                <el-option label="中国邮政储蓄银行" value="中国邮政储蓄银行">中国邮政储蓄银行</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="银行支行">
              <el-input :disabled="salaryAnPaylDataP.bankBranchEmpty"
                        v-model="salaryAnPaylDataP.bankBranch"></el-input>
            </el-form-item>
            <el-form-item label="银行账号">
              <el-input :disabled="salaryAnPaylDataP.bankAccountEmpty"
                        v-model="salaryAnPaylDataP.bankAccount"></el-input>
            </el-form-item>
            <!-- <el-form-item label="身份证号">
              <el-input v-model="salaryAnPaylDataP.chinaId"></el-input>
            </el-form-item> -->
            <el-form-item label="支付宝号">
              <el-input v-model="salaryAnPaylDataP.alipayAccount"></el-input>
            </el-form-item>
            <div>
              <el-form-item label="备注信息"></el-form-item>
            </div>
            <div>
              <el-input type="textarea" :rows="6" size="medium" v-model="salaryAnPaylDataP.remark"></el-input>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="teaStatue > 2 && bu != 3" label="入职资料" name="entryInfo">
          <entry-info ref="entryInfo" :viewState="viewState" :cipherTId="cipherTId" :currentID="currentID"></entry-info>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="control">
      <el-button style="margin-right:50px;" v-if="selectMode == 'info' &&  baseInfoP.chinaIdState == '0'" type="primary"
                 @click="authentication">实名认证
      </el-button>
      <el-button v-if="selectMode == 'info' &&  baseInfoP.chinaIdState == '1'" @click="openCancelAuth" type="primary">
        取消实名认证
      </el-button>
      <el-button @click="cancel"
                 v-if="selectMode !== 'introduce'">取消
      </el-button>
      <el-button @click="confirm" type="primary"
                 v-if="selectMode !== 'introduce'">{{confirmText}}
      </el-button>
    </div>
    <time-remark :show="cancelAuthDialog" title="取消实名认证" @cancel="cancelCancelAuth" @confirm="confirmCancelAuth"
                 remark-title="备注"></time-remark>

    <el-dialog title="教师风采-大图预览" :modal='false' v-model="dialogTeacherMien">
      <div class="teacher-mien-img" :style="'background-image:url('+teacherMienImg+')'"></div>
    </el-dialog>

    <!--预览pc版少儿 页面 dialog-->
    <el-dialog :white="true" title="预览 少儿" id="previewChildPageDialog" v-model="previewChildPageDialog"
               :modal='false' size="large" @close="cancelPreviewChildPageDialog">
      <el-radio-group v-model="previewChildRadio">
        <el-radio-button label="new">个人介绍（新版）</el-radio-button>
      </el-radio-group>
      <iframe :src="previewPCChildPageUrl" height="800" width="100%"></iframe>
    </el-dialog>

    <div v-if="viewVedioDialog" class="fixedVedio">
      <div class="sameParent">
        <div class="title"><i class="el-icon-close" @click="handleClose"></i></div>
        <div class="contentParentsVideo">
          <video controls autoplay controlsList="nodownload">
            <source :src="teaPersonalInfoData.teaVideoUrl" type="video/mp4" >
          </video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {objectEqual, deepCopy} from '../../../src/utils/assist';
  import updateBasicInfo from '../../api/action/updateBasicInfo';
  import updateSalaryAnPay from '../../api/action/updateSalaryAnPay';
  import updateTeaEduBackInfo from '../../api/action/updateTeaEduBackInfo';
  import getProvinces from '../../api/select/getProvinces';
  import getCitys from '../../api/select/getCitys';
  import {gradeSubject} from '../../../src/data/index.js';
  import imgBox from '../agent_referral/imgbox.vue';
  import getSubject from '../../api/select/getSubject';
  import getSubjectNew from '../../api/select/getSubjectNew';
  import getPhase from '../../api/select/getPhase';
  import getPhaseNew from '../../api/select/getPhaseNew';
  import getTeaLevel from '../../api/select/getTeaLevel';
  import {getTeaLevelWithSalary} from '../../api/select/teaInfoCard';
  import damiPwdInput from 'dami-pwd-input';
  import teacherInfoSetTeacherRealName from '../../api/action/teacherInfoSetTeacherRealName';
  import entryInfo from '../userInfoItems/entry_info';
  import cancelTeacherRealName from '../../api/action/cancelTeacherRealName';
  import getSalaryRelatedField from '../../api/select/getSalaryRelatedField'; // 获取定薪相关字段
  import teacherCertificateMixin from './teacherCertificateMixin';
  import basicInfo from '../../api/select/basicInfo'; // 获取身份证信息
  import getChildPreviewImgUrl from '../../api/select/getChildPreviewImgUrl'; // 获取少儿的预览图片url
  import salaryAnPay from '../../api/select/salaryAnPay';
  import commonCascade from '../../api/select/commonCascade';
  import getTeacherTypes from '../../api/select/getTeacherTypes';
  import getTeaMobile from '../../api/select/getTeaMobile'; // 查询手机号
  import {getTeaCertificateList} from '../../api/select/getTeaCertificate'
  import {getProvinceCityCounty} from '../../api/common'

  let defaultHeadImg = require('../../../src/assets/default.jpg');

  // 配置少儿的预览访问url
  let localhostUrl = 'https://zmkids-h5.zmpeiyou.com/kids-pad/';
  let curHash = window.location.href;
  if (curHash.indexOf('b.zmlearn.com:') > -1 || curHash.indexOf('p-test.zmlearn.com') > -1) {
    localhostUrl = 'https://kids-active.zmaxis.com/pad/';
  } else if (curHash.indexOf('p.uat.zmops.cc') > -1) {
    localhostUrl = 'https://zmkids-h5.uat.zmops.cc/kids-pad/';
  } else {
    localhostUrl = 'https://zmkids-h5.zmpeiyou.com/kids-pad/';
  }

  export default {
    mixins: [teacherCertificateMixin],
    data() {
      return {
        provinceCityCounty: [],
        provinceCityCountyOptions: [],
        provinceCityCountyProps: {
          value: 'label'
        },
        specialAdantageOption:[],
        isFullTimeOptions:[],
        spcialSystemOptions:[],
        diplomaOptions:[],
        jobStateOptions:[],
        currentJobOptions: [],
        careerPlanOPtions:[],
        teaMaritalOptions:[],
        allLevelAndSalaryList:[],
        LevelandsalaryData:[],
        salaryListData:[],
        teaCerOptions: [], // 教师资格状态列表
        teaTypeDisable:false,// 老师类型判断条件，用于设置工作性质是否允许修改
        workTypeDisable: false, // 工作性质判断条件，用于设置工作性质是否允许修改
        viewVedioDialog: false,
        basicMobileSeen: false, // 老师联系电话：是否已查看手机号
        emergencyMobileSeen: false, // 紧急联系人电话：是否已查看手机号
        referMobileSeen: false, // 推荐人电话：是否已查看手机号
        editTeaPersonalInfoData: {
          honors: '',
          selfEvaluate: '',
        },
        editTeaPersonalInfoShow: false,
        editBtnShow: true,
        isBuinit: true,
        gradeHobby: [],
        basesubject: [],
        hignSchollSub: [],
        selectMode: 'info',
        confirmText: '确定',
        salaryList: [],
        proData: [],
        cityData: [],
        waitShowPro: '',
        token: '',
        waitShowCity: '',
        proData_edu: [], // 省
        cityData_edu: [], // 市
        teaAreaOptions: [], // 区
        waitShowPro_edu: '',
        waitShowCity_edu: '',
        trainLevelData: [],
        trainLevelData2:[],
        chinaIdContent: '******************', // 身份证信息
        showChinaidVal: '显示', // 显示，隐藏身份证信息flg
        chinaidState: '', // 身份证实名认证flg
        curPage: '', // 标示当前是哪个页面
        previewChildPageDialog: false, // 少儿：预览pc版弹窗显示flg
        previewPCChildPageUrl: '', // 少儿：预览pc版页面url
        previewChildRadio: 'new', // 少儿预览
        showSaleryFlg: false, // 全职招师中的，待分配管理，面试管理，培训管理，入职管理 显示定薪相关内容
        saleryInfo: { // 定薪相关信息
          teaBuStr: '', // bu
          certificateTypeStr: '', // 教师资格证
          teaTaughtStuGrade: '', // 年级偏好
          teaGoodFirst: '', // 擅长科目
          topEducationStr: '', // 学历
          collegeLevel: '', // 院校属性
          topGraduatedSchool: '', // 院校
        },
        baseInfoP: {
          teaName: '',
          nickName: '',
          teaMobile: '',//
          teaProv: '', // 居住所在省
          teaCity: '', // 居住所在市
          teaArea: '', // 居住所在区
          teaAddress: '', // 居住详细地址
          teaGender: '',//男 女
          teaEmail: '',
          qq: '',
          chinaIdState: '',
          certificateType: '',
          chinaId: '',
          remark: '',
          emergencyContactRelation: '',
          emergencyContactName: '',
          emergencyContactMobile: '',
          referMobile: '', // 推荐人手机
        },
        salaryAnPaylDataP: {
          bankAccount: '',//   银行账号    string
          bankBranch: '',//    支行  string
          bankName: '',//  名称  string
          level: '',// 老师等级    string
          alipayAccount: '',//支付宝
          // chinaId:"",//身份证
          bankProvince: '',//银行省
          bankCity: '',//银行城市
          monthSalary: '',//   月薪  string
          positionType: 2,//  坐班状态    string  职位状态-0:默认,1:坐班,2:非坐班
          teaType: '0',
          socialSecurity: '',
          remark: '',//
        },
        eduBackDataP: {
          certificatePeriodDesc:'',
          certificateSubjectDesc:"",
          isFullTime:'',//学习形式
          specialSystem:'',//特殊制
          diploma:'',//毕业证
          jobState:"",//工作状态
          currentJob: '', //当前从事工作
          careerPlan:'',//职业计划
          maritalStatus:'',//婚姻状况
          teacherCertificate: '', // 教师资格状态
          teaBu: '',//所属BU
          teaWenli: '',//文理科
          teaSchoolGao: '',//高中学校
          ceeProvince: '',//高考所在地
          ceeCity: '',//高考所在地
          ceeSubjectFirst: '',//科目
          ceeSubjectFirstScore: '',//分数
          ceeSubjectFirstTotalScore: '',//总分
          ceeSubjectSecond: '',//科目
          ceeSubjectSecondScore: '',//分数
          ceeSubjectSecondTotalScore: '',//总分
          ceeSubjectThird: '',//科目
          ceeSubjectThirdScore: '',//分数
          ceeSubjectThirdTotalScore: '',//总分
          graduateInfos: [],//学习经历
          workInfos: [],//工作经历
          certificateUrls: [{url: ''}],//学历证书
          teaTaughtStuGrade: [],///   学生年级偏好中文
          teaTaughtStuLevel: [],//学生水平偏好中文
          goodFirstSubject: '',//第一擅长科目中文
          teaRegion: '其他', //所在分区
          teacherAttr: {
            classType: null,
            timeType: '',
            goodFirstSubjectCode: '',
            goodSecondSubjectCode: '',
            taughtStuLevelCode: [],///学生水平偏好
            enableAppointSubjectCode: [],//上课科目
            teaTaughtStuGradeCode: [],//年级偏好
            majorTeacher: '',//是否主课老师 1 是 0 否
            teachingExperience: '',//教学经验
            abrsm: '',//是否英皇辅导经验 1 是 0 否
          },
        },
        personalAdvantage: [],
        teacherSculpture: {
          ossPath: '',
          fileOrigName: '',
        },
        cancelAuthDialog: false,
        dialogTeacherMien: false,
        teacherMienImg: '',
        periodState: '', // 所处阶段
        TeaRegionOption: [], // 所在分区 option
        classTypeData: [{
          label:'1对1',
          value:'1000'
        },{
          label:"小班课",
          value:"2000"
        },{
          label:"1对2",
          value:'3000'
        }], // 课程类型 option
        teaTypeOption: [], // 老师等级
        specialAdantageOption: [], // 个人优势
        timeTypeCopy: '',
        teacherType: '',
        hoverSrc: require('../../../src/images/hover.png'),
        hoverString: [],
      };
    },
    props: {
      currentRoute:'',
      currentID: null, // 老师ID
      cipherTId: '', // 老师密文ID
      prodata: null,
      teaStatue: Number,//表示当前打开页级别,如果是面试管理界面打开的则 看不到教师介绍和薪资
      baseInfo: Object,//基本信息
      eduBackData: Object,//教学背景
      salaryAnPaylData: Object,//薪资
      teaPersonalInfoData: Object,//个人介绍
      bu: '',
      name: '',
      viewState: false,//false表示页面关闭，true表示页面展开
    },
    filters: {
      teachingAgeFilter(val) {
        if (!val) {
          return val == 0 ? '0年' : '';
        } else {
          return val == 10 ? '10年及以上' : val + '年';
        }
      },
    },
    computed: {
      levelDisabled() {
        if (this.bu == '1') {
          return true;
        }
        if (this.bu == '2') {
          return true;
        }
        if (this.bu == '3') {
          return false;
        }
      },
      teacherSculptureInit() {
        let headImageUrl = '';
        if (this.teacherSculpture.ossPath) {
          headImageUrl = this.teacherSculpture.ossPath;
        } else {
          headImageUrl = this.teaPersonalInfoData.headImageUrl;
        }
        return headImageUrl;
      },

      hasCertificate() {
        const {certificateType, certificateState, certificateNum} = this.teaPersonalInfoData;
        return certificateType || certificateType === 0 || certificateState || certificateState === 0 || certificateNum;
      },
    },
    watch: {
      basesubject(val) {
        if (val.length == 0) {
          return;
        }
        let secondExsit = false,
          oneExsit = false;
        for (let i = 0; i < val.length; i++) {
          if (val[i].value == this.eduBackDataP.teacherAttr.goodFirstSubjectCode) {
            oneExsit = true;
          }
          if (val[i].value == this.eduBackDataP.teacherAttr.goodSecondSubjectCode) {
            secondExsit = true;
          }
        }
        if (oneExsit == false) {
          this.eduBackDataP.goodFirstSubject = '';
          this.eduBackDataP.teacherAttr.goodFirstSubjectCode = '';
        }
        if (secondExsit == false) {
          this.eduBackDataP.goodSecondSubject = '';
          this.eduBackDataP.teacherAttr.goodSecondSubjectCode = '';
        }
      },
      prodata(value) {
        if (value) {
          this.proData = value;
          this.proData_edu = value;
        }
      },
      viewState(value) {
        if (!value) {
          this.baseInfoP = {
            teaName: '',
            nickName: '',
            teaMobile: '',//
            teaGender: '',//男 女
            teaEmail: '',
            teaProv: '', // 居住所在省
            teaCity: '', // 居住所在市
            teaArea: '', // 居住所在区
            qq: '',
            chinaIdState: '',
            certificateType: '',
            chinaId: '',
            remark: '',
            emergencyContactRelation: '',
            emergencyContactMobile: '',
            emergencyContactName: '',
          };
          this.salaryAnPaylDataP = {
            bankAccount: '',// 银行账号    string
            bankBranch: '',//  支行  string
            bankName: '',//    名称  string
            level: '',//   老师等级    string
            alipayAccount: '',//支付宝
            // chinaId:"",//身份证
            bankProvince: '',//银行省
            bankCity: '',//银行城市
            monthSalary: '',// 月薪  string
            positionType: '',//    坐班状态    string  职位状态-0:默认,1:坐班,2:非坐班
            teaType: '0',
            socialSecurity: '',
            remark: '',//
          };
          this.eduBackDataP = {
            certificatePeriodDesc:'',
          certificateSubjectDesc:"",
          isFullTime:'',//学习形式
          specialSystem:'',//特殊制
          diploma:'',//毕业证
          jobState:"",//工作状态
          careerPlan:'',//职业计划
          maritalStatus:'',//婚姻状况
            teacherCertificate: '', // 教师资格状态
            teaBu: '',//所属BU
            teaWenli: '',//文理科
            teaSchoolGao: '',//高中学校
            ceeProvince: '',//高考所在地
            ceeCity: '',//高考所在地
            ceeSubjectFirst: '',//科目
            ceeSubjectFirstScore: '',//分数
            ceeSubjectFirstTotalScore: '',//总分
            ceeSubjectSecond: '',//科目
            ceeSubjectSecondScore: '',//分数
            ceeSubjectSecondTotalScore: '',//总分
            ceeSubjectThird: '',//科目
            ceeSubjectThirdScore: '',//分数
            ceeSubjectThirdTotalScore: '',//总分
            graduateInfos: [],//学习经历
            workInfos: [],//工作经历
            certificateUrls: [{url: ''}],//学历证书
            teaTaughtStuGrade: [],///  学生年级偏好中文
            teaTaughtStuLevel: [],//学生水平偏好中文
            goodFirstSubject: '',//第一擅长科目中文
            teacherAttr: {
              classType: null,
              timeType: '',
              goodFirstSubjectCode: '',
              goodSecondSubjectCode: '',
              enableAppointSubjectCode: [],
              teaTaughtStuGradeCode: [],//年级偏好
              taughtStuLevelCode: [],///学生水平偏好
              majorTeacher: '',//是否主课老师 1 是 0 否
              teachingExperience: '',//教学经验
              abrsm: '',//是否英皇辅导经验 1 是 0 否
            },
          };
          this.selectMode = 'info';
          this.basesubject = [];
          this.isBuinit = true;
        } else {
          this.isBuinit = true;
          // this.initTrainLevelData();
        }
      },
      baseInfo(value) {
        if (!!value) {
          this.chinaIdContent = '******************';
          this.baseInfoP = JSON.parse(JSON.stringify(value));
          this.provinceCityCounty = this.baseInfoP.teaArea ? [this.baseInfoP.teaProv, this.baseInfoP.teaCity ,this.baseInfoP.teaArea] : [];
          this.chinaidState = value.chinaIdState;
          this.basicMobileSeen = false;
          /** api/teacher-web/api/cascade/dict/service **/
        }
        this.listRelease();
        this.referMobileSeen = false;
      },
      async salaryAnPaylData(value) {
        if (!!value) {
          //Object.assign(this.salaryAnPaylDataP,value);
          this.salaryAnPaylDataP = deepCopy(value);
          this.salaryAnPaylDataP.level = this.salaryAnPaylDataP.level + '';


          this.waitShowPro = this.salaryAnPaylData.bankProvince;
          this.waitShowCity = this.salaryAnPaylData.bankCity;
          if (value.teaBu == 2 || value.teaBu == 1 || value.teaBu == 5) {
            if (!this.salaryAnPaylDataP.positionType) {
              this.salaryAnPaylDataP.positionType = 2;
            }
          }
        }

      },
      eduBackData(value) {
        if (!!value) {
          //Object.assign(this.eduBackDataP,value);
          // 教师资格证状态，转换成字符串
          value.teacherCertificate = value.teacherCertificate || value.teacherCertificate == 0 ? value.teacherCertificate.toString() : '';
          this.eduBackDataP = deepCopy(value);
          if(value.teacherAttr) this.timeTypeCopy = value.teacherAttr.timeType;
          (window.isEmpty(value.graduateInfos) || value.graduateInfos.length == 0) ? (this.eduBackDataP.graduateInfos = [{
            education: '',
            graduatedYear: '',
            graduatedSchool: '',
            subMajor: '',
            fromYear: '',
            educationForm: '1',
            certificate: '1',
            specialEdu: '0',
          }]) : null;
          window.isEmpty(value.workInfos) ? (this.eduBackDataP.workInfos = []) : null;
          if (window.isEmpty(value.teacherAttr)) {
            this.eduBackDataP.teacherAttr = {
              classType: null,
              timeType: '',
              goodFirstSubjectCode: '',
              goodSecondSubjectCode: '',
              taughtStuLevelCode: [],///学生水平偏好
              teaTaughtStuGradeCode: [],//年级偏好
              enableAppointSubjectCode: [],
              majorTeacher: '',//是否主课老师 1 是 0 否
              teachingExperience: '',//教学经验
              abrsm: '',//是否英皇辅导经验 1 是 0 否
            };
          }
          // teaTaughtStuGrade     (--|传进来  参数的字段|--)
          // teaTaughtStuGradeCode (--|v-modle绑定的字段|--)
          if (!window.isEmpty(value.teacherAttr)) {
            window.isEmpty(value.teacherAttr.enableAppointSubjectCode) ? (this.eduBackDataP.teacherAttr.enableAppointSubjectCode = []) : null;
            window.isEmpty(value.teacherAttr.teaTaughtStuGradeCode) ? (this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode = []) : null;
            window.isEmpty(value.teacherAttr.taughtStuLevelCode) ? (this.eduBackDataP.teacherAttr.taughtStuLevelCode = []) : null;
          }
          if (typeof (this.eduBackDataP.teacherAttr.enableAppointSubjectCode) == 'string') {
            this.eduBackDataP.teacherAttr.enableAppointSubjectCode = this.eduBackDataP.teacherAttr.enableAppointSubjectCode.split(',');
          }
          if (typeof (this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode) == 'string') {
            this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode = this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode.split(',');
          }

          if (typeof (this.eduBackDataP.teacherAttr.taughtStuLevelCode) == 'string') {
            this.eduBackDataP.teacherAttr.taughtStuLevelCode = this.eduBackDataP.teacherAttr.taughtStuLevelCode.split(',');
          }
          if (!window.isEmpty(value)) {
            window.isEmpty(value.teaTaughtStuGrade) ? (this.eduBackDataP.teaTaughtStuGrade = []) : null;
            window.isEmpty(value.teaTaughtStuLevel) ? (this.eduBackDataP.teaTaughtStuLevel = []) : null;
          }
          if (typeof (this.eduBackDataP.teacherAttr.taughtStuLevelCode) == 'string') {
            this.eduBackDataP.teaTaughtStuLevel = this.eduBackDataP.teaTaughtStuLevel.split(',');
          }

          (window.isEmpty(value.awardFiles) || value.awardFiles.length == 0) ? (this.eduBackDataP.awardFiles = [{
            ossPath: '',
            fileOrigName: '',
          }]) : null;

          (window.isEmpty(value.certificateUrls) || value.certificateUrls.length == 0) ? (this.eduBackDataP.certificateUrls = [{url: ''}]) : null;
          this.waitShowPro_edu = this.eduBackDataP.ceeProvince;
          this.waitShowCity_edu = this.eduBackDataP.ceeCity;
           this.eduBackDataP.certificatePeriodDesc=value.certificatePeriodDesc;
          this.eduBackDataP.certificateSubjectDesc=value.certificatePeriodDesc;
          this.eduBackDataP.isFullTime=value.isFullTime;//学习形式
          this.eduBackDataP.specialSystem=value.specialSystem;//特殊制
          this.eduBackDataP.diploma=value.diploma;//毕业证
          this.eduBackDataP.jobState=value.jobState;//工作状态
          this.eduBackDataP.careerPlan=value.careerPlan;//职业计划
          this.eduBackDataP.maritalStatus=value.maritalStatus;//婚姻状况

        }
        // 所属分区
        this.getTeaRegionOption();
      },
      selectMode(val) {
        if (val == 'entryInfo') {
          this.confirmText = '审核';
        } else {
          this.confirmText = '确定';
        }
        if (val === 'salaryAnPay') {
          this.getSaleryInfo(); // 获取定薪相关字段
          this.initTrainLevelData();
        }
        if(val === 'backGround') {
          this.getTeaType();
        }
      },
      'salaryAnPaylDataP.bankProvince': function (name) {
        this.salaryAnPaylDataP.bankCity = '';
        this.getCityData(this.getProId(name));
      },
      'eduBackDataP.ceeProvince': function (name) {
        this.eduBackDataP.ceeCity = '';
        this.getCityData_edu(this.getProId_edu(name));
      },
      'eduBackDataP.teaBu': function (val, oldval) {
        if (oldval != '' && this.isBuinit == false) {
          this.eduBackDataP.teacherAttr.courseTypes = [] // 清除授课类型
          this.teacherType = ''   // 清除老师类型
          this.eduBackDataP.teaRegion = ''  // 清除所在分区
           this.eduBackDataP.teacherAttr.teaRegionCode = ''
          this.TeaRegionOption =[]
          this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode = []
          this.eduBackDataP.teacherAttr.teaTaughtStuGrade = ''
          this.clearGradeHobby();//清除学段
          this.clearGoodFirstSub();//清除擅长科目
          this.clearSub();//清除预约科目
          this.$forceUpdate()
        }
        this.isBuinit = false;
        if (val == '2') { // 少儿 BS1501
          this.initgetPhaseNew();
        } else {
          this.initgetPhase();//初始化学段数据
        }
        this.initSubject();//获取擅长科目数据
        this.initAppointmentSubject();//获取预约科目数据
        // this.initTrainLevelData();
        this.getTeaRegionOption(val);
        this.getSPECIAL_ADVANTAGE();
      },
      'eduBackDataP.teacherAttr.teaTaughtStuGradeCode': function (val, oldval) {
        // 修复选择少儿时，无法显示第一擅长科目，临时方案：在为少儿时，不清除第一擅长科目，后续和后端，产品确认逻辑后，看怎么修改
        if (oldval != '') {
          this.$nextTick(_=>{
            this.clearGoodFirstSub();//清除擅长科目
            this.clearSub();//清除预约科目
          })
        }
        if (this.eduBackDataP.teaBu == '2') { // 年级偏好少儿BS1501
          this.initSubjectNew();//获取擅长科目数据
        } else {
          this.initSubject();//获取擅长科目数据
        }
        this.initAppointmentSubject();//获取预约科目数据
      },
      'eduBackDataP.teacherAttr.goodFirstSubjectCode': function (val, oldval) {
        if (oldval != '') {
          this.clearSub(); // 清除预约科目
        }
        if (this.eduBackDataP.teaBu == '2') { // 擅长科目关联上课科目-少儿BS1501
          this.initAppointmentSubjectNew();
        } else {
          this.initAppointmentSubject();//重新获取预约科目数据
        }
      },
      'eduBackDataP.teacherAttr.timeType': function (val, oldval) {
        // this.initTrainLevelData();
      },
      teaPersonalInfoData(_new, _old) {
        const {honors, selfEvaluate} = _new;
        this.editTeaPersonalInfoData.honors = _new.honors;
        this.editTeaPersonalInfoData.selfEvaluate = _new.selfEvaluate;
      },
    },
    methods: {
      handleTeaLevel(val){
       const data = this.LevelandsalaryData.find(item => item.value === val)
        if(data) {
          this.salaryAnPaylDataP.monthSalary=data.extendValue; // 改变基本薪资
        }
      },
      handleTeaSalary(val){
        const data = this.LevelandsalaryData.find(item => item.value === val)
        if(data) {
          this.salaryAnPaylDataP.level=data.value;
        }
      },
      // 获取老师手机号详情
      showMobile(type) {
        let parm = {
          teaId: this.currentID,
          infoType: type
        };
        getTeaMobile(parm).then(data => {
          if (data) {
            if (type === 'mobile') { // 老师联系电话
              this.basicMobileSeen = true;
              this.baseInfoP.teaMobile = data;
            } else if (type === 'emergencyContactMobile') {
              this.emergencyMobileSeen = true;
              this.baseInfoP.emergencyContactMobile = data;
            } else if (type === 'referMobile') {
              this.referMobileSeen = true;
              this.baseInfoP.referMobile = data;
            }
          }
        }).catch(message => {
          this.$Message.error('未查询到手机号');
        });
      },
      async handlerSavePhoto(url) {
        await this.$Fetch({
          url: `/api/teacherInfo/setHeadImageUrl?teaId=${this.teaPersonalInfoData.teaId}&headImageUrl=${url}`,
          method: 'get',
        })
          .then(res => {
            if (res.code === '0') {
              this.$Message({
                type: 'success',
                message: '图片上传成功!',
              });
            }
          })
          .catch(err => {
            this.$Message({
              type: 'error',
              message: '图片上传失败!',
            });
          });
      },
      isEmpty(val, attr) {
        if (typeof this.initList[attr] != 'undefined') {
          return this.initList[attr];
        } else {
          this.initList[attr] = !!val;
          return !!val;
        }
      },
      // 预览pc版
      previewPC(personalData) {
        // BU为少儿时，获取少儿页面url
        getChildPreviewImgUrl({
          id: this.teaPersonalInfoData.teaId,
        })
          .then(res => {
            this.previewChildPageDialog = true;
            this.previewPCChildPageUrl = localhostUrl + 'teacherIntroduction.html?encryptId=' + res + '&from=teacher-pc';
          });
      },
      // 关闭少儿预览pc版 弹窗
      cancelPreviewChildPageDialog() {
        this.previewChildPageDialog = false;
      },
      // 获取身份证信息
      showChinaidContent() {
        this.showChinaidVal = this.showChinaidVal === '显示' ? '隐藏' : '显示';
        if (this.showChinaidVal === '显示') {
          this.chinaIdContent = '******************';
          return;
        }
        basicInfo({teaId: this.cipherTId})
          .then(data => {
            this.chinaIdContent = data.chinaId || '';
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      selectImg(val) {
        this.teacherSculpture.ossPath = val;
        if (val) this.handlerSavePhoto(val);
      },
      initTrainLevelData() {
        // if (this.eduBackDataP.teaBu + '' == '') {
        //   return;
        // }
        // if (this.eduBackDataP.teacherAttr.timeType + '' == '') {
        //   return;
        // }

        //bu=3（陪练适合的薪资等级）
        this.trainLevelData2 = [];
        this.trainLevelData = [];
        let parm = {
          bu: this.eduBackDataP.teaBu,
          TEACHER_ORIGIN: this.eduBackDataP.teacherAttr.timeType,
          teaId:this.currentID
        };
        let _data = [];
        //针对 bu=3

        getTeaLevel(this.currentID)
          .then(data => {
            if(data.children&&data.children.length>0){
               for (let i = 0; i < data.children.length; i++) {
              _data.push({
                value: data.children[i].value + '',
                label: data.children[i].label,
              });
            }
            this.trainLevelData2 = _data;
            }

          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
        //针对 bu=1||bu=2
        let levelData = [];
        let salaryData= [];
        getTeaLevelWithSalary(parm)
          .then(data => {

            this.LevelandsalaryData=data.children
            if(data.children&&data.children.length>0){
            for (let i = 0; i < data.children.length; i++) {
              levelData.push({
                value: data.children[i].value + '',
                label: data.children[i].label,
              });
              salaryData.push({
                value: data.children[i].extendValue,
                label: data.children[i].extendLabel,
                labelValue: data.children[i].value,
              })
            }
            this.trainLevelData = levelData;
            this.salaryListData = salaryData;
            }}
          )
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      delZmUpload(index) {
        this.eduBackDataP.awardFiles.splice(index, 1);
      },
      delcerUpload(index) {
        this.eduBackDataP.certificateUrls.splice(index, 1);
      },
      addZmUpload() {
        this.eduBackDataP.awardFiles.push({
          ossPath: '',
          fileOrigName: '',
        });
      },
      getChinaIdStateStr(state) {
        if (state == '1') {
          return '已实名认证';
        }
        if (state == '0') {
          return '未实名认证';
        }
        return '';
      },
      checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
      },
      addcerUpload() {
        this.eduBackDataP.certificateUrls.push({url: ''});
      },
      clearGoodFirstSub() {
        this.eduBackDataP.teacherAttr.goodFirstSubjectCode = '';//科目
        this.eduBackDataP.teacherAttr.goodSecondSubjectCode = '';//科目
        this.eduBackDataP.goodFirstSubject = '';
        this.eduBackDataP.goodSecondSubject = '';

      },
      clearGradeHobby() {
        this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode = [];
        this.eduBackDataP.teaTaughtStuGrade = [];
      },
      clearSub() {
        this.eduBackDataP.teacherAttr.enableAppointSubjectCode = [];
      },
      initgetPhase() {
        this.gradeHobby = [];
        let bu = this.eduBackDataP.teaBu;
        if (!bu) {
          return;
        }
        getPhase({
          bu: bu,
        })
          .then(data => {
            this.gradeHobby = data.children;
          })
          .catch(message => {
            this.gradeHobby = [];
          });
      },
      /**
       * @Function  dealTeaTaughtStuGradeCode
       * 假如年级字段(teaTaughtStuGradeCode)为空, 需要根据数据字典选择对应
       * teaTaughtStuGrade(中文, 逗号连接的字符串)   teaTaughtStuGradeCode(英文, 数组)
       */
      dealTeaTaughtStuGradeCode(filterArr) {
        if (this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode.length === 0 &&
          !Array.isArray(this.eduBackDataP.teaTaughtStuGrade)) {
          let grade = this.eduBackDataP.teaTaughtStuGrade.split(',');
          grade.forEach(item => {
            filterArr.forEach(itemfilter => {
              if (itemfilter.label === item) {
                this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode.push(itemfilter.value);
              }
            });
          });
        }
      },
      initgetPhaseNew() {
        this.gradeHobby = [];
        let bu = this.eduBackDataP.teaBu;
        if (!bu) {
          return;
        }
        getPhaseNew({
          bu: bu,
        })
          .then(data => {
            this.gradeHobby = data.children;
            this.dealTeaTaughtStuGradeCode(data.children);
          })
          .catch(message => {
            this.gradeHobby = [];
          });
      },
      initAppointmentSubject() {
        let bu = this.eduBackDataP.teaBu;
        let sub = this.eduBackDataP.teacherAttr.goodFirstSubjectCode;
        let phase = this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode.toString();
        if (!bu || !sub || !phase) {
          return;
        }
        let parm = {
          bu: bu,
          sub: sub,
          phase: phase,
        };
      },
      initAppointmentSubjectNew() {
        let bu = this.eduBackDataP.teaBu;
        let sub = this.eduBackDataP.teacherAttr.goodFirstSubjectCode;
        let phase = this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode.toString();
        if (!bu || !sub || !phase) {
          return;
        }
        let parm = {
          bu: bu,
          sub: sub,
          phase: phase,
        };
      },
      getTextByValueForGoodFirst(id) {
        let text = '';
        for (let i = 0; i < this.basesubject.length; i++) {
          if (this.basesubject[i].value == id) {
            text = this.basesubject[i].label;
            break;
          }
        }
        return text;
      },
      getTeaTaughtStuGradeText(d) {
        if (Object.prototype.toString.call(d) !== '[object Array]') {
          d = [d];
        }

        let _data = [];
        for (let i = 0; i < d.length; i++) {
          _data.push(this.getTextByValueForTeaTaughtStuGrade(d[i]));
        }
        return _data;
      },
      getTextByValueForTeaTaughtStuGrade(id) {
        let text = '';
        for (let i = 0; i < this.gradeHobby.length; i++) {
          if (this.gradeHobby[i].value == id) {
            text = this.gradeHobby[i].label;
            break;
          }
        }
        return text;
      },
      getProId(name) {
        let id = '';
        for (let i = 0; i < this.proData.length; i++) {
          if (this.proData[i].name == name) {
            id = this.proData[i].id;
            break;
          }
        }
        return id;
      },
      getProId_edu(name) {
        let id = '';
        for (let i = 0; i < this.proData_edu.length; i++) {
          if (this.proData_edu[i].name == name) {
            id = this.proData_edu[i].id;
            break;
          }
        }
        return id;
      },
      getProData() {
        getProvinces()
          .then(data => {
            this.proData = data;
            if (this.waitShowPro) {
              this.salaryAnPaylDataP.bankProvince = this.waitShowPro;
              this.waitShowPro = '';
            }
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      getProData_edu() {
        getProvinces()
          .then(data => {
            this.proData_edu = data;
            if (this.waitShowPro_edu) {
              this.eduBackDataP.ceeProvince = this.waitShowPro_edu;
              this.waitShowPro_edu = '';
            }
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      empty(val) {
        if (val == null) {
          return true;
        }
        if (typeof val == 'undefined') {
          return true;
        }
        if (val == '') {
          return true;
        }
        return false;
      },
      getCityData(id) {
        if (!id) {
          return;
        }
        getCitys({provinceId: id})
          .then(data => {
            this.cityData = data;
            if (this.waitShowCity) {
              this.salaryAnPaylDataP.bankCity = this.waitShowCity;
              this.waitShowCity = '';
            }
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      getCityData_edu(id) {
        if (!id) {
          return;
        }
        getCitys({provinceId: id})
          .then(data => {
            this.cityData_edu = data;
            if (this.waitShowCity_edu) {
              this.eduBackDataP.ceeCity = this.waitShowCity_edu;
              this.waitShowCity_edu = '';
            }
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      restoreLogo(picSrc) {
        if (!!document.getElementById('basecHeadAvatarImg') && !picSrc) {
          document.getElementById('basecHeadAvatarImg').src = defaultHeadImg;
        }
      },
      cancel() {
        this.$emit('cancel');
      },
      preView() {
        if (this.teaPersonalInfoData.teaBu == 2) {
          this.previewPC(); // train2144, 若老师为少人Bu,则预览接新的少儿预览页面，且仅展示已审核内容。
        } else {
          this.$emit('preview', this.teaPersonalInfoData);
        }
      },
      applyGradeChange() {
        this.gradeChange(this.baseInfoP.applyGrade);
      },
      gradeChange(value) {
        this.subjectList = [];
        (gradeSubject[value] || []).forEach((val) => {
          this.subjectList.push({
            value: val,
            label: val,
          });
        });
      },
      confirm() {
        let promise = null;

        switch (this.selectMode) {
          case 'info':
            if (!!this.baseInfo && !objectEqual(this.baseInfoP, this.baseInfo)) {
              this.baseInfoP.teaId = this.currentID;
              this.baseInfoP.teaStatue = this.teaStatue;
              promise = updateBasicInfo(this.baseInfoP);
            }
            break;
          case 'backGround':
            if (!!this.eduBackData && !objectEqual(this.eduBackDataP, this.eduBackData)) {
              let options = deepCopy(this.eduBackDataP);
              options.teaId = this.currentID;
              options.goodFirstSubject = this.getTextByValueForGoodFirst(options.teacherAttr.goodFirstSubjectCode);//获取第一擅长科目中文
              options.goodSecondSubject = this.getTextByValueForGoodFirst(options.teacherAttr.goodSecondSubjectCode);//获取第二擅长科目中文

              options.teaTaughtStuGrade = this.getTeaTaughtStuGradeText(options.teacherAttr.teaTaughtStuGradeCode);//获取年级偏好中文

              options.teacherAttr.enableAppointSubjectCode = options.teacherAttr.enableAppointSubjectCode.toString();
              options.teacherAttr.taughtStuLevelCode = options.teacherAttr.taughtStuLevelCode.toString();
              options.teacherAttr.teaTaughtStuGradeCode = options.teacherAttr.teaTaughtStuGradeCode.toString();

              options.teaTaughtStuGrade = options.teaTaughtStuGrade.toString();
              options.teaTaughtStuLevel = options.teaTaughtStuLevel.toString();

              this.TeaRegionOption.forEach(item=>{
                if(options.teaRegion==item.label){
                  options.teacherAttr.teaRegionCode=item.value
                }
              })
              if(options.teacherAttr.courseTypes.length) {
                options.teacherAttr.courseTypes = options.teacherAttr.courseTypes.toString(); // 授课类型
              } else {
                options.teacherAttr.courseTypes = '';
              }
              if(this.personalAdvantage.length) {
                options.teacherAttr.personalAdvantage = this.personalAdvantage.toString();
                let personalAdvantageStr = '';
                this.specialAdantageOption.forEach(r=>{
                  if(options.teacherAttr.personalAdvantage.includes(r.value)) {
                    personalAdvantageStr += r.label+',';
                  }
                })
                if(personalAdvantageStr) {
                  options.teacherAttr.personalAdvantageStr = personalAdvantageStr.substring(0,personalAdvantageStr.length-1);
                }
              } else {
                options.teacherAttr.personalAdvantage = '';
                options.teacherAttr.personalAdvantageStr = '';
              }
              options.teacherAttr.teaType = this.teacherType;
              promise = updateTeaEduBackInfo(options);
            }
            break;
          case 'introduce':
            this.$emit('cancel');
            // this.audit();
            break;
          case 'salaryAnPay':
            if (!!this.salaryAnPaylData && !objectEqual(this.salaryAnPaylDataP, this.salaryAnPaylData)) {
              this.salaryAnPaylDataP.teaId = this.currentID;
              this.allLevelAndSalaryList.forEach(i=>{
                if(this.salaryAnPaylDataP.level==i.label){
                  this.salaryAnPaylDataP.level=i.value
                }
              });
              promise = updateSalaryAnPay(this.salaryAnPaylDataP);
            }
            break;
          case 'entryInfo':
            this.$emit('entry-audit', this.currentID, this.name);
            break;
          default:
        }
        if (!!promise) {
          promise
            .then(data => {
              this.$Message({
                message: '编辑成功',
              });
              this.$emit('confirm');
            })
            .catch(message => {
              this.$Message({
                message: message,
              });
            });
        } else {
          if (this.selectMode != 'introduce' && this.selectMode != 'entryInfo') {
            this.$Message({
              message: '您未进行任何修改',
            });
          }
        }
      },
      audit() {
        this.$emit('audit', this.currentID, this.teaPersonalInfoData.checkState);
      },
      delGraduateInfos(index) {
        this.eduBackDataP.graduateInfos.splice(index, 1);
      },
      authentication() {
        let parm = {
          teaId: this.currentID,
          idCard: this.baseInfoP.chinaId,//证件号码
          realName: this.baseInfoP.teaName,//姓名
          certificateType: this.baseInfoP.certificateType,//证件类型
        };
        teacherInfoSetTeacherRealName(parm)
          .then(data => {
            this.baseInfoP.chinaIdState = '1';
            this.baseInfoP.teaGender = data.gender;
            this.$Message({
              message: '实名认证成功',
            });
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      addEduExperience() {
        this.eduBackDataP.graduateInfos.push({
          education: '',
          graduatedYear: '',
          graduatedSchool: '',
          subMajor: '',
          fromYear: '',
          educationForm: '1',
          certificate: '1',
          specialEdu: '0',
        });
      },
      getStateText(state) {
        let value = '';
        switch (state) {
          case 0:
            value = '未提交';
            break;
          case 1:
            value = '待审核';
            break;
          case 2:
            value = '审核通过';
            break;
          case 3:
            value = '审核未通过';
            break;
          default:

        }
        return value;
      },
      uploadSuccess() {
        this.$Message({
          message: '上传成功',
          type: 'success',
        });
      },
      // 七牛云token;
      _getQiniuToken() {
        this.$Fetch({
          url: '/api/agent/upToken',
          method: 'get',
        })
          .then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
              this.token = data;
            } else if (code == 1) {
              this.$Message({
                message: message,
              });
            } else {
              this.$Message({
                message: '调用后端数据失败' + message,
                type: 'error',
              });
            }
          })
          .catch(message => {

          });
      },
      initHignSchollSub() {
        getSubject({})
          .then(data => {
            this.hignSchollSub = data.children;
          })
          .catch(message => {
            this.hignSchollSub = [];
          });
      },
      initSubject() {
        this.basesubject = [];
        let phase = this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode.toString();
        let bu = this.eduBackDataP.teaBu;
        if (!bu || !phase) {
          return;
        }
        let parm = {
          bu: bu,
          phase: phase,
        };
        getSubject(parm)
          .then(data => {
            this.basesubject = data.children;
          })
          .catch(message => {
            this.basesubject = [];
          });
      },
      initSubjectNew() {
        this.basesubject = [];
        let phase = this.eduBackDataP.teacherAttr.teaTaughtStuGradeCode.toString();
        let bu = this.eduBackDataP.teaBu;
        if (!bu || !phase) {
          return;
        }
        let parm = {
          bu: bu,
          phase: phase,
        };
        getSubjectNew(parm)
          .then(data => {
            this.basesubject = data.children;
          })
          .catch(message => {
            this.basesubject = [];
          });
      },
      preview(path) {
        this.$root.$children[0].showBigImg(path);

      },
      openCancelAuth() {
        this.cancelAuthDialog = true;
      },
      cancelCancelAuth() {
        this.cancelAuthDialog = false;
      },
      confirmCancelAuth(options) {
        this.$MessageBox.confirm(`确定要取消实名认证吗？`, '提示', {
          confirmButtonText: '确定了',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.cancelAuthDialog = false;

            //取消实名认证
            let parm = {
              teaId: this.currentID,
              remark: options.remark,
            };
            cancelTeacherRealName(parm)
              .then(data => {
                this.$Message({
                  message: '操作成功',
                });
                this.baseInfoP.chinaIdState = '0';
              })
              .catch(message => {
                this.$Message({
                  message,
                });
              });

          })
          .catch(message => {

          });
      },
      sureTeaPersonalInfoClick() {
        const {honors, selfEvaluate} = this.editTeaPersonalInfoData;
        this.$Fetch({
          url: '/api/teacherInfo/updatePersonalInfo',
          method: 'post',
          data: {
            teacherId: this.currentID,
            honors,
            selfEvaluate,
          },
        })
          .then((result) => {
            const {code, message} = result;
            if (code == '0') {
              this.$Message.success(message || '修改成功');
              this.editTeaPersonalInfoShow = false;
              this.editBtnShow = true;
            } else {
              this.$Message.error(message || '接口报错');
            }
            ;
          })
          .catch(error => {
            this.$Message.error(error || '接口报错');
          });
      },
      editTeaPersonalInfoClick() {//修改：奖项荣誉、自我评价
        this.editTeaPersonalInfoShow = true;
        this.editBtnShow = false;
      },
      teacherMienShow(img) {
        this.teacherMienImg = img;
        this.dialogTeacherMien = true;
      },
      closeDetailDialog() {
      },

      // 视频查看
      viewVedio() {
        this.viewVedioDialog = true;
      },

      // 删除视频
      deleteVedio() {
        /** 待调用接口 */
        this.$MessageBox.confirm('注：删除视频后，该视频在客户端将无法查看', '确定删除该老师视频？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$Fetch({
              url: '/api/teacherInfo/delTeaVideo',
              method: 'delete',
              data: {
                teaId: this.currentID,
                type: '10',
              },
            })
              .then(res => {
                if (res.code == '0') {
                  this.teaPersonalInfoData.teaVideoUrl = '';
                  this.$Message.success('删除成功');
                }
              })
              .catch(_ => {
              });
          })
          .catch(_ => {
          });
      },
      // 从后端获取教师资格状态列表
      getTeaCerList() {
        getTeaCertificateList({
          groupCode:'TEACHER_CERTIFICATE',
          bu:1
        }).then(res => {
          if(res&&res.length>0){
            let arr= res.map(item=>{
              return {
                label: item.itemName,
                value: item.itemCode,
                groupCode:item.groupCode
              }
            });
            this.teaCerOptions = [...[{
              label: '全部',
              value: ''
            }],...arr];
          }
        })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      // 关闭预览
      handleClose() {
        this.viewVedioDialog = false;
      },
      // 获取定薪相关字段
      async getSaleryInfo() {
        this.salaryAnPaylDataP.teaType = '';
        await this.getTeaType();
        let hashUrl = window.location.href;
        let lastUrlStr = hashUrl.substr(hashUrl.length - 11, hashUrl.length);
        // 涉及到的模块：全职招师中的，待分配管理，面试管理，培训管理，入职管理:需要增加的显示字段
        // 调整的对象：所属BU=1对1；老师性质=全职
        if ((lastUrlStr === '/full_times' ||
          hashUrl.indexOf('full_times/pre_training') > -1 ||
          hashUrl.indexOf('full_times/bef_int') > -1 ||
          hashUrl.indexOf('full_times/wait_entry') > -1)
          && (this.bu == 1)
          && (this.baseInfo.timeTypeStr && this.baseInfo.timeTypeStr === '全职')
        ) {
          this.showSaleryFlg = true;
        } else {
          this.showSaleryFlg = false;
        }
        getSalaryRelatedField({
          teaId: this.currentID,
        })
          .then(res => {
            Object.assign(this.saleryInfo, res);
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
        let res = await salaryAnPay({teaId: this.currentID});
        this.salaryAnPaylDataP.teaType = res.teaType ? res.teaType.toString() : '0'
        if (res) this.periodState = res.periodState;
        // 获取老师类型
      },
      // 获取所在分区
      async getTeaRegionOption(bu) {
        if(!bu) return
        let teacherBu = '';
        if (bu && (bu == 1 || bu == 2 || bu == 5) && this.selectMode === 'backGround') {
          this.eduBackDataP.teaRegion = '其他';
          this.eduBackDataP.teacherAttr.teaRegionCode = '';
          teacherBu = bu;
        }
        if ((this.bu == 1 || this.bu == 2 || this.bu == 5) && this.selectMode !== 'backGround') {
          teacherBu = this.bu;
        }
        let data = [
          {
            'dictCode': 'ZM_BU',
            'optionValue': teacherBu,
            'bizCategory': 'common',
          },
          {
            'dictCode': 'TEACHER_ORIGIN',
            'optionValue': this.baseInfoP.timeType,
            'bizCategory': 'common',
          },
          {
            'dictCode': 'TEACHER_AREA',
            'strategy': 1,
          },
        ];
        this.$Fetch({
          url: `/api/cascade/dict/service`,
          method: 'post',
          data,
        })
          .then(res => {
            if (res.code === '0') {

              this.TeaRegionOption = res.data.children;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },

      tabClick(val) {
        this.basicMobileSeen = false; // 清空手机号显示
        this.emergencyMobileSeen = false; // 清空手机号显示
        this.referMobileSeen = false; // 清空手机号显示
        if (val.name === 'entryInfo') {
          this.$refs.entryInfo.curMobileSeen = false;
          this.$refs.entryInfo.emergMobileSeen = false;
        }
        if(this.selectMode==='backGround') {
          // commonCascade([{"dictCode":"TEACHER_COURSE_TYPE"}]).then(data => {
          //   this.classTypeData = data.children
          // })
          if(this.eduBackDataP.teacherAttr.courseTypes){
            this.eduBackDataP.teacherAttr.courseTypes = this.eduBackDataP.teacherAttr.courseTypes.toString().split(',');
          } else {
            this.eduBackDataP.teacherAttr.courseTypes = []
          }
          if(this.eduBackDataP.teacherAttr && this.eduBackDataP.teacherAttr.personalAdvantage) this.personalAdvantage = this.eduBackDataP.teacherAttr.personalAdvantage.toString().split(',');
          if(this.eduBackDataP.teacherAttr) this.teacherType = this.eduBackDataP.teacherAttr.teaType ? String(this.eduBackDataP.teacherAttr.teaType) : '0';
        }
        if(this.selectMode==='salaryAnPay'){
            this.allLevelAndSalaryList.forEach((item,index)=>{
              if(item.value==this.salaryAnPaylDataP.level){
                this.salaryAnPaylDataP.level=item.label;
              }
              if(item.label==this.salaryAnPaylDataP.level){
                this.salaryAnPaylDataP.level=item.label;
              }
            })
            if(this.salaryAnPaylDataP.level=='实习等级'){
              this.salaryAnPaylDataP.monthSalary='实习工资'
            }if(this.salaryAnPaylDataP.level=='无等级'){
              this.salaryAnPaylDataP.level='';
              this.salaryAnPaylDataP.monthSalary=''
            }if(this.salaryAnPaylDataP.level==-1){
              this.salaryAnPaylDataP.level='';
              this.salaryAnPaylDataP.monthSalary=''
            }
          // this.handleTeaLevel(this.salaryAnPaylDataP.level);
        };

      },
      async getTeaType() {
        this.teaTypeOption = [];
        if(this.bu) {
          let res = await getTeacherTypes(this.bu);
          if(res) this.teaTypeOption = res
        }
      },
      //个人优势，学习形式，是否特殊学制，毕业证/学位证，求职状态，职业规划，婚姻状况

      getSPECIAL_ADVANTAGE() {
        let p1=commonCascade([{"dictCode":"SPECIAL_ADVANTAGE_T"}])
        let p2=commonCascade([{"dictCode":"IS_FULL_TIME"}]);
        let p3=commonCascade([{"dictCode":"SPECIAL_SYSTEM"}])
        let p4=commonCascade([{"dictCode":"DIPLOMA"}])
        let p5=commonCascade([{"dictCode":"JOB_STATE"}])
        let p6=commonCascade([{"dictCode":"CAREER_PLAN"}])
        let p7=commonCascade([{"dictCode":"TEA_MARITAL"}])
        let p8=commonCascade([{"dictCode":"CURRENT_JOB"}])

        Promise.all([p1,p2,p3,p4,p5,p6,p7, p8]).then(res=>{
          this.specialAdantageOption=res[0].children;
          this.isFullTimeOptions=res[1].children;
          this.spcialSystemOptions=res[2].children;
          this.diplomaOptions=res[3].children;
          this.jobStateOptions=res[4].children;
          this.careerPlanOPtions=res[5].children;
          this.teaMaritalOptions=res[6].children;
          this.currentJobOptions = res[7].children;
        })
      },
      listRelease() {
        this.hoverString = [];
        if(!this.currentID) return
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/api/teaChannelRelease/listRelease',
          method: 'post',
          data: {teaId: this.currentID},
        })
        .then((res) => {
          const {code, data} = res;
          if(code==200 && data.length) {
            this.hoverString.push('推荐人记录（页面显示第一次推荐人）');
            data.forEach(r => {
              this.hoverString.push(
                `${r.triggerTime.substring(0,10)} ${r.channelName}，${r.channelMobile}`
              )
            });
          }
        })
      },
      //全量薪资等级
      allLevelAndSalary(){
        this.$Fetch({
          url: `/api/cascade/dict/service`,
          method: 'post',
          data:[{"dictCode":"TEACHER_LEVEL_PL"}],
        })
          .then(res => {
              this.allLevelAndSalaryList =res.data.children;
              // 整理出讲师等级内容
              // this.allLevelAndSalaryList.forEach()

            }
          )
      },
      handleProvinceCityCountyChange(val) {
        this.baseInfoP.teaProv = val[0] || '';
        this.baseInfoP.teaCity = val[1] || '';
        this.baseInfoP.teaArea = val[2] || '';
      },
    },
    mounted() {
      // 获取全国省市区三维数组
      getProvinceCityCounty().then(({data}) => {
        if (data.code === '0') {
          this.provinceCityCountyOptions = data.data || [];
        }
      });
      this.allLevelAndSalary();
      // 根据页面类型，判断哪些页面的工作性质需禁止修改
      // 试用期管理、转正管理、离职管理中，工作性质禁止修改
      if(this.salaryAnPaylDataP.level=='实习等级'){
        this.salaryAnPaylDataP.monthSalary='实习工资'
      }if(this.salaryAnPaylDataP.level=='无等级'){
        this.salaryAnPaylDataP.level='';
        this.salaryAnPaylDataP.monthSalary=''
      }if(this.salaryAnPaylDataP.level==-1){
        this.salaryAnPaylDataP.level='';
        this.salaryAnPaylDataP.monthSalary=''
      }
      let herfPath = window.location.href; // 当前页面href
      if (herfPath.indexOf('/pre_ent') > -1 || herfPath.indexOf('/ent_list') > -1 ||
        herfPath.indexOf('/leave_list') > -1) {
        this.workTypeDisable = true;
      } else {
        this.workTypeDisable = false;
      }
      // 入职管理 、试用期管理、转正管理、离职管理中，工作性质禁止修改
      if (herfPath.indexOf('/wait_entry') > -1 || herfPath.indexOf('/ent_list') > -1 ||
        herfPath.indexOf('/leave_list') > -1 || herfPath.indexOf('/pre_ent') > -1){
        this.teaTypeDisable=true;
      }
      // 个人介绍审核页，老师资料卡-个人介绍，需要显示 取消和审核，其他页面隐藏
      if (herfPath.indexOf('/data_audit/personalIntroductionAudit') > -1) {
        this.curPage = 'personalIntroductionAudit';
      } else {
        this.curPage = 'otherPage';
      }
      this.proData = this.prodata;
      this.proData_edu = this.prodata;
      // this.initTrainLevelData();
      this._getQiniuToken();
      this.getProData();
      this.getProData_edu();
      this.initHignSchollSub();
      // 获取教师资格状态列表
      this.getTeaCerList();
    },
    components: {
      imgBox,
      damiPwdInput,
      entryInfo,
    },
  };
</script>
<style scoped lang='less' media="screen">
  .content {
    padding: 20px 0 20px 20px;
    margin: -20px;
    padding-top: 0px;
    background-color: white;
  }

  .control {
    text-align: right;
    padding-top: 20px;
    margin-top: 20px;
    background-color: #f4f5f5;
  }

  .search-form {
    border-bottom-width: 0px;
  }

  .headAvatarImg-container {
    width: 100%;
    text-align: center;
  }

  .action-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
  }

  .action-container > .el-btn {
    margin-right: 10px;
  }

  .action-container > .btn {
    width: 70px !important;
  }

  .logo {
    max-width: 80%;
    max-height: 100%;
    margin-bottom: 10px;
  }

  .introduction .el-row {
    padding: 5px 0;
  }

  .introduction .el-row:after {
    display: table;
    content: '';
    clear: both;
  }

  .introduction .search-form {
    padding-top: 0px;
  }

  .gradeRecord {
    width: 100px;
  }

  .previewBtn {
    display: block;
    margin-top: 20px;
    cursor: pointer;
  }

  .mes-content {
    padding-left: 70px;
  }

  .ceeSubject {
    padding-left: 90px;
  }

  .tea-name {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
    position: relative;
  }

  .tea-name .name {
    font-size: 20px;
    display: block;
    color: #333;
  }

  .wait-audit {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(22, 155, 213, 1);
    color: white;
    padding: 5px 20px;
    font-size: 14px;
    border-width: 0px;
  }

  .audit-state {
    padding: 10px 0;
  }

  .audit-text:after {
    content: '';
    display: block;
    clear: both;
  }

  .audit-title {
    width: 100px;
    min-height: 40px;
    line-height: 40px;
    background-color: rgba(22, 155, 213, 1);
    color: white;
    font-size: 14px;
    text-align: center;
    float: left;
  }

  .audit-description {
    min-height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 120px;
  }

  .editTitle {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  .fengcaimgbox {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    background-color: #000;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    display: inline-block;
  }

  .teacher-mien-img {
    margin: 0 auto;
    width: 80%;
    height: 400px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .cascader-provinceCityCounty {
    width: 100px;
  }

</style>
<style lang="less">
.basic_message {
  .el-form-item.require:before {
      content: "*";
      color: red;
      display: block;
      float: left;
      margin-top: 10px;
      margin-right: 1px;
  }
  .fixedVedio {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3000;

    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    .sameParent {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 3002;
      margin-left: -539px;
      margin-top: -310px;

      width: 1098px;
      height: 658px;
      padding: 0 15px 0;
      background-color: #fff;

      .title {
        height: 40px;
        text-align: right;
        font-size: 14px;

        i {
          line-height: 40px;

          &:hover {
            color: #409EFF;
          }
        }
      }

      .contentParentsVideo {
        text-align: center;
        height: 600px;
        position: relative;

        video {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          margin: auto;
          max-width: 100%;
          max-height: 100%;
        }
        video::-internal-media-controls-download-button {
          display:none;
        }
        video::-webkit-media-controls-enclosure {
          overflow:hidden;
        }
        video::-webkit-media-controls-panel {
          width: calc(100% + 30px);
        }
      }
    }
  }
  .basic-info{
    .cascader-teaAddress {
      width: calc(100% - 100px);
    }
  }
  .vedioFontColor,
  .vedioFontColorPointer {
    color: #409EFF;
    font-size: 12px;
  }

  .vedioFontColorPointer {
    transform: scale(.7);

    &:hover {
      cursor: default;
      color: red;
    }
  }

  .vedioFontColor:hover {
    cursor: pointer;
  }

  #previewChildPageDialog {
    .el-dialog {
      top: 0 !important;
      width: 100% !important;
      position: fixed !important;
    }
  }
  .lcy_box .el-icon-check {
      color: #20A0FF;
      display: none;
      cursor: pointer;
    }

    .lcy_box .el-input {
      border: 1px solid #ededed;
    }

    .lcy_box:hover .el-icon-check {
      display: inline-block;
    }

    .personalInfoPoint .el-tabs__nav div:nth-child(4) {
      position: relative;
    }

    .personalInfoPoint .el-tabs__nav div:nth-child(4):after {
      position: absolute;
      top: 5px;
      right: 5px;
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: red;
    }

    .awardPanel {
      padding-left: 70px;
    }

    .awardPanel .award {
      padding-top: 10px;
    }

    .awardImg {
      width: 80px;
      height: 80px;
      display: inline-block;
      background-color: #c2c2c2;
      position: relative;
      vertical-align: middle;
      margin-right: 10px;
      cursor: pointer;
    }

    .awardImg img {
      max-height: 100%;
      max-width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .edu-scholld-item {
      padding: 10px;
      background-color: #ddd;
      position: relative;
      margin-bottom: 5px;
    }

    .edu-scholld-item .del {
      position: absolute;
      cursor: pointer;
      top: 10px;
      right: 10px;
      font-size: 12px;
    }

    .edu-experience-add {
      padding: 10px;
      color: #169BD5;
      cursor: pointer;
    }

    .masklayer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
    }

    .model-cover {
      display: none;
    }

    .model-cover.show-dialog {
      display: block;
    }

    .model-cover > .cancel-model {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #808080;
      opacity: .6;
      z-index: 2018;
    }

    .model-cover > .pop-box {
      width: 400px;
      position: fixed;
      top: 150px;
      left: 400px;
      z-index: 2019;
      background-color: #fff;
    }

    .pop-box > .box-header {
      width: 100%;
      border-bottom: 1px solid #797671;
    }

    .box-header > span {
      width: 45%;
      display: inline-block;
      color: #333436;
      font-size: 14px;
      margin-left: 15px;
    }

    .box-header > span:nth-child(2) {
      text-align: right;
      font-size: 30px;
    }

    .box-header > span:nth-child(2):hover {
      cursor: pointer;
    }

    .pop-box > .box-body {
      margin-top: 30px;
    }

    .box-body .el-form-item {
      margin-bottom: 22px;
    }

    .rder_dialog_bodys_white .basic-info .el-form-item__content {
      width: 200px;
    }

    .order_dialog_body .el-form-item__content .el-select.teacherCertificate .el-input {
      width: 220px !important;
    }

    .chinaid-content {
      position: relative;
      top: 12px;
      left: 15px;
      display: inline-block;
      width: 185px;
    }

    .show-chinaid {
      cursor: pointer;
      color: #169bd5;
      position: relative;
      margin-left: 16px;
      top: 12px;
    }

    .unchecked-hide {
      opacity: 0;
    }

    .high-light {
      color: red;
      font-weight: bold;
    }

    .font-highlight {
      font-weight: bold;
      margin-right: 5px !important;
    }

    .font-highlight > .el-form-item__content {
      min-width: 60px !important;
    }

    .font-highlight > .el-form-item__label {
      min-width: 38px !important;
    }
  .mobile-cursor{
    cursor: pointer;
    color: #169bd5;
    width: calc(200px - 16px);
    display: inline-block;
    padding-left: 10px;
  }
  .hover-src {
    height: 14px;
    cursor: pointer;
    position: relative;
    left: 4px;
    top: 2px;
  }
}
</style>
