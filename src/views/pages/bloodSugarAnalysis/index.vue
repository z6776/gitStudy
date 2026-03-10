<template>
  <div class="bloodSugarAnalysis p-[20px]">
    <HeaderSeach v-model="date" @selectDate="selectDate" />

    <div class="sectionTop h-570px flex gap-19px justify-between mt-20px">
      <div class="left-aside bg-#999999">
        <div class="left-aside-title flex justify-between items-center">
          <span class="text-18px color-[#384951]">今日血糖波动趋势</span>
          <span class="subtilte"
            >数据统计时间：
            {{ sumTime }}</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="avg">日均值:{{ info?.today_info?.today_diabetes_avg || '--' }}mmol/L</div>
          <div class="line-height-14px flex justify-start items-center" v-if="false">
            <span class="color-[#636676] text-14px mr-24px">第10个到第90个百分位数</span>
            <span class="dot bg-#D7E9FD mr-8px"></span>
            <span class="color-[#636676] text-14px mr-24px">第25个到第75个百分位数</span>
            <span class="dot bg-#0477E0 mr-8px"></span>
            <span class="color-[#636676] text-14px">中位数</span>
            <span class="dot bg-#384951 mr-8px"></span>
            <span class="color-[#636676] text-14px">目标范围</span>
          </div>
        </div>
        <div class="dataNums flex justify-between">
          <div
            class="flex flex-col justify-center items-center items gap-4px"
            v-for="(item, index) in nums"
          >
            <div class="line-height-14px h-14px color-[#929FAF] text-14px text-center">
              {{ (index + 1) % 2 != 0 ? item.time : '' }}
            </div>
            <div class="line-height-16px color-[#636676] text-16px font-bold text-center">
              {{ item.value }}
            </div>
          </div>

          <div class="color-[#929FAF] text-[14px] line-height-14px unit">mmol/L</div>
        </div>

        <div class="h-287px flex flex-col justify-center items-center" v-if="emptyData">
          <img src="@/assets/images/nodata.png" class="w-180px h-180px" />
          <div class="color-[#929faf] text-16px mt-10px">未查询到相关信息~</div>
        </div>

        <div class="chartAvg h-287px" id="chartAvg" v-else></div>

        <div class="ygbox flex justify-between w-1216px h-124px borderRadius items-stretch">
          <div class="flex flex-col justify-center items-center flex-1 flex-shrink-0 gap-8px">
             <div class="line-height-16px h-16px color-[#636676] text-16px text-center" v-if="info?.today_info?.per_hour_avg_max_period ">
            </div>
             <div class="line-height-24px color-[#384951] text-24px font-bold text-center" v-if="info?.today_info?.today_HbA1c ">
              {{ info?.today_info?.today_HbA1c }}%
            </div>
             <div class="line-height-24px color-[#384951] text-24px font-bold text-center" v-else>
               --
            </div>
            <div class="line-height-16px  color-[#636676] text-16px text-center">
              预估糖化血红蛋白
            </div>
           
          </div>

          <div class="flex flex-col justify-center items-center flex-1 flex-shrink-0 items gap-8px">
            <div class="line-height-16px h-16px color-[#636676] text-16px text-center" v-if="info?.today_info?.per_hour_avg_max_period">
              {{ info?.today_info?.per_hour_avg_max_period  }}
            </div>
            <div class="line-height-24px color-[#384951] text-24px font-bold text-center" v-if="info?.today_info?.per_hour_avg_max_value">
              {{ info?.today_info?.per_hour_avg_max_value  }}mmol/L
            </div>
            <div class="line-height-24px color-[#384951] text-24px font-bold text-center" v-else>
              --
            </div>

            <div class="line-height-16px color-[#636676] text-16px text-center">高峰时段均值</div>
          </div>

          <div class="flex flex-col justify-center items-center flex-1 flex-shrink-0 items gap-8px">
            <div class="line-height-16px h-16px color-[#636676] text-16px text-center" v-if='info?.today_info?.per_hour_avg_min_period'>
              {{ info?.today_info?.per_hour_avg_min_period  }}
            </div>
            <div class="line-height-24px color-[#384951] text-24px font-bold text-center" v-if='info?.today_info?.per_hour_avg_min_value '>
              {{ info?.today_info?.per_hour_avg_min_value }}mmol/L
            </div>
            <div class="line-height-24px color-[#384951] text-24px font-bold text-center" v-else>
               --
            </div>
            <div class="line-height-16px color-[#636676] text-16px text-center">低谷时段均值</div>
          </div>
        </div>
      </div>

      <div class="right-aside">
        <div class="topSuger">
          <div class="left-aside-title abso flex justify-between items-center font-bold">
            <span class="text-18px color-[#384951]">今日血糖占比</span>
          </div>

          <div class="flex justify-center items-center">
            <div class="list_no_data mt-20px" v-if="emptyData">
              <img src="@/assets/images/nodata.png" class="w-140px h-140px" />
              <div class="color-[#929faf] text-16px mt-10px">未查询到相关信息~</div>
            </div>

            <div class="pieSuger w-612px h-210px" id="pieSuger" v-else></div>
          </div>
        </div>

        <div
          class="h-80px p-[16px] sugernw line-height-80px mb-20px mt-20px flex justify-between items-center"
        >
          <div class="flex justify-start items-center gap-8px line-height-18px">
            <img src="@/assets/images/V2/hl.png" class="w-48px h-48px" alt="" />
            <span class="color-[#384951] text-18px font-bold">最新血糖</span>
            <span class="color-[#384951] text-17px">{{
              info?.today_info?.today_newly_diabetes_time || ''
              }}
            </span>
          </div>
          <div class="flex flex-col justify-center items-center line-height-18px">
            <span class="color-[#384951] text-18px font-bold">{{
              info?.today_info?.today_newly_diabetes || '--'
            }}</span>
            <span class="color-[#929FAF] text-16px">mmol/L</span>
          </div>
        </div>

        <div class="grid-box">
          <div class="h-80px p-[16px] sugernw line-height-80px flex justify-between items-center">
            <div class="flex justify-start items-center gap-8px line-height-18px">
              <img src="@/assets/images/V2/1.png" class="w-48px h-48px" alt="" />
              <span class="color-[#384951] text-18px font-bold">睡前血糖</span>
            </div>
            <div class="flex flex-col justify-center items-center line-height-18px">
              <span class="color-[#384951] text-18px font-bold">{{
                info?.today_info?.today_diabetes_before_sleep || '--'
              }}</span>
              <span class="color-[#929FAF] text-16px">mmol/L</span>
            </div>
          </div>
          <div class="h-80px p-[16px] sugernw line-height-80px flex justify-between items-center">
            <div class="flex justify-start items-center gap-8px line-height-18px">
              <img src="@/assets/images/V2/2.png" class="w-48px h-48px" alt="" />
              <span class="color-[#384951] text-18px font-bold">夜间血糖</span>
            </div>
            <div class="flex flex-col justify-center items-center line-height-18px">
              <span class="color-[#384951] text-18px font-bold">{{
                info?.today_info?.today_diabetes_between_night || '--'
              }}</span>
              <span class="color-[#929FAF] text-16px">mmol/L</span>
            </div>
          </div>
          <div class="h-80px p-[16px] sugernw line-height-80px flex justify-between items-center">
            <div class="flex justify-start items-center gap-8px line-height-18px">
              <img src="@/assets/images/V2/3.png" class="w-48px h-48px" alt="" />
              <div class="flex flex-col justify-center items-start line-height-18px">
                <span class="color-[#384951] text-18px font-bold">当前</span>
                <span class="color-[#384951] text-18px font-bold">血糖最高值</span>
              </div>
            </div>
            <div class="flex flex-col justify-center items-center line-height-18px">
              <span class="color-[#384951] text-18px font-bold">{{
                info?.today_info?.today_diabetes_max || '--'
              }}</span>
              <span class="color-[#929FAF] text-16px">mmol/L</span>
            </div>
          </div>
          <div class="h-80px p-[16px] sugernw line-height-80px flex justify-between items-center">
            <div class="flex justify-start items-center gap-8px line-height-18px">
              <img src="@/assets/images/V2/4.png" class="w-48px h-48px" alt="" />
              <div class="flex flex-col justify-center items-start line-height-18px">
                <span class="color-[#384951] text-18px font-bold">当前</span>
                <span class="color-[#384951] text-18px font-bold">血糖最低值</span>
              </div>
            </div>
            <div class="flex flex-col justify-center items-center line-height-18px">
              <span class="color-[#384951] text-18px font-bold">{{
                info?.today_info?.today_diabetes_min || '--'
              }}</span>
              <span class="color-[#929FAF] text-16px">mmol/L</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 七日血糖趋势分析 -->
    <div class="sectionTop h-570px flex justify-start mt-20px bg-#fff rounded-12px">
      <div class="left-aside bg-#999999 w-1270px! border-none! shadow-none!">
        <div class="left-aside-title flex justify-between items-center">
          <span>七日血糖趋势分析</span>
          <span class="subtilte"
            >数据统计时间：{{ info?.week_diabetes_analysis_info?.start_time_str || '--' }}-{{
              info?.week_diabetes_analysis_info?.end_time_str || '--'
            }}(7天)</span
          >
        </div>
       
        <div class="dataNums flex justify-between">
          <div
            class="flex flex-col justify-center items-center items gap-4px"
            v-for="(item, index) in nums2"
          >
            <div class="line-height-14px h-14px color-[#929FAF] text-14px text-center">
              {{ (index + 1) % 2 != 0 ? item.time : '' }}
            </div>
            <div class="line-height-16px color-[#636676] text-16px font-bold text-center">
              {{ item.value }}
            </div>
          </div>

          <div class="color-[#929FAF] text-[14px] line-height-14px unit">mmol/L</div>
        </div>

        <div class="h-440px flex flex-col justify-center items-center" v-if="emptyData">
          <img src="@/assets/images/nodata.png" class="w-180px h-180px" />
          <div class="color-[#929faf] text-16px mt-10px">未查询到相关信息~</div>
        </div>
        <div class="chartAvg h-440px" id="chartAvgseven" v-else></div>
         <div class="flex justify-center items-center mt-10px">
          <div class="line-height-14px flex justify-start items-center">
             <span class="dot bg-#0477E0 mr-8px"></span>
            <span class="color-[#636676] text-14px">中位数</span>
               <span class="dot bg-#C1E0FE mr-8px ml-55px"></span>
            <span class="color-[#636676] text-14px">第25个到第75个百分位数</span>
            <span class="dot bg-#EAF4FE mr-8px ml-55px"></span>
            <span class="color-[#636676] text-14px">第10个到第90个百分位数</span>
           
          </div>
        </div>
      </div>

      <div class="flex-1 p-20px">
        <div class="left-aside-title flex justify-between items-center line-height-18px">
          <span class="color-[#384951] font-bold text-18px">七日血糖分析</span>
        </div>
        <div class="charts-box p-20px mt-20px">
          <div class="h-219px flex flex-col justify-center items-center" v-if="emptyData">
            <img src="@/assets/images/nodata.png" class="w-180px h-180px" />
            <div class="color-[#929faf] text-16px mt-10px">未查询到相关信息~</div>
          </div>
          <div class="w-536px h-219px" id="chartTrend" v-else></div>
          <div
            class="flex justify-center items-center gap-60px line-height-14px color-[#636676] text-[14px] mt-15px"
          >
            <div class="flex items-center gap-6px">
              <div class="w-12px h-12px bg-[#24B287]"></div>
              <div>血糖正常</div>
            </div>
            <div class="flex items-center gap-6px">
              <div class="w-12px h-12px bg-[#F08B2E]"></div>
              <div>血糖偏低</div>
            </div>
            <div class="flex items-center gap-6px">
              <div class="w-12px h-12px bg-[#F04A4B]"></div>
              <div>血糖偏高</div>
            </div>
          </div>
        </div>
        <div class="borderbox mt-20px">
          <div class="flex justify-between items-center borderbottom line-height-56px p-[0_12px]">
            <span class="text-[16px] color-[#636676]">预估糖化血红蛋白</span>
             <span class="text-[16px] color-[#384951]">{{info?.week_diabetes_analysis_info?.week_HbA1c ?  info?.week_diabetes_analysis_info?.week_HbA1c+"%" +"或" +  info?.week_diabetes_analysis_info?.week_diabetes_avg +"mmol/L"  :  "--"}}</span>
          </div>

          <div class="flex justify-between items-stretch borderbottom">
            <div class="borderRight w-25% flex flex-col justify-start items-center pt-12px pb-12px">
              <div class="color-[#636676] text-16px text-cente w-95px">葡萄糖平均值</div>
              <div class="color-[#384951] text-18px font-bold mt-auto">
                {{ info?.week_diabetes_analysis_info?.week_diabetes_avg || '--' }}
              </div>
              <div class="color-[#929FAF] text-16px">mmol/L</div>
            </div>
            <div
              class="borderRight w-25% flex flex-col justify-center items-center pt-12px pb-12px"
            >
              <div class="color-[#636676] text-16px text-center w-95px">目标范围内的时间</div>

              <div class="color-[#384951] text-18px font-bold mt-auto">
                {{ info?.week_diabetes_analysis_info?.week_diabetes_normal_per || '--' }}
              </div>
              <div class="color-[#929FAF] text-16px">%</div>
            </div>
            <div
              class="borderRight w-25% flex flex-col justify-center items-center pt-12px pb-12px"
            >
              <div class="color-[#636676] text-16px text-center w-95px">低于目标范围的时间</div>
              <div class="mt-auto">
                <div class="color-[#384951] text-18px font-bold">
                  {{ info?.week_diabetes_analysis_info?.week_diabetes_low_per || '--' }}
                </div>
                <div class="color-[#929FAF] text-16px">%</div>
              </div>
            </div>
            <div class="w-25% flex flex-col justify-center items-center pt-12px pb-12px">
              <div class="color-[#636676] text-16px text-center w-95px">高于目标范围的时间</div>
              <div class="mt-auto">
                <div class="color-[#384951] text-18px font-bold">
                  {{ info?.week_diabetes_analysis_info?.week_diabetes_high_per || '--' }}
                </div>
                <div class="color-[#929FAF] text-16px">%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dateFtt } from '@/utils/date/dateFtt'
