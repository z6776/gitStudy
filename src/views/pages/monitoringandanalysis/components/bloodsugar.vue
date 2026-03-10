<template>
  <div class='bloodsugar h-26vh flex-1'>
    <p class="card-title">血糖监测分析</p>
    <div class="flex justify-start item-center text18cus">
      <div class="mr-auto">
          <span class="text-[#929FAF] text18cus font-bold">BG</span>
          <span class="text-1.5vh text-[#929FAF] ml-5px">mmol/L</span>
      </div>
      <div class="color-[#636676] text16cus">
           采集时间：{{ sugerTime || "--"}}
      </div>
    </div>
    <div class="flex justify-between items-center">
       <div class="text60cus color-[#384951] font-bold">
           {{ suger.diabetes_avg || "--" }}
       </div>
       <div class="flex-col items-center justify-center">
           <div class="color-[#384951] text16cus  mb-5px">
           <span>血糖均值：</span>
           <span>{{suger.diabetes_avg|| "--"}}mmol/L</span>
        </div>
        <div class="color-[#384951] text16cus">
            <span>预估糖化血红蛋白：</span>
            <span>{{suger.diabetes_HbA1c ?  suger.diabetes_HbA1c+"%" +"或" + suger.diabetes_avg +"mmol/L"  :  "--"}}</span>
        </div>
       </div>
    </div>
    

    <div class="w-447px h-10vh" id="sugerChart">
         
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted ,nextTick, computed} from 'vue';
import * as echarts from "echarts";
import { getRem,styleToString, value } from "@/utils/function/function"
import { dateFtt } from '@/utils/date/dateFtt';
const bloodChartfx = ref<HTMLElement|null>(null);

const props = defineProps({
  suger:{
    type: Object,
    default: () => ({})
  }
})
const HIGH_VALUE = 7.8; // 高血糖阈值
const LOW_VALUE = 4.4;  // 低血糖阈值
const sugerTime = computed(()=>{
  if(typeof props.suger.diabetes_text === "object" && typeof props.suger.diabetes_text !== null){
        let a =  Object.keys(props.suger.diabetes_text).map((item) => item);
        if(a.length > 0){
            return dateFtt("yyyy/mm/dd hh:MM",a[a.length-1])  
        }
  }
  return "--"
})
const initData = (option:any)=>{
     let echartItem = document.querySelector(`#sugerChart`) as HTMLElement;
     if(echarts.getInstanceByDom(echartItem)){
       echarts.dispose(echartItem);
     }
     let _echarts = echarts.init(echartItem);
     
     _echarts.setOption(option);  
     nextTick(()=>{
      let lenvalue = option.xAxis.data[option.xAxis.data.length-1] ?? '22:10';
       let position1 = _echarts.convertToPixel({ seriesIndex: 0 },[lenvalue, LOW_VALUE]);
       let position2 = _echarts.convertToPixel({ seriesIndex: 0 },[lenvalue, HIGH_VALUE]);
              // 1. 获取当前的 option
        const currentOption:any = _echarts.getOption();
        currentOption.graphic.find((elp:any) =>{
              elp.elements.forEach((el:any) =>{
                  if(el.id === 'graphic1'){
                      el.position = position1
                }
                if(el.id === 'graphic2'){
                      el.position = position2;
                }
              })
        
        });
         
          _echarts.setOption({
                  graphic: currentOption.graphic
                });
                
         
     })
    
};

defineExpose({
  initData
});




</script>
<style scoped>
.bloodsugar {
     border-radius: 8px;
  border: 1px solid #EEEEEE;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding:calc(20 / 1080 * 100vh) calc(24 / 1920 * 100vw);
  height:calc(278 / 1080 * 100vh);
}
.card-title {
      font-size: calc(18 / 1080 * 100vh);
    font-weight: bold;
    color: #384951;
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
.text18cus{
   font-size: calc(18 / 1080 * 100vh);
   line-height: 1;
}
.text60cus{
   font-size: calc(60 / 1080 * 100vh);
   line-height: 1;
}

</style>