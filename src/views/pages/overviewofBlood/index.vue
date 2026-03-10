<template>
        <div class="sport_container">
            <div class="flex_space_between gap-20px h-427px">
                <div class="top_box_1 bg_content" v-loading="zoneSportLoading">
                    <div class="box_title line-height-18px flex justify-between">
                        <span class="color-[#384951] text-18px font-bold">病区血糖统计</span>
                        <span class="color-[#929FAF] text-14px">数据统计时间：{{  getLast24HoursRange()  }}</span>
                    </div>
                    <div class="flex justify-end gap-10px mt-20px">
                        <!-- <div class="color-[#636676] text-14px mr-auto">单位：mmol/L</div> -->
                        <div class="legend_item">
                            <div class="w-12px h-12px bg-[#24B287] mr-8px"></div>
                            <div class="color-[#636676] text-14px">病区普通患者</div>
                        </div>
                        <div class="legend_item">
                            <div class="w-12px h-12px bg-[#FF7D01] mr-8px"></div>
                            <div  class="color-[#636676] text-14px">病区糖尿病患者</div>
                        </div>
                    </div>
                    <div class="sport_age_range_chart" id="sport_age_range_chart">

                    </div>
                    <!-- <div class="sport_age_range_chart" v-else>
                        <div class="today_nodata">
                            <img src="@/assets/images/nodata.png" />
                            <div>病区今日暂无数据~</div>
                        </div>
                    </div> -->
                </div>
                <div class="top_box_2 bg_content" v-loading="zoneSportLoading">
                    <div class="box_title font-bold">病区今日血糖占比</div>
                    <div class="percent_chart" id="percent_chart" v-if="!zoneSportNodata"></div>
                    <div class="w-250px h-250px rounded-50% bg-[#F5F7FB] flex justify-center items-center m-[30px_auto]" v-else>
                        <div class="w-180px h-180px rounded-50% bg-[#ffffff]">
                           
                        </div>
                    </div>
                </div>
                <div class="top_box_3" v-loading="zoneSportLoading">
                    <div v-if="(highperson.length > 0 || lowperson.length > 0)">
                           <div class="tits line-height-18px flex justify-between gap-x-20px mb-20px">
                               <div class="color-[#384951] text-[18px] font-bold flex-1 textAlign-left">
                                  <div class="mb-20px">血糖偏高</div>
                                     <div class="gridbox h-310px overflow-auto">
                                        <div class="bg-[#FBFCFF] line-height-20px flex h-62px justify-center items-center pl-12px pr-12px" v-for="(value,index) in highperson" :key="index">
                                            <div class="color-[#636676] text-[14px] truncate m-w-100px">{{ value.bed_id || "--"}}</div>
                                                <div class="color-[#636676] text-[14px] ml-12px mr-12px flex-shrink-0">{{ maskName(value.name)   }}</div>
                                                <div class='w-20px h-20px text-[12px] color-[#F08B2E] mr-auto bg-[#FFF5EA] rounded-8px flex items-center justify-center' v-if="value.diabetes_flag==1">糖</div>
                                                <div class="color-[#384951] text-[15px] font-bold mr-5px">{{value.diabetes_avg || "--"}}</div>
                                                <div class="color-[#929FAF] text-[14px]">mmol/L</div>
                                        </div>
                                    </div>
                               </div>
                               <div  class="color-[#384951] text-[18px] font-bold flex-1 textAlign-left">
                                   <div class="mb-20px">血糖偏低</div>
                                   <div class="gridbox h-310px overflow-auto">
                                        <div class="bg-[#FBFCFF] line-height-20px flex h-62px justify-center items-center pl-12px pr-12px" v-for="(value,index) in lowperson" :key="index">
                                             <div class="color-[#636676] text-[14px] truncate m-w-100px">{{ value.bed_id || "--"}}</div>
                                                <div class="color-[#636676] text-[14px] ml-12px mr-12px flex-shrink-0">{{ maskName(value.name)   }}</div>
                                                <div class='w-20px h-20px text-[12px] color-[#F08B2E] mr-auto bg-[#FFF5EA] rounded-8px flex items-center justify-center' v-if="value.diabetes_flag==1">糖</div>
                                                <div class="color-[#384951] text-[15px] font-bold mr-5px">{{value.diabetes_avg || "--"}}</div>
                                                <div class="color-[#929FAF] text-[14px]">mmol/L</div>
                                        </div>
                                    </div>
                               </div>
                           </div>

                        

                           <div class="flex line-height-14px mt-20px items-center justify-start">
                               <div class="w-72px h-22px bg-[#F08B2E] tag color-[#FFFFFF] text-14px flex items-center justify-center">血糖阈值</div>
                               <div class="color-[#636676] text-[14px] ml-12px mr-12px flex-shrink-0">非糖尿病血糖阈值：3.9~10mmol/L；糖尿病血糖阈值：4.4~11.1mmol/L。</div>
                           </div>

                    </div>
                   <div v-else>
                           <div class="tits line-height-18px flex justify-between gap-x-20px mb-20px">
                               <div class="color-[#384951] text-[18px] font-bold flex-1 textAlign-left">
                                  <div class="mb-20px">血糖偏高</div>
                                     <div class=" h-310px flex items-center justify-center color-[#929FAF] text-[14px] bg-[#F5F7FB] font-500">
                                         暂无数据
                                    </div>
                               </div>
                               <div  class="color-[#384951] text-[18px] font-bold flex-1 textAlign-left">
                                   <div class="mb-20px">血糖偏低</div>
                                   <div class=" h-310px  flex items-center justify-center color-[#929FAF] text-[14px] bg-[#F5F7FB] font-500">
                                       暂无数据
                                    </div>
                               </div>
                           </div>
                           <div class="flex line-height-14px mt-20px items-center justify-start">
                               <div class="w-72px h-22px bg-[#F08B2E] tag color-[#FFFFFF] text-14px flex items-center justify-center">血糖阈值</div>
                               <div class="color-[#636676] text-[14px] ml-12px mr-12px flex-shrink-0">非糖尿病血糖阈值：3.9~10mmol/L；糖尿病血糖阈值：4.4~11.1mmol/L。</div>
                           </div>
                    </div>
                </div>
            </div>
            <div class="bg_content wbkitscroll" v-loading="tableLoadingFirst">
                    <div class="flex justify-between items-center mb-20px">
                          <span class="color-[#384951] text-[18px] font-bold">病区患者血糖情况</span>
                          <span class="color-[#929FAF] text-[14px]">数据统计时间：{{ getLast24HoursRange() }}</span>
                    </div>
                    <div v-if="tableData.length">
                        <div class="patient_list" v-loading="tableLoading">
                            <div class="patient_item" v-for="(item,index) in tableData" :key="index">
                                <div class="flex justify-between items-center h-40px bg-[#F5F7FB] pr-20px">
                                    <div class="color-[#FFFFFF] w-40px h-40px bg-[#F08B2E] rounded-[12px_0px_12px_0px] flex items-center justify-center" v-if="item.diabetes_flag==1">
                                         糖
                                    </div>
                                    <div class="color-[#929FAF] text-[15px] ml-auto">
                                       末次采集时间：{{ item.now_diabetes_time || "--" }}
                                    </div>
                                </div>
                                <div class="activity_data_content">
                                    <div class="flex p-20px items-end">
                                          <div class="color-[#384951] text-[24px] font-bold mr-10px">{{ item.bed_id	|| "--" }}</div>
                                          <div class="color-[#384951] text-[24px] font-bold mr-auto">{{ maskName(item.name) }}</div>
                                          <div class="color-[#384951] text-[24px] font-bold">
                                             {{ item.now_diabetes	|| "--" }}
                                          </div>
                                          <div class="color-[#929FAF] text-[15px] font-bold line-height-24px">
                                             mmol/L
                                          </div>
                                    </div>

                                    <div class="w-445px h-140px" :id="'chart'+index">
                                                
                                    </div>

                                        <div class="line-height-30px bg-[#F5F7FB] h-30px ml-20px mr-20px flex items-center justify-start pl-10px pr-10px">
                                            <span class="text-[14px] color-[#636676] mr-auto">今日平均葡萄糖</span>
                                                <span class="text-[14px] color-[#636676]">{{ item.avg|| "--" }}</span>
                                                <span class="text-[14px] color-[#929FAF]">mmol/L</span>
                                            
                                        </div>
                                        <div class="line-height-30px mb-20px bg-[#F5F7FB] h-30px mt-3px ml-20px mr-20px flex items-center justify-start pl-10px pr-10px">
                                             <span class="text-[14px] color-[#636676]  mr-auto">昨日LAGE</span>
                                            <span class="text-[14px] color-[#636676]">{{ item.LAGE|| "--"}}</span>
                                            <span class="text-[14px] color-[#929FAF]">mmol/L</span>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="height: 80%;" v-else>
                        <div class="today_nodata">
                            <img src="@/assets/images/nodata.png" />
                            <div>暂无患者数据~</div>
                        </div>
                    </div>
     </div>

    </div>