import { ref, onMounted, toRefs, onUnmounted, nextTick,computed } from 'vue'
import { getRem } from '@/utils/function/function';
import {
  sugerOptions,
  pieSugerOptions,
  sugerOptionseven,
  sugerAgeRangeOption
} from './options/index'
import * as echarts from 'echarts'
import type { tooltipType } from '@/interface/interface'
import SportApi from '@/api/sportreport'
import { usePaientInfo } from '@/stores/paientinfo'
import { Md5 } from 'ts-md5'
import { mockDataPerson } from '@/mock/mock'
const { paientInfo, savePaientInfo } = toRefs(usePaientInfo())
onMounted(() => {
  fetchData()
})

function initPieChart(obj: any) {
  let echartItem = document.querySelector(`#pieSuger`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }

  let arr: any = []
  if (Object.keys(obj).length > 0) {
    arr = JSON.parse(
      JSON.stringify([obj.diabetes_low_per, obj.diabetes_normal_per, obj.diabetes_high_per]),
    )
    arr = arr.map((item: any) => Number(item))
  }
  pieSugerOptions.series[0]!.data = arr
  pieSugerOptions.series[0]!.label.formatter = (e: tooltipType<number>) => {
    if (e.dataIndex == 0) {
      return `血糖偏低占比 ${arr[0]}%`
    } else if (e.dataIndex == 1) {
      return `血糖正常占比 ${arr[1]}%`
    } else {
      return `血糖偏高占比 ${arr[2]}%`
    }
  }

  let _echarts = echarts.init(echartItem)

  _echarts.setOption(pieSugerOptions)
}

