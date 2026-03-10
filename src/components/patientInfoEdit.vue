<template>
  <el-form
    :model="form"
    :rules="patientFormRules"
    :disabled="disabled"
    label-width="auto"
    ref="formRef"
    label-position="left"
    class="patient-info-form _loading"
  >
    <div class="info-row" v-loading="unloading">
      <!-- 个人信息 -->
      <div class="info-col-left">
        <div class="info-title">个人信息</div>
        <el-form-item label="姓名：" prop="name">
          <el-input
            class="patient_input_width"
            maxlength="10"
            type="text"
            v-model.trim="form.name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select class="patient_input_width" v-model="form.sex" placeholder="请选择">
            <el-option :value="1" label="男"></el-option>
            <el-option :value="2" label="女"></el-option>
            <el-option :value="0" label="未知" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="民族：" prop="nationality">
          <el-select class="patient_input_width" v-model="form.nationality" placeholder="请选择">
            <el-option
              v-for="item in nationalityOptions"
              :key="item.id"
              :value="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期：" prop="birthday">
          <el-date-picker
            :prefix-icon="customPrefix"
            class="customPrefix patient_input_width_468"
            v-model="form.birthday"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            :disabled-date="birthdayPick"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="身份证号：" prop="id_card">
          <el-input
            class="patient_input_width"
            maxlength="18"
            type="text"
            v-model="form.id_card"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="家庭住址："
          prop="address"
          style="align-items: flex-start; height: 80px"
        >
          <el-input
            class="patient_input_width"
            maxlength="60"
            type="textarea"
            :rows="3"
            v-model="form.address"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人：" prop="emergency_contact">
          <el-input
            class="patient_input_width"
            maxlength="11"
            type="text"
            v-model="form.emergency_contact"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：" prop="emergency_phone">
          <el-input
            class="patient_input_width"
            maxlength="11"
            type="text"
            v-model="form.emergency_phone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人关系：" prop="emergency_relation">
          <el-input
            class="patient_input_width"
            maxlength="10"
            type="text"
            v-model="form.emergency_relation"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="主要沟通语言：" prop="language">
          <el-select class="patient_input_width" v-model="form.language" placeholder="请选择">
            <el-option
              v-for="item in languagesOptions"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他语言：" prop="language_other" v-if="form.language == '其他'">
          <el-input
            class="patient_input_width"
            maxlength="10"
            type="text"
            v-model="form.language_other"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </div>
      <!-- 住院信息 -->
      <div class="info-col">
        <div class="info-title">住院信息</div>
        <div class="container">
          <el-form-item label="入院时间：" prop="start">
            <el-date-picker
              :prefix-icon="customPrefix"
              class="customPrefix patient_input_width_439"
              v-model="form.start"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="预定离院日期：" prop="end">
            <el-date-picker
              :prefix-icon="customPrefix"
              class="customPrefix patient_input_width_495 w-439px"
              v-model="form.end"
              type="date"
              placeholder="请选择"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="科室名称：" prop="department">
            <el-input
              class="patient_input_width"
              maxlength="10"
              type="text"
              v-model="form.department"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="入科日期：" prop="department_in_time">
            <el-date-picker
              :prefix-icon="customPrefix"
              class="customPrefix patient_input_width_495 w-439px"
              v-model="form.department_in_time"
              type="date"
              placeholder="请选择"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="病历号：" prop="medical_record_number">
            <el-input
              class="patient_input_width w-439px"
              maxlength="10"
              type="text"
              v-model="form.medical_record_number"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="住院号：" prop="patient_num">
            <el-input
              class="patient_input_width_495 w-439px"
              maxlength="10"
              type="text"
              v-model="form.patient_num"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item label="责任医生：" prop="responsible_doctor">
            <el-input
              class="patient_input_width w-439px"
              maxlength="10"
              type="text"
              v-model="form.responsible_doctor"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="责任护士：" prop="responsible_nurse">
            <el-input
              class="patient_input_width_495 w-439px"
              maxlength="10"
              type="text"
              v-model="form.responsible_nurse"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item label="床位号：" prop="responsible_nurse">
            <el-input
              class="patient_input_width w-439px"
              maxlength="10"
              type="text"
              v-model="form.bed_number"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item label="病症：" prop="responsible_nurse">
            <el-select
              class="patient_input_width_495 w-439px"
              v-model="form.disease_tag_id"
              placeholder="请选择"
            >
              <el-option
                :value="value.id"
                :label="value.name"
                v-for="(value, index) in diseaseList"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="病情：" prop="illness" style="align-items: flex-start; height: 80px">
            <el-input
              class="patient_input_width w-439px h-122px"
              maxlength="60"
              type="textarea"
              :rows="3"
              v-model="form.illness"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item label="用药信息：" prop="medication_info" style="align-items: flex-start">
            <el-input
              class="patient_input_width_495 w-439px h-122px"
              maxlength="60"
              type="textarea"
              :rows="3"
              v-model="form.medication_info"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="护理等级：" prop="level_of_care">
            <el-select
              class="patient_input_width w-439px"
              v-model="form.level_of_care"
              placeholder="请选择"
            >
              <el-option :value="4" label="特级护理"></el-option>
              <el-option :value="1" label="一级护理"></el-option>
              <el-option :value="2" label="二级护理"></el-option>
              <el-option :value="3" label="三级护理"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病情状态：" prop="situation">
            <el-select
              class="patient_input_width_495 w-439px"
              v-model="form.situation"
              placeholder="请选择"
            >
              <el-option :value="1" label="一般"></el-option>
              <el-option :value="2" label="病危"></el-option>
              <el-option :value="3" label="病重"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          label="注意事项："
          prop="precautions"
          style="width: 100%; align-items: flex-start"
        >
          <el-input
            maxlength="500"
            type="textarea"
            class="h-218px"
            :rows="3"
            v-model="form.precautions"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </div>
    </div>
  </el-form>
  <div class="form-footer">
    <el-button type="info" size="large" @click="cancel">取消</el-button>
    <template v-if="ptype === 'edit'">
      <el-button type="primary" size="large" @click="edit()" v-if="disabled">编辑</el-button>
      <el-button type="primary" size="large" @click="onSubmit" v-if="!disabled">提交</el-button>
    </template>
    <template v-else>
      <el-button type="primary" size="large" @click="submitForm">提交</el-button>
    </template>
  </div>
  <custom-dialog
    v-model="unDialogVisible"
    append-to-body
    class="_loading"
    title=""
    :show-close="false"
    :width="`${(498 / 1920) * 100}%`"
    top="25vh"
  >
    <div class="un_box">
      <div>是否保存编辑内容?</div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" type="info" @click="cancelForm">否</el-button>
        <el-button size="large" type="primary" @click="onSubmit()"> 是 </el-button>
      </div>
    </template>
  </custom-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, inject, onMounted, shallowRef, h } from 'vue'
