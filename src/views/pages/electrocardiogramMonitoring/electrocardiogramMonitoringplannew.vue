<template>
  <div class="electrocardiogramMonitoringplannew p-20px">
    <HeaderSeach v-model="date" @select-date="getPlanGroup" yesterday/>

    <div class="mt-20px">
      <el-table :data="tableData" row-class-name="h64px" v-loading="tableLoading" border class="rounded-12px tableshadow">
        <el-table-column prop="totalStep" label="序号" align="center" width="100px">
          <template #default="scope">
            <div>
              <span>{{ scope.$index + 1 + (queryParams.page - 1) * queryParams.perPage }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="采集时间" align="center" width="500px">
          <template #default="scope">
            <div>
              <span>{{ dateFtt('hh:MM', scope.row.insert_time) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="采集方式" align="center" prop="msg_name" width="300px">
        </el-table-column>

        <el-table-column prop="totalStep" label="ECG心电图" align="center">
          <template #default="scope">
            <div class="w-1000px h-80px flex justify-center items-center relative">
              <div class="w-906px h-60px border" :id="'charts' + scope.$index"></div>
              <el-button
                type="primary"
                class="absolute detailbtn"
                @click="openPlanResult(scope.row)"
                >点击查看详情</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <elc-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.perPage"
        :page-sizes="[10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <custom-dialog
      v-model="heartdialog"
      title="ECG心电监测记录"
      :width="`${(1000 / 1920) * 100}%`"
      class="ecg-dialog"
      @close="() => (heartdialog = false)"
      :modals-lock-scroll="false"
    >
      <div class="heartdialog-content">
        <div class="collect-time">采集时间:{{ datevalue ? datevalue.replace(/-/g, '/') : '' }}</div>
        <div class="canvasBox">
          <div class="no-data" v-if="!ecglen">暂无数据</div>

          <div
            :id="'ecg-chart' + index"
            v-for="(item, index) in ecglen"
            style="
              width: 904px;
              height: 210px;
              border: 1px solid #eeeeee;
              position: relative;
              z-index: 3;
            "
          ></div>
        </div>
      </div>
    </custom-dialog>
  </div>
</template>
<script setup lang="ts">
import dynamicMonitoringApi from '@/api/dynamicMonitoring'
import { ref, reactive, toRefs, onMounted, nextTick } from 'vue'
import rehabilitationTrainingplanApi from '@/api/rehabilitationTraining'
import { usePaientInfo } from '@/stores/paientinfo'
import { dateFtt } from '@/utils/date/dateFtt'
import { md5Str } from '@/utils/function/function'
 
import ElectrocarDiographicApi from '@/api/electrocardiographic'
import type { BpmItem, personItem, GroupItem, ResponseData } from '@/interface/interface'
import * as echarts from 'echarts'
const { paientInfo } = toRefs(usePaientInfo())

const date = ref('')
const tableData = ref<any[]>([])

const tableLoading = ref(false)
const queryParams = reactive({
  inOrOut: '',
  bindStatus: '',
  name: '',
  bedNumber: '',
  page: 1,
  perPage: 10,
})
let total = ref(0)

const handleSizeChange = (val: number) => {
  queryParams.perPage = val
  getPlanGroup()
}
const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getPlanGroup()
}

const getArray = (key: string) => {
     if(!key){
        return []
     }
     let arr =  key.split(',');
     if(arr.length  > 0){
         arr[0] = arr[0]!.substring(1);
         arr[arr.length - 1] = arr[arr.length - 1]!.substring(0)
     }
     return arr.map((item:any)=>Number(item));
}

async function getPlanGroup() {
  try {
    tableLoading.value = true
    let result = await dynamicMonitoringApi.getPatientplanEcgDetails({
      ccid: paientInfo.value.ccid || '',
      patient_id: paientInfo.value!.id || '',
      date: dateFtt('yyyymmdd', date.value),
    })
    if (Array.isArray(result.data?.result?.data) && result.data?.result?.data.length > 0) {
      tableData.value = result.data?.result?.data
      // 一秒钟250个点 一个点是4ms
      let _d = new Date().getTime()
      for (let i = 0; i < tableData.value.length; i++) {
        const element = tableData.value[i]
        let _a = getArray(element.ecg_data_preview);
        let _ecgData: any[] = []
        _a.forEach((item: any, index: number) => {
          _ecgData.push([_d + Math.floor(4 * index), item])
        });
        const option = {
          grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            top: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'time',
            axisTick: {
              show: false,
            },
            boundaryGap: false,
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: true,
            },
            axisLine: {
              show: false,
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              type: 'line',
              data: _ecgData,
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: '#E24040',
                width: 1,
              },
            },
          ],
        }
        nextTick(() => {
          let chartDom = document.getElementById('charts' + i) as HTMLElement
          if (echarts && echarts.getInstanceByDom(chartDom)) {
            echarts.dispose(chartDom)
          }
          const dom = echarts.init(chartDom)
          dom && dom.setOption(option)
        })
      }
    }else{
       tableData.value = []
    }
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
}

let heartdialog = ref(false)
let datevalue = ref(new Date().toISOString().split('T')[0])
async function openPlanResult(item: BpmItem) {
  heartdialog.value = true
  datevalue.value = date.value || dateFtt("yyyy-mm-dd", item.insert_time)

  nextTick(() => {
    initChart(item)
  })
}

const ecglen = ref(0)

