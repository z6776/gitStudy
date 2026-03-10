<template>
    <div class="sf">

        <div class="search_box flex_space_between bg-#fff mb-20px">

            <div class="flex_start gap-20px">
               <div class="search_item flex_start">
                    <div class="search_label">在院/离院：</div>
                    <div class="select_width_bg">
                        <el-select v-model="search_form.end_type" size="large" >
                             <el-option key="2" value="3" label="全部"></el-option>
                            <el-option key="0" value="1" label="在院"></el-option>
                            <el-option key="1" value="2" label="离院"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">患者姓名：</div>
                    <div> <el-input size="large" v-model="search_form.patient_name" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">患者ID：</div>
                    <div> <el-input size="large" v-model="search_form.patient_num" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_btn_box">
                    <el-button type="primary" size="large" @click="search">查询</el-button>
                    <el-button type="info" size="large" @click="reset">重置</el-button>
                </div>
            </div>
        </div>

        <div class="table_box">
            <el-table :data="tableData" border :style="{'width':'100%'}" size="large" v-loading="tableLoading" class="rounded-12px">
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="patient_num" label="患者ID" align="center"></el-table-column>
                <el-table-column prop="bed_number" label="床位号" align="center"></el-table-column>
                <el-table-column prop="bind_duration" label="监护时长" align="center">
                    <template #default="props">
                        {{ props.row.bind_duration ? getHour(props.row.bind_duration) : '--' }}
                    </template>
                </el-table-column>
                <el-table-column prop="emergency_phone" label="手表绑定状态" align="center">
                    <template #default="props">
                         <div>
                            <div v-if="props.row.bind===1" class="line-height-16px flex justify-center items-center">
                                   <img src="@/assets/images/V2/success.png" class="w-18px h-18px" alt="" >
                                   <span class="color-[#24B287] text-[16px]">已绑定</span>
                            </div>
                           <div v-else class="line-height-16px flex justify-center items-center">
                                   <img src="@/assets/images/V2/error.png" class="w-18px h-18px" alt="" >
                                   <span class="color-[#F04A4B] text-[16px]">未绑定</span>
                            </div>
                         </div>
                    </template>
                </el-table-column>
              
                <el-table-column label="操作" align="center" width="200">
                    <template #default="props">
                       <el-button type="primary" @click="setNursingEventsId(props.row.patient_id),setCcid(props.row.ccid),setisShowNursingEvents(true)" plain class="w-123px border-none">监护事件记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>

    <nursingEvents v-model="isShowNursingEvents" :NursingEventsId="NursingEventsId" :patient_id="NursingEventsId" :ccid="ccid"/>

    

    
</template>

<script setup lang='ts'>
import type {  Pagination } from '@/interface/interface';
import type { nursingEventRecordType } from "./types/index";
import { onMounted, reactive, ref, shallowRef } from 'vue';
import PatientApi from '@/api/patient';
import { getHour } from "@/utils/function/function";
// 监护事件记录
const useNursingEvents = ()=>{
      const isShowNursingEvents = ref(false);
      const setisShowNursingEvents = (val:boolean)=>{
          isShowNursingEvents.value = val;
      };
      const NursingEventsId = ref(0);
      const setNursingEventsId = (val:any)=>{
          NursingEventsId.value = val;
      };
      const ccid = ref("");
      const setCcid = (val:any)=>{
     
          ccid.value = val;
      };
      

      return {
          isShowNursingEvents,
          setisShowNursingEvents,
          NursingEventsId,
          setNursingEventsId,
          ccid,
          setCcid
      }
};
const {
          isShowNursingEvents,
          setisShowNursingEvents,
          NursingEventsId,
          setNursingEventsId,
          ccid,
          setCcid
      } = useNursingEvents();


// 搜索
const search_form = reactive({
    patient_name: "",
    patient_num: "",
    end_type: "1",
    visit: 0
})

const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}
 
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    search_form.patient_num = ''
    search_form.patient_name = ''
    search_form.end_type = '3'
    search_form.visit = 0
    fetchData()
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
//列表

 
const tableLoading = ref<boolean>(false)
let tableData = ref<nursingEventRecordType[]>([])

const visitCount = ref(0)
const fetchData = async (type?:Number) => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        name: search_form.patient_name,
        patient_num: search_form.patient_num,
        status: search_form.end_type=='3' ? '0' : search_form.end_type,
    }
      const result = (await PatientApi.getPatientEvent(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData.value = result.data
    }
}

onMounted(()=>{
  fetchData()
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
    margin:24px; 
}

:deep(.ep-textarea__inner){
    height:initial !important;
}
:deep(.ep-select__wrapper){
    height: initial !important;
}
:deep(.ep-input__wrapper){
    height: initial !important;
}


.patientjournal {
    height: 90px;
    width: 100%;
    background-color: #fff;
}


.wfit{
  width:fit-content !important;
}


.sf_btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    text-align: center;
    line-height: 48px;
    color: white;
    background-color: #1ab8cc;
    position: absolute;
    bottom: -2px;
}