function initChart(obj: any) {
  let echartItem = document.querySelector(`#chartAvg`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  let _arr: any = []
  let _values: any = []
  if (typeof obj === 'object' && Object.keys(obj || {}).length > 0) {
    Object.keys(obj)
      .sort()
      .forEach((item: any) => {
        _arr.push(item)
        _values.push(Number(obj[item]))
      })
  }
  sugerOptions.xAxis.data = _arr
  sugerOptions.series[0]!.data = _values

  let _echarts = echarts.init(echartItem)
  sugerOptions.tooltip.formatter = (params: any) => {
    const categoryIndex = params[0].dataIndex
    const category = sugerOptions.series[0]!.data[categoryIndex]
    // 构建tooltip内容
    let html = `<div style="font-size: 14px; font-weight: bold;color: #636676;padding:12px;">
  ${params?.[0].axisValue}
            </div>`
    params.forEach((param: any) => {
      const value = param.value || 0
      html += `
                <div style="display: flex; justify-content:center; align-items: center;padding-left:12px;padding-bottom:12px;line-height: 14px;">
                    <span style="font-weight: bold; color: #333;font-size: 14px;">${value}mmol/L</span>
                </div>`
    })

    return html
  }
  _echarts.setOption(sugerOptions)

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    _echarts.resize()
  })
}

