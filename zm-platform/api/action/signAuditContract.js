import fetch from "../../../src/utils/fetch";

export default function signAuditContract(options = {}) {
  return new Promise((resolve, reject) => {
    fetch({
      url: "/api/sign/auditContract",
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
