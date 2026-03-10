<template>
  <div class='sleepQuality rounded-8px p-[24px]'>
      <div class="flex justify-between items-center mb-[24px] title">
        <span class="color-[#384951] text-16px font-800">睡眠质量评估</span>
        <span class="color-[#929FAF] text-14px font-500">趋势标识为今日数据与昨日数据对比</span>
      </div>

      <div class="pl-80px pr-80px  p-[24px] pt-0 flex justify-start p-b-0 gap-30px">
         <div id="barChart"></div>
         <div class="textContainer">
             <div class="flex items-center">
                 <div class="w-12px h-12px bg-#D766FF mr-8px"></div>
                  <span class="color-[#636363] text-16px font-500 mr-8px">轻度睡眠</span>
                  <span class="color-[#384951] text-17px font-800 mr-11px block w-50px">{{ toTxt(value(sleepData?.light_sleep_time_per),'%')  }}</span>
                
                
                  <img src="@/assets/icon/icon_up.png" alt=""  v-if="sleepData?.compare_flag?.compare_light_sleep.flag == 1" class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_line.png" alt=""  v-if="sleepData?.compare_flag?.compare_light_sleep.flag == 0"  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_down.png" alt="" v-if="sleepData?.compare_flag?.compare_light_sleep.flag == -1" class="block w-18px h-18px">
             </div>
             <div class="flex items-center">
                  <span class="color-[#636363] text-16px font-500 mr-8px">睡眠心率健康指数</span>
                  <div class="color-[#384951] text-17px font-800 mr-11px w-60px">{{ toTxt(value(  sleepData.sleep_hr_health_score),"%") }}</div>
                   <img src="@/assets/icon/icon_up.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_hr_health.flag == 1"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_line.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_hr_health.flag == 0"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_down.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_hr_health.flag == -1"
                  class="block w-18px h-18px">
             </div>
              <div class="flex items-center">
                    <div class="w-12px h-12px bg-#8F66FF mr-8px"></div>
                  <span class="color-[#636676] text-16px font-500 mr-8px">中度睡眠</span>
                  <div class="color-[#384951] text-17px font-800 mr-11px block w-50px">{{ toTxt(value(sleepData.mid_sleep_time_per),"%")  }}</div>
                  <img src="@/assets/icon/icon_up.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_mid_sleep.flag == 1"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_line.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_mid_sleep.flag == 0"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_down.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_mid_sleep.flag == -1"
                  class="block w-18px h-18px">
             </div>
              <div class="flex items-center">
                  <span class="color-[#636363] text-16px font-500 mr-8px">睡眠血氧健康指数</span>
                  <div class="color-[#384951] text-17px font-800 mr-11px w-60px">{{ toTxt(value( sleepData.sleep_spo2_health_score ),"分")  }}</div>
                   <img src="@/assets/icon/icon_up.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_spo2_health.flag == 1"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_line.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_spo2_health.flag == 0"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_down.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_spo2_health.flag == -1"
                  class="block w-18px h-18px">
             </div>
              <div class="flex items-center">
                  <div class="w-12px h-12px bg-#6674FF mr-8px"></div>
                  <span class="color-[#636676] text-16px font-500 mr-8px">深度睡眠</span>
                  <div class="color-[#384951] text-17px font-800 mr-11px block w-50px">{{ toTxt(value(sleepData.deep_sleep_time_per),"%")}}</div>
                   <img src="@/assets/icon/icon_up.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_deep_sleep.flag == 1"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_line.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_deep_sleep.flag == 0"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_down.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_deep_sleep.flag == -1"
                  class="block w-18px h-18px">
             </div>
              <div class="flex items-center">
                  <span class="color-[#636363] text-16px font-500 mr-8px">睡眠呼吸暂停风险</span>
                  <div class="color-[#384951] text-17px font-800 mr-11px w-60px">{{  value(sleepData.risk_of_snoring) }}</div>
                 <img src="@/assets/icon/icon_up.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_osahs.flag == 1"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_line.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_osahs.flag == 0"
                  class="block w-18px h-18px">
                   <img src="@/assets/icon/icon_down.png" alt=""
                  v-if="sleepData?.compare_flag?.compare_osahs.flag == -1"
                  class="block w-18px h-18px">
             </div>
         </div>
      </div>


        
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import { sleepPieOption } from "@/utils/baseOptions/sleepoptions";
import { onMounted,nextTick} from "vue";
import { value } from "@/utils/function/function";
import { watch } from "vue";
const props = defineProps({
    sleepData:{
        type:Object,
        default:{}
    }
});

const toTxt = (str: any,unit:string) => {
   if(str!="--"){
        return str+unit;
   }
   return "--";
}

watch(()=>props.sleepData,(val)=>{
  if(Object.keys(val).length>0){
  initBarChart();
  }
    
},{deep:true,immediate:true})

const initBarChart = async () => {
  await nextTick();
  
  const barChart = echarts.init(document.getElementById('barChart'));
  sleepPieOption.series!.data = [{ name: '轻度睡眠', value: props.sleepData?.light_sleep_time_per || 0 },
                                 { name: '中度睡眠', value:  props.sleepData?.mid_sleep_time_per || 0 },
                                 { name: '深度睡眠', value:  props.sleepData?.deep_sleep_time_per || 0 }]
                                 console.log(sleepPieOption)
  barChart.setOption(sleepPieOption);
}

onMounted(()=>{
   
 
})

</script>
<style scoped>
.sleepQuality{
  border-radius: 8px 8px 8px 8px;
border: 1px solid #EEEEEE;
}
#barChart{
  width: 120px;
  height: 120px;
}
.title{
  position: relative;
}
.title::before{
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -10px;
  width: 4px;
  height: 16px;
  background-color: #24B287;
}
.textContainer{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 60px;
}
</style>