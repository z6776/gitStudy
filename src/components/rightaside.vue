<template>
  <div
    class="right-aside-box flex justify-end items-center"
    :class="{ isopen: isOpen, isclose: !isOpen }"
  >
    <img src="@/assets/images/rightaside.png" class="right-aside-img" alt="" />
    <div class="w-32px h-100px flex items-center justify-center relative z-11 pl-3px"  @click="closeAside">
       <img
      src="@/assets/images/leftarrow.png"
      class="leftarrow"
      mode=""
      :class="{ rotate: isOpen }"
    />
    </div>
   
     <!-- w-120px h-8.8vh   -->
    <div class="menus p-40px w-248px border-box">
      <div
        class="menu-item border-box flex  justify-center items-center gap-8px rounded-8px cursor-pointer"
        v-for="(value, index) in list"
        :key="index"
       @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave(index)"
        :class="{ 'menu-item-active': index === activeIndex }"
        @click="handleClick(value.url)"
      >
        <img
          :src="index === activeIndex ? value.selicon : value.icon"
          alt=""
          class="w-3.7vh h-3.7vh"
        />
        <span class="text-14px color-[#636676]">{{ value.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { getAssetsRightAside } from '@/utils/function/function'
const list = ref([
  {
    name: '监护总览',
    url: '/monitoringOverview',
    icon: getAssetsRightAside('1.png'),
    selicon: getAssetsRightAside('1sel.png'),
  },
    {
    name: '监护分析',
    url: '/monitoringandanalysis',
    icon: getAssetsRightAside('2.png'),
    selicon: getAssetsRightAside('2sel.png'),
  },
  {
    name: '血压记录',
    url: '/electrocardiogramMonitoring/bloodPressureRecord',
    icon: getAssetsRightAside('3.png'),
    selicon: getAssetsRightAside('3sel.png'),
  },
   {
    name: '心电记录',
    url: '/electrocardiogramMonitoring/electrocardiogramMonitoringplannew',
    icon: getAssetsRightAside('4.png'),
    selicon: getAssetsRightAside('4sel.png'),
  },
  {
    name: 'HRV分析',
    url: '/rightAside/hrv',
    icon: getAssetsRightAside('5.png'),
    selicon: getAssetsRightAside('5sel.png'),
  },
   {
    name: '血糖分析',
    url: '/bloodSugarAnalysis/index',
    icon: getAssetsRightAside('6.png'),
    selicon: getAssetsRightAside('6sel.png'),
  },
  {
    name: '睡眠分析',
    url: '/rightAside/sleep',
    icon: getAssetsRightAside('7.png'),
    selicon: getAssetsRightAside('7sel.png'),
  },
  {
    name: '活动事件',
    url: '/rightAside/activity_inner',
    icon: getAssetsRightAside('8.png'),
    selicon: getAssetsRightAside('8sel.png'),
  },
  {
    name: '活动报告',
    url: '/patientMovementAnalysis/index',
    icon: getAssetsRightAside('9.png'),
    selicon: getAssetsRightAside('9sel.png'),
  }
])

const activeIndex = ref(-1)
const handleMouseEnter = (index: number) => {
  activeIndex.value = index
}
const handleMouseLeave = (index: number) => {
  activeIndex.value = -1
}
const isOpen = ref(true)
const closeAside = () => {
  isOpen.value = !isOpen.value
}

const emits = defineEmits(['routerTo'])

const handleClick = (url: string) => {
  emits('routerTo', url)
}
</script>
<style scoped>
.right-aside-box {
  position: fixed;
  right: 0;
  height: 78vh;
  width: 280px;
  top: 50%;
  transform: translate(0px, -50%);
  transition: transform 0.3s ease-in-out;
  z-index: 9999;
}
.rotate {
  transform: rotate(180deg);
}
.isOpen {
  transform: translate(0px, -50%);
}
.isclose {
  transform: translate(248px, -50%);
}
.right-aside-img {
  display: block;
  position: fixed;
  right: 0;
  height: 78vh;
  width: 280px;
  top: 50%;
  transform: translateY(-50%);
}
/* @media screen and (max-height: 953px) {
  .right-aside-img {
    height: 85vh;
  }
  .right-aside-box {
    height: 85vh;
  }
  .menu-item{
    width: 120px;
    height: 75px;
    gap:0px;
  }
}
@media screen and (max-height: 768px) {
  .right-aside-img {
    height: 90vh;
  }
  .right-aside-box {
    height: 90vh;
  }
  .menu-item{
    width: 120px;
    height: 75px;
    gap:0px;
  }
} */
.leftarrow {
  width: 19.6px;
  height: 18px;
  position: relative;
  /* left: 10px; */
  z-index: 10;
  /* margin-right: 5px; */
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.menus {
  box-sizing: border-box;
  /* width: 200px; */
  position: relative;
  display: grid;
  row-gap: 2.2vh;
  grid-template-columns: repeat(1, 168px);
  grid-template-rows: repeat(9,5.9vh);
  z-index: 10;
}

.menu-item-active {
  background: #24b287 !important;
  color: #fff !important;
  font-weight: bold !important;
}
.menu-item-active span {
  color: #fff !important;
  font-weight: bold !important;
}
.menu-item {
  background: linear-gradient( 0deg, #FFFFFF 0%, #F5F7FB 100%);
  box-shadow: 4px 4px 12px 0px rgba(56,73,81,0.24);
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #FFFFFF;
}
 
</style>
