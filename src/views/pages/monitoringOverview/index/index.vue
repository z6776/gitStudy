<template>
  <div class="monitoring-overview">
    <!-- 主要内容区域 -->
    <div class="content">
      <!-- 左侧患者信息 -->
      <PatientInfo />
      <!-- 中间区域 -->
      <div class="middle-section">
        <!-- 心率/血氧监测 -->
        <HeartRateMonitor ref="HeartRateMonitorRef" :list="list" />
        <!-- 血压监测计划 -->
        <div class="jhdata">
          <div class="card-title">血压监测计划</div>
       <div class=" flex justify-center items-center color-[#636676]  text-[16px] h-15vh" v-if="!(bloodList && bloodList.length)">
                         暂无监护数据。
       </div>
       <div class="ecg-container overflowscroll" v-else>
          <div class="h-3.5185vh w-650px bg-[#EBFAF3] flex justify-between items-center stacy">
                <div class="flex-1 text-center color-[#636676] text-[16px] h-full flex justify-center items-center">
                    序号
                </div>
                <div class="flex-1  text-center color-[#636676] text-[16px] h-full flex justify-center items-center">
                  监测模式
                </div>
                <div class="flex-1  text-center color-[#636676] text-[16px] h-full flex justify-center items-center">
                  计划时间
                </div>
                <div class="flex-1  text-center color-[#636676] text-[16px] h-full flex justify-center items-center">
                  状态
                </div>
          </div>

     
        <div class="timeitem h-5vh w-650px flex justify-between items-center" v-for="(item,index) in bloodList" :key="index">
              <div class="flex-1 text-center color-[#384951] text-[16px] h-full flex justify-center items-center">
                  {{ index+1 }}
              </div>
              <div class="flex-1  text-center color-[#384951] text-[16px] h-full flex justify-center items-center">
                TID
              </div>
              <div class="flex-1  text-center color-[#384951] text-[16px] h-full flex justify-center items-center">
                {{ item.time }}
              </div>
              <div class="flex-1  text-center text-[16px] h-full flex justify-center items-center"
              :class="{'color-[#24B287]':item.status===1,'color-[#DA4343]':item.status===0}"
              >
                {{ item.statusText }}
              </div>
        </div>
    </div>

        </div>
        <!-- 心电图记录组件 -->
        <EcgMonitor @setChartEcg="setChartEcg" />
      </div>

      <!-- 右侧区域 -->
      <div class="right-section">
        <!-- 呼吸率监测 -->
        <BreathingRateMonitor ref="breathingRateMonitoRef" />

        <!-- 血压/体温监测 -->
        <BloodPressureMonitor />

        <!-- 心电监测 -->
        <Electrocardiographic ref="ElectrocardiographiRef" :xdtime="xdtime" />
      </div>
    </div>
      <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载数据中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated,onDeactivated, onUnmounted,nextTick,computed, toRefs, onMounted } from 'vue'
import { getRem,scaleByHeight } from '@/utils/function/function'
import PatientInfo from './components/PatientInfo.vue'
import HeartRateMonitor from './components/HeartRateMonitor.vue'
import BreathingRateMonitor from './components/BreathingRateMonitor.vue'
import BloodPressureMonitor from './components/BloodPressureMonitor.vue'
import EcgMonitor from './components/EcgMonitor.vue'
import FooterNav from '@/views/pages/monitoringandanalysis/components/FooterNav.vue'
import Electrocardiographic from './components/Electrocardiographic.vue'
import { useRouter,useRoute } from 'vue-router'
import { mockDataScreen,hrOptions,spoOptions,respiratoryOptions,electrocardiogramOptions} from "../options/index";
import { dateFtt } from "@/utils/date/dateFtt";
import { usePaientInfo } from "@/stores/paientinfo";
import { useZoomStore } from "@/stores/zoom";
import MonitoringOverviewApi from "@/api/monitoringOverview";
import PatientApi from "@/api/patient";
import { maskName } from "@/utils/function/function";
import ElectrocarDiographicApi from "@/api/electrocardiographic";
import { md5Str } from "@/utils/function/function"
const route = useRoute();
const { paientInfo,savePaientInfo } = toRefs(usePaientInfo());
const { zoom } = useZoomStore(); 
const router = useRouter();
 

