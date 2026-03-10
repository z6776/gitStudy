import Http from "@/utils/http/http";
import reportHttp from "@/utils/http/reportHttp";

const ElectrocarDiographicApi = {
    getPatientListEcg(data?: object) {
        return Http.post('/api/ecg/patient_list', data)
    },
    planListApi(data?: object) {
        return Http.post('/api/ecg/plan_list', data)
    },
    addPlan(data?: object) {
        return Http.post('/api/ecg/add', data)
    },
    delPlan(data?: object) {
        return Http.post('/api/ecg/del', data)
    },
    getrecord(data?: object){
          return Http.post('/api/ecg/record', data)
    },
    getPatientListBp(data?: object) {
        return Http.post('/api/bp/patient_list', data)
    },
    getrecordbp(data?: object) {
        return Http.post('/api/bp/record', data)
    },
    ecgStatus(data?: object) {
        return Http.post('/api/ecg/status', data)
    },
    warnStatus(data?: object) {
        return Http.post('/api/monitor/warn_status', data)
    },
    get_m9_ecg_wave(data?: object){
         return reportHttp.get('/hospital_show/api/report/get_m9_ecg_wave',data)
    }
}
export default ElectrocarDiographicApi