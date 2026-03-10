import Http from "@/utils/http/http";

const PatientjournalApi = {
    apiList(data?: object) {
        return Http.get('/v1/visit/log/apiList', data)
    },
    apiDetails(data?: object) {
        return Http.get('/v1/visit/log/apiDetails', data)
    },
    apiDaySubmit(data?: object) {
        return Http.get('/v1/visit/log/apiDaySubmit', data)
    },
}
export default PatientjournalApi

