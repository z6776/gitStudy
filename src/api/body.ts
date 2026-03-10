import Http from "@/utils/http/http";

const BodyApi = {
    // 标准触屏版
    // getBodyList(data?: object) {
    //     return Http.get('/api/patient_data/list', data)
    // },
    // getPdDate(data?: object) {
    //     return Http.post('/api/hope/time', data)
    // },
    // getDataStatics(data?: object) {
    //     return Http.get('api/output/report', data)
    // },
    // 科研平台
    getBodyList(data?: object) {
        return Http.get('/v1/patient_data/list', data)
    },
    getPdDate(data?: object) {
        return Http.post('/v1/hope/time', data)
    },
    getDataStatics(data?: object) {
        return Http.get('v1/output/report', data)
    },
    getDataStaticsH5(data?: object) {
        return Http.get('v1/output/reportH5', data)
    },
}
export default BodyApi