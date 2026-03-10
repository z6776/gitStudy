import Http from "@/utils/http/http";
const DiseaseApi = {
     // 删除疾病标签
    delTag(data?: object) {
        return Http.post('/api/disease/del_tag', data);
    },
    // 添加疾病标签
    addTag(data?: object) {
        return Http.post('/api/disease/add_tag', data);
    },
    // 疾病标签列表
    getTagList(data?: object) {
        return Http.get('/api/disease/tag_list', data);
    },
    // 编辑疾病标签
    editTag(data?: object) {
        return Http.post('/api/disease/edit_tag', data);
    },
    // 病程节点列表
    getNodeList(data?: object) {
        return Http.get('/api/disease/node_list', data);
    },
    // 删除病程节点
    delNode(data?: object) {
        return Http.post('/api/disease/del_node', data);
    },
    // 编辑病程节点
    editNode(data?: object) {
        return Http.post('/api/disease/edit_node', data);
    },
    // 开启病程
    beginProcess(data?: object) {
        return Http.post('/api/disease/begin_process', data);
    },
    beginProcessLine(data?: object) {
        return Http.get('/api/disease/process_line', data);
    },
     editProcess(data?: object) {
        return Http.post('/api/disease/edit_process', data);
    },
    finish_process(data?: object) {
        return Http.post('/api/disease/finish_process', data);
    },
    diseaseData(data?: object) {
        return Http.get('/api/disease/data', data);
    },

    
    
};
export default DiseaseApi;