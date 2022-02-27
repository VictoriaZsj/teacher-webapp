import fetch from "../../../src/utils/fetch";

export default function signTeacherSignList(options = {}) {
  return new Promise((resolve, reject) => {
    fetch({
      url: "/api/sign/multiSign",
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
