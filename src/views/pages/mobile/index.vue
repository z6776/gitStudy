<template>
  <div class="mobile">
    <div class="">
      <div class="p-[15px] bg-[#222631] h-151px flex items-center">
        <!--  -->
        <div class="flex flex-col justify-between items-start flex-shrink-0 mr-20px w-120px">
          <div class="text-[18px] color-[#fff] font-400 line-height-18px mb-8px" v-if="lastItemData.heartrate">{{ date }}</div>
          <div class="flex line-height-24px items-end">
            <span class="text-[24px] color-[#5BDD56] font-bold mr-3px">HR</span>
            <span class="text-[18px] color-[#5BDD56] line-height-18px">bpm</span>
          </div>
          <div class="text-[60px] color-[#5BDD56] font-bold line-height-60px">{{ lastItemData.heartrate|| "--" }}</div>
        </div>
        <div id="heartRateChart" class="w-519px h-111px flex-shrink-0 flex-1"></div>
      </div>

      <div class="p-[15px] bg-[#141929] h-151px flex items-center">
         <!--  -->
        <div class="flex flex-col justify-center items-start flex-shrink-0 mr-20px w-120px">
          <div class="text-[18px] color-[#fff] font-400 line-height-18px mb-8px" v-if="lastItemData.spo2">{{ date }}</div>
          <div class="flex line-height-24px items-end">
            <span class="text-[24px] color-[#56E3E1] font-bold mr-3px">SpO2</span>
            <span class="text-[18px] color-[#56E3E1] line-height-18px">%</span>
          </div>
          <div class="text-[60px] color-[#56E3E1] font-bold line-height-60px">{{ lastItemData.spo2|| "--" }}</div>
        </div>
        <div id="bloodChart" class="w-519px h-111px flex-shrink-0 flex-1"></div>
      </div>

      <div class="p-[15px] bg-[#222631] h-178px flex items-center">
        <!--  -->
        <div class="flex flex-col justify-between items-start flex-shrink-0 mr-20px w-120px">
              <div class="text-[18px] color-[#fff] font-400 line-height-18px mb-12px" v-if="lastItemData.sbp">{{ date }}</div>
          <div class="flex line-height-24px items-end">
            <span class="text-[24px] color-[#ffffff] font-bold mr-3px">NIBP</span>
            <span class="text-[18px] color-[#D8D8D8] line-height-18px">mmHg</span>
          </div>
          <div class="flex line-height-34px items-end">
            <span class="text-[34px] color-[#ffffff] font-bold mr-3px">{{ lastItemData.sbp|| "--" }}/</span>
            <span class="text-[34px] color-[#ffffff]">{{ lastItemData.dbp|| "--" }}</span>
          </div>
          <div class="text-[34px] color-[#ffffff] font-bold line-height-34px">({{isNaN(lastItemData.sbp-lastItemData.dbp) ? "--" : (Math.floor(lastItemData.sbp-lastItemData.dbp) || "--")   }})</div>
        </div>
        <div id="nibpChart" class="w-519px h-130px flex-shrink-0 flex-1"></div>
      </div>

      <div class="ecg p-[12px] bg-[#141929] h-270px">
        <div class="flex justify-between items-center mb-10px">
          <span class="text-24px color-[#D8D8D8]">ECG心电</span>
          <span class="text-18px color-[#D8D8D8]">采集时间：{{ xdtime || "--" }}</span>
        </div>
       <div class="relative h-154px">
         <div id="chartEcg" class="h-154px"></div>
        <div class="background relative">
       
        </div>
       </div>
       

        <!-- <div class="color-[#D8D8D8] text-[18px] line-height-18px mt-12px">
          此次心电采集, 平均心率正常, 心脏负荷正常
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// chartHr
import { onMounted, ref, reactive, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { emptyOptions, emptyOptionsspo } from '@/utils/baseOptions/emptyOption'
 
import { dateFtt } from '@/utils/date/dateFtt'
let spoEmpty = ref(false)
import MonitoringOverviewApi from '@/api/monitoringOverview'
import ElectrocarDiographicApi from '@/api/electrocardiographic'
import { hrOptions, NibpOptions, electrocardiogramOptions, spoOptions } from './options/index'
import { md5Str } from '@/utils/function/function'
import { useRoute } from 'vue-router';
const route = useRoute()
type last = {
  min: string
  gxl: string
  dxl: string
  value: number
  i_spo2: number
  type?: boolean
}
const lastItem = ref<Partial<last>>({})

const patientId = computed(() => route.query.pid)
const date = computed(() => {
     if(lastItemData.value?.insert_time){
        return dateFtt('mm-dd hh:MM',lastItemData.value?.insert_time)
     }
     return "--"
})

const createBackGround = ()=>{
    const innerWidth = document.querySelector('.background')?.clientWidth || 0;
    const innerHeight = document.querySelector('.background')?.clientHeight || 0;
    let boxWidth = 7;
    let boxHeight = 7;
    if(window.innerWidth <= 1280){
      boxWidth = 4;
      boxHeight = 4;
    };

    let rowlen = Math.ceil(innerWidth/boxWidth);
    let collen = Math.ceil(innerHeight/boxHeight);
    for (let i = 0; i < rowlen; i++) {
      for (let j = 0; j < collen; j++) {
        const box = document.createElement('div');
        box.style.width = boxWidth + 'px';
        box.style.height = boxHeight + 'px';
        box.style.position = 'absolute';
        box.style.left = i * boxWidth + 'px';
        box.style.top = j * boxHeight + 'px';
        box.style.boxSizing = 'border-box';
        box.style.borderRight = '1px solid rgba(56, 73, 81, 0.5)';
        box.style.borderBottom = '1px solid rgba(56, 73, 81, 0.5)';
        document.querySelector('.background')?.appendChild(box);
      }
    }
}



const initChartEcg = (data: any) => {
  const chartDom = document.getElementById('chartEcg') as HTMLElement

  const myChart = echarts.init(chartDom)
  const option = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      show: false,
    },
    xAxis: {
      type: 'time',
      data: [],
      axisLine: {
        show: false,
        lineStyle: {
          color: '#999',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },

      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        formatter: function (value: number) {
          const date = new Date(value)
          // 假设数据范围是 2023-01-01 到 2023-12-31
          const minDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0,
          ).getTime()
          const maxDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            23,
            59,
            59,
          ).getTime()
          // 如果是最小值或最大值，添加标记
          if (value === minDate) {
            return '00:00'
          } else if (value === maxDate) {
            return '23:59'
          }
          return dateFtt('hh:MM', value) // 默认格式
        },
        show: false,
      },
      // scale: true, // 自动缩放 Y 轴
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
      // scale: true, // 自动缩放 Y 轴
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'ECG',
        type: 'line',
        data: data,
        smooth: true, // 平滑曲线
        lineStyle: {
          color: '#E24040', // 红色线条
          width: 0.5,
        },
        symbol: 'none', // 不显示数据点标记
      },
    ],
    dataZoom: [
      {
        type: 'inside', //类型
        // filterMode:"none",
        show: true, //显示
        // minValueSpan: 9 * 60 * 1000, // 最小窗口范围：1 分钟（60,000 毫秒）
        // maxValueSpan: 24 *  60 * 60 * 1000, // 最大窗口范围：1 分钟（固定）
        start: 80, // 初始显示 0%~100%（即整个 1 分钟范围）
        end: 100, // 结束显示 0%~100%（即整个 1 分钟范围）
      },
    ],
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
  }

  myChart.setOption(option)
 
}

