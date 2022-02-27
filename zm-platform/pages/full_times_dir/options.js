const econtractStateOption = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '合同待发送',
    value: '1'
  },
  {
    label: '合同已发未签',
    value: '3'
  },
  {
    label: '合同签署成功',
    value: '4'
  },
  {
    label: '合同签署失败',
    value: '5'
  },
  {
    label: '合同待审核',
    value: '6'
  },
  {
    label: '合同审核不通过',
    value: '7'
  }
]

const contractTypeOption = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '线下合同',
    value: '1'
  },
  {
    label: '电子合同',
    value: '2'
  }
]

export { econtractStateOption, contractTypeOption }
