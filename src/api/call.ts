import Http from "@/utils/http/http";

const CallApi = {
    getCallList(data?: object) {
        return Http.get('/api/sos/list', data)
    },
    processingCall(data?: object) {
        return Http.post('/api/sos/deal', data)
    },
    processingCallLog(data?: object) {
        return Http.get('/api/sos/log', data)
    },
    getNoticeList(data?: object) {
        return Http.get('/api/zone/get_notice', data)
    },
    setNoticeList(data?: object) {
        return Http.post('/api/zone/set_notice', data)
    },
}
export default CallApi