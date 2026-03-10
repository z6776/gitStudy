<template>
  <div class="sleep p-[20px] relative min-h-100px">
      <HeaderSeach v-model="reportDate" @selectDate="fetchData" yesterday/>

    <!-- <div class="custom_title_box search_sleep mt-0 mb-20px">
      <div class="custom_title">
        {{ paientInfo.bed_number }}床 {{ paientInfo.name }} {{ ccidsub }}
      </div>
      <div class="datepicker mr-auto">
        <el-date-picker
          size="large"
          :cell-class-name="() => 'custom_date_cell'"
          v-model="reportDate"
          type="date"
          placeholder="选择日期"
          @change="fetchData"
          :clearable="false"
        ></el-date-picker>
      </div>
    </div> -->

    <!-- 图表 -->
    <div class="chart_box flex justify-between mt-20px" >
      <div class="w-50% pr-10px" >
        <!-- 睡眠分布 -->
        <sleepdistribution
          :sleepData="sleepData"
          :reportDate="reportDate"
          ref="sleepdistributionRef"
           v-loading="isLoading"
        />
        <!-- 夜间总睡眠 -->
        <total-nighttime-sleep :sleepData="sleepData" v-loading="isLoading"/>
      </div>
      <div class="w-50% pl-10px">
        <!-- 一周睡眠分析 -->
        <weekly-sleep-staging  :sleepData="weekSleepData" v-loading="isLoading"/>
        <!--夜间呼吸率统计  -->
        <nighttime-respiratory-rate :breathInfo="breathInfo" v-loading="isLoading"/>
        <!-- 夜间血氧饱和度数据统计 -->
        <nighttime-blood-oxygen :hrspo2="hrspo2" v-loading="isLoading"/>
      </div>
    </div>
     
  </div>
</template>
<script setup>
const ReportUrl = import.meta.env.VITE_APP_ReportUrl_IP
import { ref, onMounted, toRefs, computed,nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePaientInfo } from '@/stores/paientinfo.ts'
import ActivityStatics from '@/api/analysisReport'
import { dateFtt } from '@/utils/date/dateFtt'
import { md5Str } from './options'
 
const { paientInfo } = toRefs(usePaientInfo())
const router = useRouter()
const reportDate = ref('')

const ccidsub = computed(() => {
  if (paientInfo.value.ccid) {
    return paientInfo.value.ccid?.substr(-5)
  }
})

const sleepData = ref({})
const weekSleepData = ref({})
const breathInfo = ref({})
const hrspo2 = ref({});
const clearData = ()=>{
  sleepData.value = {};
  weekSleepData.value = {};
  breathInfo.value = {}
  hrspo2.value = {};
}
const isLoading = ref(false);
const fetchData = () => {
  isLoading.value = true
  let date = dateFtt('yyyymmdd', reportDate.value)
  // let url = ReportUrl+`hospital_show/api/report/sleep_report_v2?patient_id=56&date=20251105&md5=9f61408e3afb633e50cdf1b20de6f466xoJWeO24ZLU3xibLDv8aGaqN4M33Ee`
  let url = ReportUrl+`hospital_show/api/report/sleep_report_v2?patient_id=${paientInfo.value.id}&date=${date}&md5=${md5Str(paientInfo.value.id)}`
  ActivityStatics.getSyncData({ url: url })
    .then((response) => {
      const result = response.data.result;
      // 是否为空
      if(typeof result.info === 'string'){
         clearData();
         isLoading.value = false
         return;
      }
      sleepData.value = result.info;
      weekSleepData.value = result.sleep_draw_pic_info || {};
      breathInfo.value = result.info.breath_line_info || {};
      hrspo2.value = {
        hr:result.info?.hr_line_info || {},
        spo:result.info?.spo2_line_info || {}
      }
      isLoading.value = false
    })
    .catch((error) => {
        isLoading.value = false
    });
}

onMounted(() => {
  fetchData()
})

const routerToBack = () => {
   router.back();
}
</script>
<style scoped>
 
.search_sleep {
  height: 62px;
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 24px;
}
.datepicker {
  width: 288px;
  margin-left: 20px;
}
:deep(.datepicker .el-input__wrapper) {
  background-color: #f5f7fb;
  box-shadow: none;
}
.custom_title {
  color: #252b50;
  font-size: 24px;
  font-weight: 850;
}

/* 加载动画遮罩 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100vh - 128px);
  background: rgba(255, 255,255, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(36, 178, 135, 0.3);
  border-top: 3px solid #24b287;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #24b287;
  font-size: 16px;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
