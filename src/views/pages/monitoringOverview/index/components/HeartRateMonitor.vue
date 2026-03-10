<template>
  <div class="heartRateMonitor">
    <p class="card-title">心率/血氧监测</p>
    <div class="flex justify-between items-center">
      <div class="color-[#24B287] text16vh font-bold w-518px">HR</div>
      <div class="flex-1 flex items-end">
        <span class="color-[#636676] text18vh font-bold">HR</span>
        <span class="color-[#636676] text14vh ml-2px">bpm</span>
        <span class="ml-auto color-[#636676] text16vh">{{ lastItem.min }}</span>
      </div>
    </div>
    <div class="flex justify-between mb-1vh gap-8px">
      <div id="heartRateChart" class="w-510px h-7.16vh flex-shrink-0" ref="heartRateChart"></div>

      <div class="flex justify-between w-180px line-height-1 mt-1.2vh">
        <div class="flex flex-col items-start">
          <div class="color-[#24B287] text14vh mb-0.5vh">{{ lastItem.gxl }}</div>
          <div class="color-[#24B287] text14vh">{{ lastItem.dxl }}</div>
        </div>
        <div class="color-[#384951] text60vh font-bold line-height-60vh" :class="{'color-[#DA4343]!':lastItem.type}">
          {{ lastItem.value|| "--" }}
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div class="color-[#0477E0] text16vh font-bold w-518px mr-auto">SpO2</div>
      <div class="flex items-end flex-1">
        <span class="color-[#636676] text18vh font-bold">SpO2</span>
        <span class="color-[#636676] text16vh ml-2px">%</span>
        <span class="ml-auto color-[#636676] text16vh">{{ lastBlood.min || "--" }}</span>
      </div>
    </div>
    <div class="flex justify-between gap-8px mt-auto">
      <div id="bloodChart" class="w-510px h-7.16vh flex-shrink-0"></div>
      <div class="flex justify-between w-180px line-height-1  mt-1.2vh">
        <div class="flex flex-col items-start">
          <div class="color-[#0477E0] text14vh">{{ lastBlood.i_spo2 || "" }}</div>
        </div>
        <div class="color-[#384951] text60vh font-bold">
          {{ lastBlood.value || "--" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,onBeforeUnmount ,nextTick,computed} from 'vue'
import { scaleByHeight } from "@/utils/function/function";
import * as echarts from 'echarts'
import { dateFtt } from '@/utils/date/dateFtt'
import { emptyOptions ,emptyOptionsspo} from "@/utils/baseOptions/emptyOption";

const props = defineProps<{ list: Array<any> }>()

type last = {
  min: string
  gxl: string
  dxl: string
  value: number
  i_spo2: number
  type?:boolean
}
const lastItem = ref<Partial<last>>({});
let spoEmpty = ref(false);
 
let resizeTimer:any = null;
let currentZoom = 1; // dpi;
// 处理窗口大小变化和缩放
const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    const newZoom = window.devicePixelRatio;
    if (Math.abs(newZoom - currentZoom) > 0.01) {
      currentZoom = newZoom
      _echartsHr.setOption({
        xAxis:{
          axisLabel:{
             fontSize:scaleByHeight(12)
          }
        },
        series:[{
          symbolSize:scaleByHeight(8),
          label:{
            fontSize:scaleByHeight(12)
          }
        }]
      });
      _echartsHr?.resize();

      //  _echartsBlood.setOption({
      //   xAxis:{
      //     axisLabel:{
      //        fontSize:scaleByHeight(12)
      //     }
      //   },
      //   series:[{
      //     label:{
      //       fontSize:scaleByHeight(12)
      //     }
      //   }]
      // });
      _echartsBlood?.resize();


    }
  }, 300)
}
let _echartsHr:any = null;
let _echartsBlood: any = null
const initDataHR = async (option: any, last: any) => 
{
   if(option.series[0].data.every((item:any)=>!item)){
      spoEmpty.value = true
   }
   await nextTick();
setTimeout(() => {
  let echartItem = document.querySelector(`#heartRateChart`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  _echartsHr = echarts.init(echartItem);
  if(option.series[0].data.every((item:any)=>!item)){
         _echartsHr.setOption(emptyOptions)
         return
  }
  if (option.series[0].data && option.series[0]?.data?.length) {
    lastItem.value = {
      min: dateFtt('hh:MM', last.insert_time),
      gxl: last.high_heartrate_value,
      dxl: last.low_heartrate_value,
      type: last.low_heartrate_type===1 || last.high_heartrate_type===1,
      value: last.heartrate || 0,
    }
  }
  option.series[0].label.formatter = function (params: any) {
    if (
      props.list?.[params.dataIndex]?.high_heartrate_type === 1 ||
      props.list?.[params.dataIndex]?.low_heartrate_type === 1
    ) {
      return ''
    }
    return params.value
  }
  option.series[0].markPoint.label.formatter = function (params: any) {
    return params.data.coord[1]
  }
 
  _echartsHr.setOption(option);
   
},300)
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
  }
  _echartsBlood = echarts.init(echartItem)
    if(option.series[0].data.every((item:any)=>!item)){
         _echartsBlood.setOption(emptyOptionsspo)
         return
  }
  option.series[0].label.formatter = function (params: any) {
    if (props.list?.[params.dataIndex]?.spo2_type === 1) {
      return ''
    }
    return params.value
  }
  option.series[0].markPoint.label.formatter = function (params: any) {
    return params.data.coord[1]
  }
  _echartsBlood.setOption(option)
}

defineExpose({
  initDataHR,
  initDataBlood,
})


onMounted(()=>{
     currentZoom = window.devicePixelRatio;
      window.addEventListener('resize', handleResize)
})
onBeforeUnmount(()=>{
     window.removeEventListener('resize', handleResize)
})
 

// heartRateChart
</script>
<style scoped>
.heartRateMonitor {
  background: #FFFFFF;
  border-radius: 8px;
  padding:  calc(20 / 1080 * 100vh);
  height: calc(277 / 1080 * 100vh);
  transition: all 0.3s ease;
  position: relative;
  box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);
}

.text16vh{
   font-size: calc(16 / 1080 * 100vh);
   line-height:  calc(16 / 1080 * 100vh);
}
.text14vh{
   font-size: calc(14 / 1080 * 100vh);
   line-height:  calc(14 / 1080 * 100vh);
}
.text18vh{
   font-size: calc(18 / 1080 * 100vh);
   line-height:  calc(18 / 1080 * 100vh);
}
.text60vh{
     font-size: calc(60 / 1080 * 100vh);
   line-height:  calc(60 / 1080 * 100vh);
}
.card-title {
  font-size: calc(18 / 1080 * 100vh);
  color: #384951;
  font-weight: bold;
  margin-bottom: calc(12 / 1080 * 100vh);
}
</style>
