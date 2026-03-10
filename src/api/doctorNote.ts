import Http from "@/utils/http/http";

const DoctorNoteApi = {
    getDoctorNoteList(data?: object) {
        return Http.get('/v1/visit/remind/apiList', data)
    },
    getPatient(data?: object) {
        return Http.get('/v1/visit/remind/getPatient', data)
    },
    postPatientadd(data?: object) {
        return Http.post('/v1/visit/remind/apiAdd', data)
    }
}
export default DoctorNoteApi