function initChartSeven(_obj: any) {
  let echartItem = document.querySelector(`#chartAvgseven`) as HTMLElement
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  let _arr: any = []
  let _values: any = [];
  let _values1: any = [];
  let _values2: any = [];
  let _values3: any = [];
  let _values4: any = [];
  let obj = _obj?.avg || {};
  let obj1 = _obj?.percen_10 || {};
  let obj2 = _obj?.percen_90 || {};
  let obj3 = _obj?.percen_25 || {};
  let obj4 = _obj?.percen_75 || {};
  if (typeof obj === 'object' && Object.keys(obj || {}).length > 0) {
    Object.keys(obj)
      .sort()
      .forEach((item: any) => {
        _arr.push(item)
        _values.push(Number(obj[item]))
      })
  }
  if (typeof obj1 === 'object' && Object.keys(obj1 || {}).length > 0) {
    Object.keys(obj1)
      .sort()
      .forEach((item: any) => {
        _values1.push(Number(obj1[item]))
      })
      
  }
   if (typeof obj2 === 'object' && Object.keys(obj2 || {}).length > 0) {
    Object.keys(obj2)
      .sort()
      .forEach((item: any) => {
        _values2.push(Number(obj2[item]))
      })
  }
   if (typeof obj3 === 'object' && Object.keys(obj3 || {}).length > 0) {
 
    Object.keys(obj3)
      .sort()
      .forEach((item: any) => {
        _values3.push(Number(obj3[item]))
        
      })
  }

   if (typeof obj4 === 'object' && Object.keys(obj4 || {}).length > 0) {
    Object.keys(obj4)
      .sort()
      .forEach((item: any) => {
        _values4.push(Number(obj4[item]))
      })
  }
  sugerOptionseven.xAxis.data = _arr
  sugerOptionseven.series[0]!.data = _values;


   sugerOptionseven.series[3]!.data =  _values1  
  sugerOptionseven.series[4]!.data = _values2.map((value:any, index:any) =>value - _values1[index])  // 90
  sugerOptionseven.series[5]!.data = _values3  
  sugerOptionseven.series[6]!.data = _values4.map((value:any, index:any) =>value - _values3[index])  // 90  // 75


   
    // Object.keys(obj2)
    //   .sort()
    //   .forEach((item: any) => {
    //     _values2.push(Number(obj2[item]))
    //      sugerOptionseven.series[4]!.markArea!.data.push([
    //       {
    //          xAxis: item,
    //         yAxis: Number(obj2[item])
           
    //       },{
    //         xAxis: item,
    //         yAxis: Number(obj1[item])
            
    //       }
    //      ])
    //     })




  

  let _echarts = echarts.init(echartItem)

  sugerOptionseven.tooltip.formatter = (_params: any) => {
    let params = _params.slice(0,1);
    // 构建tooltip内容
    let html = `<div style="font-size: 14px; font-weight: bold;color: #636676;padding:12px;">
                ${params?.[0].axisValue}
            </div>`
    params.forEach((param: any) => {
      const value = param.value || 0
      html += `
                <div style="display: flex; justify-content:center; align-items: center;padding-left:12px;padding-bottom:12px;line-height: 14px;">
                    <span style="font-weight: bold; color: #333;font-size: 14px;padding-right:8px;">${value}mmol/L</span>
                </div>`
    })

    return html
  }
  // let min = Math.min(..._values)
  // let max = Math.max(..._values)
  // sugerOptionseven.series[2]!.markArea!.data = [[{ yAxis: min }, { yAxis: max }]]


  _echarts.setOption(sugerOptionseven)

    const xlastPoint = _arr[_arr.length - 1];
    const ylastPoint = _values[_values.length - 1];
const lastPointCoord = _echarts.convertToPixel({seriesIndex: 0}, [xlastPoint,ylastPoint]);
let graphic = [{
        type: 'text',
        left: lastPointCoord[0]! + 10, // 在最后一个点右边20像素
        top: lastPointCoord[1],
        style: {
            text: `中位数`,
            fill: '#0477E0',
            fontSize: getRem(16)
        },
        z: 100
    }]
     _echarts.setOption({
        graphic
     })
 

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    _echarts.resize()
  })
}

