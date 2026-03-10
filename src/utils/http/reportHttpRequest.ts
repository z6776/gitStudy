import axios from "axios";
import { ElMessage } from 'element-plus'


const service = axios.create({
    baseURL: import.meta.env.VITE_REPORT_API_URL,
    timeout:  60 * 1000
})
service.interceptors.request.use(function (config) {
    return config
})
service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log('err' + error);
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 3000
        })
         return Promise.reject({
                type: "error",
                response: error
            })
    }
)
export default service