const handleName = computed(()=>{
   return maskName(paientInfo.value.name)
})
type statusBlood = {
  time:string,
  status:number,
  statusText:string
}
const bloodList = ref<statusBlood[]>([]);
// 页面状态
const isLoading = ref(true)
const currentTime = ref('')
let timeUpdateInterval: number | null = null

const handleBack = () => {
  router.back();
}
// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[now.getDay()]

  currentTime.value = `${year}-${month}-${day} 星期${weekday} ${hours}:${minutes}:${seconds}`
}
// 1秒钟 250个点  一分钟的数据
type  generateECGDataType = {
  ecgData: [number, number][];
}
const generateECGData = (ecg:number[]):generateECGDataType => {
  let arr = [];
   let second = 1000 / 250;
  for (let i = 0; i < ecg.length; i++) {
    arr.push([Number((new Date().getTime() + i * second).toFixed(0)),ecg[i]]);
  }
 
  return {
    ecgData:arr as [number, number][],
  };
};

// 
const HeartRateMonitorRef = ref<InstanceType<typeof HeartRateMonitor> | null>(null);
const breathingRateMonitoRef = ref<InstanceType<typeof BreathingRateMonitor> | null>(null);
const ElectrocardiographiRef = ref<InstanceType<typeof Electrocardiographic> | null>(null);  
const list = ref<any[]>([]);
const initOptionsList = async (_hrOptions:any,_spoOptions:any) => {
   _hrOptions.xAxis.data = [];
  _hrOptions.series[0].data = [];
  _hrOptions.series[0].markPoint.data = [];
  _spoOptions.xAxis.data = [];
  _spoOptions.series[0].data = [];
  _spoOptions.series[0].markPoint.data = [];
}
const loadMockData = async () => {
  try {
    
    let _res = await MonitoringOverviewApi.monitor_breath({
      patient_id:paientInfo.value?.id
    });
    
    type breath = {
      time:number | null,
      number:string | null
    }
    const last = ref<breath>({
      time:null,
      number:null
    })
    if(_res.data?.result?.list && _res.data?.result.list.length > 0){
          respiratoryOptions.series[0]!.data = _res.data?.result.list.map((v:breath)=>Number(v.number));
            respiratoryOptions.xAxis.data =  _res.data?.result.list.map((v:breath)=>dateFtt("hh:MM",v.time));
            last.value = _res.data?.result?.tail;
    }else{
           respiratoryOptions.series[0]!.data = [];
           last.value = {
            time:null,
            number:null
          } 
    }
    //  // 血氧监测
    let _hr = await MonitoringOverviewApi.monitor_data({
      patient_id:paientInfo.value?.id,
      start: Math.round((new Date().getTime() / 1000)) - 86400,
      end: Math.round((new Date().getTime() / 1000))
    });
     list.value = _hr.data?.result ?? [];
    if(list.value.length){
          let _hrOptions = JSON.parse(JSON.stringify(hrOptions));
           let _spoOptions = JSON.parse(JSON.stringify(spoOptions));
          //  初始化数据
            initOptionsList(_hrOptions,_spoOptions);
            // 
        list.value.forEach((item,index)=>{
                let time = dateFtt('hh:00',item.insert_time);
                // 心率数据
                  _hrOptions.xAxis.data.push(time);
                  _hrOptions.series[0].data.push(item.heartrate);
                  const pointStyle = {
                          name:"预警值",
                            symbol: 'circle', 
                            symbolSize: scaleByHeight(8),
                           itemStyle: {
                            borderWidth:scaleByHeight(2),
                            borderColor:"#ffffff",
                            color: '#F04A4B',
                          },
                          label:{
                                 borderRadius: 3,
                                backgroundColor: '',
                                padding:<any[]>[],
                                position: 'top',
                                distance:0,
                                fontSize: scaleByHeight(12),
                                color: '#fff',
                                fontStyle: 'normal',
                                fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
                                show: true,
                          }
                      }
                         const pointStyle2 = {
                          name:"预警值",
                            symbol: 'circle', 
                            symbolSize:scaleByHeight(8),
                           itemStyle: {
                            borderWidth:scaleByHeight(2),
                            borderColor:"#ffffff",
                            color: '#F04A4B',
                          },
                          label:{
                                 borderRadius: 3,
                                backgroundColor: '',
                                padding:<any[]>[],
                                position: 'top',
                                distance:0,
                                fontSize: scaleByHeight(12),
                                color: '#fff',
                                fontStyle: 'normal',
                                fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
                                show: true,
                          }
                      }
                  if(item.high_heartrate_type==1 || item.low_heartrate_type==1){
                    pointStyle.itemStyle.color = "#F04A4B";
                    pointStyle.label.backgroundColor = "#F04A4B";
                     pointStyle.label.color = "#ffffff";
                    pointStyle.label.padding = [scaleByHeight(1.75), scaleByHeight(3.5), scaleByHeight(1.75), scaleByHeight(3.5)];
                      _hrOptions.series[0].markPoint.data.push({
                        ...pointStyle,
                        coord:[time,item.heartrate],
                      })
                  }else if(item.heartrate==0){
                    pointStyle.label.backgroundColor = "transparent";
                      pointStyle.itemStyle.color = "#929FAF";
                     pointStyle.label.color = "#929FAF";
                     pointStyle.label.padding = [0, 0, 0, 0];
                      _hrOptions.series[0].markPoint.data.push({
                        ...pointStyle,
                        coord:[time,item.heartrate],
                      })
                  }else{
                     pointStyle.label.backgroundColor = "transparent";
                      pointStyle.itemStyle.color = "#24B287";
                     pointStyle.label.color = "#24B287";
                     pointStyle.label.padding = [0, 0, 0, 0];
                      _hrOptions.series[0].markPoint.data.push({
                        ...pointStyle,
                        coord:[time,item.heartrate],
                      })

                  }
                //  血氧数据
                  _spoOptions.xAxis.data.push(time);
                  _spoOptions.series[0].data.push(item.spo2 || 0);
                  if(item.spo2_type==1){
                     pointStyle2.itemStyle.color = "#F04A4B";
                    pointStyle2.label.backgroundColor = "#F04A4B";
                     pointStyle2.label.color = "#ffffff";
                    pointStyle2.label.padding = [scaleByHeight(1.75), scaleByHeight(3.5), scaleByHeight(1.75), scaleByHeight(3.5)];
                      _spoOptions.series[0].markPoint.data.push({
                        ...pointStyle2, coord:[time,item.spo2]
                      })
                  }else if(item.spo2==0){
                    pointStyle2.label.backgroundColor = "transparent";
                      pointStyle2.itemStyle.color = "#929FAF";
                     pointStyle2.label.color = "#929FAF";
                     pointStyle2.label.padding = [0, 0, 0, 0];
                      _spoOptions.series[0].markPoint.data.push({
                        ...pointStyle2,coord:[time,item.spo2]
                      })
                  }else{
                      pointStyle2.label.backgroundColor = "transparent";
                      pointStyle2.itemStyle.color = "#0477E0";
                     pointStyle2.label.color = "#0477E0";
                     pointStyle2.label.padding = [0, 0, 0, 0];
                      _spoOptions.series[0].markPoint.data.push({
                        ...pointStyle2,coord:[time,item.spo2]
                      })
                  }
      })
      let _last = list.value.length > 0 ? list.value[list.value.length-1] : {}
         nextTick(()=>{
              let _hrstr =[..._hrOptions.series[0].data];
              let _hrmax = Math.max(..._hrstr);
              let _hrmin = Math.min(..._hrstr);
                if(!isNaN(_hrmax)){
                  _hrOptions.yAxis.max = _hrmax+50;
              }
              if(!isNaN(_hrmin)){
                  _hrOptions.yAxis.min = _hrmin;
              }
              HeartRateMonitorRef.value?.initDataHR(_hrOptions,_last);
               let _spostr =[..._spoOptions.series[0].data];
              let _spomax = Math.max(..._spostr);
              let _spomin = Math.min(..._spostr);
                if(!isNaN(_spomax)){
                  _spoOptions.yAxis.max = _spomax+50;
              }
              if(!isNaN(_spomin)){
                  _spoOptions.yAxis.min = _spomin-20;
              }

             HeartRateMonitorRef.value?.initDataBlood(_spoOptions,_last);
             breathingRateMonitoRef.value?.initData(respiratoryOptions,last.value);
          
           })
    }
    // 加载完成
    isLoading.value = false
  } catch (error) {
    console.error('数据加载失败:', error)
    isLoading.value = false
  }
}

