import Http from "@/utils/http/http";

const CareApi = {
    // 管理护理标签列表
    getList(data?: object) {
        return Http.get('/api/care/list', data);
    },
    // 编辑护理标签
    edit(data?: object) {
        return Http.post('/api/care/edit', data);
    },
    // 常用护理事件标签列表
    getCommonList(data?: object) {
        return Http.get('/api/care/common_list', data);
    },
    // 设置常用护理事件标签
    setCommon(data?: object) {
        return Http.post('/api/care/set_common', data);
    },
    // 患者护理标签列表
    getPatientList(data?: object) {
        return Http.get('/api/care/patient', data);
    },
    // 添加患者护理事件
    addEvent(data?: object) {
        return Http.post('/api/care/add_event', data);
    },
    // 患者护理事件记录
    getEventLog(data?: object) {
        return Http.get('/api/care/event_log', data);
    },
    // 删除患者护理事件记录
    deleteEvent(data?: object) {
        return Http.post('/api/care/del_event', data);
    },
    // 编辑患者护理注意事项
    editNotice(data?: object) {
        return Http.post('/api/care/edit_notice', data);
    },
    // 患者护理注意事项
    getNotice(data?: object) {
        return Http.get('/api/care/notice', data);
    },
    // 患者教育视频
    video_list(data?: object) {
        return Http.get('/api/zone/video_list', data);
    },
    // 添加患者教育视频
    add_video(data?: object) {
        return Http.post('/api/zone/add_video', data);
    },
    // 编辑患者教育视频
    edit_video(data?: object) {
        return Http.post('/api/zone/edit_video', data);
    }


    
}

export default CareApi;
