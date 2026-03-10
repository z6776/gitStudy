<template>
  <div class="breathingRateMonitor">
    <p class="card-title">呼吸率监测</p>
    <div class="flex justify-end line-height-14px mb-2vh">
       <div class="color-[#636676] text-[14px]">监测时间：</div>
       <div class="text-14px color-[#636676]">{{ dateFtt("yyyy/mm/dd",lastItem.time) }}</div>
       <div class="text-14px color-[#636676] ml-8px">{{ dateFtt("hh:MM",lastItem.time) }}</div>
    </div>
    <div class="flex justify-between items-end">
       <div id="respiratoryRate" class="respiratoryRate w-614px h-15vh"  >
        
       </div>
       <div class="flex flex-col justify-between items-end">
         
          <div class="text-60px color-[#384951] line-height-60px font-bold">{{ lastItem.number || "--" }}</div>
          <div class="color-[#929FAF] text-[16px]">次/分钟</div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted ,onBeforeUnmount} from 'vue';
import * as echarts from "echarts";
import { dateFtt } from '@/utils/date/dateFtt';

 type breath = {
      time:number | null,
      number:string | null
  }
  const lastItem = ref<breath>({
    time:null,
    number:null
  })
    let echartsHx:any = null;
const initData = (option:any,last:breath)=>{
  lastItem.value = last;
     let echartItem = document.querySelector(`#respiratoryRate`) as HTMLElement;
     if(echarts.getInstanceByDom(echartItem)){
       echarts.dispose(echartItem);
     }
     echartsHx = echarts.init(echartItem);
     echartsHx.setOption(option);   
};

defineExpose({
  initData
});

 
let resizeTimer:any = null;
let currentZoom = 1; // dpi;
// 处理窗口大小变化和缩放
const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    const newZoom = window.devicePixelRatio;
    if (Math.abs(newZoom - currentZoom) > 0.01) {
      currentZoom = newZoom 
      if(echartsHx){
         echartsHx?.resize();
      }
    }
  }, 300)
}

onMounted(() => {
   currentZoom = window.devicePixelRatio;
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.breathingRateMonitor {
     height: calc(277 / 1080 * 100vh);
    background: #fff;

   padding: calc(20 / 1080 * 100vh);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);
}
 .card-title {
  width: 306px;
  font-weight: bold;
  font-size: calc(18 / 1080 * 100vh);
  color: #384951;
  margin-bottom: calc(12 / 1080 * 100vh);
}
</style>