</template>

<script setup lang='ts'>
import SportApi from '@/api/sport';
import { getCookie } from '@/utils/cookie/cookie';
import { dateFtt, getAllDate } from '@/utils/date/dateFtt';
import echarts from '@/utils/echarts/echarts';
import { hrOptions, sportAgeRangeOption, sportOpitons, sportPercentChartOption,sugerOptions } from './options.ts';
import { Md5 } from 'ts-md5';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
const admin = JSON.parse(getCookie('admin') as string);
import { useRouter } from 'vue-router';
const router = useRouter();
import { getRem ,maskName} from "@/utils/function/function";
import { suger } from '@/mock/mock';
import  {getLast24HoursRange ,setLowHighText} from '@/utils/function/function';

// 病区运动统计
const zoneSportLoading = ref(false)
const zoneSportNodata = ref(true)
const zoneSportData = ref<any>({})
    const highperson = ref<any>([]);
    const lowperson = ref<any>([]);
const fetchZoneSportData = async () => {
    zoneSportLoading.value = true
    let data = {
        date: dateFtt('yyyymmdd', new Date()),
        zone_number:  admin.zone_number
    }
    tableLoadingFirst.value = true
    const res:any = await SportApi.gettotal_diabetes_report(data);
    let result = res.data;
            /// 测试
                    //  const res:any = suger;
                    // let result = res;
            /// 测试
    if (result) {
        if (result.state == 200) {
            zoneSportLoading.value = false
            zoneSportNodata.value = false 
            zoneSportData.value = result;
            if(Array.isArray(result?.diabetes_high_info_dic?.items)){
                highperson.value = result.diabetes_high_info_dic.items;
            }
            if(Array.isArray(result?.diabetes_low_info_dic?.items)){
                lowperson.value = result.diabetes_low_info_dic.items;
            }
             if(Array.isArray(result?.patient_diabetes_info_dic)){
                tableData.value = result.patient_diabetes_info_dic;
                await nextTick();
                setTableDataChart();
            }
            // patient_diabetes_info_dic
            await nextTick()
            setPercentChart(result)
            setSportAgeRangeChart(result);

            tableLoadingFirst.value = false
            // fetchData()
        } else {
             setSportAgeRangeChart({});
            // ElMessage.error(result.info)
            zoneSportNodata.value = true
            zoneSportLoading.value = false
             tableLoadingFirst.value = false
        }
    }
}


