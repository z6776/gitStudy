import { type Method } from "axios";
import service from "./reportHttpRequest";

export default class ReportHttp {
    public static get(url: string, params?: object,base?:object) {
        const method: Method = 'GET'
        const options = {
            url,
            params,
            ...base,
            method
        }
        !params && (delete options.params)
        return service(options)
    }
    public static post(url: string, data?: object) {
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