<template>
  <div class="transfer-application">
    <data-card title="移交申请" :tools="tools" @refresh="queryTeacherTransfers" @date-change='dateChange' :default-date='defaultDate'>
      <el-form slot="head-form" :inline="true" class="demo-form-inline">
        <el-form-item label="建议操作">
          <el-select v-model="recommend" class="select select-recommend" size="small" placeholder="请选择建议操作">
            <el-option
              v-for="item in recommendList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="head-tools">
        <el-button
          v-if="permissionList.indexOf('tea:workbench:transfer:application') !== -1"
          type="primary"
          class="search"
          @click="handleApplicationClick"
          size="mini"
          >申请移交</el-button
        >
      </div>
      <template slot="content">
        <div class="transfer-application-content">
          <el-table
            ref="transferApplicationTable"
            :data="tableData.list"
            border
            v-loading="tableData.loading"
          >
            <el-table-column
              align="center"
              :width="item.width ? item.width : '120px'"
              :label="item.label"
              :key="index"
              v-for="(item, index) in tableConfig"
              show-overflow-tooltip
            >
              <template scope="prop">
                <el-button
                  type="text"
                  v-if="
                    item.prop === 'teaMobile' &&
                    prop.row[item.prop].indexOf('***') !== -1
                  "
                  size="small"
                  @click="queryMobile(prop.row)"
                  >点击查看手机号</el-button
                >
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  :disabled="
                    item.prop !== 'refuseReason' ||
                    prop.row[item.prop].length < 12
                  "
                  :content="prop.row[item.prop]"
                  placement="top"
                >
                  <div
                    v-if="item.prop !== 'auditState'"
                    style="
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: 120px;
                    "
                  >
                    {{ prop.row[item.prop] }}
                  </div>
                  <div>{{ prop.row[item.prop] | statueFilter }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableData.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="tableData.pageSize"
            layout="total,sizes, prev, pager, next"
          >
          </el-pagination>
        </div>
      </template>
    </data-card>
    <el-dialog
      class="transfer-application-dialog"
      title="申请移交老师"
      v-model="dialogVisible"
    >
      <div class="body">
        <el-form label-width="120px" :inline="true">
          <el-form-item label="老师手机号">
            <el-input v-model="mobile" placeholder="手机号查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryTransferTeacher"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <div v-if="teacherInfo.teaId">
          <div class="desc">
            <el-form label-width="120px">
              <el-form-item label="姓名:">
                <div>
                  <span>
                    {{ teacherInfo.teaName }} | {{ teacherInfo.teaMobile }} |
                    {{ teacherInfo.timeType }} | {{ teacherInfo.periodState }}
                  </span>
                  <span class="recommend" v-if="teacherInfo.transferState === 0 && teacherInfo.recommend">
                    <el-tag :type="teacherInfo.recommend === 'PASS' ? 'success' : 'warning'">
                      {{ teacherInfo.recommend === 'PASS' ? '系统建议通过' : '系统建议拒绝' }}
                    </el-tag>
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="desc">
            <el-form :rules="rules" :model="transferParams" label-width="120px" v-if="teacherInfo.transferState === 0">
              <el-form-item label="移交原因" prop="applyReason">
                <el-select
                  v-model="transferParams.applyReason"
                  placeholder="请选择移交原因"
                >
                  <el-option
                    v-for="item in transferCause"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="remark" label="备注" class="mt10">
                <div class="editable" ref="editable" id="editable"></div>
                <span class="color808080"
                  >支持.jpg/.png格式文件，不超过10M，最多支持上传5张</span
                >
              </el-form-item>
              <el-form-item
                prop="provePicUrls"
                label="证明截图"
                class="mt10"
              >
                <div class="picture-list" v-if="editContentNode.length">
                  <template v-for="(item, index) in editContentNode">
                    <div
                      class="picture-item"
                      v-if="item.localName === 'img'"
                      :key="index"
                    >
                      <img :src="item.src" />
                      <div class="tools">
                        <div class="icon-item">
                          <i
                            class="el-icon-zoom-in"
                            @click="handlePictureCardPreview(item)"
                          ></i>
                        </div>
                        <div class="icon-item">
                          <i
                            class="el-icon-delete"
                            @click="handleRemove(index)"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </el-form-item>
            </el-form>
            <div v-else class="colorFF0000">
              {{ teacherInfo.untransferReason }}
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer" v-if="teacherInfo.teaId">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :disabled="!editContentNode.length || isSubmit || !transferParams.applyReason"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog class="imgPreview" v-model="previewVisible" size="full">
      <img :src="previewImage.src" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import DataCard from './dataCard/dataCard';
import axios from 'axios';
import {
  getTeacherTransfersPageNew,
  getTeacherSecretInfo,
  getTransferTeacher,
  submitTeaTransferApply
} from '../../../api/teacherTransfers';
import Wangeditor from 'wangeditor';
import authMixins from './mixins/auth';

function getCountDays() {
          var curDate = new Date();
        /* 获取当前月份 */
          var curMonth = curDate.getMonth();
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
  }
  var day=getCountDays();
  const end = new Date()
    const start=new Date(end.getTime()-3600*24*1000)
export default {
  name: 'transferApplication',
  components: { DataCard },
  mixins: [authMixins],
  data() {
    return {
      tools: ['search','date'],
      mobile: '',
      tableData: {
        list: [],
        total: 0,
        pageNo: 1,
        pageSize: 10,
        loading: false
      },
      startTime:'',
      endTime:'',
      defaultDate:[this.$DateTool.format(start, "yyyy-MM-dd") + " 00:00:00",this.$DateTool.format(end, "yyyy-MM-dd") + " 23:59:59"],
      recommend: '',
      dialogVisible: false,
      editContentNode: [], //富文本框的node节点
      previewVisible: false,
      previewImage: {}, // 放大查看截图证明
      imgUrlList: [], // 证明截图列表
      teacherInfo: {}, // 根据手机号查询到的老师信息
      isSubmit: false,
      transferParams: {
        applyReason: null,
        provePicUrls: '',
        remark: '',
        teaId: ''
      },
      rules: {
        applyReason: [
          { required: true, message: '请选择移交原因'}
        ],
        provePicUrls: [
          { required: true, message: '请填写原因'}
        ]
      },
      tableConfig: [
        {
          label: '姓名',
          prop: 'teaName',
          align: 'center'
        },
        {
          label: '手机号',
          prop: 'teaMobile',
          align: 'center'
        },
        {
          label: '审核状态',
          prop: 'auditState',
          align: 'center'
        },
        {
          label: '建议操作',
          prop: 'recommendName',
          align: 'center'
        },
        {
          label: '拒绝原因',
          prop: 'refuseReason',
          align: 'center',
          width: '180px'
        },
        {
          label: '提交申请时间',
          prop: 'applyTime',
          align: 'center',
          width: '160px'
        }
      ],
      transferCause: [
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
      ], // 移交原因选项
      timeType: {
        0: '兼职',
        1: '全职',
        2: '校招全职',
        3: '公校兼职'
      },
      // 建议列表
      recommendList: [
        {label: '不限', value: ''},
        {label: '建议通过', value: 'PASS'},
        {label: '建议拒绝', value: 'REFUSED'},
      ]
    };
  },
  computed: {
    permissionList: function () {
      return this.$store.getters.permissionList || [];
    }
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
    handleSearch(){

    },
    dateChange(val){
      console.log(val)
      this.startTime=new Date(val[0]).format('yyyy-MM-dd 00:00:00')
      this.endTime=new Date(val[1]).format('yyyy-MM-dd 23:59:59')
    },
    handleApplicationClick() {
      this.dialogVisible = true;
      this.mobile = '';
      this.teacherInfo = {};
      this.transferParams = {
        applyReason: null,
        provePicUrls: '',
        teaId: '',
        remark: ''
      };
      this.editContentNode = [];
    },
    handlePictureCardPreview(img) {
      this.previewImage = img;
      this.previewVisible = true;
    },
    handleRemove(index) {
      const nodes = this.editContentNode.splice(index, 1)[0];
      nodes.parentNode.removeChild(nodes);
    },
    handleSubmit() {
      this.uploadIMG(() => {
        this.transferParams.provePicUrls = this.imgUrlList.toLocaleString();
        this.transferParams.remark = this.editable.txt.text();
        submitTeaTransferApply(this.transferParams)
          .then((res) => {
            if (res.data.code === '0') {
              this.dialogVisible = false;
              this.$message.success('提交成功');
              this.queryTeacherTransfers();
            } else {
              this.$message.warning(res.data.message);
            }
            this.isSubmit = false;
          })
          .catch(() => {
            this.isSubmit = false;
          });
      });
    },
    async uploadIMG(successCallback) {
      if (this.isSubmit) return;
      this.isSubmit = true;
      this.transferParams.remark = '';
      const imgNodes = this.editContentNode.filter((item) => {
        return item.localName === 'img';
      });
      if (imgNodes.length > 5) {
        this.isSubmit = false;
        this.$message.warning(`最多只支持上传5张截图`);
        return;
      }
      if (imgNodes.length < 1) {
        this.isSubmit = false;
        this.$message.warning(`缺少证明截图`);
        return;
      }
      const axiosList = [];
      imgNodes.forEach((item, index) => {
        const file = this.dataURLtoFile(
          item.src,
          `transfer-${new Date().getTime()}.png`
        );
        const fd = new FormData();
        fd.append('multipartFile', file);
        axiosList.push(this.uploadFetch(fd));
      });
      let isUploadError = false;
      this.imgUrlList = [];
      const res = await axios.all(axiosList);
      if (res && Array.isArray(res)) {
        res.forEach((item, index) => {
          const { code, msgCode, data } = item.data;
          if (code !== 200 || msgCode !== '200') {
            this.$message.error(`第${index}张截图上传失败, ${res.msgContent}`);
            isUploadError = true;
          } else {
            this.imgUrlList.push(data);
          }
        });
        if (!isUploadError) {
          this.imgUrlList.length && successCallback && successCallback();
        }
      }
    },
    uploadFetch(data) {
      return axios({
        url: `/api/zm-teacher-recruit-web/api/qiniu/picUpload`,
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        data
      });
    },
    //将base64转换为file
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    async queryTeacherTransfers() {
      this.tableData.loading = true;
      const { pageNo, pageSize } = this.tableData;
      const params = {
        pageNo, 
        pageSize,
        applyStartTime: this.startTime?this.startTime:this.defaultDate[0],
        applyEndTime: this.endTime?this.endTime:this.defaultDate[1],
      }
      if (this.recommend) params.recommend = this.recommend;
      const { data } = await getTeacherTransfersPageNew(params);
      this.tableData.list = data.data.list || [];
      this.tableData.pageNo = data.data.pageNum;
      this.tableData.total = data.data.total;
      this.tableData.loading = false;
    },
    async queryTransferTeacher() {
      const { mobile } = this;
      const res = await getTransferTeacher({ mobile });
      if (res.data.code !== '0') {
        this.$message.warning(res.data.message);
        return;
      }
      this.teacherInfo = Object.assign({}, res.data.data);
      this.transferParams.teaId = this.teacherInfo.teaId;
      if (res.data.data) {
        this.teacherInfo.timeType = this.timeType[this.teacherInfo.timeType];
      }
      setTimeout(() => {
        this.editable = new Wangeditor(document.getElementById('editable'));
        this.editable.config.uploadImgShowBase64 = true;
        this.editable.config.onchange = (newHtml) => {
          this.editContentNode = [
            ...Array.from( document.getElementById('editable').getElementsByTagName('img') )
          ];
        };
        this.editable.config.menus = ['image'];
        this.editable.config.height = 200;
        this.editable.config.placeholder =
          '截图后按住ctrl+V可以直接粘贴哦~，证明截图必填';
        this.editable.create();
      }, 200);
    },
    handleSizeChange(val) {
      this.tableData.pageSize = val;
      this.queryTeacherTransfers();
    },
    handleCurrentChange(val) {
      this.tableData.pageNo = val;
      this.queryTeacherTransfers();
    },
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
    }
  },
  mounted() {
    this.queryTeacherTransfers();
  }
};
</script>
<style lang="less">
.transfer-application {
  .transfer-application-content {
    padding: 20px 8px 12px 20px;
    .tableTextHide {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .transfer-application-dialog {
    min-width: 1000px;
    .body {
      text-align: left;
    }
    .el-button {
      margin-right: 10px;
      height: 32px;
      padding: 8px 15px;
      border-radius: 4px;
    }
    .el-dialog__body,
    .el-dialog__footer {
      background: #fff;
    }
    .el-form-item__label {
      color: #333;
    }
    .desc {
      background: rgba(242, 242, 242, 1);
      margin-top: 10px;
      padding: 10px 0;
      .recommend {
        margin-left: 10px;
      }
      .mt10 {
        margin-top: 10px;
      }
      .color808080 {
        color: #808080;
      }
      .colorFF0000 {
        color: #ff0000;
        padding: 0 20px;
      }
      .editable {
        min-width: 320px;
        margin-right: 20px;
        min-height: 300px;
        background: #fff;
        color: #333;
        outline: 1px solid #d9d9d9;
        img {
          max-width: 60px !important;
        }
        .w-e-toolbar {
          display: none;
        }
        .w-e-text-container {
          border: none !important;
        }
      }
      .editable[contenteditable]:empty:before {
        content: ' 截图后按住ctrl+V可以直接粘贴哦~，证明截图必填';
        color: #d9d9d9;
      }

      .picture-list {
        display: block;
        .picture-item {
          float: left;
          width: 60px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          margin: 4px;
          img {
            width: 100%;
            height: 100%;
          }
          .tools {
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              opacity: 1;
            }
            .icon-item {
              color: #fff;
              font-size: 16px;
              margin-left: 6px;
              cursor: pointer;
              &:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
  .imgPreview {
    .el-dialog__body {
      background: none;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80%;
    }
    .el-dialog--full {
      background: rgba(0, 0, 0, 0.5);
    }
    .el-dialog__header {
      height: 60px;
      border-bottom: none;
    }
    .el-dialog__close {
      color: #fff;
    }
    img {
      max-width: 100%;
    }
  }
}
</style>
