<template>
  <div class="breathingRateMonitor ani relative">
    <p class="card-title flex justify-between items-center">
        <span>呼吸率监测分析</span>
        <span class="text-14px font-400 color-[#929FAF]">*静息状态下呼吸率常规频次为12-20次/分钟</span>
    </p>
      <div class="flex justify-between items-center mb21cus">
        <span class="color-[#384951] text16cus font-bold">24小时呼吸率采集分析报告</span>
        <span class="color-[#636676] text14cus">监测范围：{{ jctime }}</span>
    </div>
    <div class="flex  gap-36px items-center pl-22px">
      <div id="BreathingRateMonitorChart" class="w-13vh h-13vh"></div>
      <div>
        <div class="flex mb-1.48vh items-center line-height-1.48vh">
          <div class="w-12px h-12px bg-[#24B287] mr-8px"></div>
          <div class="color-[#929FAF] text16cus w-180px mr-8px">12≤呼吸率≤20次/分钟</div>
          <div class="text16cus color-[#384951] mr-40px w32px">{{Breath?.['12~20'] ?? "--" }}%</div>
          <div class="text16cus color-[#929FAF]">平均呼吸率：</div>
          <div class="text16cus color-[#384951]">{{Breath?.['12~20~avg'] ?? "--"}}次/分钟</div>
        </div>
        <div class="flex mb-1.48vh items-center line-height-1.48vh">
          <div class="w-12px h-12px bg-[#DA4343] mr-8px"></div>
          <div class="color-[#929FAF] text16cus w-180px mr-8px">呼吸率＞20次/分钟</div>
          <div class="text16cus color-[#384951] mr-40px w32px">{{Breath?.['>20'] ?? "--"}}%</div>
          <div class="text16cus color-[#929FAF]">最高呼吸率：</div>
          <div class="text16cus color-[#384951]">{{Breath?.['>20max'] ?? "--"}}次/分钟</div>
        </div>
        <div class="flex  items-center line-height-1.48vh">
          <div class="w-12px h-12px bg-[#E89E2E] mr-8px"></div>
          <div class="color-[#929FAF] text16cus w-180px mr-8px">呼吸率＜12次/分钟</div>
          <div class="text16cus color-[#384951] mr-40px w32px">{{Breath?.['<12'] ?? "--"}}%</div>
          <div class="text16cus color-[#929FAF]">最低呼吸率：</div>
          <div class="text16cus color-[#384951]">{{Breath?.['<12min'] ?? "--"}}次/分钟</div>
        </div>
        <div class="text16cus color-[#384951] mt-10px line-height-1.48vh">
          {{Breath?.['txt']  ??  '暂无监护数据。' }}
        </div>
      </div>
    </div>
    <!-- <div class="warning"></div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,nextTick } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
import * as echarts from "echarts";
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
type BreathingRateAnalysis = {
  "12~20": number,         // 正常区间占比
  "12~20~avg": number,     // 正常区间平均呼吸率
  ">20": number,           // 呼吸率大于20占比
  ">20max": number,        // 最大呼吸率
  "<12": number,           // 呼吸率小于12占比
  "<12min": number,        // 最小呼吸率
  txt: string              // 监测区间描述/结论
  time:string   // 监测时间
};
const Breath = ref<BreathingRateAnalysis>()
const initData = (option:any,detail?:BreathingRateAnalysis)=>{
     let echartItem = document.querySelector(`#BreathingRateMonitorChart`) as HTMLElement;
     if(echarts.getInstanceByDom(echartItem)){
       echarts.dispose(echartItem);
     }
      Breath.value = detail;
     let _echarts = echarts.init(echartItem);
     _echarts.setOption(option);   
     window.addEventListener("resize",()=>{
       _echarts.resize();
     })
};

defineExpose({
  initData
});
</script>

<style scoped>
@media (min-height:1080px){
   .pt22media{
    padding-top: 2.2vh;
   }
}
.warning {
  position: absolute;
  bottom: 10px;
  right: 20px;
  font-size: 14px;
  color: #56e39d;
  transition: all 0.3s ease;
}
.bs{
  border-radius: 50%;
  box-shadow: 0px 0px 2px 0px #9EC099, 0px 0px 4px 0px #9EC099, 0px 0px 15px 0px #9EC099, 0px 0px 30px 0px #153314, 0px 0px 51px 0px #153314, 0px 0px 90px 0px #153314;
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
.breathingRateMonitor {
 border-radius: 8px;
  border: 1px solid #EEEEEE;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding:calc(20 / 1080 * 100vh) calc(24 / 1920 * 100vw);
  height:calc(284 / 1080 * 100vh);
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
.mb21cus{
   margin-bottom: calc(20 / 1080 * 100vh);
}
</style>