const HIGH_VALUE = 10; // 高血糖阈值
const LOW_VALUE = 3.9;  // 低血糖阈值
const setTableDataChart = () => {
    tableData.value.forEach((item, index) => {
        let chartDom = document.getElementById("chart" + index) as HTMLElement;
        if (echarts.getInstanceByDom(chartDom)) {
            echarts.dispose(chartDom)
        }
        let myChart = echarts.init(chartDom as HTMLElement);
        let option = Object.assign({}, sugerOptions);
        let _arr = ["00:00","04:00","08:00","12:00","16:00","20:00","00:00"];
        let _values = [];
        let _series = [];
        if(typeof item.line_pic === 'object' && Object.keys(item.line_pic).length>0){
           let _a = []
            for (let key in item.line_pic) {
                _a.push(dateFtt("hh:MM", new Date(key)));
                _values.push({
                    value: item.line_pic[key][0],
                    type: item.line_pic[key][1] 
                });
                 
            }
           _arr = JSON.parse(JSON.stringify(_a));
            const times = Object.keys(item.line_pic);
            const values = times.map(time => item.line_pic[time][0]);
            const statuses = times.map(time => item.line_pic[time][1]);
            const series = createSegmentedSeries(times, values, statuses);
            _series = JSON.parse(JSON.stringify(series));
        }
        option.xAxis!.data = _arr;
        option.series = [
            ..._series,
             {
                type: 'line',
                markArea: {
                    silent: true,
                    itemStyle: {
                    color: '#EAFFF9'
                    },
                    data: [[
                    {
                        yAxis: LOW_VALUE,
                        label: {
                        show: false,
                        position: 'insideTop',
                        // formatter: '',
                        color: '#666'
                        }
                    },
                    {
                        yAxis: HIGH_VALUE
                    }
                    ]]
                },
                data: []
            }
        ];
        option.graphic = [
                    // 右下角标注
                {
                type: 'text',
                id:"graphic1",
                zlevel:100,
                position:[10000,10000],
                style: {
                    text: `低: ${LOW_VALUE}`,
                    fill: '#384951',
                    fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
                    fontSize: getRem(12)
                }
                },{
                type: 'text',
                id:"graphic2",
                position:[10000,10000],
                 zlevel:100,
                style: {
                    text: `高: ${HIGH_VALUE}`,
                    fill: '#384951',
                    fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
                    fontSize: getRem(12)
                }
                }
                ];
        option && myChart.setOption(option);
        if(item.diabetes_flag==1){
                // 右上角标注
              nextTick(()=>{
                  setLowHighText(myChart,LOW_VALUE,HIGH_VALUE,[getRem(40),0])
              })
        }
        
    });
}
// echarts
const setSportAgeRangeChart = (data: any) => {
    let chartDom = document.getElementById("sport_age_range_chart");
    if (chartDom != null) {
        echarts.dispose(chartDom)
    }
    let myChart = echarts.init(chartDom);
    let option = Object.assign({}, sportAgeRangeOption);
    let op_d1 = {
         total:0,
         rank_1:0,
         rank_2:0,
         rank_3:0,
         rank_4:0,
         rank_5:0,
         rank_6:0,
         rank_7:0,
         rank_8:0
    }
    let op_d2 = {
         total:0,
         rank_1:0,
         rank_2:0,
         rank_3:0,
         rank_4:0,
         rank_5:0,
         rank_6:0,
         rank_7:0,
         rank_8:0
    }
    if(typeof data?.no_diabetes_bar_chart==='object' && Object.keys(data?.no_diabetes_bar_chart).length>0){
         op_d1 = JSON.parse(JSON.stringify(data.no_diabetes_bar_chart)); 
    }
    let data_1 = [op_d1.rank_1,op_d1.rank_2,op_d1.rank_3,op_d1.rank_4,op_d1.rank_5,op_d1.rank_6,op_d1.rank_7,op_d1.rank_8].reverse();
    if(typeof data?.diabetes_bar_chart==='object' && Object.keys(data?.diabetes_bar_chart).length>0){
         op_d2 = JSON.parse(JSON.stringify(data.diabetes_bar_chart)); 
    }

     let data_2 = [op_d2.rank_1,op_d2.rank_2,op_d2.rank_3,op_d2.rank_4,op_d2.rank_5,op_d2.rank_6,op_d2.rank_7,op_d2.rank_8].reverse();

    option.series[0]!.data = data_1;
    option.series[1]!.data = data_2;
    option && myChart.setOption(option);
}

