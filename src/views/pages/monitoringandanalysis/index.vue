<template>
  <div class="monitoring-overview">
    <!-- 主要内容区域 -->
    <div class="content">
      <!-- 左侧患者信息 -->
      <PatientInfo />

      <div class="overflowscroll flex-1">
        <div class="left_section h-82.5vh">
          <div class="flex page-one h-82.5vh gap-2vh">
            <!-- 中间区域 gap-2vh-->
            <div class="middle-section">
              <HeartRateMonitor ref="HeartRateMonitorRef" :jctime="jctime" />

              <!-- 血氧监测分析 -->
              <div class="card ani">
                <p class="card-title">血氧监测分析</p>
                <div class="flex justify-between items-center mb20cus">
                  <span class="color-[#384951] text16cus font-bold">24小时血氧采集分析报告</span>
                  <span class="color-[#636676] text14cus">监测范围：{{ jctime }}</span>
                </div>

                <div class="flex gap-36px items-center pl-22px">
                  <div id="bloodChart" class="w-13vh h-13vh"></div>
                  <div>
                    <div class="flex mb-1.48vh items-center line-height-1.48vh">
                      <div class="w-12px h-12px bg-[#24B287] mr-8px"></div>
                      <div class="color-[#929FAF] text16cus w-11vh mr-8px">92≤血氧≤100%</div>
                      <div class="text16cus color-[#384951] mr-40px w32px">
                        {{ spoinfo?.['92~100'] ?? '--' }}%
                      </div>
                      <div class="text16cus color-[#929FAF]">平均血氧饱和度：</div>
                      <div class="text16cus color-[#384951]">
                        {{ spoinfo?.['92~100~avg'] ?? '--' }}%
                      </div>
                    </div>
                    <div class="flex mb-1.48vh items-center line-height-1.48vh">
                      <div class="w-12px h-12px bg-[#DA4343] mr-8px"></div>
                      <div class="color-[#929FAF] text16cus w-11vh mr-8px">85≤血氧≤91%</div>
                      <div class="text16cus color-[#384951] mr-40px w32px">
                        {{ spoinfo?.['85~91'] ?? '--' }}%
                      </div>
                      <div class="text16cus color-[#929FAF]">最高血氧饱和度：</div>
                      <div class="text16cus color-[#384951]">
                        {{ spoinfo?.['85~91max'] ?? '--' }}%
                      </div>
                    </div>
                    <div class="flex items-center line-height-1.48vh">
                      <div class="w-12px h-12px bg-[#E89E2E] mr-8px"></div>
                      <div class="color-[#929FAF] text16cus w-11vh mr-8px">血氧＜85%</div>
                      <div class="text16cus color-[#384951] mr-40px w32px">
                        {{ spoinfo?.['<85'] ?? '--' }}%
                      </div>
                      <div class="text16cus color-[#929FAF]">最低血氧饱和度：</div>
                      <div class="text16cus color-[#384951]">
                        {{ spoinfo?.['<85min'] ?? '--' }}%
                      </div>
                    </div>
                    <div class="text16cus color-[#384951] mt-10px line-height-1.48vh">
                      {{ spoinfo?.['txt'] ?? '暂无监护数据。' }}
                    </div>
                  </div>
                </div>
              </div>
              <EcgMonitor :info="EcgMonitorInfo" :jctime="jctime" />
            </div>
            <!-- 右侧区域 -->
            <div class="right-section">
              <BreathingRateMonitor ref="BreathingRateMonitorRef" :jctime="jctime" />

              <BloodPressureMonitor ref="BloodPressureMonitorRef" :jctime="jctime" />

              <Electrocardiographic ref="ElectrocardiographicRef" :jctime="jctime" />
            </div>
          </div>

          <div class="page-two flex flex-col gap-20px justify-between mt-20px h-82.5vh">
            <div class="section_top flex justify-between gap-20px">
              <Bloodsugar ref="BloodsugarRef" :suger="suger" />
              <Bloodlipids />
              <UricAcid />
            </div>
            <DiseaseAnalysis />
          </div>
        </div>
      </div>
    </div>

    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载数据中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRefs, nextTick } from 'vue'
