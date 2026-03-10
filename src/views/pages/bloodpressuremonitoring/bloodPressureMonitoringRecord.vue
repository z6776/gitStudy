<template>
  <div class="main">
    <div class="s-list flex_start bg-fff w-100%">
      <div class="label fs-0">在院/离院:</div>
      <div class="nav_select w-200px">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option
            v-for="plan in inOrOutOptions"
            :key="plan.id"
            :label="plan.name"
            :value="plan.id"
          />
        </el-select>
      </div>
      <div class="label fs-0">绑定状态:</div>
      <div class="nav_select  w-200px">
        <el-select v-model="queryParams.bind" placeholder="请选择" clearable>
          <el-option
            v-for="plan in bindStatusOptions"
            :key="plan.id"
            :label="plan.name"
            :value="plan.id"
          />
        </el-select>
      </div>
      <div class="label fs-0">患者姓名:</div>
      <el-input
        placeholder="请输入患者姓名"
        v-model="queryParams.name"
        class="intput_300_F5F7FB border-none"
        @keyup.enter="searchList()"
      >
      </el-input>

      <div class="label fs-0 m-r-12">CCID:</div>
      <el-input
        placeholder="请输入CCID"
        v-model="queryParams.ccid"
        class="intput_300_F5F7FB border-none mr-10px"
        @keyup.enter="searchList()"
      >
      </el-input>
      <el-button type="primary" @click="searchList()" size="large">搜索</el-button>
       <el-button type="info" @click="initList()" size="large">重置</el-button>
    </div>

      <div class="d-list">
        <div class="d-item" v-for="(item, index) in tableData" :key="index">
          <div class="gridItem_title">
            <span>{{ item.bed_number }}</span>
            <span>{{ item.name }}</span>
          </div>

          <div class="lastResult">上次监测时间</div>

          <div class="time">{{ dateFtt("yyyy/mm/dd hh:MM",item.insert_time) }}</div>
          <div class="lastResult">上次监测结果</div>
          <div class="dataList">
            <div
              class="listitem"
              v-for="(n, index) in items(item)"
              :key="index"
            >
              <span class="label">{{ n.label || "--" }}</span>
              <span class="value">{{ n.value || "--" }}</span>
            </div>
          </div>
          <div class="ccidLabel">CCID</div>
          <div class="ccid">
            {{ item.ccid }}
          </div>

          <div class="btn-group">
            <div class="btn2" @click="openPlanGroup(item)">监测记录</div>
          </div>
        </div>
      </div>
      <div class="list_no_data" v-if="tableData.length === 0 && !tableLoading">
        <img src="@/assets/images/nodata.png" />
        <div>未查询到相关信息~</div>
      </div>
      <div
        v-loading="tableLoading"
        element-loading-text="正在加载..."
      ></div>
  </div>

  <custom-dialog
    v-model="groupdialog"
    title="血压监测记录"
    width="1000px"
    class="ecg-dialog"
    :modals-lock-scroll="false"
  >
    <div class="ecg-content">
      <!-- 患者信息 -->
      <div class="flex_space_between">
        <div class="patient-info">
          <p>患者姓名：{{ currentPerson!.name }}</p>
          <p>CCID: {{ currentPerson!.ccid }}</p>
        </div>

        <div class="date-picker">
          <el-date-picker
            @change="(e:string)=>{ getPlanGroup(e)}"
            v-model="datevalue"
            :clearable="false"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            :prefix-icon="customPrefix"
          >
          </el-date-picker>
          <img src="@/assets/images/arrowbottom.png" class="date-icon" />
        </div>
      </div>

      <!-- 监测计划表格 -->
      <div class="table-box">
        <table
          class="table"
          v-loading="planListLoading"
          style="position: relative"
        >
          <thead
            style="
              position: sticky;
              top: 0;
              z-index: 1;
              background-color: #f5f7fb;
            "
          >
            <tr>
              <th>序号</th>
              <th>采集时间</th>
            
              <th>收缩压</th>
                <th>舒张压</th>
              <!-- <th>脉率</th> -->
              <th>脉压差</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in groupList"
              :key="item.index"
              v-if="groupList.length > 0"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ dateFtt("hh:MM",item.insert_time) }}</td>
              <td>{{ item.sbp }}</td>
                <td>{{ item.dbp }}</td>
              <!-- <td>{{  item.rate  }}</td> -->
              <td>{{ item.diff }}</td>
            </tr>

            <tr v-else>
              <td colspan="5">
                <div class="no-data">暂无数据</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </custom-dialog>
