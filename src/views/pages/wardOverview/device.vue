<template>
      
    <div class="device_container">
        <div class="flex_space_between device_list_control rounded-12px">
            <div class="flex_start">
                <el-button @click="statusBtnHandle(0)"   :type="searchForm.status == 0 ? 'primary' : 'info'"
                    class="h-32px! w-66px! p-0! rounded-8px! "
                    >
                    <span>全部</span>
                </el-button>
                <el-button @click="statusBtnHandle(1)"   class="color-[#636676] h-32px! w-66px! p-0! rounded-8px! " :type="searchForm.status == 1 ? 'primary' : 'info'"
                    >
                    <span>启用</span>
                </el-button>
                <el-button @click="statusBtnHandle(2)"   class="h-32px! w-66px! p-0! rounded-8px!"   :type="searchForm.status == 2 ? 'primary' : 'info'"
                     >
                    <span>禁用</span>
                </el-button>
            </div>
            <div class="flex_start">
                <el-button type="primary" @click="handleDeviceUseLog" class="h-32px! w-131px!" >
                    <img src="@/assets/images/device_log_icon.png" class="btn_cion">
                    <span class="">设备使用日志</span>
                </el-button>
                <el-button @click="handleAllDeviceConfigSet"  class="h-32px! w-131px!" type="primary">
                    <img src="@/assets/images/config_set_icon.png" class="btn_cion">
                    <span class="">批量设置</span>
                </el-button>
            </div>
        </div>

        <div class="list_box" v-loading="loading">
            <el-scrollbar>
                <div class="list" v-if="listData.length > 0">
                    <div class="list_item" :class="item.status == 1 ? 'enabled_item' : 'disbled_item'" v-for="(item, index) in listData" :key="index" >
                        <div class="item_left">
                            <img :src="getDeviceImage(item.model)" alt="" class="device_image">
                            <div class="device_info">
                                <div class="device_model">设备型号：<span style="color:#384951">{{ item.model }}</span>
                                </div>
                                <div class="device_ccid">设备ccid：<span style="color:#384951">{{ item.ccid  }}</span></div>
                                <div class="fall_detection">
                                    <span>跌倒监测：</span>
                                    <el-switch v-model="item.fallDetection" @change="changeDd(item.ccid,item.fallDetection)"  active-color="#24B287" inactive-color="#DCDFE6"></el-switch>
                                </div>
                            </div>
                        </div>
                        <div class="item_right">
                                <div class="status_info" @click='openStatusDailog(item)'>
                                    <div :class='item.status == 1 ? "enabled_text" : "disabled_text"'>
                                        {{ item.status == 1 ? "启用" : "禁用" }}
                                    </div>
                                    <div class="battery_info">
                                        <img src="@/assets/images/warning.png" alt="" v-if="(item.bat && item.bat < 20) || item.bat===0">
                                        <img src="@/assets/images/bat_icon.png" alt="" v-else>
                                        <span>{{ item.bat ? item.bat : "--" }}%</span>
                                    </div>
                                </div>
                                <div class="bind_info">
                                    <span :class="item.bind == 1 ? 'bind_text' : 'unbind_text'">
                                        {{ item.bind == 1 ? `已绑定（${item.bed_number ? item.bed_number : '--'}床）` : '未绑定' }}
                                    </span>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="list_no_data" v-else>
                    <img src="@/assets/images/nodata.png" />
                    <div>未查询到相关设备信息~</div>
                </div>
            </el-scrollbar>
        </div>
    </div>

    <custom-dialog v-model="deviceDataDialogVisible" append-to-body class="_loading" title="设置阈值" :show-close="false"
        :width="`${(750 / 1920) * 100}%`" top="20vh">
        <div class="form_box config_form_width ">
            <el-form :model="deviceData" label-width="auto" label-position="right">
                <div class="deviceData_title">心率预警阈值</div>
                <el-form-item label="最高心率" prop="high_heartrate_value">
                    <div class="flex justify-start items-center">
                                <el-select v-model="deviceData.high_heartrate_value" class="config_select_width_value">
                                    <el-option :value="index + 79" :label="index + 79" v-for="index in 81"
                                        :key="index"></el-option>
                                </el-select>
                                <span class="ml-4px">bpm</span>
                    </div>  
                     <div class="flex justify-start items-center">
                            <span class="ml-20px mr-10px">持续</span>
                            <el-select v-model="deviceData.high_heartrate_time" class="config_select_width w-180px!">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span class="flex-shrink-0 ml-10px">高心率报警</span>
                    </div>  
                </el-form-item>
                <el-form-item label="最低心率" prop="low_heartrate_value">
                     <div class="flex justify-start items-center">
                        <el-select v-model="deviceData.low_heartrate_value" class="config_select_width_value w-180px!">
                        <el-option :value="index + 29" :label="index + 29" v-for="index in 31"
                            :key="index"></el-option>
                        </el-select>
                        <span class="ml-4px">bpm</span>
                     </div>
                    
                             
                    <div class="flex justify-start items-center">
                            <span class="ml-20px mr-10px">持续</span>
                            <el-select v-model="deviceData.low_heartrate_time" class="config_select_width w-180px!">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span class="flex-shrink-0 ml-10px">低心率报警</span>
                        </div>
                </el-form-item>
                <div class="deviceData_title">血氧预警阈值</div>
                <el-form-item label="最低血氧" prop="spo2">
                   <div class="flex justify-start items-center">
                                <el-select v-model="deviceData.spo2" class="config_select_width_value">
                                    <el-option :value="index + 69" :label="index + 69" v-for="index in 30"
                                        :key="index"></el-option>
                                </el-select>
                                <span class="ml-4px block w-30px">%</span>
                          </div>
                     <div class="flex justify-start items-center">
                            <span class="ml-20px mr-10px">持续</span>
                            <el-select v-model="deviceData.low_spo_time" class="config_select_width w-180px!">
                                <el-option :value="10" label="10分钟"></el-option>
                                <el-option :value="20" label="20分钟"></el-option>
                                <el-option :value="30" label="30分钟"></el-option>
                            </el-select>
                            <span class="flex-shrink-0 ml-10px">低血氧报警</span>
                        </div>
                </el-form-item>
                <div class="deviceData_title">数据频率设置</div>
             
                        <el-form-item label="采集频率">
                            <div class="flex w-100% items-center">
                                <el-select v-model="deviceData.ppg" class="w-180px!">
                                <el-option v-for="(item, index) in ppg_list" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            <span class="ml-30px mr-10px">上传频率</span>
                             <el-select v-model="deviceData.normal_rate" v-if="deviceData.ppg == 300" class="w-180px!">
                                <el-option v-for="(item, index) in normal_rate_list_1" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            <el-select v-model="deviceData.normal_rate" v-else class="w-180px!">
                                <el-option v-for="(item, index) in normal_rate_list_2" :key="index" :value="item.value"
                                    :label="item.label"></el-option>
                            </el-select>
                            </div>
                            
                        </el-form-item>
                     
            </el-form>
            <div class="setTips" v-if="!isNaN(deviceData.normal_rate * deviceData.ppg / 60)">设置成功后，{{ deviceData.normal_rate * deviceData.ppg / 60 }}分钟后生效</div>
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
    <custom-dialog v-model="statusDialogVisible" append-to-body class="_loading" title="设备状态" :show-close="false"
        :width="`${(600 / 1920) * 100}%`" top="20vh">
        <div class="status_dialog">
            <div>设备CCID：{{ deviceItem.ccid }}</div>
            <div>
                <el-radio-group v-model="deviceItem.status" class="group_radio">
                    <el-radio :value="1" size="large" style="--el-color-primary:#24B287">启用</el-radio>
                    <el-radio :value="2" size="large" style="--el-color-primary:#f7413d">禁用</el-radio>
                </el-radio-group>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="statusDialogVisible = false">取消</el-button>
                <el-button size="large" type="primary" @click="submitSetDeviceStatus()">
                    提交
                </el-button>
            </div>
        </template>
    </custom-dialog>
    <custom-dialog v-model="deviceUseLogDialog" append-to-body class="_loading" title="设备使用日志" 
        :width="`${(1000 / 1920) * 100}%`" top="15vh">
        <div class="p-20px">
            <div class="flex  mb-20px">
                <el-input class='el_input_box' size="large" placeholder="请输入设备ccid"
                    v-model="deviceLogSearchForm.ccid"></el-input>
                <el-input class='el_input_box' size="large" placeholder="请输入床位号"
                    v-model="deviceLogSearchForm.bed_number"></el-input>
                <el-input class='el_input_box' size="large" placeholder="请输入患者姓名"
                    v-model="deviceLogSearchForm.name"></el-input>
                <el-button size="large" type="primary" @click="searchDeviceUseLog">搜索</el-button>
                <el-button size="large" type="danger" @click="resetDeviceUseLogSearchForm">重置</el-button>
            </div>
            <div class="table_box mt-20px">
                <el-table class="table_height" :data="deviceUseLoglist"  size="large"
                    v-loading="deviceUseLogTableLoading"
                    header-cell-class-name="color-#384951 text-16px font-bold"
                    >
                    <el-table-column prop="ccid" label="设备CCID号" align="center" min-width="140px"></el-table-column>
                    <el-table-column prop="bed_number" label="床位号" align="center"></el-table-column>
                    <el-table-column prop="name" label="患者姓名" align="center"></el-table-column>
                    <el-table-column prop="bind_date" label="绑定时间" align="center"></el-table-column>
                    <el-table-column prop="unbind_date" label="解绑时间" align="center">
                        <template #default="props">
                            {{ props.row.unbind_date == 0 ? '--' : props.row.unbind_date }}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="create_time" width="180" label="设备创建时间" align="center">
                        <template #default="props">
                            {{ props.row.create_time ? dateFtt('yyyy-mm-dd hh:MM:ss', props.row.create_time * 1000) : ""
                            }}
                        </template>
                    </el-table-column> -->
                </el-table>
                <elc-pagination v-model:current-page="deviceUseLogPagination.page"
                    v-model:page-size="deviceUseLogPagination.perPage" :page-sizes="[5]"
                    layout="total, sizes, prev, pager, next" :total="deviceUseLogPagination.total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
    </custom-dialog>
