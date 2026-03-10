import Http from "@/utils/http/http";

const XtApi = {
    // 列表
    getList(data?: object) {
        return Http.get('/api/xt/list', data);
    },
    // 详情
    getShow(data?: object) {
        return Http.get('/api/xt/show', data);
    },
    // 新增
    add(data?: object) {
        return Http.post('/api/xt/add', data);
    },
    // 已绑定(当前设备)
    getBindShow(data?: object) {
        return Http.get('/api/xt/bind_show', data);
    },
    // 未绑定(设备列表)
    getBindNotList(data?: object) {
        return Http.get('/api/xt/bind_not_list', data);
    },
    // 解绑
    unbind(data?: object) {
        return Http.post('/api/xt/unbind', data);
    },
    // 绑定
    bind(data?: object) {
        return Http.post('/api/xt/bind', data);
    },
    // 换绑
    changeBind(data?: object) {
        return Http.post('/api/xt/change_bind', data);
    }
}

export default XtApi;
