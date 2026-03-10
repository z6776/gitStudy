import Http from "@/utils/http/http";
import type { apiIndexItemType,PatientInfoType } from "@/views/index/types/index";
import type { ListItemType } from "@/interface/interface";
import handleDataFn from "@/utils/handleDataFn/index";
const ScreenApi = {
    getScreenDataList(data?: object) {
        return Http.get('/api/output/dpSignEcg', data)
    },
    getDetailData(data?:object){
        return Http.post('/api/output/dpGetNewInfo',data)
    },
    getHomePage(data?:object){
        return Http.get('/api/zone/home_page',data);
    },
    // 首页用户列表
   async indexV2List(data:object):Promise<PatientInfoType[]>{
    try {
         let res = await Http.get<ListItemType>('/api/zone/home_page',data);
         let _list:apiIndexItemType[] = res.data.result.data;
        if(Array.isArray(_list) && _list.length > 0){
            let frontModel:PatientInfoType[] =  handleDataFn.adaptList(_list);
            return frontModel
        }
        return [];
        } catch (err) {
            console.log(err);
            return [];
        }
   
    }
    
}
export default ScreenApi