import PatientInfo from '@/views/pages/monitoringOverview/index/components/PatientInfo.vue'
import HeartRateMonitor from './components/HeartRateMonitor.vue'
import BreathingRateMonitor from './components/BreathingRateMonitor.vue'
import BloodPressureMonitor from './components/BloodPressureMonitor.vue'
import EcgMonitor from './components/EcgMonitor.vue'
import FooterNav from './components/FooterNav.vue'
import Electrocardiographic from './components/Electrocardiographic.vue'
import Bloodlipids from './components/bloodlipids.vue'
import UricAcid from './components/uricAcid.vue'
import Bloodsugar from './components/bloodsugar.vue'
import DiseaseAnalysis from './components/diseaseAnalysis.vue'
import * as echarts from 'echarts'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import {
  monitoringAndAnalysisOptionshr,
  emptyPieOption,
  monitoringAndAnalysisOptionsblood,
  monitoringAndAnalysisOptionshx,
  monitoringAndAnalysisOptionstem,
  bloodPressureMonitorOptions,
  sugerOptions,
} from './options/index'
import { useZoomStore } from '@/stores/zoom'
const { zoom } = useZoomStore()
import { usePaientInfo } from '@/stores/paientinfo'
import { getRem, styleToString, value } from '@/utils/function/function'
import { dateFtt } from '@/utils/date/dateFtt'
import type { tooltipType } from '@/interface/interface'
const { paientInfo, savePaientInfo } = toRefs(usePaientInfo())
const BASEURL = import.meta.env.VITE_APP_ReportUrl_IP
import axios from 'axios'
import MonitoringOverviewApi from '@/api/monitoringOverview'
import { md5Str } from '../rightAside/options'
import { mockDataSugerPerson } from '@/mock/mock'
const patientInfo = ref<any>({})
const fetchPatientInfo = async () => {
  let data = {
    id: paientInfo.value.id,
  }
  try {
    let _paientInfo = await MonitoringOverviewApi.monitor_msg({
      patient_id: paientInfo.value.id,
    })
    let _p = Object.assign(paientInfo.value, _paientInfo.data?.result)
    savePaientInfo.value(_p)
  } catch (error) {}
}

// 页面状态
const isLoading = ref(true)
const currentTime = ref('')
let timeUpdateInterval: number | null = null

