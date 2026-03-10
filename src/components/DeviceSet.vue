<template>
    <div class="device_set " v-loading="loading">
        <div class="device_item">
            <div class="item_label">床位患者信息：</div>
            <div class="item_value bg_box ">
                住院号（ {{ props.patientInfo.patient_num ? props.patientInfo.patient_num : "--" }} ）
            </div>
        </div>
        <div class="device_item">
            <div class="item_label">绑定久乐表：</div>
            <div class="item_value bg_box mr_24">
                <span v-if="props.patientInfo.ccid">已绑定手表（CCID: {{ props.patientInfo.ccid ? props.patientInfo.ccid :
                    "--" }} ）</span>
                <span v-else>未绑定手表</span>
            </div>
            <div v-if="props.patientInfo.ccid">
                <el-button type="danger" size='large' @click="unbind">解绑设备</el-button>
                <el-button type="success" size='large' @click="openChangeDeviceDialog">更换设备</el-button>
            </div>
            <div v-else>
                <el-button type="success" size='large' @click="openBindDialog">绑定设备</el-button>
            </div>
        </div>
        <div class="device_item config_item" v-if="props.patientInfo.ccid">
            <div class="item_label">设置报警阈值：</div>
            <div class="config_right">
                <div class="config_button">
                    <el-button type="success" size="large" @click="openDeviceConfigDialog">更换阈值</el-button>
                </div>
                <div class="config_box">
                    <div class="left_box">
                        <div class="config_title font_bold">
                            心率预警阈值
                        </div>
                        <div class="config_data_item flex_space_between mb_16">
                            <div>最高值：</div>
                            <div class="config_data_value_long bg_box">{{ props.patientInfo.high_heartrate_value }}
                            </div>
                            <div>bpm,</div>
                            <div>持续</div>
                            <div class="config_data_value_short bg_box">{{ props.patientInfo.high_heartrate_time }}
                            </div>
                            <div>分钟，高心率预警</div>
                        </div>
                        <div class="config_data_item flex_space_between mb_24">
                            <div>最低值：</div>
                            <div class="config_data_value_long bg_box">{{ props.patientInfo.low_heartrate_value }}</div>
                            <div>bpm,</div>
                            <div>持续</div>
                            <div class="config_data_value_short bg_box">{{ props.patientInfo.low_heartrate_time }}</div>
                            <div>分钟，低心率预警</div>
                        </div>
                        <div class="config_title font_bold">
                            血氧预警阈值
                        </div>
                        <div class="config_data_item flex_space_between">
                            <div>最低值：</div>
                            <div class="config_data_value_long bg_box">{{ props.patientInfo.spo2 }}</div>
                            <div>bpm,</div>
                            <div>持续</div>
                            <div class="config_data_value_short bg_box">{{ props.patientInfo.low_spo_time }}</div>
                            <div>分钟，低血氧预警</div>
                        </div>
                    </div>
                    <div class="right_box">
                        <div class="config_title font_bold">
                            频率设置
                        </div>
                        <div class="config_data_item flex_space_between mb_16">
                            <div>采集频率</div>
                            <div class="config_data_value_long bg_box">{{ props.patientInfo.ppg / 60 }}</div>
                            <div>分钟</div>
                        </div>
                        <div class="config_data_item flex_space_between">
                            <div>上传频率</div>
                            <div class="config_data_value_long bg_box">
                                {{ props.patientInfo.normal_rate * props.patientInfo.ppg / 60 }}</div>
                            <div>分钟</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <custom-dialog v-model="bindDailogVisible" append-to-body class="_loading" title="绑定设备" :show-close="false"
        :width="`${(600 / 1920) * 100}%`" top="25vh">
        <div >
            <div class="bind_head">未分配设备</div>
            <div class="ccid_list" v-loading="unbindTableLoading">
                <el-scrollbar>
                    <div class="ccid_item" v-for="item in unBindCcidList.list" @click="setCcidRadioChoose(item.ccid)">
                        <el-radio style="--el-color-primary:#00B528" :value="item.ccid" v-model="chooseBindCcid"
                            name="bindCcid"></el-radio>
                        {{ item.ccid }}
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="bindDailogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitBind()">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>
    <custom-dialog v-model="changeDailogVisible" append-to-body class="_loading" title="更换设备" :show-close="false"
        :width="`${(734 / 1920) * 100}%`" top="15vh">
        <div class="flex_space_between change_device_box ">
            <div class="change_left">
                <div class="bind_head">当前设备</div>
                <div class="change_ccid_list">
                    <div class="change_ccid_item">{{ props.patientInfo.ccid }}</div>
                </div>
            </div>
            <div class="change_icon">
                <img src="@/assets/images/patient_change_icon.png">
            </div>
            <div class="change_right">
                <div class="bind_head">更换设备</div>
                <div class="change_ccid_list" v-loading="unbindTableLoading">
                    <el-scrollbar>
                        <div class="change_ccid_item" v-for="item in unBindCcidList.list"
                            @click="setChangeCcidRadioChoose(item.ccid)">
                            <el-radio :value="item.ccid" v-model="changePatinet.ccid" name="changeCcid"></el-radio>
                            {{ item.ccid }}
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="changeDailogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitChange()">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>

    <custom-dialog v-model="deviceDataDialogVisible" append-to-body class="_loading" title="设置阈值" :show-close="false"
        :width="`${(712 / 1920) * 100}%`" top="25vh">
        <div class="form_box config_form_width ">
            <el-form :model="deviceData" label-width="auto" label-position="right">
                <div class="deviceData_title">心率预警阈值</div>
                <el-form-item label="最高心率" prop="high_heartrate_value">
                    <el-col :span="11">
                        <el-row style="width: 100%;">
                            <el-col :span="19">
                                <el-select v-model="deviceData.high_heartrate_value" class="config_select_width_value">
                                    <el-option :value="index + 79" :label="index + 79" v-for="index in 81"
                                        :key="index"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5" style="padding-left: 1em">
                                <span>bpm</span>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="13" style="padding-left: 1em">
                        <div class="flex_space_between">
                            <span>持续</span>
                            <el-select v-model="deviceData.high_heartrate_time" class="config_select_width">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span>高心率报警</span>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label="最低心率" prop="low_heartrate_value">
                    <el-col :span="11">
                        <el-row style="width: 100%;">
                            <el-col :span="19">
                                <el-select v-model="deviceData.low_heartrate_value" class="config_select_width_value">
                                    <el-option :value="index + 29" :label="index + 29" v-for="index in 31"
                                        :key="index"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5" style="padding-left: 1em">
                                <span>bpm</span>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="13" style="padding-left: 1em">
                        <div class="flex_space_between">
                            <span>持续</span>
                            <el-select v-model="deviceData.low_heartrate_time" class="config_select_width">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span>低心率报警</span>
                        </div>
                    </el-col>
                </el-form-item>
                <div class="deviceData_title">血氧预警阈值</div>
                <el-form-item label="最低血氧" prop="spo2">
                    <el-col :span="11">
                        <el-row style="width: 100%;">
                            <el-col :span="20">
                                <el-select v-model="deviceData.spo2" class="config_select_width_value">
                                    <el-option :value="index + 69" :label="index + 69" v-for="index in 30"
                                        :key="index"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="padding-left: 1em">
                                <span>%</span>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="13" style="padding-left: 1em">
                        <div class="flex_space_between">
                            <span>持续</span>
                            <el-select v-model="deviceData.low_spo_time" class="config_select_width">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span>低血氧报警</span>
                        </div>
                    </el-col>
                </el-form-item>
                <div class="deviceData_title">数据频率设置</div>
                <el-row justify="space-between">
                    <el-col :span="11">
                        <el-form-item label="采集频率">
                            <el-select v-model="deviceData.ppg">
                                <el-option v-for="(item, index) in ppg_list" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="上传频率">
                            <el-select v-model="deviceData.normal_rate" v-if="deviceData.ppg == 300">
                                <el-option v-for="(item, index) in normal_rate_list_1" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            <el-select v-model="deviceData.normal_rate" v-else>
                                <el-option v-for="(item, index) in normal_rate_list_2" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="setTips">设置成功后，{{ deviceData.normal_rate * deviceData.ppg / 60 }}分钟后生效</div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="deviceDataDialogVisible = false">取消</el-button>
                <el-button size="large" type="success" @click="submitDeviceData()">
                    提交
                </el-button>
            </div>
        </template>
    </custom-dialog>