const getColor = (type: string, color?: string) => {
  if (type === 'low') {
    return '#F08B2E'
  }
  if (type === 'high') {
    return '#F04A4B'
  }
  return color ? color : '#384951'
}

//
let isStart = ref(false);
const initSevenCate = async (draw_diabetes_analysis_pic: any) => {
  isStart.value = false;
  let echartItem = document.querySelector(`#chartTrend`) as HTMLElement
 
  if (echarts.getInstanceByDom(echartItem)) {
    echarts.dispose(echartItem)
  }
  sugerAgeRangeOption.series = []
  // let _xarr: any = []
  // let _values: any = [];
  // let times: any = [];
  if (
    typeof draw_diabetes_analysis_pic === 'object' &&
    Object.keys(draw_diabetes_analysis_pic || {}).length > 0
  ) {
    // 1. 数据转换：日期 vs. 小时
    const days = Object.keys(draw_diabetes_analysis_pic) // ['12/18', '12/19', ...]
    const times: any[] = []
    const firstDay = Object.keys(draw_diabetes_analysis_pic[days[0]!]) //"2025/12/20 16:00:00"[]
    if (firstDay.length > 0) {
      firstDay.forEach((timeStr) => {
        times.push(timeStr?.split(' ')[1]!.substring(0, 5)) // "16:00"[]
      })
    }
    
    days.forEach((day, dayIdx) => {
      const dayData = draw_diabetes_analysis_pic[day] // { "2025/12/20 16:00:00": [6.2, "low"], ... }
      let _firstDay = Object.keys(dayData)
      let heatmapData: any[] = []
      _firstDay.forEach((timeKey: any, timeIdx) => {
        const value = dayData[timeKey][0] // 血糖值
        // debugger;
        const category = dayData[timeKey][1] // low/normal/high
        let timeIdxend = _firstDay.length - 1
        let date = timeKey?.split(' ')[0]!.substring(0, 10)
        heatmapData.push([
          timeIdx,
          dayIdx,
          value,
          category, // 额外信息
          timeIdxend, // x轴结束索引
          date,
        ])
      })
      sugerAgeRangeOption.series.push({
        type: 'custom',
       renderItem: function (params: any, api: any) {
         // 检查是否是交互触发的重绘
          const value = api.value(2); // 获取血糖值
          if (!value) {
              return;
          }

          // 获取当前数据点的坐标
          const point = api.coord([api.value(0), api.value(1)]);
          // 获取下一个数据点的坐标（如果存在）
          const nextPoint = api.value(0) < _firstDay.length - 1  ? api.coord([api.value(0) + 1, api.value(1)]) : [params.coordSys.x + params.coordSys.width, point[1]]; // 最后一个点延伸到右边界

          let height = api.size([0, 1])[1] * 0.6;
          let rectShape = echarts.graphic.clipRectByRect(
              {
                  x: point[0], // 使用数据点的实际x坐标
                  y: point[1] - height / 2,
                  width: nextPoint[0] - point[0], // 计算到下一个点的距离
                  height: height,
              },
              {
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height,
              }
          );

          return rectShape && {
              type: 'rect',
              shape: rectShape,
               silent: true, 
              style: api.style({ fill: '#D2E9FA' }),
            // 禁用拾取
              // ignore: true,
              // 禁用渐进式渲染
               tooltipDisabled: true,
               emphasisDisabled:true,
               emphasis: {
                style: {
                  fill:"red"
                }
               }
          };
      },
        data: heatmapData,
        markPoint: {
          animation: false,
          z: 110,
          show: false,
          symbolSize: 10,
          itemStyle: {
            color: 'red',
          },
          data: [],
        },
        
          animation: false,
        silent: true,
            hoverLayerThreshold: 0,
        emphasis: {
            disabled: true,
            scale: false,
            focus: 'none'
        }
      })
    })

    sugerAgeRangeOption.xAxis.data = times
    sugerAgeRangeOption.yAxis.data = days

    sugerAgeRangeOption.tooltip!.formatter = function (params) {
      let date = params[0].name
      let h = ''
      if (Array.isArray(params)) {
        params.forEach((item: any) => {
          h += `<div style="margin-bottom:5px">
                       <span style="margin-right:20px;font-size:16px;">${item.data[5]}</span>
                       <span style="color:${getColor(item.data[3])};font-size:16px;">${item.data[2]}mmol/L</span>
                  </div>`
        })
      }

      let html = `<div style="padding:10px;background-color#fff;">
         <div style="color:#384951;font-size:14px;margin-bottom:5px">${date}</div>
        ${h}
         </div>`
      return html
    }
  }
  let _echarts = echarts.init(echartItem)
  _echarts.setOption(sugerAgeRangeOption)
   isStart.value = true;

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    _echarts.resize()
  })
  // 监听事件动态更新圆点位置
  _echarts.on('updateAxisPointer', function (params: any) {
    if (params.dataIndex || params.dataIndex === 0) {
      for (let i = 0; i < sugerAgeRangeOption.series.length; i++) {
        const element = sugerAgeRangeOption.series[i]
        element.markPoint.data = [
          {
            name: '最大值',
            symbol: 'circle',
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              color: getColor(element.data[params.dataIndex][3], '#24B287'),
            },
            coord: [params.dataIndex, element.data[params.dataIndex][1]],
          },
        ]
      }
    } else {
      for (let i = 0; i < sugerAgeRangeOption.series.length; i++) {
        const element = sugerAgeRangeOption.series[i]
        element.markPoint.data = []
      }
    }
    _echarts.setOption(sugerAgeRangeOption)
  })
}