const handleBack = () => {
  router.back()
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
const HeartRateMonitorRef = ref<InstanceType<typeof HeartRateMonitor> | null>(null)
const BreathingRateMonitorRef = ref<InstanceType<typeof BreathingRateMonitor> | null>(null)
const ElectrocardiographicRef = ref<InstanceType<typeof Electrocardiographic> | null>(null)
const BloodPressureMonitorRef = ref<InstanceType<typeof BloodPressureMonitor> | null>(null)
const BloodsugarRef = ref<InstanceType<typeof Bloodsugar> | null>(null)
type EcgMonitorInfoType = {
  MeanRRI: number
  MeanHR: number
  ascordesc: number
  time: string
  txt: string
}
const EcgMonitorInfo = ref<EcgMonitorInfoType>()
const mathCeil = (n: number) => {
  return Math.round(Number((n + Number.EPSILON).toFixed(10)))
}

const HIGH_VALUE = 7.8 // 高血糖阈值
const LOW_VALUE = 4.4 // 低血糖阈值
//
const suger = ref<any>({})
const setSugerChart = (dis: any) => {
  if (Object.keys(dis).length > 0) {
    suger.value = dis
  }
  let _data: any = []
  //  sugerOptions.yAxis.min =
  let allTimes: any = []
  let times: any = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '00:00']
  let _values: any = []
  if (typeof dis.diabetes_text == 'object' && Object.keys(dis.diabetes_text).length > 0) {
    let _a = Object.keys(dis.diabetes_text)
      .sort()
      .map((item) => dateFtt('hh:MM', new Date(item)))
    allTimes = Object.keys(dis.diabetes_text)
      .sort()
      .map((item) => item)
    times = _a
    let _v = Object.keys(dis.diabetes_text)
      .sort()
      .map((item) => dis.diabetes_text[item])
    _values = _v
  }
  //  debugger;
  //  diabetes_text
  const formatterStyle = styleToString({
    padding: getRem(10) + 'px',
    'background-color': '#FFFFFF99',
  })

  const dateStyle = styleToString({
    color: '#929FAF',
    'font-size': getRem(14) + 'px',
    'line-height': getRem(14) + 'px',
    'margin-bottom': getRem(10) + 'px',
  })
  const unitStyle = styleToString({
    'font-size': getRem(14) + 'px',
    color: '#929FAF',
    'margin-left': getRem(30) + 'px',
  })
  const valueStyle = styleToString({
    color: '#24B287',
    'font-size': getRem(18) + 'px',
    'font-weight': 'bold',
  })
  sugerOptions.tooltip.formatter = (p: tooltipType<number>[]) => {
    if (p[0]?.dataIndex != undefined && p[0]?.dataIndex != null) {
      sugerOptions.series[0]!.markPoint!.data = [
        {
          name: '当前数据点',
          coord: _data[p[0].dataIndex]!,
        },
      ]
    }
    let _index = p[0]?.dataIndex ?? 0
    return `
               <div style='${formatterStyle}'> 
                    <div style='${dateStyle}'>${dateFtt('yyyy-mm-dd hh:MM', allTimes[_index])}</div>
                    <div style='line-height:${getRem(18)}px'>
                      <span style="${valueStyle}">${_values[_index]}</span>
                      <span style="${unitStyle}">mmol/L</span>
                    </div>
                 </div>
                 `
  }
  // let _graphic =  [
  //             // 右下角标注
  //             {
  //                id:"graphic1",
  //             type: 'text',
  //              position:[10000,10000],
  //             zlevel:100,
  //             style: {
  //                 text: `${LOW_VALUE}`,
  //                 fill: '#fff',
  //                 textVerticalAlign:"bottom",
  //                 fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
  //                 fontSize: getRem(10)
  //             }
  //             },
  //           {
  //             type: 'text',
  //             id:"graphic2",
  //             position:[10000,10000],

  //              zlevel:100,
  //             style: {
  //                 text: `${HIGH_VALUE}`,
  //                 fill: '#fff',

  //                 fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
  //                 fontSize: getRem(10)
  //             }
  //             }
  //           ]
  //  sugerOptions.graphic = _graphic;
  sugerOptions.xAxis.data = times
  sugerOptions.series[0]!.data = _values
  nextTick(() => {
    BloodsugarRef.value!.initData(sugerOptions)
  })
}