// 
const xdtime = ref<string>("--");
const setChartEcg = async (item:any)=>{
    electrocardiogramOptions.series[0]!.data = [];
        let hour = "";
      if(item?.insert_time){
          let _a =  dateFtt('hh:MM',item.insert_time).split(':');
          hour = Number(_a[0])+'';
          xdtime.value = dateFtt('yyyy/mm/dd hh:MM',item.insert_time);
      }
        const _result = await ElectrocarDiographicApi.get_m9_ecg_wave(
           {
              patient_id:paientInfo.value?.id,
              date:dateFtt("yyyy-mm-dd",new Date()),
              md5:md5Str(paientInfo.value?.id+''),
              hour
          }
);
  if(Array.isArray(_result.data.result) && _result.data.result.length>0 && _result.data.result[0].ecg_data){
      electrocardiogramOptions.series[0]!.data = generateECGData(_result.data.result[0].ecg_data).ecgData;
      // debugger;
  }
  nextTick(()=>{
    ElectrocardiographiRef.value?.initData(electrocardiogramOptions);
  })
}
const fetchData = async ()=>{
  try {
    let _paientInfo = await MonitoringOverviewApi.monitor_msg({
        patient_id:paientInfo.value.id,
  });
  let _p = Object.assign(paientInfo.value,_paientInfo.data?.result);
  savePaientInfo.value(_p);
  let res = await MonitoringOverviewApi.monitor_plan_bp({
        patient_id:paientInfo.value.id,
        date:dateFtt('yyyymmdd',new Date())
  });
  let _arr = res.data?.result || [];

  bloodList.value =  _arr.map((item:any,index:number)=>{
    return {
       time:item.plan_date,
      status:item.is_execute,
      statusText:item.is_execute===1 ? "已执行" : "未执行"
    }
     
  })
  } catch (error) {
    
  }
  
}


