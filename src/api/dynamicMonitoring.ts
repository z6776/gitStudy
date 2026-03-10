import Http from "@/utils/http/http";

const dynamicMonitoringApi = {
    // 计划列表：血压
    getPlanBpList(data?: object) {
        return Http.get('/api/monitor/list_plan_bp', data)
    },
    // 监测计划(tid)-开启
    startTid(data?: object) {
        return Http.post('/api/monitor/start_tid', data)
    },
    // 监测计划(tid)-关闭
    endTid(data?: object) {
        return Http.post('/api/monitor/end_tid', data)
    },
    // 监测计划(tid)-编辑
    editTid(data?: object) {
        return Http.post('/api/monitor/edit_tid', data)
    },
    // 监测计划(qh)-开启
    startQh(data?: object) {
        return Http.post('/api/monitor/start_qh', data)
    },
    // 监测计划(qh)-关闭
    endQh(data?: object) {
        return Http.post('/api/monitor/end_qh', data)
    },
    // 计划列表：心电
    getPlanEcgList(data?: object) {
        return Http.get('/api/monitor/list_plan_ecg', data)
    },
    // 监测计划(心电 ecg)-开启
    startEcg(data?: object) {
        return Http.post('/api/monitor/start_ecg', data)
    },
    // 监测计划(心电 ecg)-关闭
    endEcg(data?: object) {
        return Http.post('/api/monitor/end_ecg', data)
    },
    // 监测计划(心电 ecg)-编辑
    editEcg(data?: object) {
        return Http.post('/api/monitor/edit_ecg', data)
    },
    // 监测计划(心电 ecg)-编辑
    planDetails(data?: object) {
        return Http.get('/api/monitor/plan_details', data)
    },
    getPatientListBp(data?: object) {
        return Http.get('/api/monitor/plan_bp_list', data)
    },
    getPatientListEcg(data?: object) {
        return Http.get('/api/monitor/plan_ecg_list', data)
    },
    getrecordbp(data?: object) {
        return Http.post('/api/monitor/plan_bp_details', data)
    },
     getPatientplanEcgDetails(data?: object) {
        return Http.post('/api/monitor/plan_ecg_details', data)
    },
    getHrvList(data?: object) {
        return Http.get('/api/hrv/list', data)
    },
    getHrvSet(data?: object) {
        return Http.post('/api/hrv/set', data)
    },
    getHrvRecord(data?: object) {
        return Http.get('/api/hrv/record', data)
    }
}

export default dynamicMonitoringApi