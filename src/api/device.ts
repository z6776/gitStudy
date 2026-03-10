import Http from "@/utils/http/http";

const DeviceApi = {
    getDeviceList(data?: object) {
        return Http.get('/api/device/list', data)
    },
    editDeviceStatus(data?: object) {
        return Http.post('/api/device/status', data)
    },
    getAllDeviceDataConfig(data?: object) {
        return Http.get('/api/device/get_config', data)
    },
    setAllDeviceDataConfig(data?: object) {
        return Http.post('/api/device/set_config', data)
    },
    getDeviceUseLogList(data?: object) {
        return Http.get('/api/device_log/list', data)
    },
     fallSwitch(data?: object) {
        return Http.post('/api/device/fall_switch', data)
    }
    
}
export default DeviceApi