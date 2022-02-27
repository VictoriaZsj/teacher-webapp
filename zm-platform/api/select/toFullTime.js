import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'


export const partTimeToFullTime = function (options) {
    return options
    // options = getVilidAttrWithEmpty(options);
    // return new Promise((resolve, reject) => {
    //     fetch({
    //       url: '/api/partTimeTeacherFlow/partTimeToFullTime',
    //       method: 'post',
    //       data: options
    //     }).then((result) => {
    //       const data = result.data;
    //       const code = result.code;
    //       const message = result.message;
    //       if (code == 0) {
    //         resolve(data);
    //       }
    //       else {
    //         reject(message);
    //       }
    //     })
    //     .catch((err) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         reject(err);
    //     });
    // });
}
// export const cascade = function (options) {
//     return new Promise((resolve, reject) => {
//         fetch({
//           url: '/api/teachers-mp/api/basicData/cascade',
//           method: 'post',
//           data: options
//         }).then((result) => {
//           const data = result.data;
//           const code = result.code;
//           const message = result.message;
//           if (code == 0) {
//             resolve(data);
//           }
//           else {
//             reject(message);
//           }
//         })
//         .catch((err) => {
//             if (err) {
//                 console.log(err);
//             }
//             reject(err);
//         });
//     });
// }