onMounted(() => {
  // 首次进入页面
  updateCurrentTime();
  fetchData();
  timeUpdateInterval = window.setInterval(updateCurrentTime, 1000);
  loadMockData();
});

// onActivated(() => {
//   // 被缓存后激活
//   updateCurrentTime();
//   fetchData();
//   timeUpdateInterval = window.setInterval(updateCurrentTime, 1000);
//   loadMockData();
// });

 
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
   if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})

</script>

<style scoped>

/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; /* 可根据需要调整宽度 */

}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #384951;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
 background: #919EAE;
  border-radius: 4px;
  min-height: 10px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: rgba(86,227,157,0.4);
}
.monitoring-overview {
  width: 100vw;
  /* height: 100vh; */
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
}
.timeitem:not(:last-child) {
    border-bottom: 1px solid #EEEEEE;
}
/* .timeitem:nth-child(3n) {
    background: rgba(255,255,255,0.01);
    box-shadow: inset 0px 0px 24px 0px #276665;
} */

.header {
  height: 4.5vh;
  background: rgba(34, 49, 44, 0.6);
  margin-bottom: 5.8vh;
}

.dept-info {
  font-size: 2.3vh;
  font-weight: bold;
  color: #bdcbd1;
}

.patient-id {
  font-size: 3.2vh;
  font-weight: bold;
  color: #ffffff;
  text-shadow:
    0px 0px 3px #9eb4ae,
    0px 0px 7px #9eb4ae,
    0px 0px 24px #9eb4ae,
    0px 0px 48px #182a25,
    0px 0px 82px #182a25,
    0px 0px 143px #182a25;
  height: 90px;
  padding-top: 15px;
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(146, 159, 175, 0.12);
  position: relative;
  transform: perspective(16px) rotateX(-0.5deg);
  transform-origin: top center;
  border-radius: 0 0 0.4vh 0.4vh;
    backdrop-filter: blur(16px);
    padding-top: 17px;
}

