<template>

  <main class="main">
    <nav class="nav">
      <div>
        <span>姓名:</span>
        <el-input v-model="queryParams.name" placeholder="请输入"></el-input>
      </div>
       <p class="search_btn_box">
                <el-button type="primary"  size="large"  @click="searchList()">查询</el-button>
                <el-button type="info"  size="large"  @click="initList()">重置</el-button>
       </p>
    </nav>

    <div class="gridContainer clearfix">
      <div class="gridItem" v-for="item in tableData">
        <div class="gridItem_title">
          <span>{{ item.bedNumber }}</span>
          <span>{{ item.name }}</span>
        </div>
        <div class="gridItem_content">
          <div class="ccid">CCID</div>
          <div class="ccid_value">{{ item.ccid }}</div>
        </div>
        <div class="qhtxt">
          <span v-if="item.status == openModeEcg.OPEN">监测计划已开启</span>
          <span v-else style="color: rgb(56, 73, 81);">监测计划未开启</span>
        </div>

        <div class="gridItem_btns">
          <div
            :class="{ active: item.status == openModeEcg.OPEN }"
            @click="handleBtn(item)"
          >
            监测计划 
          </div>
        </div>
      </div>
    </div>
     <div class="list_no_data" v-if="tableData.length === 0 && !tableLoading">
      <img src="@/assets/images/nodata.png" />
      <div>未查询到相关信息~</div>
    </div>
    <div v-loading="tableLoading" element-loading-text="正在加载..."></div>
  </main>

  <footer>
    <custom-dialog title="心电监测计划" v-model="dialogVisible" :width="`${(640 / 1920) * 100}%`">
      <div class="dialog-content">
        <div class="warning-txt">
          <span style="color: red">*</span>
            心电监测模式为定时开启测量。开启和更新计划后，将在每日设定时间进行测量。
        </div>
         <div class="container_update_item" v-loading="testloading">
            <div class="jctime">测量时间:</div>
            <div class="timeInput">
              <el-input type="text" class="int" v-model="test.hour1" @input="checkInput()" :disabled="currentItem?.status == openModeEcg.OPEN"></el-input>
              <div class="gapspan">:</div>
              <el-input type="text" class="int" v-model="test.hour2" @input="checkInput()" :disabled="currentItem?.status == openModeEcg.OPEN"></el-input>
            </div>
                <div class="item_error" v-if="test.error">时间格式不合法</div>
          </div>

        <div class="tip_txt">
          <span style="color: red;">*</span>
           请按24小时制时间填写
        </div>

      </div>
      <template #footer>
        <span class="dialog-footer">
          <div
            class="close-btn"
             @click="confirmTwo('toConfirm')"
            v-if="currentItem?.status == openModeEcg.OPEN"
          >
            关闭定时测量
          </div>
          <div
            class="confirm-btn"
            @click="openModeEcgFn"
             v-if="currentItem?.status == openModeEcg.CLOSE"
          >
            开启定时测量
          </div>
        </span>
      </template>
    </custom-dialog>


    <custom-dialog
      title="关闭心电监测计划"
      v-model="delDialogVisible"
      :width="`${(640 / 1920) * 100}%`"
      @close="confirmTwo('Confirm')"
    >
      <div class="container_del" v-loading="closePlanLoading">
       确认关闭心电监测计划监测？
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="cancel-btn" @click="confirmTwo('Confirm')">取消</div>
          <div class="confirm-btn" @click="closePlan()">确认</div>
        </span>
      </template>
    </custom-dialog>

  </footer>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, nextTick, computed } from "vue";
import type { electrocardiogramMonitoringplan } from "@/interface/electrocardiogramMonitoringplan";
import { openModeEcg } from "@/interface/electrocardiogramMonitoringplan";
import dynamicMonitoringApi from "@/api/dynamicMonitoring";
import { useLimitPage } from "@/hooks/useLimitPage";
import axios from "axios";
const queryParams = reactive({
  name: "",
  page: 1,
  perPage: 15,
});

let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<electrocardiogramMonitoringplan[]>([]);


const searchList = () => {
   tableLoading.value = true;
  tableData.value = [];
  resetPage();
};

const initList = () => {
   tableLoading.value = true;
  queryParams.name = "";
  tableData.value = [];
  resetPage();
};

