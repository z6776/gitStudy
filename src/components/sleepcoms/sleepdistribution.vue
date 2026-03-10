<template>
  <div class='w-full h-610px bg-#fff rounded-12px box-shadow border-[1px-solid-#eeeeee] p-[24px]'>
      <div class="text-[16px] color-[#384951] font-800 mb-24px">
          睡眠分布  
      </div>

      <div class="mb-20px mt-24px text-center h-22px" v-if="!empty">
          <span class="color-[#384951] text-[16px] font-850 mr-4px" v-if="showChartDataDetail">{{ sleepTypeText || "" }}</span>
          <span class="color-[#384951] text-[16px] font-850 mr-4px" v-if="!isNaN(detailData.duration) && showChartDataDetail">{{   (Number(detailData.duration) / 60).toFixed(0) }}分钟</span>
          <span class="color-[#384951] text-[16px] font-500 mr-4px" v-if="showChartDataDetail"> {{ detailData.start_time }}-{{ detailData.end_time }} </span>
      </div>

      <div v-if="empty" class="flex items-center justify-center color-[#636676] text-14px w-full h-481px bg-#F5F7FB">
          暂无睡眠数据~
   </div>
     
      <div id="sleepChart" v-else>
        
      </div>
        <div class="flex justify-between  ml-42px w-828px items-start mt-8px mb-22px" v-if="!empty">
            <div class="line-height-14px">
                <span class="color-[#929FAF] text-14px font-500 mr-4px">入睡</span>
                <span class="color-[#384951] text-15px font-800">{{props.sleepData?.in_sleep_time_info }}</span>
            </div>
            <div class="line-height-14px">
                <span class="color-[#929FAF] text-14px font-500 mr-4px">出睡</span>
                <span class="color-[#384951] text-15px font-800">{{  props.sleepData?.out_sleep_time_info  }}</span>
            </div>
        </div>
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
import * as echarts from 'echarts';
import { sleepOption } from "@/utils/baseOptions/sleepoptions";
import { dateFtt } from "@/utils/date/dateFtt";
import { computed,ref ,watch,nextTick} from "vue";
const props = defineProps({
    sleepData:{
        type:Object,
        default:{}
    },
    reportDate:{
        type:String,
        default:''
    }
});
const detailData = ref({
    duration:0,
    start_time:"",
    end_time:""
});
const sleepNoData = computed(() => {
    return Object.keys(props.sleepData).length === 0;
});

const   pointerIndex = ref(-1);
const showChartDataDetail= computed(()=>{
        let arr = [10,9,1,3];
            return pointerIndex.value != 144 && props.sleepData.sleep_text && arr.includes(props.sleepData.sleep_text[pointerIndex.value])
        })
watch(() => pointerIndex.value, (val) => {
       if (val == 144 || sleepNoData.value) {
                return
            }
            let sleep_val = props.sleepData.sleep_text[val]
            if (sleep_val == 10) {
                getDetailData(val, 'deep_sleep_interval_segment')
            } else if (sleep_val == 9) {
                getDetailData(val, 'mid_sleep_interval_segment')    
            } else if (sleep_val == 1) {
                getDetailData(val, 'light_sleep_interval_segment')
            } else if (sleep_val == 3) {
                getDetailData(val, 'day_sleep_interval_segment')
            }
},{immediate:true})
const  getDetailData=(index:number, key:string) => {
            detailData.value = {
                  duration:0,
                  start_time:"",
                  end_time:"" 
            }
            let _this = props;
            let object = _this.sleepData[key]
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    const element = object[key];            
                    if (index >= element.start_time_index && index <= element.end_time_index) {
                       detailData.value = element
                    }
                }
            }
 }

const sleepTypeText = computed(()=>{
     let typeList:Record<number,string> = {
                10: '深度睡眠',
                9: '中度睡眠',
                1: '轻度睡眠',
                3: '零星小睡或静息'
            };
         return typeList[props.sleepData.sleep_text[pointerIndex.value]];
});


const empty = ref(false);
 const initSleepChart = () => {
          let sleepChartEle:HTMLElement = document.getElementById('sleepChart') as HTMLElement;
           if(echarts.getInstanceByDom(sleepChartEle)){
               echarts.dispose(sleepChartEle);
           }
           pointerIndex.value = 0;
            let sleepChart = echarts.init(sleepChartEle);
                sleepChart.hideLoading();
                let xdata:any[] = [];
                let startTime = new Date();
                let orderTime = typeof props.reportDate==='string' ? new Date(props.reportDate)  : new Date();
                startTime = new Date(dateFtt('yyyy/mm/dd', new Date(startTime.setDate(orderTime.getDate() - 1))) + ' 21:00:00');
                let time = startTime.getTime();
                for (let i = 0; i <= props.sleepData.sleep_text.length; i++) {
                    xdata.push([time,1]);
                    time += 600000; // 10分钟间隔
                }
             
                let _this = props;

                sleepOption.series[0]!.data = sleepOption.series[1]!.data = sleepOption.series[2]!.data = sleepOption.series[3]!.data = xdata;
                 sleepOption.xAxis.axisPointer.show = true;
                //  
                sleepOption.series[0]!.itemStyle.color = (params:any) => {
                    let index = params.dataIndex,
                        color = 'transparent';
                    if (_this.sleepData.sleep_text[index] == 10) {
                        color = '#6377F5';
                    } else {
                        color = 'transparent';
                    }
                    return color;
                }
                sleepOption.series[1]!.itemStyle.color = (params:any) => {
                    let index = params.dataIndex,
                        color = 'transparent';
                    if (_this.sleepData.sleep_text[index] == 9) {
                        color = '#9E4AE3';
                    } else {
                        color = 'transparent';
                    }
                    return color;
                }
                sleepOption.series[2]!.itemStyle.color = (params:any) => {
                    let index = params.dataIndex,
                        color = 'transparent';
                    if (_this.sleepData.sleep_text[index] == 1) {
                        color = '#ED95F7';
                    } else {
                        color = 'transparent';
                    }
                    return color;
                }
                sleepOption.series[3]!.itemStyle.color = (params:any) => {
                    let index = params.dataIndex,
                        color = 'transparent';
                    if (_this.sleepData.sleep_text[index] == 3) {
                        color = '#80BAFA';
                    } else {
                        color = 'transparent';
                    }
                    return color;
                }
                sleepOption.tooltip.formatter = (params:any) => {
                    let index = params.dataIndex
                    pointerIndex.value = index
                    return '';
                }
                sleepChart.setOption(sleepOption);
        }

    watch(()=>props.sleepData,async (val)=>{
        // 是否有值
        if(Object.keys(val).length > 0){
                empty.value = false;
                await nextTick();
            initSleepChart()
        }else{
            empty.value = true;
        }
    },{immediate:true,deep:true})
</script>
<style scoped>
.box-shadow {
    box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16);
}
#sleepChart{
    height: 396px;
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

.chart_legend>div {
    margin-right: 24px;
    padding-left: 14px;
    position: relative;
}
 

.chart_legend>div::before {
    content: '';
    width: 10px;
    height: 10px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}
.chart_legend>div:nth-child(1)::before {
    background: #FFFFFF;
    border: 1px solid #636676;
}

.chart_legend>div:nth-child(2)::before {
    background: #6377F5;
}

.chart_legend>div:nth-child(3)::before {
    background: #9E4AE3;
}

.chart_legend>div:nth-child(4)::before {
    background: #ED95F7;
}

.chart_legend>div:nth-child(5)::before {
    background: #80BAFA;
}

.chart_legend>div:nth-child(5) {
    margin-right: 0;
}
</style>