const loadMockData = async () => {
  try {
    // 测试
    // setSugerChart(mockDataSugerPerson.diabetes_dic);
    let _r = await axios.get('/hospital_show/api/report/guardian_analysis', {
      baseURL: BASEURL,
      params: {
        patient_id: paientInfo.value.id,
        md5: md5Str(paientInfo.value.id),
        flag: 'old',
        check_time: Math.floor(new Date().getTime() / 1000),
      },
    })

    monitoringAndAnalysisOptionshr.series[0]!.data = []
    monitoringAndAnalysisOptionsblood.series[0]!.data = []
    monitoringAndAnalysisOptionstem.series[0]!.data = []
    if (
      _r.data?.info &&
      typeof _r.data?.info === 'object' &&
      Object.keys(_r.data?.info).length > 0
    ) {
      setSugerChart(_r.data?.info?.diabetes_dic)
      // 心率
      let _res = _r.data?.info?.hr_dic
      monitoringAndAnalysisOptionshr.series[0]!.data = [
        _res.hr_between_60_100_per,
        _res.hr_up_100_per,
        _res.hr_low_60_per,
      ].map((v) => (isNaN(v * 100) ? 0 : mathCeil(v * 100)))
      HeartRateMonitorRef.value!.initData(monitoringAndAnalysisOptionshr, {
        '60~100': isNaN(_res.hr_between_60_100_per * 100)
          ? 0
          : Number((_res.hr_between_60_100_per * 100).toFixed(0)),
        '60~100~avg': isNaN(_res.hr_avg * 100) ? 0 : _res.hr_avg,
        '>100': isNaN(_res.hr_up_100_per * 100) ? 0 : Number((_res.hr_up_100_per * 100).toFixed(0)),
        '>100max': isNaN(_res.hr_max * 100) ? 0 : _res.hr_max,
        '<60': isNaN(_res.hr_low_60_per * 100) ? 0 : Number((_res.hr_low_60_per * 100).toFixed(0)),
        '<60min': isNaN(_res.hr_min * 100) ? 0 : _res.hr_min,
        txt: _res.hr_analysis,
        time: jctime.value,
      })
      let _spo2_dic = _r.data?.info?.spo2_dic
      // 血氧
      monitoringAndAnalysisOptionsblood.series[0]!.data = [
        _spo2_dic.spo2_up_92_per,
        _spo2_dic.spo2_between_85_91_per,
        _spo2_dic.spo2_low_85_per,
      ].map((v) => (isNaN(v * 100) ? 0 : mathCeil(v * 100)))
      initBloodChart(monitoringAndAnalysisOptionsblood, {
        '92~100': isNaN(_spo2_dic.spo2_up_92_per * 100)
          ? 0
          : mathCeil(_spo2_dic.spo2_up_92_per * 100),
        '92~100~avg': isNaN(_spo2_dic.spo2_avg * 100) ? 0 : _spo2_dic.spo2_avg,
        '85~91': isNaN(_spo2_dic.spo2_between_85_91_per * 100)
          ? 0
          : mathCeil(_spo2_dic.spo2_between_85_91_per * 100),
        '85~91max': isNaN(_spo2_dic.spo2_max * 100) ? 0 : _spo2_dic.spo2_max,
        '<85': isNaN(_spo2_dic.spo2_low_85_per * 100)
          ? 0
          : mathCeil(_spo2_dic.spo2_low_85_per * 100),
        '<85min': isNaN(_spo2_dic.spo2_min * 100) ? 0 : _spo2_dic.spo2_min,
        txt: _spo2_dic.spo2_analysis,
        time: jctime.value,
      })
      // 呼吸
      let _breath_dic = _r.data?.info?.breath_dic
      monitoringAndAnalysisOptionshx.series[0]!.data = [
        _breath_dic.breath_between_12_20_per,
        _breath_dic.breath_up_20_per,
        _breath_dic.breath_low_12_per,
      ].map((v) => (isNaN(v * 100) ? 0 : mathCeil(v * 100)))
      BreathingRateMonitorRef.value!.initData(monitoringAndAnalysisOptionshx, {
        '12~20': isNaN(_breath_dic.breath_between_12_20_per * 100)
          ? 0
          : mathCeil(_breath_dic.breath_between_12_20_per * 100), // 正常区间占比
        '12~20~avg': isNaN(_breath_dic.breath_avg * 100) ? 0 : _breath_dic.breath_avg, // 正常区间平均呼吸率
        '>20': isNaN(_breath_dic.breath_up_20_per * 100)
          ? 0
          : mathCeil(_breath_dic.breath_up_20_per * 100), // 呼吸率大于20占比
        '>20max': isNaN(_breath_dic.breath_max * 100) ? 0 : _breath_dic.breath_max, // 最大呼吸率
        '<12': isNaN(_breath_dic.breath_low_12_per * 100)
          ? 0
          : mathCeil(_breath_dic.breath_low_12_per * 100), // 呼吸率小于12占比
        '<12min': isNaN(_breath_dic.breath_min * 100) ? 0 : _breath_dic.breath_min, // 最小呼吸率
        txt: _breath_dic.breath_analysis, // 监测区间描述/结论
        time: jctime.value,
      })
      //
      let _body_dic = _r.data?.info?.body_dic
      monitoringAndAnalysisOptionstem.series[0]!.data = [
        _body_dic.body_between_36_37_per,
        _body_dic.body_up_38_per,
        _body_dic.body_between_37_38_per,
        _body_dic.body_low_36_per,
      ].map((v) => (isNaN(v * 100) ? 0 : mathCeil(v * 100)))
      ElectrocardiographicRef.value!.initData(monitoringAndAnalysisOptionstem, {
        '36~37.2': isNaN(_body_dic.body_between_36_37_per * 100)
          ? 0
          : mathCeil(_body_dic.body_between_36_37_per * 100),
        '>38': isNaN(_body_dic.body_up_38_per * 100) ? 0 : _body_dic.body_up_38_per * 100,
        '37.2~38': isNaN(_body_dic.body_between_37_38_per)
          ? 0
          : mathCeil(_body_dic.body_between_37_38_per * 100),
        '<36': isNaN(_body_dic.body_low_36_per * 100)
          ? 0
          : mathCeil(_body_dic.body_low_36_per * 100),
        avg: _body_dic.body_avg,
        txt: _body_dic.body_analysis,
        time: jctime.value,
      })
      //
      let _bp_dic = _r.data?.info?.bp_dic
      if (Object.keys(_bp_dic.dbp_text).length > 0) {
        bloodPressureMonitorOptions.xAxis.data = []
        Object.keys(_bp_dic.dbp_text)
          .sort()
          .forEach((item) => {
            bloodPressureMonitorOptions.xAxis.data.push(item)
          })
        Object.values(_bp_dic.dbp_text).forEach((item) => {
          bloodPressureMonitorOptions.series[0]?.data.push(item as number)
        })
        Object.values(_bp_dic.sbp_text).forEach((item) => {
          bloodPressureMonitorOptions.series[1]?.data.push(item as number)
        })
      }
      BloodPressureMonitorRef.value!.initData(bloodPressureMonitorOptions, {
        txt: _bp_dic.bp_analysis,
        time: jctime.value,
      })
      let _EcgMonitorInfo = _r.data?.info?.ecg_dic
      EcgMonitorInfo.value = {
        MeanRRI: _EcgMonitorInfo.mean_rri,
        MeanHR: _EcgMonitorInfo.mean_hr,
        ascordesc: _EcgMonitorInfo.ecg_flag,
        time: jctime.value,
        txt: _EcgMonitorInfo.ecg_analysis,
      }
    } else {
      bloodPressureMonitorOptions.xAxis.data = [
        '00:00',
        '03:00',
        '06:00',
        '09:00',
        '12:00',
        '15:00',
        '18:00',
        '22:00',
        '00:00',
      ]
      bloodPressureMonitorOptions.series[0]!.data = []
      bloodPressureMonitorOptions.series[1]!.data = []
      BloodPressureMonitorRef.value!.initData(bloodPressureMonitorOptions, {
        txt: '暂无监护数据。',
        time: jctime.value,
      })
      HeartRateMonitorRef.value!.initData(emptyPieOption)
      initBloodChart(emptyPieOption)
      BreathingRateMonitorRef.value!.initData(emptyPieOption)
      ElectrocardiographicRef.value!.initData(emptyPieOption)

      setSugerChart({})
    }
    isLoading.value = false
  } catch (error) {
    console.error('数据加载失败:', error)
    isLoading.value = false
  }
}

