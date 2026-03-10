<template>
  <div class="patient_report_dialog">
    <div class="custom_title_box search_sleep m-[20px] line-height-80px">
      <div class="custom_title">
        <!-- <div class="line-height-24px flex justify-start items-center">  -->
        <span class="color-[#384951] mr-12px font-bold text-24px"
          >{{ patientItem.bed_number }}床</span
        >
        <span class="color-[#384951] mr-12px font-bold text-24px">{{ patientItem.name }}</span>
        <span class="color-[#384951] font-bold text-24px">CCID:{{ ccidsub }}</span>
        <!-- </div> -->
        <!-- {{patientItem.bed_number }}床 {{ patientItem.name }} CCID:{{ ccidsub }} -->
      </div>
      <div class="select_width">
        <el-select
          size="large"
          icon="date"
          v-model="selectDate"
          placeholder="请选择日期"
          @change="selectDateChange"
        >
          <template #prefix>
            <img src="@/assets/images/date_icon.png" class="date_icon" alt="" />
          </template>
          <el-option
            v-for="(item, index) in dateList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="tips_time font_bold ml-[auto] mr-[20px]">报告数据统计周期为00:00~24:00</div>
      <!-- <div @click="routerToBack" class="h-48px w-88px flex justify-center items-center cursor-pointer hover:opacity-80 rounded-8px bg-#929FAF">
                               <img src="@/assets/images/back_icon.png" class="w-28px h-28px" alt="">
                               <span class="text-[16px] color-[#fff]">返回</span>
                           </div> -->
    </div>

    <div class="report_content" v-loading="patientSportReportLoading">
      <div class="flex_space_between content_height">
        <div class="left_box" v-if="!dialogSportNoData">
          <div>
            <div class="content_title">运动强度分布</div>
            <div class="content_chart_box flex_space_between">
              <div id="sport_chart"></div>
              <div class="legend_sport">
                <div class="mb_24 legend_item_sport flex_space_between">
                  <div class="square"></div>
                  <div>低强度</div>
                  <div>{{ patientSportReport.per_low_sport }}%</div>
                </div>
                <div class="mb_24 legend_item_sport flex_space_between">
                  <div class="square"></div>
                  <div>中强度</div>
                  <div>{{ patientSportReport.per_mid_sport }}%</div>
                </div>
                <div class="legend_item_sport flex_space_between">
                  <div class="square"></div>
                  <div>高强度</div>
                  <div>{{ patientSportReport.per_high_sport }}%</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex_space_between">
            <div class="sport_data_box">
              <div>
                <img src="@/assets/images/activity_icon.png" alt="" />
                <div class="data_category">步数</div>
              </div>
              <div>
                <div class="data_num">{{ patientSportReport.today_walk }}</div>
                <div class="data_unit">步</div>
              </div>
            </div>
            <div class="sport_data_box">
              <div>
                <img src="@/assets/images/cal_icon.png" alt="" />
                <div class="data_category">卡路里</div>
              </div>
              <div>
                <div class="data_num">{{ patientSportReport.calorie }}</div>
                <div class="data_unit">Kcal</div>
              </div>
            </div>
            <div class="sport_data_box">
              <div>
                <img src="@/assets/images/distance_icon.png" alt="" />
                <div class="data_category">运动距离</div>
              </div>
              <div>
                <div class="data_num">{{ patientSportReport.kilometers }}</div>
                <div class="data_unit">km</div>
              </div>
            </div>
          </div>
        </div>
        <div class="left_box" v-else>
          <div style="height: 100%">
            <div class="today_nodata">
              <img src="@/assets/images/nodata.png" />
              <div>当日暂无运动数据~</div>
            </div>
          </div>
        </div>
        <div class="right_box">
          <div v-if="!dialogSportNoData">
            <div class="flex_space_between">
              <div class="content_title mb-5px">心率趋势对比图</div>
              <div class="flex_start legend_2 font_bold">
                <div class="line line_1"></div>
                <div>今日</div>
                <div class="line line_2"></div>
                <div>第一天</div>
              </div>
            </div>
            <div class="line_chart" id="hr_chart"></div>
          </div>
          <div v-else>
            <div class="today_nodata">
              <img src="@/assets/images/nodata.png" />
              <div>当日暂无运动数据~</div>
            </div>
          </div>
          <div v-if="!dialogSportNoData">
            <div class="flex_space_between">
              <div class="content_title">当日运动风险统计</div>
              <div class="safe_hr">
                运动安全心率：<span class="font_num"
                  >{{ patientSportReport.exercise_safety_heartrate }}bpm</span
                >
              </div>
            </div>
            <div class="warning_list font_bold">
              <div class="th_item tb_item sticky top-0">
                <div class="tr_item font-bold text-16px! color-[#384951]!">安全类型</div>
                <div class="tr_item font-bold text-16px! color-[#384951]!">持续时间</div>
              </div>
              <div
                class="tb_item"
                v-for="(item, index) in patientSportReport.over_health_heartrate_times"
                :key="index"
              >
                <div class="tr_item">{{ item.type }}</div>
                <div class="tr_item">{{ item.time }}</div>
              </div>
              <div
                class="tb_item"
                v-if="Object.keys(patientSportReport.over_health_heartrate_times).length === 0"
              >
                <div class="tr_item" style="width: 100%">暂无运动风险统计数据</div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="today_nodata">
              <img src="@/assets/images/nodata.png" />
              <div>当日暂无运动数据~</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SportApi from '@/api/sportreport'
