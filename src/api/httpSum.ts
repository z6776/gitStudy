import Http from "@/utils/http/reportHttp";

const ReportApi = {
    // getReportDataList(data?: object) {
    //     return Http.get('/api/output/signDate', data)
    // },
    hrvInfo(data?: object) {
        return Http.get('/hospital_show/api/report/hrv_img', data,{
            responseType: 'arraybuffer'
        })
    },
    gettxt(data?: object) {
        return Http.get('/hospital_show/api/report/hrv_info', data)
    }
}
export default ReportApi