type spo = {
  '92~100': number
  '92~100~avg': number
  '85~91': number
  '85~91max': number
  '<85': number
  '<85min': number
  txt: string
  time: string
}
const spoinfo = ref<spo>()
const initBloodChart = (option: any, detail?: spo) => {
  let echartItem = document.querySelector(`#bloodChart`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  spoinfo.value = detail
  let _echarts = echarts.init(echartItem)
  _echarts.setOption(option)
  window.addEventListener('resize', () => {
    _echarts.resize()
  })
}

function getMonitorRange() {
  const now = getHalfHourPoint(new Date())
  const end = now
  const start = getHalfHourPoint(new Date(now.getTime() - 24 * 60 * 60 * 1000))
  const pad = (n: number) => n.toString().padStart(2, '0')
  const format = (d: Date) =>
    `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`

  return `${format(start)} ~ ${format(end)}`
}

function getHalfHourPoint(date = new Date()) {
  const d = new Date(date)
  d.setSeconds(0, 0)
  const minutes = d.getMinutes()
  d.setMinutes(minutes < 30 ? 0 : 30)
  return d
}
const jctime = ref('')
const scrollToBottom = () => {
  // 获取容器元素
  const container = document.querySelector('.overflowscroll') as HTMLElement
  // 滚动到底部
  container.scrollTop = container.scrollHeight

  // 或者使用 scrollIntoView
  // container.lastElementChild.scrollIntoView({ behavior: 'smooth' });
}
onMounted(async () => {
  // 初始化页面
  updateCurrentTime()

  timeUpdateInterval = window.setInterval(updateCurrentTime, 1000)
  jctime.value = getMonitorRange()
  fetchPatientInfo()
  await loadMockData()
  if (route.query.type == 'scroll') {
    nextTick(() => {
      scrollToBottom()
    })
  }
})

onUnmounted(() => {
  // 清理定时器
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})
</script>

<style scoped>
@media (min-height: 1080px) {
  .pt22media {
    padding-top: 2.2vh;
  }
}
.monitoring-overview {
  width: 100vw;
  /* height: 100vh; */
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.timeitem:not(:last-child) {
  border-bottom: 1px solid #384951;
}
.timeitem:nth-child(3n) {
  background: rgba(255, 255, 255, 0.01);
  box-shadow: inset 0px 0px 24px 0px #276665;
}

.bs {
  border-radius: 50%;
  box-shadow:
    0px 0px 2px 0px #9ec099,
    0px 0px 4px 0px #9ec099,
    0px 0px 15px 0px #9ec099,
    0px 0px 30px 0px #153314,
    0px 0px 51px 0px #153314,
    0px 0px 90px 0px #153314;
}
.rounddot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px solid #153314;
  background-color: rgba(21, 51, 20, 0.6);
}

.header {
  height: 4.5vh;
  background: rgba(34, 49, 44, 0.6);
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
  transform: perspective(1.48vh) rotateX(-0.5deg);
  transform-origin: top center;
  border-radius: 0 0 0.4vh 0.4vh;
  backdrop-filter: blur(1.48vh);
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

.content {
  flex: 1;
  display: flex;
  gap: 2vh;
  padding: 2vh;
  padding-right: 1vh;
}
.overflowscroll {
  overflow-y: scroll;
}
.middle-section {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: calc(20 / 1080 * 100vh);
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(20 / 1080 * 100vh);
}

.card {
  border-radius: 8px;
  border: 1px solid #eeeeee;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding: calc(20 / 1080 * 100vh) calc(24 / 1920 * 100vw);
  height: calc(284 / 1080 * 100vh);
}

.card-title {
  font-size: calc(18 / 1080 * 100vh);
  font-weight: bold;
  color: #384951;
  padding-bottom: calc(20 / 1080 * 100vh);
  border-bottom: 1px solid #eeeeee;
  margin-bottom: calc(20 / 1080 * 100vh);
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

.ani {
  animation: fadeIn 0.5s ease-out;
}

.ani:nth-child(1) {
  animation-delay: 0.1s;
}
.ani:nth-child(2) {
  animation-delay: 0.2s;
}
.ani:nth-child(3) {
  animation-delay: 0.3s;
}
.ani:nth-child(4) {
  animation-delay: 0.4s;
}
.ani:nth-child(5) {
  animation-delay: 0.5s;
}

/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; /* 可根据需要调整宽度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
  min-height: 10px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: rgba(86, 227, 157, 0.4);
}
.text16cus {
  font-size: calc(16 / 1080 * 100vh);
  line-height: 1;
}
.text14cus {
  font-size: calc(14 / 1080 * 100vh);
  line-height: 1;
}
.mb20cus {
  margin-bottom: calc(20 / 1080 * 100vh);
}
</style>
