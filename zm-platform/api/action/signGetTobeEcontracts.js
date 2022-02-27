import fetch from "../../../src/utils/fetch";

export default function signGetTobeEcontracts(options = {}) {
  return new Promise((resolve, reject) => {
    fetch({
      url: "/api/sign/getTobeEcontracts?teaId="+options.teaId,
      method: "get",
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