.time-info {
  font-size: 1.8vh;
  margin-left: auto;
  color: #bdcbd1;
  display: flex;
  align-items: center;
}

.back-btn {
  margin-left: 2.4vh;
  height: 4.8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #22312c;
  padding: 0 1vh;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  font-weight: 500;
  &:hover {
    background: #1e9a74;
    transform: translateY(-0.1vh);
    box-shadow: 0 0.4vh 0.8vh rgba(36, 178, 135, 0.3);
  }
  &:active {
    transform: translateY(0);
  }
}
/*  */

.content {
  flex: 1;
  display: flex;
  gap: 2vh;
  padding: 2vh;
}

.middle-section {
  width: 690px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: 1.8518518518518517vh;
  flex:1;
}

.right-section {
  width: 768px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1.8518518518518517vh;
}

 

.card-title {
  width: 306px;
  font-weight: bold;
  font-size: calc(18 / 1080 * 100vh);
  color: #384951;
  margin-bottom: calc(12 / 1080 * 100vh);
}

/* 患者信息样式 */
.patient-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5vh;
}

.avatar-placeholder {
  width: 8vh;
  height: 8vh;
  border-radius: 50%;
  background: linear-gradient(135deg, #24b287, #1e9a74);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8vh;
  font-weight: bold;
  color: #ffffff;
}

.patient-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  font-size: 1.4vh;
  color: #88c5b6;
}

.highlight {
  color: #24b287;
  font-weight: bold;
}

.medical-info,
.lifestyle-info,
.contact-info,
.emergency-info,
.device-info {
  margin-top: 10px;
}

h4 {
  color: #88c5b6;
  font-size: 14px;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8vh;
}

.tag {
  padding: 0.4vh 0.8vh;
  background: rgba(36, 178, 135, 0.2);
  border: 1px solid rgba(36, 178, 135, 0.5);
  border-radius: 0.4vh;
  font-size: 1.2vh;
  color: #88c5b6;
}

.contact-item {
  font-size: 1.4vh;
  color: #88c5b6;
}

.device-info p {
  font-size: 1.2vh;
  color: #88c5b6;
  margin: 4px 0;
}

/* 图表容器样式 */
.chart-container {
  position: relative;
  height: 180px;
}

.chart-placeholder {
  width: 100%;
  height: 15vh;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.4vh;
}

.vitals {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.vital-item {
  text-align: center;
}

.vital-item .label {
  display: block;
  font-size: 1.2vh;
  color: #88c5b6;
  margin-bottom: 4px;
}

.vital-item .value {
  display: block;
  font-size: 2.4vh;
  font-weight: bold;
}

.vital-item .unit {
  display: block;
  font-size: 1.2vh;
  color: #88c5b6;
  margin-top: 2px;
}

.highlight-large {
  color: #ff4d4f;
  font-size: 3.2vh !important;
}

.highlight-green {
  color: #24b287;
}

.highlight-yellow {
  color: #f2711c;
}

/* 呼吸率样式 */
.breathing-container {
  height: 18vh;
  position: relative;
}

.bar-chart {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 12vh;
  padding: 0 1vh;
}

.bar {
  flex: 1;
  background: #f2711c;
  border-radius: 0.2vh 0.2vh 0 0;
  animation: breathe 2s infinite ease-in-out;
}

@keyframes breathe {
  0%,
  100% {
    height: 4vh;
  }
  50% {
    height: 10vh;
  }
}
.overflowscroll{
  position: relative;
  height: 20vh !important;
  overflow-x: hidden;
  overflow-y: auto;
}
.stacy{
  position: sticky;
  top: 0;
}
.breathing-rate {
  text-align: center;
  margin-top: 1.5vh;
}

.breathing-rate .value {
  font-size: 3.6vh;
  font-weight: bold;
}

.breathing-rate .unit {
  font-size: 1.4vh;
  color: #88c5b6;
}

.time-label {
  text-align: right;
  font-size: 1.2vh;
  color: #88c5b6;
  margin-top: 0.5vh;
}

/* 血压/体温样式 */
.vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5vh;
  margin-top: 1.5vh;
}

