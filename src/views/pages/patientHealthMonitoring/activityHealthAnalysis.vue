<template>
    <header class="header"></header>
    <div class="sf">
        <template v-if="!showInner">
                    <div class="search_box flex_space_between">
                <div class="flex_start">
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
                </div>
            </div>
            <div class="table_box">
                <el-table :data="tableData" border style="width: 100%" size="large" v-loading="tableLoading">
                    <el-table-column prop="name" label="姓名" align="center" width="160"></el-table-column>
                    <el-table-column label="年龄" align="center" width="120">
                        <template #default="props">
                            {{ computedAge(props.row.birthday) }} </template>
                    </el-table-column>
                    <el-table-column prop="bed_number" label="床位号" align="center" width="120"></el-table-column>
                    <el-table-column prop="exercise_safety_heartrate" label="运动安全心率（次/分）" align="center">
                        <template #default="props">
                            {{ computedSafetyHeartrate(props.row.birthday) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="today_walk" label="今日步数（步）" align="center"></el-table-column>
                    <!-- <el-table-column prop="today_walk" label="昨日步数（步）" align="center"></el-table-column> -->
                    <el-table-column prop="calorie" label="消耗卡路里（kcal）" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template #default="props">
                            <el-button plain type="success" @click="openDetail(props.row)">历史活动报告</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                    :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </template>

        <template v-else>
            <div>
                <activity_inner :patientInfo="patientInfo" @handleBackBtn="handleBackBtnFn"></activity_inner>
            </div>
        </template>
</div>
</template>
<script setup lang='ts'>
import SportApi from '@/api/sport';
import type { Pagination } from '@/interface/interface';
import { getCookie } from '@/utils/cookie/cookie';
import { nextTick, onMounted, reactive, ref } from 'vue';
import activity_inner from "@/components/activity_inner.vue";

const admin = JSON.parse(getCookie('admin') as string)
// 搜索
const search_form = ref<any>({
    name: "",
    bed_number: "",
    bind:'0'
})
const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}

const reset = () => {
    search_form.value.name = ''
    search_form.value.bed_number = ''
    search_form.value.bed_number = ''
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}
//计算年龄
const computedAge = (birthday: string) => {
    return birthday ? ((new Date().getTime() - new Date(birthday).getTime())) / 86400000 < 365 ?
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

// 计算运动安全心率
const computedSafetyHeartrate = (birthday: string) => {
    let age = 55
    if (birthday) {
        let todayDate = new Date()
        let birthDate = new Date(birthday)
        age = todayDate.getFullYear() - birthDate.getFullYear()
        if (todayDate.getMonth() < birthDate.getMonth() || (todayDate.getMonth() == birthDate.getMonth() && todayDate.getDate() < birthDate.getDate())) {
            age -= 1
        }
        return Math.floor((180 - age) * 0.8)
    }
}

const handleSizeChange = (val: number) => {
    pageQuery.perPage = val
    fetchData()
}
const handleCurrentChange = (val: number) => {
    pageQuery.page = val
    fetchData()
}
 
// 运动统计
let patientInfo = ref({});
let showInner = ref<boolean>(false);

const openDetail = (row:any) =>{
      patientInfo.value = row;
      showInner.value = true;
}

const handleBackBtnFn = () =>{
      showInner.value = false;
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
        bind: search_form.value.bind,
        perPage:pageQuery.perPage,
        page:pageQuery.page
    }
    const result = (await SportApi.sportDataList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData = result.data
    }
}

// const openDetail = (item: any) => {
//     detailDate.value = dateFtt('yyyy-mm-dd', new Date())
//     detailDailogFlag.value = true
//     detailItem.value = item
//     fetchDetailData()
// }



onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.custom_title {
    color: #252b50;
    font-size: 24px;
    font-weight: bolder;
    margin-right: 40px;
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
    border: 1px solid #F5F7FB;
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
    width: 520px;
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
    background-color: #F5F7FB;
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
    background-color: #00B528;
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
    margin-top: 36px
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
    background-color: #00B528;
}

.legend .legend_item:nth-child(3) .legend_icon {
    background-color: #FF7D01;
}

.rank_list {
    padding-top: 16px;
    height: calc(100% - 24px)
}

.rank_item {
    height: calc(100% / 5);
    width: 100%;
    padding: 0 24px;
    font-size: 14px;
    color: #384951;
}

.rank_item:nth-child(2n) {
    background-color: #F5F7FB;
}

.rank_item:nth-child(2n-1) {
    background-color: #FBFCFF;
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
</style>
