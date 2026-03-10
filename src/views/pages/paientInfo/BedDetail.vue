<template>
  <div class="detail_content_box">
    <div class="detail_content">
      <div style="height: 100%" v-if="active_tab == 0">
        <el-scrollbar>
          <PatientInfoEdit
            v-model="patientInfo"
            @submit="onSubmit"
            @cancel="cancel"
            :ptype="ptype"
          ></PatientInfoEdit>
        </el-scrollbar>
      </div>
      <div style="height: 100%" v-if="active_tab == 1">
        <el-scrollbar>
          <BodyData :patient-info="patientInfo"></BodyData>
        </el-scrollbar>
      </div>
      <div style="height: 100%" v-if="active_tab == 2">
        <el-scrollbar>
          <DeviceSet
            :patient-info="patientInfo"
            @reload-patient-info="reloadPatientInfo"
            :loading="patientInfoLoading"
          ></DeviceSet>
        </el-scrollbar>
      </div>
    </div>
    <rightaside @routerTo="routerTo" />
  </div>
</template>

<script setup lang="ts">
import PatientApi from '@/api/patient'
import PatientInfo from '@/components/PatientInfo.vue'
import PatientInfoEdit from '@/components/patientInfoEdit.vue'
import DeviceSet from '@/components/DeviceSet.vue'
import BodyData from '@/components/BodyData.vue'
import { provide, watch } from 'vue'
import { onMounted, ref } from 'vue'
import DeviceApi from '@/api/device'
import { useRoute } from 'vue-router'
import { usePaientInfo } from '@/stores/paientinfo'
const { savePaientInfo } = usePaientInfo()
import { ElLoading, ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import router from '@/router'
const route = useRoute()
const props = defineProps(['isEdit'])
const emits = defineEmits(['close', 'reloadBedList', 'onSubmit', 'cancel'])
const unloading = ref<boolean>(false)
const onSubmit = async (e: any) => {
  let data = Object.assign({}, e)
  if (data.language_other) {
    data.language = data.language_other
    delete data.language_other
  }
  try {
    const result = await PatientApi.editPatient(e)
    if (result) {
      ElMessage.success('操作成功')
    }
    unloading.value = false
  } catch (error) {
    // Formloading.close()
    unloading.value = false
  }
}
provide('loading', unloading)

const routerTo = (e: string) => {
  router.push(e)
}

const cancel = (data: any) => {
  router.back()
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
    id: route.params.id,
  }
  try {
    const result = (await PatientApi.patientDetail(data)).data.result
    if (result) {
      patientInfo.value = { ...result, disease_tag_id: '' }
      //  菜单跳转
      savePaientInfo(patientInfo.value)
    } else {
    }
  } catch (error) {}
}
const reloadPatientInfo = () => {
  fetchPatientInfo()
  emits('reloadBedList')
}
// 体征数据

const ptype = ref('edit')
onMounted(() => {
  if (route.params.id?.includes('add')) {
    // 新增
    ptype.value = 'add'
    let bed_number = (route.params?.id as string)?.split('-')?.[1] ?? ''
    let bed_id = (route.params?.id as string)?.split('-')?.[2] ?? ''
    patientInfo.value = {
      name: '',
      birthday: '',
      bed_id: bed_id,
      bed_number: bed_number,
      start: '',
      sex: '',
      nationality: '',
      id_card: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      emergency_relation: '',
      language: '',
      department: '',
      medical_record_number: '',
      responsible_doctor: '',
      illness: '',
      level_of_care: '',
      precautions: '',
      department_in_time: '',
      responsible_nurse: '',
      medication_info: '',
      patient_num: '',
      end: '',
      language_other: '',
      situation: '',
      disease_tag_id: '',
    }
  } else {
    ptype.value = 'edit'
    fetchPatientInfo()
  }
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
  color: #00b528;
}

.title_left img {
  width: 48px;
}

.close_btn {
  width: 48px;
}

.detail_content_box {
  padding: 24px;
  /* height: calc(100% - 88px); */
  /* width: 100%; */
}

.detail_tab {
  display: flex;
  gap: 12px;
  padding: 0 0 12px;
}

.tab_item {
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #eeeeee;
  color: #636676;
  background-color: #fff;
  font-size: 16px;
}

.active_tab_item {
  background: #00b528;
  border: 1px solid #00b528;
  color: #fff;
}

.detail_content {
  height: calc(100% - 52px);
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
}
</style>
