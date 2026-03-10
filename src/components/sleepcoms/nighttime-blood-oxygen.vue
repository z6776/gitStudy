<template>
  <div
    class="w-full h-368px bg-#fff rounded-12px box-shadow border-[1px-solid-#eeeeee] mt-20px p-24px"
  >
    <div class="flex justify-between items-center">
      <span class="font-bold text-18px color-[#384951]">夜间{{  active == 1 ? '心率' : '血氧饱和度' }}数据统计</span>
      <div class="flex border rounded-4px">
        <div
          @click="changeActive(1)"
          :class="{ 'bg-[#24B287] color-[#fff]': active == 1 }"
          class="w-111px h-38px line-height-38px  cursor-pointer text-center text-16px color-[#24B287]"
        >
          心率
        </div>
        <div
          @click="changeActive(2)"
          :class="{ 'bg-[#24B287] color-[#fff]': active == 2 }"
          class="w-111px h-38px line-height-38px  cursor-pointer text-center text-16px color-[#24B287]"
        >
          血氧饱和度
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center mt-15px mb-15px" v-if="active == 1">
      <div class="w-33% flex flex-col justify-center afterBorder">
        <div class="m-[0_auto]">
          <span class=" text-16px color-[#646676]">最大心率</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{ hr.max_hr || "--" }}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">bpm</span>
          </div>
        </div>
      </div>
      <div class="w-33% flex flex-col justify-center items-center afterBorder">
        <div class="m-[0_auto]">
          <span class=" text-16px color-[#646676]">最小心率</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{ hr.min_hr  || "--"}}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">bpm</span>
          </div>
        </div>
      </div>
      <div class="w-33% flex flex-col justify-center items-center">
        <div class="m-[0_auto]">
          <span class=" text-16px color-[#646676]">平均心率</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{ hr.avg_hr  || "--"}}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">bpm</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center mt-15px mb-15px" v-if="active == 2">
      <div class="w-33% flex flex-col justify-center afterBorder">
        <div class="m-[0_auto]">
          <span class=" text-16px color-[#646676]">最大血氧饱和度</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{ spo.max_spo2 || "--" }}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">%</span>
          </div>
        </div>
      </div>
      <div class="w-33% flex flex-col justify-center items-center afterBorder">
        <div class="m-[0_auto]">
          <span class=" text-16px color-[#646676]">最小血氧饱和度</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{ spo.min_spo2  || "--"}}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">%</span>
          </div>
        </div>
      </div>
      <div class="w-33% flex flex-col justify-center items-center">
        <div class="m-[0_auto]">
          <span class=" text-16px color-[#646676]">平均血氧饱和度</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{ spo.avg_spo2  || "--"}}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">%</span>
          </div>
        </div>
      </div>
    </div>
   <div v-if="Empty" class="flex items-center justify-center color-[#636676] text-14px w-full h-190px bg-#F5F7FB">
          暂无数据~
   </div>
    <div id="xlchart" v-if="active == 1 && !Empty" class="w-full h-190px"></div>

    <div id="xychart" v-if="active == 2  && !Empty" class="w-full h-190px"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { xlOptions, xyOptions } from '@/utils/baseOptions/sleepoptions'
import { dateFtt } from '@/utils/date/dateFtt'
import { computed, onMounted, ref, watch, nextTick } from 'vue'

const active = ref(1)
const changeActive = (index: number) => {
  active.value = index
  nextTick(() => {
    if (index == 1) {
      initChartsxl()
      return
    }
    initChartsxy()
  })
}

const props = defineProps({
  hrspo2:{
    type:Object,
    default:{}
  }
});
type hrtype = {
  avg_hr:number,
  max_hr:number,
  min_hr:number
}
type spotype = {
  avg_spo2:number,
  max_spo2:number,
  min_spo2:number
}
const hr = ref<Partial<hrtype>>({});
const spo = ref<Partial<spotype>>({});
const Empty = ref(true);
watch(()=>props.hrspo2,(newval)=>{

     if(typeof newval==='object' && Object.keys(newval)?.length > 0){
      
        let val = newval.hr?.night_sleep_hr_text;
          let valxy = props.hrspo2.spo?.night_sleep_spo2_text;
        hr.value = newval.hr;
        spo.value = newval.spo;
        if(active.value==1){
          xlOptions.xAxis.data =  Object.keys(val).sort().map(v=>v);
          xlOptions.series[0]!.data = Object.keys(val).sort().map(v=>val[v]);
          Empty.value = false;
          nextTick(()=>{
               initChartsxl();
          })
        }else{
          
              xyOptions.xAxis.data =  Object.keys(valxy).sort().map(v=>v);
        xyOptions.series[0]!.data = Object.keys(valxy).sort().map(v=>valxy[v]);
          Empty.value = false;
         nextTick(()=>{
             initChartsxy();
         })
        }
        return;
     }
     Empty.value = true;
     hr.value = {}
     spo.value = {};
    
},{deep:true})






const initChartsxl = () => {
  let hxchart: HTMLElement = document.getElementById('xlchart') as HTMLElement
  if (echarts.getInstanceByDom(hxchart)) {
    echarts.dispose(hxchart)
  }
  let myChart = echarts.init(hxchart)
  let option = { ...xlOptions }
  myChart.setOption(option)
}

const initChartsxy = () => {
  let hxchart: HTMLElement = document.getElementById('xychart') as HTMLElement
  if (echarts.getInstanceByDom(hxchart)) {
    echarts.dispose(hxchart)
  }
  let myChart = echarts.init(hxchart)
   if(typeof props?.hrspo2?.spo==='object' && Object.keys(props?.hrspo2?.spo).length > 0){
    let val = props.hrspo2.spo?.night_sleep_spo2_text;
        xyOptions.xAxis.data =  Object.keys(val).sort().map(v=>v);
  xyOptions.series[0]!.data = Object.keys(val).sort().map(v=>val[v]);
     }

  let option = { ...xyOptions }
  myChart.setOption(option)
}

 
</script>
<style scoped>
.border {
  border: 1px solid #24b287;
}
</style>