</template>



<script setup lang='ts'>
import DeviceApi from '@/api/device';
import type { Pagination } from '@/interface/interface';
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { getAssetsFileNew } from "@/utils/function/function";  
 
// search
const enabledDeviceNum = ref(0)
const disabledDeviceNum = ref(0)
const searchForm = ref<any>({
    status: 0
})
const statusBtnHandle = (status: number) => {
    if (status == searchForm.value.status) {
        searchForm.value.status = 0
    } else {
        searchForm.value.status = status
    }
    fetchData()
}


const hideccid = (str:string)=>{
    if(str && str.length){
        return str.substring(0,13)+"*****";
    }
     return ''
}

const changeDd = async (ccid:any,fall_switch:any)=>{
   await DeviceApi.fallSwitch({
       ccid:ccid,
       fall_switch:fall_switch ? 1 : 0
   })
}

//fetchlist
// 列表
const loading = ref<boolean>(false)
const listData = ref<any[]>([])
const fetchData = async () => {
    loading.value = true
    let data = {
        page: 1,
        perPage: 999,
        status: searchForm.value.status,
    }
    const result = (await DeviceApi.getDeviceList(data)).data.result
    if (result && result.data && result.data.length) {
        
         let arr = result.data.map((item: any) => {
            return {
                ...item,
                fallDetection:item.fall_switch==1
            }
        }) || []
        listData.value = arr
    }else{
         listData.value = [];
    }
    loading.value = false
}
const computedStatusNum = async () => {
    let data = {
        page: 1,
        perPage: 999,
    }
    loading.value = true
    const result = (await DeviceApi.getDeviceList(data)).data.result
    if (result) {
        fetchData()
        enabledDeviceNum.value = 0
        disabledDeviceNum.value = 0
        result.data.forEach((item: any) => {
            if (item.status == 1) {
                enabledDeviceNum.value++
            } else {
                disabledDeviceNum.value++
            }
        })
    }else{
           loading.value = false;
    }
}


