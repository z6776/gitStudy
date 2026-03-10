import axios from "axios";
import { getCookie, removeCookie } from "../cookie/cookie";
import router from "@/router";
import { ElMessage } from 'element-plus'
import { type AxiosResponse } from "axios";
import type { ApiResponse } from "@/interface/interface";
import Cookies from 'js-cookie'


export const autoStore = {
    isTokenExpired: false
}
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 60 * 1000
});
service.interceptors.request.use(function (config) {
    if(autoStore.isTokenExpired){
        return Promise.reject('token过期')
    }
    const token = getCookie('token');
    token && (config.headers.Token = token)
    return config
})
service.interceptors.response.use((response:AxiosResponse) => {
        const res:ApiResponse = response.data;
        if (res.status == '200'){
            return response
        } else {
            if (res.status == '201' && res.message.indexOf('无效token') > -1) {
                removeCookie('token')
                removeCookie('admin')
                console.log(autoStore.isTokenExpired,'autoStore.isTokenExpiredautoStore.isTokenExpired');
                if(autoStore.isTokenExpired)return Promise.reject('token过期');
                ElMessage({
                    message: '登录过期,请重新登录！',
                    type: 'error',
                    duration: 3000
                })
                localStorage.removeItem('token')
                Cookies.remove('token')
                 router.push('/login')
                 autoStore.isTokenExpired = true;
                 
            }else {
                ElMessage({
                    message: res.message,
                    type: 'error',
                    duration: 3000
                })
            }
            return Promise.reject({
                type: "error",
                response: res
            })
        }

    },
    error => {
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 3000
        });
         return Promise.reject({
                type: "error",
                response: error
            })
    }
)
export default service