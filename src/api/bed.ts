import Http from "@/utils/http/http";

const BedApi = {
    getBedList(data?: object) {
        return Http.get('/api/bed/list', data)
    },
    editBed(data?: object) {
        return Http.post('/api/bed/manage', data)
    },
    deleteBed(data?: object) {
        return Http.post('/api/bed/del', data)
    },
    getBedControlBtnNum(data?: object) {
        return Http.post('/api/patient/statistics', data)
    },
   
}
export default BedApi