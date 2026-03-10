import Http from "@/utils/http/http";

const PatientApi = {
    getPatientList(data?: object) {
        return Http.post('/v1/patient/list', data)
    },
    getunbindPatientList(data?: object) {
        return Http.get('/api/medicine/patient_list', data)
    },
    
     getPatientEvent(data?: object) {
        return Http.get('/api/care/patient_event', data)
    },
    editPatient(data?: object) {
        return Http.post('/api/patient/edit', data)
    },
    patientDetail(data?: object){
        return Http.post("/v1/patient/show",data)
    },
    addPatient(data?: object) {
        return Http.post('/api/patient/add', data)
    },
    getPatientLogList(data?: object) {
        return Http.post('/api/patient/patient_log_list', data)
    },
    editPatientBed(data?: object) {
        return Http.post('/api/patient/edit_bed', data)
    },
    editBedDevice(data?: object) {
        return Http.post('/api/hope/assign_beds', data)
    },
    changePatientDevice(data?: object) {
        return Http.post('/api/patient/transfer', data)
    },
    getUnBindCcidList(data?: object) {
        return Http.post('/api/hope/list', data)
    },
     getbindNotList(data?: object) {
        return Http.get('/api/xt/bind_not_list', data)
    },
    setDeviceData(data?: object) {
        return Http.post('/api/hope/edit', data)
    },
    updateBedNo(data?: object) {
        return Http.post('/v1/bed/manage', data)
    },
    delBedNo(data?: object) {
        return Http.post('/v1/bed/del', data)
    },
    patientOutHospital(data?: object) {
        return Http.post('/api/patient/out_hospital', data)
    },
    editOutHospitalNew(data?: object) {
        return Http.post('/v1/patient/out_hospital_new', data)
    },
    editOutGroup(data?: object) {
        return Http.post('/v1/patient/out_group', data)
    },
    add_operation(data?: object) {
        return Http.post('/v1/patient/add_operation', data)
    },
    edit_operation(data?: object) {
        return Http.post('/v1/patient/edit_operation', data)
    },
    return_visit(data?: object) {
        return Http.post('/v1/patient/return_visit', data)
    },
    visit_message(data?: object) {
        return Http.get('/v1/patient/visit_message', data)
    }
}
export default PatientApi