<template>
    <div class="body_data">
        <div class="body_data_search_box flex_start">
            <div class="search_label">数据采集时间：</div>
            <el-select class="search_select" size="large" v-model="selectDate">
                <el-option v-for="(item, index) in dateList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
            <el-button type="success" size="large" @click="search">搜索</el-button>
        </div>
        <div class="body_data_content">
            <div class="content_left">
                <div class="box_title">
                    个人信息
                </div>
                <div class="data_box mb_24" v-loading="hr_loading">
                    <div class="flex_space_between">
                        <div class="flex_start data_type ">
                            <img src="@/assets/images/hr_icon.png" alt="">
                            <div>心率</div>
                        </div>
                        <div class="data_unit ">bpm</div>
                    </div>
                    <div class="data_value">{{ hrResult.list && hrResult.list.length ? hrResult.new_value :
                        "--"
                        }}</div>
                    <div class="flex_space_between">
                        <div class="flex_space_between data_item">
                            <div>{{ hrResult.avg && hrResult.avg.average_avg ?
                                hrResult.avg.average_avg
                                : "--" }}</div>
                            <div>平均心率</div>
                        </div>
                        <div class="flex_space_between data_item">
                            <div>{{ hrResult.avg && hrResult.avg.average_max ?
                                hrResult.avg.average_max
                                : "--" }}</div>
                            <div>最高心率</div>
                        </div>
                        <div class="flex_space_between data_item">
                            <div>{{ hrResult.avg && hrResult.avg.average_min ?
                                hrResult.avg.average_min
                                : "--" }}</div>
                            <div>最低心率</div>
                        </div>
                    </div>
                </div>
                <div class="data_box" v-loading="spo2_loading">
                    <div class="flex_space_between">
                        <div class="flex_start data_type ">
                            <img src="@/assets/images/spo2_icon.png" alt="">
                            <div>血氧饱和度</div>
                        </div>
                        <div class="data_unit">%</div>
                    </div>
                    <div class="data_value">{{ spo2Result.list && spo2Result.list.length ?
                        spo2Result.new_value :
                        "--"
                        }}</div>
                    <div class="flex_space_between">
                        <div class="flex_space_between data_item">
                            <div>{{ spo2Result.avg && spo2Result.avg.average_avg ?
                                spo2Result.avg.average_avg : "--" }}</div>
                            <div>平均血氧</div>
                        </div>
                        <div class="flex_space_between data_item">
                            <div>{{ spo2Result.avg && spo2Result.avg.average_max ?
                                spo2Result.avg.average_max : "--" }}</div>
                            <div>最高血氧</div>
                        </div>
                        <div class="flex_space_between data_item">
                            <div>{{ spo2Result.avg && spo2Result.avg.average_min ?
                                spo2Result.avg.average_min : "--" }}</div>
                            <div>最低血氧</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content_right" v-loading="chart_loading">
                <el-radio-group @change="changeNameType" v-model="choose_name" size="large"
                    style="--el-color-primary:#00B528">
                    <el-radio-button label="心率" value="heartrate" />
                    <el-radio-button label="血氧饱和度" value="spo2" />
                </el-radio-group>
                <div v-show="choose_name == 'heartrate'">
                    <div class="psr">
                        <div class="echart_size" ref="hrRef" id="hr_chart">
                        </div>
                        <div v-show="!(hrResult.list && hrResult.list.length)" class="echarts_nodata">
                            <img src="@/assets/images/nodata.png" alt="">
                            <p>{{props.patientInfo.ccid?'暂无数据，请提醒患者坚持佩戴久乐表！':'暂未绑定设备'}}</p>
                        </div>
                    </div>
                </div>
                <div v-show="choose_name == 'spo2'">
                    <div class="psr">
                        <div class="echart_size" ref="spo2Ref" id="spo2_chart"></div>
                        <div v-show="!(spo2Result.list && spo2Result.list.length)" class="echarts_nodata">
                            <img src="@/assets/images/nodata.png" alt="">
                            <p>{{props.patientInfo.ccid?'暂无数据，请提醒患者坚持佩戴久乐表！':'暂未绑定设备'}}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import BodyApi from '@/api/body';
import { dateFtt, getAllDate } from '@/utils/date/dateFtt';
import { ElMessage } from 'element-plus';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import echarts from "@/utils/echarts/echarts";

//时间选择框
const props = defineProps(['patientInfo'])
const selectDate = ref('')