const initDataHR = async (option: any, last: any) => {
  if (option.series[0].data.every((item: any) => !item)) {
    spoEmpty.value = true
  }
  await nextTick()
  setTimeout(() => {
    let echartItem = document.querySelector(`#heartRateChart`) as HTMLElement
    if (echarts.getInstanceByDom(echartItem)) {
      echarts.dispose(echartItem)
    }
    let _echarts = echarts.init(echartItem)
    if (option.series[0].data.every((item: any) => !item)) {
      _echarts.setOption(emptyOptions)
      window.addEventListener('resize', () => {
        _echarts.resize()
      })
      return
    }
    if (option.series[0].data && option.series[0]?.data?.length) {
      option.series[0].markLine.data = [
        ...Array.from({ length: option.series[0]?.data?.length }).map((_, index) => ({
          xAxis: index,
          label: { show: false },
        })),
      ]
    }
    // 
    option.series[0].markPoint.label.formatter = function (params: any) {
      return params.data.coord[1]
    }
    window.addEventListener('resize', () => {
      _echarts.resize()
    })
    _echarts.setOption(option)
  }, 300)
}

// 1秒钟 250个点  一分钟的数据
type generateECGDataType = {
  ecgData: [number, number][]
}
const generateECGData = (ecg: number[]): generateECGDataType => {
  let arr = []
  let second = 1000 / 250
  for (let i = 0; i < ecg.length; i++) {
    arr.push([Number((new Date().getTime() + i * second).toFixed(0)), ecg[i]])
  }

  return {
    ecgData: arr as [number, number][],
  }
}
const xdtime = ref('')
const setChartEcg = async (item: any) => {
  electrocardiogramOptions.series[0]!.data = []
  let hour = ''
  if (item?.insert_time) {
    let _a = dateFtt('hh:MM', item.insert_time).split(':')
    hour = Number(_a[0]) + ''
    xdtime.value = dateFtt('yyyy/mm/dd hh:MM', item.insert_time)
  }
  const _result = await ElectrocarDiographicApi.get_m9_ecg_wave({
    patient_id: patientId.value,
    date: dateFtt('yyyy-mm-dd', new Date()),
    md5: md5Str(patientId.value + ''),
    hour,
  })
  if (
    Array.isArray(_result.data.result) &&
    _result.data.result.length > 0 &&
    _result.data.result[0].ecg_data
  ) {
    electrocardiogramOptions.series[0]!.data = generateECGData(
      _result.data.result[0].ecg_data,
    ).ecgData
    // debugger;
  }
  nextTick(() => {
    initChartEcg(electrocardiogramOptions.series[0]!.data)
  })
}

