<template>
    <header class="header"></header>
      <div class="sf">
        <div v-if="!showSleepDialog">
    <div class="search_box flex_start" >
        <!-- <div class="flex_start"> -->
            <div class="search_item flex_start">
                <div class="search_label">姓名：</div>
                <div> <el-input size="large" v-model="search_form.name" @keyup.enter.native="search"
                        placeholder="请输入姓名"></el-input></div>
            </div>
            <div class="search_item flex_start">
                <div class="search_label">床位号：</div>
                <div> <el-input size="large" v-model="search_form.bed_number" @keyup.enter.native="search"
                        placeholder="请输入床位号"></el-input></div>
            </div>
            <div class="search_item flex_start">
                <div class="search_label">佩戴状态：</div>
                <div class="select_width">
                    <el-select v-model="search_form.bind" size="large">
                        <el-option key="0" value="0" label="全部"></el-option>
                        <el-option key="1" value="1" label="佩戴中"></el-option>
                        <el-option key="2" value="2" label="未佩戴"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="search_btn_box">
                <el-button type="success" size="large" @click="search">查询</el-button>
                <el-button type="warning" size="large" @click="reset">重置</el-button>
            </div>

        <!-- </div> -->
    </div>
    <div class="table_box">
        <el-table :data="tableData" border style="width: 100%" size="large" v-loading="tableLoading">
            <el-table-column prop="name" label="姓名" align="center" width="160"></el-table-column>
            <el-table-column label="年龄" align="center" width="120">
                <template #default="props">
                    {{ computedAge(props.row.birthday) }} </template>
            </el-table-column>
            <el-table-column prop="bed_number" label="床位号" align="center"></el-table-column>
              <!-- <el-table-column prop="sleep_time" label="夜间总睡眠（小时）" align="center"></el-table-column> -->
            <el-table-column prop="sleep_time" label="昨日有效睡眠（小时）" align="center"></el-table-column>
            <el-table-column prop="deep_sleeping" label="深度睡眠（小时）" align="center"></el-table-column>
            <el-table-column prop="moderate_sleep" label="中度睡眠（小时）" align="center"></el-table-column>
            <el-table-column prop="light_sleep" label="轻度睡眠（小时）" align="center"></el-table-column>
            <!-- openDetail(props.row) -->
            <el-table-column label="操作" align="center" >
                <template #default="props">
                    <el-button plain type="success" @click="sleepReport(props.row)">睡眠数据及分析</el-button>
                </template>
            </el-table-column>
        </el-table>
        <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
            :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    </div>
      <SleepDialog v-else :dialogVisible.sync="showSleepDialog"  :dialogData="patientInfo" @closeDialog="closeDialog">
    </SleepDialog>
</div>
</template>

<script setup lang='ts'>
import ActivityStatics from "@/api/analysisReport";
import SleepApi from '@/api/sleep';
import SleepDialog from "@/components/sleepDialog.vue";
import type { Pagination } from '@/interface/interface';
import { getCookie } from '@/utils/cookie/cookie';
import { Md5 } from 'ts-md5';
import { nextTick, onMounted, reactive, ref } from 'vue';
const admin = JSON.parse(getCookie('admin') as string)

// 搜索
const search_form = ref<any>({
    name: "",
    bed_number: "",
    bind: '0'
})
// 
const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}
let showSleepDialog = ref(false);
let patientInfo   = ref<any>({});
const closeDialog = ()=>{
    showSleepDialog.value = false;
}
// 新版报告
const sleepReport = (row:any)=>{
     let data = {
                patient_id: row.patient_id,
                bed_number: row.bed_number,
                room_number: 9999,
                zone_number: localStorage.getItem('zone_number'),
            }
            ActivityStatics.hopeTime(data).then((res) => {
                // if (res.data.status == 200 && res.data.result.start != 0) {
                    patientInfo.value = row;
                    showSleepDialog.value = true; 
                // }else{
                //      ElMessage({
                //         message: '未绑定设备信息',
                //         type: 'error',
                //         duration: 3000
                // })
                // }
            })
     
}

const reset = () => {
    search_form.value.name = ''
    search_form.value.bed_number = ''
    search_form.value.bind = '0'
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}
//计算年龄
const computedAge = (birthday: string) => {
    return birthday ?
        ((new Date().getTime() - new Date(birthday).getTime())) / 86400000 < 365 ?
            Math.floor((new Date().getTime() - new Date(birthday).getTime()) /
                86400000) + '天' : Math.floor(((new Date().getTime() - new
                    Date(birthday).getTime())) / 86400000 / 365) + '岁' : ""
}