const nums = ref<any[]>([])
const nums2 = ref<any[]>([])
function getData(obj: any) {
  // today_diabetes_per_hour_avg_text
  if (typeof obj === 'object' && Object.keys(obj || {}).length > 0) {
    // nums.value
    nums.value = Object.keys(obj).map((item: any) => {
      return {
        timeStamp: new Date(item).getTime(),
        time: dateFtt('hh:MM', item),
        value: obj[item],
      }
    })
  }
}
function getData2(obj: any) {
  if (typeof obj === 'object' && Object.keys(obj || {}).length > 0) {
    // nums.value
    nums2.value = Object.keys(obj).map((item: any) => {
      return {
        timeStamp: new Date(item).getTime(),
        time: item,
        value: obj[item],
      }
    })
  }
  //   nums2
}
const date = ref(dateFtt('yyyy-mm-dd', new Date()))
const sumTime = computed(()=>{
    let d = dateFtt("yyyymmdd", new Date());
    if( dateFtt('yyyymmdd', date.value) === d){
        return dateFtt('mm/dd hh:MM', new Date().setHours(0, 0, 0, 0)) + '-' + dateFtt('mm/dd hh:MM', new Date())
    }else{
      // 
       return dateFtt('mm/dd hh:MM', new Date(date.value).setHours(0, 0, 0, 0)) + '-' + dateFtt('mm/dd hh:MM', new Date(new Date(date.value).setDate(new Date(date.value).getDate() + 1)).setHours(0, 0, 0, 0))
    }
})
function selectDate(e: string) {
  fetchData()
}

