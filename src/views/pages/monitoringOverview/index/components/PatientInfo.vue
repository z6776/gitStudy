<template>
  <div class="patient-info-container">
    <!-- 卡片1：患者基本信息 -->
    <div class="card-patient-basic">
      <p class="card-title">患者信息</p>
      <div class="basic-info">
        <!-- 左边头像 -->
        <div class="avatar-placeholder">
            <img src="@/assets/images/avatar (2).png" alt="" class="w-full h-full">
        </div>
        <!-- 右边信息区域 -->
        <div class="patient-info-right">
          <!-- 上面名字 -->
          <div class="patient-name">{{ maskName(patientName)  }}</div>
          <!-- 下面详细信息 -->
          <div class="patient-details">
            <div class="detail-item pr-10px borderRight relative">{{ patientGender }}</div>
            <div class="detail-item pr-10px pl-10px borderRight relative">{{ patientAge }}</div>
            <div class="detail-item pr-10px pl-10px borderRight relative">{{ patientHeight }}cm</div>
            <div class="detail-item pl-10px">{{ patientWeight }}kg</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡片2：病史、生活习惯、联系方式、紧急联系人 -->
    <div class="card-patient-info">
      <!-- 病史信息 -->
      <div class="info-section">
        <div class="section-title">病史:</div>
        <div class="tags">
          <span
            class="tag medical-history-tag"
            v-for="(tag, index) in medicalHistory"
            :key="index"
            >{{ tag }}</span
          >
        </div>
      </div>

      <!-- 生活习惯信息 -->
      <div class="info-section">
        <div class="section-title">生活习惯:</div>
        <div class="lifestyle-tags">
          <span class="lifestyle-tag" v-for="(tag, index) in lifestyleHabits" :key="index">{{
            tag
          }}</span>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="info-section">
        <div class="section-title">联系方式:</div>
        <div class="contact-info">{{ contactPhone }}</div>
      </div>

      <!-- 紧急联系人 -->
      <div class="info-section">
        <div class="section-title">紧急联系人:</div>
        <div class="contact-info">{{ emergencyContact }}</div>
      </div>
    </div>

    <!-- 卡片3：设备信息 -->
    <div class="card-device-info">
      <div class="device-content">
        <div class="watch-image">
          <img src="@/assets/watch/screenWatch.png" alt="手表型号" />
        </div>
        <div class="device-info">
          <p class="color-[#24B287]  font-bold title">设备型号: {{ deviceModel }}</p>
          <p class="color-[#384951]  mb2vh subtitle">已绑定{{bindDay}}天, 佩戴{{wearDay}}天</p>
          <p class="color-[#24B287]  font-bold title">设备CCID:</p>
          <p class="color-[#384951] subtitle">{{ deviceId }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,nextTick,computed, toRefs, watch } from 'vue'
import { usePaientInfo } from "@/stores/paientinfo";
import { calculateAge,getDefaultValue,maskName  } from "@/utils/function/function";
const { paientInfo } = toRefs(usePaientInfo());

const getDay = (time:number)=>{
      if(!time){
         return "--"
      }
      let d = new Date(Math.floor(time*1000)).setHours(0,0,0,0);
      let starttime = new Date(d).getTime();
      let nowtime = new Date().getTime();
      let day = Math.ceil((nowtime-starttime)/86400000);
      return day;
}


// 患者信息数据
const patientName = paientInfo.value.name || "--";
const patientGender =  paientInfo.value.sex ? (paientInfo.value.sex == 1 ? '男' : "女") : "性别未知"; 
const patientAge = calculateAge(paientInfo.value.birthday)
const patientHeight = 175
const patientWeight = 69
const patientHeartRate = 138
const medicalHistory = ['高血压', '肾病', '糖尿病']
const lifestyleHabits = ['饮酒清淡', '素食为主', '经常抽烟', '偶尔喝酒']
let  contactPhone =ref('--');
const emergencyContact =  paientInfo.value?.emergency_contact || "--";
const deviceModel = ref(paientInfo.value?.model ?? "--")  ;
let wearDay =  ref( paientInfo.value?.pdday ?? "0");
let bindDay =  ref( paientInfo.value?.bind_time ?  getDay(paientInfo.value?.bind_time) : "--");
let deviceId = ref( paientInfo.value?.ccid ?? "--");

watch(()=>paientInfo,(val)=>{
   wearDay.value =  val.value?.pdday ?? "0";
   bindDay.value =  val.value?.bind_time ?  getDay(val.value?.bind_time) : "--"
      deviceId.value = getDefaultValue(val.value?.ccid);
   contactPhone.value = getDefaultValue(val.value?.emergency_phone);
   deviceModel.value =   getDefaultValue(val.value?.model);
},{immediate:true,deep:true});



