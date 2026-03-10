import Http from "@/utils/http/http";

const ReportApi = {
    // getReportDataList(data?: object) {
    //     return Http.get('/api/output/signDate', data)
    // },
    printReportData(data?: object) {
        return Http.get('/api/output/signDateReport', data)
    },
    editDataList(data?: object) {
        return Http.get('/api/output/signDateEdit', data)
    },
    editData(data?: object) {
        return Http.post('/api/output/reportEdit', data)
    },
     timeListMerge(data?: object) {
        return Http.get('/api/output/timeListMerge', data)
    },
     reportMsg(data?: object) {
        return Http.get('/api/output/reportMsg', data)
    },
    reportBp(data?: object) {
        return Http.get('/api/output/reportBp', data)
    },
    reportEvent(data?: object) {
        return Http.get('/api/output/reportEvent', data)
    },
    reportX(data?: object) {
        return Http.get('/api/output/reportXt', data)
    }
}
export default ReportApi