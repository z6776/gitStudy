<template>
  <div class="w-full h-368px bg-#fff box-shadow rounded-12px border-[1px-solid-#eeeeee] p-[24px]">
    <div class="color-[#384951] font-bold text-18px mb-22px">一周睡眠分析</div>
    <div
      v-if="empty"
      class="flex items-center justify-center color-[#636676] text-14px w-full h-240px bg-#F5F7FB"
    >
      暂无数据~
    </div>
    <div id="weekechart" v-else></div>
    <div class="chart_legend">
      <div>无数据</div>
      <div>深度睡眠</div>
      <div>中度睡眠</div>
      <div>轻度睡眠</div>
      <div>零星小睡或静息</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { sleepOptions, sleepBarOption } from '@/utils/baseOptions/sleepoptions'
import { dateFtt } from '@/utils/date/dateFtt'
import { computed, onMounted, ref, watch, nextTick } from 'vue'

const props = defineProps({
  sleepData: {
    type: Object,
    default: {},
  },
})
const setEchart = (data: any) => {
  let y_data = []
  let series_data = []
  let keyArr = []
  let lineArr = []
  let option = Object.assign({}, sleepOptions)

  for (const key in data.sleep_draw) {
    if (Object.hasOwnProperty.call(data.sleep_draw, key)) {
      const element = data.sleep_draw[key]
      keyArr.push(key)
      lineArr.push({
        yAxis: dateFtt('mm/dd', new Date(key)),
      })
      y_data.push(dateFtt('mm/dd', new Date(key)))
      for (let index = 0; index < element.length; index++) {
        series_data[index] = {
          type: 'bar',
          data: [1, 1, 1, 1, 1, 1, 1],
          stack: 'total',
          zlevel: 1,
          barGap: '-100%', // 柱体间隔为 0
          barCategoryGap: '0%', // 类目间隔为 0
          barWidth: '20', // 或者设置一个具体值，如 20
          itemStyle: {
            borderWidth: -1, // 设置边框宽度为0
            borderColor: 'transparent', // 设置边框颜色为透明
            color: (params: any) => {
              let index = y_data.indexOf(params.name)

              let value = data.sleep_draw[keyArr[index] ?? '']
                ? data.sleep_draw[keyArr[index] ?? ''][params.seriesIndex]
                : ''
              if (value == 10) {
                return '#6377f5'
              } else if (value == 9) {
                return '#9e4ae3'
              } else if (value == 1) {
                return '#ed95f7'
              } else if (value == 3) {
                return '#80bafa'
              } else if (value == 0) {
                return '#ffffff00'
              } else {
                return '#86C7F7'
              }
            },
          },
        }
      }
    }
    option.yAxis.data = y_data
    series_data.forEach((item: any, index: number) => {
      item.markLine = {
        silent: true, // 静默模式，不响应鼠标事件
        symbol: 'none', // 不显示标记点
        lineStyle: {
          type: 'solid',
          color: '#EEEEEE',
        },
        label: {
          show: false,
          position: 'start', // 标签显示在线的起始位置
          formatter: '{b}', // 显示标签文本
          align: 'right',
          verticalAlign: 'middle',
          padding: [0, 10, 0, 0], // 调整标签位置
        },
        data: lineArr,
      }
    })
    option.series = series_data
    // i++;
  }
  option.formatter = (params: any) => {
    let html = ''
    let rangeList = data.sleep_range
    for (const key in rangeList) {
      if (Object.hasOwnProperty.call(rangeList, key)) {
        const element = rangeList[key]
        if (keyArr[y_data.indexOf(params.name)] == element.date) {
          if (
            params.seriesIndex >= element.in_sleep_index &&
            params.seriesIndex <= element.out_sleep_index
          ) {
            if (element.in_sleep_time) {
              html += `<div style="color:#fff;">入睡时间：${element.in_sleep_time}</div>`
            }
            if (element.out_sleep_time) {
              html += `<div style="color:#fff;">出睡时间：${element.out_sleep_time}</div>`
            }
          }
        }
      }
    }
    return html
  }
  let chartDom = document.getElementById('weekechart')
  let myChart = echarts.init(chartDom)
  option && myChart.setOption(option)
}
const empty = ref(true)
watch(
  () => props.sleepData,
  (val) => {
    if (typeof val === 'object' && Object.keys(val).length > 0) {
      empty.value = !(typeof val.sleep_draw === 'object' && Object.keys(val.sleep_draw).length > 0)
      if (!empty.value) {
        nextTick(() => {
          setEchart(props.sleepData)
        })
      }

      return
    }
    empty.value = true
  },
  { immediate: true, deep: true },
)
</script>
<style scoped>
.box-shadow {
  box-shadow: 0px 8px 24px 0px rgba(146, 159, 175, 0.16);
}
#weekechart {
  height: 240px;
}
.chart_legend {
  display: flex;
  justify-content: center;
  font-size: 14px;
  color: #636676;
  margin-top: 12px;
  height: 21px;
  line-height: 21px;
}

.chart_legend > div {
  margin-right: 24px;
  padding-left: 14px;
  position: relative;
}

.chart_legend > div::before {
  content: '';
  width: 10px;
  height: 10px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.chart_legend > div:nth-child(1)::before {
  background: #ffffff;
  border: 1px solid #636676;
}

.chart_legend > div:nth-child(2)::before {
  background: #6377f5;
}

.chart_legend > div:nth-child(3)::before {
  background: #9e4ae3;
}

.chart_legend > div:nth-child(4)::before {
  background: #ed95f7;
}

.chart_legend > div:nth-child(5)::before {
  background: #80bafa;
}

.chart_legend > div:nth-child(5) {
  margin-right: 0;
}
</style>