</template>

<script setup lang="ts">
import {
  bindStatusOptions,
  inOrOutOptions,
} from "@/utils/baseOptions/bloodpressuremonitoring";
import { reactive, ref, shallowRef, h } from "vue";
import type { personItem } from "@/interface/interface";
import { dateFtt } from "@/utils/date/dateFtt";
import { useLimitPage } from "@/hooks/useLimitPage";
import dynamicMonitoringApi from "@/api/dynamicMonitoring";
import ElectrocarDiographicApi from "@/api/electrocardiographic";
import axios from "axios";
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<personItem[]>([]);
let resetPageFn = ref(() => {});
const queryParams = reactive({
  status: "",
  bind: "",
  name: "",
  ccid: "",
  page: 1,
  perPage: 18,
});
const initList = () => {
  queryParams.status = "";
  queryParams.bind = "";
  queryParams.ccid = "";
  queryParams.name = "";
  tableData.value = [];
  resetPage();
};
const searchList = () => {
  tableData.value = [];
  resetPage();
};

async function getList(page: number) {
  tableLoading.value = true;
  try {
    // let { data } = await axios.get("http://localhost:3000/items",{
    //     params: {
    //         page,
    //         perPage: queryParams.perPage,
    //         name: queryParams.name,
    //         ccid: queryParams.ccid,
    //         status: queryParams.status,
    //         bind: queryParams.bind,
    //     },
    // })
    let { data } = await dynamicMonitoringApi.getPatientListBp({
      ...queryParams,
      page,
    });
    let _arr = data.result?.data;
     if (page === 1) {
        tableData.value = _arr;
      } else {
        tableData.value = [...tableData.value, ..._arr];
      } 
      

    total.value = data.result?.total || 0;
  } catch (error) {
  } finally {
    tableLoading.value = false;
  }
}

const hasMore = () => tableData.value.length < total.value;
const { resetPage } = useLimitPage(getList, hasMore);
resetPage();

let items = (item: any) => {
  return [
    { label: "收缩压", value: item.sbp },
    { label: "舒张压", value: item.dbp },
    // { label: "脉率", value: "123" },
    { label: "脉压差", value: item.bp_diff },
  ];
};

let groupdialog = ref(false);
let currentPerson = ref<personItem>();
let planListLoading = ref(false);
let groupList = ref<any[]>([]);
let datevalue = ref(new Date().toISOString().split("T")[0]);
const customPrefix = shallowRef({
  render() {
    return h("p", "");
  },
});
async function openPlanGroup(item: personItem) {
  groupdialog.value = true;
  datevalue.value = new Date().toISOString().split("T")[0];
  currentPerson.value = item;
  getPlanGroup();
}

async function getPlanGroup(date: Date | string = new Date()) {
  try {
    planListLoading.value = true;
    let result = await dynamicMonitoringApi.getrecordbp({
      patient_id: currentPerson.value!.id || "",
      ccid: currentPerson.value!.ccid || "",
      // type: 2,
      date: dateFtt("yyyymmdd", date),
    });
    if (result) {
      groupList.value = result.data?.result;
    }
    planListLoading.value = false;
  } catch (error) {
    planListLoading.value = false;
  }
}
</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
.main {
  padding: 24px;
  background-color: #f5f7fb;
}

.collect-time {
  font-weight: bold;
  font-size: 16px;
  color: #384951;
  margin-bottom: 24px;
}

.s-list .label {
  font-weight: 400;
  font-size: 16px;
  color: #636676;
  margin-right: 12px;
  margin-bottom: 0 !important;
}
.m-r-12 {
  margin-left: 12px;
}
.s-list {
  padding: 12px 24px;
}

.flex_warp {
  flex-wrap: wrap;
}

