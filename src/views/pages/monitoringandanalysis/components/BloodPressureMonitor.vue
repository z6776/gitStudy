<template>
  <div class="bloodPressureMonitor ani">
     <p class="card-title">血压监测分析</p>
      
     <div class="flex justify-between items-center mb21cus">
        <span class="color-[#384951] text16cus font-bold">24小时血压分析报告</span>
        <span class="color-[#636676] text14cus">监测范围：{{ jctime }}</span>
    </div>
    
    <div class="flex gap-20px items-stretch">
      <div>
         <div class="line-height-12px flex justify-start mb-1vh items-center">
            <div class="w-12px h-12px bg-[#56E3E1] mr-10px"></div>
            <div class="mr-30px   flex items-center"><span class="color-[#929FAF] text-[12px]">舒张压范围：</span> <span class="color-[#636676] text-[12px]">69~79mmHg</span></div>
            <div class="w-12px h-12px bg-[#0088FF] mr-10px"></div>
            <div class=" flex items-center"><span class="color-[#929FAF] text-[12px]">收缩压范围：</span> <span class="color-[#636676] text-[12px]">112~129mmHg</span></div>
          </div>
           <div id="bloodChartfx" class="w-450px h-11vh  flex-shrink-0"></div>
      </div>
      <div class="overflow-y-auto">
         <div class="text-[1.48vh] color-[#636676] mb-4px">
            {{ info.txt }}
        </div>
          <div>
              <p><span class="color-[red] text12cus">*</span><span class="color-[#636676] text12cus">收缩压、舒张压异常范围：</span></p>
              <div class="warningText">
                 <div class="text12cus color-[#929FAF]">高压＜90mmHg</div>
                 <div class="text12cus color-[#929FAF]">低压＜60mmHg</div>
                 <div class="text12cus color-[#929FAF]">高压≥140mmHg</div>
                 <div class="text12cus color-[#929FAF]">低压≥90mmHg</div>
              </div>
          </div>

      </div>
       
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from "echarts";

const bloodChartfx = ref<HTMLElement|null>(null);
const props = defineProps({
  jctime:{
    type:String,
    default:""
  }
})
const info = ref<{time?:string,txt?:string}>({});
const initData = (option:any,s?:Object)=>{
     let echartItem = document.querySelector(`#bloodChartfx`) as HTMLElement;
     if(echarts.getInstanceByDom(echartItem)){
       echarts.dispose(echartItem);
     }
     info.value = s || {};
     let _echarts = echarts.init(echartItem);
     _echarts.setOption(option);  
     window.addEventListener("resize", function () {
       _echarts.resize();
     })
};

defineExpose({
  initData
});
</script>

<style scoped>

      /* 滚动条整体宽度 */
  ::-webkit-scrollbar {
    width: 4px; /* 可根据需要调整宽度 */
    background: #e6f0ff;
    margin-left: 10px;
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: #e6f0ff;
    border-radius: 8px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: #24B287;
    border-radius: 4px;
    min-height: 70px;
    transition: background 0.2s;
  }

  /* 鼠标悬停时滑块颜色 */
  ::-webkit-scrollbar-thumb:hover {
    background: #24B287;
  }

  /* 横向滚动条（如有） */
  ::-webkit-scrollbar-horizontal {
    height: 12px;
  }

  .text16cus{
   font-size: calc(16 / 1080 * 100vh);
   line-height: 1;
}
.mb21cus{
   margin-bottom: calc(20 / 1080 * 100vh);
}
 .text12cus{
   font-size: calc(12 / 1080 * 100vh);
   line-height: 1;
}
.warningText{
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 8px;
    align-items: center;
    margin-top: 8px;
}
.text14cus{
font-size: calc(14 / 1080 * 100vh);
line-height: 1;
}
.borderLine::after{
  content: "";
  width: 1px;
  height: 40px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: #384951;
   position: absolute;
}
.bloodPressureMonitor {
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
</style>
