<template>
 <div class="customModal" v-if="bindDailogVisible">
    <div  class="dialog_box" title="新增人员档案" :show-close="false" top="6vh"  >
    <div class="form-container">
        <div class="patient_form_box" v-if="title_hz_item_picth == 0">
            <el-form :model="patientForm"   :rules="patientFormRules" label-width="auto" ref='patientFormRef' label-position="left">
                <el-row>
                    <el-col :span="9">
                        <div class="patient_form_title">个人信息</div>
                        <el-form-item label="姓名" prop="name">
                            <el-input class="patient_input_width" maxlength="10" type="text" v-model="patientForm.name"
                                placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-select class="patient_input_width" v-model="patientForm.sex" placeholder="请选择">
                                <el-option :value="1" label="男"></el-option>
                                <el-option :value="2" label="女"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族" prop="nationality">
                            <el-select class="patient_input_width" v-model="patientForm.nationality" placeholder="请选择">
                                <el-option v-for="item in nationalityOptions" :key="item.id" :value="item.name"
                                    :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker class="patient_input_width_468" v-model="patientForm.birthday" type="date"
                                placeholder="请选择" format="YYYY-MM-DD" :disabled-date="birthdayPick"
                                value-format="YYYY-MM-DD" />
                        </el-form-item>
                        <el-form-item label="身份证号" prop="id_card">
                            <el-input class="patient_input_width" maxlength="18" type="text"
                                v-model="patientForm.id_card" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭住址" prop="address">
                            <el-input class="patient_input_width" maxlength="60" type="textarea" 
                                :rows="3" v-model="patientForm.address" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="紧急联系人" prop="emergency_contact">
                            <el-input class="patient_input_width" maxlength="11" type="text"
                                v-model="patientForm.emergency_contact" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人电话" prop="emergency_phone">
                            <el-input class="patient_input_width" maxlength="11" type="text"
                                v-model="patientForm.emergency_phone" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人关系" prop="emergency_relation">
                            <el-input class="patient_input_width" maxlength="10" type="text"
                                v-model="patientForm.emergency_relation" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="主要沟通语言" prop="language">
                            <el-select class="patient_input_width" v-model="patientForm.language" placeholder="请选择">
                                <el-option v-for="item in languagesOptions" :key="item" :value="item"
                                    :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="其他语言" prop="language_other" v-if="patientForm.language == '其他'">
                            <el-input class="patient_input_width" maxlength="10" type="text"
                                v-model="patientForm.language_other" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="15">
                        <div class="patient_form_title">住院信息</div>
                        <div class="flex justify-between gap-24px" style="align-items: start;">
                            <div>
                                <el-form-item label="入院时间" prop="start">
                                    <el-date-picker class="patient_input_width_439 w-439px" v-model="patientForm.start"
                                        type="datetime" placeholder="请选择" format="YYYY-MM-DD HH:mm:ss"
                                        value-format="YYYY-MM-DD HH:mm:ss" />
                                </el-form-item>
                                <el-form-item label="科室名称" prop="department">
                                    <el-input class="patient_input_width w-439px" maxlength="10" type="text"
                                        v-model="patientForm.department" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="病历号" prop="medical_record_number">
                                    <el-input class="patient_input_width w-439px"
                                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                        oninput="if(value.length>10)value=value.slice(0,10)" type="number"
                                        v-model="patientForm.medical_record_number" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="责任医生" prop="responsible_doctor">
                                    <el-input class="patient_input_width w-439px" maxlength="10" type="text"
                                        v-model="patientForm.responsible_doctor" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="病情" prop="illness">
                                    <el-input class="patient_input_width" maxlength="60" type="textarea" 
                                        :rows="3" v-model="patientForm.illness" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="护理等级" prop="level_of_care">
                                    <el-select class="patient_input_width w-439px" v-model="patientForm.level_of_care"
                                        placeholder="请选择">
                                        <el-option :value="4" label="特级护理"></el-option>
                                        <el-option :value="1" label="一级护理"></el-option>
                                        <el-option :value="2" label="二级护理"></el-option>
                                        <el-option :value="3" label="三级护理"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="预定离院日期" prop="end" align="right">
                                    <el-date-picker class="patient_input_width_468" v-model="patientForm.end" type="date"
                                        placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                                </el-form-item>
                                <el-form-item label="入科日期" prop="department_in_time">
                                    <el-date-picker class="patient_input_width_468" v-model="patientForm.department_in_time"
                                        type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                                </el-form-item>
                                <el-form-item label="住院号" prop="patient_num">
                                    <el-input class="patient_input_width"
                                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                        oninput="if(value.length>10)value=value.slice(0,10)" type="number"
                                        v-model="patientForm.patient_num" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="责任护士" prop="responsible_nurse">
                                    <el-input class="patient_input_width" maxlength="10" type="text"
                                        v-model="patientForm.responsible_nurse" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="用药信息" prop="medication_info">
                                    <el-input class="patient_input_width" maxlength="60" type="textarea" 
                                        :rows="3" v-model="patientForm.medication_info" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="病情状态" prop="situation">
                                    <el-select class="patient_input_width" v-model="patientForm.situation"
                                        placeholder="请选择">
                                        <el-option :value="1" label="一般"></el-option>
                                        <el-option :value="2" label="病危"></el-option>
                                        <el-option :value="3" label="病重"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <el-form-item label="注意事项" prop="precautions">
                            <el-input maxlength="500" type="textarea" class="ep-textarea__inner_100" :rows="6" v-model="patientForm.precautions" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="复诊时间" v-if="patientForm.status == 2" prop="return_visit" align="right">
                            <el-date-picker class="patient_input_width" :disabled-date="limitTime2" v-model="patientForm.return_visit" type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="sfxx" v-if="title_hz_item_picth == 1" v-loading="hzLoading">
            <div class="sfxx_item">
                <div class="sfxx_item_l">研究阶段：</div>
                <div class="sfxx_item_r">{{hzData.stage}}</div>
            </div>
            <div class="sfxx_item">
                <div class="sfxx_item_l">医生随访次数： </div>
                <div class="sfxx_item_r">{{hzData.visit_count}}</div>
            </div>
            <div class="sfxx_item">
                <div class="sfxx_item_l">主动反馈异常：</div>
                <div class="sfxx_item_r">{{hzData.is_reply}}</div>
            </div>
            <div class="sfxx_item">
                <div class="sfxx_item_l">是否完成宣教：</div>
                <div class="sfxx_item_r">{{hzData.is_look}}</div>
            </div>
        </div>
          </div>
        <div>
            <div class="dialog-footer p-b-20px">
                <el-button size="large" type="info" @click="closeDialog()">取消</el-button>
        
                <el-button size="large" type="primary"  @click="submitForm()">
                    提交
                </el-button>
            </div>
        </div>
       </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, type Ref,ref,reactive,nextTick } from 'vue';