</template>

<script setup lang='ts'>
import PatientApi from '@/api/patient';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { reactive, ref } from 'vue';

const props = defineProps(['patientInfo', 'loading'])
const emits = defineEmits(['reloadPatientInfo'])
// 解绑设备
const unbind = () => {
    ElMessageBox.confirm(
        `是否将设备${props.patientInfo.ccid}与该患者进行解绑？`,
        '解绑设备',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            confirmButtonClass: "delete_btn",
        }
    )
        .then(async () => {
            let data = { ccid: props.patientInfo.ccid, bind: 2, patient_id: props.patientInfo.id }
            const result = await PatientApi.editBedDevice(data)
            if (result) {
                ElMessage({
                    type: 'success',
                    message: '解绑成功',
                })
                emits('reloadPatientInfo')
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
}
// 绑定设备
let unBindCcidList = reactive<any>({
    list: []
})
const unbindTableLoading = ref(false)
const fetchUnBindCcidList = async () => {
    unbindTableLoading.value = true
    unBindCcidList.list = (await PatientApi.getUnBindCcidList({ bind: 2 })).data.result
    if (unBindCcidList.list) {
        unbindTableLoading.value = false
    }

}
const bindDailogVisible = ref(false)
const chooseBindCcid = ref('')

const openBindDialog = () => {
    bindDailogVisible.value = true
    fetchUnBindCcidList()
    chooseBindCcid.value = ''
}

const setCcidRadioChoose = (ccid: string) => {
    chooseBindCcid.value = ccid
}
const submitBind = async () => {
    if (!chooseBindCcid.value) {
        ElMessage.error('请先选择设备')
        return
    }

    let data = {
        ccid: chooseBindCcid.value,
        bind: 1,
        patient_id: props.patientInfo.id
    }
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = await PatientApi.editBedDevice(data)
        if (result) {
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            bindDailogVisible.value = false
            Formloading.close()
            emits('reloadPatientInfo')
        }
    } catch (error) {
        Formloading.close()
    }
}
//更换设备

const changeDailogVisible = ref(false)
const changePatinet = reactive({
    ccid: ""
})
const openChangeDeviceDialog = () => {
    changeDailogVisible.value = true
    changePatinet.ccid = ''
    fetchUnBindCcidList()
}
const setChangeCcidRadioChoose = (ccid: string) => {
    changePatinet.ccid = ccid
}
const submitChange = async () => {
    if (!changePatinet.ccid) {
        ElMessage.error('请先选择设备')
        return
    }
    let data = {
        ccid: changePatinet.ccid,
        id: props.patientInfo.id,
        old_ccid: props.patientInfo.ccid
    }
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = await PatientApi.changePatientDevice(data)
        if (result) {
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            Formloading.close()
            changeDailogVisible.value = false
            emits('reloadPatientInfo')
        }
    } catch (error) {
        Formloading.close()
    }
}

