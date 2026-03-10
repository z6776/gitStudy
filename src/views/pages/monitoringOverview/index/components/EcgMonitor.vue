<template>
  <div class="ecgmonitor">
    <p class="card-title">心电监测记录</p>
    <div class="ecg-container flex color-[#636676]  text-[16px] items-center justify-center" v-if="!(mockData && mockData.length)">
         暂无监护数据。
    </div>
    <div class="ecg-container" v-else>
       <div class="header h-3.5vh w-650px bg-[#EBFAF3] flex justify-between items-center">
            <div class="flex-1 text-center color-[#636676] text-[14px] h-full flex justify-center items-center">
                序号
            </div>
            <div class="flex-1  text-center color-[#636676] text-[14px] h-full flex justify-center items-center">
              采集时间
            </div>
       </div>
       <div class="timeitem h-4vh w-650px flex justify-between items-center" v-for="(item,index) in mockData" :key="index"
       :class="{'active':current===index}"
       @click="setChart(item,index)">
            <div class="flex-1 text-center color-[#384951] text-[14px] h-full flex justify-center items-center">
                {{ index+1 }}
            </div>
            <div class="flex-1  text-center color-[#384951] text-[14px] h-full flex justify-center items-center">
              {{ item.time }}
            </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRefs,ref } from 'vue';
import MonitoringOverviewApi from "@/api/monitoringOverview";
import { usePaientInfo } from "@/stores/paientinfo";
import { dateFtt } from '@/utils/date/dateFtt';
const { paientInfo }  = toRefs(usePaientInfo());
type ecg = {
  time:string
}
const mockData = ref<ecg[]>([]);
const emits = defineEmits(["setChartEcg"])
const fetchData = async ()=>{
  let res = await MonitoringOverviewApi.monitor_plan_ecg({
        patient_id:paientInfo.value.id,
        date:dateFtt('yyyymmdd',new Date())
  });
  if(res.data?.result && res.data?.result.length){
     mockData.value = res.data?.result.map((item:any)=>{
     return {
      id:item.id,
      time:dateFtt('hh:MM',item.insert_time),
      insert_time:item.insert_time
     }
  }) || [{
     id:1,
      time:123,
      insert_time:123213
  },{
     id:1,
      time:123,
      insert_time:123213
  },{
     id:1,
      time:123,
      insert_time:123213
  },{
     id:1,
      time:123,
      insert_time:123213
  },{
     id:1,
      time:123,
      insert_time:123213
  }


];
   emits("setChartEcg",mockData.value[0])
  }
 
}
const current = ref(0)
const setChart = (item:any,index:number)=>{
  current.value = index;
    emits("setChartEcg",item)
}

onMounted(()=>{
   fetchData()
})
</script>

<style scoped>

/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; /* 可根据需要调整宽度 */

}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #24B287;
   height: 70px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
 background: #EEEEEE;
  border-radius: 4px;
 
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #24B287;
}
.header{
  position: sticky;
  top: 0;
}
.ecg-container{
  height: 23.5vh;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
}
.timeitem:not(:last-child) {
    border-bottom: 1px solid #EEEEEE;
}
.active{

    background: rgba(255,255,255,0.01);
    box-shadow: inset 0 8px 24px 0 rgba(146, 159, 175, 1);;
}
.timeitem:nth-child(3n+1) {
  
}
.ecgmonitor {
    height: calc(318 / 1080 * 100vh);
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