const setPercentChart = (data: any) => {
    let chartDom = document.getElementById("percent_chart");
    if (chartDom != null) {
        echarts.dispose(chartDom)
    }
    let myChart = echarts.init(chartDom);
    let option = Object.assign({}, sportPercentChartOption);
    option.series[0]!.data[0]!.value = data?.diabetes_pie_chart?.total_high_per || 0;
    option.series[0]!.data[1]!.value = data?.diabetes_pie_chart?.total_normal_per || 0;
    option.series[0]!.data[2]!.value = data?.diabetes_pie_chart?.total_low_per || 0;
       option.series[0]!.data[0]!.num = data?.diabetes_pie_chart?.total_high_cnt || 0;
    option.series[0]!.data[1]!.num = data?.diabetes_pie_chart?.total_normal_cnt || 0;
    option.series[0]!.data[2]!.num = data?.diabetes_pie_chart?.total_low_cnt || 0;
    option && myChart.setOption(option);
}

// 2. 颜色定义
const COLOR_HIGH = '#F04A4B';   // 红色表示 high
const COLOR_NORMAL = '#24B287'; // 绿色表示 normal
const COLOR_LOW = '#F08B2E'; // 黄色表示 low

// 3. 生成分段数据系列的函数
function createSegmentedSeries(times: string[], values: number[], statuses: string[]) {
  const series = [];
  let currentStatus = statuses[0];
  let segmentStart = 0;
  
  for (let i = 1; i <= statuses.length; i++) {
    // 当状态改变或到达末尾时，创建一个线段
    if (i === statuses.length || statuses[i] !== currentStatus) {
      const segmentData = new Array(times.length).fill(null);
      
      // 填充当前段的数据
      for (let j = segmentStart; j < i; j++) {
        segmentData[j] = values[j];
      }
      
      // 如果当前段不是第一个，需要包含前一段的最后一个点以确保连线
      if (segmentStart > 0) {
        segmentData[segmentStart - 1] = values[segmentStart - 1];
      }
      
      series.push({
        name: currentStatus === 'high' ? '高血糖' :  currentStatus === 'low' ? '低血糖' : '正常',
        type: 'line',
        symbol:"none",
        data: segmentData,
        lineStyle: {
          color: currentStatus === 'high' ? COLOR_HIGH : currentStatus === 'low' ? COLOR_LOW : COLOR_NORMAL,
          width: 2
        },
        showSymbol: false,
        connectNulls: false,
        smooth: true 

         
       
      });
      
      // 更新状态和起始位置
      if (i < statuses.length) {
        currentStatus = statuses[i];
        segmentStart = i;
      }
    }
  }
  
  return series;
}
// 患者运动列表
const tableLoading = ref(false)
const tableLoadingFirst = ref(false)
const tableData = ref<any[]>([])
 
 
 
 