const dateList = computed(() => {
    // dateFtt("hh:00", new Date(e.insert_time * 1000))
    let arr: any[] = []
    let start = new Date(dateFtt('yyyy/mm/dd 00:00:00', new Date(props.patientInfo.start))).getTime()
    let end = (new Date().getTime())
    let weekList = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',]
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
const search = () => {
    choose_name.value='heartrate'
    fetchData()
}

// 获取数据
const chart_loading = ref(false)
const spo2_loading = ref(false)
const hr_loading = ref(false)
const hrResult = ref<any>({})
const spo2Result = ref<any>({})
const hrOption = reactive({
    xAxis: {
        type: 'time',
        axisLabel: {
            formatter: function (value: any) {
                return dateFtt("hh:MM", new Date(value));
            },
            showMaxLabel: true,
            showMinLabel: true,
            color: "#929FAF",
            fontSize:"16"
        },
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: "#EEEEEE"
            }
        }
    },
    color: '#07C160',
    tooltip: {
        trigger: "axis",
        // appendTo:'body',
        formatter: function (params: any) {
            var html = "";
            for (var i in params) {
                var param = params[i];
                // echarts日期格式化api           
                if (param.data[1]) {
                    var date = dateFtt("hh:MM", new Date(param.data[0]));
                    html += `<span style="color: #333;font-weight:bolder;">${date}</span><br />
                            <span style="margin-right:10px;padding-left:14px;position:relative;">
                                <span style='display: block;
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 10px;
                                            background-color: #07C160;
                                            position: absolute;
                                            left: 0;
                                            top: 6px;'></span>
                                ${param.seriesName}：</span>
                        <span style="">${param.data[1]}bpm</span><br />`;
                }

            }
            return html;
        },
    },
    yAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                color: "#EEEEEE"
            }
        },
        axisLabel: {
            color: "#929FAF",
            fontSize:"16"
            // formatter: function (value: any) {
            //     return value + '%'
            // },
        }

    },
    grid: {
        left: "5%",
        top: "10%",
        bottom: '5%',
        right: "3%"
    },
    series: [
        {
            name: "心率",
            data: [],
            type: 'line',
            symbol: 'none',
            lineStyle: {
                color: "#07C160"
            }
        }
    ]
})

const fetchData = async () => {
    if(!props.patientInfo.ccid){
        return
    }
    spo2_loading.value = true
    hr_loading.value = true
    chart_loading.value = true
    
    let data = {
        ccid: props.patientInfo.ccid,
        from: new Date(selectDate.value + ' 00:00:00').getTime() / 1000,
        to: new Date(selectDate.value + ' 23:59:59').getTime() / 1000,
        patient_id: props.patientInfo.id
    }
    try {
        const result_hr = (await BodyApi.getDataStatics(Object.assign({ name: 'heartrate' }, data))).data
        if (result_hr.status == 200) {
            hrResult.value = result_hr.result
            hr_loading.value = false

            let flag = true
            if (hrResult.value.list.length) {
                for (let index = hrResult.value.list.length - 1; index > 0; index--) {
                    const element = hrResult.value.list[index];
                    if (element.y && flag) {
                        hrResult.value.new_obj = element
                        hrResult.value.new_value = element.y
                        flag = false
                    }
                }
            }
            let dataList = hrResult.value.list
            let data: never[] = []
            dataList.forEach((item: any) => {
                data.push([new Date(`${selectDate.value} ${item.name}`), item.y] as never)
            })
            hrOption.series[0]!.data = data
            await nextTick()
            initCharts()
        }
        const result_spo2 = (await BodyApi.getDataStatics(Object.assign({ name: 'spo2' }, data))).data
        if (result_spo2.status == 200) {
            spo2Result.value = result_spo2.result
            spo2_loading.value = false

            let flag = true
            if (spo2Result.value.list.length) {
                for (let index = spo2Result.value.list.length - 1; index > 0; index--) {
                    const element = spo2Result.value.list[index];
                    if (element.y && flag) {
                        spo2Result.value.new_obj = element
                        spo2Result.value.new_value = element.y
                        flag = false
                    }
                }
            }
            let dataList = spo2Result.value.list
            let data: never[] = []
            dataList.forEach((item: any) => {
                data.push([new Date(`${selectDate.value} ${item.name}`), item.y] as never)
            })
            spo2Option.series[0]!.data = data

            await nextTick()
            initCharts()
        }
    } catch (error) {
        ElMessage.error("error: " + error);
        spo2_loading.value = false
        hr_loading.value = false
    }


}
//图表
const changeNameType = () => {
    initCharts()
}
const choose_name = ref('heartrate')
let hrChart: echarts.ECharts | null | undefined = null
let spo2Chart: echarts.ECharts | null | undefined = null