const info = ref<any>({})
const emptyData = ref(true)
const fetchData = async () => {
  try {
    // let res:any=mockDataPerson;
    let res: any = await SportApi.getdiabetes_report({
      patient_id: paientInfo.value.id,
      date: dateFtt('yyyymmdd', date.value),
      md5: Md5.hashStr(String(paientInfo.value.id)) + 'xoJWeO24ZLU3xibLDv8aGaqN4M33Ee',
    }) || {};
   
    if (res.data && res.data.state === 200) {
      emptyData.value = false
      nextTick(() => {
        info.value = res.data || {}
        getData(info.value?.today_info?.today_diabetes_per_hour_avg_text || {})
        getData2(info.value?.week_diabetes_trend_info?.week_diabetes_trend_analysis_pic?.avg || {})
        initChart(info.value?.today_info?.today_diabetes_text || {})
        initChartSeven(
          info.value?.week_diabetes_trend_info?.week_diabetes_trend_analysis_pic || {},
        )
        initPieChart(info.value?.today_info)
        initSevenCate(info.value?.week_diabetes_trend_info?.draw_diabetes_analysis_pic || {})
      })
      // chartAvgseven
    } else {
      emptyData.value = true
    }
  } catch (error) {
    emptyData.value = true
  }
}
</script>
<style scoped>
.sectionTop {
  width: 1879px;
}