async function getList(page: number) {
  try {
       tableLoading.value = true;
    let { data } = await dynamicMonitoringApi.getPlanEcgList({
      ...queryParams,
      page,
    });
    let _arr = data.result?.data?.map((item: any) => {
        return {
          id: item.id, // 监测
          name: item.name, // 姓名
          ccid: item.ccid,
          bedNumber: item.bed_number, // 床位号,
          status: handleStatus(item.ecg_status) // 状态
        };
      }) ?? [];
       if (page === 1) {
        tableData.value = _arr;
      } else {
        tableData.value = [...tableData.value, ..._arr];
      } 
    total.value = data.result?.total || 0;
  } catch (error) {
    console.log(error);
  } finally {
    tableLoading.value = false;
  }
}




const handleStatus = (ecg_status: number) => {
  if (ecg_status === 1) {
    return openModeEcg.OPEN;
  }
  return openModeEcg.CLOSE;
};

const hasMore = () => tableData.value.length < total.value;
const { resetPage } = useLimitPage(getList, hasMore);
  resetPage();



const test = reactive({
  hour1: "00",
  hour2: "00",
  error: false
});

const dialogVisible = ref(false);
const currentItem = ref<electrocardiogramMonitoringplan>();
const handleBtn = async (item: electrocardiogramMonitoringplan) => {
  currentItem.value = item;
  dialogVisible.value = true;
   testloading.value = true;
   try {
      let _d = {
          ccid: item.ccid,
          type: 1
        };
        let { data } = await dynamicMonitoringApi.planDetails(_d);
        if(data.result?.plan_data){
            let [hour1, hour2] = data.result.plan_data.split(":");
            test.hour1 = hour1;
          test.hour2 = hour2;
        }else{
          test.hour1 = "00";
          test.hour2 = "00";
        }
        testloading.value = false;
   } catch (error) {
      testloading.value = false;
      test.hour1 = "00";
  test.hour2 = "00";
   }
    
  
  test.error = false;
};
let delDialogVisible = ref(false);

let checkInput = () => {
  let value = test.hour1 + ":" + test.hour2;
  const strictTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/; 
  test.error = !strictTimeRegex.test(value);  
}

// 关闭监测
let dialogLock = ref(false);
const confirmTwo = (type: string) => {
     if(type === "toConfirm"){
        dialogVisible.value = false;
        delDialogVisible.value = true;
     }
     if(type === "Confirm"){
        delDialogVisible.value = false;
        dialogVisible.value = true && !dialogLock.value;
        dialogLock.value = false;
     }    
};


let testloading = ref(false);
const openModeEcgFn = async () => {
  checkInput();
  if (test.error) {
    return;
  }
  testloading.value = true;
  try {
    let hour = test.hour1 + ":" + test.hour2;
   await dynamicMonitoringApi.startEcg({
    ccid: currentItem.value!.ccid,
    patient_id: currentItem.value!.id,
    type: 1,    
    plan_data: hour
  });
  await dynamicMonitoringApi.editEcg({
    ccid: currentItem.value!.ccid,
    patient_id: currentItem.value!.id,
    type: 1,    
    plan_data: hour
  });
   initList();
     testloading.value = false;
     dialogVisible.value = false;
  } catch (error) {
     testloading.value = false;
  }
};



let closePlanLoading = ref(false);
const closePlan = async () => {
      closePlanLoading.value = true;
      try {
        await dynamicMonitoringApi.endEcg({
          patient_id: currentItem.value!.id,
          type: 1,
          ccid: currentItem.value!.ccid
        });
        initList();
        closePlanLoading.value = false;
        dialogLock.value = true;
        delDialogVisible.value = false;
      } catch (error) {
        closePlanLoading.value = false;
      }
}






</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
.confirm-btn{
  background-color: #24B287;
}
.nav_btn_confirm {
  width: 101px;
  height: 48px;
  background: #24B287;
  border-radius: 8px 8px 8px 8px;
  color: #ffffff;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  user-select: none;
  box-shadow: none;
  border: none;
}
.item_error{
  font-size: 12px;
  color: #f7413d;
  position: absolute;
  bottom: -15px;
  left: 0;
}
.container_update_item{
   position: relative;
}
.update_btn,
.update_btn:hover {
  width: 90px;
  height: 32px;
  background: #e6fded;
  border-radius: 8px 8px 8px 8px;
  font-size: 16px;
  color: #24B287;
  user-select: none;
  box-shadow: none;
  border: none;
}

