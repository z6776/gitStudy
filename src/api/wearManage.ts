import Http from "@/utils/http/http";

const WearManage = {
    getApiList(data?: object) {
        return Http.get('/v1/visit/wear/apiList', data)
    },
    getApiNumber(data?: object) {
        return Http.get('/v1/visit/wear/apiNumber', data)
    },
}
export default WearManage