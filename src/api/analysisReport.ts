import Http from "@/utils/http/http";

const ActivityStatics = {
    hopeTime(data?:object){
        return Http.post('/v1/data/get_time', data)
    },
    getSyncData(data?:object){
        return Http.post('/v1/data/sync_data', data)
    },
    submitSjApi(data?:object){
        return Http.post<any>('/v1/data/demo', data)
    }

}
export default ActivityStatics