// 设置预警阈值
const ppg_list = [
    {
        label: "5分钟",
        value: 300
    },
    {
        label: "10分钟",
        value: 600
    }
]
const normal_rate_list_1 = [
    {
        label: "10分钟",
        value: 2
    },
    {
        label: "15分钟",
        value: 3
    },
    {
        label: "20分钟",
        value: 4
    },
    {
        label: "25分钟",
        value: 5
    },
    {
        label: "30分钟",
        value: 6
    },
]
const normal_rate_list_2 = [
    {
        label: "20分钟",
        value: 2
    },
    {
        label: "30分钟",
        value: 3
    },
    {
        label: "40分钟",
        value: 4
    },
    {
        label: "50分钟",
        value: 5
    },
    {
        label: "60分钟",
        value: 6
    },
]
const deviceData = reactive<any>({
    ccid: '',
    low_heartrate_value: '',
    high_heartrate_value: '',
    spo2: '',
    ppg: "",
    normal_rate: "",
    low_heartrate_time: 10,
    high_heartrate_time: 10,
    low_spo_time: 10,
})
const deviceDataDialogVisible = ref(false)
const openDeviceConfigDialog = () => {
    deviceDataDialogVisible.value = true
    for (const key in deviceData) {
        if (Object.prototype.hasOwnProperty.call(deviceData, key)) {
            deviceData[key]=props.patientInfo[key]
        }
    }
}