// 批量设置

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
const handleAllDeviceConfigSet = () => {
    deviceDataDialogVisible.value = true
    setTimeout(async () => {
        const Formloading = ElLoading.service({
            target: '._loading'
        })
        try {
            const result = (await DeviceApi.getAllDeviceDataConfig()).data.result
            for (const key in deviceData) {
                if (Object.prototype.hasOwnProperty.call(deviceData, key)) {
                    deviceData[key] = result[key]
                }
            }
            Formloading.close()

        } catch (error) {
            Formloading.close()
        }
    }, 50);
}

const submitDeviceData = async () => {
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = await DeviceApi.setAllDeviceDataConfig(deviceData)
        if (result) {
            ElMessage.success('操作成功')
            Formloading.close()
            deviceDataDialogVisible.value = false
        }
    } catch (error) {
        Formloading.close()
    }

}

// 设备状态 
const deviceItem = ref({
    ccid: "",
    id: 0,
    status: 1
})
const statusDialogVisible = ref(false)
const openStatusDailog = (item: any) => {
    if (item.bind == 1) {
        ElMessage.error('该设备已被绑定')
        return
    }
    deviceItem.value.id = item.id
    deviceItem.value.status = item.status
    deviceItem.value.ccid = item.ccid
    statusDialogVisible.value = true
}

