<template>
    <div class="activity_inner">
         <HeaderSeach v-model="reportDate" @selectDate="fetchData" yesterday/>

          <!-- <div class="custom_title_box search_sleep  mt-0 flex_space_between bg-#fff h-80px gap20px p-[0_20px] mb-20px">
                    <div class="text-[24px] font-bold color-[#384951]">{{patientInfo.bed_number }}床   {{ patientInfo.name }}  CCID:{{ ccidsub }}</div>
                    <div class="mr-auto">
                        <el-date-picker size="large"
                          :prefix-icon="customPrefix"
                        v-model="reportDate"
                        type="date"
                        placeholder="选择日期"
                        class="customPrefix"
                         @change="dateChange"></el-date-picker>
                    </div>               
                </div> -->

        <div class="mt-20px">
            <div class="flex_space_between box_gap gap-20px" v-loading="loading">
                <div class="fit_box_bg box_1_1">
                    <div class="part_title_text">全天卡路里情况</div>
                    <div class="flex_space_between mt8 unit_box">
                        <div class="unit_text">
                            单位：Kcal
                        </div>
                        <div class="legend_box">
                            <div class="skyblue_radiu">夜间时段 21:00-07:00</div>
                            <div class="blue_radiu">睡眠或静息</div>
                            <div class="green_radiu">活动</div>
                        </div>
                    </div>
                    <div class="echart_box" id="avtivityChart"></div>
                </div>
                <div class="box_1_2">
                    <div class="box_1_2_1 box_gap fit_box_bg">
                        <img :src="boxBg" alt="">
                        <div>
                            <div class="font_bold flex justify-between">
                                 当日疑似离床统计
                               <div class="text-14px color-[#FFFFFF]">
                                  阈值：12次
                               </div>
                            </div>
                            <div>
                               
                                <span class="font_bold leave_bed_number">{{ activeNoData ?
                                        '--' :
                                    activeData.total_flag_2_active_num }}</span>
                                <span style="font-size: 16px;">次</span>
                            </div>
                        </div>
                    </div>
                    <div class="box_1_2_2">
                        <div class="fit_box_bg">
                            <div class="flex_space_between">
                                <div class="font_bold color-#384951!" style="font-size: 18px;line-height: 24px;">
                                    当日<br />活动总量
                                </div>
                                <img class="number_icon" src="@/assets/icon/icon_cal.png" alt="">
                            </div>
                            <div style="word-wrap: nowrap;">
                                <span class="font_bold number_text">{{ activeNoData ? '--' : activeData.total_cal
                                    }}</span>
                                <span style="color: #929FAF;font-size: 16px;">Kcal</span>
                            </div>
                        </div>
                        <div class="fit_box_bg">
                            <div class="flex_space_between">
                                <div class="font_bold color-#384951!" style="font-size: 18px;line-height: 24px;">
                                    当日<br />总计步
                                </div>
                                <img class="number_icon" src="@/assets/icon/icon_step.png" alt="">
                            </div>
                            <div style="word-wrap: nowrap;">
                                <span class="font_bold number_text">{{ activeNoData ? '--' : activeData.total_walk
                                    }}</span>
                                <span style="color: #929FAF;font-size: 16px;">步</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex_space_between box_gap h-502px" v-loading="loading">
                <div class="box_2_1 fit_box_bg ">
                    <div>
                        <div class="flex_space_between part_head">
                            <div class="part_title_text">日间活动情况</div>
                            <div class="flex_space_between" style="gap: 16px;color: #929FAF;font-size: 14px;">
                                <div>活动量：<span style="color: #252B50;">{{ activeNoData ? '--' :
                                    activeData.day_active_info.day_total_active_cal }}Kcal</span>
                                </div>
                                <div>计步：<span style="color: #252B50;">{{ activeNoData ? '--' :
                                    activeData.day_active_info.day_total_active_walk }}步</span>
                                </div>
                            </div>
                        </div>
                        <div class="pie_chart" id="dayActivePieChart"></div>
                        <div class="pie_legend">
                            <div>疑似离床</div>
                            <div>轻度动作</div>
                            <div>睡眠或静息</div>
                        </div>
                    </div>
                    <div class="active_event">
                        <div class="flex_space_between part_head" style="margin-bottom: 8px;">
                            <div class="part_title_text title_bar">活动事件</div>
                            <div class="flex_space_between" style="gap: 16px;color: #929FAF;font-size: 14px;">
                                <div>日间活动次数：<span style="color: #252B50;">{{ activeNoData ? '--' :
                                    activeData.day_active_info.day_active_num }}次</span>
                                </div>
                            </div>
                        </div>
                        <div class="event_list_scroll_box">
                            <div class="event_head flex_space_between">
                                <div>活动情况</div>
                                <div>时间段</div>
                            </div>
                            <div class="table_nodata"
                                v-if="activeNoData || activeData.day_active_info.day_active_info.length == 0">暂无数据</div>
                            <div class="event_list" v-else>
                                <div v-for="item in activeData.day_active_info.day_active_info"
                                    class="flex_space_between">
                                    <div class="flex_start">
                                        <div>{{ item.flag == 2 ? item.cal + 'Kcal' : '轻度动作' }}</div>
                                        <div v-if="item.flag == 2" class="table_tag">疑似离床</div>
                                    </div>
                                    <div>{{ item.start_time }} - {{ item.end_time }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box_2_2 fit_box_bg">
                    <div>
                        <div class="flex_space_between part_head">
                            <div class="part_title_text">夜间活动情况</div>
                            <div class="flex_space_between" style="gap: 16px;color: #929FAF;font-size: 14px;">
                                <div>活动量：<span style="color: #252B50;">{{ activeNoData ? '--' :
                                    activeData.night_active_info.night_total_active_cal }}Kcal</span>
                                </div>
                                <div>计步：<span style="color: #252B50;">{{ activeNoData ? '--' :
                                    activeData.night_active_info.night_total_active_walk }}步</span>
                                </div>
                            </div>
                        </div>
                        <div class="pie_chart" id="nightActivePieChart"></div>
                        <div class="pie_legend">
                            <div>疑似离床</div>
                            <div>轻度动作</div>
                            <div>睡眠或静息</div>
                        </div>
                    </div>
                    <div class="active_event">
                        <div class="flex_space_between part_head" style="margin-bottom: 8px;">
                            <div class="part_title_text title_bar">活动事件</div>
                            <div class="flex_space_between" style="gap: 16px;color: #929FAF;font-size: 14px;">
                                <div>夜间活动次数：<span style="color: #252B50;">{{ activeNoData ? '--' :
                                    activeData.night_active_info.night_active_num }}次</span>
                                </div>
                            </div>
                        </div>
                        <div class="event_list_scroll_box">
                            <div class="event_head flex_space_between">
                                <div>活动情况</div>
                                <div>时间段</div>
                            </div>
                            <div class="table_nodata"
                                v-if="activeNoData || activeData.night_active_info.night_active_info.length == 0">暂无数据
                            </div>
                            <div class="event_list" v-else>
                                <div v-for="item in activeData.night_active_info.night_active_info"
                                    class="flex_space_between">
                                    <div class="flex_start">
                                        <div>{{ item.flag == 2 ? item.cal + 'Kcal' : '轻度动作' }}</div>
                                        <div v-if="item.flag == 2" class="table_tag">疑似离床</div>
                                    </div>
                                    <div>{{ item.start_time }} - {{ item.end_time }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box_2_3">
                    <div class="box_2_3_1 box_gap fit_box_bg">
                        <div class="flex_space_between part_head">
                            <div class="part_title_text">佩戴周期全天活动量趋势</div>
                            <div class="flex_space_between" style="gap: 16px;color: #929FAF;font-size: 14px;">
                                <div>单位：<span style="color: #252B50;">Kcal</span>
                                </div>
                            </div>
                        </div>
                        <div class="line_chart" id="dayActiveLineChart"></div>
                    </div>
                    <div class="box_2_3_2 fit_box_bg">
                        <div class="flex_space_between part_head">
                            <div class="part_title_text">佩戴周期夜间活动趋势</div>
                            <div class="flex_space_between ml-auto mr-10px" style="gap: 16px;color: #929FAF;font-size: 14px;">
                                <div class="color-[#384951]">阈值：<span style="color: #384951;">6次</span>
                                </div>
                            </div>
                            <div class="flex_space_between" style="gap: 16px;color: #929FAF;font-size: 14px;">
                                <div>单位：<span style="color: #252B50;">次</span>
                                </div>
                            </div>
                        </div>
                        <div class="line_chart" id="nightActiveLineChart"></div>
                    </div>
                </div>
            </div>
            <div class="flex_space_between" v-loading="loading">
                <div class="box_3_1 fit_box_bg">
                    <div class="part_title_text">每小时平均心率情况</div>
                    <div class="flex_space_between mt8 unit_box">
                        <div class="unit_text">
                            单位：bpm
                        </div>
                        <div class="legend_box">
                            <div class="skyblue_radiu">夜间时段 21:00-07:00</div>
                            <div class="red_radiu">高心率预警阈值：{{ activeData.high_heartrate_value }}bpm <span
                                    style="margin-right: 10px;"></span>
                                低心率预警阈值：{{ activeData.low_heartrate_value }}bpm</div>
                        </div>
                    </div>
                    <div class="echart_box" id="hrChart"></div>
                </div>
                <div class="box_3_2 fit_box_bg">
                    <div class="part_title_text" style="margin-bottom: 16px;">夜间心率风险</div>
                    <div class="event_list_scroll_box event_list_scroll_box_2">
                        <div class="event_head flex_space_between">
                            <div>风险类型</div>
                            <div>时间段</div>
                        </div>
                        <div class="table_nodata table_nodata2"
                            v-if="activeNoData || activeData.heartrate_risk_info == 0">暂无数据</div>
                        <div class="event_list" v-else>
                            <div v-for="item in activeData.heartrate_risk_info" class="flex_space_between">
                                <div class="flex_start">
                                    <div>{{ item.type }}</div>
                                </div>
                                <div>{{ item.start_time }} - {{ item.end_time }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const ReportUrl = import.meta.env.VITE_REPORT_API_URL;
import { dateFtt } from "@/utils/date/dateFtt";
import { calOption, hrOption, pieOption, dayActiveLineOption, nightActiveLineOption ,md5Str} from './options';
import ActivityStatics from "@/api/analysisReport";
import box_1_2_bg_nodata from "@/assets/icon/box_1_2_bg_nodata.png";
import box_1_2_bg from "@/assets/icon/box_1_2_bg.png";
import warning from "@/assets/icon/warning.png";
import { usePaientInfo } from "@/stores/paientinfo";
import * as echarts from "echarts";
import { toRefs } from "vue";
import { useCustom } from '@/hooks/useCustom';
  const { customPrefix } =  useCustom();
export default {
 
    computed:{
        ccidsub(){
            if(this.patientInfo.ccid){
              return this.patientInfo.ccid?.substr(-5)??'--';
            }
            return "--"
        },
        boxBg(){
            if(this.activeNoData){
                  return this.box_1_2_bg_nodata;
            }
             if(this.activeData.total_flag_2_active_num && this.activeData.total_flag_2_active_num > 12){
                  return this.warning;
            }else{
                return this.box_1_2_bg;
            }
          
        }
    },
    data() {
        return {
            patientInfo:{},
            box_1_2_bg_nodata:box_1_2_bg_nodata,
            box_1_2_bg:box_1_2_bg,
            warning:warning,
            initcalChart:"", // 初始化
            reportDate: new Date().setDate(new Date().getDate()-1),
           disabledDate:(date)=>{
                    return new Date() < date;
            },
            loading: false,
            activeData: {},
            activeNoData: true
        };
    },
    mounted() {
        this.patientInfo =usePaientInfo().paientInfo;
        this.fetchData()
    },
    methods: {
        // routerToBack(){
        //  this.$router.back();
        // },
        dateChange() {
            this.fetchData()
        },
        handleBackBtn() {
            this.$emit('handleBackBtn')
        },
        fetchData() {
            this.loading = true;
            let date = dateFtt("yyyymmdd", this.reportDate);
            let url =`${ReportUrl}hospital_show/api/report/active_report?date=${date}&patient_id=${this.patientInfo.id}&md5=${md5Str(this.patientInfo.id)}`;
            ActivityStatics.getSyncData({url:url}).then(async (response) => {
                const result = response.data.result;
                this.loading = false;
                if (result.state == 200) {
                    this.activeNoData = false;
                    this.activeData = result;

                } else {
                    this.activeNoData = true;
                        this.activeData = {};
                }
                await this.$nextTick();
                setTimeout(()=>{
                    this.initActiveEcharts()
                this.initHrEcharts()
                this.initDayActivePieChart()
                },600)
             

                this.initDayActiveEcharts()
                this.initNightActiveEcharts()
            })
                .catch((error) => {
                    this.loading = false;
                    this.activeNoData = true;
                })
            // axios
            //     .get(ReportUrl + "hospital_show/api/report/active_report", {
            //         params: {
            //             date: date,
            //             patient_id: this.patientInfo.patient_id,
            //             md5: this.md5Str(this.patientInfo.patient_id),
            //             // date: "20250312",
            //             // patient_id: "60015166779",
            //             // md5: this.md5Str("60015166779"),
            //         },
            //     })
            //     .then((response) => {
            //         this.loading = false;
            //         const result = response.data;
            //         if (result.state == 200) {
            //             this.activeNoData = false;
            //             this.activeData = result;

            //         } else {
            //             this.activeNoData = true;
            //         }

            //         this.initActiveEcharts()
            //         this.initHrEcharts()
            //         this.initDayActivePieChart()

            //         this.initDayActiveEcharts()
            //         this.initNightActiveEcharts()
            //     })
            //     .catch((error) => {
            //         this.loading = false;
            //         console.log(error);
            //         this.activeNoData = true;
            //     })
        },
        initActiveEcharts() { 
            if(echarts.getInstanceByDom(document.getElementById('avtivityChart'))){
                echarts.dispose(document.getElementById('avtivityChart'));
            }
            let calChart = echarts.init(document.getElementById('avtivityChart'));
            let xData1 = [];
            let xData2 = [];
            if (this.activeNoData) {
                calChart.showLoading({
                    text: '当日暂无活动数据~',
                    showSpinner: false, // 隐藏旋转动画
                    textColor: '#636676',
                    maskColor: '#F5F7FB',
                    fontSize: 18,
                    fontFamily: 'Source Han Sans CN-Regular'
                });
            } else {
                calChart.hideLoading();
                for (let index = 0; index < this.activeData.draw_cal.length; index++) {
                    const element = this.activeData.draw_cal[index];
                    xData1.push(element.hour_calorie != -1 ? element.hour_calorie * element.sleep_per : -1);
                    xData2.push(element.hour_calorie != -1 ? element.hour_calorie * element.active_per : -1);
                }
                calOption.series[0].data = xData1;
                calOption.series[1].data = xData2;
                calOption.series[1].label.formatter = (params) => {
                    return params.value != -1 ? ((params.value + calOption.series[0].data[params.dataIndex]) != 0 ? Number(params.value + calOption.series[0].data[params.dataIndex]).toFixed(1) : 0) : '';
                }

                calChart.setOption(calOption);
            }
        },
        initDayActivePieChart() {
            if(echarts.getInstanceByDom(document.getElementById('dayActivePieChart'))){
                echarts.dispose(document.getElementById('dayActivePieChart'));
            }
            if(echarts.getInstanceByDom(document.getElementById('nightActivePieChart'))){
                echarts.dispose(document.getElementById('nightActivePieChart'));
            }
            let daypieChart = echarts.init(document.getElementById('dayActivePieChart'));
            let nightpieChart = echarts.init(document.getElementById('nightActivePieChart'));
            const dayoption = JSON.parse(JSON.stringify(pieOption))
            const nightoption = JSON.parse(JSON.stringify(pieOption))
            dayoption.series.labelLayout = function (params) {
                
                const isLeft = params.labelRect.x < daypieChart.getWidth() / 2;
                const points = params.labelLinePoints;
                
                // 获取图表的尺寸信息
                const chartHeight = daypieChart.getHeight();
                
                console.log(chartHeight, params.labelRect.y,"12333333")
                // 获取饼图中心点和半径
                const seriesModel = daypieChart.getModel().getComponent('series');
                const seriesOption = seriesModel ? seriesModel.option : null;
                 if(Math.abs(points[1][1]-points[0][1]) < 4){
                    if(points[1][1] > points[0][1]){
                         points[1][1] = points[0][1] + 4;
                          points[2][1] = points[2][1] + 4;
                    }else{
                          points[1][1] = points[0][1] - 4;
                           points[2][1] = points[2][1] - 4;
                    }
                }
                let newX = params.labelRect.x;
                let newY = points[2][1] - 10; 
                if(params.labelRect.y < (chartHeight/2)){
                    newY = points[2][1] + 26; 
                }
                // / 计算标签线的终点位置
                if (isLeft) {
                    points[2][0] = params.labelRect.x
                } else {
                    newX+=params.labelRect.width;
                    points[2][0] = params.labelRect.x + params.labelRect.width;
                }
                 
                
                return {
                    labelLinePoints: points,
                    x: newX,
                    y: newY
                };
            }
            nightoption.series.labelLayout = function (params) {
                const isLeft = params.labelRect.x < nightpieChart.getWidth() / 2;
                const points = params.labelLinePoints;
                
                // 获取图表的尺寸信息
                const chartHeight = nightpieChart.getHeight();
                
                // 获取饼图中心点和半径
                const seriesModel = nightpieChart.getModel().getComponent('series');
                const seriesOption = seriesModel ? seriesModel.option : null;
                
                let newX = params.labelRect.x;
                let newY = points[2][1] - 10; 
                if(params.labelRect.y < 16){
                    newY = points[2][1] + 26; 
                }
                // / 计算标签线的终点位置
                if(Math.abs(points[1][1]-points[0][1]) < 4){
                    if(points[1][1] > points[0][1]){
                         points[1][1] = points[0][1] + 4;
                          points[2][1] = points[2][1] + 4;
                    }else{
                          points[1][1] = points[0][1] - 4;
                           points[2][1] = points[2][1] - 4;
                    }
                }
                console.log(points[1][1],"123123123")
                if (isLeft) {
                    points[2][0] = params.labelRect.x
                } else {
                    newX+=params.labelRect.width;
                    points[2][0] = params.labelRect.x + params.labelRect.width;
                }
                 
                
                return {
                    labelLinePoints: points,
                    x: newX,
                    y: newY
                };
            };




            
            if (this.activeNoData) {
                dayoption.series.data = []
                nightoption.series.data = []
            } else {
                dayoption.series.data[0].value = (this.activeData.day_active_info.day_flag_2_per * 100).toFixed(0)
                dayoption.series.data[1].value = (this.activeData.day_active_info.day_flag_1_per * 100).toFixed(0)
                dayoption.series.data[2].value = (this.activeData.day_active_info.day_flag_0_per * 100).toFixed(0)

                nightoption.series.data[0].value = (this.activeData.night_active_info.night_flag_2_per * 100).toFixed(0)
                nightoption.series.data[1].value = (this.activeData.night_active_info.night_flag_1_per * 100).toFixed(0)
                nightoption.series.data[2].value = (this.activeData.night_active_info.night_flag_0_per * 100).toFixed(0)
            }
            daypieChart.setOption(dayoption);
            nightpieChart.setOption(nightoption);
        },
        initHrEcharts() {
            let hrChart = echarts.init(document.getElementById('hrChart'));
            let xData = [];
            if (this.activeNoData) {
                hrChart.showLoading({
                    text: '当日暂无心率数据~',
                    showSpinner: false, // 隐藏旋转动画
                    textColor: '#636676',
                    maskColor: '#F5F7FB',
                    fontSize: 18,
                    fontFamily: 'Source Han Sans CN-Regular'
                });
            } else {
                hrChart.hideLoading();
                for (let index = 0; index < this.activeData.draw_hr.length; index++) {
                    const element = this.activeData.draw_hr[index];
                    xData.push(element.mean_hr != -1 && element.mean_hr != 0 ? element.mean_hr : null);
                }
                let _this = this;
                hrOption.series[0].itemStyle.color = function (params) {
                    if (!params.data) {
                        return '#999';
                    } else if (params.data && (params.data > _this.activeData.high_heartrate_value || params.data < _this.activeData.low_heartrate_value)) {
                        return '#E24040';
                    } else {
                        return '#07C160';
                    }
                }
                
                hrOption.series[0].label.formatter = function (params) {
                    if (params.data && (params.data > _this.activeData.high_heartrate_value || params.data < _this.activeData.low_heartrate_value)) {
                        return '{highBg|' + params.value + '}';
                    } else {
                        return '{normal|' + params.value + '}';
                    }
                }
                hrOption.series[0].markLine.data[0].yAxis = this.activeData.high_heartrate_value;
                hrOption.series[0].markLine.data[1].yAxis = this.activeData.low_heartrate_value;
                hrOption.series[0].data = xData;
                // calOption.series[1].label.formatter = (params) => {
                //     return params.value != -1 ? (params.value + calOption.series[0].data[params.dataIndex]) : '';
                // }
                hrChart.setOption(hrOption);
            }

        },
        initDayActiveEcharts() {
            if(echarts.getInstanceByDom(document.getElementById('dayActiveLineChart'))){
                echarts.dispose(document.getElementById('dayActiveLineChart'));
            }
            let dayActiveChart = echarts.init(document.getElementById('dayActiveLineChart'));
            let xData = [], yData = []
            if (this.activeNoData) {
                dayActiveChart.showLoading({
                    text: '暂无数据~',
                    showSpinner: false, // 隐藏旋转动画
                    textColor: '#636676',
                    maskColor: '#F5F7FB',
                    fontSize: 18,
                    fontFamily: 'Source Han Sans CN-Regular'
                });
            } else {
                dayActiveChart.hideLoading();
                for (let index = 0; index < this.activeData.wear_day_cal.length; index++) {
                    const element = this.activeData.wear_day_cal[index];
                    yData.push(element.cal != -1 ? element.cal : null);
                    let date = element.date.slice(4, 8)
                    xData.push(date.slice(0, 2) + '-' + date.slice(2))
                }
                dayActiveLineOption.series[0].label.formatter = function (params) {
                    return '{normal|' + params.value + '}';
                }
                dayActiveLineOption.series[0].data = yData;
                dayActiveLineOption.xAxis[0].data = xData;
                // calOption.series[1].label.formatter = (params) => {
                //     return params.value != -1 ? (params.value + calOption.series[0].data[params.dataIndex]) : '';
                // }
                dayActiveChart.setOption(dayActiveLineOption);
            }

        },
        initNightActiveEcharts() {
            if(echarts.getInstanceByDom(document.getElementById('nightActiveLineChart'))){
                echarts.dispose(document.getElementById('nightActiveLineChart'));
            }
            let nightActiveChart = echarts.init(document.getElementById('nightActiveLineChart'));
            let xData = [], yData = []
            if (this.activeNoData) {
                nightActiveChart.showLoading({
                    text: '暂无数据~',
                    showSpinner: false, // 隐藏旋转动画
                    textColor: '#636676',
                    maskColor: '#F5F7FB',
                    fontSize: 18,
                    fontFamily: 'Source Han Sans CN-Regular'
                });
            } else {
                nightActiveChart.hideLoading();
                for (let index = 0; index < this.activeData.wear_day_night_active.length; index++) {
                    const element = this.activeData.wear_day_night_active[index];
                    yData.push(element.night_active != -1 ? element.night_active : null);
                    let date = element.date.slice(4, 8)
                    xData.push(date.slice(0, 2) + '-' + date.slice(2))
                }
                nightActiveLineOption.series[0].label.formatter = function (params) {
                    return '{normal|' + params.value + '}';
                }
                nightActiveLineOption.series[0].itemStyle.color = function (params) {
                    if (params.data && (params.data >= 6)) {
                        return '#E24040';
                    } else {
                        return '#6377F5';
                    }
                }
                nightActiveLineOption.series[0].label.formatter = function (params) {
                    if (params.data && (params.data >= 6)) {
                        return '{highBg|' + params.value + '}';
                    } else {
                        return '{normal|' + params.value + '}';
                    }
                }
                nightActiveLineOption.series[0].data = yData;
                nightActiveLineOption.xAxis[0].data = xData;

                nightActiveChart.setOption(nightActiveLineOption);
            }

        }
    },
}
</script>
<style scoped>

.activity_inner {
    padding: 20px;
}
:deep(.el-input__wrapper){
     height: 32px;
}
:deep(.head_time_picker .el-date-editor .el-input__inner){
    /* background: red; */
     height: 30px;
}
 

.back_btn {
    cursor: pointer;
    width: 108px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background: #07C160;
    border-radius: 8px 8px 8px 8px;
    color: #fff;
    font-family: 'Source Han Sans CN-Medium';
}

.back_btn img {
    width: 24px;
    height: 24px;
}

.head_text {
    font-family: 'Source Han Sans CN-Bold';
    font-size: 24px;
    color: #252B50;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 12px;
}

.fit_box_bg {
    width: 100%;
    height: 100%;
    background-color: #FFF;
    border-radius: 8px 8px 8px 8px;
}

.box_1_1 {
    /* width: 1173px; */
    height: 363px;
    padding: 16px;
    padding-bottom: 6px;
}

.box_1_2 {
    width: 375px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.box_1_2_1 {
    position: relative;
    height: 154px;
}

.box_1_2_1 img {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: inherit;
    z-index: 1;
}

.box_1_2_1>div {
    position: relative;
    z-index: 2;
    color: #fff;
    padding: 16px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    font-size: 18px;
}

.box_1_2_2 {
    height: 188px;
    width: 100%;
    gap: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.box_1_2_2>div {
    width: 177px;
    padding: 16px;
}

.box_gap {
    margin-bottom: 20px;
}

.box_2_1,
.box_2_2 {
    width: 533px;
    height: 502px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.box_2_3 {
    width: 750px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.box_2_3_1,
.box_2_3_2 {
    width: 100%;
    height: 241px;
    padding: 16px;
}

.box_3_1 {
    width: 1483px;
    height: 363px;
    padding: 16px;
    padding-bottom: 6px;
}

.box_3_1 .legend_box {
}

.box_3_2 {
    width: 375px;
    height: 363px;
    padding: 16px;
}


.part_title_text {
    color: #384951;
    font-size: 18px;
    font-family: 'Source Han Sans CN-Bold';
    height: 27px;
    line-height: 27px;
    font-weight: bold;
}

.legend_box {
    display: flex;
    justify-content: flex-end;
}

.legend_box div {
    margin-left: 20px;
    font-size: 14px;
    position: relative;
    padding-left: 14px;
    color: #636676;
}

.legend_box div::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}

.green_radiu::before {
    background-color: #07C160;
}

.blue_radiu::before {
    background-color: #6377F5;
}

.skyblue_radiu::before {
    background-color: #E5E9FF;
}

.red_radiu::before {
    background-color: #E24040;
}

.unit_box {
    height: 21px;
}

.unit_text {
    padding-left: 34px;
    font-size: 12px;
    color: #929FAF;
    height: 18px;
}

.echart_box {
    height: 280px;
    width: 100%;
}

.mt8 {
    margin-top: 8px;
}

.font_bold {
    font-family: 'Source Han Sans CN-Bold';
    font-weight: bold;
}

.leave_bed_number {
    font-size: 60px;
}


.box_1_2_2 .fit_box_bg {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    padding-bottom: 24pxx;
}

.number_icon {
    width: 48px;
}

.number_text {
    font-size: 38px;
}

.part_head>div {
    height: 27px;
}

.pie_chart {
    width: 100%;
    height: 161px;
}

.pie_legend {
    padding: 0 60px;
    height: 21px;
    line-height: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.pie_legend div {
    padding-left: 16px;
    position: relative;
    color: #636676;
    font-size: 14px;
}

.pie_legend div::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 3px 3px 3px 3px;
    position: absolute;
    left: 0;
    top: 4px;
}

.pie_legend div:nth-child(1)::before {
    background-color: #FE8712;
}

.pie_legend div:nth-child(2)::before {
    background-color: #08DBF8;
}

.pie_legend div:nth-child(3)::before {
    background-color: #6377F5;
}

.event_list_scroll_box {
    height: 180px;
    overflow: hidden;
    padding-top: 36px;
    width: 100%;
    border: 1px solid #EBF4FF;
    border-radius: 8px 8px 8px 8px;
    position: relative;
}

.event_list_scroll_box_2 {
    height: 287px;
}

.event_list::-webkit-scrollbar {
    width: 4px !important;
}

.event_list::-webkit-scrollbar-thumb {
    background-color: #3889FF !important;
    border-radius: 4px !important;
}

.event_list::-webkit-scrollbar-track {
    background-color: #EEEEEE !important;
    border-radius: 4px !important;
}

.event_head {
    height: 36px;
    width: 100%;
    background: #EBF4FF;
    padding: 0 24px;
    font-size: 14px;
    color: #636676;
    position: absolute;
    top: 0;
}

.event_list {
    height: 100%;
    overflow-y: auto;
}

.event_list>div {
    height: 36px;
    width: 100%;
    background: #F5F9FF;
    padding: 0 24px;
    font-size: 14px;
    color: #252B50;
}

.event_list>div:nth-child(2n-1) {
    background-color: #fff;
}

.table_nodata {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 90px;
    font-size: 14px;
    color: #252B50;
}

.table_nodata2 {
    top: 140px;
}

.table_tag {
    width: 64px;
    height: 22px;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #FE8712;
    color: #FE8712;
    font-size: 12px;
    text-align: center;
    line-height: 22px;
    margin-left: 8px;
}

.title_bar {
    padding-left: 10px;
    position: relative;
    font-size: 16px;
}

.title_bar::before {
    content: '';
    width: 4px;
    height: 14px;
    background-color: #3889FF;
    position: absolute;
    left: 0;
    top: 6px;
}

.line_chart {
    width: 100%;
    height: 168px;
}

.red_font {
    color: #fc4a4a
}

.green_font {
    color: #00e26d;
}


</style>