// 患者历史运动报告详情
const patientItem = ref<any>({})

const patientSportReport = ref<any>({})

const patientSportReportShow = ref(false)
const patientSportReportLoading = ref(false)
const dialogSportNoData = ref(true)
const handlePatientSportDetail = (item: any) => {
    patientItem.value = item
    patientSportReportShow.value = true
    // fetchDetailData()
}
 
const selectDate = ref('')
const dateList = computed(() => {
    // dateFtt("hh:00", new Date(e.insert_time * 1000))
    let arr: any[] = []
    let start = new Date(dateFtt('yyyy/mm/dd 00:00:00', new Date(patientItem.value.start))).getTime()
    let end = (new Date().getTime())
    let weekList = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    getAllDate(start, end).reverse().forEach((item: any,index:number) => {
        if (index>365) {
            return
        }
        arr.push({
            label: `${dateFtt('yyyy年mm月dd日', item)} ${weekList[item.getDay()]}`,
            value: dateFtt('yyyy-mm-dd', item)
        })
    })
    if (arr.length) {
        selectDate.value = arr[0].value
    }
    return arr
})
watch(dateList, async (newval, oldval) => {
    await nextTick()
    if (dateList.value.length > 0) {
        fetchDetailData()
    }
})




const fetchDetailData = async () => {
    patientSportReportLoading.value = true
    let data = {
        // patient_id: 31,
        patient_id: patientItem.value.patient_id,
        date: selectDate.value.replace('-', '').replace('-', ''),
        md5: Md5.hashStr(String(patientItem.value.patient_id)) + "xoJWeO24ZLU3xibLDv8aGaqN4M33Ee"
        // md5: Md5.hashStr('31') + "xoJWeO24ZLU3xibLDv8aGaqN4M33Ee"
    }
    try {
        const result = (await SportApi.sportDataReport(data)).data
        if (result) {
            patientSportReportLoading.value = false
            if (result.state == 200) {
                dialogSportNoData.value = false
                patientSportReport.value = result
                let arr = <any[]>[]
                for (const key in patientSportReport.value.over_health_heartrate_times) {
                    if (Object.prototype.hasOwnProperty.call(patientSportReport.value.over_health_heartrate_times, key)) {
                        const element = patientSportReport.value.over_health_heartrate_times[key];
                        arr.push({
                            type: "高心率运动风险",
                            time: element
                        })
                    }
                }
                patientSportReport.value.over_health_heartrate_times = arr
                await nextTick()
                initSportChart(patientSportReport.value)
                initHrChart(patientSportReport.value)
            } else {
                dialogSportNoData.value = true
            }
        }
    } catch (error) {
        console.log(error);

        patientSportReportLoading.value = false
        dialogSportNoData.value = true
    }
}

