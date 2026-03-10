<template>
  <div class="Electrocardiographic">
      <p class="card-title">心电监测</p>
      <div class="flex  items-center justify-end mbvh20px mr-20px">
      <span class="color-[#636676] text-16px mr-10px">监测时间:</span>
      <span class="color-[#636676] text-16px">{{ xdtime }}</span>
    </div>
    <div class="chart-container relative" id="ElectrocardiographicChart">
       
    </div>
     <div class="background relative">
       
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from "echarts";
import { dateFtt } from '@/utils/date/dateFtt';

const props = defineProps<{xdtime:string}>()

const initData = (option:any)=>{
     let echartItem = document.querySelector(`#ElectrocardiographicChart`) as HTMLElement;
     if(echarts.getInstanceByDom(echartItem)){
       echarts.dispose(echartItem);
     }
     let _echarts = echarts.init(echartItem);
     _echarts.setOption(option);   
    
};


defineExpose({
  initData
});

const createBackGround = ()=>{
    const innerWidth = document.querySelector('.background')?.clientWidth || 0;
    const innerHeight = document.querySelector('.background')?.clientHeight || 0;
    let boxWidth = 7;
    let boxHeight = 7;
    if(window.innerWidth <= 1280){
      boxWidth = 3.5;
      boxHeight = 3.5;
    };

    let rowlen = Math.ceil(innerWidth/boxWidth);
    let collen = Math.ceil(innerHeight/boxHeight);
    for (let i = 0; i < rowlen; i++) {
      for (let j = 0; j < collen; j++) {
        const box = document.createElement('div');
        box.style.width = boxWidth + 'px';
        box.style.height = boxHeight + 'px';
        box.style.position = 'absolute';
        box.style.left = i * boxWidth + 'px';
        box.style.top = j * boxHeight + 'px';
        box.style.boxSizing = 'border-box';
        box.style.borderRight = '1px solid #eeeeee';
        box.style.borderBottom = '1px solid #eeeeee';
        document.querySelector('.background')?.appendChild(box);
      }
    }
}

onMounted(() => {
    createBackGround();
})

</script>

<style scoped>
.chart-container{
  width: 100%;
  height: calc(21vh - 42px);
  position: relative;
  overflow: hidden;
  z-index: 99;
}
.background{
  position: absolute;
  left: calc(16 / 1080 * 100vh);
  right: calc(16 / 1080 * 100vh);
  bottom: calc(16 / 1080 * 100vh);
  /* width: 100%; */
  height: calc(21vh - 42px);
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
  border: 1px solid #eeeeee;
}
.Electrocardiographic {
    height: calc(318 / 1080 * 100vh);
    background: #fff;
   padding: calc(16 / 1080 * 100vh);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow:  0 8px 24px 0 rgba(146, 159, 175, 0.16);
  position: relative;
}
.card-title {
  width: 306px;
  font-weight: bold;
  font-size: calc(18 / 1080 * 100vh);
  color: #384951;
 
}
.mbvh20px{
   margin-bottom:  calc(20 / 1080 * 100vh);
}
</style>
