import Http from "@/utils/http/http";

const reportPrintingManagementApi = {
    // 监测报告：列表
    getPlanBpList(data?: object) {
        return Http.get('/api/monitor/report_list', data)
    },
     // 监测报告：报告
    signDateReport(data?: object) {
        return Http.get('/api/monitor/signDateReport', data)
    }

}

export default reportPrintingManagementApi;