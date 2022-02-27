<template>
	<div class="context config-person" v-if="checkPermission('tea:recruit:member-config')">
		<Spin size="large" fix v-if="tableLoading"></Spin>
		<div class="context-body">
      <div class="search-warpper">
        <el-form :inline="true" :model="search_data">
				<el-form-item label="关键词查询">
					<el-input v-model="search_data.nameOrMobile" placeholder="支持姓名/手机号查询"></el-input>
				</el-form-item>
				<el-form-item label="专员角色">
					<el-select v-model="search_data.roleName" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option label="管理员" value="管理员"></el-option>
						<el-option label="招师主管" value="招师主管"></el-option>
						<el-option label="招师专员" value="招师专员"></el-option>
						<el-option label="面试官" value="面试官"></el-option>
						<el-option label="培训师" value="培训师"></el-option>
						<el-option label="培训师hr" value="培训师hr"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属BU">
					<el-select v-model="search_data.bu" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="(item, index) in buList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="招师性质">
					<el-select v-model="search_data.entryType" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option label="兼职" :value="0"></el-option>
						<el-option label="全职" :value="1"></el-option>
						<el-option label="校招全职" :value="2"></el-option>
						<el-option label="公校兼职" :value="3"></el-option>
					</el-select>
				</el-form-item>
        <!-- <el-form-item label="OA所在部门" v-if="this.search_data.positionFlag !== 0">
					<el-select v-model="search_data.orgCode" placeholder="请选择">
						<el-option v-for="(item, index) in orgList" :key="index" :label="item.orgName" :value="item.orgCode"></el-option>
					</el-select>
				</el-form-item> -->
        <el-form-item>
          <el-button class="search-btn" size="small" type="primary"  @click="search">搜索</el-button>
        </el-form-item>
				<!--<el-button class="search-btn" type="info" size="small" @click="search">查询</el-button>-->
			</el-form>
      </div>
      <div class="btn-warpper">
        <el-button @click="create" size="small" type="normal" class="create-btn">新增专员</el-button>
				<el-button @click="setNameConfig" :loading="nameConfig.loading" size="small" type="normal" class="create-btn">
					名单分配</el-button>
      </div>
      <div class="table-warpper">
        <el-table :data="table_data" border style="width:100%" class="data-table">
          <el-table-column prop="commissionerName" label="专员姓名" width="120" align="center">
          </el-table-column>
          <el-table-column prop="commissionerMobile" label="手机号" align="center" width="210">
            <template scope="scope">
              <span :key="scope.row.id" @click="getTeaSecret($event,scope.row.id,'mobile')" class="detailsBtn">点击获取手机号</span>
            </template>
          </el-table-column>
          <el-table-column prop="wChat" label="微信号" align="center" width="125">
            <template scope="scope">
              <span class="context-body-save-w-chat">
                <span class="save" v-if="scope.row.id===chooseId">
                  <el-input @keyup.enter.native="wChatSave(scope.row)" v-if="scope.row.id===chooseId" v-model="wChat"
                            placeholder="输入微信号"></el-input>
                  <img @click="wChatSave(scope.row)"
                      src="https://web-data.zmlearn.com/image/r3oFqs7w5LDFF81LsZVuk2/save.png">
                </span>
                <span v-if="scope.row.wChat && scope.row.id!==chooseId" class="span">
                  {{scope.row.wChat}}
                  <img@click="wChatStatus(scope.row)"
                                                      src="https://web-data.zmlearn.com/image/5MFssbkAVd1mdi7SHbVZ7a/edit.png">
                </span>
                <span class="edit" @click="wChatStatus(scope.row)" v-if="!scope.row.wChat && scope.row.id!==chooseId">
                  <img src="https://web-data.zmlearn.com/image/5MFssbkAVd1mdi7SHbVZ7a/edit.png">
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="专员角色" width="120" align="center">
          </el-table-column>
          <el-table-column prop="orgName" label="OA所在部门" width="120" align="center">
          </el-table-column>
          <el-table-column prop="" label="工号" width="120" align="center">
            <template slot-scope="{row}">
              {{ row.personCode || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="orgUserName" label="部门负责人" width="120" align="center">
          </el-table-column>
          <el-table-column prop="chargeOfTeachertype" label="招师性质" align="center">
            <template scope="scope">
              {{chargeOfTeachertypeFilter(scope.row.chargeOfTeachertype)}}
            </template>
          </el-table-column>
          <el-table-column label="负责人数" align="center" width="90">
            <template scope="scope">
              <span @click="showNameDetail(scope.row.id)"
                    style="display:inline-block;line-height:26px;min-width:40px;color:#007fff;cursor:pointer;">{{ scope.row.chargeOfNumber }}</span>
              <!--<br />-->
            </template>
          </el-table-column>
          <el-table-column prop="grades" label="负责年级" align="center" width="120">
          </el-table-column>
          <el-table-column prop="schools" label="负责学校" align="center" width="120">
            <template scope="scope">
              <el-button type="text" size="small" v-if="scope.row.chargeOfTeachertype.includes('0')&&search_data.bu!=3"
                        @click="openSetSchool(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="schools" label="负责科目" align="center" width="120">
            <template scope="scope">
              <el-button type="text" size="small" v-if="scope.row.chargeOfTeachertype.includes('0')&&search_data.bu!=3"
                        @click="openSetCourse(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template scope="scope">
              <!-- <el-button type="text" size="small" @click="showNameConfig(scope.row.id,scope.row.commissionerName,scope.row.recruitType)">名单配置</el-button> -->
              <el-button type="text" size="small" @click="emailConfig(scope.row)"  v-if="checkPermission('tea:recruit:email-config')">
                邮箱配置 </el-button>
              <el-button type="text" size="small"
                        @click="showChange(scope.row.id,scope.row.commissionerName,scope.row.buConfigs,scope.row.roleName,scope.row.wChat)">
                修改工作性质</el-button>
              <el-button type="text" size="small" @click="showLeave(scope.row.id,scope.row.commissionerName)">离职
              </el-button>
              <el-button type="text" size="small" @click="showTransfer(scope.row.id)">移交</el-button>
            </template>
          </el-table-column>
			  </el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
										 :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize"
										 layout="sizes, prev, pager, next" v-bind:total="table_data_total">
			</el-pagination>
      </div>

		</div>
		<!--查看详细名单弹窗 -->
		<el-dialog title="详细名单" v-model="showNameDetailDialog" size="small" @close="closeNameDetailDialog">
			<Spin size="large" fix v-if="nameDetailLoading"></Spin>
			共
			<strong>{{ nameDetailTotal }}</strong>位老师
			<el-table :data="nameDetailData" max-height="350" style="width: 100%">
				<el-table-column prop="teaName" label="姓名">
				</el-table-column>

				<el-table-column prop="workType" label="招师性质">
				</el-table-column>

				<el-table-column prop="teaMobile" label="手机号">
					<template scope="scope">
						<span @click="getOwnerDetailMobile($event,scope.row.teaId,'mobile')" class="ownerDetailsBtn">点击获取手机号</span>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<!--名单配置弹窗dialog-->
		<el-dialog title="名单配置" class="name-config" v-model="showNameConfigDialog" size="small"
							 @close="closeSetNameConfigDialog">
			<el-form ref="read_form_ref" :model="nameConfigData">
				<el-form-item label="名单分配规则" v-if="nameConfigType != '兼职'">
					<el-radio-group v-model="nameConfigData.teacherRecruitRule">
						<el-radio :label="1">平均分</el-radio>
						<el-radio :label="2">按比例</el-radio>
						<el-input class="nameConfigInput" v-model="nameConfigData.chargeOfPercent"
											v-if="nameConfigData.teacherRecruitRule == 2" placeholder="请输入比例"></el-input>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="nameConfigData.teacherRecruitRule == 1 && nameConfigType != '兼职'">
					<div class="title">选择平均分名单</div>
					<el-checkbox-group class="choose" v-model="nameConfigDataNamesChosed">
						<el-checkbox v-for="(item,index) in nameConfigDataNames" :label="item.id" :key="index" style="width:45%;">
							{{ item.userName}}{{ item.userMobile }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="配置负责学校" v-if="nameConfigType == '兼职'">
					<!--{{nameConfigDataSchool}}-->

					<el-select class="configSchool" v-model="nameConfigDataSchool" multiple placeholder="请选择学校">
						<el-option v-for="(item,index) in school_list" :key="index" :label="item.itemName" :value="item.itemCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="calculateNamesAmount" :loading="calculateNamesAmountLoading">计算名单数</el-button>
				<div class="calculateNamesAmount" v-show="showNamesAmount">
					<b>{{nameConfigData.teacherName}}</b>老师共负责
					<b>{{stuCount}}</b>名招生名额
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showNameConfigDialog = false">取 消</el-button>
				<el-button type="primary" @click="updateNameConfig" :loading="updateNameConfigLoad">确 定</el-button>
			</div>
		</el-dialog>
		<!--修改工作性质dialog-->
		<el-dialog title="修改工作性质" v-model="showChangeDialog" size="small" class="showAdit" @close="closeChangeDialog">

			<el-form ref="edit_form_ref" :model="showChangeDialogData" label-width="100px">
				<el-form-item label="选择专员姓名">
					<span style="margin-left: 10px">{{showChangeDialogData.name}}</span>
				</el-form-item>
				<el-form-item label="微信号">
					<el-input class="addPerson" placeholder="输入微信号" v-model="showChangeDialogData.wChat">
					</el-input>
				</el-form-item>
				<el-form-item label="专员角色">
					<el-select v-model="showChangeDialogData.roleName" placeholder="请选择">
						<el-option label="请选择" value=""></el-option>
						<el-option label="管理员" value="管理员"></el-option>
						<el-option label="招师主管" value="招师主管"></el-option>
						<el-option label="招师专员" value="招师专员"></el-option>
						<el-option label="面试官" value="面试官"></el-option>
						<el-option label="培训师" value="培训师"></el-option>
						<el-option label="培训师hr" value="培训师hr"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属BU">
					<span class="bu-btn-group" @click="addPersonSelectBu('1')"
								:class="{'select':this.currentAddBu == '1'}">1对1</span>
					<span class="bu-btn-group" @click="addPersonSelectBu('2')"
								:class="{'select':this.currentAddBu == '2'}">少儿</span>
          <span class="bu-btn-group" @click="addPersonSelectBu('5')"
          :class="{'select':this.currentAddBu == '5'}">优课</span>
					<span class="bu-btn-group" @click="addPersonSelectBu('3')"
								:class="{'select':this.currentAddBu == '3'}">陪练</span>
				</el-form-item>
				<el-form-item label="专员性质">
					<el-select v-show="currentAddBu == '1'" multiple v-model="cbuOneRecruitType" placeholder="请选择">
						<el-option label="兼职" value="0"></el-option>
						<el-option label="全职" value="1"></el-option>
						<el-option label="校招全职" value="2"></el-option>
						<el-option label="公校兼职" value="3"></el-option>
					</el-select>
					<el-select v-show="currentAddBu == '2'" multiple v-model="cbuTwoRecruitType" placeholder="请选择">
						<el-option label="兼职" value="0"></el-option>
						<el-option label="全职" value="1"></el-option>
						<el-option label="校招全职" value="2"></el-option>
						<el-option label="公校兼职" value="3"></el-option>
					</el-select>
					<el-select v-show="currentAddBu == '3'" multiple v-model="cbuThreeRecruitType" placeholder="请选择">
						<el-option label="兼职" value="0"></el-option>
						<el-option label="全职" value="1"></el-option>
						<el-option label="校招全职" value="2"></el-option>
						<el-option label="公校兼职" value="3"></el-option>
					</el-select>
          <el-select v-show="currentAddBu == '5'" multiple v-model="cbuFiveRecruitType" placeholder="请选择">
						<el-option label="兼职" value="0"></el-option>
						<el-option label="全职" value="1"></el-option>
						<el-option label="校招全职" value="2"></el-option>
						<el-option label="公校兼职" value="3"></el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showChangeDialog = false">取 消</el-button>
				<el-button type="primary" @click="changeClick">确 定</el-button>
			</div>
		</el-dialog>
		<!--离职dialog-->
		<el-dialog title="离职" v-model="showLeaveDialog" @close="closeLeaveDialog">
			<Spin size="large" fix v-if="leaveLoading"></Spin>
			<span>确定
				<span class="teacher-name"> {{ leaver.name }} </span>老师要离职吗?离职后将不能登录后台操作任何信息</span>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showLeaveDialog = false">取 消</el-button>
				<el-button type="primary" @click="leave()">确 定</el-button>
			</div>
		</el-dialog>
		<!--移交dialog-->
		<el-dialog title="移交" v-model="showTransferDialog" size="small" class="trans" @close="closeTransferDialog">
			<el-form>
				<el-form-item label="移交原因">
					<el-select v-model="transferReason" placeholder="请选择">
						<el-option v-for="(item,index) in transferReasonOptions" :label="item.label" :key="index"
											 :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<div class="title">移交对象</div>
					<el-checkbox-group class="choose" v-model="transferChosedList">
						<el-checkbox v-for="(item,index) in transferList" :label="item.toCommissionerId" :key="index"
												 style="width:45%;">
							{{ item.comissionerName }}{{ item.mobile }}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showTransferDialog = false">取 消</el-button>
				<el-button type="primary" @click="transferClick">确 定</el-button>
			</div>
		</el-dialog>

		<!--新增专员配置dialog-->
		<el-dialog title="新增专员配置" v-if="showAdd" v-model="showAdd" size="small" class="showAdd"
							 @close="closeAddPersonDialog">
			<el-form ref="add_form_ref" :model="addPerson" label-width="100px">
				<el-form-item label="专员姓名">
					<el-input class="addPerson" placeholder="输入专员姓名或手机号码" icon="search" v-model="addPerson.userName"
										:on-icon-click="searchAddPersonName">
					</el-input>
					<span class="person-title">输完后，点击搜素，点击某一行选择专员</span>
				</el-form-item>
				<el-form-item>
					<Spin fix v-if="personNameLoading"></Spin>
					<el-table height="250" v-if="searchAddPersonNameTable" ref="singleTable" :data="searchAddPersonNameData"
										highlight-current-row @current-change="choose" style="width: 100%">
						<el-table-column property="userName" label="姓名" align="center">
						</el-table-column>
						<el-table-column property="userMobile" label="手机号码" align="center">
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item label="微信号">
					<el-input class="addPerson" placeholder="输入微信号" v-model="addPerson.wChat">
					</el-input>
				</el-form-item>
				<el-form-item label="专员角色">
					<el-select v-model="addPerson.roleName" placeholder="请选择">
						<el-option label="请选择" value=""></el-option>
						<el-option label="管理员" value="管理员"></el-option>
            <el-option label="招师主管" value="招师主管"></el-option>
						<el-option label="招师专员" value="招师专员"></el-option>
						<el-option label="面试官" value="面试官"></el-option>
						<el-option label="培训师" value="培训师"></el-option>
						<el-option label="培训师hr" value="培训师hr"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属BU">
					<span class="bu-btn-group" @click="addPersonSelectBu('1')"
								:class="{'select':this.currentAddBu == '1'}">1对1</span>
					<span class="bu-btn-group" @click="addPersonSelectBu('2')"
								:class="{'select':this.currentAddBu == '2'}">少儿</span>
          <span class="bu-btn-group" @click="addPersonSelectBu('5')"
                :class="{'select':this.currentAddBu == '5'}">优课</span>
					<span class="bu-btn-group" @click="addPersonSelectBu('3')"
								:class="{'select':this.currentAddBu == '3'}">陪练</span>
				</el-form-item>
				<el-form-item label="专员性质">
					<el-select v-show="currentAddBu == '1'" multiple v-model="buOneRecruitType" placeholder="请选择">
						<el-option label="兼职" :value="0"></el-option>
						<el-option label="全职" :value="1"></el-option>
						<el-option label="校招全职" :value="2"></el-option>
						<el-option label="公校兼职" :value="3"></el-option>
					</el-select>
					<el-select v-show="currentAddBu == '2'" multiple v-model="buTwoRecruitType" placeholder="请选择">
						<el-option label="兼职" :value="0"></el-option>
						<el-option label="全职" :value="1"></el-option>
						<el-option label="校招全职" :value="2"></el-option>
						<el-option label="公校兼职" :value="3"></el-option>
					</el-select>
					<el-select v-show="currentAddBu == '3'" multiple v-model="buThreeRecruitType" placeholder="请选择">
						<el-option label="兼职" :value="0"></el-option>
						<el-option label="全职" :value="1"></el-option>
						<el-option label="校招全职" :value="2"></el-option>
						<el-option label="公校兼职" :value="3"></el-option>
					</el-select>
          <el-select v-show="currentAddBu == '5'" multiple v-model="buFiveRecruitType" placeholder="请选择">
						<el-option label="兼职" :value="0"></el-option>
						<el-option label="全职" :value="1"></el-option>
						<el-option label="校招全职" :value="2"></el-option>
						<el-option label="公校兼职" :value="3"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showAdd = false">取 消</el-button>
				<el-button type="primary" @click="addPersonClick">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="名单分配" v-model="nameConfig.nameConfigDialog" size="small" class="showAdd"
							 @close="closeNameConfigDialog">
			<div class="content" style="font-size:14px;">
				<div class="_head">
					待分配名单：<br />
					<el-row>
						<el-col style="text-align:center;" :span="8">掌门1对1:{{nameConfig.count.one}}</el-col>
						<el-col style="text-align:center;" :span="8">掌门少儿:{{nameConfig.count.two}}</el-col>
            <el-col style="text-align:center;" :span="8">掌门优课:{{nameConfig.count.five}}</el-col>
						<el-col style="text-align:center;" :span="8">掌门陪练:{{nameConfig.count.three}}</el-col>
					</el-row>
				</div>
				<div class="search_item">
					<div>
						<span>姓名：</span>
						<el-input class="search_input" placeholder="请输入姓名" v-model="name">
						</el-input>
					</div>
					<div>
						<span>手机号：</span>
						<el-input class="search_input" placeholder="请输入手机号" v-model="mobile">
						</el-input>
					</div>
					<div>
						<el-button type="primary" @click="setNameConfig">查询</el-button>
					</div>
				</div>
				<br />
				<div class="_content" style="width:100%;max-height:300px;min-height:150px;margin-top:20px;overflow-y:auto;">
					<div v-for="(item,index) in nameConfig.data" :key="index" class="_item" style="margin:5px;">
						<input v-model="item.select" type="checkbox" name="" value="">
						{{item.commissionerName}}
						{{item.commissionerMobile}}
						<span class="input-panel">
							<input v-for="(_item,_index) in item.buConfigs" :key="_index" :placeholder="getplaceholdertext(_item.bu)"
										 type="text" name="" v-model="_item.averageUserConfig" class="input">
						</span>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeNameConfigDialog">取 消</el-button>
				<el-button :loading="nameConfigState" type="primary" @click="configsSetting">确 定</el-button>
			</div>
		</el-dialog>
		<set-course-and-school ref="setCourseAndSchoolDialog"></set-course-and-school>
    <el-dialog
      title="配置接收外部招聘网站邮箱"
      v-model="emailConfigVisible"
      width="50%">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
          <el-form-item
            prop="email"
            label="邮箱"
            :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ]" >
            <el-input style="width:60%" :disabled='!edit' v-model="dynamicValidateForm.email" placeholder="输入接收简历的邮箱账号"></el-input>
            <p>请输入掌门后缀的邮箱账号，如：san.zhang@zhangmen.com</p>
          </el-form-item>
          <br>
          <el-form-item
            label="邮箱密码"
            prop="pwd"
            :rules="{
              required: true, message: '密码不能为空', trigger: 'blur'
            }">
             <pwd-input :disabled='!edit' v-model="dynamicValidateForm.pwd"  :show='showPwdInput'></pwd-input>
            <p>密码必须是对应邮箱账号的真实的密码</p>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailConfigVisible = false">关 闭</el-button>
        <el-button type="primary" v-show="edit==false" @click="edit = true;pwdText=''">编 辑</el-button>
         <el-button type="primary" v-show="edit==true" @click="saveEmailInfo">确 定</el-button>
      </span>
    </el-dialog>
	</div>
	<div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import setCourseAndSchool from './components/setCourseAndSchool.vue';
import getSpecialMobile from '../../api/select/getSpecialMobile'; // 查询专员手机号;

import getTeaMobile from '../../api/select/getTeaMobile'; // 查询手机号
import { buList } from '@/enum';
import damiPwdInput from 'dami-pwd-input';
import pwdInput from './components/pwdInput.vue'


export default {
  components: {
    pwdInput,
    setCourseAndSchool,
  },
  data() {
    return {
      showPwdInput:false,
      pwdText:'',
      pwdId:'',
      edit:false,
      dynamicValidateForm: {
          pwd:'',
          email: ''
        },
      requestTeaSecretState: false, //列表：表示是否在请求教师信息
      ownerDetailSecretState: false, //负责人详情：表示是否在请求教师信息
      requestTeaSecretTime: 10, // 列表：统计距离上次查询手机号有多少s
      ownerDetailSecretTime: 10, // 负责人详情：统计距离上次查询手机号有多少s

      nameConfigState: false,
      // 名单分配规则字典
      // 学校字典
      school_list: [],

      // 表单数据
      table_data: [],
      tableLoading: true,
      table_data_total: 0,
      // 表单查询条件
      search_data: {
        bu: '1',
        roleName: '',
        entryType: '',
        nameOrMobile: '',
        pageNo: 1, //number
        pageSize: 10, //number
        // orgCode: '',
        // positionFlag: '',
      },
      page_size: 10,

      // 表单的显示和隐藏
      // tableShow:false,

      // 新增专员弹窗
      showAdd: false,
      buOneRecruitType: [],
      buTwoRecruitType: [],
      buThreeRecruitType: [],
      buFiveRecruitType: [],
      addPerson: {
        roleName: '',
        bu: [],
        userId: '',
        userName: '',
        userMobile: '',
        teacherRecruitType: '',
        wChat: '',
      },
      // 新增专员性质列表
      addPersonPropertyOptions: [
        {
          value: '0',
          label: '兼职',
        },
        {
          value: '1',
          label: '全职',
        },
        {
          value: '2',
          label: '校招全职',
        },
        {
          value: '3',
          label: '公校兼职',
        },
      ],
      // 搜索出来的名字
      searchAddPersonNameData: [],
      // 搜索loading
      personNameLoading: false,
      //
      searchAddPersonNameTable: false,
      // 选择某一行

      // 详细名单弹窗
      showNameDetailDialog: false,
      // 详细名单弹窗loading
      nameDetailLoading: true,
      // 详细名单数据
      nameDetailData: [],
      nameDetailTotal: '',

      // 名单配置弹窗dialog
      showNameConfigDialog: false,
      // 保存修改后的名单配置
      updateNameConfigLoad: false,
      // 招师性质
      nameConfigType: '',
      // 字典
      ruleTist: [],
      // 名单配置数据
      nameConfigData: {
        teacherRecruitRule: '',
        commissioners: [],
        chargeOfPercent: '',
        chargeOfNumber: '',
      },
      // nameConfigDataSubject: [],
      // nameConfigDataGrade: [],
      nameConfigDataSchool: [],
      // 平均分名单
      nameConfigDataNames: [],
      nameConfigDataNamesChosed: [],

      showNamesAmount: false,
      // 计算名单数
      calculateNamesAmountLoading: false,
      stuCount: '',

      // 修改工作性质dialog
      showChangeDialog: false,
      cbuOneRecruitType: [],
      cbuTwoRecruitType: [],
      cbuThreeRecruitType: [],
      cbuFiveRecruitType: [],
      showChangeDialogData: {
        roleName: '',
        wChatZ: '',
        name: '',
        id: '',
        bu: [],
        wChat: '', // 微信号
      },
      // 工作性质列表
      // 1-员工离职 2-名单分配 3-其他
      transferReasonOptions: [
        {
          value: 1,
          label: '员工离职',
        },
        {
          value: 2,
          label: '名单分配',
        },
        {
          value: 3,
          label: '其他',
        },
      ],
      currentAddBu: '',
      // 离职dialog
      showLeaveDialog: false,
      leaver: {},
      leaveLoading: false,
      // 移交dialog
      transferTarget: '',
      showTransferDialog: false,
      fromCommissionerId: '',
      transferReason: '',
      toCommissionerId: '',
      searchList: [],
      transferList: [],
      transferChosedList: [],
      loading: false,
      // 移交人员总列表
      queryTransferList: [],
      // 移交人员查询
      transferQuery: false,
      nameConfig: {
        nameConfigDialog: false,
        count: {
          one: 0,
          two: 0,
          three: 0,
          five: 0,
        },
        loading: false,
        data: [],
      },
      name: '',
      mobile: '',
      chooseId: '',
      wChat: '',
      buList,
      emailConfigVisible:false
      // orgList: [],
    };
  },
  watch: {
    showChangeDialog(val) {
      if (!val) {
        this.currentAddBu = '';
        this.cbuOneRecruitType = [];
        this.cbuTwoRecruitType = [];
        this.cbuThreeRecruitType = [];
        this.cbuFiveRecruitType = [];

      }
    },
    showAdd(val) {
      if (!val) {
        this.addPerson.roleName = '';
        this.addPerson.userName = '';
        this.currentAddBu = '';
        this.buOneRecruitType = [];
        this.buTwoRecruitType = [];
        this.buThreeRecruitType = [];
        this.buFiveRecruitType = [];
      }
    },
  },
  methods: {
    getEmailInfo(){
      this.$Fetch({
          url: '/api/teacherEntryCommissioner/getCommissionerEmail',
          method: 'post',
          data: {
            id:this.pwdId
            },
        })
        .then((res) => {
          this.dynamicValidateForm.email=res.data?res.data.emailAccount:'';
          this.pwdText=res.data?res.data.emailPwd:'';
          if( this.dynamicValidateForm.email==''&&this.dynamicValidateForm.pwd==''){
            this.edit=true
          }
          this.hanldleTurnText()
        })
    },
    hanldleTurnText(){
      if(this.pwdText){
        this.$Fetch({
          url: '/decrypt',
          method: 'post',
          data: {
            cipher:this.pwdText
            },
        })
        .then((res) => {
          this.dynamicValidateForm.pwd=res.data
        })
      }
    },
    hanldleTurnPassword(){
      this.pwdText='';
      return new Promise((resolve, reject)=>{
         if(this.dynamicValidateForm.pwd){
          this.$Fetch({
            url: '/encrypt',
            method: 'post',
            data: {
               id:this.dynamicValidateForm.pwd
              },
          })
          .then((res) => {
            resolve(res.data)
          }).catch((err)=>{
            reject(err)
          })
        }
      })
    },
     saveEmailInfo(){
      this.$refs['dynamicValidateForm'].validate(async (valid) => {
          if (valid) {

            this.pwdText = await this.hanldleTurnPassword()

             if(this.pwdText){
              this.$Fetch({
                  url: '/api/teacherEntryCommissioner/updateCommissionerEmail',
                  method: 'post',
                  data: {
                      "emailAccount": this.dynamicValidateForm.email,
                      "emailPwd": this.pwdText,
                      "id": this.pwdId
                      },
                })
                .then((res) => {
                  this.$Message.success(res);
                  this.emailConfigVisible=false
                }).catch((res)=>{
                this.$Message.error(res);

              })
            }


          }else {
            console.log('error submit!!');
            return false;
          }
      })
      },
    emailConfig(row){
      this.emailConfigVisible=true;
      this.edit=false;
      this.pwdId=row.id;
      this.pwdText='';
      this.showPwdInput=true;
      this.$nextTick(()=>{
        this.$refs['dynamicValidateForm'].resetFields();
        this.getEmailInfo()
      })
    },
    // disposeAuthInfo(info) {
    //   let { roleCode, orgDtoList } = info;
    //   let orgList = orgDtoList || [];
    //   if (roleCode === 2) {
    //     this.search_data.orgCode = orgList[0].orgCode;
    //   } else if (roleCode === 1){
    //     orgList = [
    //       { orgName: '全部', orgCode: ''},
    //       ...orgList
    //     ]
    //   }
    //   this.orgList = orgList;
    //   this.search_data.positionFlag = roleCode;
    // },
    // 负责人数详情：查询手机号
    getOwnerDetailMobile(e, teaId, type) {
      if (!teaId || teaId == 'null') {
        this.$Message({
          message: '专员ID不存在，请联系产品开发进行处理',
        });
        return;
      }
      if (this.ownerDetailSecretState) {
        this.$Message({
          message: '请等待上次查询完成',
        });
        return;
      }
      if (this.ownerDetailSecretTime < 5) {
        this.$Message({
          message: '单次查询间隔为5秒钟',
        });
        return;
      }

      this.ownerDetailSecretTime = 0;
      this.ownerDetailSecretState = true;
      let elementList = document.querySelectorAll('.ownerDetailsBtn');
      for (let i = 0; i < elementList.length; i++) {
        elementList[i].innerText = '点击获取手机号';
      }
      let parm = {
        teaId: teaId,
        infoType: type,
      };
      e.target.innerText = '正在查询...';
      getTeaMobile(parm)
        .then(data => {
          this.ownerDetailSecretState = false;
          e.target.innerText = data;
          this.ownerDetailSecretInterval = window.setInterval(() => {
            if (this.ownerDetailSecretTime >= 5) {
              window.clearInterval(this.ownerDetailSecretInterval);
            } else {
              this.ownerDetailSecretTime = this.ownerDetailSecretTime + 1;
            }
          }, 1000);
        })
        .catch(message => {
          e.target.innerText = '信息不存在';
          this.ownerDetailSecretTime = 5;
          this.ownerDetailSecretState = false;
          this.$Message({
            message,
          });
        });
    },
    // 列表：查询手机号
    getTeaSecret(e, specialId, type) {
      if (!specialId || specialId == 'null') {
        this.$Message({
          message: '专员ID不存在，请联系产品开发进行处理',
        });
        return;
      }
      if (this.requestTeaSecretState) {
        this.$Message({
          message: '请等待上次查询完成',
        });
        return;
      }
      if (this.requestTeaSecretTime < 5) {
        this.$Message({
          message: '单次查询间隔为5秒钟',
        });
        return;
      }

      this.requestTeaSecretTime = 0;
      this.requestTeaSecretState = true;
      let elementList = document.querySelectorAll('.detailsBtn');
      for (let i = 0; i < elementList.length; i++) {
        elementList[i].innerText = '点击获取手机号';
      }
      let parm = {
        id: specialId,
      };
      e.target.innerText = '正在查询...';
      getSpecialMobile(parm)
        .then(data => {
          this.requestTeaSecretState = false;
          e.target.innerText = data;
          this.requestTeaSecretInterval = window.setInterval(() => {
            if (this.requestTeaSecretTime >= 5) {
              window.clearInterval(this.requestTeaSecretInterval);
            } else {
              this.requestTeaSecretTime = this.requestTeaSecretTime + 1;
            }
          }, 1000);
        })
        .catch(message => {
          e.target.innerText = '信息不存在';
          this.requestTeaSecretTime = 5;
          this.requestTeaSecretState = false;
          this.$Message({
            message,
          });
        });
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    closeSetNameConfigDialog() {
      this.nameConfig = {
        nameConfigDialog: false,
        count: {
          one: 0,
          two: 0,
          three: 0,
          five: 0,
        },
        loading: false,
        data: [],
      };
    },
    getplaceholdertext(val) {
      if (val == '1') {
        return '1对1名单数';
      }
      if (val == '2') {
        return '少儿名单数';
      }
      if (val == '3') {
        return '陪练名单数';
      }
      return '';
    },
    setNameConfig() {
      this.nameConfig.loading = true;
      this.$Fetch({
        url: '/api/1.0.0/unAssign/getAssignInfo',
        method: 'post',
        data: {
          name: this.name,
          mobile: this.mobile,
        },
      })
        .then(result => {
          this.nameConfig.loading = false;
          const data = result.data;
          const code = result.code;
          // const message = result.message;

          if (code == 0) {
            if (!data.assginBuInfo) {
              this.$Message({
                message: '没有待分配老师',
              });
              return;
            }
            for (let i = 0; i < data.assginBuInfo.length; i++) {
              if (data.assginBuInfo[i].bu == '1') {
                this.nameConfig.count.one = data.assginBuInfo[i].unAssignCount;
              }
              if (data.assginBuInfo[i].bu == '2') {
                this.nameConfig.count.two = data.assginBuInfo[i].unAssignCount;
              }
              if (data.assginBuInfo[i].bu == '3') {
                this.nameConfig.count.three =
                  data.assginBuInfo[i].unAssignCount;
              }
              if (data.assginBuInfo[i].bu == '5') {
                this.nameConfig.count.five =
                  data.assginBuInfo[i].unAssignCount;
              }
            }
            this.nameConfig.data = this.translateNameConfigData(
              data.commissioner ? data.commissioner : []
            );
            this.nameConfig.nameConfigDialog = true;
          }
        })
        .catch(message => {
          this.nameConfig.loading = false;
          this.$Message({
            message,
          });
        });
    },
    // 数据初始化
    initNameConfig() {
      this.name = '';
      this.mobile = '';
    },
    configsSetting() {
      let oneTotal = 0,
        twoTotal = 0,
        threeTotal = 0,
        fiveTotal = 0,
        _data = this.nameConfig.data,
        len = this.nameConfig.data.length,
        item = null,
        error = '',
        parm = [];
      for (let i = 0; i < len; i++) {
        item = _data[i];
        if (item.select) {
          let oneCount = 0,
            twoCount = 0,
            threeCount = 0,
            fiveCount=0
          for (let j = 0; j < item.buConfigs.length; j++) {
            parm.push({
              commissionerId: item.id,
              bu: item.buConfigs[j].bu,
              averageUserConfig: item.buConfigs[j].averageUserConfig,
            });
            if (item.buConfigs[j].bu == '1') {
              oneCount = item.buConfigs[j].averageUserConfig;
            }
            if (item.buConfigs[j].bu == '2') {
              twoCount = item.buConfigs[j].averageUserConfig;
            }
            if (item.buConfigs[j].bu == '3') {
              threeCount = item.buConfigs[j].averageUserConfig;
            }
            if (item.buConfigs[j].bu == '5') {
              fiveCount = item.buConfigs[j].averageUserConfig;
            }
          }
          if (isNaN(oneCount) || isNaN(twoCount) || isNaN(threeCount)||isNaN(fiveCount)) {
            error = '存在非数字';
            break;
          } else {
            oneTotal = oneTotal + parseInt(oneCount);
            twoTotal = twoTotal + parseInt(twoCount);
            threeTotal = threeTotal + parseInt(threeCount);
            fiveTotal = fiveTotal + parseInt(fiveTotal);
          }
        }
      }
      if (error != '') {
        this.$Message({
          message: error,
        });
        return;
      }
      this.nameConfigState = true;
      this.$Fetch({
        url: '/api/1.0.0/unAssign/saveAssignInfo',
        method: 'post',
        data: {
          assginInfo: parm,
        },
      })
        .then(result => {
          this.nameConfigState = false;
          // const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.$Message({
              message: '操作成功',
            });
            this.closeSetNameConfigDialog();
          } else {
            this.$Message({
              message,
            });
          }
          this.$sdk.sendEvent({
            eventId: 'click_teacher_saveAssignInfo',
            eventParam: {
              assginInfo: parm,
            },
          });
        })
        .catch(message => {
          this.nameConfigState = false;
          this.$Message({
            message,
          });
        });
    },
    translateNameConfigData(data) {
      let _data = data;
      for (let i = 0; i < _data.length; i++) {
        _data[i].select = false;
      }
      return _data;
    },
    chargeOfTeachertypeFilter(val) {
      let rectype = val.split(',');
      let rectypetext = '';
      for (let i = 0; i < rectype.length; i++) {
        rectypetext = rectypetext + ' ' + this.getrectypetext(rectype[i]);
      }
      return rectypetext;
    },
    getrectypetext(val) {
      if (val == '0') {
        return '兼职';
      }
      if (val == '1') {
        return '全职';
      }
      if (val == '2') {
        return '校招全职';
      }
      if (val == '3') {
        return '公校兼职';
      }

      return '';
    },
    // 获取表单数据
    getTableData() {
      this.tableLoading = true;
      this.$Fetch({
        url: '/api/1.0.0/teacherEntryCommissioner/getCommissionerList',
        method: 'post',
        data: this.search_data,
      })
        .then(result => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.table_data = data.list;
            this.table_data_total = data.total;
          } else {
            this.$Message({
              message,
            });
          }
          this.tableLoading = false;
          this.$sdk.sendEvent({
            eventId: 'click_teacher_getCommissionerList',
            eventParam: this.search_data,
          });
        })
        .catch(message => {
          this.$Message({
            message,
          });
          this.tableLoading = false;
        });
    },
    handleSizeChange(pageSize) {
      this.search_data.pageSize = pageSize;
      // this.currentPage = 1;
      this.search_data.pageNo = 1;
      this.tableLoading = true;
      this.getTableData();
    },
    handleCurrentChange(currentPage) {
      // this.currentPage = currentPage;
      this.search_data.pageNo = currentPage;
      this.tableLoading = true;
      this.getTableData();
    },
    // 查询
    search() {
      this.tableLoading = true;
      this.search_data.pageNo = 1;
      this.getTableData();
    },

    // 新增专员
    create() {
      this.showAdd = true;
    },
    // 搜索新增专员姓名
    searchAddPersonName() {
      this.searchAddPersonNameTable = true;
      this.searchAddPersonNameData = [];
      if (this.addPerson.userName !== '') {
        this.personNameLoading = true;
        this.$Fetch({
          url:
            '/api/getUserInfoByNameOrMobile?nameOrMobile=' +
            this.addPerson.userName,
          method: 'get',
        })
          .then(result => {
            const data = result.data;
            data.forEach(person => {
              this.searchAddPersonNameData.push(person);
            });
            this.personNameLoading = false;
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
    },
    // 选择专员
    choose(val) {
      this.addPerson.userName = val.userName || '';
      this.addPerson.userId = val.userId;
      this.addPerson.userMobile = val.userMobile;
      this.searchAddPersonNameTable = false;
      this.searchAddPersonNameData = [];
    },
    // 增加专员
    addPersonClick() {
      if (!this.addPerson.wChat)
        return this.$Message({ message: '微信号不能为空' });
      this.addPerson.bu = [];
      if (this.buOneRecruitType.length > 0) {
        this.addPerson.bu.push({
          bu: '1',
          teacherRecruitType: this.buOneRecruitType.toString(),
        });
      }
      if (this.buTwoRecruitType.length > 0) {
        this.addPerson.bu.push({
          bu: '2',
          teacherRecruitType: this.buTwoRecruitType.toString(),
        });
      }
      if (this.buThreeRecruitType.length > 0) {
        this.addPerson.bu.push({
          bu: '3',
          teacherRecruitType: this.buThreeRecruitType.toString(),
        });
      }
      if (this.buFiveRecruitType.length > 0) {
        this.addPerson.bu.push({
          bu: '5',
          teacherRecruitType: this.buFiveRecruitType.toString(),
        });
      }
      if (this.addPerson.bu.length == 0) {
        this.$Message({
          message: '请选择BU',
        });
        return;
      }
      this.$Fetch({
        url: '/api/1.0.0/teacherEntryCommissioner/createRecruitCommissioner',
        method: 'post',
        data: this.addPerson,
      })
        .then(result => {
          const data = result.data;
          const code = result.code;
          if (code == 0) {
            // this.table_data.push(data);
            this.$Message({
              message: result.message,
              type: 'success',
            });
            this.getTableData();
          } else if (code == 1) {
            this.$Message({
              message: result.message,
            });
          }
          this.showAdd = false;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    closeAddPersonDialog() {
      this.showAdd = false;
      this.searchAddPersonNameTable = false;
      this.searchAddPersonNameData = [];
      this.addPerson = {
        // 新增专员
        userId: '',
        userName: '',
        userMobile: '',
        // 新增专员性质
        teacherRecruitType: '',
      };
    },
    selectChange() {},
    // 查看人员详情
    showNameDetail(id) {
      this.nameDetailLoading = true;
      this.showNameDetailDialog = true;
      this.$Fetch({
        url: '/api/teacherEntryCommissioner/getTeacherDetailNames',
        method: 'post',
        data: {
          id,
          teaBu: this.search_data.bu,
          pageNo: 1,
          pageSize: 10000,
        },
      })
        .then(result => {
          const data = result.data;
          this.nameDetailData = data.list;
          this.nameDetailTotal = data.total;
          this.nameDetailLoading = false;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    // 关闭详细名单弹窗
    closeNameDetailDialog() {
      this.nameDetailData = [];
      this.nameDetailLoading = true;
      this.showNameDetailDialog = false;
    },
    // 查看名单配置
    showNameConfig(id, name, type) {
      this.nameConfigDataId = id;
      this.nameConfigType = type;
      this.showNameConfigDialog = true;
      this.$Fetch({
        url:
          '/api/teacherEntryCommissioner/getRecruitCommissionerDetailsConfigInfo?id=' +
          id,
        method: 'get',
      })
        .then(result => {
          const data = result.data;
          this.nameConfigData = result.data;
          this.nameConfigData.teacherName = name;
          // this.nameConfigData.teacherRecruitRule = 2;
          // this.nameConfigDataSubject = data.subjects;
          // this.nameConfigDataGrade = data.grades;

          // (data.schools || []).forEach((value) => {
          //     this.nameConfigDataSchool.push(this.school_list[value])
          // });

          this.nameConfigDataSchool = data.schools || [];
          this.nameConfigDataSchool.forEach((value, index) => {
            this.nameConfigDataSchool[index] = '' + value;
          });
          // (data.subjects || []).forEach(value=>{
          //     this.nameConfigDataSubject.push(value.toString());
          // });
          // (data.grades || []).forEach(value=>{
          //     this.nameConfigDataGrade.push(value.toString());
          // });

          // 平均分名单
          this.nameConfigDataNames = data.commissioners || [];
          this.nameConfigDataNames.forEach(name => {
            if (name.isChecked == 1) {
              this.nameConfigDataNamesChosed.push(name.id);
            }
          });
          // this.nameConfigDataNamesChosed = this.nameConfigDataNames.filter((name)=>{
          //     return name.isChecked == 1;
          // });
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    closeNameConfigDialog() {
      this.showNamesAmount = false;
      this.nameConfigDataSchool = [];
      this.nameConfigDataNames = [];
      this.nameConfigDataNamesChosed = [];
      this.calculateNamesAmountLoading = false;
      this.nameConfig.nameConfigDialog = false;
      this.initNameConfig();
    },
    // 选择科目
    selectChangeSubject() {},
    addPersonSelectBu(val) {
      this.currentAddBu = val;
    },
    // 计算名单数目
    calculateNamesAmount() {
      this.calculateNamesAmountLoading = true;
      this.$Fetch({
        url: '/api/teacherEntryCommissioner/calculateNamesAmount',
        method: 'post',
        data: {
          chargeOfCollege: this.nameConfigDataSchool,
          // chargeOfGrade:this.nameConfigDataGrade,
          chargeOfPercent: this.nameConfigData.chargeOfPercent,
          chargeOfRule: this.nameConfigData.teacherRecruitRule,
          // chargeOfSubject:this.nameConfigDataSubject,
          id: this.nameConfigDataId,
          ids: this.nameConfigDataNamesChosed,
        },
      })
        .then(result => {
          const data = result.data;
          const code = result.code;

          if (code == 0) {
            // this.$Message({
            //     message: result.message,
            //     type: 'success'
            // });
            this.stuCount = data;
            this.showNamesAmount = true;
          } else {
            this.$Message({
              message: result.message,
            });
          }

          this.calculateNamesAmountLoading = false;
          // this.showNameConfigDialog = false;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },

    // 保存名单配置
    updateNameConfig() {
      this.updateNameConfigLoad = true;
      this.$Fetch({
        url:
          '/api/1.0.0/teacherEntryCommissioner/updateRecruitCommissionerConfig',
        method: 'post',
        data: {
          chargeOfCollege: this.nameConfigDataSchool,
          // chargeOfGrade:this.nameConfigDataGrade,
          chargeOfPercent: this.nameConfigData.chargeOfPercent,
          chargeOfRule: this.nameConfigData.teacherRecruitRule,
          // chargeOfSubject:this.nameConfigDataSubject,
          id: this.nameConfigDataId,
          ids: this.nameConfigDataNamesChosed,
        },
      })
        .then(result => {
          const data = result.data;
          const code = result.code;
          if (code == 0) {
            this.$Message({
              message: result.message,
              type: 'success',
            });
            this.showNameConfigDialog = false;
          } else {
            this.$Message({
              message: result.message,
            });
          }
          this.updateNameConfigLoad = false;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },

    // 修改工作性质
    showChange(id, name, bu, roleName, wChat) {
      this.showChangeDialog = true;
      this.showChangeDialogData.id = id;
      this.showChangeDialogData.name = name;
      this.showChangeDialogData.roleName = roleName;
      this.showChangeDialogData.wChat = wChat;
      for (let i = 0; i < bu.length; i++) {
        if (bu[i].bu == '1') {
          this.cbuOneRecruitType = bu[i].teacherRecruitType.split(',');
        }
        if (bu[i].bu == '2') {
          this.cbuTwoRecruitType = bu[i].teacherRecruitType.split(',');
        }
        if (bu[i].bu == '3') {
          this.cbuThreeRecruitType = bu[i].teacherRecruitType.split(',');
        }
        if (bu[i].bu == '5') {
          this.cbuFiveRecruitType = bu[i].teacherRecruitType.split(',');
        }
      }
    },
    // 确定修改
    changeClick() {
      if (!this.showChangeDialogData.wChat)
        return this.$Message({ message: '微信号不能为空' });
      this.showChangeDialogData.bu = [];
      if (this.cbuOneRecruitType.length > 0) {
        this.showChangeDialogData.bu.push({
          bu: '1',
          teacherRecruitType: this.cbuOneRecruitType.toString(),
        });
      }
      if (this.cbuTwoRecruitType.length > 0) {
        this.showChangeDialogData.bu.push({
          bu: '2',
          teacherRecruitType: this.cbuTwoRecruitType.toString(),
        });
      }
      if (this.cbuThreeRecruitType.length > 0) {
        this.showChangeDialogData.bu.push({
          bu: '3',
          teacherRecruitType: this.cbuThreeRecruitType.toString(),
        });
      }
      if (this.cbuFiveRecruitType.length > 0) {
        this.showChangeDialogData.bu.push({
          bu: '5',
          teacherRecruitType: this.cbuFiveRecruitType.toString(),
        });
      }
      this.$Fetch({
        url:
          '/api/1.0.0/teacherEntryCommissioner/updateRecruitCommissionerType',
        method: 'post',
        data: {
          id: this.showChangeDialogData.id,
          bu: this.showChangeDialogData.bu,
          roleName: this.showChangeDialogData.roleName,
          wChat: this.showChangeDialogData.wChat,
        },
      })
        .then(result => {
          const data = result.data;
          const code = result.code;
          if (code == 0) {
            this.$Message({
              message: result.message + '10s后生效',
              type: 'success',
            });
          } else if (code == 1) {
            this.$Message({
              message: result.message,
            });
          }
          this.showChangeDialog = false;
          this.search();
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    // 关闭修改工作性质弹窗
    closeChangeDialog() {
      this.showChangeDialog = false;
      this.showChangeDialogData = {
        roleName: '',
        name: '',
        id: '',
        bu: [],
      };
    },

    // 离职
    showLeave(id, name) {
      this.leaver.id = id;
      this.leaver.name = name;
      this.showLeaveDialog = true;
    },
    closeLeaveDialog() {
      this.showLeaveDialog = false;
      this.leaveLoading = false;
    },
    // 确定离职
    leave() {
      this.leaveLoading = true;
      this.$Fetch({
        url: '/api/teacherEntryCommissioner/farfarAway?id=' + this.leaver.id,
        method: 'get',
      })
        .then(result => {
          const data = result.data;
          const code = result.code;
          if (code == 0) {
            this.$Message({
              message: result.message,
              type: 'success',
            });
          } else if (code == 1) {
            this.$Message({
              message: result.message,
            });
          }
          this.showLeaveDialog = false;
          this.leaveLoading = false;
        })
        .catch(message => {
          this.$Message({
            message,
          });
          this.showLeaveDialog = false;
          this.leaveLoading = false;
        });
    },
    // 移交
    showTransfer(id) {
      this.fromCommissionerId = id;
      this.showTransferDialog = true;

      this.$Fetch({
        url:
          '/api/teacherEntryCommissioner/getMayTransferComissioners?id=' + id,
        method: 'get',
      })
        .then(result => {
          const data = result.data;
          this.transferList = data;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    // 关闭移交弹窗
    closeTransferDialog() {
      this.transferReason = '';
      // this.toCommissionerId = '';
      this.transferQuery = false;
      this.transferList = [];
      this.transferChosedList = [];
    },
    // 确定移交
    transferClick() {
      this.$Fetch({
        url: '/api/teacherEntryCommissioner/transferTeacherNames',
        method: 'post',
        data: {
          fromCommissionerId: this.fromCommissionerId,
          toCommissionerIds: this.transferChosedList,
          transferReasonType: this.transferReason,
        },
      })
        .then(result => {
          const data = result.data;
          const code = result.code;
          if (code == 0) {
            this.$Message({
              message: result.message,
              type: 'success',
            });
          } else if (code == 1) {
            this.$Message({
              message: result.message,
            });
          }
          this.showTransferDialog = false;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    //编辑负责学校
    openSetSchool(id) {
      this.$refs.setCourseAndSchoolDialog.open('UNIVERSITIES', id);
    },
    //编辑负责科目
    openSetCourse(id) {
      this.$refs.setCourseAndSchoolDialog.open('RESERVATIONS_COURSE', id);
    },

    // 编辑微信好
    wChatStatus(row) {
      this.chooseId = row.id;
      this.wChat = row.wChat;
    },

    wChatSave(row) {
      this.$Fetch({
        url: '/api/1.0.0/teacherEntryCommissioner/updateCommissioner',
        method: 'post',
        data: {
          id: row.id,
          wChat: this.wChat,
        },
      })
        .then(res => {
          if (res.code === '0') {
            this.getTableData();
            this.chooseId = '';
            this.wChat = '';
          } else {
            const { message } = res;
            this.$Message({
              message: message || '保存失败请稍后再试',
            });
          }
        })
        .catch(message => {
          this.$Message({
            message: message || '保存失败请稍后再试',
          });
        });
    },
  },
  mounted() {
    // 获取表单初始数据
    // let authInfo = this.$store.state.workbench.authInfo;
    // if (authInfo.roleCode === undefined) {
    //   let fn = this.$store.watch(
    //     state => {
    //       return state.workbench.authInfo;
    //     },
    //     authInfo => {
    //       if (authInfo.roleCode !== undefined) {
    //         this.disposeAuthInfo(authInfo);
    //         this.getTableData();
    //         fn();
    //       }
    //     }
    //   );
    // } else {
    //   this.disposeAuthInfo(authInfo);
    //   this.getTableData();
    // }

    this.getTableData();
    // 获取学校列表字典
    this.$Fetch({
      url: '/api/dict/getOneDictByGroupCode?groupCode=TEACHER_ENTRY_SCHOOL',
      method: 'get',
    })
      .then(result => {
        const data = result.data;
        // data.forEach((value) => {
        //     this.school_list.push(value.itemName);
        // })
        this.school_list = data;
        // data.forEach((value,index)=>{
        //     this.school_list.push(value.itemName);
        // });
      })
      .catch(message => {
        this.$Message({
          message,
        });
      });
  },
};
</script>
<style lang="less" scoped>
.context-body {
  padding: 0;
}
.config-person {
  .search-warpper {
    border-bottom: 1px solid #f0f0f0;
    margin: 0px 0 0 0px;
    padding: 15px 20px 5px 15px;
  }
  .search-btn {
      border-radius: 4px;
      width: 64px;
      background: #1d91fc;
    }
}
.btn-warpper {
  display: flex;
  height: 55px;
  padding: 0 20px;
  align-content: center;
  flex-flow: row-reverse;
  .el-button {
    height: 32px;
    margin-top: 10px;
    border-radius:4px;
    border:1px solid rgba(29,145,252,1);
    color: #1D91FC;
    &:hover, &:focus {
      color: #fff;
    }
  }
}
.table-warpper {
    width: 100%;
    min-height: 500px;
    padding: 0 20px 20px;
    .el-pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
</style>
<style lang="less">
@import '../../../src/styles/config_person/index.less';
.demo-dynami{
  .el-form-item{
    margin-bottom:20px
  }
}
._content .input {
  margin-left: 10px;
  border: 1px solid rgb(183, 166, 166);
  width: 80px;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  background-color: transparent;
}
._content .input-panel {
  float: right;
}
.search_item {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 35px;
}
.search_item > div:not(:nth-child(3)) {
  width: 41%;
  margin-right: 5px;
}
.search_item > div:nth-child(3) {
  margin-left: 10px;
}
.search_item > div > span {
  display: inline-block;
  margin-right: 5px;
}
.search_item > div > .search_input {
  width: 70%;
}

.context-body-save-w-chat {
  .save {
    display: flex;
  }
  .span {
    display: flex;
    padding-left: 16px;
    word-break: break-all;
    img {
      height: 16px;
      width: 16px;
      margin: 7px;
      cursor: pointer;
      opacity: 0;
    }
  }
  .span:hover {
    cursor: pointer;
    img {
      opacity: 1;
    }
  }
  .save {
    img {
      height: 16px;
      width: 16px;
      margin: 8px;
      cursor: pointer;
    }
  }
  .edit {
    img {
      height: 16px;
      width: 16px;
      cursor: pointer;
    }
  }
}
.detailsBtn,
.ownerDetailsBtn {
  cursor: pointer;
  color: #007fff;
}
.data-table {
  border: 1px solid #d9d9d9;
  border-right: 1px solid #e8e8e8;
  .el-table__body {
    color: #4A4A4A;
    font-size: 14px;
  }
   th {
     background-color: #F8F8F8;
     color: #333333;
    //  font-weight: bold;
     font-size: 14px;
     &.is-leaf {
           border-bottom: 1px solid #e8e8e8;
     }
   }
   .el-button--small {
     font-size: 14px;
     color: #1D91FC;
   }
  }
</style>
