<template>
  <el-dialog
    v-model="visible"
    title="新增绑定"
    class="commissioner-channel-add"
  >
    <el-form :model="bindData" :rules="bindRules" ref="commissionerChannelForm" inline-message>
      <el-form-item label="专员" prop="commissionerId">
        <el-select
          v-model="bindData.commissionerId"
          filterable
          remote
          placeholder="请输入专员姓名/手机号并选择"
          :remote-method="commissioner.remote"
          :loading="commissioner.loading"
        >
          <el-option
            v-for="(item, index) in commissioner.options"
            :key="index"
            :label="`${item.recruitCommissionerName}/${item.recruitCommissionerMobile || ''}`"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道" prop="channelId">
        <el-select
          v-model="bindData.channelId"
          filterable
          remote
          placeholder="请输入渠道名称/ID/手机号并选择"
          :remote-method="channel.remote"
          :loading="channel.loading"
        >
          <el-option
            v-for="(item, index) in channel.options"
            :key="index"
            :disabled="item.channelBindState === 'BIND'"
            :label="`${item.channelName}/${item.channelMobile || ''}${item.channelBindState === 'BIND' ? '(已被绑定)':''}`"
            :value="item.channelId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { getCommissionerOrChannel, bindCommissionerChannel } from 'api/commissionerAndChannel';

export default {
  data() {
    return {
      visible: false,
      bindData: {
        commissionerId: '',
        channelId: '',
      },
      bindRules: {
        commissionerId: [
          { required: true, message: '请选择专员', trigger: "blur" }
        ],
        channelId: [
          { required: true, message: '请选择渠道', trigger: "blur" }
        ]
      },
      commissioner: {
        options: [],
        loading: false,
        remote: (str) => {
          if (!str) return;
          this.commissioner.loading = true;
          this.commissioner.options = [];
          getCommissionerOrChannel({
            commissionerKeyword: str,
            pageNo: 1,
            pageSize: 100,
          }).then(({data}) => {
            const {code, msgCode } = data;
            if (code !== 200 && msgCode !== '200') {
              this.$message.warning(data.msgContent || '查询专员失败')
            } else {
              this.commissioner.options = data.data.list || [];
            }
            this.commissioner.loading = false;
          })
        },
      },
      channel: {
        options: [],
        loading: false,
        remote: (str) => {
          if (!str) return;
          this.channel.loading = true;
          this.channel.options = [];
          getCommissionerOrChannel({
            channelKeyword: str,
            pageNo: 1,
            pageSize: 100,
          }).then(({data}) => {
            const {code, msgCode } = data;
            if (code !== 200 && msgCode !== '200') {
              this.$message.warning(data.msgContent || '查询专员失败')
            } else {
              this.channel.options = data.data.list || [];
            }
            this.channel.loading = false;
          })
        },
      }
    }
  },
  methods: {
    init() {
      this.$refs.commissionerChannelForm && this.$refs.commissionerChannelForm.clearValidate();
      this.resetBindData();
      this.visible = true;
    },
    resetBindData() {
      this.bindData = {
        commissionerId: '',
        channelId: '',
      }
      this.commissioner.options = [];
      this.channel.options = [];
    },
    handleSubmit(){
      this.$refs.commissionerChannelForm.validate((valid) => {
        if (!valid) return;
        bindCommissionerChannel(this.bindData).then(({data}) => {
          if (data.code === 200 && data.msgCode === '200') {
            this.$message.success('新增绑定成功')
            this.$emit('upPageList');
          } else {
            this.$message.warning(data.msgContent || '绑定失败')
          }
        }).catch(err => {
          this.$message.error(err.msgContent || '绑定失败')
        });
        this.visible = false;
      })
    },
  },
}
</script>
<style lang="scss">
.commissioner-channel-add {
  .el-select{
    width: 250px;
  }
  .el-form-item {
    margin-bottom: 22px;
  }
  .el-dialog__body, .el-dialog__footer {
    background: #fff;
  }
}
</style>