import type { Pagination } from '@/interface/interface'
import { getCookie } from '@/utils/cookie/cookie'
import { dateFtt, getAllDate } from '@/utils/date/dateFtt'
import { nextTick, onMounted, reactive, ref, watch, computed, toRefs } from 'vue'
import { Md5 } from 'ts-md5'
import { sportAgeRangeOption, sportOpitons, sportPercentChartOption } from '@/utils/echarts/options'

import { hrOptions } from './options'
import echarts from '@/utils/echarts/echarts'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { usePaientInfo } from '@/stores/paientinfo'
const { paientInfo } = toRefs(usePaientInfo())
const router = useRouter()
const admin = JSON.parse(getCookie('admin') || ('{}' as string))
function routerToBack() {
  router.back()
}
const ccidsub = computed(() => {
  if (paientInfo.value.ccid) {
    return paientInfo.value.ccid?.substr(-5) ?? '--'
  }
  return '--'
})
// 搜索
const search_form = ref<any>({
  name: '',
  bed_number: '',
})
const search = () => {
  pageQuery.page = 1
  pageQuery.perPage = 10
  fetchData()
}

const reset = () => {
  search_form.value.name = ''
  search_form.value.bed_number = ''
  pageQuery.page = 1
  pageQuery.perPage = 10
  fetchData()
}
//计算年龄
const computedAge = (birthday: string) => {
  return birthday
    ? (new Date().getTime() - new Date(birthday).getTime()) / 86400000 < 365
      ? Math.floor((new Date().getTime() - new Date(birthday).getTime()) / 86400000) + '天'
      : Math.floor((new Date().getTime() - new Date(birthday).getTime()) / 86400000 / 365) + '岁'
    : ''
}

// 分页器
const pageQuery = reactive<Pagination>({
  page: 1,
  perPage: 10,
  total: 0,
})

const handleSizeChange = (val: number) => {
  pageQuery.perPage = val
  fetchData()
}
const handleCurrentChange = (val: number) => {
  pageQuery.page = val
  fetchData()
}

// 列表
const tableLoading = ref(false)
let tableData = reactive<any[]>([])
const fetchData = async () => {
  tableLoading.value = true
  let data = {
    page: pageQuery.page,
    perPage: pageQuery.perPage,
    zone_number: admin.zone_number,
    bed_number: search_form.value.bed_number,
    name: search_form.value.name,
  }
  const result = (await SportApi.sportDataList(data)).data.result
  if (result) {
    tableLoading.value = false
    pageQuery.total = result.total
    tableData = result.data
  }
}
// 计算运动安全心率
const computedSafetyHeartrate = (birthday: string) => {
  let age = 55
  if (birthday) {
    let todayDate = new Date()
    let birthDate = new Date(birthday)
    age = todayDate.getFullYear() - birthDate.getFullYear()
    if (
      todayDate.getMonth() < birthDate.getMonth() ||
      (todayDate.getMonth() == birthDate.getMonth() && todayDate.getDate() < birthDate.getDate())
    ) {
      age -= 1
    }
    return Math.floor((180 - age) * 0.8)
  }
}

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
const closePatientSportReportDialog = () => {
  patientSportReportShow.value = false
  patientItem.value = {}
}