// 绘制图表

const initSportChart = (data: any) => {
    let chartDom = document.getElementById("sport_chart");
    let myChart = echarts.init(chartDom);
    let option = Object.assign({}, sportOpitons);
    option.series[0]!.data[0]!.value = data.per_low_sport;
    option.series[0]!.data[1]!.value = data.per_mid_sport;
    option.series[0]!.data[2]!.value = data.per_high_sport;
    option.series[1]!.data[0]!.value = data.total_time;
    option && myChart.setOption(option);
}
const initHrChart = (data: any) => {
    let chartDom = document.getElementById("hr_chart");
    let myChart = echarts.init(chartDom);
    let option = Object.assign({}, hrOptions);
    
    let date = dateFtt("yyyy-mm-dd ", selectDate.value);

    let data_0 = [[new Date(date + "00:00:00").getTime(), '']],
        data_1 = [[new Date(date + "00:00:00").getTime(), '']];
    for (const key in data.T0_day_heartrate) {
        if (Object.hasOwnProperty.call(data.T0_day_heartrate, key)) {
            const element = data.T0_day_heartrate[key];
            data_0.push([new Date(date + key).getTime(), element]);
        }
    }
    for (const key in data.today_heartrate) {
        if (Object.hasOwnProperty.call(data.today_heartrate, key)) {
            const element = data.today_heartrate[key];
            data_1.push([new Date(date + key).getTime(), element]);
        }
    }
    
    data_0[data_0.length] = [new Date(date + "23:59:59").getTime() + 1000, ''];
    data_1[data_1.length] = [new Date(date + "23:59:59").getTime() + 1000, ''];
    option.series[0]!.data = data_0;
    option.series[1]!.data = data_1;

    option && myChart.setOption(option);
}

onMounted(() => {
    fetchZoneSportData();
})
</script>

<style scoped>


.sport_container {
    padding: 24px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
}

.tag{
    border-radius: 8px 8px 0px 8px;
}


.gridbox{
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(5, 62px);
    column-gap: 20px;

}
.bg_content {
    background-color: #fff;
    border-radius: 12px 12px 12px 12px;
    padding: 24px;
    overflow-x: auto;
    overflow-y: hidden;
}

    /* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; /* 可根据需要调整宽度 */
  height:4px;
  background: #BDCBD1;
  margin-left: 10px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #BDCBD1;
  border-radius: 8px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #24B287;
  border-radius: 4px;
  min-height: 40px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #24B287;
}

.top_box_1 {
    width: 33.3333%;
    height: 100%;
    box-sizing: border-box;
}

.top_box_2 {
    width: 33.3333%;
    height: 100%;
    box-sizing: border-box;
}

.top_box_3 {
    width: 33.3333%;
    height: 100%;
    padding: 24px;
     box-sizing: border-box;
     overflow: hidden;
     border-radius: 12px;
     background-color: #fff;
}


.box_title {
    font-family: 'Source Han Sans CN-Bold';
    font-size: 18px;
    color: #384951;
    position: relative;
}

.legend {
    height: 14px;
    font-size: 14px;
    line-height: 14px;
    color: #636676;
    margin-top: 20px;
}

.legend>div {
    width: 32%;
}

.legend_item {
    display: flex;
    justify-content: center;
    align-items: center;
}

.legend_icon {
    width: 8px;
    height: 8px;
    margin-right: 8px
}

.legend .legend_item:nth-child(1) .legend_icon {
    background-color: #145EFF;
}

.legend .legend_item:nth-child(2) .legend_icon {
    background-color: #24B287;
}

.legend .legend_item:nth-child(3) .legend_icon {
    background-color: #FF7D01;
}

