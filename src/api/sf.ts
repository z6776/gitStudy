import Http from "@/utils/http/http";

const sfApi = {
    // getReportDataList(data?: object) {
    //     return Http.get('/api/output/signDate', data)
    // },
    apiList(data?: object) {
        return Http.get('/v1/visit/sf/apiList', data)
    },
    apiDetails(data?: object) {
        return Http.get('/v1/visit/sf/apiDetails', data)
    },
    active_apiList(data?: object) {
        return Http.get('/v1/visit/active/apiList', data)
    },
    apiPatientList(data?: object) {
        return Http.get('/v1/visit/active/apiPatientList', data)
    },
    active_apiDetails(data?: object) {
        return Http.get('/v1/visit/active/apiDetails', data)
    },
    apiUpdate(data?: object) {
        return Http.post('/v1/visit/active/apiUpdate', data)
    },
    apiAdd(data?: object) {
        return Http.post('/v1/visit/active/apiAdd', data)
    },
    getWearList(data?: object) {
        return Http.get('/v1/visit/active/wearDetails', data)
    },
    getWarningList(data?: object) {
        return Http.get('/v1/visit/active/warnDataList', data)
    },
    getVisiCount(data?: object) {
        return Http.get('/v1/visit/active/visitCount', data)
    },
    getVisitList(data?: object) {
        return Http.get('/v1/visit/active/visitList', data)
    },

}
export default sfApi