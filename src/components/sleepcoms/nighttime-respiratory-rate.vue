<template>
  <div
    class="w-full h-368px bg-#fff rounded-12px box-shadow border-[1px-solid-#eeeeee] mt-20px p-[24px]"
  >
    <div class="flex justify-between items-center">
      <span class="font-bold text-18px color-[#384951]">夜间呼吸率统计</span>
      <span class="color-[#929FAF] text-14px">图表仅展示每小时均值</span>
    </div>
    <div class="flex justify-between items-center mt-15px mb-15px">
      <div class="w-33% flex flex-col justify-center afterBorder">
        <div class="m-[0_auto]">
          <span class="text-16px color-[#646676] block line-height-16px">最大呼吸率</span>
          <div>
            <span class="color-[#384951] text-40px font-bold inline-block line-height-40px">{{
              breathInfo.max_breath || '--'
            }}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px inline-block line-height-14px"
              >次/min</span
            >
          </div>
        </div>
      </div>
      <div class="w-33% flex flex-col justify-center items-center afterBorder">
        <div class="m-[0_auto]">
          <span class="text-16px color-[#646676]">最小呼吸率</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{
              breathInfo.min_breath || '--'
            }}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">次/min</span>
          </div>
        </div>
      </div>
      <div class="w-33% flex flex-col justify-center items-center">
        <div class="m-[0_auto]">
          <span class="text-16px color-[#646676]">平均呼吸率</span>
          <div>
            <span class="color-[#384951] text-40px font-bold">{{
              breathInfo.avg_breath || '--'
            }}</span>
            <span class="color-[#929FAF] text-14px font-500 ml-4px">次/min</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="empty"
      class="flex items-center justify-center color-[#636676] text-14px w-full h-190px bg-#F5F7FB"
    >
      暂无数据~
    </div>

    <div id="hxchart" v-else></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { hxOptions } from '@/utils/baseOptions/sleepoptions'
import { dateFtt } from '@/utils/date/dateFtt'
import { computed, onMounted, ref, watch, nextTick } from 'vue'

const props = defineProps({
  breathInfo: {
    type: Object,
    default: {},
  },
})
//

type hxitem = {
  [key: string]: number
}
const initCharts = (val: hxitem) => {
  let hxchart: HTMLElement = document.getElementById('hxchart') as HTMLElement
  let myChart = echarts.init(hxchart)
  hxOptions.xAxis.data = []
  hxOptions.series[0]!.data = []
  if (Object.keys(val).length > 0) {
    Object.keys(val)
      .sort()
      .forEach((v) => {
        hxOptions.xAxis.data.push(v)
        hxOptions.series[0]!.data.push(val[v])
      })
  }
  let option = { ...hxOptions }
  myChart.setOption(option)
}
const empty = ref(true)
watch(
  () => props.breathInfo,
  async (val) => {
    if (typeof val === 'object' && Object.keys(val).length > 0) {
      empty.value = !(
        val.night_sleep_breath_text && Object.keys(val.night_sleep_breath_text).length > 0
      )
      if (!empty.value) {
        empty.value = false
        await nextTick()
        setTimeout(() => {
          initCharts(val.night_sleep_breath_text)
        }, 0)
      }
      return
    }
    empty.value = true
  },
  { deep: true },
)
</script>
<style scoped>
.box-shadow {
  box-shadow: 0px 8px 24px 0px rgba(146, 159, 175, 0.16);
}
.afterBorder {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 1px;
    height: 40px;
    background-color: #eeeeee;
  }
}
#hxchart {
  height: 190px;
}
</style>
