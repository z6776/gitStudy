<template>
  <div class="monitoring-overview">
     <!-- <HomeIcon /> -->
    <div class="flex homeIcon flex-col items-center justify-center" @click="goHome()">
       <img src="@/assets/images/V4/Vector.png" alt="" srcset="" class="w-28px h-28px">
       <div class="hometxt">
          首页
       </div>
    </div>
    <!-- 顶部导航栏 -->
    <div class="line"></div>
    <div class="position-stacy">
      <div class="flex items-center justify-between pl-24px header">
        <div class="color-[#BDCBD1] text-24px line-height-24px font-bold">{{ zoom.name || '--' }} 病区监护总览</div>
        <!--  -->
        <!-- <div class="patient-id"></div> -->
        <div class="flex ">
          <div class="time-info pr-20px">{{ currentTime }}</div>
          <!-- <div class="back-btn" @click="handleBack">
            <img src="@/assets/images/back_icon.png" alt="" class="w-28px h-28px block" />
            <span class="text-16px color-[#BDCBD1]">返回</span>
          </div> -->
        </div>
      </div>
    </div>

    <div class="chartItem">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="flex justify-between line-height-12px items-center mb-10px">
          <div>
            <span class="color-[#F5F7FB] text-[16px] mr-12px font-bold">{{
              item.bed_number || '--'
            }}</span>
            <span class="color-[#F5F7FB] text-[16px] mr-12px font-bold">{{
              maskName(item.name)
            }}</span>
            <span class="color-[#F5F7FB] text-[16px] font-bold"
              >CCID:{{ (item.ccid && item.ccid.substr(-5)) || '--' }}</span>
          </div>
          <div>
            <span class="color-[#F5F7FB] text-[12px]">绑定时间：</span>
            <span class="color-[#F5F7FB] text-[12px] mr-12px">{{
              dateFtt('yyyy/mm/dd hh:MM', item.bind_time)
            }}</span>
            <span class="color-[#F5F7FB] text-[12px]">电量：</span>
            <span
              class="color-[#F5F7FB] text-[12px]"
              :class="{ colorDA4343: item.bat <= 20 }">{{ item.bat ? item.bat + '%' : '0%' }}</span>
          </div>
        </div>

        <p class="mb-9px c670vw line-height-12px">
          <span class="color-[#5BDD56] text-[12px] font-bold mr-6px">HR</span>
          <span class="color-[#6F7C7B] text-[12px] mr-22px">阈值范围：{{ item.low_heartrate_value || '--' }}-{{ item.high_heartrate_value || '--' }}bpm</span>
          <span class="color-[#56E3E1] text-[12px] mr-6px">SpO2</span>
          <span class="color-[#6F7C7B] text-[12px] mr-22px">阈值范围：{{ item.spo2 }}%</span>
          <span class="color-[#D8D8D8] text-[12px] mr-6px">NIBP</span>
          <span class="color-[#6F7C7B] text-[12px]">阈值范围：舒张压90-139mmHg/收缩压60-89mmHg</span>
        </p>
        <div class="chart-container flex gap-10px">
            <div class="charts h-16vh flex-shrink-0 c670vw mediaCharts relative" :id="'empty'+index" v-if="item.nodata">
          </div>
          <div class="charts h-16vh flex-shrink-0 c670vw mediaCharts  relative" id="echartItem" v-else>
            <div
              :id="'chart' +  index"
              class="w-100% h-16vh mediaitemChart">
            </div>
            <!-- <div :id="'chart' + (2 + 3 * index)" class="w-100% h-4vh mediaitemChart borlr"></div>
            <div :id="'chart' + (3 + 3 * index)" class="w-100% h-8vh mediaitemChart"></div> -->
            <!-- <div class="before"></div>
            <div class="after"></div>
            <div class="bottom"></div> -->
          </div>
        
          <div class="flex flex-col h-16vh justify-between mediaCharts flex-1">
            <div class="flex gap-32px justify-between">
              <div class="hrbox flex flex-col w-48%">
                <div class="line-height-12px flex">
                  <span class="color-[#5BDD56] text-16px font-bold">HR</span>
                  <span class="color-[#5BDD56] text-12px mr-10px">(bpm)</span>
                  <span class="color-[#5BDD56] text-12px">{{
                    detailData[item.ccid] && detailData[item.ccid].insert_time
                      ? dateFtt('hh:MM', Math.floor(detailData[item.ccid].insert_time * 1000))
                      : ''
                  }}</span>
                </div>
                <!-- #DA4343 -->
                <div class="mt-12px color-[#5BDD56] text-[5.5vh] text-center line-height-5.5vh font-650 mediaSize">
                  {{
                    detailData[item.ccid] && detailData[item.ccid].heartrate
                      ? detailData[item.ccid].heartrate
                      : '--'
                  }}
                </div>
              </div>

              <div class="spo2box flex flex-col items-center line-height-12px w-48%">
                <div class="flex w-100%">
                  <span class="color-[#56E3E1] text-16px font-bold">SpO2</span>
                  <span class="color-[#56E3E1] text-12px mr-10px">(%)</span>
                  <span class="color-[#56E3E1] text-12px ml-auto">{{
                    detailData[item.ccid] && detailData[item.ccid].insert_time
                      ? dateFtt('hh:MM', Math.floor(detailData[item.ccid].insert_time * 1000))
                      : ''
                  }}</span>
                </div>
                <div
                  class="mt-12px color-[#56E3E1] text-[5.5vh] line-height-5.5vh font-650 mediaSize text-center"
                >
                  {{
                    detailData[item.ccid] && detailData[item.ccid].spo2
                      ? detailData[item.ccid].spo2
                      : '--'
                  }}
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between line-height-12px">
                <div>
                  <span class="color-[#D8D8D8] text-16px font-bold">NIBP</span>
                  <span class="color-[#D8D8D8] text-12px mr-10px">(mmhg)</span>
                </div>
                <div class="color-[#D8D8D8] text-12px">
                  {{
                    detailData[item.ccid] && detailData[item.ccid]?.bd_insert_time
                      ? dateFtt('hh:MM', Math.floor(detailData[item.ccid].bd_insert_time * 1000))
                      : ''
                  }}
                </div>
              </div>
              <div class="mt-10px color-[#D8D8D8] text-[44px] line-height-44px font-650 mediaSize text-center flex justify-center">
                {{ value(detailData[item.ccid]?.sbp) }}/{{ value(detailData[item.ccid]?.dbp)
                }}
                 <template v-if="isNaN(detailData[item.ccid]?.sbp - detailData[item.ccid]?.dbp)">
                <div class="flex">
                   <span class="text-[32px] line-height-40px">(</span>
                    <span>--</span>
                     <span class="text-[32px]">)</span>
                </div>
                   
               </template>
               
               <template v-else>
                <div class="flex">
                   <span class="text-[32px] line-height-40px">(</span>
                    <span>{{
                   (detailData[item.ccid]?.sbp - detailData[item.ccid]?.dbp)
                }}</span>
                     <span class="text-[32px]">)</span>

                </div>
                   
               </template>
              
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载动画遮罩 -->
    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载数据中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, toRefs } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { mockDataScreen, hrOptions, spoOptions, NibpOptions ,emptyOptions,newOption} from './options/index'
