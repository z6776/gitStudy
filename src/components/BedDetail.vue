<template>
    <!-- <div class="detail_title flex_space_between">
        <div class="title_left flex_start ">
            <img src="@/assets/images/avatar.png" alt="">
            <div>{{ props.bedItem.name || '病人信息' }}</div>
        </div>
        <img src="@/assets/images/detail_close_icon.png" class="close_btn" alt="" @click="closeDetail">
    </div> -->

    <div class="detail_content_box">
        <!-- <div class="detail_tab ">
            <div class="tab_item" :class="{ active_tab_item: active_tab == 0 }" @click="toggleTab(0)">基本信息</div>
            <div class="tab_item" :class="{ active_tab_item: active_tab == 1 }" @click="toggleTab(1)">体征数据</div>
            <div class="tab_item" :class="{ active_tab_item: active_tab == 2 }" @click="toggleTab(2)">手表绑定设置</div>
        </div> -->
        <div class="detail_content">
            <div style="height: 100%;" v-if="active_tab == 0">
                <el-scrollbar>
                    <PatientInfoEdit ptype="edit" v-model="patientInfo" v-if="isEdit===true" @submit="onSubmit" @cancel="cancel"></PatientInfoEdit>
                    <PatientInfo :patient-info="patientInfo" v-else></PatientInfo>
                </el-scrollbar>
            </div>
            <div style="height: 100%;" v-if="active_tab == 1">
                <el-scrollbar>
                    <BodyData :patient-info="patientInfo"></BodyData>
                </el-scrollbar>
            </div>
            <div style="height: 100%;" v-if="active_tab == 2">
                <el-scrollbar>
                    <DeviceSet :patient-info="patientInfo" @reload-patient-info="reloadPatientInfo" :loading="patientInfoLoading"></DeviceSet>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import PatientApi from '@/api/patient';
import PatientInfo from './PatientInfo.vue'
import PatientInfoEdit from './patientInfoEdit.vue'
import DeviceSet from './DeviceSet.vue'
import BodyData from './BodyData.vue'
import { watch } from 'vue';
import { onMounted, ref } from 'vue';
import DeviceApi from '@/api/device';
const props = defineProps(['bedItem','isEdit'])
const emits = defineEmits(['close','reloadBedList','onSubmit','cancel'])
 
const closeDetail = () => {
    emits('close')
}

const onSubmit = (data: any) => {
   emits('onSubmit',data)
}

const cancel = (data: any) => {
   emits('cancel',data)
}



// tab切换
const active_tab = ref(0)
const toggleTab = (index: number) => {
    active_tab.value = index
}
watch(active_tab, () => {
    // tab切换相关处理事项
})

// 基本信息
const patientInfoLoading = ref(false)
const patientInfo = ref<any>({})
const fetchPatientInfo = async () => {
    let data = {
        id:props.bedItem.id,
    }
    try {
        const result = (await PatientApi.patientDetail(data))?.data?.result;
        // patientInfoLoading.value = false
        if (typeof result ==='object' && Object.keys(result).length > 0) {
            patientInfo.value = result;
            // patientInfoLoading.value = false
        } else {
            // patientInfoLoading.value = false
        }
    } catch (error) {
        // patientInfoLoading.value = false
    }
}
const reloadPatientInfo = ()=>{
    fetchPatientInfo()
    emits('reloadBedList')
}
// 体征数据


onMounted(() => {
    fetchPatientInfo()

})
</script>

<style scoped>
.detail_title {
    height: 88px;
    padding: 0 24px;
    background-color: #fff;
}

.title_left {
    gap: 12px;
    font-size: 24px;
    color: #00B528;
}

.title_left img {
    width: 48px;
}

.close_btn {
    width: 48px;
}

.detail_content_box {
    /* padding: 24px; */
    /* height: calc(100% - 88px); */
    /* width: 100%; */
}

.detail_tab {
    display: flex;
    gap: 12px;
    padding: 0 0 12px
}

.tab_item {
    height: 40px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    border-radius: 12px 12px 12px 12px;
    border: 1px solid #EEEEEE;
    color: #636676;
    background-color: #FFF;
    font-size: 16px;
}

.active_tab_item {
    background: #00B528;
    border: 1px solid #00B528;
    color: #FFF;
}

.detail_content {
    height: calc(100% - 52px);
    width: 100%;
    background-color: #fff;
    border-radius: 12px;
}
</style>
