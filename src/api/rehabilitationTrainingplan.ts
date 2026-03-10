import Http from "@/utils/http/http";

const rehabilitationTrainingplanApi = {
    getList(data?: object) {
        return Http.get('/v1/visit/log/apiList', data)
    },
    addToList(data?: object) {
        return Http.post('/v1/visit/log/apiDetails', data)
    },
    updateToList(data?:object){
        return Http.post('/v1/visit/log/apiDetails', data)
    },
    delList(data?: object) {
        return Http.get('/v1/visit/log/apiDaySubmit', data)
    }
}
export default rehabilitationTrainingplanApi

