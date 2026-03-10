import Http from "@/utils/http/http";

const HeaderApi = {
    getNoticeNum(data?: object) {
        return Http.get('/api/zone/notice', data)
    },
   
}
export default HeaderApi