const initDataNibp = async (option: any, last: any) => {
  if (option.series[0].data.every((item: any) => !item)) {
    spoEmpty.value = true
  }
  await nextTick()
  setTimeout(() => {
    let echartItem = document.querySelector(`#nibpChart`) as HTMLElement
    if (echarts.getInstanceByDom(echartItem)) {
      echarts.dispose(echartItem)
    }
    let _echarts = echarts.init(echartItem)
    if (option.series[0].data.every((item: any) => !item)) {
      _echarts.setOption(emptyOptions)
      window.addEventListener('resize', () => {
        _echarts.resize()
      })
      return
    }
    if (option.series[0].data && option.series[0]?.data?.length) {
  
      option.series[0].markLine.data = [
        ...Array.from({ length: option.series[0]?.data?.length }).map((_, index) => ({
          xAxis: index,
          label: { show: false },
        })),
      ]
      option.series[1].markLine.data = [
        ...Array.from({ length: option.series[0]?.data?.length }).map((_, index) => ({
          xAxis: index,
          label: { show: false },
        })),
      ]
    } 
    option.series[0].markPoint.label.formatter = function (params: any) {
      return params.data.coord[1]
    }
     option.series[1].markPoint.label.formatter = function (params: any) {
      return params.data.coord[1]
    }
    window.addEventListener('resize', () => {
      _echarts.resize()
    })
    _echarts.setOption(option)
  }, 300)
}

