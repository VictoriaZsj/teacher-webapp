import fetch from "../../../src/utils/fetch";

export default function signTeacherSignList(options = {}) {
  for (let key in options) if (!options[key] && options[key] !== 0 && options[key] !== false) delete options[key];
  return new Promise((resolve, reject) => {
    fetch({
      url: "/api/sign/validateReturnSatisfyTeachers",
      method: "post",
      data: options,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
        reject(err);
      });
  });
}