.vital-grid-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.4vh;
  padding: 1.5vh;
  text-align: center;
}

.vital-grid-item .label {
  display: block;
  font-size: 12px;
  color: #88c5b6;
  margin-bottom: 8px;
}

.vital-grid-item .value {
  display: block;
  font-size: 2.8vh;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 4px;
}

.vital-grid-item .unit {
  display: block;
  font-size: 1.2vh;
  color: #88c5b6;
}

/* 心电图样式 */
.ecg-chart {
  height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.4vh;
  position: relative;
  overflow: hidden;
  margin-top: 1.5vh;
}

.ecg-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: #ff4d4f;
  top: 50%;
  transform: translateY(-50%);
  animation: ecg 2s infinite linear;
  background-image: repeating-linear-gradient(
    90deg,
    #ff4d4f,
    #ff4d4f 1.2vh,
    transparent 1.2vh,
    transparent 1.4vh,
    #ff4d4f 1.4vh,
    #ff4d4f 1.6vh,
    transparent 1.6vh,
    transparent 1.8vh,
    #ff4d4f 1.8vh,
    #ff4d4f 2vh,
    transparent 2vh,
    transparent 2.2vh
  );
}

@keyframes ecg {
  0% {
    transform: translateY(-50%) translateX(-100%);
  }
  100% {
    transform: translateY(-50%) translateX(100%);
  }
}

/* 心电图记录样式 */
.ecg-records {
  border: 0.1vh solid rgba(36, 178, 135, 0.3);
  border-radius: 0.4vh;
  overflow: hidden;
}

.record-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(36, 178, 135, 0.2);
  padding: 1vh;
  font-weight: bold;
  color: #24b287;
}

.record-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px;
  border-top: 0.1vh solid rgba(36, 178, 135, 0.3);
  color: #88c5b6;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.nav-item {
  color: #88c5b6;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  &:hover {
    color: #24b287;
  }
  &.active {
    color: #24b287;
    font-weight: bold;
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: #24b287;
      border-radius: 1.5px;
    }
  }
}

/* 滚动条样式 */
.middle-section::-webkit-scrollbar,
.right-section::-webkit-scrollbar {
  width: 4px;
}

.middle-section::-webkit-scrollbar-track,
.right-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.middle-section::-webkit-scrollbar-thumb,
.right-section::-webkit-scrollbar-thumb {
  background: rgba(36, 178, 135, 0.5);
  border-radius: 3px;
  transition: background 0.3s ease;
  &:hover {
    background: rgba(36, 178, 135, 0.8);
  }
}

/* 血压监测计划样式 */
.plan-info {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.plan-info p {
  font-size: 14px;
  color: #88c5b6;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.action-btn {
  padding: 8px 20px;
  background: rgba(36, 178, 135, 0.2);
  border: 1px solid #24b287;
  border-radius: 4px;
  color: #24b287;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  &:hover {
    background: #24b287;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(36, 178, 135, 0.3);
  }
  &:active {
    transform: translateY(0);
  }
}


/* 加载动画遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
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
  border: 3px solid rgba(255, 255, 255, 1);
  border-top: 3px solid #24b287;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #24b287;
  font-size: 1.48vh;
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

/* 全局动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeIn 0.5s ease-out;
}
 

.card:nth-child(1) {
  animation-delay: 0.1s;
}
.card:nth-child(2) {
  animation-delay: 0.2s;
}
.card:nth-child(3) {
  animation-delay: 0.3s;
}
.card:nth-child(4) {
  animation-delay: 0.4s;
}
.card:nth-child(5) {
  animation-delay: 0.5s;
}
.jhdata{
   height: calc(257 / 1080 * 100vh);
   background-color: #fff;
   padding: calc(20 / 1080 * 100vh);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);

}
</style>
