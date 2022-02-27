import { contractTypeOption } from './options'
import {
  newRegularControllerGetEcontractInfo,
  newRegularControllerDownEcontract,
  newTryOutControllerGetEcontractInfo,
  getTobeEcontract,
  newTryOutControllerDownEcontract
} from '../../api/select/electronicContract'

export default {
  data() {
    return {
      contractTypeOption,
      newRegularControllerGetEcontractInfo,
      newRegularControllerDownEcontract,
      newTryOutControllerGetEcontractInfo,
      getTobeEcontract,
      newTryOutControllerDownEcontract,
      electronicContractDetails: {},
      electronicContractDialog: false,
      selectTeachers: []
    }
  },
  filters: {
    contractTypeFilter(value) {
      if (!value) return ''
      if (value === 1) return '线下合同'
      if (value === 2) return '电子合同'
      return ''
    }
  },
  methods: {
    // 预览电子合同
    handlePreviewElectronicContract(teaId, axios, edit, getTobeEcontract) {
      this.pactTeaId = '';
      this.iframePageUrl = '';
      if (!teaId) return
      this.pactTeaId = teaId;
      this.multiResignEcontractStatus = edit?true:false;
      this.electronicContractDetails = [];
      if(this.multiResignEcontractStatus) {
        getTobeEcontract({teaId}).then(({ code, data }) => {
          if (code === '0') {
            this.electronicContractDetails = {econtractList: [data]};
            if(this.electronicContractDetails.econtractList.length) {
              this.iframePageUrl = this.electronicContractDetails.econtractList[0].contractUrl ||
              this.electronicContractDetails.econtractList[0].pageUrl ||
              this.electronicContractDetails.econtractList[0].url;
            }
            this.electronicContractDialog = true
            this.ruleForm.result = '';
          }
        })
      } else {
        axios({ teaId }).then(({ code, data }) => {
          if (code === '0') {
            if(data.econtractList.length) {
              data.econtractList.forEach(r=>{
                if(r.contractUrl.substring(0,5)=='http:') {
                  // r.contractUrl = r.contractUrl.replace('http','https');
                  r.contractUrl = `https${r.contractUrl.substring(4,r.contractUrl.length)}`;
                }
              })
              this.iframePageUrl = data.econtractList[0].contractUrl ||
              data.econtractList[0].pageUrl ||
              data.econtractList[0].url;
            }
            this.electronicContractDetails = data
            this.electronicContractDialog = true
            // this.ruleForm.result = '';
          }
        })
      }
    },

    // 批量下载电子合同
    downloadElectronicContract(download) {
      if (this.selectName.length == 0) {
        this.$Message({
          message: '请选择老师'
        })
        return
      }

      // 判断老师合同类型均为电子合同
      if (
        !this.selectTeachers.every(({ contractType }) => contractType === 2)
      ) {
        this.$Message({
          message: '请选择合同类型为电子合同的老师'
        })
        return
      }

      // 确认下载
      this.$MessageBox
        .confirm(`确定需要下载吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const teaIds = this.selectName && this.selectName.join(',')
          download({ teaIds })
        })
    }
  }
}
