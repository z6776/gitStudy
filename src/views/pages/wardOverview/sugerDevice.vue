<template>     
    <div class="device_container">
        <div class="flex_space_between device_list_control rounded-12px">
            <div class="flex_start">
                <el-button @click="statusBtnHandle(0)" class="h-32px! w-66px! rounded-8px p-0!" :type="searchForm.status == 0 ? 'primary' : 'info'"
                     >
                    <span>全部</span>
                </el-button>
                <el-button @click="statusBtnHandle(1)" class="h-32px! w-66px! rounded-8px p-0!" :type="searchForm.status == 1 ? 'primary' : 'info'"
                     >
                    <span>已绑定</span>
                </el-button>
                <el-button @click="statusBtnHandle(2)" class="h-32px! w-66px! rounded-8px p-0!" :type="searchForm.status == 2 ? 'primary' : 'info'"
                     >
                    <span>未绑定</span>
                </el-button>
            </div>
            <div class="flex_start">
                <el-button @click="setWarningVisible(true)" class="h-32px! w-120px! rounded-8px"  type="primary">
                    <img src="@/assets/images/V2/add.png" class="btn_cion">
                    <span class="">新增设备</span>
                </el-button>
            </div>
        </div>

        <div class="list_box" v-loading="loading">
            <el-scrollbar>
                <div class="list" v-if="listData.length > 0">
                    <div class="list_item" :class="item.status == 1 ? 'enabled_item' : 'disbled_item'" v-for="(item, index) in listData" :key="index" >
                        <div class="item_left">
                            <img src="@/assets/images/V2/sugericon.png" alt="" class="device_image">
                            <div class="device_info">
                                <div class="device_model">设备类型：<span style="color:#384951">{{ item.model || "--" }}</span>
                                </div>
                                <div class="device_ccid">设备id：<span style="color:#384951">{{ item.ccid || "--" }}</span></div>
                                <div class="device_ccid">创建日期：<span style="color:#384951">{{ dateFtt('yyyy/mm/dd',item.create_time) }}</span></div>
                            </div>
                        </div>
                        <div class="item_right">
                                <div class="status_info">
                                        <div class="device_ccid">监护时长：<span style="color:#384951">{{ getTimeInterval(item.bind_time) }}</span></div>
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
 
    <custom-dialog v-model="WarningVisible" append-to-body class="_loading" title="新增设备"
        :width="`${(640 / 1920) * 100}%`" top="20vh">
        <div class="p-[24px]" v-loading="formLoading">
              <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                status-icon
                :rules="rules"
                label-width="auto"
                class="m-[24px_auto] w-300px"
            >
    
                        <div class="flex justify-start items-center mb-20px">
                        <span>设备类型：</span>
                        <span>血糖传感器</span>
                </div>
                    <el-form-item label="设备ID：" prop="deviceId">
                    <el-input placeholder="请输入设备ID" class="w-[321px]" v-model="ruleForm.deviceId"></el-input>
                    </el-form-item>
                </el-form> 
            </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="setWarningVisible(false)">取消</el-button>
                <el-button size="large" type="primary" @click="submitForm(ruleFormRef)">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>
 
</template>



<script setup lang='ts'>
import XtApi from '@/api/suger';
import type { Pagination } from '@/interface/interface';
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { getAssetsFileNew } from "@/utils/function/function";  
import { dateFtt } from '@/utils/date/dateFtt';
import { getTimeInterval } from "@/utils/function/function";
import type { FormInstance, FormRules } from 'element-plus';
const searchForm = ref({
    status: 0
})
 const useSettingWarning = ()=>{
    const WarningVisible = ref(false);
    const setWarningVisible = (b:boolean)=>{
        WarningVisible.value = b;
    }
    return {
        WarningVisible,
        setWarningVisible
    }
 }
 const { WarningVisible,setWarningVisible } = useSettingWarning();


const statusBtnHandle = (status: number) => {
    if (status == searchForm.value.status) {
        searchForm.value.status = 0
    } else {
        searchForm.value.status = status
    }
    fetchData()
}

// JLXT0010000000001
const validatePass = (rule: any, value: any, callback: any) => {
     let text = /^JLXT001[0-9a-zA-Z]{10}$/;
  if (value === '') {
    callback(new Error('请输入设备ID'))
  }else if (!text.test(value)) {
    callback(new Error('格式不合法'))
  }  
  else {
    if (ruleForm.deviceId !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}


const ruleForm = reactive({
  deviceId: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<typeof ruleForm>>({
  deviceId: [{ validator: validatePass, trigger: 'change' }]
})

let formLoading = ref(false)
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
        try {
             formLoading.value = true;
               let _res = await XtApi.add({
            ccid: ruleForm.deviceId
        })
        fetchData();
        formLoading.value = false;
        setWarningVisible(false)
            
        } catch (error) {
             formLoading.value = false;
            
        }
     
    } else {
    }
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
        bind: searchForm.value.status===0 ? '' : searchForm.value.status,
    }
    const result = (await XtApi.getList(data)).data.result
    if (result && result.data && result.data.length) {
        
         let arr = result.data.map((item: any) => {
            return {
                ...item
            }
        }) || []
        listData.value = arr
    }else{
         listData.value = [];
    }
    loading.value = false
}

onMounted(() => {
    fetchData()
})

</script>


<style scoped>
:deep(.ep-button--primary){
    color:#fff;
}
:deep(.ep-button--info){
      color:#636676;
      border:1px solid #EEEEEE;
      background-color: #F5F7FB;
}


.device_container {
    height: 100%;
    width: 100%;
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
    width: 15px;
    height: 15px;
    margin-right:6px;
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
    height: 32px;
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

.search_box .el_input_box {
    width: 200px;
    margin-right: 14px;
}

.search_box {
    margin-bottom: 0
}

.table_dialog {
    padding: 0 20px 20px;
}

.table_box .table_height {
    height: 528px;
}
</style>
