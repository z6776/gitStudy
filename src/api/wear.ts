import Http from "@/utils/http/http";

const WearApi = {
    getWearList(data?: object) {
        return Http.get('/api/wear/list', data)
    },
}
export default WearApi