import { nationalityOptions, languagesOptions } from '@/utils/baseOptions/baseOptions'
import BedApi from '@/api/bed'
import DiseaseApi from '@/api/desease'
import { idCard_reg } from '@/utils/validate/idCard'
import { phone_reg } from '@/utils/validate/phone'
import PatientApi from '@/api/patient'
import { ElLoading, ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { dateFtt } from '@/utils/date/dateFtt'
import type { Ref } from 'vue'
import { getAssetsFileV4, getRem } from '@/utils/function/function'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const props = withDefaults(
  defineProps<{
    modelValue: any
    ptype: string
  }>(),
  {
    ptype: 'edit',
  },
)
const emits = defineEmits(['update:modelValue', 'submit', 'cancel'])

const form = ref({ ...props.modelValue })

const customPrefix = shallowRef({
  render() {
    return h('img', {
      src: getAssetsFileV4('date.png'), // 替换为你的图片路径
      style: {
        width: getRem(28) + 'px', // 设置合适的宽度
        height: getRem(28) + 'px', // 设置合适的高度
      },
    })
  },
})

watch(
  () => props.ptype,
  (val) => {
    if (val === 'add') {
      disabled.value = false
    }
  },
  { deep: true, immediate: true },
)

const patientForm = reactive<any>({
  bed_id: '',
  name: '',
  birthday: '',
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
  plan_end: '',
  language_other: '',
  situation: '',
})

const checkIdCard = (rule: any, value: any, callback: any) => {
  setTimeout(() => {
    if (value && !idCard_reg.test(value)) {
      callback(new Error('身份证号格式不正确'))
    } else {
      callback()
    }
  }, 200)
}

const checkPhone = (rule: any, value: any, callback: any) => {
  setTimeout(() => {
    if (value && !phone_reg.test(value)) {
      callback(new Error('手机号格式不正确'))
    } else {
      callback()
    }
  }, 200)
}

const patientFormRules = reactive<FormRules<typeof patientForm>>({
  name: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
  birthday: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
  start: [{ required: true, message: '请选择入院时间', trigger: 'blur' }],
  id_card: [{ validator: checkIdCard, trigger: 'blur' }],
  emergency_phone: [{ validator: checkPhone, trigger: 'blur' }],
  situation: [{ required: true, message: '请选择病情状态', trigger: 'blur' }],
  level_of_care: [{ required: true, message: '请选择护理等级', trigger: 'blur' }],
})

const birthdayPick = (date: Date) => {
  return date > new Date()
}
const disabled = ref(true)

const formRef = ref()

let unloading = inject<Ref<boolean>>('loading', ref(false))
function onSubmit() {
  let checked = unbindBedList.value.find((item: any) => form.value.bed_number === item.bed_number)
  if (!checked) {
    return ElMessage.error('输入床号有误，当前无此床位，请检查床号输入是否正确。')
  }
  form.value.bed_id = checked.id
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      unloading.value = true
      emits('submit', form.value)
      unDialogVisible.value = false
      //   disabled.value = true;
      //   loading.value = false;
    }
  })
}

