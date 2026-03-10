<template>
    <div class="device_set " v-loading="loading">
        <div class="device_item">
            <div class="item_label">床位患者信息：</div>
            <div class="item_value bg_box ">
                住院号（ {{ patientInfo.patient_num ? patientInfo.patient_num : "--" }} ）
            </div>
        </div>
        <div class="device_item">
            <div class="item_label">绑定久乐表：</div>
            <div class="item_value bg_box mr_24">
                <span v-if="patientInfo.bind===1">已绑定手表（CCID: {{ patientInfo.ccid ? patientInfo.ccid : "--" }} ）</span>
                <span v-else>未绑定手表</span>
            </div>
            <div v-if="patientInfo.bind===1">
                <el-button type="danger" size='large' @click="unbind">解绑设备</el-button>
                <el-button type="primary" size='large' @click="openChangeDeviceDialog">更换设备</el-button>
            </div>
            <div v-else>
                <el-button type="primary" size='large' @click="openBindDialog">绑定设备</el-button>
            </div>
        </div>
        <div class="device_item config_item" v-if="patientInfo.bind===1">
            <div class="item_label">设置报警阈值：</div>
            <div class="config_right">
                <div class="config_button">
                    <el-button type="primary" size="large" @click="submitDeviceData()">确定</el-button>
                       <div class="ml-10px">
                <el-button type="info" size='large' @click="closeBindDialog">取消</el-button>
              </div>
                </div>
                <div class="config_box">
                    <div class="left_box">
                        <div class="text-16px color-[#384951] mb-16px font-bold">
                            心率预警阈值
                        </div>
                        <div class="config_data_item flex items-center gap-20px mb_16">
                            <div class="flex-shrink-0">最高心率：</div>
                             <el-select v-model="deviceData.high_heartrate_value" class="w-409px">
                                    <el-option :value="index + 79" :label="index + 79" v-for="index in 81"
                                        :key="index"></el-option>
                                </el-select>
                            <!-- <div class="config_data_value_long bg_box">{{ patientInfo.high_heartrate_value }}
                            </div> -->
                            <div>bpm,</div>
                            <div class="flex-shrink-0">持续</div>
                               <el-select v-model="deviceData.high_heartrate_time" class="w-365px">
                                <el-option :value="10" label="10"></el-option>
                                <el-option :value="20" label="20"></el-option>
                                <el-option :value="30" label="30"></el-option>
                            </el-select>
                            <!-- <div class="config_data_value_short bg_box">{{ patientInfo.high_heartrate_time }}
                            </div> -->
                            <div class="flex-shrink-0">分钟，高心率预警</div>
                        </div>
                        <div class="config_data_item flex items-center gap-20px mb_24">
                            <div class="flex-shrink-0">最低心率：</div>
                             <el-select v-model="deviceData.low_heartrate_value" class="w-409px">
                                    <el-option :value="index + 29" :label="index + 29" v-for="index in 31"
                                        :key="index"></el-option>
                                </el-select>
                            <!-- <div class="config_data_value_long bg_box">{{ patientInfo.low_heartrate_value }}</div> -->
                            <div>bpm,</div>
                            <div  class="flex-shrink-0">持续</div>
                             <el-select v-model="deviceData.low_heartrate_time" class="w-365px">
                                <el-option :value="10" label="10"></el-option>
                                <el-option :value="20" label="20"></el-option>
                                <el-option :value="30" label="30"></el-option>
                            </el-select>
                            <!-- <div class="config_data_value_short bg_box">{{ patientInfo.low_heartrate_time }}</div> -->
                            <div class="flex-shrink-0">分钟，低心率预警</div>
                        </div>
                        <div  class="text-16px color-[#384951] mb-16px font-bold">
                            血氧预警阈值
                        </div>
                        <div class="config_data_item items-center flex gap-20px">
                            <div  class="flex-shrink-0">最低血氧：</div>
                              <el-select v-model="deviceData.spo2" class="w-409px">
                                    <el-option :value="index + 69" :label="index + 69" v-for="index in 30"
                                        :key="index"></el-option>
                                </el-select>
                            <!-- <div class="config_data_value_long bg_box">{{ patientInfo.spo2 }}</div> -->
                            <div>bpm,</div>
                            <div  class="flex-shrink-0">持续</div>
                              <el-select v-model="deviceData.low_spo_time" class="w-365px">
                                <el-option :value="10" label="10"></el-option>
                                <el-option :value="20" label="20"></el-option>
                                <el-option :value="30" label="30"></el-option>
                            </el-select>
                            <!-- <div class="config_data_value_short bg_box">{{ patientInfo.low_spo_time }}</div> -->
                            <div class="flex-shrink-0">分钟，低血氧预警</div>
                        </div>
                    </div>
                    <div class="right_box">
                        <div  class="text-16px color-[#384951] mb-16px font-bold">
                            频率设置
                        </div>
                        <div class="config_data_item  flex_space_between mb_16 gap-20px">
                            <div class="flex-shrink-0">采集频率</div>
                               <el-select v-model="deviceData.ppg" class="w-353px">
                                <el-option v-for="(item, index) in ppg_list" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            <!-- <div class="config_data_value_long bg_box">{{ patientInfo.ppg / 60 }}</div> -->
                            <div class="flex-shrink-0">分钟</div>
                        </div>
                        <div class="config_data_item flex_space_between gap-20px">
                            <div class="flex-shrink-0">上传频率</div>
                                <el-select v-model="deviceData.normal_rate" v-if="deviceData.ppg == 300" class="w-353px">
                                <el-option v-for="(item, index) in normal_rate_list_1" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            <el-select v-model="deviceData.normal_rate" v-else class="w-353px">
                                <el-option v-for="(item, index) in normal_rate_list_2" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            <!-- <div class="config_data_value_long bg_box">
                                {{ patientInfo.normal_rate * patientInfo.ppg / 60 }}</div> -->
                            <div class="flex-shrink-0">分钟</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
     <bindWatch ref="bindWatchRef" v-model="bindDailogVisible" @refresh="fetchPatientInfo" :patient-id="patientInfo.id" ptype='watch'  />
     <changeWatch v-model="changeDailogVisible" ptype="watch" v-model:change-patinet="changePatinet" @refresh="fetchPatientInfo(),emits('reloadPatientInfo')" />
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
                <el-button size="large" type="primary" @click="submitDeviceData()">
                    提交
                </el-button>
            </div>
        </template>
    </custom-dialog>
