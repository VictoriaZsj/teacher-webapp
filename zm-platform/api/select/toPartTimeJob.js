import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'

/**
 *
 方法说明 全职转兼职
 *
 @method agentActivityList
 *
 @param  {Object} options 请求参数
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 *
 @param {转正管理中的全职转兼职的接口}
 */
// /api/newRegularController/getLeaveTeacherStudentInfo /待定/

// /api/newRegularController/applyFulltimeToPartime
// /api/newRegularController/getTeaStudentByTeaId
// /api/newRegularController/getTextVersion
// /api/newRegularController/getStuCourses
export const newRapplyFulltimeToPartime = function (options) {
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newRegularController/applyFulltimeToPartime',
          method: 'post',
          data: options
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            resolve(data);
          }
          else {
            reject(message);
          }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}
export const newRgetTeaStudentByTeaId = function (options) {
  if(window.isEmpty(options.teaId)){
      return Promise.reject('请选择教师');
  }
  options = getVilidAttrWithEmpty(options);
  return new Promise((resolve, reject) => {
      fetch({
          url:'/api/newRegularController/getTeaStudentByTeaId',
          method: 'get',
          params:options,
      }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
              if(!!data){
                  resolve(data);
              }else{
                  reject("数据不存在");
              }
          } else {
              reject(message);
          }
      })
      .catch((err) => {
          if (err) {
              console.log(err);
          }
          reject(err);
      });
  });
}
export const newRgetTextVersion = function (options) {
    if(window.isEmpty(options.bu)){
        return Promise.reject('请传递教师BU');
    }
    if(window.isEmpty(options.grade)){
        return Promise.reject('请传递年级');
    }
    if(window.isEmpty(options.subject)){
        return Promise.reject('请传递科目');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newRegularController/getTextVersion',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
            } else {
                reject(message);
            }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}
export const newRgetStudentCourses = function (options) {
    if(window.isEmpty(options.studentId)){
        return Promise.reject('请选择学生');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newRegularController/getStuCourses',
            method: 'post',
            data: options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
            } else {
                reject(message);
            }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}

/*
 @param {试用期管理中的全职转兼职的接口}
*/
// /api/newTryOutController/applyFulltimeToPartime
// /api/newTryOutController/getTeaStudentByTeaId
// /api/newTryOutController/getTextVersion
// /api/newTryOutController/getStuCourses

// /api/newTryOutController/getLeaveTeacherStudentInfo //

export const newTapplyFulltimeToPartime = function (options) {
  options = getVilidAttrWithEmpty(options);
  return new Promise((resolve, reject) => {
      fetch({
        url: '/api/newTryOutController/applyFulltimeToPartime',
        method: 'post',
        data: options
      }).then((result) => {
        const data = result.data;
        const code = result.code;
        const message = result.message;
        if (code == 0) {
          resolve(data);
        }
        else {
          reject(message);
        }
      })
      .catch((err) => {
          if (err) {
              console.log(err);
          }
          reject(err);
      });
  });
}
export const newTgetTeaStudentByTeaId = function (options) {
if(window.isEmpty(options.teaId)){
    return Promise.reject('请选择教师');
}
options = getVilidAttrWithEmpty(options);
return new Promise((resolve, reject) => {
    fetch({
        url:'/api/newTryOutController/getTeaStudentByTeaId',
        method: 'get',
        params:options,
    }).then((result) => {
        const data = result.data;
        const code = result.code;
        const message = result.message;
        if (code == 0) {
            if(!!data){
                resolve(data);
            }else{
                reject("数据不存在");
            }
        } else {
            reject(message);
        }
    })
    .catch((err) => {
        if (err) {
            console.log(err);
        }
        reject(err);
    });
});
}
export const newTgetTextVersion = function (options) {
  if(window.isEmpty(options.bu)){
      return Promise.reject('请传递教师BU');
  }
  if(window.isEmpty(options.grade)){
      return Promise.reject('请传递年级');
  }
  if(window.isEmpty(options.subject)){
      return Promise.reject('请传递科目');
  }
  options = getVilidAttrWithEmpty(options);
  return new Promise((resolve, reject) => {
      fetch({
          url:'/api/newTryOutController/getTextVersion',
          method: 'post',
          data:options,
      }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
              if(!!data){
                  resolve(data);
              }else{
                  reject("数据不存在");
              }
          } else {
              reject(message);
          }
      })
      .catch((err) => {
          if (err) {
              console.log(err);
          }
          reject(err);
      });
  });
}
export const newTgetStudentCourses = function (options) {
    if(window.isEmpty(options.studentId)){
        return Promise.reject('请选择学生');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newTryOutController/getStuCourses',
            method: 'post',
            data: options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
            } else {
                reject(message);
            }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}

/**
 * @description 直接设置成不交接
 * 
 * 离职管理-设置学生不需要交接操作接口
 */

export const newLsetStuNotHander = function (options) {
  if(window.isEmpty(options.stuId)){
      return Promise.reject('stuId不能为空');
  }
  if(window.isEmpty(options.teaId)){
      return Promise.reject('teaId不能为空');
  }
  return new Promise((resolve, reject) => {
      fetch({
          url:'/api/newLeave/setStuNotHander',
          method: 'post',
          data: options,
      }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            //   if(!!data){
                  resolve(data);
            //   }else{
            //       reject("数据不存在");
            //   }
          } else {
              reject(message);
          }
      })
      .catch((err) => {
          if (err) {
              console.log(err);
          }
          reject(err);
      });
  });
}