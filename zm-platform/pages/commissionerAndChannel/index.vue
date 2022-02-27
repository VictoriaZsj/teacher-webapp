<template>
  <div class="commissioner-channel">
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="permissionList.indexOf('tea:commissionerChannel:bindChannel') !== -1" :label="`绑定渠道(${counts.countChannels || 0})`" name="bindChannel">
        <bindChannel @upStatistic="queryCommissionerChannelBindstatistic"></bindChannel>
      </el-tab-pane>
      <el-tab-pane v-if="permissionList.indexOf('tea:commissionerChannel:bindingTea') !== -1" :label="`绑定期间获得新讲师(${counts.countTeachers || 0})`" name="bindingTeacher">
        <bindingTea  @upStatistic="queryCommissionerChannelBindstatistic"></bindingTea>
      </el-tab-pane>
     
    </el-tabs>
     <el-button
          id='copyLinkId'
          class="copyLink-btn"
          type="normal"
          size="small"
          @click="hanldeCopyLink"
          
          >复制我的邀请绑定链接</el-button>
  </div>
</template>
<script>
import bindChannel from './bindChannel';
import bindingTea from './bindingTea';
import { commissionerChannelBindstatistic,copyLink } from 'api/commissionerAndChannel';
import Vue from 'vue'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
export default {
  components: {bindChannel, bindingTea},
  data() {
    return {
      activeName: 'bindChannel',
      counts: {
        countChannels: '',
        countCommissioners: '',
        countTeachers: '',
      },
    };
  },
  methods: {
    hanldeCopyLink(){
      let _copyText=''
      copyLink().then((res)=>{
        console.log(res)
        let {data,code,msgCode,msgContent}=res.data;
         console.log(data)
        if (code === 200 && msgCode === '200') {
          _copyText = data || '';
         this.$copyText(_copyText).then(
		        res2 => {
		          console.log(res2)
		          this.$message.success("已成功复制，可直接去粘贴");
		        },
		        err => {
		          // this.$toast("复制失败");
		        }
		      )
      //     console.log(_copyText)
      //     let tmpInput = document.createElement("input");   // 构建临时input
      //     tmpInput.value = _copyText || '';  // 设置内容
      // 　　document.body.appendChild(tmpInput);    // 添加临时实例
      //     tmpInput.select();   // 选择实例内容
      // 　　document.execCommand("Copy");   // 执行复制
      // 　　document.body.removeChild(tmpInput); // 删除临时实例
        }else{
          this.$message.warning(msgContent)
        }
      }).catch(err => {
        this.$message.error(err);
      })
        
    },
    queryCommissionerChannelBindstatistic() {
      commissionerChannelBindstatistic().then(({data}) => {
        if (data.code === 200 && data.msgCode === '200') {
          this.counts = data.data || {};
        } else {
          this.$message.warning(data.msgContent || '获取绑定渠道和期间新讲师数量异常');
        }
      }).catch(err => {
        this.$message.error(`获取绑定渠道和期间新讲师数量异常：${err}`);
      })
    },
  },
  computed: {
    permissionList: function () {
      return this.$store.getters.permissionList || [];
    }
  },
  mounted() {
    this.queryCommissionerChannelBindstatistic();
  },
};
</script>
<style lang="scss">
  .commissioner-channel {
    background: #fff;
    padding: 10px 16px;
    .el-tab-pane{
      padding: 10px 0;
      height: calc(100vh - 146px);
      overflow-y: auto;
    }
    .copyLink-btn{
      position:absolute;right: 153px;
    top: 25px;
    width: 180px;
    cursor:pointer
    }
  }
</style>
