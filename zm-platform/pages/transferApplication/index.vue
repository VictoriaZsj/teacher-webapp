<template>
  <div class="full-time-container" v-if="permission">
    <el-form
      :inline="true"
      :model="search_data"
      class="search-form"
    >
      <el-form-item label="申请时间">
        <el-date-picker
          :editable="false"
          v-model="searchActDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期"
          @change="chooseActDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input
          v-model="search_data.applyNameOrMobile"
          placeholder="输入申请人手机号或姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="老师">
        <el-input
          v-model="search_data.teaNameOrMobile"
          placeholder="输入老师姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="移交原因">
        <el-select
          v-model="search_data.applyReason"
          clearable
          placeholder="请选择移交原因"
        >
          <el-option
            v-for="(item, index) in channelType"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="建议操作">
        <el-select
          v-model="search_data.recommend"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in active_award"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="审核状态">
        <el-select v-model="search_data.auditState" placeholder="请选择">
          <el-option
            v-for="(item, index) in status_list"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          id="preTrainingSearchBtn"
          class="search-btn"
          icon="search"
          type="normal"
          size="small"
          @click="getTableData"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <div class="btn-warpper">
        <el-button
          v-if="permissionList.indexOf('tea:transferApplication:batchAudit') !== -1"
          @click="handleBatchAudit"
          size="small"
          type="normal"
          class="create-btn"
          >批量审核</el-button
        >
      </div>
      <el-table
        :data="table_data"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="applyTime"
          align="center"
          label="申请时间"
        ></el-table-column>
        <el-table-column
          prop="applyName"
          align="center"
          label="申请人"
        ></el-table-column>
        <el-table-column
          prop="teaName"
          align="center"
          label="老师姓名"
        >
          <template scope="prop">
            <el-button
              type="text"
              size="small"
              @click="handleOpenTeaCard(prop.row)"
              >{{prop.row.teaName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyMobile"
          align="center"
          label="手机号"
          width="100"
        >
          <template scope="prop">
            <el-button
              v-if="
                prop.row.teaMobile && prop.row.teaMobile.indexOf('***') !== -1
              "
              type="text"
              size="small"
              @click="queryMobile(prop.row)"
              >点击查看手机号</el-button
            >
            <span v-else>{{ prop.row.teaMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyReasonName"
          align="center"
          label="移交原因"
        ></el-table-column>
        <el-table-column
          prop="provePicUrls"
          align="center"
          label="证明文件"
          width="120"
        >
          <template scope="prop">
            <div class="attachments">
              <span
                v-for="(provePicUrls, index) in prop.row.provePicUrls.split(',')"
                class="attachments-item"
                type="text"
                size="small"
                @click="handleViewDialog(provePicUrls)"
                :key="index"
                >附件-{{ index + 1 }} {{index === prop.row.provePicUrls.split(',').length - 1 ? '' : '；'}}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注信息"
          width="120"
        >
          <template scope="prop">
            <el-tooltip
              effect="dark"
              :disabled="prop.row.remark && prop.row.remark.length < 12"
              :content="prop.row.remark"
              placement="top"
            >
              <div
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 120px;
                "
              >
                {{ prop.row.remark }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="auditState" align="center" label="审核状态">
          <template scope="scope">
            {{ scope.row.auditState | statueFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="refuseReason"
          align="center"
          label="审核拒绝原因"
          width="120"
        >
          <template scope="prop">
            <el-tooltip
              effect="dark"
              :disabled="
                prop.row.refuseReason && prop.row.refuseReason.length < 12
              "
              :content="prop.row.refuseReason"
              placement="top"
            >
              <div
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 120px;
                "
              >
                {{ prop.row.refuseReason }}
              </div>
            </el-tooltip>
          </template></el-table-column
        >
        <el-table-column
          prop="auditName"
          align="center"
          label="审核人"
        ></el-table-column>
        <el-table-column
          prop="auditTime"
          align="center"
          label="审核时间"
        ></el-table-column>
        <el-table-column
          prop="recommendName"
          align="center"
          label="建议操作"
        ></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="80" v-if="permissionList.indexOf('tea:transferApplication:singleAudit') !== -1">
          <template scope="scope">
            <div v-if="scope.row.auditState === 'PENDING'">
              <el-button
                size="small"
                @click="handleAuditPass(scope.row.id)"
                type="text"
                >通过</el-button
              >
              <el-button
                size="small"
                @click="handleAuditDialog(scope.row.id, 'REFUSED')"
                type="text"
                >拒绝</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search_data.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="search_data.pageSize"
        layout="sizes, prev, pager, next"
        v-bind:total="table_data_total"
      ></el-pagination>
    </div>
    <!-- 查看证明文件 -->
    <el-dialog v-model="preview.visible" size="full">
      <img :src="preview.url" width="100%" alt="" />
    </el-dialog>

    <!-- 审批 -->
    <el-dialog
      v-model="audit.visible"
      :title="audit.title + '审核'"
      class="transfer-application-dialog"
    >
      <el-form label-width="120px">
        <el-form-item :label="audit.title + '审核'">
          <el-radio-group v-model="audit.auditState">
            <el-radio label="PASS">通过</el-radio>
            <el-radio label="REFUSED">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          class="mt10"
          v-if="audit.auditState === 'REFUSED'"
          label="拒绝原因"
        >
          <el-input
            type="textarea"
            placeholder="请输入原因"
            v-model="audit.refuseReason"
            :maxlength="30"
            show-word-limit
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="audit.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAuditSubmit"
          :disabled="
            (audit.auditState === 'REFUSED' && audit.refuseReason === '') ||
            audit.isSubmit
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
  <div v-else style="font-size: 32px; text-align: center; line-height: 80vh">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import {
  getTeacherTransfersPage,
  getTeacherSecretInfo,
  batchTransferAudit
} from '../../api/teacherTransfers';

const status_list = [
  {
    label: '不限',
    value: ''
  },
  {
    label: '待审核',
    value: 'PENDING'
  },
  {
    label: '移交失败',
    value: 'FAILED'
  },
  {
    label: '移交成功',
    value: 'PASS'
  },
  {
    label: '审核拒绝',
    value: 'REFUSED'
  }
];
export default {
  data() {
    return {
      searchActDateArea: [],
      channelType: [
        {
          label: '其他',
          value: 3
        },
        {
          label: '渠道',
          value: 4
        },
        {
          label: '转介绍',
          value: 5
        },
        {
          label: 'BOSS',
          value: 6
        }
      ],
      status_list: status_list,
      active_award: [
        {
          label: '不限',
          value: ''
        },
        {
          label: '建议通过',
          value: 'PASS'
        },
        {
          label: '建议拒绝',
          value: 'REFUSED'
        }
      ],
      search_data: {
        applyStartTime: '',
        applyEndTime: '',
        applyNameOrMobile: '',
        auditState: 'PENDING',
        recommend: '',
        applyReason: '',
        teaNameOrMobile: '',
        pageNo: 1,
        pageSize: 10
      },
      table_data: [],
      table_data_total: 0,
      tableLoading: false,
      preview: {
        visible: false,
        url: ''
      },
      audit: {
        visible: false,
        applyIds: [],
        auditState: '',
        refuseReason: '',
        title: '',
        isSubmit: false
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  filters: {
    statueFilter(val) {
      if (val === 'PENDING') {
        return '待审核';
      }
      if (val === 'FAILED') {
        return '移交失败';
      }
      if (val === 'PASS') {
        return '移交成功';
      }
      if (val === 'REFUSED') {
        return '审核拒绝';
      }
      return '';
    }
  },
  methods: {
    renderTime(date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
    },
    // 选中行ID
    handleSelectionChange(val) {
      this.audit.applyIds = val.map((i) => {
        return i.id;
      });
    },
    // 查看证明文件
    handleViewDialog(url) {
      // this.preview.url = url;
      // this.preview.visible = true;
      window.open(url);
    },
    // 查询手机号
    queryMobile(row) {
      const res = getTeacherSecretInfo({
        teaId: row.teaId,
        infoType: 'mobile'
      }).then((res) => {
        if (res.data.code === '0') {
          row.teaMobile = res.data.data;
        } else {
          this.$message.warning(res.data.message);
        }
      });
    },
    // 查询
    getTableData() {
      this.tableLoading = true;
      getTeacherTransfersPage(this.search_data)
        .then((result) => {
          const { data, code, message } = result.data;
          if (code === '0') {
            this.table_data = data.list;
            this.table_data_total = data.total;
          } else {
            this.$Message({
              message
            });
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 批量审核
    handleBatchAudit() {
      if (!this.audit.applyIds.length) {
        this.$message.warning('至少选中一位老师进行移交');
        return;
      }
      this.audit.title = '批量';
      this.audit.auditState = '';
      this.audit.refuseReason = '';
      this.audit.visible = true;
    },
    // 通过/拒绝 审批
    handleAuditDialog(id, auditState) {
      this.audit.visible = true;
      this.audit.title = '';
      this.audit.auditState = auditState;
      this.audit.refuseReason = '';
      this.audit.applyIds = [id];
    },
    handleAuditPass(id) {
      if (this.audit.isSubmit){
        return;
      };
      this.audit.isSubmit = true;
      this.audit.auditState = 'PASS';
      const param = {
        auditState: 'PASS',
        applyIds: [id],
      };
      this.auditSubmit(param);
    },
    handleAuditSubmit() {
      const { auditState, applyIds, refuseReason } = this.audit;
      if (!this.audit.auditState) {
        this.$message.warning('请选择审批结果：通过或拒绝');
        return;
      }
      this.audit.isSubmit = true;
      const params = {
        applyIds,
        auditState
      };
      if (auditState === 'REFUSED') {
        params.refuseReason = refuseReason;
      }
      this.auditSubmit(params);
    },
    auditSubmit(params) {
      batchTransferAudit(params)
        .then((res) => {
          this.audit.isSubmit = false;
          if (res.data.code === '0') {
            this.audit.visible = false;
            this.$message.success(res.data.message);
            this.getTableData();
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch(() => {
          this.audit.isSubmit = false;
        });
    },
    handleSizeChange(pageSize) {
      this.search_data.pageSize = pageSize;
      this.search_data.pageNo = 1;
      this.getTableData();
    },
    handleCurrentChange(currentPage) {
      this.search_data.pageNo = currentPage;
      this.getTableData();
    },
    chooseActDate() {
      if (this.searchActDateArea[0] == null) {
        this.search_data.applyStartTime = '';
        this.search_data.applyEndTime = '';
      } else {
        let sDate = new Date(this.searchActDateArea[0]).getTime();
        let eDate = new Date(this.searchActDateArea[1]).getTime();
        this.search_data.applyStartTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.applyEndTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    handleOpenTeaCard({teaId}) {
      window.open(`/tea-library/tea-search.html?keyword=${teaId}`)
    }
  },
  computed: {
    permission: function () {
      return this.$store.getters.permission;
    },
    permissionList: function () {
      return this.$store.getters.permissionList || [];
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>
<style lang="less">
.transfer-application-dialog {
  .mt10 {
    margin-top: 10px;
  }
  .body {
    text-align: left;
  }
  .el-dialog__body,
  .el-dialog__footer {
    background: #fff;
  }
  .el-form-item__label {
    color: #333;
  }
}
.context-body {
  .attachments {
    width: 120px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    .attachments-item {
      cursor: pointer;
      color: #007fff;
      &:hover{
        color: #4db3ff;
      }
    }
  }
}
</style>