.dia_con {
    width: 100%;
    /* height: 739px; */
    display: flex;
    box-sizing: border-box;
}

.dia_l {
    width: 177px;
    background-color: #F5F7FB;
}

.dia_l .item {
    cursor: pointer;
    background-color: #fff;
    font-size: 14px;
    color: #929FAF;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 100%;
}

.dia_con .dia_l .pitch {
    background: #24B287;
    color: #FFFFFF;
}

.item_btn {
    cursor: pointer;
    font-size: 14px;
    color: #24B287;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 100%;
}

.item_btn .text {
    color: #fff;
    background-color: #24B287;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dia_r {
    width: 688px;
}

.dia_r_box {
    padding: 24px;
    /* height: 659px; */
    box-sizing: border-box;
    overflow-y: auto;
}

.dia_r_b {
    width: 100%;
    border-top: 1px solid #EEEEEE;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
}

:deep(.dia_r_box .el-table__cell) {
    padding: 5px !important;
}
.nodata{
    padding: 24px;
}

.nodata img {
    width: 50%;
    margin: 0 auto;
    display: block;
    margin-top: 0px;
}

.nodata_add {
    text-align: center;
    margin-bottom: 48px;
}

.nodata .add {
    width: 135px;
    height: 48px;
}

.addsui {
    /* width: 100%; */
    padding: 24px 60px;
    padding-right: 20px;
}

.fk_box {
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #EEEEEE;
    padding: 24px 48px;
    margin-top: 22px;
}

.addsui .item {
    display: flex;
    margin-bottom: 12px;
}

/* .item_inp { */
/* width: 284px; */
/* } */

:deep(.patient_input_width1) {
    width: 284px !important;
}

:deep(.patient_input_width2) {
    width: 426px !important;
}

:deep(.patient_input_width3) {
    width: 120px !important;
}

:deep(.sss) {
    display: flex !important;
    align-items: center !important;
}

.deit {
    display: flex;
    justify-content: center;
}
.w100{
  width: 80px;
  text-align: right;
}

.left {
    justify-content: left;

}

.item_leb {
    margin-left: 5px;
}

.addsui ._item {
    margin-right: 48px;
}


.dialog_flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.dialog_right {
    padding-right: 20px;
    width: 60%;
}

.right_title {
    margin: 20px 0 12px;
}


.echarts_nodata img {
    width: 162px;
    margin: 0 auto;
}

.echarts_nodata p {
    font-size: 12px;
    color: #929FAF;
}

.echarts_nodata {
    text-align: center;
    height: 280px;
    padding-top: 54px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #ffffff;
}

.echart_size {
    width: 100%;
    height: 300px;
}

.report_right {
    border-radius: 10px;
    border: 1px solid #eaeaea;
    padding: 12px;
    width: calc(100% - 234px);
}

.select_width{
    width: 220px;
} 
.select_width_bg{
    width: 220px;
}

:deep(.select_width_bg .ep-select .ep-select__wrapper){
    background-color: #F5F7FB !important;
    height: 48px !important;
}
:deep(.search_item .ep-input__inner){
    height: 48px;
}
:deep(.select_width .ep-select .ep-select__wrapper){
    background-color: #fff !important;
    height: 48px !important;
}

.date_search_box {
    background-color: #F5F7FB;
    padding: 9px 24px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-top: 10px;
}

.report_left {
    background-color: #F5F7FB;
    border-radius: 5px;
    width: 224px;
    padding: 12px;
}

.left_title {
    font-size: 16px;
    font-weight: bold;
    color: #07C160;
    margin-bottom: 12px;
}

.left_content_box {
    padding: 8px;
    border-radius: 4px;
    background-color: #ffffff;
}

.left_data_box_title img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.left_content_box .d_name {
    /* width: 184px; */
    height: 24px;
    line-height: 24px;
    color: #384951;
    font-size: 16px;
}

.left_content_box .unit {
    height: 24px;
    font-size: 16px;
    color: #929FAF;
    line-height: 24px;
}

.left_value_box {
    height: 48px;
    line-height: 48px;
    font-size: 24px;
    color: #384951;
    font-weight: bold;
    border-bottom: 1px solid #EEEEEE;
    margin-bottom: 12px;
    text-align: center;
}

.avg_data {
    text-align: center;
}

.avg_data .value {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    font-weight: bold;
    color: #384951;
}

.avg_data .text {
    font-size: 12px;
    font-weight: 400;
    color: #929FAF;
}

.mb_8 {
    margin-bottom: 8px;
}

.table_height {
    max-height: 60px;
    overflow-y: auto;
}

.table_height::-webkit-scrollbar {
    width: 1px;

}

.table_height::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* 滑块颜色 */
    border-radius: 10px;
    /* 滑块圆角 */
}

.table_height::-webkit-scrollbar-track {
    background: #e1e1e1;
    /* 轨道颜色 */
}
</style>