// 获取设备图片路径
const getDeviceImage = (model: string) => {
    // 这里可以根据设备型号返回不同的图片路径
    let imgurls:Record<string,string> = {
        'M9': 'M9@2x.png',
        'T2PRO': 'T2PRO@2x.png',
        'T3':"T3@2x.png",
         'WB1':"WB1@2x.png",
         'WB2':"WB2@2x.png",
         'WB3':"WB3@2x.png"
    };
    
    let url = "";
    if(!model){
        return getAssetsFileNew(imgurls['M9']!);
    }
    for (const key in imgurls) {
        let model_key = key.toLowerCase();
        let _model = model.toLowerCase();
        if (_model.includes(model_key)) {
            url = imgurls[key]!;
        }
    }
    return url ? getAssetsFileNew(url) : getAssetsFileNew(imgurls['M9']!);
}
const submitSetDeviceStatus = async () => {
    const Formloading = ElLoading.service({
        target: '._loading'
    })
    try {
        const result = await DeviceApi.editDeviceStatus({ id: deviceItem.value.id, status: deviceItem.value.status })
        if (result) {
            ElMessage.success('操作成功')
            Formloading.close()
            computedStatusNum()
            statusDialogVisible.value = false
        }
    } catch (error) {
        Formloading.close()
    }
}

// 设备使用日志
const deviceUseLogDialog = ref(false)
const handleDeviceUseLog = () => {
    deviceUseLogDialog.value = true
    resetDeviceUseLogSearchForm()
}
const deviceUseLoglist = ref<any[]>([])
const deviceUseLogTableLoading = ref(false)
const deviceUseLogPagination = ref<Pagination>({
    page: 1,
    perPage: 5,
    total: 0
})
const deviceLogSearchForm = ref({
    ccid: "",
    bed_number: "",
    name: ""
})
const fetchDeviceUseLogList = async () => {
    deviceUseLogTableLoading.value = true
    let data = {
        page: deviceUseLogPagination.value.page,
        perPage: deviceUseLogPagination.value.perPage,
        ccid: deviceLogSearchForm.value.ccid,
        bed_number: deviceLogSearchForm.value.bed_number,
        name: deviceLogSearchForm.value.name,
    }
    try {
        const result = (await DeviceApi.getDeviceUseLogList(data)).data.result
        if (result) {
            deviceUseLogPagination.value.total = result.total
            deviceUseLoglist.value = result.data
        }
        deviceUseLogTableLoading.value = false
    } catch (error) {
        deviceUseLogTableLoading.value = false
    }
}


