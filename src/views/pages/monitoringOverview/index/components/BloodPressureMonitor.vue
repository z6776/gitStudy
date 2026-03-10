<template>
  <div class="bloodPressureMonitor">
    <p class="card-title">血压/体温监测</p>
    <div class="flex items-center justify-between">
      <div>
        <span class="color-[#636676] text16cus mr-10px">血压监测时间:</span>
        <span class="color-[#636676] text16cus">{{ monitor_bp_body.xytime  }}</span>
      </div>
       <div>
        <span class="color-[#636676] text16cus mr-10px">体温监测时间:</span>
        <span class="color-[#636676] text16cus">{{ monitor_bp_body.time  }}</span>
      </div>
      
    </div>
    <div class="flex justify-between mt-auto">
        <div class="flex-1 flex flex-col items-center relative">
           <div class="text24cus color-[#636676] font-bold mb-10px">收缩压</div>
           <div class="text60cus color-[#384951] font-bold  ">{{ monitor_bp_body.ssy  }}</div>
           <div class="text16cus color-[#929FAF]">mmHg</div>
        </div>
        <div class="flex-1 flex flex-col items-center relative">
           <div class="text24cus color-[#636676] font-bold mb-10px">舒张压</div>
           <div class="text60cus color-[#384951] font-bold  ">{{ monitor_bp_body.szy }}</div>
           <div  class="text16cus color-[#929FAF]">mmHg</div>
        </div>
        <div class="flex-1 flex flex-col items-center relative borderLine">
           <div class="text24cus color-[#636676] font-bold mb-10px">脉压差</div>
           <div class="text60cus color-[#384951] font-bold ">{{ monitor_bp_body.myc }}</div>
           <div  class="text16cus color-[#929FAF]">mmHg</div>
        </div>
        <div class="flex-1 flex flex-col items-center">
           <div class="text24cus color-[#636676] font-bold mb-10px">体温</div>
           <div class="text60cus color-[#384951] font-bold ">{{ monitor_bp_body.tw  }}</div>
           <div  class="text16cus color-[#929FAF]">℃</div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRefs,ref } from 'vue';
import MonitoringOverviewApi from "@/api/monitoringOverview";
import { usePaientInfo } from "@/stores/paientinfo";
import { value } from '@/utils/function/function';
import { dateFtt } from "@/utils/date/dateFtt"
const { paientInfo }  = toRefs(usePaientInfo());
type monitor_bp_body = {
  ssy:number | null
  szy:number| null
  myc:number| null
  tw:number| null,
  time:string,
  xytime:string
}
const monitor_bp_body = ref<monitor_bp_body>({
    ssy:null,
    szy:null,
    myc:null,
    tw:null,
    time:"--",
    xytime:"--"
})

const fetchData = async ()=>{
  let res = await MonitoringOverviewApi.monitor_bp_body({
        patient_id:paientInfo.value.id
  });
  let _r = res.data?.result;
  monitor_bp_body.value = {
     ssy:value(_r.sbp), // 收缩压
      szy:value(_r.dbp),// 舒张压
      myc:value(_r.diff),// 压差,
      tw:value(_r.body),// 体温,
      time:getTime(_r)!,
      xytime:getTime1(_r)!
  } 
}

const getTime = (_r:any)=>{
    // 都不存在取空值
    if(!_r.body_insert_time){
      return "--"
    }
    // 存在一个取最近的
    if(_r.body_insert_time){
      return  dateFtt('yyyy/mm/dd hh:MM',_r.body_insert_time);
    }   
}
const getTime1 = (_r:any)=>{
    // 都不存在取空值
    if( !_r.bp_insert_time){
      return "--"
    }
    // 存在一个取最近的
    if( _r.bp_insert_time){
      return  dateFtt('yyyy/mm/dd hh:MM',_r.bp_insert_time)  
    }   
}

onMounted(() => {
 fetchData();
})
</script>

<style scoped>
.borderLine::after{
  content: "";
  width: 2px;
  height:  calc(110 / 1080 * 100vh);
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: #EEEEEE;
   position: absolute;
}
.text16cus{
  font-size: calc(16 / 1080 * 100vh);
  line-height:  calc(16 / 1080 * 100vh);
}
.text24cus{
  font-size: calc(24 / 1080 * 100vh);
  line-height:  calc(24 / 1080 * 100vh);
}
.text60cus{
  font-size: calc(60 / 1080 * 100vh);
  line-height:  calc(60 / 1080 * 100vh);
}
.bloodPressureMonitor {
  height: calc(257 / 1080 * 100vh);
  background: #fff;
  padding: calc(16 / 1080 * 100vh);
   padding-top: calc(20 / 1080 * 100vh);
  padding-bottom: calc(31 / 1080 * 100vh);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
   
}
.card-title {
  width: 306px;
  font-weight: bold;
  font-size: calc(18 / 1080 * 100vh);
  color: #384951;
  margin-bottom: calc(10 / 1080 * 100vh);  
}
.mbvh20px{
   margin-bottom: calc(20 / 1080 * 100vh);
   line-height: calc(16 / 1080 * 100vh);
}
</style>
