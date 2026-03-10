import { type Method } from "axios";
import service from "./httpRequest";
import type {AxiosResponseType,BaseResult} from "@/interface/interface";
export default class Http {
    public static get<T extends BaseResult = any>(url: string, params?: object):Promise<AxiosResponseType<T>>{
        const method: Method = 'GET'
        const options = {
            url,
            params,
            method
        }
        !params && (delete options.params)
        return service(options)
    }
    public static post<T extends BaseResult = any>(url: string, data?: object):Promise<AxiosResponseType<T>>{
        const method: Method = 'POST'
        const options = {
            url,
            data,
            method
        }
        !data && (delete options.data)
        return service(options)
    }
}