const submitForm = (e?: any) => {
  const formEl = formRef.value //elform实例
  let checked = unbindBedList.value.find((item: any) => form.value.bed_number === item.bed_number)
  if (!checked) {
    return ElMessage.error('输入床号有误，当前无此床位，请检查床号输入是否正确。')
  }
  form.value.bed_id = checked.id
  formEl.validate(async (valid: any) => {
    //表单验证
    if (valid) {
      const Formloading = ElLoading.service({
        target: '._loading',
      })
      let data = Object.assign({}, form.value)
      data.plan_end = data.end
      delete data.end
      if (data.language_other) {
        data.language = data.language_other
        delete data.language_other
      }
      try {
        const result = await PatientApi.addPatient({
          ...data,
          group_start: dateFtt('yyyy-mm-dd hh:MM:ss'),
        })
        if (result) {
          ElMessage.success('操作成功')
          Formloading.close()
          router.back()
        }
      } catch (error) {
        Formloading.close()
      }
    } else {
      // Formloading.close()
    }
  })
}

let unDialogVisible = ref(false)
let oldform = ref({ ...form.value })
const edit = () => {
  disabled.value = false
  oldform.value = JSON.stringify({ ...form.value })
}
const cancel = () => {
  emits('cancel')
}
const unbindBedList = ref<any>([])
const getBedList = async () => {
  try {
    let personList = [
      {
        id: form.value.bed_id,
        bed_number: form.value.bed_number,
      },
    ]
    let res = await BedApi.getBedList({ page: 1, perPage: 999, use: 1 })

    if (Array.isArray(res.data?.result?.data) && res.data?.result?.data.length > 0) {
      unbindBedList.value = [...personList, ...res.data?.result?.data]
    } else {
      unbindBedList.value = [...personList]
    }
  } catch (error) {}
}
const diseaseList = ref<any>([])
const getDiseaseList = async () => {
  try {
    let res = await DiseaseApi.getTagList()

    if (Array.isArray(res.data?.result) && res.data?.result.length > 0) {
      diseaseList.value = res.data?.result
    } else {
      diseaseList.value = []
    }
  } catch (error) {}
}
// /api/disease/tag_list

watch(
  () => props.modelValue,
  (val) => {
    form.value = { ...val }
    getBedList()
    getDiseaseList()
  },
  { deep: true },
)

const cancelForm = () => {
  unDialogVisible.value = false
  disabled.value = true
  form.value = JSON.parse(oldform.value)
}
</script>

<style scoped>
:deep(.ep-form-item__label) {
  position: relative;
}
:deep(.ep-form-item__label:before) {
  position: absolute;
  color: #f7413d;
  left: -10px;
}
.patient-info-form {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 100%;
  padding-bottom: 0;
}

:deep(.ep-textarea__inner) {
  box-shadow: none !important;
}
:deep(.h-218px .ep-textarea__inner) {
  height: 100%;
}
:deep(.h-122px .ep-textarea__inner) {
  height: 100%;
}

:deep(.el-form-item__label-wrap) {
  height: 40px;
  display: flex;
  align-items: center;
}
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 0.0125rem var(--el-input-border-color, var(--el-border-color)) inset !important;
  width: 384px;
  height: 40px !important;
}
:deep(.el-select__wrapper) {
  height: 40px;
}
:deep(.el-form-item) {
  height: 40px;
}

.un_box {
  text-align: center;
  margin: 50px;
}
:deep(.asterisk-left .el-form-item__label-wrap .el-form-item__label::before) {
  box-sizing: border-box;
  margin-left: 10px;
}
:deep(.is-required) {
  margin-left: 0px !important;
}
:deep(.customPrefix .ep-input__prefix) {
  width: 28px !important;
  margin-right: 0px;
}

.info-row {
  display: flex;
  gap: 32px;
  width: 100%;
}
.info-col {
  flex: 1;
  min-width: 0;
}
.info-title {
  font-size: 18px;
  font-weight: bold;
  color: #384951;
  padding-left: 8px;
  position: relative;
  padding-bottom: 24px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 24px;
  line-height: 18px;
}
.info-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0%;
  width: 3px;
  height: 18px;
  background: #00b528;
}

.info-col-left .patient_input_width {
  width: 100%;
  min-width: 468px;
}

:deep(.patient_input_width_439) {
  width: 439px !important;
}
:deep(.patient_input_width_468) {
  width: 468px !important;
}
:deep(.patient_input_width_495) {
  width: 495px !important;
}
.form-footer {
  text-align: center;
  padding: 10px 0 20px;
}

.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  /* gap: 12px; */
}
</style>
