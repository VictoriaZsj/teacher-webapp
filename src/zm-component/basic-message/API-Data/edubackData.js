export default function edubackData (data) {
  if(!data.ceeCity){
    data.ceeCity = "";
  }
  if(!data.ceeProvince){
    data.ceeProvince = "";
  }
  if(!data.ceeSubjectFirst){
    data.ceeSubjectFirst = "";
  }
  if(!data.ceeSubjectFirstScore){
    data.ceeSubjectFirstScore = "";
  }
  if(!data.ceeSubjectFirstTotalScore){
    data.ceeSubjectFirstTotalScore = "";
  }
  if(!data.ceeSubjectSecond){
    data.ceeSubjectSecond = "";
  }
  if(!data.ceeSubjectSecondScore){
    data.ceeSubjectSecondScore = "";
  }
  if(!data.ceeSubjectSecondTotalScore){
    data.ceeSubjectSecondTotalScore = "";
  }
  if(!data.ceeSubjectThird){
    data.ceeSubjectThird = "";
  }
  if(!data.ceeSubjectThirdScore){
    data.ceeSubjectThirdScore = "";
  }
  if(!data.ceeSubjectThirdTotalScore){
    data.ceeSubjectThirdTotalScore = "";
  }
  if(isEmpty(data.educatList) || data.educatList.length == 0){
    data.educatList = []
  }
  if(!data.enableAppointSubject){
    data.enableAppointSubject = "";
  }
  if(!data.enableAppointSubjectCode){
    data.enableAppointSubjectCode = [];
  }else if(typeof(data.enableAppointSubjectCode) == "string"){
    let _data = data.enableAppointSubjectCode.split(',');
    data.enableAppointSubjectCode = [];
    for(let i = 0; i < _data.length; i++){
      if(!!_data[i]){
        data.enableAppointSubjectCode.push(_data[i])
      }
    }
  }

  if(!data.id){
    data.id = "";
  }
  if(!data.name){
    data.name = "";
  }
  if(!data.teaBu){
    data.teaBu = "";
  }
  if(!data.teaGoodFirst){
    data.teaGoodFirst = "";
  }
  if(!data.teaGoodFirstCode){
    data.teaGoodFirstCode = "";
  }
  if(!data.teaGoodFirstScore){
    data.teaGoodFirstScore = "";
  }
  if(!data.teaGoodSecond){
    data.teaGoodSecond = "";
  }

  if(data.courseTypes){
    data.classType = data.courseTypes.toString().split(',');
  } else {
    data.classType = []
  }

  if(!data.teaGoodSecondCode){
    data.teaGoodSecondCode = "";
  }
  if(!data.teaGoodSecondScore){
    data.teaGoodSecondScore = "";
  }
  if(!data.teaGoodThird){
    data.teaGoodThird = "";
  }
  if(!data.teaGoodThirdScore){
    data.teaGoodThirdScore = "";
  }
  if(!data.teaId){
    data.teaId = "";
  }
  if(!data.teaRegion){
    data.teaRegion = "";
  }
  if(!data.teacherCertificate){
    data.teacherCertificate = "";
  }
  if(!data.teaSchoolBen){
    data.teaSchoolBen = "";
  }
  if(!data.teaSchoolGao){
    data.teaSchoolGao = "";
  }
  if(!data.teaTaughtStuGrade){
    data.teaTaughtStuGrade = "";
  }
  if(!data.teaTaughtStuGradeCode){
    data.teaTaughtStuGradeCode = [];
  }else{
    let _teaTaughtStuGradeCode = [];
    let _teaTaughtStuGradeCodeList = data.teaTaughtStuGradeCode.split(',');
    for(let i = 0; i < _teaTaughtStuGradeCodeList.length; i++){
      if(!!_teaTaughtStuGradeCodeList[i] && _teaTaughtStuGradeCodeList[i] != "null"){
        _teaTaughtStuGradeCode.push(_teaTaughtStuGradeCodeList[i])
      }
    }
    data.teaTaughtStuGradeCode = _teaTaughtStuGradeCode;
  }
  if(!data.teaWenli){
    data.teaWenli = "";
  }
  if(!data.teachingExperience){
    data.teachingExperience = "";
  }
  if(!data.teaTaughtStuLevel){
    data.teaTaughtStuLevel = [];
  }else if(typeof(data.teaTaughtStuLevel) == "string"){
    let _data = data.teaTaughtStuLevel.split(',');
    data.teaTaughtStuLevel = [];
    for(let i = 0; i < _data.length; i++){
      if(!!_data[i]){
        data.teaTaughtStuLevel.push(_data[i])
      }
    }
  }

  if(!data.majorTeacher){
    data.majorTeacher = "";
  }
  if(!data.abrsm){
    data.abrsm = "";
  }
  if(data.hasOwnProperty('idCardListFace')){
    if(!data.idCardListFace){
      data.idCardListFace = "";
      data._idCardListFace = "";
    }else{
      data._idCardListFace = data.idCardListFace;
    }
  }
  if(data.hasOwnProperty('idCardListSide')){
    if(!data.idCardListSide){
      data.idCardListSide = "";
      data._idCardListSide = "";
    }else{
      data._idCardListSide = data.idCardListSide;
    }
  }

  if(data.hasOwnProperty('musicType')){
    data.musicType = "" + data.musicType;
  }
  if(data.hasOwnProperty('pianoLevel')){
    data.pianoLevel = "" + data.pianoLevel;
  }
  if(!!data.musical){
    if(typeof data.musical == "string"){
      data.musical = data.musical.split(',');
    }
  }else{
    data.musical = [];
  }
  return data;
}



function isEmpty(value){
  return (typeof value === 'undefined' || (value+'') == '' || value === null);
}