const submitDeviceData = async () => {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            try {
                const result = await PatientApi.setDeviceData(deviceData)
                if (result) {
                    ElMessage.success('操作成功')
                    Formloading.close()
                    deviceDataDialogVisible.value = false
                    emits('reloadPatientInfo')
                }
            } catch (error) {
                Formloading.close()
            }

}
</script>

<style scoped>
.device_set {
    padding: 24px;
}

.device_item {
    display: flex;
    justify-content: flex-start;
    color: #636676;
    margin-bottom: 24px;
    align-items: center;
}

.item_value {
    width: 400px;
}

.bg_box {
    background: #F5F7FB;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 16px;
    height: 48px;
    color: #384951;
}

.item_label {
    width: 136px;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
}

.config_item {
    align-items: start;
}

.config_button {
    height: 48px;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.config_right {
    width: calc(100% - 136px);
}

.config_box {
    display: flex;
    justify-content: space-between;
}

.config_box>div {
    height: 296px;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #EEEEEE;
    padding: 24px;
}

.left_box {
    width: 60%;
}

.right_box {
    width: calc(40% - 24px)
}

.config_title {
    color: #384951;
    font-size: 16px;
    height: 16px;
    line-height: 16px;
    margin-bottom: 16px;
}

.config_data_item {
    font-size: 16px;
    color: #636676;
}

.config_data_value_long {
    width: 340px;
}

.config_data_value_short {
    width: 130px;
}

.mb_16 {
    margin-bottom: 16px;
}

.mb_24 {
    margin-bottom: 24px;
}

.mr_24 {
    margin-right: 24px;
}

.bind_head {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #F5F7FB;
    border-top: 1px solid #e3e3e3;
}

.ccid_list {
    height: 300px;
}

.ccid_item {
    height: 44px;
    line-height: 44px;
    background: #FFFFFF;
    border-top: 1px solid #F5F7FB;
    padding: 0 20px;
    cursor: pointer;
}


.change_device_box {
    padding: 64px 48px;
}

.change_left,
.change_right {
    width: 240px;
    text-align: center;
}

.change_left .bind_head,
.change_right .bind_head {
    border: none;
}

.change_ccid_list {
    height: 360px;
    overflow-y: auto;
}

.change_icon img {
    width: 66px;
}

.change_ccid_item {
    height: 44px;
    line-height: 44px;
    border: 1px solid #F5F7FB;
    border-top: none;
    cursor: pointer;
}

.config_form_width {
    width: 80% !important;
    color: #636676;
}

.config_select_width {
    width: 130px;
}

.config_select_width_value {
    width: 180px;
}

.deviceData_title {
    color: #384951;
    margin-bottom: 12px;
    margin-top: 12px;
    font-family: 'Source Han Sans CN-Bold';
}

.setTips {
    text-align: center;
}
</style>