import * as echarts from 'echarts'
import { maskName } from '@/utils/function/function'
import { dateFtt } from '@/utils/date/dateFtt'
import ScreenApi from '@/api/screen'
import { getCookie, setCookie } from '@/utils/cookie/cookie'
import { value } from '@/utils/function/function'
import { useZoomStore } from '@/stores/zoom'
import { myInterval } from '@/utils/interval/interval'
import type { Timer } from '@/interface/interface'
const { zoom } = useZoomStore()
const admin = JSON.parse(getCookie('admin') as string)

function goHome(){
    router.push('/index')
}

// 页面状态
const isLoading = ref(true)
const currentTime = ref('')
let timeUpdateInterval: number | null = null
const handleBack = () => {
  router.back()
}

const detailData = ref<any>({})
let initflag = true
const fetchDetailData = async () => {
  let data = {
    zone_number: admin.zone_number
  }

  if (initflag) {
    loadMockData()
  }
  initflag = false

  detailData.value = (await ScreenApi.getDetailData(data)).data.result
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

const targetRanges = [
  { min: 1300, max: 1400 },  // 系列4的目标区间 (范围: 150)
  { min: 900, max: 1000 },   // 系列3的目标区间 (范围: 150)
  { min: 500, max: 600 },   // 系列2的目标区间 (范围: 150)
  { min: 100, max: 200 }    // 系列1的目标区间 (范围: 150)
];


// 数据映射函数
function mapToFixedRanges(data: number[], targetMin: number, targetMax: number) {
    const sourceMin = Math.min(...data);
    const sourceMax = Math.max(...data);
    
    return data.map(value => {
        // 归一化到0-1范围
        if(sourceMax==0 && sourceMin==0){
          return targetMin;
        }
        const normalized = (value - sourceMin) / (sourceMax - sourceMin);
        
        // 映射到目标区间
        return Math.floor(targetMin + normalized * (targetMax - targetMin));
    });
}



// 模拟数据加载
const list = ref<any[]>([])
const loadMockData = async () => {
  try {
    let res = await ScreenApi.getScreenDataList({
      zone_number: admin.zone_number,
      start: Math.round(new Date().getTime() / 1000) - 86400,
      end: Math.round(new Date().getTime() / 1000)
    })
    let _res = res.data && res.data.result && res.data.result.data! ? res.data.result.data! : []
    list.value = _res;
    if (list.value.length) {
      list.value.forEach((item, index) => {
        item.lastData = {}
        let tip1 = index
        let emptyid = index;
        let newOptions = JSON.parse(JSON.stringify(newOption));
        const rawData = {
           series1:item.list.map((item:any) => item.heartrate),
           series2:item.list.map((item:any) => item.spo2),
           series3:item.list.map((item:any) => item.sbp),
           series4:item.list.map((item:any) => item.dbp)
        }
        // 处理数据
        if (item.list.length) {
          newOptions.xAxis.data = []
          newOptions.series.forEach((seriesItem:any)=>{
              seriesItem.data = []
              seriesItem.markPoint.data = []
          });

          item.list.forEach((value: any, index: any) => {
            if (index === item.list.length - 1) {
              item.lastData = value
            }
            let time = dateFtt('hh:00', value.insert_time)
            let _h = value.heartrate
            let _spo = value.spo2
            // 心率数据
            newOptions.xAxis.data.push(time)
            rawData.series1.push(_h);
            newOptions.series[0].markLine.data.push({
              xAxis: time,
            })
            //  血氧数据
            rawData.series2.push(_spo);
            newOptions.series[1].markLine.data.push({
              xAxis: time,
            })
           
            //  NIMP
            let _v1 = value.sbp
            let _v2 = value.dbp
            rawData.series3.push(_v1);
            rawData.series4.push(_v2);
            newOptions.series[2].markLine.data.push({
              xAxis: time,
            })
 
          let _hr = mapToFixedRanges(rawData.series1, targetRanges[0]!.min, targetRanges[0]!.max)[index];
          let _spo2 = mapToFixedRanges(rawData.series2, targetRanges[1]!.min, targetRanges[1]!.max)[index];
          let _sbp = mapToFixedRanges(rawData.series3, targetRanges[2]!.min, targetRanges[2]!.max)[index];
          let _dbp = mapToFixedRanges(rawData.series4, targetRanges[3]!.min, targetRanges[3]!.max)[index];
            if (value.high_heartrate_type === 1 || value.low_heartrate_type === 1) {
                  newOptions.series[0].markPoint.data.push({
                    name: '预警值',
                    coord: [time, _hr],
                    label: {
                      show: true,
                       distance: 0,
                      formatter: (params: any) => {
                        return value.heartrate;
                      }
                    }
                  })
              }
              if (value.spo2_type === 1) {
                newOptions.series[1].markPoint.data.push({
                  name: '预警值',
                  coord: [time, _spo2],
                  label: {
                     distance: 0,
                    show: true,
                    formatter: () => value.spo2,
                  }
                })
              }
            if (value.sbp_type === 1  ) {
              newOptions.series[2].markPoint.data.push({
                name: '高压预警',
                coord: [time, _sbp],
                label: {
                      show: true,
                       distance: 0,
                      formatter: (params: any) => {
                        return value.sbp;
                      }
                    }
              })
            }
            if (value.dbp_type === 1) {
              newOptions.series[3].markPoint.data.push({
                name: '低压预警',
                coord: [time, _dbp],
                label: {
                    show: true,
                     distance: 0,
                    formatter: (params: any) => {
                      return value.dbp;
                    }
                  }
              })
            }
           
          })
          newOptions.series[0].label.formatter = function (params: any) {
             if(item.list?.[params.dataIndex]?.high_heartrate_type===1 || item.list?.[params.dataIndex]?.low_heartrate_type===1){
                return ''
            }
            return rawData.series1[params.dataIndex]
          }
               newOptions.series[1].label.formatter = function (params: any) {
           if(item.list?.[params.dataIndex]?.spo2_type===1){
                return ''
            }
            return rawData.series2[params.dataIndex]
          }
            newOptions.series[2].label.formatter = function (params: any) {
             if(item.list?.[params.dataIndex]?.sbp_type===1){
                return ''
            }
            return rawData.series3[params.dataIndex]
          }
        newOptions.series[3].label.formatter = function (params: any) {
          if(item.list?.[params.dataIndex]?.dbp_type===1){
                return ''
            }
            return rawData.series4[params.dataIndex]
          }
          
        }
      
        // 渲染
        nextTick(() => {
          let flag = item.list.every((value: any)=>!value.heartrate && !value.spo2 && !value.sbp && !value.dbp)
          if(flag){
              emptyOptions.xAxis.data = newOptions.xAxis.data;
              
          //      emptyOptions.series[0]!.data =Array.from({ length:newOptions.xAxis?.data?.length }).map(() => 0)
          //  emptyOptions.series[0]!.markLine.data = newOptions.series[0]!.markLine.data;
            item.nodata = true;
            nextTick(()=>{
              
                initEmptyChart(emptyid,emptyOptions)
            })
          }
          newOptions.series[0].markPoint.label.formatter = function (params: any) {
            return params.data.coord[1]
          }
          
        const processedData = {
            series1: mapToFixedRanges(rawData.series1, targetRanges[0]!.min, targetRanges[0]!.max),
            series2: mapToFixedRanges(rawData.series2, targetRanges[1]!.min, targetRanges[1]!.max),
            series3: mapToFixedRanges(rawData.series3, targetRanges[2]!.min, targetRanges[2]!.max),
            series4: mapToFixedRanges(rawData.series4, targetRanges[3]!.min, targetRanges[3]!.max)
        };
       
        newOptions.series[0].data = processedData.series1;
        newOptions.series[1].data = processedData.series2;
        newOptions.series[2].data = processedData.series3;
        newOptions.series[3].data = processedData.series4;
          initData(tip1, newOptions);
        })
      })
    }

    // 加载完成
    isLoading.value = false
  } catch (error) {
    console.error('数据加载失败:', error)
    isLoading.value = false
  }
}

const initData = (index: number, option: any) => {
  let echartItem = document.querySelector(`#chart${index}`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  let _echarts = echarts.init(echartItem)
   
  _echarts.setOption(option)
   window.addEventListener('resize', () => {
    _echarts.resize();
  })
}

const initEmptyChart = (index: number, option: any) => {
  let echartItem = document.querySelector(`#empty${index}`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  let _echarts = echarts.init(echartItem)

  _echarts.setOption(option);
  window.addEventListener('resize', () => {
    _echarts.resize();
  })
}



const timer_1: Timer = {
  id: undefined,
}
const timer_2: Timer = {
  id: undefined,
}
onMounted(() => {
  fetchDetailData()
  myInterval(
    () => {
      loadMockData()
    },
    600000,
    timer_1,
  )()
  myInterval(
    () => {
      fetchDetailData()
    },
    60000,
    timer_2,
  )()
})
onUnmounted(() => {
  clearTimeout(timer_1.id)
  clearTimeout(timer_2.id)
})

onMounted(async () => {
  // 初始化页面
  updateCurrentTime()
  timeUpdateInterval = window.setInterval(updateCurrentTime, 1000)
  fetchDetailData()
})

onUnmounted(() => {
  // 清理定时器
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})
</script>

<style scoped>
#echartItem {
  /* border: 1px solid #213536; */
}
.hometxt{
  writing-mode: vertical-rl;
  margin-top: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
.homeIcon:hover{
   opacity: .7;
}
.homeIcon{
  width: 36px;
   border-radius: 0 8px 8px 0;
   padding: 10px 4px;
   position: fixed;
   bottom:40px;
   left:0;
   z-index: 999;
   background-color: #24B287;
  }
.bortop {
  border-top: 1px solid #213536;
}
.borlr {
  border-left: 1px solid #213536;
  border-right: 1px solid #213536;
}
.borbottom {
}
.line {
  position: fixed;
  width: 1px;
  height: 100vh;
  left: 50%;
  transform: translateX(-50%);
  background-color: #384951;
  z-index: 1;
}
.chartItem {
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  & .item {
    width: 50%;
    /* height: 23.35vh; */
    border-bottom: 1px solid #384951;
    padding: 1.5vh;
    padding-bottom: 0.8vh;
  }
  .item:nth-child(8n-1) {
    border-bottom: none;
  }
  .item:nth-child(8n) {
    border-bottom: none;
  }
}
.monitoring-overview {
  width: 100vw;
  height: 100vh;
  background: #0a1a1d;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
  overflow-y: auto;
}


.c670vw{
   width:34.89583333333333vw;
}

.position-stacy {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 2px; /* 可根据需要调整宽度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: rgba(86, 227, 157, 0.4);
  border-radius: 4px;
  min-height: 10px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: rgba(86, 227, 157, 0.4);
}

.header {
  height: 4.44vh;
  background: #172925;
  /* margin-bottom: 2.1vh; */
  position: relative;
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

.colorDA4343 {
  color: #da4343 !important;
}

/* 加载动画遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 26, 29, 0.95);
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
  position: absolute;
  left: 50%;
  background: rgba(146, 159, 175, 0.12);
  transform: translateX(-50%) perspective(16px) rotateX(-0.5deg);
  transform-origin: top center;
  border-radius: 0 0 0.4vh 0.4vh;
  backdrop-filter: blur(24px);
  z-index: 9;
}

@media screen and (max-width: 1280px) {
  .mediaSize {
    font-size: 30px;
    text-align: center;
    line-height: 30px;
  }
  /* .mediaCharts {
    height: 14vh;
  }
  .mediaitemChart {
    height: 4.6vh;
  } */
}
.before {
  position: absolute;
  left: 0;
  bottom: 24px;
  width: 1px;
  height: calc(8vh - 10px);
  background-color: #213536;
}

.after {
  position: absolute;
  right: 0;
  bottom: 24px;
  width: 1px;
  height: calc(8vh - 10px);
  background-color: #213536;
}
.bottom {
  width: 100%;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 22px;
  height: 1px;
  background-color: #213536;
}
</style>
