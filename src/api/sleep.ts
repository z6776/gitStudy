import Http from "@/utils/http/http";
import ReportHttp from "@/utils/http/reportHttp";

const SleepApi = {
    sleepDataList(data?: object) {
        return Http.post('/api/report/sleep_list', data)
    },
    sleepDataReport(data?: object) {
        return ReportHttp.get('/hospital_show/api/report/sleep_report', data)
    },
    // 
    reportHrvImg(data?: object) {
        return ReportHttp.get('/hospital_show/api/report/hrv_img', data,{
            responseType:"arraybuffer"
        })
    },
    reporthrv_info(data?: object){
            return ReportHttp.get("/hospital_show/api/report/hrv_info",data);
    }
}
export default SleepApi