.sport_age_range_chart {
    width: 100%;
    height: calc(100% - 40px);
}

.percent_chart {
    width: 100%;
    height: calc(100% - 74px);
    margin-top: 30px;
}

.sport_box_bottom_title {
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    font-family: 'Source Han Sans CN-Bold';
    font-weight: bold;
    color: #384951;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
}
.mb_12 {
    margin-bottom: 12px;
}
.mb_0 {
    margin-bottom: 0;
}
.sport_box_bottom_title img {
    height: 24px;
    width: auto;
    margin-right: 8px;
}

.rank_list {
    width: 100%;
    height: calc((100% - 72px - 24px) / 2);
}

.mb_24 {
    margin-bottom: 24px;
}


.rank_item {
    height: 20%;
    width: 100%;
    padding: 0 24px;
    color: #636676;
    font-size: 12px;
}

.rank_item:nth-child(2n) {
    background-color: #F5F7FB;
}

.rank_item:nth-child(2n-1) {
    background-color: #FBFCFF;
}

.bed_number {
    margin-right: 10px;
    font-size: 13px;
    font-family: 'Alibaba PuHuiTi 3.0-55 Regular L3';
}

.num {
    font-weight: bold;
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
    margin-right: 4px;
    font-size: 13px;
    color: #384951;
}

.box_title_bottom {
    height: 20px;
    padding-top: 0px;
    margin-bottom: 32px;
}

.box_title_bottom::before {
    top: 0;
}

.scroll_tab_item {
    cursor: pointer;
    width: 104px;
    height: 44px;
    background: #F5F7FB;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #EEEEEE;
    flex-shrink: 0;
    margin-right: 12px;
    font-size: 20px;
    color: #636676;
    line-height: 44px;
    text-align: center;
    font-family: 'Alibaba PuHuiTi 3.0-55 Regular';
}

.active_tab_item {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold' !important;
    background-color: #24B287;
    color: #fff;
}

.scroll_tab {
    height: 44px;
    width: 100%;
    margin-bottom: 24px;
}

.patient_list {
       display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: 20px;
}

.patient_item {
    /* width: 244px; */
    /* height: 310px; */
    border-radius: 12px 12px 12px 12px;
    border: 1px solid #EEEEEE;

}
 
.patient_title {
    height: 70px;
    border-bottom: 1px solid #EEEEEE;
    font-size: 22px;
}

.patient_item_bed_number {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
}

.activity_data_content {
    font-size: 14px;
    color: #929FAF;
}

.data_value {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
    font-size: 32px;
    font-weight: bold;
    color: #384951;
}

.report_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #24B287;
    width: 148px;
    height: 36px;
    background: #E6FDED;
    border-radius: 8px 8px 8px 8px;
    cursor: pointer;
}

.report_btn img {
    width: 24px;
}



 
/* 患者历史运动报告 */
.patient_report_dialog {
    position: absolute;
    left: 0%;
    top: 0;
    width: 100%;
    height: 100% !important;
    background-color: #F5F7FB;
}

.patient_report_title {
    width: 100%;
    height: 86px;
    padding: 0 24px;
    font-size: 24px;
    color: #24B287;
    background-color: #fff;
}

.patient_report_title img {
    width: 48px;
}

.mr_12 {
    margin-right: 12px;
}

.report_content {
    height: calc(100% - 86px);
    width: 100%;
    padding: 24px;
}

._bg {
    background-color: #fff;
    border-radius: 12px;
    width: 100%;
    height: 100%;
    padding: 0 24px 24px;
}

.content_top {
    height: 96px;
    width: 100%;
    border-bottom: 1px solid #EEEEEE;
    margin-bottom: 24px;
}

.select_width {
    width: 400px;
}

.date_icon {
    height: 28px;
}

.tips_time {
    font-size: 16px;
    color: #636676;
}

.content_height {
    height: calc(100% - 120px)
}

.left_box {
    width: 604px;
    height: 100%;
    background: #F5F7FB;
    border-radius: 12px 12px 12px 12px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.left_box>div {
    background-color: #fff;
    width: 100%;
    padding: 24px;
}

.left_box>div:first-child {
    height: calc(53% - 6px)
}

.left_box>div:last-child {
    height: calc(47% - 6px)
}

.content_title {
    font-family: 'Source Han Sans CN-Bold';
    color: #384951;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    height: 20px;
    padding-left: 11px;
    position: relative;
}

.content_title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 20px;
    background-color: #24B287;
}

