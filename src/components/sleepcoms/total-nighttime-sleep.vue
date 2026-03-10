<template>
  <div class='w-full h-514px bg-#fff mt-20px rounded-12px box-shadow border-[1px-solid-#eeeeee] p-[24px]'>
    <div class="color-[#384951] text-18px line-height-18px mb-20px font-bold">夜间总睡眠</div>
    <div class="h-192px flex justify-between mb-24px">
        <div class="w-25% flex justify-center items-center flex-col border-right">
             <div>
                 <span class="font-800 text-60px color-[#384951]">  {{ sleepData.sleep_score || "--" }}   </span>
                 <span class="text-14px color-[#636676]">分</span>
             </div>
             <div class="text-14px color-[#636676]">
                 睡眠质量: {{ sleepData.sleep_score_info || "--" }}   
             </div>
        </div>
        <div class="w-25% p-[24px_0]">
             <div class="mb-32px relative afterBorder">
                 <div class="text-16px color-[#636676] text-center">睡眠总长</div>
                 <div class="text-center"><span class="text-[28px] color-[#384951] font-800">{{ isNaN(Math.floor(sleepData.total_sleep_time / 60)) ? "--" : Math.floor(sleepData.total_sleep_time / 60)  }}</span><span class="color-[#929FAF] text-14px ml-4px">小时</span><span class="text-[28px] color-[#384951] font-800 ml-4px">{{ isNaN(sleepData.total_sleep_time % 60) ? "--" : sleepData.total_sleep_time % 60  }}</span><span  class="color-[#929FAF] text-14px ml-4px">分钟</span></div>
             </div>
             <div class="afterBorder">
                 <div class="text-16px color-[#636676] text-center">深度睡眠</div>
                  <div class="text-center"><span class="text-[28px] color-[#384951] font-800">{{ formatHourMinuteByHour(sleepData.deep_sleep_time).h }}</span><span class="color-[#929FAF] text-14px ml-4px">小时</span><span class="text-[28px] color-[#384951] font-800 ml-4px">{{ formatHourMinuteByHour(sleepData.deep_sleep_time).m }}</span><span  class="color-[#929FAF] text-14px ml-4px">分钟</span></div>
             </div>
        </div>
 
        <div class="w-25% p-[24px_0] ">
             <div class="mb-32px relative afterBorder">
                 <div class="text-16px color-[#636676] text-center">有效睡眠</div>
                 <div class="text-center"><span class="text-[28px] color-[#384951] font-800">{{ formatHourMinuteByHour(sleepData.real_sleep_time).h }}</span><span class="color-[#929FAF] text-14px ml-4px">小时</span><span class="text-[28px] color-[#384951] font-800 ml-4px">{{ formatHourMinuteByHour(sleepData.real_sleep_time).m }}</span><span  class="color-[#929FAF] text-14px ml-4px">分钟</span></div>
             </div>
             <div class="afterBorder">
                 <div class="text-16px color-[#636676] text-center">中度睡眠</div>
                  <div class="text-center"><span class="text-[28px] color-[#384951] font-800">{{ formatHourMinuteByHour(sleepData.mid_sleep_time).h }}</span><span class="color-[#929FAF] text-14px ml-4px">小时</span><span class="text-[28px] color-[#384951] font-800 ml-4px">{{ formatHourMinuteByHour(sleepData.mid_sleep_time).m }}</span><span  class="color-[#929FAF] text-14px ml-4px">分钟</span></div>
             </div>
        </div>
        <div class="w-25% p-[24px_0]">
             <div class="mb-32px relative ">
                 <div class="text-16px color-[#636676] text-center">最大深睡</div>
                 <div class="text-center"><span class="text-[28px] color-[#384951] font-800">{{ formatHourMinuteByHour(sleepData.max_deep_sleep).h }}</span><span class="color-[#929FAF] text-14px ml-4px">小时</span><span class="text-[28px] color-[#384951] font-800 ml-4px">{{formatHourMinuteByHour( sleepData.max_deep_sleep).m }}</span><span  class="color-[#929FAF] text-14px ml-4px">分钟</span></div>
             </div>
             <div class="">
                 <div class="text-16px color-[#636676] text-center">轻度睡眠</div>
                 <div class="text-center"><span class="text-[28px] color-[#384951] font-800">{{ formatHourMinuteByHour(sleepData.light_sleep_time).h }}</span><span class="color-[#929FAF] text-14px ml-4px">小时</span><span class="text-[28px] color-[#384951] font-800 ml-4px">{{ formatHourMinuteByHour(sleepData.light_sleep_time).m }}</span><span  class="color-[#929FAF] text-14px ml-4px">分钟</span></div>
             </div>
        </div>
    </div> 
    <sleep-quality-assessment :sleepData="sleepData" />
  </div>
</template>
<script setup lang="ts">

const props = defineProps({
    sleepData:{
        type:Object,
        default:{}
    }
});
function formatHourMinuteByHour(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return {
    h:isNaN(h) ? "--" : h,
    m:isNaN(m) ? "--" : m
  };
}
</script>
<style scoped>
.box-shadow {
    box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16);
}
.border-right{
    border-right: 1px solid #eeeeee;
}
.afterBorder{
    /* background-color: red; */
    position: relative;
}
.afterBorder::after{
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 40px;
    background-color: #eeeeee;
}
</style>