</template>

<script setup lang='ts'>
import PatientApi from '@/api/patient';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import bindWatch from "@/views/index/components/bindWatch.vue";
import changeWatch from "@/views/index/components/changeWatch.vue";
import { reactive, ref ,onMounted,nextTick} from 'vue';
const props = defineProps<{ patientid: number }>();
const emits = defineEmits(['reloadPatientInfo',"closeBindDialog"])
const loading = ref(false);
const patientInfo = ref<any>({});
const fetchPatientInfo = async () => {
    loading.value = true;
    let data = {
        id:props.patientid
    }
    try {
        const result = (await PatientApi.patientDetail(data)).data.result
        if (result) {
            patientInfo.value = result || {}
            openDeviceConfigDialog();
            loading.value = false
        } else {
            loading.value = false
        }
    } catch (error) {
        loading.value = false
    }
}
onMounted(() => {
    fetchPatientInfo()

})
// 解绑设备
const unbind = () => {
    ElMessageBox.confirm(
        `是否将设备${patientInfo.value.ccid}与该患者进行解绑？`,
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
            let data = { ccid: patientInfo.value.ccid, bind: 2, patient_id: patientInfo.value.id }
            const result = await PatientApi.editBedDevice(data)
            if (result) {
                ElMessage({
                    type: 'success',
                    message: '解绑成功',
                });
                fetchPatientInfo()
                // emits('reloadPatientInfo')
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
 
const closeBindDialog = () => {
    emits("closeBindDialog")
}

//更换设备

const changeDailogVisible = ref(false)
const changePatinet = ref<any>({
      
})
const openChangeDeviceDialog = () => {
        changePatinet.value = {
            type:"watch",
            model:patientInfo.value.model,
            id:patientInfo.value.id,
            old_ccid:patientInfo.value.ccid
       }
            fetchUnBindCcidList()
            changeDailogVisible.value = true   
}


// 设置预警阈值
const ppg_list = [
    {
        label: "5",
        value: 300
    },
    {
        label: "10",
        value: 600
    }
]
const normal_rate_list_1 = [
    {
        label: "10",
        value: 2
    },
    {
        label: "15",
        value: 3
    },
    {
        label: "20",
        value: 4
    },
    {
        label: "25",
        value: 5
    },
    {
        label: "30",
        value: 6
    },
]
const normal_rate_list_2 = [
    {
        label: "20",
        value: 2
    },
    {
        label: "30",
        value: 3
    },
    {
        label: "40",
        value: 4
    },
    {
        label: "50",
        value: 5
    },
    {
        label: "60",
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
    low_spo_time: 10  
})
const deviceDataDialogVisible = ref(false)
const openDeviceConfigDialog = () => {
    for (const key in deviceData) {
        if (Object.prototype.hasOwnProperty.call(deviceData, key)) {
            deviceData[key]=patientInfo.value[key]
        }
    }
}

const submitDeviceData = async () => {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            try {
                // debugger;
                const result = await PatientApi.setDeviceData({...deviceData,patient_id:patientInfo.value["id"]})
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
    padding: 20px;
    height: calc(100vh - 168px);
    background: #FFFFFF;
border-radius: 12px 12px 12px 12px;
border: 1px solid #EEEEEE;
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
    width: 70%;
}

.right_box {
    width: calc(30% - 24px)
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


.deviceData_title {
    color: #384951;
    margin-bottom: 12px;
    margin-top: 12px;
}

.setTips {
    text-align: center;
}
</style>
