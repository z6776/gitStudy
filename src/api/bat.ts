import Http from "@/utils/http/http";

const BatApi = {
    getBatList(data?: object) {
        return Http.get('/api/hope/bat', data)
    },
    editBatStatus(data?: object) {
        return Http.post('/api/hope/bat_status', data)
    },
     checkpassword(data?: object) {
        return Http.post('/api/zone/logout', data)
    }
}
export default BatApi