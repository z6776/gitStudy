<template>
  <div class="Electrocardiographic ani">
    <p class="card-title">体温监测分析</p>
       <div class="flex justify-between items-center mb20cus">
        <span class="color-[#384951] text16cus font-bold">24小时体温采集分析报告</span>
        <span class="color-[#636676] text14cus">监测范围：{{ jctime }}</span>
    </div>
 
    <div class="flex gap-36px items-center pl-36px">
       <div id="ElectrocardiographicRef" class="w-13vh h-13vh"></div>
      <div>
        <div class="dot-box">
          <div class="flex items-center line-height-1.48vh">
            <div class="w-12px h-12px bg-[#24B287] mr-8px"></div>
            <div class="color-[#929FAF] text-[1.48vh] mr-8px">36≤体温≤37.2℃</div>
            <div class="text-[1.48vh] color-[#384951]">{{   bodyInfo?.["36~37.2"] ?? "--"  }}%</div>
          </div>
          <div class="flex items-center line-height-1.48vh">
            <div class="w-12px h-12px bg-[#DA4343] mr-8px"></div>
            <div class="color-[#929FAF] text-[1.48vh] mr-8px">体温＞38℃</div>
            <div class="text-[1.48vh] color-[#384951]">{{   bodyInfo?.[">38"] ?? "--" }}%</div>
          </div>
          <div class="flex items-center line-height-1.48vh">
            <div class="w-12px h-12px bg-[#E89E2E] mr-8px"></div>
            <div class="color-[#929FAF] text-[1.48vh] mr-8px">37.2＜体温＜38℃</div>
            <div class="text-[1.48vh] color-[#384951]">{{   bodyInfo?.["37.2~38"] ?? "--" }}%</div>
          </div>
          <div class="flex  items-center line-height-1.48vh">
            <div class="w-12px h-12px bg-[#EFF841] mr-8px"></div>
            <div class="color-[#929FAF] text-[1.48vh] mr-8px">体温＜36℃</div>
            <div class="text-[1.48vh] color-[#384951]">{{   bodyInfo?.["<36"]  ?? "--"}}%</div>
          </div>
        </div>
        <div class="mt-1.5vh line-height-1.48vh"> 
          <span class="text-[1.48vh] color-[#929FAF]">体温均值：</span>
          <span class="text-[1.48vh] color-[#384951]"> {{   bodyInfo?.avg ?? "--"  }}℃</span>
        </div>
        <div class="w-453px text-[1.48vh] color-[#384951] mt-1.5vh  line-height-1.48vh">
             {{   bodyInfo?.txt ??  '暂无监护数据。'   }}
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

type body = {
  "36~37.2":number,
  ">38":number,
  "37.2~38":number,
  "<36":number,
  "avg":number,
  "txt":string,
  time:string
};
const bodyInfo = ref<Partial<body>>();
const initData = (option:any,detail?:body)=>{
     let echartItem = document.querySelector(`#ElectrocardiographicRef`) as HTMLElement;
     if(echarts.getInstanceByDom(echartItem)){
       echarts.dispose(echartItem);
     }
     bodyInfo.value = detail;
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
    padding-top: 1vh;
   }
}
.text16cus{
   font-size: calc(16 / 1080 * 100vh);
   line-height: 1;
}
.mb20cus{
  margin-bottom: calc(20 / 1080 * 100vh);;
}
.mb12cus{
  margin-bottom: calc(12 / 1080 * 100vh);
}
.text14cus{
font-size: calc(14 / 1080 * 100vh);
line-height: 1;
}
.dot-box{
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   column-gap: 40px;
   row-gap: 1.48vh;
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
    width: 81px;
    height: 81px;
    border-radius: 50%;
    border: 2px solid #153314;
    background-color: rgba(21, 51, 20, 0.6);
}
.Electrocardiographic {
   border-radius: 8px;
  border: 1px solid #EEEEEE;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding:calc(20 / 1080 * 100vh) calc(24 / 1920 * 100vw);
  height:26.296296296296295vh;
  overflow: hidden;
}
.card-title {
    font-size: calc(18 / 1080 * 100vh);
    font-weight: bold;
    color: #384951;
    padding-bottom:calc(20 / 1080 * 100vh);
    border-bottom: 1px solid #EEEEEE;
     margin-bottom:calc(20 / 1080 * 100vh);
}
</style>
