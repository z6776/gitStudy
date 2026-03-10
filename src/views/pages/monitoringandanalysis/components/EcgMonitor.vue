<template>
  <div class="ecgmonitor ani">
    <p class="card-title">心电采集分析</p>

    <div class="flex justify-between items-center mb20cus">
      <span class="color-[#384951] text16cus font-bold">心电采集分析报告</span>
      <span class="color-[#636676] text14cus">监测范围：{{ jctime }}</span>
    </div>

    <div class="text16cus color-[#384951] mb12cus">
      {{ info.txt ?? '暂无监护数据。' }}
    </div>

    <div class="ecg-container">
      <div class="h-4vh w-full bg-[#EBFAF3] flex justify-between items-center">
        <div
          class="flex-1 text-center color-[#636676] text16cus h-full flex justify-center items-center"
        ></div>
        <div
          class="flex-1 text-center color-[#636676] text16cus h-full flex justify-center items-center"
        >
          MeanRRI（ms）
        </div>
        <div
          class="flex-1 text-center color-[#636676] text16cus h-full flex justify-center items-center"
        >
          MeanHR（bpm）
        </div>
      </div>
      <div class="timeitem h-5vh w-650px flex justify-between items-center">
        <div
          class="flex-1 text-center color-[#636676] text16cus h-full flex justify-center items-center"
        >
          监测值
        </div>
        <div
          class="flex-1 text-center color-[#636676] text16cus h-full flex justify-center items-center"
        >
          <span>{{ info.MeanRRI ?? '--' }}</span>
          <img
            src="@/assets/icon/icon_up.png"
            alt=""
            v-if="info?.ascordesc == 1"
            class="block w-18px h-18px ml-10px"
          />
          <!-- <img
            src="@/assets/icon/icon_line.png"
            alt=""
            v-if="info?.ascordesc == 0"
            class="block w-18px h-18px ml-10px"
          /> -->
          <img
            src="@/assets/icon/icon_down.png"
            alt=""
            v-if="info?.ascordesc == -1"
            class="block w-18px h-18px ml-10px"
          />
        </div>
        <div
          class="flex-1 text-center color-[#636676] text16cus h-full flex justify-center items-center"
        >
          {{ info.MeanHR ?? '--' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type info = {
  MeanRRI: number
  MeanHR: number
  ascordesc: number
  time: string
  txt: string
}

const props = defineProps({
  jctime: {
    type: String,
    default: '',
  },
  info: {
    type: Object,
    default: {},
  },
})
</script>

<style scoped>
.ecg-container {
  border: 1px solid #eeeeee;
}
.timeitem:not(:last-child) {
  border-bottom: 1px solid #384951;
}
.timeitem:nth-child(3n + 1) {
  background: rgba(255, 255, 255, 0.01);
  box-shadow: inset 0px 0px 24px 0px #276665;
}
.ecgmonitor {
  border-radius: 8px;
  border: 1px solid #eeeeee;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding: calc(20 / 1080 * 100vh) calc(24 / 1920 * 100vw);
  height: 26.296296296296295vh;
  overflow: hidden;
}
.card-title {
  font-size: calc(18 / 1080 * 100vh);
  font-weight: bold;
  color: #384951;
  padding-bottom: calc(20 / 1080 * 100vh);
  border-bottom: 1px solid #eeeeee;
  margin-bottom: calc(20 / 1080 * 100vh);
}

.text16cus {
  font-size: calc(16 / 1080 * 100vh);
  line-height: 1;
}

.mb20cus {
  margin-bottom: calc(20 / 1080 * 100vh);
}
.mb12cus {
  margin-bottom: calc(12 / 1080 * 100vh);
}
.text14cus {
  font-size: calc(14 / 1080 * 100vh);
  line-height: 1;
}
</style>
