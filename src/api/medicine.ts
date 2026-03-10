import Http from "@/utils/http/http";

const MedicineApi = {
    // 药品类型相关
    getMedicineCateList(data?: object) {
        return Http.get('/api/medicine/cate_list', data)
    },
    addMedicineCate(data?: object) {
        return Http.post('/api/medicine/add_cate', data)
    },
    deleteMedicineCate(data?: object) {
        return Http.post('/api/medicine/del_cate', data)
    },
    
    // 药品相关
    getMedicineList(data?: object) {
        return Http.get('/api/medicine/detail_list', data)
    },
    editMedicine(data?: object) {
        return Http.post('/api/medicine/edit_detail', data)
    },
    deleteMedicine(data?: object) {
        return Http.post('/api/medicine/del_detail', data)
    },
    
    // 医嘱相关
    addAdvice(data?: object) {
        return Http.post('/api/medicine/add_advice', data)
    },
    getAdviceList(data?: object) {
        return Http.get('/api/medicine/advice_list', data)
    },
    finishPlan(data?: object) {
        return Http.post('/api/medicine/finish_plan', data)
    },
    getAdviceDetail(data?: object) {
        return Http.get('/api/medicine/advice_detail', data)
    },
    
    // 患者相关
    getPatientList(data?: object) {
        return Http.get('/api/medicine/patient_list', data)
    },
    
    // 计划相关
    checkPlan(data?: object) {
        return Http.get('/api/medicine/check_plan', data)
    }
}

export default MedicineApi
