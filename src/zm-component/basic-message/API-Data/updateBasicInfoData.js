export default function updateBasicInfoData (data,requirePermission) {
  if(isEmpty(data.email)){
    return '请填写讲师邮箱';
  }
  if(isEmpty(data.teaQq)){
    return '请填写讲师qq';
  }else if(data.teaQq.length > 300){
    return '讲师qq字数不可以大于300';
  }
  if(isEmpty(data.teaWeixin)){
    return '请填写讲师微信';
  }else if(data.teaWeixin.length > 300){
    return '讲师微信字数不可以大于300';
  }
  if(isEmpty(!requirePermission&&data.teaArea)){
    // return '请填写现居住地';
  }else if(data.teaArea.length > 300){
    return '现居住地字数不可以大于300';
  }
  // if(isEmpty(!requirePermission&&data.emergencyContactRelation)){
  //   return '请填写紧急联系人关系';
  // }else if(data.emergencyContactRelation.length > 300){
  //   return '紧急联系人字数不可以大于300';
  // }
  // if(isEmpty(!requirePermission&&data.emergencyContact)){
  //   return '请填写紧急联系人电话';
  // }
  if(data.emergencyContactRelation.length > 300){
      return '紧急联系人字数不可以大于300';
    }
  let regTel = /^\d{11}$/;
  if(!regTel.test(data.mobile)){
    return '联系电话格式填写有误';
  }
  let regMail = /@.+\./;
  if(!regMail.test(data.email)){
    return '讲师邮箱格式填写有误';
  }

  console.log('88',data.emergencyContactMobile)

  if(data.emergencyContactMobile&&!regTel.test(data.emergencyContactMobile)){
    return '紧急联系人电话格式填写有误';
  }
  return "";
}

function isEmpty(value){
  return (typeof value === 'undefined' || value === '' || value === null);
}