.del_btn,
.del_btn:hover {
  width: 57px;
  height: 32px;
  background: #ffece6;
  border-radius: 8px 8px 8px 8px;
  font-size: 16px;
  color: #f7413d;
  user-select: none;
  box-shadow: none;
  border: none;
}
.update_btn:active {
  background-color: #24B287;
  color: #fff;
}
.del_btn:active {
  background-color: #f7413d;
  color: #fff;
}
.h64 {
  height: 64px;
}
.nav_btn_confirm:hover {
  background-color: #24B287;
  opacity: 0.8;
}

.nav_btn_reset:hover {
  background-color: #929faf;
  opacity: 0.8;
}

.nav_btn_reset {
  width: 101px;
  height: 48px;
  background: #929faf;
  border-radius: 8px 8px 8px 8px;
  color: #ffffff;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  user-select: none;
  box-shadow: none;
  border: none;
}
.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}

.main {
  padding: 24px 24px 24px 24px;
}
.nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  background-color: #fff;
  gap: 12px;
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

:deep(.el-input__wrapper) {
  box-shadow: none;
  background-color: #f5f7fb;
}

.gridItem {
  padding: 20px;
  background-color: #fff;
  width: calc((100% - 80px) / 5);
  height: 258px;
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
}
.gridItem:nth-child(5n) {
  margin-right: 0;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.gridContainer {
  /* min-height: 300px; */
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
}
.ccid {
  font-size: 14px;
  color: #929faf;
}
.ccid_value {
  font-size: 16px;
  color: #384951;
}
.gridItem_content {
  margin-bottom: 0px;
}
.qhtxt {
  height: 24px;
  font-size: 16px;
  color: #24B287;
  margin-bottom: 16px;
  text-align: center;
  margin-top: 25px;
}
.gridItem_btns {
 width: 114px;
 height: 38px;
 margin: 0 auto;
}
.gridItem_btns > div {
  flex: 1 0 auto;
  height: 38px;
  line-height: 38px;
  background: #f5f7fb;
  border-radius: 8px 8px 8px 8px;
  font-weight: 400;
  font-size: 14px;
  color: #929faf;
  text-align: center;
  user-select: none;
  cursor: pointer;
}
.list_no_data {
  font-size: 16px;
  color: #929faf;
  text-align: center;
  padding-top: 10vh;
}

.list_no_data img {
  width: 240px;
  margin: 0 auto;
}
.active {
  background: #24B287 !important;
  color: #fff !important;
}

.dialog-content {
  width: 480px;
  margin: 30px auto;

}
.warning-txt {
  font-size: 16px;
  color: #636676;
  margin-bottom: 70px;
}
.dialogLabel {
  font-size: 16px;
  color: #636676;
}
.dialogValue {
  font-size: 16px;
  color: #384951;
}

.close-btn {
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  background: #f7413d;
  border-radius: 8px 8px 8px 8px;
  line-height: 48px;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  padding: 0 34px;
  cursor: pointer;
  user-select: none;
  box-shadow: none;
  border: none;
}

.dialog-content-tid {
  padding: 30px 48px;
}
.mt20 {
  margin-bottom: 20px;
}
.dialog-content-tid .warning-txt {
  margin-bottom: 60px;
}
.close-btn:hover {
  opacity: 0.8;
}

.container_del {
  height: 200px;
  line-height: 200px;
  text-align: center;
  font-size: 16px;
  color: #636676;
}
:deep(.el-table__cell) {
  height: 64px !important;
}

.container_update {
  width: 480px;
  padding: 24px;
  margin: 0 auto;
}
.jctime{
  font-size: 16px;
  color: #636676;
  margin-bottom: 8px;
}
.m24{
  margin: 24px 0;
}
.timeInput{
   height: 48px;
   display: flex;
  justify-content: space-between;
  align-items: center;
}
.gapspan{
  width: 40px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #636676;
  flex-shrink: 0;
}
.int{
  height: 100%;
  flex: 1;
}
:deep(.int .el-input__inner){
  text-align: center; 
}
.tip_txt{
  font-size: 14px;
color: #929FAF;
margin-top: 10px;
}
</style>