.content_chart_box {
    height: calc(100% - 20px);
    width: 100%;
}

#sport_chart {
    width: 60%;
    height: 100%;
    padding-top: 20px;
    /* background-color: #24B287; */
}

.legend_sport {
    width: 120px;
}

.legend_sport .square {
    width: 8px;
    height: 8px
}

.legend_sport .legend_item_sport:nth-child(1) .square {
    background-color: #24B287;
}

.legend_sport .legend_item_sport:nth-child(2) .square {
    background-color: #08DBF8;
}

.legend_sport .legend_item_sport:nth-child(3) .square {
    background-color: #145EFF;
}

.legend_item_sport div:nth-child(2) {
    font-size: 14px;
    font-family: "Source Han Sans CN-Bold";
    font-weight: bold;
    color: #636676;
}

.legend_item_sport div:nth-child(3) {
    font-size: 20px;
    font-family: "Alibaba PuHuiTi 3.0-85 Bold";
    font-weight: bold;
    color: #384951;
    width: 46px;
    text-align: right;
}

.sport_data_box {
    width: 161px;
    height: 100%;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 58px 0;
    text-align: center;
}

.flex_space_between .sport_data_box:nth-child(1) {
    background-color: #E6FDED;
    color: #24B287;
}

.flex_space_between .sport_data_box:nth-child(2) {
    background-color: #FFECE6;
    color: #F7413D;
}

.flex_space_between .sport_data_box:nth-child(3) {
    background-color: #EAF4FF;
    color: #145EFF;
}

.sport_data_box img {
    width: 48px;
    margin: 0 auto;
    margin-bottom: 4px;

}

.data_num {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
    font-weight: bold;
    font-size: 32px;
    color: #384951;
}

.data_unit {
    font-family: 'Source Han Sans CN-Bold';
    font-weight: bold;
    font-size: 16px;
    color: #929FAF;
}

.data_category {
    font-size: 18px;
    font-family: "Source Han Sans CN-Bold";
    font-weight: bold;
}

.right_box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 896px;
}

.right_box>div {
    height: calc(50% - 6px);
    border: 1px solid #EEEEEE;
    border-radius: 12px 12px 12px 12px;
    padding: 24px;
}

.line {
    width: 12px;
    height: 3px;
    border-radius: 3px;
}

.line_1 {
    background-color: #07c160;
}

.line_2 {
    background-color: #929FAF;
    margin-left: 24px !important;
}

.legend_2 {
    font-size: 14px;
    color: #636676;
}

.legend_2 div {
    margin-left: 12px;
}

.line_chart {
    width: 100%;
    height: calc(100% - 20px);
    /* background-color: #24B287; */
}

.safe_hr {
    font-family: 'Source Han Sans CN-Bold';
    font-size: 14px;
    color: #636676;
}

.font_num {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
}

.warning_list {
    margin-top: 24px;
    height: calc(100% - 44px);
    width: 100%;
    border-left: 1px solid #EEEEEE;
    border-top: 1px solid #EEEEEE;
    border-bottom: 1px solid #EEEEEE;

}

.th_item {
    background-color: #F5F7FB !important;
    font-size: 16px !important;
    color: #384951 !important;
}

.tb_item {
    background-color: #fff;
    height: 36px;
    font-size: 14px;
    color: #636676;
    font-size: 14px;
    display: flex;
}

.tr_item {
    border-bottom: 1px solid #EEEEEE;
    border-right: 1px solid #EEEEEE;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center
}

.warning_list .tb_item:last-child .tr_item {
    border-bottom: none !important;
}

.slide-enter-active,
.slide-leave-active {

    transition: transform .6s;

}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(100%);
}

.today_nodata {
    font-size: 16px;
    color: #929faf;
    text-align: center;
    /* position: relative;
    top: 50%;
    transform: translateY(-50%); */
}

.today_nodata img {
    width: 240px;
    margin: 0 auto;
}
.activity_tips {
    color: #9a9a9a;
    font-size: 14px;;
}
</style>