// 分页器
const pageQuery = reactive<Pagination>({
    page: 1,
    perPage: 10,
    total: 0
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
        zone_number: admin.zone_number,
        bed_number: search_form.value.bed_number,
        name: search_form.value.name,
        bind:search_form.value.bind,
        perPage:pageQuery.perPage,
        page:pageQuery.page
    }
    const result = (await SleepApi.sleepDataList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
    }
}

 


// 
onMounted(() => {
    // window.addEventListener('resize', () => {
    //     console.log('Window size changed. Reloading page...');
    //     location.reload();
    // });
 fetchData();
})
</script>




<style scoped>
.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}
.sf{
    margin: 24px;
}
.custom_title {
    color: #252b50;
    font-size: 18px;
    font-weight: bolder;
    margin-right: 20px;
}

.mb_24 {
    margin-bottom: 24px;
}

.dialog_body {
    width: 100%;
    padding: 24px;
    height: 82vh;
}

.dialog_body_title {
    color: #252b50;
    font-weight: bold;
    font-size: 16px;
}

.nodata {
    text-align: center;
    padding: 15% 0 60px;
    font-size: 14px;
    color: #929faf;
    height: 80vh;
}

.nodata img {
    width: 162px;
    margin: 0 auto;
}

.today_nodata img {
    width: 162px;
    margin: 0 auto;
}

.today_nodata {
    text-align: center;
    /* padding: 20% 0; */
    font-size: 14px;
    color: #929faf;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}

.letter_space {
    letter-spacing: 0.5em;
}

.today_detail {
    height: 132px;
    background: #f5f7fb;
    border-radius: 8px;
    color: #636676;
    padding: 0 52px;
    font-size: 16px;
    margin-bottom: 12px;
}

.today_detail span {
    font-size: 16px;
}

.mb_12 {
    margin-bottom: 12px;
}

.score_text {
    font-weight: bold;
    font-size: 60px !important;
    color: #252b50;
    display: inline-block;
    height: 70px;
}

.fs_0 {
    font-size: 0px;
}

.level_box {
    height: 60px;
    width: 100%;
    line-height: 60px;
    text-align: right;
    padding-right: 40px;
    font-weight: bold;
    font-size: 32px;
    border-radius: 8px;
    position: relative;
}



.level_bg_box {
    position: absolute;
    width: 50%;
    height: 68px;
    left: 0;
    bottom: 0;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    padding-left: 40px;
    font-weight: 500;
}

.level_bg_box div {
    display: flex;
    justify-content: flex-start;
    position: relative;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 2;
}

.level_bg {
    position: absolute;
    width: 100%;
    left: 0;
    height: 100%;
    top: 0;
    z-index: 1;
}

.bed_icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
}

.history_sleep_data {
    margin-top: 12px;
    border: 1px solid #f5f7fb;
    border-radius: 8px;
    padding: 24px 24px 0;
}

.legend {
    color: #9296af;
    font-size: 14px;
    height: 40px;
}

.radiu {
    width: 10px;
    height: 10px;
    /* border-radius: 10px; */
    margin-left: 20px;
    margin-right: 4px;
}

.radiu_1 {
    border: 1px solid rgb(214, 214, 214);
    background-color: #ffffff;
}

.radiu_2 {
    background-color: #FB7374;
}

.radiu_3 {
    background-color: #BE2ECD;
}

.radiu_4 {
    background-color: #A241EA;
}

.radiu_5 {
    background-color: #86C7F7;
}

.echart_box {
    width: 100%;
    height: 320px;
}

.bg_item {
    width: 49%;
    height: 100%;
    background-color: #F5F7FB;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.bg_item>div {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
}

.left_top {
    height: 56%;
}