</script>

<style lang="scss" scoped>
.patient-info-container {
  width: 375px;
  display: flex;
  flex-direction: column;
  gap: calc(20 / 1080 * 100vh);
}
 
.borderRight::after{
    content: "";
  position: absolute;
  width: 1px;
  height: 15px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #636676;
  right: 0;
}

.card {
  background: rgba(255, 255, 255, 0.01);
  box-shadow: inset 0px 0px 24px 0px #276665;
  border-radius: 0.8vh;
  position: relative;
  // overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  width: 300px;
  transform: translateX(-50%);
  left: 50%;
  top: 0px;
  height: 2px;
  background: linear-gradient(90deg, transparent, RGBA(83, 219, 152, 0.9), transparent);
  z-index: 1;
}
.card::after {
  content: '';
  position: absolute;
  width: 300px;
  transform: translateX(-50%);
  left: 50%;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, RGBA(83, 219, 152, 0.9), transparent);
  z-index: 1;
}

.card-patient-basic {
  padding: 1.85vh 2.22vh;
  height: 12.4vh;
  background: #fff;
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #EEEEEE;
  position: relative;
    box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);
}
.card-title {
  font-size: calc(18 / 1080 * 100vh);
  color:#384951;
  font-weight: bold;
  margin-bottom: 1.11vh;
}

.card-patient-info {
  height: calc(532 / 1080 * 100vh);
  padding: calc(32 / 1080 * 100vh) 52px calc(40 / 1080 * 100vh) 24px;
  background: #ffffff;
  border: 1px solid #EEEEEE;
  border-radius: 12px;
    box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);
  
}

.card-device-info {
  height: calc(186 / 1080 * 100vh);
  background: #fff;
  padding: calc(32 / 1080 * 100vh) 24px;
    box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);
}

.basic-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.patient-info-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avatar-placeholder {
  width: 5.09vh;
  height: 5.09vh;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.patient-name {
  font-size: calc(24 / 1080 * 100vh);
  line-height: calc(24 / 1080 * 100vh);;
  font-weight: bold;
  color: #24b287;
}

.patient-details {
  display: flex;
  justify-content: space-between;
}

.detail-item {
  font-weight: 500;
  font-size: calc(16 / 1080 * 100vh);;
  color: #636676;
}

.info-section {
  margin-bottom: calc(24 / 1080 * 100vh);
  padding-bottom: calc(24 / 1080 * 100vh);;
  border-bottom: 1px solid #EEEEEE;

  &:last-child {
    // margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.section-title {
  font-size: calc(18 / 1080 * 100vh);
  color: #24b287;
  margin-bottom: 1vh;
  font-weight: bold;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.lifestyle-tags {
  width: 230px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(12 / 1080 * 100vh);
}

.tag {
  padding: calc(4 / 1080 * 100vh) 8px;
  border-radius: 4px;
  font-size: calc(14 / 1080 * 100vh);
  color: #f5f7fb;
  text-align: center;
}

.medical-history-tag {
  color:#F08B2E;
  background: #FFF5EA;
  border: 1px solid #FFF5EA;
}

.lifestyle-tag {
  background: #EAF4FE;
  padding: calc(4 / 1080 * 100vh) 2px;
  border-radius: 4px;
  font-size: calc(14 / 1080 * 100vh);
  color: #0477E0;
  text-align: center;

  border: 1px solid #EAF4FE;
}

.contact-info {
  font-size: calc(18 / 1080 * 100vh);
  color: #384951;
}

.card-device-info .section-title {
  margin-bottom: calc(12 / 1080 * 100vh);;
  font-size: calc(18 / 1080 * 100vh);
  color:#24B287;
  font-weight: bold;
}

.device-content {
  display: flex;
  align-items: center;
  // gap: 1.2vh;
}

.watch-image {
  margin-right: 12px;
  flex-shrink: 0;
}

.watch-image img {
  width: calc(120 / 1080 * 100vh);
  height:  calc(120 / 1080 * 100vh);
}

.device-info {
  flex: 1;
}
.device-info .title{
   font-size: calc(18 / 1080 * 100vh);
   line-height: calc(18 / 1080 * 100vh);
   margin-bottom: calc(4 / 1080 * 100vh);
}
.device-info .subtitle{
   font-size: calc(16 / 1080 * 100vh);
   line-height: calc(16 / 1080 * 100vh);
}

.device-detail {
  font-size: 16px;
  color: #f5f7fb;
  margin: 4px 0;
  line-height: 1.5;
}
</style>
