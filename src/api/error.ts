import Http from "@/utils/http/http";

const ErrorApi = {
    sendErrorLog(data?: object) {
        return Http.post('/api/error/log', data)
    },
}
export default ErrorApi