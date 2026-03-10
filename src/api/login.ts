import Http from "@/utils/http/http";

const LoginApi = {
    login(data?: object) {
        return Http.post('/api/zone/login', data)
    },
    editPassword(data?: object) {
        return Http.post('/api/zone/edit_password', data)
    }
}
export default LoginApi