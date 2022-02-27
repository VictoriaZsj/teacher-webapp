<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="进入回收站条件：">
        <span>{{recycleCondition}}</span>
      </el-form-item>

      <el-form-item label="自动释放时间：">
        <el-row >
          <el-col :span="16">
            <el-input v-model="form.recycleReleaseDay" placeholder="请输入"></el-input>
          </el-col>
          <el-col :span="4" :offset="1">
            天
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="是否生效：">
        <el-select v-model="form.disabled" placeholder="请选择">
          <el-option label="是" value='1'></el-option>
          <el-option label="否" value='0'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="handleCancle">取消</el-button>
    </div>
  </div>
</template>

<script>
  import setReleaseConfig from '../../api/action/setReleaseConfig'
  export default {
    data() {
      return {
        recycleCondition: '',
        form: {
          id: '',
          recycleReleaseDay: '',
          disabled: ''
        }
      }
    },
    props: {
      recycleConfig: {
        type: Object,
        default: {}
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.recycleCondition = this.recycleConfig.recycleCondition
        this.form.id = this.recycleConfig.id
        this.form.recycleReleaseDay = this.recycleConfig.recycleReleaseDay
        this.form.disabled = this.recycleConfig.disabled === '否' ? '0' : '1'
      },
      handleConfirm() {
        setReleaseConfig(this.form)
          .then(message => {
            this.$Message({
              type: 'success',
              message
            }, this.$emit('confirm'))
          })
      },
      handleCancle() {
        this.$emit('cancle')
        this.handleReset()
      },
      handleReset() {
        this.form = {...this.form, recycleReleaseDay: '', disabled: '1'}
      }
    }
  }
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 22px;
  }
  .btn-group{
    text-align: right;
  }
</style>