const handleSizeChange = (val: number) => {
    deviceUseLogPagination.value.perPage = val
    deviceUseLogPagination.value.page = 1
    fetchDeviceUseLogList()
}
const handleCurrentChange = (val: number) => {
    deviceUseLogPagination.value.page = val
    fetchDeviceUseLogList()
}
const searchDeviceUseLog = () => {
    deviceUseLogPagination.value.page = 1
    fetchDeviceUseLogList()
}
const resetDeviceUseLogSearchForm = () => {
    deviceLogSearchForm.value.ccid = ''
    deviceLogSearchForm.value.bed_number = ''
    deviceLogSearchForm.value.name = ''
    deviceUseLogPagination.value.page = 1
    fetchDeviceUseLogList()
}
onMounted(() => {

    // 注释掉下面这行，使用模拟数据而不是真实数据
    computedStatusNum()
})

</script>


<style scoped>
.device_container {
    height: 100%;
    width: 100%;
}

:deep(.ep-button--primary){
    color:#fff;
}
:deep(.ep-button--info){
      color:#636676;
      border:1px solid #EEEEEE;
      background-color: #F5F7FB;
}


:deep(.ep-table){
    border-radius: 0px !important;
   box-shadow: none !important;
   border: none !important;
}


.device_list_control {
    height: 56px;
    padding: 0 12px;
    background-color: #fff;
    margin: 24px;
    margin-bottom: 0px;
}

:deep(.device_list_control .el-button) {
    border-radius: 8px;
    border: none;
}

.ml_12 {
    margin-left: 12px;
}

.list_no_data {
    font-size: 16px;
    color: #929faf;
    text-align: center;
    padding-top: 10vh;
}

.list_box {
    width: 100%;
    height: calc(100% - 88px);
}

.list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 24px;
}

.list_item {
    /* width: 50%; */
    height: 208px;
    background-color: #fff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 20px;
    padding-right: 10px;
}

.enabled_item {
    border: 1px solid #E6FDED;
}

.disbled_item {
    border: 1px solid #EEEEEE;
}

.btn_cion {
    width: 20px;
    height: 20px;
}

.item_left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.device_image {
    width: 100px;
    height: 100px;
    /* object-fit: contain; */
}

.device_info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 0;
}

.device_model {
    font-size: 14px;
color: #636676;
}

.device_ccid {
       font-size: 14px;
color: #636676;
display: flex;
flex-wrap: nowrap;
}

.item_right {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 0 0;
    margin-top: auto;
    border-top:1px solid #eeeeee;
    align-items: center;
}


.status_info {
    display: flex;
    align-items: center;
    gap: 12px; 
}

.fall_detection {
    display: flex;
    align-items: center;
    font-size: 14px;
color: #636676;
}

.flex_space_between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.enabled_text {
    padding: 5px 10px;
    background-color: #E6FDED;
    color: #24B287;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
}

.disabled_text {
    padding: 5px 10px;
    background-color: #FFECE6;
    font-size: 16px;
    border-radius: 4px;
    color: #F7413D;
    cursor: pointer;
}

.battery_info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #384951;
}

.battery_info img {
    width: 20px;
    height: 20px;
}

.bind_info {
    font-size: 14px;
    text-align: right;
}

.bind_text {
    color: #24B287;
}

.unbind_text {
    color: #636676;
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
:deep(.config_select_width_value .ep-select__wrapper ) {
    height: 48px;
}
.deviceData_title {
    color: #384951;
    margin-bottom: 12px;
    font-weight: bold;
    margin-top: 12px;
    font-family: 'Source Han Sans CN-Bold';
}

.setTips {
    text-align: center;
}

.status_dialog {
    text-align: center;
    padding: 48px 0 30px;
}

.group_radio {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    padding: 0 180px;
}

.list_no_data {
    font-size: 16px;
    color: #929faf;
    text-align: center;
    padding-top: 10vh;
}

.list_no_data img {
    width: 240px;
    margin: 0 auto;
}

.el_input_box {
    width: 200px;
    margin-right: 12px;
}

.search_box {
    margin-bottom: 0
}

.table_dialog {
    /* padding: 0 20px 20px; */
}

.table_box .table_height {
}
</style>
