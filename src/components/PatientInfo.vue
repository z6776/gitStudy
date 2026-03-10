<template>
    <div class="patient_info_box">
        <div class="patient_left">
            <div class="patient_box_title font_bold">
                个人信息
            </div>
            <div class="patient_item_input">
                <div class="input_label">姓名：</div>
                <div class="input_value">{{ props.patientInfo.name }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">性别：</div>
                <div class="input_value">{{ props.patientInfo.sex ? props.patientInfo.sex == 1 ? '男' : "女" : "" }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">民族：</div>
                <div class="input_value">{{ props.patientInfo.nationality }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">出生日期：</div>
                <div class="input_value">{{ props.patientInfo.birthday }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">身份证号：</div>
                <div class="input_value">{{ props.patientInfo.id_card }}</div>
            </div>
            <div class="patient_item_input patient_item_textarea">
                <div class="input_label">家庭住址：</div>
                <div class="input_value">{{ props.patientInfo.address }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">紧急联系人：</div>
                <div class="input_value">{{ props.patientInfo.emergency_contact }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">联系人电话：</div>
                <div class="input_value">{{ props.patientInfo.emergency_phone }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">联系人关系：</div>
                <div class="input_value">{{ props.patientInfo.emergency_relation }}</div>
            </div>
            <div class="patient_item_input">
                <div class="input_label">主要沟通语言：</div>
                <div class="input_value">{{ props.patientInfo.language }}</div>
            </div>
        </div>
        <div class="patient_right">
            <div class="patient_box_title font_bold">
                住院信息
            </div>
            <div class="flex_space_between">
                <div class="patient_right_item">
                    <div class="patient_item_input">
                        <div class="input_label">入院时间：</div>
                        <div class="input_value">{{ props.patientInfo.start }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">科别名称：</div>
                        <div class="input_value">{{ props.patientInfo.department }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">病历号：</div>
                        <div class="input_value">{{ props.patientInfo.medical_record_number }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">责任医生：</div>
                        <div class="input_value">{{ props.patientInfo.responsible_doctor }}</div>
                    </div>
                    <div class="patient_item_input patient_item_textarea">
                        <div class="input_label">病情：</div>
                        <div class="input_value">{{ props.patientInfo.illness }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">护理等级：</div>
                        <div class="input_value">{{ level_of_care_text[props.patientInfo.level_of_care - 1] }}</div>
                    </div>
                </div>
                <div class="patient_right_item short_input">
                    <div class="patient_item_input">
                        <div class="input_label">预定离院日期：</div>
                        <div class="input_value ">{{ props.patientInfo.start }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">入科日期：</div>
                        <div class="input_value ">{{ props.patientInfo.department_in_time }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">住院号：</div>
                        <div class="input_value ">{{ props.patientInfo.patient_num }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">责任护士：</div>
                        <div class="input_value ">{{ props.patientInfo.responsible_nurse }}</div>
                    </div>
                    <div class="patient_item_input patient_item_textarea">
                        <div class="input_label">用药信息：</div>
                        <div class="input_value">{{ props.patientInfo.medication_info }}</div>
                    </div>
                    <div class="patient_item_input">
                        <div class="input_label">病情状态：</div>
                        <div class="input_value ">{{ situation_text[props.patientInfo.situation - 1] }}</div>
                    </div>
                </div>
            </div>
            <div class="patient_item_input patient_item_textarea_2">
                <div class="input_label">病情：</div>
                <div class="input_value">{{ props.patientInfo.precautions }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
const props = defineProps(['patientInfo'])

const level_of_care_text = ['一级护理', '二级护理', '三级护理', '特级护理',]
const situation_text = ['一般', '病危', '病重']
</script>

<style scoped>

.patient_info_box {
    padding: 24px;
    display: flex;
    justify-content: space-between;
}

.patient_left {
    width: 520px;
}

.patient_right {
    width: 980px;
}

.patient_box_title {
    font-size: 18px;
    color: #384951;
    padding-left: 10px;
    position: relative;
    padding-bottom: 24px;
    border-bottom: 1px solid #EEEEEE;
    margin-bottom: 24px;
    line-height: 18px;
}

.patient_box_title::before {
    width: 3px;
    content: "";
    height: 18px;
    background-color: #00B528;
    position: absolute;
    left: 0;
    top: 0;
}

.patient_item_input {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.input_label {
    font-size: 16px;
    color: #636676;
    line-height: 48px;
}

.input_value {
    width: 396px;
    height: 48px;
    background: #F5F7FB;
    border-radius: 8px;
    color: #384951;
    font-size: 16px;
    line-height: 48px;
    padding: 0 12px;
}

.patient_item_textarea {
    height: 108px
}

.patient_item_textarea .input_value {
    height: 108px;
    line-height: 28px;
    padding: 12px;
}

.patient_item_textarea_2 .input_value {
    width: 888px;
    height: 240px;
    line-height: 28px;
    padding: 12px;
}

.patient_right_item {
    width: 478px;
}

.patient_right_item .input_value {
    width: 386px
}

.short_input .input_value {
    width: 354px !important;
}
</style>
