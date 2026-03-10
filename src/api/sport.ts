import Http from "@/utils/http/http";
import ReportHttp from "@/utils/http/reportHttp";

const SportApi = {
    sportDataList(data?: object) {
        return Http.post('/api/report/sport_list', data)
    },
    sportDataReport(data?: object) {
        return ReportHttp.get('/hospital_show/api/report/sport_report', data)
    },
    getSportZoneStatics(data?:object){
        return ReportHttp.get('/hospital_show/api/report/total_sport_report', data)
    },
     gettotal_diabetes_report(data?:object){
        return ReportHttp.get('/hospital_show/api/report/total_diabetes_report', data)
    }
 
}
export default SportApi