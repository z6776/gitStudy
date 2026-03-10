<template>
  <div class="header d-flex">
    <div class="logo cursor-pointer" @dblclick="logout">
      <img src="../assets/images/avatar.png" class="avatar" alt="" />
      <span class="name">{{ zoom.name }}</span>
    </div>

    <div class="tabs">
      <div
        v-for="(item, index) in menus"
        :key="index"
        @click="routerTo(item)"
        class="tabbox"
        :class="{ active: currentMenu === item.path }"
        @mouseenter="mouseEnter(item)"
        @mouseleave="moveMenu =''"
      >
        <Transition name="slide">
          <div class="tabline" v-if="moveMenu == item.path"></div>
        </Transition>

        <span class="tab">{{ item.name }}</span>
        <span class="num" :class="{ dot: item.warn }">{{ item.num }}</span>
      </div>
    </div>

    <div class="date">
      {{ date }}
    </div>

    <custom-dialog ref="cusTomDialog" title="退出登录" :width="getRem(580)" v-model="dialogVisible" top="28vh" :zIndex="3000">
      <div class="dialog-body">
        <div class="tip">请输入管理员密码，获取该功能权限</div>
        <passwordInput
          ref="passwordInputRef"
          v-model="password"
          :length="6"
          @success="passwordCheck"
        />
      </div>
    </custom-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, type Component, toRefs,watch,onMounted,nextTick } from 'vue'
import { dateFtt } from '@/utils/date/dateFtt'
import { ElLoading } from 'element-plus'
import batApi from '@/api/bat'
import { useRouter } from 'vue-router'
import { useMenuSelect } from '@/stores/menuSelect'
import passwordInput from './passwordInput.vue'
import { useTopNums } from "@/stores/topNums";
import { useZoomStore } from "@/stores/zoom";
import { getRem } from "@/utils/function/function";
const { zoom } = useZoomStore();
const usetopNumsStore = useTopNums();
const { currentMenu, changeCurrentMenu } = toRefs(useMenuSelect())
const router = useRouter()
const date = ref(dateFtt('yyyy-mm-dd 星期ww hh:MM:ss', new Date()))
const intervalId = ref(0)
intervalId.value = setInterval(() => {
  date.value = dateFtt('yyyy-mm-dd 星期ww hh:MM:ss', new Date())
}, 1000)

onUnmounted(() => {
  clearInterval(intervalId.value)
})

const dialogVisible = ref(false)
const password = ref('')
const passwordInputRef = ref<null | typeof passwordInput>(null)
// 密码验证
async function passwordCheck(e: string) {
  let loadingInstance = ElLoading.service({
    text: '正在验证密码...',
    target: '.dialog-body'
  })
  try {
    await batApi.checkpassword({
      zone_number: localStorage.getItem('zone_number'),
      password: e
    })
    let _l = ElLoading.service({
      text: '退出中...',
      target: '.dialog-body'
    })
    usetopNumsStore.clear();
    localStorage.clear()
    router.push('/login')
  } catch (error) {
    passwordInputRef.value!.clearInput()
    loadingInstance.close()
    return
  }
}
function logout() {
  dialogVisible.value = true
}

const menus = ref([
  {
    name: '体征异常',
    path: '/alarmCenter/abnormalPhysical',
    num: 0,
    warn: false,
  },
  {
    name: '低电量',
    path: '/alarmCenter/lowbatterymonitoring',
    num: 0,
    warn: false,
  },
  {
    name: '传输异常',
    path: '/alarmCenter/wearAbnormalMonitoring',
    num: 0,
    warn: false,
  },
  {
    name: '跌倒检测',
    path: '/alarmCenter/fallAlarmRecord',
    num: 0,
    warn: false,
  },
  {
    name: '围栏告警',
    path: '/alarmCenter/alarmManagement',
    num: 0,
    warn: false,
  },
  {
    name: 'SOS呼叫',
    path: '/alarmCenter/sosEmergencyCall',
    num: 0,
    warn: false,
  },
])