.contentwarn {
  font-weight: 500;
  font-size: 60px;
  color: #ffffff;
  width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px auto;
}

.intput_300_F5F7FB::placeholder {
  font-size: 16px;
}
.intput_300_F5F7FB {
  width: 300px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background-color: #f5f7fb !important;
  /* padding-left:12px; */
}
.d-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-top: 12px;
}
.d-item {
  min-height: 231px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px 20px;
}
.d-item .num {
  width: fit-content;
  padding: 0 12px;
  /* height: 33px; */
  background: #636676;
  border-radius: 8px 8px 8px 8px;
  font-weight: bold;
  font-size: 24px;
  color: #ffffff;
}
.d-item .name {
  font-weight: bold;
  font-size: 28px;
  color: #384951;
  margin-bottom: 40px;
}
.d-item .ccidLabel {
  font-weight: 400;
  font-size: 14px;
  color: #929faf;
  margin-bottom: 8px;
}
.d-item .ccid {
  font-weight: normal;
  font-size: 16px;
  color: #384951;
  margin-bottom: 24px;
  min-height: 24px;
}

.btn-group {
  padding-top: 12px;
  border-top: 1px solid #eeeeee;
  display: flex;
  align-items: flex-end;
}
.btn-group .btn1,
.btn-group .btn2 {
  flex: 1;
  text-align: center;
  cursor: pointer;
}
.btn-group .btn1 {
  font-weight: 400;
  font-size: 16px;
  color: #145eff;
  border-right: 1px solid #eeeeee;
}
.btn-group .btn2 {
  font-weight: 400;
  font-size: 16px;
  color: #24B287;
}
.btn-group .btn1:active,
.btn-group .btn2:active {
  background-color: #eeeeee;
}

.warning_dialog {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  backdrop-filter: blur(12px);
}

.blur {
  /* 白色半透明背景 */
  filter: blur(3px);
  /* 模糊效果 */
  overflow: hidden;
}

.warning_box {
  width: 1000px;
  height: 833px;
  background-color: #07c160;
  border-radius: 24px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.heartdialog-content {
  padding: 48px;
}

.close_icon {
  width: 48px;
  position: absolute;
  right: 30px;
  top: 30px;
}
.date-picker {
  width: 240px;
  height: 48px;
  margin-bottom: 20px;
  position: relative;
}
.date-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 40px;
  width: 20px;
  height: 20px;
}
:deep(.date-picker .el-input__wrapper) {
  background: #f5f7fb;
  height: 48px;
  width: 240px;
  box-shadow: none;
  padding-right: 33px;
}
:deep(.date-picker .el-input__inner) {
  text-align: center;
}

.text_content {
  width: 100%;
  padding: 106px 86px 0;
  font-size: 60px;
  color: #fff;
}

.text_content > div {
  height: 144px;
}

