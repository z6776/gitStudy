import Http from "@/utils/http/http";
import ReportHttp from "@/utils/http/reportHttp";

const SportApi = {
    sportDataList(data?: object) {
        return Http.post('/v1/report/sport_list', data)
    },
    sportDataReport(data?: object) {
        return ReportHttp.get('/hospital_show/api/report/sport_report', data)
    },
    getSportZoneStatics(data?:object){
        return ReportHttp.get('/hospital_show/api/report/total_sport_report', data)
    },
    getdiabetes_report(data?:object){
        return ReportHttp.get('/hospital_show/api/report/diabetes_report', data)
    }
}
export default SportApi