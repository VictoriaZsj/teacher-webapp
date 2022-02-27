import axios from "axios";
export default function getTeacherTypes (bu) {
    return new Promise((resolve, reject) => {
        axios({
            url:"/api/teachers-mp/api/PersonalInfo/getTeacherTypes?bu="+bu,
            method: 'get',
        }).then((result) => {
            const data = result.data.data;
            const code = result.data.code;
            const message = result.data.message;
            if (code == 0) {
                resolve(data);
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