.borderRight {
  border-right: 1px solid #eeeeee;
}

.borderbox {
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #eeeeee;
  border-bottom: none;
  background: #ffffff;
}
.borderbottom {
  border-bottom: 1px solid #eeeeee;
}

.grid-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  grid-template-rows: repeat(2, 80px);
}

.borderRadius {
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #eeeeee;
}
.sugernw {
  background: #ffffff;
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #eeeeee;
}

.charts-box {
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #eeeeee;
  height: 285px;
}

.topSuger {
  width: 612px;
  height: 270px;
  background: #ffffff;
  box-shadow: 0px 8px 24px 0px rgba(146, 159, 175, 0.16);
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #eeeeee;
  padding: 16px;
}

.left-aside {
  width: 1248px;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 8px 24px 0px rgba(146, 159, 175, 0.16);
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #eeeeee;
  padding: 16px;
  .avg {
    width: fit-content;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #eeeeee;
    font-family:
      Alibaba PuHuiTi 3,
      Alibaba PuHuiTi 30;
    font-weight: normal;
    font-size: 14px;
    color: #636676;
    font-style: normal;
    text-transform: none;
    padding: 8px 12px;
    margin-top: 10px;
    border: 1px solid #eeeeee;
  }
  .dot {
    display: block;
    width: 12px;
    height: 12px;
  }
  .left-aside-title {
    height: 18px;
    font-family:
      Alibaba PuHuiTi 3,
      Alibaba PuHuiTi 30;
    font-weight: bold;
    font-size: 18px;
    color: #384951;
    line-height: 18px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    .subtilte {
      height: 14px;
      font-family:
        Alibaba PuHuiTi 3,
        Alibaba PuHuiTi 30;
      font-weight: normal;
      font-size: 14px;
      color: #929faf;
      line-height: 14px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .dataNums {
    position: relative;
    margin: 17px 53px;
    width: 1084px;
    .unit {
      position: absolute;
      left: -53px;
      bottom: 0;
    }
    .items {
      flex: 1;
      flex-shrink: 0;
    }
  }
}
.right-aside {
  width: 612px;
  height: 100%;
}

/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; /* 可根据需要调整宽度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #24b287;
  border-radius: 4px;
  min-height: 10px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #24b287;
}
</style>
