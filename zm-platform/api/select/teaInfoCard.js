import fetch from "../../../src/utils/fetch";

export  function getTeaLevelWithSalary (option) {
  let parm = {
    "$ZM_BU": option.bu,
    "$TEACHER_ORIGIN":option.TEACHER_ORIGIN,
    teaId:option.teaId
  }
  return new Promise((resolve, reject) => {
    fetch({
      url:"/api/cascade/dict/queryTeacherLevelWithSalary",
      method: 'post',
      data:parm,
    }).then((result) => {
      const data = result.data;
      const code = result.code;
      const message = result.message;
      if (code == 0) {
        resolve(data);
      } else {
        reject(message || '获取学段字典失败');
      }
    })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
        reject(err || '获取学段字典失败');
      });
  });
}