const lastBlood = ref<Partial<last>>({})
const initDataBlood = (option: any, last: any) => {
  let echartItem = document.querySelector(`#bloodChart`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  if (option.series[0].data && option.series[0]?.data?.length) {
    lastBlood.value = {
      min: dateFtt('hh:MM', last.insert_time),
      value: last.spo2 || 0,
      i_spo2: last.i_spo2,
    }
    option.series[0].markLine.data = [
      ...Array.from({ length: option.series[0]?.data?.length }).map((_, index) => ({
        xAxis: index,
        label: { show: false },
      })),
    ]
  }
  let _echarts = echarts.init(echartItem)
  if (option.series[0].data.every((item: any) => !item)) {
    _echarts.setOption(emptyOptionsspo)
    window.addEventListener('resize', () => {
      _echarts.resize()
    })
    return
  }
  option.series[0].markPoint.label.formatter = function (params: any) {
    return params.data.coord[1]
  }
  _echarts.setOption(option)
}

const list = ref<any[]>([])

// 模拟数据加载
// const list = ref<any[]>([])
let lastItemData = ref<any>({})
const loadMockData1 = async () => {
  try {
    //  // 血氧监测
    let _hr = await MonitoringOverviewApi.monitor_data({
      patient_id: patientId.value,
      start: Math.round(new Date().getTime() / 1000) - 86400,
      end: Math.round(new Date().getTime() / 1000),
    })
    list.value = _hr.data?.result ?? []
   
    if (list.value.length > 0) {
       lastItemData.value = list.value[list.value.length - 1];
      let _hrOptions = JSON.parse(JSON.stringify(hrOptions))
      let _spoOptions = JSON.parse(JSON.stringify(spoOptions))
      let _NibpOptions = JSON.parse(JSON.stringify(NibpOptions))
      _hrOptions.xAxis.data = []
      _hrOptions.series[0].data = []
      _hrOptions.series[0].markPoint.data = []
      _spoOptions.xAxis.data = []
      _spoOptions.series[0].data = []
      _spoOptions.series[0].markPoint.data = []
      _NibpOptions.xAxis.data = []
      _NibpOptions.series[0].data = []
      _NibpOptions.series[0].markPoint.data = []
      list.value.forEach((value, index) => {
        value.lastData = {}
        let time = dateFtt('hh:00', value.insert_time)
        let _h = value.heartrate
        let _spo = value.spo2
        // 心率数据
        _hrOptions.xAxis.data.push(time)
        _hrOptions.series[0].data.push(_h)
        _hrOptions.series[0].markLine.data.push({
          xAxis: time,
        })
        if (value.high_heartrate_type === 1 || value.low_heartrate_type === 1) {
          _hrOptions.series[0].markPoint.data.push({
            name: '预警值',
            coord: [time, value.heartrate],
          })
        }

        //  血氧数据
        _spoOptions.xAxis.data.push(time)
        _spoOptions.series[0].data.push(_spo)
        _spoOptions.series[0].markLine.data.push({
          xAxis: time,
        })
        if (value.spo2_type === 1) {
          _spoOptions.series[0].markPoint.data.push({
            name: '预警值',
            coord: [time, value.spo2],
          })
        }
        //  NIMP
        _NibpOptions.xAxis.data.push(time)
        let _v1 = value.sbp
        let _v2 = value.dbp
        _NibpOptions.series[0].data.push(_v1)
        _NibpOptions.series[1].data.push(_v2)
        _NibpOptions.series[0].markLine.data.push({
          xAxis: time,
        })
        if (value.sbp_type === 1) {
          _NibpOptions.series[0].markPoint.data.push({
            name: '高压预警',
            coord: [time, value.sbp],
          })
        }
        if (value.dbp_type === 1) {
          _NibpOptions.series[1].markPoint.data.push({
            name: '低压预警',
            coord: [time, value.dbp],
          })
        }
      })

      //   })
      _hrOptions.series[0].label.formatter = function (params: any) {
        if (
          list.value?.[params.dataIndex]?.high_heartrate_type === 1 ||
          list.value?.[params.dataIndex]?.low_heartrate_type === 1
        ) {
          return ''
        }
        return params.value
      }
      _spoOptions.series[0].label.formatter = function (params: any) {
        if (list.value?.[params.dataIndex]?.spo2_type === 1) {
          return ''
        }
        return params.value
      }
      _NibpOptions.series[0].label.formatter = function (params: any) {
        if (list.value?.[params.dataIndex]?.sbp_type === 1) {
          return ''
        }
        return params.value
      }
      _NibpOptions.series[1].label.formatter = function (params: any) {
        if (
          list.value?.[params.dataIndex]?.dbp_type === 1 ||
          list.value?.[params.dataIndex]?.dbp == 0
        ) {
          return ''
        }
        return params.value
      }
      let _last = list.value.length > 0 ? list.value[list.value.length - 1] : {}
      nextTick(() => {
        let _hrstr = [..._hrOptions.series[0].data]
        let _hrmax = Math.max(..._hrstr)
        let _hrmin = Math.min(..._hrstr)
        if (!isNaN(_hrmax)) {
          _hrOptions.yAxis.max = _hrmax + 50
        }
        if (!isNaN(_hrmin)) {
          _hrOptions.yAxis.min = _hrmin
        }
        initDataHR(_hrOptions, _last)
        let _spostr = [..._spoOptions.series[0].data]
        let _spomax = Math.max(..._spostr)
        let _spomin = Math.min(..._spostr)
        if (!isNaN(_spomax)) {
          _spoOptions.yAxis.max = _spomax + 50
        }
        if (!isNaN(_spomin)) {
          _spoOptions.yAxis.min = _spomin - 20
        }

        initDataBlood(_spoOptions, _last)
        initDataNibp(_NibpOptions, _last)
        //  breathingRateMonitoRef.value?.initData(respiratoryOptions,last.value);
      })
    }

    // 加载完成
    // isLoading.value = false
  } catch (error) {
    console.error('数据加载失败:', error)
    // isLoading.value = false
  }
}
const fetchData = async ()=>{
  let res = await MonitoringOverviewApi.monitor_plan_ecg({
        patient_id:patientId.value,
        date:dateFtt('yyyymmdd',new Date())
  });
  if(res.data?.result && res.data?.result.length){
    let len =res.data?.result.length-1;
     setChartEcg(res.data?.result[len])
  }else{
    nextTick(() => {
    initChartEcg(electrocardiogramOptions.series[0]!.data)
  })
  }
 
}

onMounted(() => {
  nextTick(() => {
    createBackGround();
 fetchData();
    loadMockData1()
  })
})
</script>
<style scoped>
  .background{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 154px;
  border: 1px solid  rgba(56, 73, 81, 0.5);
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}
.mobile {
  height: 100vh;
  background-color: #000a31;
  padding: 15px;
}
.wline {
  width: 60px;
  height: 4px;
  background-color: #0088ff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0px;
}
</style>
