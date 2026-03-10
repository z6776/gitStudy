import Http from "@/utils/http/http";

const WarningApi = {
    getWarningList(data?: object) {
        return Http.get('/api/warn/list', data)
    },
   
}
export default WarningApi