.text_content > div:last-child {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name-shrink {
  flex-shrink: 0;
}
.text_content .flex_start {
  /* align-items: center; */
  word-break: break-all;
}

.bed_number {
  font-family: "Alibaba PuHuiTi 3.0-85 Bold";
  font-size: 207px;
  /* vertical-align: bottom; */
  /* height: 144px;
    line-height: 144px; */
  margin-right: 20px;
}

.normal_text {
  font-weight: bold;
  font-size: 100px;
  color: #ffffff;
  /* line-height: 60px; */
}

.list_no_data {
  font-size: 16px;
  color: #929faf;
  text-align: center;
  padding-top: 10vh;
}


.loading {
  font-size: 24px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list_no_data img {
  width: 240px;
  margin: 0 auto;
}

.rotate_box {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  /* transition: transform ease 2s;
    transform: rotateY(0); */
  position: relative;
}

.handle_btn {
  cursor: pointer;
  width: 100%;
  height: 100%;
  border-radius: 140px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  font-size: 32px;
  background-color: #f7413d;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
}

.btn_ok {
  background-color: #17ea30 !important;
  z-index: 2 !important;

  /* transform: rotateY(180deg) */
}

.handle_btn > div:first-child {
  font-size: 50px;
  width: 50px;
  line-height: 50px;
  height: 50px;
  margin: 0 auto;
}

.btn_rotate1 {
  /* transform: rotateY(180deg) */
  animation: move1 1s linear forwards;
}

.btn_rotate2 {
  /* transform: rotateY(180deg) */
  animation: move2 1s linear forwards;
}

@keyframes move1 {
  1% {
    opacity: 1;
    transform: rotateY(0);
  }

  50% {
    opacity: 1;
  }

  50.5% {
    transform: rotateY(90deg);
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes move2 {
  1% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  50.5% {
    transform: rotateY(270deg);
    opacity: 1;
  }

  100% {
    transform: rotateY(360deg);
    opacity: 1;
  }
}

.lastResult {
  font-weight: 400;
  font-size: 14px;
  color: #929faf;
  margin-bottom: 5px;
}

.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}
.time {
  font-size: 16px;
  color: #384951;
  margin-bottom: 10px;
}
.dataList {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.dataList .listitem {
  flex: 0 0 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dataList .listitem .label {
  white-space: nowrap;
  font-weight: 600;
  font-size: 14px;
  color: #384951;
  margin-right: 0;
}
.dataList .listitem .value {
  font-weight: 600;
  font-size: 16px;
  color: #384951;
}
.dataList .listitem:not(:last-child) {
  border-right: 1px solid #eeeeee;
}
.dataList .listitem {
  padding: 0 8px;
}
.dataList .listitem:last-child {
  padding-right: 0;
}

.dataList .listitem:first-child {
  padding-left: 0;
}

.ecg-content {
  padding: 48px;
}
.patient-info p:first-child {
  margin-bottom: 8px;
}

.patient-info {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 16px;
  color: #384951;
}
</style>
<style scoped>
th {
  font-weight: bold;
  font-size: 16px;
  color: #384951;
  background-color: #f5f7fb;
  height: 56px;
  text-align: center;
}
tr:not(:last-child) {
  border-bottom: 1px solid #eeeeee;
}

td {
  text-align: center;
  font-weight: 400;
  font-size: 16px;
  color: #384951;
  height: 80px;
}

.status-executed {
  color: #24B287;
}

.status-pending {
  color: #f7413d;
}

.delete-button {
  display: block;
  line-height: 32px;
  width: 56px;
  height: 32px;
  background: #ffece6;
  border-radius: 8px 8px 8px 8px;
  color: #f7413d;
  cursor: pointer;
  user-select: none;
  margin: 0 auto;
}
.delete-button:active {
  opacity: 0.8;
}
.table-box {
  height: 272px;
  overflow-y: auto;
  padding-right: 8px;
}
.table-box table {
  width: 100%;
  border-collapse: collapse;
}

/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; /* 可根据需要调整宽度 */
  background: #e6f0ff;
  margin-left: 10px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #e6f0ff;
  border-radius: 8px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #24B287;
  border-radius: 4px;
  min-height: 70px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #24B287;
}

/* 横向滚动条（如有） */
::-webkit-scrollbar-horizontal {
  height: 12px;
}

.form-content {
  width: 400px;
  margin: 48px auto;
}
.form-content .value {
  margin-bottom: 24px;
}
.mark {
  display: inline-block;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.label {
  font-weight: bold;
  font-size: 16px;
  color: #384951;
  margin-bottom: 8px;
}
.int1 {
  width: 184px;
  height: 48px;
  background: #f5f7fb;
  border-radius: 8px 8px 8px 8px;
  font-weight: 400;
  font-size: 16px;
  color: #636676;
  text-align: center;
}
.gridItem_title {
  display: flex;
  justify-content: space-between;
  font-size: 30px;
  color: #384951;
  padding-bottom: 10px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 20px;
  font-weight: bold;
  flex-wrap: wrap;
}

:deep(.el-select__wrapper) {
  background-color: #f5f7fb;
  box-shadow: none;
  width: 150px;
  height: 48px;
}
:deep(.el-input__wrapper) {
  width: 260px;
  height: 48px;
  background-color: #f5f7fb;
  box-shadow: none;
}

:deep(.el-pagination__sizes .el-select__wrapper) {
  width: initial;
  height: initial;
}
.nav_select {
  margin-right: 10px;
}
</style>
