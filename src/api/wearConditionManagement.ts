import Http from "@/utils/http/http";

const WearConditionManagement = {
    apiList(data?: object) {
        return Http.get('/v1/visit/group/apiList', data)
    },
    ignore(data?: object) {
        return Http.post('/v1/visit/group/ignore', data)
    },
    groupEnd(data?: object) {
        return Http.post('/v1/visit/group/groupEnd', data)
    },
}
export default WearConditionManagement