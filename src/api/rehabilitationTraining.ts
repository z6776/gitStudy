import Http from "@/utils/http/http";

const rehabilitationTrainingplanApi = {
    // 呼吸训练：列表
    getBreatheList(data?: object) {
        return Http.get('/api/training/breathe_list', data)
    },
    // 康复训练：列表
    getRecoveryList(data?: object) {
        return Http.get('/api/training/recovery_list', data)
    },
    // 康复训练（弹框）：患者列表
    getRecoveryPatient(data?: object) {
        return Http.get('/api/training/recovery_patient', data)
    },
    // 康复训练：详情
    getRecoveryDetails(data?: object) {
        return Http.get('/api/training/recovery_details', data)
    },
    // 康复训练：新增
    addRecovery(data?: object) {
        return Http.post('/api/training/recovery_add', data)
    },
    // 康复训练：编辑
    editRecovery(data?: object) {
        return Http.post('/api/training/recovery_edit', data)
    },
    // 康复训练：删除
    delRecovery(data?: object) {
        return Http.post('/api/training/recovery_del', data)
    },
    // 跌倒预警：列表
    warnFallList(data?: object) {
        return Http.get('/api/warn/fall_list', data)
    },
    // 跌倒预警：处理
    fallProcess(data?: object) {
        return Http.post('/api/warn/fall_process', data)
    },
    // 跌倒预警：处理记录
    warnFallLog(data?: object) {
        return Http.get('/api/warn/fall_log', data)
    },
    

    // 围栏：列表
    fenceList(data?: object) {
        return Http.get('/api/warn/fence_list', data)
    },
     // 围栏：处理
    fenceProcess(data?: object) {
        return Http.post('/api/warn/fence_process', data)
    },
     // 处理记录
    fenceLog(data?: object) {
        return Http.get('/api/warn/fence_log', data)
    },
     // 当前位置
    fenceLocation(data?: object) {
        return Http.get('/api/warn/fence_location', data)
    },


    // 跌倒预警列表
    ddList(data?: object) {
        return Http.get('/api/warn/plan_list', data)
    },
    // 跌倒预警详情
    planDetails(data?: object) {
        return Http.get('/api/warn/plan_details', data)
    },
     // 跌倒预警编辑
    planEdit(data?: object) {
        return Http.post('/api/warn/plan_edit', data)
    },
    // 跌倒预警编辑
    planBtn(data?: object) {
        return Http.post('/api/warn/plan_switch', data)
    }
    



}
export default rehabilitationTrainingplanApi