async function initChart(item?: BpmItem) {
  const option = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      show: false,
    },
    xAxis: {
      type: 'time',
      data: [],
      axisLine: {
        show: false,
        lineStyle: {
          color: '#999',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },

      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        formatter: function (value: number) {
          const date = new Date(value)
          // 假设数据范围是 2023-01-01 到 2023-12-31
          const minDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0,
          ).getTime()
          const maxDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            23,
            59,
            59,
          ).getTime()
          // 如果是最小值或最大值，添加标记
          if (value === minDate) {
            return '00:00'
          } else if (value === maxDate) {
            return '23:59'
          }
          return dateFtt('hh:MM', value) // 默认格式
        },
        show: false,
      },
      // scale: true, // 自动缩放 Y 轴
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
      // scale: true, // 自动缩放 Y 轴
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'ECG',
        type: 'line',
        data: [],
        smooth: true, // 平滑曲线
        lineStyle: {
          color: '#E24040', // 红色线条
          width: 1,
        },
        symbol: 'none', // 不显示数据点标记
      },
    ],
    dataZoom: [
      {
        type: 'inside', //类型
        // filterMode:"none",
        show: true, //显示
        // minValueSpan: 9 * 60 * 1000, // 最小窗口范围：1 分钟（60,000 毫秒）
        // maxValueSpan: 24 *  60 * 60 * 1000, // 最大窗口范围：1 分钟（固定）
        start: 70, // 初始显示 0%~100%（即整个 1 分钟范围）
        end: 100, // 结束显示 0%~100%（即整个 1 分钟范围）
      },
    ],
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
  }

  // ecglen.value = 0;
  let hour = ''
  if (item?.insert_time) {
    let _a = dateFtt('hh:MM', item.insert_time).split(':')
    hour = Number(_a[0]) + ''
  }
  const _result = await ElectrocarDiographicApi.get_m9_ecg_wave({
    patient_id: paientInfo.value.id,
    date: date.value || dateFtt("yyyy-mm-dd", datevalue.value),
    md5: md5Str(paientInfo.value.id + ''),
    hour,
  })
  const second = 1000 / 250 // 一秒钟250个点
  if (_result.data.result.length > 0) {
    ecglen.value = _result.data.result.length

    _result.data.result.forEach((item: any, index: number) => {
      let ecgData: any = []

      const chartOption = JSON.parse(JSON.stringify(option))

      item.ecg_data.forEach((child: any, i: number) => {
        ecgData.push([Number((new Date().getTime() + i * second).toFixed(0)), child])
      })
      chartOption.series[0].data = ecgData
      nextTick(() => {
        let chartDom = document.getElementById('ecg-chart' + index) as HTMLElement
        if (echarts && echarts.getInstanceByDom(chartDom)) {
          echarts.dispose(chartDom)
        }
        const dom = echarts.init(chartDom)
        dom && dom.setOption(chartOption)
        createBackGround()
        let linstyle = {
          'box-sizing': 'border-box',
          position: 'absolute',
          width: '2px',
          height: document.querySelector('.canvasBox')!.scrollHeight + 'px',
          top: '0px',
          'background-color': '#bfc0c6',
        }
        let maginLeft = ['30', '150', '200', '400', '600', '670', '800']
        for (let i = 0; i < 7; i++) {
          let item = document.createElement('div')
          item.style.left = maginLeft[i] + 'px'
          Object.keys(linstyle).forEach((key) => {
            item.style.setProperty(key, linstyle[key as keyof typeof linstyle])
          })
          document.querySelector('.canvasBox')!.appendChild(item)
        }
      })
    })
  } else {
    ecglen.value = 0
  }
  // 使用配置项显示图表
}

const createBackGround = () => {
  const innerWidth = document.querySelector('.canvasBox')?.clientWidth || 0
  const innerHeight = document.querySelector('.canvasBox')?.scrollHeight || 0
  let boxWidth = 7
  let boxHeight = 7
  if (window.innerWidth <= 1280) {
    boxWidth = 3.5
    boxHeight = 3.5
  }

  let rowlen = Math.ceil(innerWidth / boxWidth)
  let collen = Math.ceil(innerHeight / boxHeight)
  for (let i = 0; i < rowlen; i++) {
    for (let j = 0; j < collen; j++) {
      const box = document.createElement('div')
      box.style.width = boxWidth + 'px'
      box.style.height = boxHeight + 'px'
      box.style.position = 'absolute'
      box.style.left = i * boxWidth + 'px'
      box.style.top = j * boxHeight + 'px'
      box.style.boxSizing = 'border-box'
      box.style.borderRight = '1px solid #F5F7FB'
      box.style.borderBottom = '1px solid #F5F7FB'
      document.querySelector('.canvasBox')?.appendChild(box)
    }
  }
}
onMounted(() => {
  getPlanGroup()
})
</script>
<style scoped>
.border {
  border: 1px solid #eeeeee;
}
.detailbtn {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #fff;
  transform: translate(-50%, -50%);
  background: #49b997;
  cursor: pointer;
}

.canvasBox {
  width: 902px;
  height: 212px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  border: 1px solid #eeeeee;
}

.canvasBox .no-data {
  height: 210px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #384951;
  margin-bottom: 0;
}
.heartdialog-content {
  padding: 48px;
}

.collect-time {
  font-weight: bold;
  font-size: 16px;
  color: #384951;
  margin-bottom: 24px;
}
</style>