const selectDate = ref('')
const dateList = computed(() => {
  // dateFtt("hh:00", new Date(e.insert_time * 1000))
  let arr: any[] = []
  let start = new Date(dateFtt('yyyy/mm/dd 00:00:00', new Date(patientItem.value.start))).getTime()
  let end = new Date().getTime()
  let weekList = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  getAllDate(start, end)
    .reverse()
    .forEach((item: any, index: number) => {
      if (index > 365) {
        return
      }
      arr.push({
        label: `${dateFtt('yyyy年mm月dd日', item)} ${weekList[item.getDay()]}`,
        value: dateFtt('yyyy-mm-dd', item),
      })
    })

  if (arr.length > 0) {
    selectDate.value = arr[0].value
  }
  if (arr.length > 1) {
    selectDate.value = arr[1].value
  }
  return arr
})
watch(dateList, async (newval, oldval) => {
  await nextTick()
  if (dateList.value.length > 0) {
    fetchDetailData()
  }
})

const selectDateChange = () => {
  //下拉列表切换
  fetchDetailData()
}

const fetchDetailData = async () => {
  patientSportReportLoading.value = true
  let data = {
    // patient_id: 31,
    patient_id: patientItem.value.id,
    date: selectDate.value.replace('-', '').replace('-', ''),
    md5: Md5.hashStr(String(patientItem.value.id)) + 'xoJWeO24ZLU3xibLDv8aGaqN4M33Ee',
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
          if (
            Object.prototype.hasOwnProperty.call(
              patientSportReport.value.over_health_heartrate_times,
              key,
            )
          ) {
            const element = patientSportReport.value.over_health_heartrate_times[key]
            arr.push({
              type: '高心率运动风险',
              time: element,
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
    patientSportReportLoading.value = false
    dialogSportNoData.value = true
  }
}

// 绘制图表

const initSportChart = (data: any) => {
  let chartDom = document.getElementById('sport_chart')
  let myChart = echarts.init(chartDom)
  let option = Object.assign({}, sportOpitons)
  option.series[0]!.data[0]!.value = data.per_low_sport
  option.series[0]!.data[1]!.value = data.per_mid_sport
  option.series[0]!.data[2]!.value = data.per_high_sport
  option.series[1]!.data[0]!.value = data.total_time
  option && myChart.setOption(option)
}
const initHrChart = (data: any) => {
  let chartDom = document.getElementById('hr_chart')
  let myChart = echarts.init(chartDom)

  let option = Object.assign({}, hrOptions)

  let date = dateFtt('yyyy-mm-dd ', selectDate.value)

  let data_0 = [[new Date(date + '00:00:00').getTime(), '']],
    data_1 = [[new Date(date + '00:00:00').getTime(), '']]
  for (const key in data.T0_day_heartrate) {
    if (Object.hasOwnProperty.call(data.T0_day_heartrate, key)) {
      const element = data.T0_day_heartrate[key]
      data_0.push([new Date(date + key).getTime(), element])
    }
  }
  for (const key in data.today_heartrate) {
    if (Object.hasOwnProperty.call(data.today_heartrate, key)) {
      const element = data.today_heartrate[key]
      data_1.push([new Date(date + key).getTime(), element])
    }
  }

  data_0[data_0.length] = [new Date(date + '23:59:59').getTime() + 1000, '']
  data_1[data_1.length] = [new Date(date + '23:59:59').getTime() + 1000, '']
  option.series[0]!.data = data_0
  option.series[1]!.data = data_1

  option && myChart.setOption(option)
}

onMounted(() => {
  fetchData()
  if (Object.keys(paientInfo.value).length > 0) {
    handlePatientSportDetail(paientInfo.value)
  }
})
</script>

<style scoped>
/* 患者历史运动报告 */

.patient_report_title {
  width: 100%;
  height: 86px;
  padding: 0 24px;
  font-size: 24px;
  color: #00b528;
  background-color: #fff;
}

.patient_report_title img {
  width: 48px;
}

.mr_12 {
  margin-right: 12px;
}

.report_content {
  height: 846px;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  margin: 20px;
}

.content_top {
  height: 96px;
  width: 100%;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 24px;
}

.date_icon {
  height: 28px;
}

.tips_time {
  font-size: 16px;
  color: #636676;
}

.content_height {
  height: 100%;
  gap: 24px;
  align-items: stretch;
}

.left_box {
  width: 604px;
  /* height: 100%; */
  background: #f5f7fb;
  border-radius: 12px 12px 12px 12px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.left_box > div {
  background-color: #fff;
  width: 100%;
  padding: 24px;
}

.left_box > div:first-child {
  height: calc(53% - 6px);
}

.left_box > div:last-child {
  height: calc(47% - 6px);
}

.content_title {
  font-family: 'Source Han Sans CN-Bold';
  color: #384951;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  height: 20px;
  /* padding-left: 11px; */
  position: relative;
}

.content_title::before {
  /* content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 20px;
    background-color: #00B528; */
}
.search_sleep {
  height: 80px;
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 24px;
  padding-left: 16px;
}

.content_chart_box {
  height: calc(100% - 20px);
  width: 100%;
}

#sport_chart {
  width: 60%;
  height: 100%;
  padding-top: 20px;
  /* background-color: #00B528; */
}

.legend_sport {
  width: 120px;
}

.legend_sport .square {
  width: 12px;
  height: 12px;
}

.legend_sport .legend_item_sport:nth-child(1) .square {
  background-color: #00b528;
}

.legend_sport .legend_item_sport:nth-child(2) .square {
  background-color: #08dbf8;
}

.legend_sport .legend_item_sport:nth-child(3) .square {
  background-color: #145eff;
}

.legend_item_sport div:nth-child(2) {
  font-size: 14px;
  font-family: 'Source Han Sans CN-Bold';
  color: #636676;
}

.legend_item_sport div:nth-child(3) {
  font-size: 20px;
  font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
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
  background-color: #e6fded;
  color: #00b528;
}

.flex_space_between .sport_data_box:nth-child(2) {
  background-color: #ffece6;
  color: #f7413d;
}

.flex_space_between .sport_data_box:nth-child(3) {
  background-color: #eaf4ff;
  color: #145eff;
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
  font-size: 16px;
  color: #929faf;
}

.data_category {
  font-size: 18px;
  font-family: 'Source Han Sans CN-Bold';
  font-weight: bold;
}

.right_box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex: 1;
}

.right_box > div {
  height: calc(50% - 6px);
  border: 1px solid #eeeeee;
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
  background-color: #929faf;
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
  height: calc(100% - 0px);
  /* background-color: #00B528; */
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
  position: relative;
  overflow-y: auto;
  margin-top: 24px;
  max-height: calc(100% - 44px);
  width: 100%;
  border-left: 1px solid #eeeeee;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}

.th_item {
  background-color: #f5f7fb !important;
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
  border-bottom: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning_list .tb_item:last-child .tr_item {
  border-bottom: none !important;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}

.today_nodata {
  font-size: 16px;
  color: #929faf;
  text-align: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.today_nodata img {
  width: 240px;
  margin: 0 auto;
}
.activity_tips {
  color: #9a9a9a;
  font-size: 14px;
}
</style>

<style scoped>
@import '@/assets/css/pageStyles/page.css';
.custom_title {
  color: #252b50;
  font-size: 24px;
  font-weight: bolder;
  margin-right: 20px;
}

.mr_24 {
  margin-right: 12px;
}

.radiu_chart {
  width: 210px;
  height: 210px;
}

.mb_24 {
  margin-bottom: 24px;
}

.dialog_body {
  width: 100%;
  padding: 24px;
  display: flex;
  justify-content: space-between;
}

.body_left {
  width: 523px;
}

.body_right {
  width: 295px;
  padding: 24px;
  height: inherit;
  border-radius: 8px;
  border: 1px solid #f5f7fb;
}

.dialog_body_title {
  color: #252b50;
  font-weight: bold;
  font-size: 16px;
}

.dialog_body_title_2 {
  font-size: 14px;
  color: #636676;
  margin-top: 5px;
  margin-bottom: 24px;
}

.legend_item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  padding-left: 32px;
}

.legend_item:nth-child(1) .circle {
  background-color: #cce4fd;
}

.legend_item:nth-child(2) .circle {
  background-color: #80bbfb;
}

.legend_item:nth-child(3) .circle {
  background-color: #0076f6;
}

.legend_item .circle {
  width: 12px;
  height: 12px;
  border-radius: 12px;
  margin-right: 6px;
}

.legend_item .text {
  color: #9296af;
  margin-right: 8px;
}

.legend_item .percent {
  color: #636676;
}

.statics_data {
  padding: 0 50px;
  height: 100px;
  background: #f5f7fb;
  border-radius: 8px;
  color: #9296af;
  text-align: center;
  margin-bottom: 20px;
}

.statics_data_item .num {
  color: #252b50;
  font-size: 32px;
  font-weight: bold;
}

.statics_line {
  width: 1px;
  background-color: #d9d9d9;
  height: 24px;
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
  background-color: #9296af;
}

.legend_2 {
  font-size: 12px;
  color: #9296af;
}

.legend_2 div {
  margin-left: 5px;
}

.line_chart {
  width: 1148px;
  height: 300px;
}

.nodata {
  text-align: center;
  padding: 40px 0 60px;
  font-size: 14px;
  color: #929faf;
}

.nodata img {
  width: 162px;
  margin: 0 auto;
}

.btn_icon {
  width: 24px;
  height: 24px;
}

.zone_dialog_body {
  width: 100%;
  height: 82vh;
  font-size: 14px;
}

.zone_sport_nodata {
  text-align: center;
  padding-top: 20vh;
}

.zone_sport_nodata img {
  width: 200px;
  margin: 0 auto;
}

.zone_sport_content {
  background-color: #fff;
  padding: 12px;
  height: 100%;
  width: 100%;
}

.zone_sport_box {
  background-color: #f5f7fb;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  padding: 12px;
}

.zone_sport_half_box {
  width: calc(50% - 12px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.half_top {
  width: 100%;
  height: calc(62% - 12px);
  background-color: #fff;
  border-radius: 8px;
  padding: 48px 24px 0;
}

.half_bottom {
  width: 100%;
  height: calc(38% - 12px);
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
}

.sport_box_top_title {
  height: 20px;
  font-size: 20px;
  line-height: 20px;
  font-family: 'Source Han Sans CN-Bold';
  font-weight: bold;
  color: #384951;
  display: flex;
  justify-content: flex-start;
}

.sport_box_bottom_title {
  height: 24px;
  font-size: 20px;
  line-height: 24px;
  font-family: 'Source Han Sans CN-Bold';
  font-weight: bold;
  color: #384951;
  display: flex;
  justify-content: flex-start;
}

.sport_box_top_title .line {
  height: 20px;
  width: 3px;
  background-color: #00b528;
  margin-right: 8px;
}

.sport_box_bottom_title img {
  height: 24px;
  width: auto;
  margin-right: 8px;
}

.legend {
  height: 14px;
  font-size: 14px;
  line-height: 14px;
  color: #636676;
  margin-top: 36px;
}

.legend > div {
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
  margin-right: 8px;
}

.legend .legend_item:nth-child(1) .legend_icon {
  background-color: #145eff;
}

.legend .legend_item:nth-child(2) .legend_icon {
  background-color: #00b528;
}

.legend .legend_item:nth-child(3) .legend_icon {
  background-color: #ff7d01;
}

.rank_list {
  padding-top: 16px;
  height: calc(100% - 24px);
}

.rank_item {
  height: calc(100% / 5);
  width: 100%;
  padding: 0 24px;
  font-size: 14px;
  color: #384951;
}

.rank_item:nth-child(2n) {
  background-color: #f5f7fb;
}

.rank_item:nth-child(2n-1) {
  background-color: #fbfcff;
}

.bed_number {
  margin-right: 10px;
}

.num {
  font-weight: bold;
  margin-right: 4px;
}

.percent_chart {
  width: 100%;
  height: calc(100% - 20px);
  /* background-color: #0076f6 */
}

.sport_age_range_chart {
  width: 100%;
  height: calc(100% - 70px);
}

.tips_time {
  font-size: 16px;
  color: #636676;
}

.page_box {
  padding: 24px;
}
.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  background-color: #fff;
  gap: 24px;
  padding: 12px 24px;
  border-radius: 12px;
}
.nav > div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  color: #636676;
  gap: 12px;
}
.nav > div span {
  flex-shrink: 0;
}

:deep(.el-select__wrapper) {
  background-color: #f5f7fb;
  box-shadow: none;
  width: 150px;
  height: 48px;
}
:deep(.nav .el-input__wrapper) {
  width: 260px;
  height: 48px;
  background-color: #f5f7fb;
  box-shadow: none;
}

:deep(.el-pagination__sizes .el-select__wrapper) {
  width: initial;
  height: initial;
}

.select_width {
  width: 250px;
}
:deep(.select_width .el-select__wrapper) {
  width: 250px;
}
</style>