import  { type PatientInfoType, sexStatus,MonitoringLevel,fixedLabelStatus} from "@/views/index/types/index";
import { ElLoading, ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { getAssetsFileV2,getAssetsIndexFileNew } from "@/utils/function/function";
import { dateFtt } from '@/utils/date/dateFtt';
import { nationalityOptions, languagesOptions } from '@/utils/baseOptions/baseOptions';
import PatientApi from '@/api/patient';
import { useRoute, useRouter } from 'vue-router';
import type {  PatientForm  } from '@/interface/interface';
import { idCard_reg } from '@/utils/validate/idCard';
import { phone_reg } from '@/utils/validate/phone';
const router = useRouter();

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    bedNumber:{
        type: String,
        require:true
    }
})

const birthdayPick = (date: Date) => {
        return date > new Date()
}

const closeDialog = () => {
    emits('update:modelValue', false)
}
const emits = defineEmits(['settagDialog',"update:modelValue",'addTag','refresh'])

const bindDailogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emits('update:modelValue', val)
    }
})


// 表单：新增/修改
const patientForm = reactive<PatientForm>({
    name: '',
    birthday: "",
    start: '',
    sex: "",
    nationality: "",
    id_card: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    emergency_relation: "",
    language: "",
    department: "",
    medical_record_number: "",
    responsible_doctor: "",
    illness: "",
    level_of_care: "",
    precautions: "",
    department_in_time: '',
    responsible_nurse: "",
    medication_info: "",
    patient_num: "",
    end: "",
    language_other: "",
    situation: "",
    bed_id: '',
});

const hzData = ref<any>({})
const hzLoading = ref<boolean>(false)
const title_hz_item_picth = ref<number>(0);
const hzItemPicth = async (key: number) => {
    title_hz_item_picth.value = key
   
    if(key==1){
        hzLoading.value = true
        const data = {
            id:patientForm.id
        }
        const result = (await PatientApi.visit_message(data))
        hzData.value = result.data.result
        hzLoading.value = false
      
    }
}
const checkIdCard = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (value && !idCard_reg.test(value)) {
            callback(new Error('身份证号格式不正确'))
        } else {
            callback()
        }
    }, 200);
}

