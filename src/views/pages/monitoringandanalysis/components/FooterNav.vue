<template>
  <div class="footer-nav">
    <div class="nav-content flex items-center">
      <div
        class="nav-item"
        v-for="(item, index) in navItems"
        :key="index"
       
        @click="switchTab(item)"
      >
        <div class="nav-text hover:text-[#48BC84]"  :class="{ active: activeItem === item.id}">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
// 导航项数据
const navItems = [
  { id: 'overview', name: '监护总览',path : '/monitoringOverview' },
  { id: 'analysis', name: '监护分析',path : '/monitoringandanalysis' },
  { id: 'hrv', name: 'HRV分析',path : '/rightAside/hrv' },
  { id: 'sleep', name: '睡眠监测',path : '/rightAside/sleep' },
  { id: 'activity', name: '活动事件分析',path : '/rightAside/activity_inner' },
  { id: 'report', name: '活动报告',path : '/rightAside/hrv' },
  { id: 'blood-pressure', name: '血压记录',path : '/electrocardiogramMonitoring/bloodPressureRecord' },
  { id: 'ecg', name: '心电记录',path : '/electrocardiogramMonitoring/electrocardiogramMonitoringplannew' },
];
    // path:"/electrocardiogramMonitoring/bloodPressureRecord"
    //     },{
    //         name:"心电记录",
    //         path:"/electrocardiogramMonitoring/electrocardiogramMonitoringplannew"

const props = defineProps<{currentPage: string}>();
const activeItem = ref('overview');
watch(()=>props.currentPage, (newVal) => {
  if (newVal) {
    activeItem.value = newVal;
  }
},{immediate: true});

const switchTab = (item: any) => {
      activeItem.value = item.id;
      router.replace(item.path);
}



</script>

<style lang="scss" scoped>
.footer-nav {
  height: 6vh;
  background: rgba(34, 49, 44, 1);
  box-shadow: 0px 8px 24px 0px rgba(146, 159, 175, 0.16);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-left: 100px;
}
.nav-item{
   width: 200px;
   text-align: center;
   cursor: pointer;
   font-size: 18px;
   position: relative;
    color: #BDCBD1;
}
.nav-item:not(:last-child)::after{
  content: "";
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  width: 1px;
  height: 16px;
  background-color: #24B287;
}
.nav-text{
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 1vh 20px;
  transition: all 0.3s ease;
}
.active{
  background-color: #24B287;
  color: #fff !important;
  font-weight: bold;
  border-radius: 80px;

}
</style>
