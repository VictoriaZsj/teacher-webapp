<template>
  <div class="full-time-container">
    <div class="import-container">
      <el-button class="import-span download-template" @click="downloadTemplate">下载导入模板</el-button>
      <el-upload
        :multiple="false"
        ref="uploadExcel"
        :data="uploadData"
        action="/api/teacher-web/api/teachers/register/upLoadTeacherInfo"
        :before-upload="beforeUploadFile"
        :on-change="onChangeFile"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :auto-upload="false"
        :file-list="fileList"
        :limit="limit"
        :on-success="handleSuccess">
        <el-button class="import-span" slot="trigger"> <img class="upload-icon" src="../../../src/images/upload_icon.png" alt=""> 选取文件</el-button>
        <el-button class="import-span import-confirm" :disabled="!isSubmit" @click="submitUpload">导入</el-button>
      </el-upload>
    </div>
    <div class="context-body">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="createdAt"
          label="时间"
          width="250"
          align="center">
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名称"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="导入状态"
          align="center">
          <template scope="scope">
            <span v-if="scope.row.status === 1">进行中</span>
            <span v-if="scope.row.status === 2">已完成</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalCount"
          label="共导入"
          align="center">
        </el-table-column>
        <el-table-column
          prop="successCount"
          label="导入成功"
          align="center">
        </el-table-column>
        <el-table-column
          prop="failCount"
          label="导入失败"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createdBy"
          label="操作人"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center">
          <template scope="scope">
            <el-button v-if="scope.row.failCount" @click="handleExportFailDetail(scope.row)" type="text" size="small">导入失败详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" v-bind:total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import getImportUnassaignList from '../../api/select/getImportUnassaignList'
  import getExportFailDetail from '../../api/select/getExportFailDetail'
  export default {
    data() {
      return {
        multiple: false,
        fileList: [],
        uploadData: {
          filename: ''
        },
        limit: 1,
        fileType: ['xlsx', 'xls'],
        limitSize: 10,
        tableData: [],
        pageNo: 1,
        pageSize: 10,
        total: 1
      }
    },
    computed: {
      isSubmit() {
        return this.fileList.length > 0
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
      },
      getTableData() {
        const options = {
          pageSize: this.pageSize,
          pageNo: this.pageNo
        }
        getImportUnassaignList(options)
          .then(res => {
            const { items, total } = res
            this.tableData = items
            this.total = total
          })
          .catch(error => {
            this.$Message.error(error)
          })
      },
      downloadTemplate() {
        if (!this.checkPermission('teacher-recruit:teacher-register:download')) {
          this.$Message({
            type: 'warning',
            message: '暂无下载导入模板权限'
          })
          return
        }
        const url = `/api/teacher-web/api/teachers/register/downLoadModelExcel`
        window.open(url, '_blank')
      },
      submitUpload() {
        if (!this.checkPermission('teacher-recruit:teacher-register:upload')) {
          this.$Message({
            type: 'warning',
            message: '暂无导入模板权限'
          })
          return
        }
        this.$refs.uploadExcel.submit()
      },
      handleSuccess(res, file, fileList) {
        const { code, message } = res
        if (code === '0') {
          this.$Message({
            type: 'success',
            message
          })
          this.getTableData()
          this.$refs.uploadExcel.clearFiles();
        }
      },
      onChangeFile(file, fileList) {
        this.fileList = fileList
      },
      beforeUploadFile(file) {
        const extension = file.name.substring(file.name.lastIndexOf('.')+1)
        const fileSize = file.size/1024/1024
        if (!this.fileType.includes(extension)) {
          this.$Message.error('上传文件只能是 xlsx或xls 格式!')
          this.fileList = []
          return false
        }
        if (fileSize > this.limitSize) {
          this.$Message.error(`上传文件大小不能超过${this.limitSize}MB!`)
        }
        this.uploadData.filename = file.name
      },
      handleExceed(files, fileList) {
      },
      handleRemove(files, fileList) {
        this.fileList = fileList
      },
      handleExportFailDetail(row) {
        const { id } = row
        const option = { id }
        getExportFailDetail(option)
          .then(res => {
            window.open(res, '_blank')
          })
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.pageNo = 1
        this.getTableData()
      },
      handleCurrentChange(currentPage) {
        this.pageNo = currentPage
        this.getTableData()
      },
    },
  }
</script>

<style lang="less" scoped>
  .import-container{
    width: 100%;
    padding: 20px 40px;
    background: #ffffff;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    flex-direction: row;
    .import-span{
      display: inline-block;
      padding: 8px 8px;
      border: 1px solid #787878;
      border-radius: 5px;
      margin-right: 10px;
      height: 34px;
      .upload-icon{
        width: 20px;
        height: 14px;
        display: inline-block;
      }
    }
    .import-confirm{
      padding: 8px 16px;
    }
    .download-template{
      margin-right: 50px;
    }
  }
</style>
