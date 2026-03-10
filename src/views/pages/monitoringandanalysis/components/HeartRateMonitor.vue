<template>
  <div class="heartRateMonitor ani">
    <p class="card-title">心率监测分析</p>
    
    <div class="flex justify-between items-center mb20cus">
        <span class="color-[#384951] text16cus font-bold">24小时心率采集分析报告</span>
        <span class="color-[#636676] text14cus">监测范围：{{ jctime }}</span>
    </div>
     <div class="flex gap-36px items-center pl-22px">
      <div id="hrChart" class="w-13vh h-13vh"></div>
      <div class="">
        <div class="flex mb-1.48vh items-center line-height-1.48vh">
          <div class="w-12px h-12px bg-[#24B287] mr-8px"></div>
          <div class="color-[#929FAF] text16cus w-152px mr-8px">60≤心率≤100bpm</div>
          <div class="text16cus color-[#384951] mr-40px w32px">{{ info?.['60~100'] ?? "--"  }}%</div>
          <div class="text16cus color-[#929FAF]">平均心率：</div>
          <div class="text16cus color-[#384951]">{{ info?.['60~100~avg']?? "--"   }}bpm</div>
        </div>
        <div class="flex mb-1.48vh items-center line-height-1.48vh">
          <div class="w-12px h-12px bg-[#DA4343] mr-8px"></div>
          <div class="color-[#929FAF] text16cus w-152px mr-8px">心率＞100bpm</div>
          <div class="text16cus color-[#384951] mr-40px w32px">{{ info?.['>100']?? "--"   }}%</div>
          <div class="text16cus color-[#929FAF]">最高心率：</div>
          <div class="text16cus color-[#384951]">{{ info?.['>100max'] ?? "--"  }}bpm</div>
        </div>
        <div class="flex  items-center line-height-1.48vh">
          <div class="w-12px h-12px bg-[#E89E2E] mr-8px"></div>
          <div class="color-[#929FAF] text16cus w-152px mr-8px">心率＜60bpm</div>
          <div class="text16cus color-[#384951] mr-40px w32px">{{ info?.['<60'] ?? "--"  }}%</div>
          <div class="text16cus color-[#929FAF]">最低心率：</div>
          <div class="text16cus color-[#384951]">{{ info?.['<60min'] ?? "--"   }}bpm</div>
        </div>
        <div class="text16cus color-[#384951] mt-10px">
           {{ info?.['txt'] ?? '暂无监护数据。'  }}
        </div>
      </div>
    </div>    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,nextTick } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
import * as echarts from "echarts";
import type { ECharts } from "echarts/core";
import { dateFtt } from "@/utils/date/dateFtt";
import ScreenApi from '@/api/screen';
import { getCookie, setCookie } from '@/utils/cookie/cookie';
const admin = JSON.parse(getCookie('admin') as string);

const props = defineProps({
  jctime:{
    type:String,
    default:""
  }
})

type hr = {
  "60~100":number,
  "60~100~avg":number,
  ">100":number,
  ">100max":number,
  "<60":number,
  "<60min":number
  "txt":string
  [key:string]:any
};
const info  = ref<hr>();
const echartDom = ref<any>();
const initData = (option:any,detail?:hr)=>{
     let echartItem = document.querySelector(`#hrChart`) as HTMLElement;
     if(echarts.getInstanceByDom(echartItem)){
       echarts.dispose(echartItem);
     }
     info.value = detail;
     echartDom.value = echarts.init(echartItem);
     echartDom.value.setOption(option);   
};

defineExpose({
  initData
});


</script>
<style lang="scss" scoped>
.bs{
  // padding: 2vh;
  border-radius: 50%;
  box-shadow: 0px 0px 2px 0px #9EC099, 0px 0px 4px 0px #9EC099, 0px 0px 15px 0px #9EC099, 0px 0px 30px 0px #153314, 0px 0px 51px 0px #153314, 0px 0px 90px 0px #153314;
}
@media (min-height:1080px){
   .pt22media{
    padding-top: 2.2vh;
   }
}
.rounddot{
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
.heartRateMonitor {
  border-radius: 8px;
  border: 1px solid #EEEEEE;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding:calc(20 / 1080 * 100vh) calc(24 / 1920 * 100vw);
  height:calc(284 / 1080 * 100vh);
}
.borderbottom{
  border-bottom: 1px solid #384951;
}

.card-title {
    font-size: calc(18 / 1080 * 100vh);
    font-weight: bold;
    color: #384951;
    padding-bottom:calc(20 / 1080 * 100vh);
    border-bottom: 1px solid #EEEEEE;
     margin-bottom:calc(20 / 1080 * 100vh);
}
.text16cus{
   font-size: calc(16 / 1080 * 100vh);
   line-height: 1;
}
.text14cus{
font-size: calc(14 / 1080 * 100vh);
line-height: 1;
}
.mb20cus{
   margin-bottom: calc(20 / 1080 * 100vh);
}

</style>
