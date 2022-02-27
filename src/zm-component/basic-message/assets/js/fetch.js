import axios from 'axios';
const config = require('@config');
const baseUrl = !!process.env  ? config.dev.proxypath : config.build.proxypath;

export default function fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            // timeout: 2000,
            // headers: { 'X-Ivanka-Token': store.getters.token }
            withCredentials: true,
            headers: {
                // 'Content-Type':'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        instance(options)
            .then(response => {
                const res = response.data;
                if(res.code==11) {
                    window.location.href=baseUrl+"/login?redirectUrl="+encodeURIComponent(location.href);
                    return;
                }else if(res.code==1){
                  reject(res.message);
                }else{
                  resolve(res);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