const showNums = ()=>{
  nextTick(()=>{
     menus.value = [
    {
      name: '体征异常',
      path: '/alarmCenter/abnormalPhysical',
      num: usetopNumsStore.topNums?.warn_count || 0,
      warn: usetopNumsStore.topNums?.warn_count && usetopNumsStore.topNums?.warn_count > 0 ? true : false,
    },
    {
      name: '低电量',
      path: '/alarmCenter/lowbatterymonitoring',
      num: usetopNumsStore.topNums?.bat_count || 0,
      warn: usetopNumsStore.topNums?.bat_count && usetopNumsStore.topNums?.bat_count > 0 ? true : false,
    },
    {
      name: '传输异常',
      path: '/alarmCenter/wearAbnormalMonitoring',
      num: usetopNumsStore.topNums?.wear_count || 0,
      warn: usetopNumsStore.topNums?.wear_count && usetopNumsStore.topNums?.wear_count > 0 ? true : false
    },
    {
      name: '跌倒检测',
      path: '/alarmCenter/fallAlarmRecord',
      num: usetopNumsStore.topNums?.fall_count || 0,
      warn: usetopNumsStore.topNums?.fall_count && usetopNumsStore.topNums?.fall_count > 0 ? true : false
    },
    {
      name: '围栏告警',
      path: '/alarmCenter/alarmManagement',
      num: usetopNumsStore.topNums?.fence_count || 0,
      warn: usetopNumsStore.topNums?.fence_count && usetopNumsStore.topNums?.fence_count > 0 ? true : false
    },
    {
      name: 'SOS呼叫',
      path: '/alarmCenter/sosEmergencyCall',
      num: usetopNumsStore.topNums?.sos_count || 0,
      warn: usetopNumsStore.topNums?.sos_count && usetopNumsStore.topNums?.sos_count > 0 ? true : false
    },
  ]
  }) 
}


const mouseEnter = (item:any)=>{
  // 
  if(currentMenu.value !== item.path){
     moveMenu.value = item.path;
     return;
  }
   moveMenu.value = "";
}

usetopNumsStore.$subscribe(()=>{
  showNums();
})

onMounted(()=>{
  showNums();
})

const routerTo = (item: any) => {
  nextTick(()=>{
     moveMenu.value = "";
  changeCurrentMenu.value(item.path)
  router.push({ path: item.path })
  })
 
}
const moveMenu = ref()
// watch(()=>currentMenu.value,(val:any)=>{
//    moveMenu.value = val
// })


</script>

<style scoped lang="scss">
.header {
  width: 100vw;
  height: 64px;
  padding: 0 20px;
  background-color: #ffffff;
  box-sizing: border-box;
  justify-content: space-between;
box-shadow: 0px 2px 8px 0px rgba(146, 159, 175, 0.12); 
  position: relative;
  z-index: 99;
  .logo {
    display: flex;
    gap: 8px;
    align-items: center;
    // margin-right: 342px;
    .avatar {
      width: 40px;
      height: 40px;
    }
    .name {
      font-weight: normal;
      font-size: 18px;
      color: #24b287;
      font-weight: 800;
    }
  }
  .tabs {
    display: flex;
    gap: 44px;
    // margin-right: auto;
    height: 100%;
    align-items: center;
    & .tabbox {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-bottom: 3px solid transparent;
    }
    & > div .tab {
      font-size: 16px;
      color: #384951;
    }
    & > div:hover .tab {
      color: #24b287 !important;
    }
    & .tab {
      font-family:
        Alibaba PuHuiTi 3,
        Alibaba PuHuiTi 30;
      font-weight: normal;
      font-size: 18px;
      color: #384951;
      margin-right: 4px;
      display: block;
    }
    & .num {
      display: block;
      min-width: 32px;
      padding: 2px 15px;
      font-family:
        Alibaba PuHuiTi 3,
        Alibaba PuHuiTi 30;
      font-weight: 400;
      font-size: 14px;
      background-color: #bdcbd1;
      color: #ffffff;
      border-radius: 12px;
      box-sizing: border-box;
      text-align: center;
    }
    .dot {
      background-color: var(--ep-color-error) !important;
    }
  }

  .date {
    font-family:
      Alibaba PuHuiTi 3,
      Alibaba PuHuiTi 30;
    font-weight: normal;
    font-size: 14px;
    color: #2f374c;
    font-weight: 400;
  }
}
.tabbox {
  position: relative;
}
.tabline {
  position: absolute;
  width: 50px;
  height: 2px;
  border-radius: 90px;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #24b287;
}
.tip {
  /* height: 16px;
  font-family: Source Han Sans CN, Source Han Sans CN;
  font-weight: 400;
  font-size: 16px;
  color: #252b50;1
  line-height: 16px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 120px; */
  margin-bottom: 24px;
}

.active {
  border-bottom: 3px solid #24b287 !important;
}

.dialog-body {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slide-enter-active,
.slide-leave-active {
  transition: width 0.2s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  width: 0px;
}
</style>