const checkPhone = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
        if (value && !phone_reg.test(value)) {
            callback(new Error('手机号格式不正确'))
        } else {
            callback()
        }
    }, 200);
}
const patientFormRules = reactive<FormRules<typeof patientForm>>({
    name: [
        { required: true, message: "请输入姓名", trigger: 'blur' }
    ],
    birthday: [
        { required: true, message: "请选择出生日期", trigger: 'blur' }
    ],
    start: [
        { required: true, message: "请选择入院时间", trigger: 'blur' }
    ],
    patient_num: [
        { required: true, message: "请选择住院号", trigger: 'blur' }
    ],
    id_card: [
        { validator: checkIdCard, trigger: 'blur' }
    ],
    emergency_phone: [
        { validator: checkPhone, trigger: 'blur' }
    ],
    situation: [
        { required: true, message: "请选择病情状态", trigger: 'change' }
    ],
    level_of_care: [
        { required: true, message: "请选择护理等级", trigger: 'change' }
    ]
})
 
const patientFormRef = ref<FormInstance>();
 


const limitTime2 = (time: any) => {
    if(patientForm.end){
        const aaa = patientForm.end.replace(/\-/g,'/')
        var date = new Date(Date.parse(aaa))  //当前日期2021-3-9
        var fff = new Date(date.setDate(date.getDate()))
        return time.getTime() < fff
    }
}


const submitForm = (e?:any) => {
    const formEl = patientFormRef.value //elform实例
    if (!formEl) return
    formEl.validate(async (valid:any) => { //表单验证
        if (valid) {
            const Formloading = ElLoading.service({
                target: '._loading'
            })
            let data = Object.assign({}, patientForm);
            data.plan_end = data.end;
            delete data.end;
            if (data.language_other) {
                data.language = data.language_other
                delete data.language_other
            }
            try {
                const result = await PatientApi.addPatient({...data,
                     group_start: dateFtt("yyyy-mm-dd hh:MM:ss")
                }) 
                if (result) {
                    ElMessage.success('操作成功')
                    Formloading.close()

                    reset()
                }
            } catch (error) {
                Formloading.close()
            }
        } else {
            // Formloading.close()
        }
    })
}


const reset = () => {
     closeDialog();
     emits("refresh")
}

</script>
<style scoped>
    

.patient_form_box {
    padding: 20px 40px;
    padding-bottom:0;
   
}
  :deep(.ep-form-item__label){
        position: relative;
  }
     :deep( .ep-form-item__label:before){
            position: absolute;
            color:#F7413D;
            left:-10px;
        }
.patient_form_box .ep-form-item{
    margin-bottom: 16px;
}

.patient_form_title {
    position: relative;
    font-size: 16px;
    color: #384951;
    padding-left: 10px;
    font-weight: bold;
    margin-bottom: 20px;
}

.patient_form_title::before {
    content: "";
    width: 3px;
    height: 16px;
    background-color: #07C160;
    position: absolute;
    left: 0;
    border-radius: 3px;
    top: 3px;
}

.setTips {
    text-align: center;
}

.config_form_width {
    width: 80% !important;
}

.config_select_width {
    width: 130px;
}

.un_box {
    text-align: center;
    margin: 50px;
}

.title_hz {
    height: 40px;
    background: #E6FDED;
    border-radius: 0px 0px 0px 0px;
    display: flex;
    align-items: center;

}

.title_hz_item {
    width: 184px;
    height: 40px;
    /* background: #00B528; */
    border-radius: 0px 0px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.title_hz .title_hz_item_picth {
    width: 184px;
    height: 40px;
    background: #00B528;
    border-radius: 0px 0px 0px 0px;
    color: #fff;
}

.sfxx {
    height: 357px;
    padding: 48px 60px;

}

.sfxx_item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #636676;
    margin-bottom: 20px;
}
.patient_management_box{
    padding: 20px;
    position: relative;
}
.btns_box .ep-button{
    padding: 0;
    box-sizing: border-box;
    margin-left: 0px;
}
:deep(
.ep-textarea__inner_100 .ep-textarea__inner){
    min-height: 100px !important;
}

.ccid {
    width: 180px
}
 :deep(.patient_input_width_468){
 width:468px !important;
}

.w-439px{
    width: 439px !important;
}
.patient_input_width{
    width:468px;
}
 :deep(.patient_input_width_439){
   width: 439px !important;
}
.headerBox{
    background-color: #F5F7FB;
    padding: 0px 20px;
    height: 80px;
    font-weight: bold;
    font-size: 24px;
    color: #384951;
    border-radius: 10px 10px 0px 0px;
    line-height: 80px;
}
.customModal{
    padding:20px;
}
.customModal .dialog_box{
     height: auto;
     background-color: #fff;
     border-radius: 10px;
     position: relative;
}
.dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
}
.form-container{
  will-change: transform;
  contain: layout style paint;
}
</style>