.left_bottom {
    height: calc(44% - 12px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 12px !important;
}

.left_bottom>div:nth-child(1) {
    height: 40%;
}

.left_bottom>div:nth-child(2) {
    height: 56%;
}

.right_top {
    height: calc(50% - 6px);
}

.right_bottom {
    height: calc(50% - 6px);
}

.content_left_title {
    height: 56px;
    border-radius: 8px;
    margin-bottom: 12px;
    padding-right: 12px;
}

.content_left_title .icon_box {
    width: 48px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 56px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

.content_left_title .icon_box img {
    width: 32px;
}

.green_level_box {
    color: #07c160;
    background-color: #dcfaef;
}

.green_level_box .icon_box {
    background-color: #07c160;
}

.blue_level_box {
    color: #0076f6;
    background-color: #ebf4ff;
}

.blue_level_box .icon_box {
    background-color: #0076f6;
}

.red_level_box {
    color: #e24040;
    background-color: #fdf0f0;
}

.red_level_box .icon_box {
    background-color: #e24040;
}

.level_lable_text {
    font-size: 16px;
    color: #384951;
    margin-left: 12px;
    margin-right: 8px;
}

.tips_icon {
    width: 20px;
    position: relative;
    cursor: pointer;
}

.tips_content {
    position: absolute;
    left: 30px;
    top: 0;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 8px;
    width: 160px;
    color: #636676;
    font-size: 12px;
    line-height: 19px;
    z-index: 9;
}

.box_title {
    height: 20px;
    font-family: 'Source Han Sans CN-Bold';
    font-weight: bold;
    font-size: 18px;
    color: #384951;
    line-height: 20px;
}

.left_top_legend {
    height: 60px;
    font-size: 14px;
    font-weight: 400;
    color: #636676;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20%;
}

.left_top_legend div,
.percent_legend div {
    padding-left: 16px;
    position: relative;
    width: 100%;
    text-align: left;
}

.left_top_legend div::before,
.percent_legend div::before {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    left: 0;
    top: 6px
}

.left_top_legend div:nth-child(1)::before,
.percent_legend div:nth-child(1)::before {
    background-color: #FC8280;
}

.left_top_legend div:nth-child(2)::before,
.percent_legend div:nth-child(2)::before {
    background-color: #BE2ECD;
}

.left_top_legend div:nth-child(3)::before,
.percent_legend div:nth-child(3)::before {
    background-color: #A241EA;
}

.sleep_list_footer {
    display: flex;
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    color: #929FAF;
    justify-content: space-between;
    margin-top: 12px
}

.font_bold {
    font-weight: bold;
    color: #384951;
}

.sleep_list {
    height: calc(100% - 174px);
    /* background-color: #000; */
    width: 100%;
    display: flex;
}

.sleep_item {
    height: 100%;
}

.border {
    border: 1px solid #EEEEEE;
    border-radius: 8px;
}

.left_score_box {
    position: relative;
    padding-left: 44px;
}

.tips_icon_score {
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    cursor: pointer;
}

.score_content_box {
    text-align: center;
    color: #636676;
    font-size: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.score_value {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
    font-weight: bold;
    color: #384951;
    font-size: 54px;
    margin-right: 10px;
}

.sleep_percent_box {
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 12px 24px;
}

.sleep_percent_box>div {
    height: 100%;
}

.percent_legend {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.percent_legend .percent_value {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
    font-weight: bold;
    display: inline-block;
    width: 50px;
    text-align: center;
}

.sleep_time_value_box {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 8px 38px;
    text-align: center;
    font-size: 14px;
    color: #929FAF;
    background-color: #F5F7FB;
    border-radius: 8px
}

.sleep_time_title {
    color: #636676;
}

.sleep_time_num {
    font-size: 20px;
    font-family: 'Source Han Sans CN-Bold';
    color: #384951;
    font-weight: bold;
    margin-top: 4px;
    width: 34px;
    text-align: center;
    display: inline-block;
}

.week_sleep_chart {
    width: 100%;
    height: calc(100% - 60px);
}

.tab_box {
    background-color: #E6FDED;
    border-radius: 8px;
    display: flex;
}

.tab_item {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #00B528;
    padding: 0 16px;
    cursor: pointer;
}

.active_tab_item {
    background-color: #00B528;
    color: #fff;
    border-radius: 8px;
}

.rigth_bottom_data_box {
    margin: 30px 0 0;
    height: 68px;
    display: flex;
    justify-content: space-between;
    padding: 0 84px;
    align-items: center;
    background-color: #F5F7FB;
    border-radius: 8px;
    font-size: 12px;
    color: #929FAF;
    text-align: center;
}

.line {
    border-right: 1px solid #D9D9D9;
    height: 24px;
}

.body_data_value {
    font-family: 'Alibaba PuHuiTi 3.0-85 Bold';
    font-size: 20px;
    color: #384951;
    font-weight: bold;
    margin-right: 4px;
}

.mb4 {
    margin-bottom: 4px;
}

.line_chart {
    width: 100%;
    height: 100%;
}

.box_height {
    width: 100%;
    height: calc(100% - 128px - 18px);
}

.chart_x_date {
    padding-left: 30px;
    font-size: 12px;
    font-weight: 400;
    color: #929FAF;
    height: 18px;
    line-height: 18px;
}
</style>
