import Http from "@/utils/http/http";
const MonitoringOverviewApi = {
    // 心电监测计划
    monitor_plan_ecg(data?: object) {
        return Http.get('/api/patient/monitor_plan_ecg', data)
    },
    // 首患者监护信息：血压/体温/api/patient/monitor_bp_body
    monitor_bp_body(data?: object) {
        return Http.get('/api/patient/monitor_bp_body', data)
    },
    // 首患者监护信息：心率/血氧
    monitor_data(data?: object) {
        return Http.get('/api/patient/monitor_data', data)
    },
    // 首患者监护信息：血压监测计划
    monitor_plan_bp(data?: object) {
        return Http.get('/api/patient/monitor_plan_bp', data)
    },
    // 首患者监护信息：呼吸监测计划
    monitor_breath(data?: object) {
        return Http.get('/api/patient/monitor_breath', data)
    },
    // 患者基础信息
    monitor_msg(data?: object) {
        return Http.get('/api/patient/monitor_msg', data)
    }
}
export default MonitoringOverviewApi