const initCharts = () => {
    if (choose_name.value === 'heartrate') {
        chart_loading.value = false
        setTimeout(() => {
            if (hrChart == null || hrChart == undefined) {
                hrChart = echarts.init(document.getElementById('hr_chart'));
                window.addEventListener(
                    'resize',
                    (window.onresize = () => {
                        hrChart && hrChart.resize()
                    })
                )
            }
            hrChart.setOption(hrOption);
        }, 200);
    }
    if (choose_name.value === 'spo2') {
        chart_loading.value = false
        setTimeout(() => {
            if (spo2Chart == null || spo2Chart == undefined) {
                spo2Chart = echarts.init(document.getElementById('spo2_chart'));
                window.addEventListener(
                    'resize',
                    (window.onresize = () => {
                        spo2Chart && spo2Chart.resize()
                    })
                )
            }
            spo2Chart.setOption(spo2Option);

        }, 200);
    }
}


const spo2Option = reactive({
    xAxis: {
        type: 'time',
        axisLabel: {
            formatter: function (value: any) {
                return dateFtt("hh:MM", new Date(value));
            },
            showMaxLabel: true,
            showMinLabel: true,
            color: "#929FAF",
            fontSize:"16"
        },
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: "#EEEEEE"
            }
        }
    },
    tooltip: {
        trigger: "axis",
        // appendTo:'body',
        formatter: function (params: any) {
            var html = "";
            for (var i in params) {
                var param = params[i];
                // echarts日期格式化api           
                if (param.data[1]) {
                    var date = dateFtt("hh:MM", new Date(param.data[0]));
                    html += `<span style="color: #333;font-weight:bolder;">${date}</span><br />
                            <span style="margin-right:10px;padding-left:14px;position:relative;">
                                <span style='display: block;
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 10px;
                                            background-color: #07C160;
                                            position: absolute;
                                            left: 0;
                                            top: 6px;'></span>
                                ${param.seriesName}：</span>
                        <span style="">${param.data[1]}%</span><br />`;
                }
            }
            return html;
        },
    },
    yAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                color: "#EEEEEE"
            }
        },
        axisLabel: {
            color: "#929FAF",
            formatter: function (value: any) {
                return value + '%'
            },
            fontSize:"16"
        }

    },
    grid: {
        left: "5%",
        top: "10%",
        bottom: '5%',
        right: "3%"
    },
    series: [
        {
            name: "血氧饱和度",
            data: [],
            type: 'line',
            symbol: 'none',
            lineStyle: {
                color: "#07C160"
            }
        }
    ]
})
onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.body_data {
    padding: 0 24px 24px;
}

.body_data_search_box {
    height: 96px;
    border-bottom: 1px solid #EEEEEE;
    gap: 24px;
}

.search_label {
    font-size: 16px;
    color: #636676;
}

.search_select {
    width: 400px;
}

.body_data_content {
    margin-top: 24px;
    height: 640px;
    width: 100%;
    display: flex;
    justify-content: space-between
}

.content_left {
    width: 433px;
    background-color: #F5F7FB;
    border-radius: 8px;
    padding: 24px;
}

.content_right {
    width: 1067px;
    height: 100%;
    border-radius: 8px;
    border: 1px solid #EEEEEE;
    padding: 24px;
}

.box_title {
    font-size: 20px;
    color: #384951;
    padding-left: 10px;
    height: 20px;
    line-height: 20px;
    position: relative;
    margin-bottom: 24px;
}

.box_title::before {
    width: 3px;
    content: "";
    height: 100%;
    background-color: #00B528;
    position: absolute;
    left: 0;
    top: 0;
}

.data_box {
    background-color: #FFF;
    border-radius: 8px;
    padding: 24px;
    width: 100%;
    height: 262px;
}

.mb_24 {
    margin-bottom: 24px;
}

.data_type {
    font-size: 16px;
    color: #384951;
    height: 24px;
    line-height: 24px;
}

.data_type img {
    width: 20px;
    margin-right: 4px;
}

.data_unit {
    font-size: 16px;
    color: #929FAF;
    height: 24px;
    line-height: 24px;
}

.data_value {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
    font-size: 32px;
    height: 108px;
    line-height: 109px;
    border-bottom: 1px solid #eee;
    text-align: center;
    margin-bottom: 38px;
}

.data_item {
    flex-direction: column;
    gap: 8px;
}

.data_item div:nth-child(1) {
    height: 24px;
    line-height: 24px;
    font-size: 20px;
    color: #384951;
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';

}

.data_item div:nth-child(2) {
    height: 12px;
    line-height: 12px;
    font-size: 12px;
    color: #929FAF;

}

.psr {
    position: relative;
}

.echart_size {
    width: 100%;
    height: 552px;
}

.echarts_nodata {
    text-align: center;
    height: calc(100% - 40px);
    padding-top: 154px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #ffffff;
}

.echarts_nodata img {
    width: 162px;
    margin: 0 auto;
}

.echarts_nodata p {
    font-size: 16px;
    color: #929FAF;
}
</style>
