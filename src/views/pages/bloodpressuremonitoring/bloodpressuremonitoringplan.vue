<template>
  <main class="main">
    <nav class="nav">
      <div>
        <span>姓名:</span>
        <el-input v-model="queryParams.name" placeholder="请输入"></el-input>
      </div>
      <p>
        <el-button
          size="large"
          type="primary"
          ghost
          @click="searchList()"
          >查询</el-button
        >
        <el-button
          size="large"
          type="info"
          ghost
          @click="initList()"
          >重置</el-button
        >
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
          <span v-if="item.status == openMode.QH">QH监测模式开启</span>
          <span v-if="item.status == openMode.TID">TID监测模式开启</span>
          <span style="color: #384951" v-if="item.status == openMode.noOpen">未开启血压监测</span
          >
        </div>

        <div class="gridItem_btns">
          <div
            :class="{ active: item.status == openMode.QH }"
            @click="handleBtn('QH', item)"
          >
            QH监测模式
          </div>
          <div
            :class="{ active: item.status == openMode.TID }"
            @click="handleBtn('TID', item)"
          >
            TID监测模式
          </div>
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

  </main>

  <footer>
    <custom-dialog title="QH监测模式" v-model="dialogVisible" :width="`${(640 / 1920) * 100}%`">
      <div class="dialog-content" v-loading="opendialogLoading">
        <div class="warning-txt">
          <span style="color: red">*</span>
          QH监测模式为按间隔时段测量。开启后，将在60分钟后进行首次测量，QH监测至少持续24小时，期间请勿关闭功能，时间到后将会进行霸屏提醒。
        </div>

        <div>
          <div>
            <span class="dialogLabel">夜间睡眠勿扰：</span>
            <el-switch
              v-model="dialogObj.isSleepOpen"
              :disabled="dialogObj.status == openMode.QH"
              class="ml-2px"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #636676;
              "
            />
          </div>
          <div>
            <span class="dialogLabel">测量间隔频率：</span>
            <span class="dialogValue" >{{ Math.floor(dialogObj.airbagBlood / 60) }} 分钟</span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div
            class="close-btn"
            @click="confirmTwo('toConfirm', dialogTitleEnum.QHTITLE)"
            v-if="dialogObj.status == openMode.QH"
          >
            关闭监测
          </div>
          <div
            class="confirm-btn"
            @click="openQhMode()"
            v-if="
              dialogObj.status == openMode.noOpen ||
              dialogObj.status == openMode.TID
            "
          >
            开启监测
          </div>
        </span>
      </template>
    </custom-dialog>

    <custom-dialog title="TID监测模式" v-model="dialogVisibleTID"  :width="`${(640 / 1920) * 100}%`">
      <div class="dialog-content-tid">
        <div class="warning-txt">
          <span style="color: red">*</span>
          TID监测模式为长时程按定时计划测量，开启后每日三次，在定时时间自动进行测量，结束监测后请关闭功能。
        </div>

        <div>
          <div class="confirm-btn mt20px mb-20px" @click="updatePlantime">
            修改计划时间
          </div>
          <el-table
            :data="dateList"
            row-class-name="h64px"
            border
            v-loading="timerloading"
            class="tableshadow"
          >
            <el-table-column prop="index" label="序号" align="center" />
            <el-table-column prop="time" label="计划时间" align="center" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div
            class="close-btn"
            @click="confirmTwo('toConfirm', dialogTitleEnum.TIDTITLE)"
            v-if="dialogObj.status == openMode.TID"
          >
            关闭监测
          </div>
          <div
            class="confirm-btn"
            @click="openTidMode()"
            v-if="
              dialogObj.status == openMode.noOpen ||
              dialogObj.status == openMode.QH
            "
          >
            开启监测
          </div>
        </span>
      </template>
    </custom-dialog>

    <custom-dialog title="TID监测模式" v-model="updateTimeDialog"  :width="`${(640 / 1920) * 100}%`">
      <div class="container_update">
        <template v-for="(item, index) in timeComputed">
          <div :class="{ m24: index === 1 }" class="container_update_item">
            <div class="jctime">监测时间{{ index + 1 }}:</div>
            <div class="timeInput">
              <el-input
                type="text"
                class="int"
                v-model="item.hour1"
                @input="checkInput($event, index)"
              ></el-input>
              <div class="gapspan">:</div>
              <el-input
                type="text"
                class="int"
                v-model="item.hour2"
                @input="checkInput($event, index)"
              ></el-input>
            </div>
            <div class="item_error" v-if="item.error">时间格式不合法</div>
          </div>
        </template>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="cancel-btn" @click="updateTimeDialog = false">取消</div>
          <div class="confirm-btn" @click="saveTime()">保存</div>
        </span>
      </template>
    </custom-dialog>

    <custom-dialog
      :title="dialogConfirmTitle"
      v-model="delDialogVisible"
      width="640px"
    >
      <div class="container_del" v-loading="closeloading">
        {{
          dialogConfirmTitle === dialogTitleEnum.QHTITLE
            ? "确认关闭QH模式血压监测？"
            : "确认关闭TID模式血压监测？"
        }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="cancel-btn" @click="confirmTwo('Confirm')">取消</div>
          <div class="confirm-btn" @click="closeMode()">确认</div>
        </span>
      </template>
    </custom-dialog>
  </footer>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, nextTick, computed } from "vue";
import type { bloodpressuremonitoringplan } from "@/interface/bloodpressuremonitoring";
import dynamicMonitoringApi from "@/api/dynamicMonitoring";
import { openMode, dialogTitleEnum } from "@/interface/bloodpressuremonitoring";
import { useLimitPage } from "@/hooks/useLimitPage";
import { ElMessage } from "element-plus";
const queryParams = reactive({
  // inOrOut: "",
  // bindStatus: "",
  name: "",
  // bedNumber: "",
  page: 1,
  perPage: 15,
});
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<bloodpressuremonitoringplan[]>([]);
const initList = () => {
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
    let { data } = await dynamicMonitoringApi.getPlanBpList({
      ...queryParams,
      page,
    });
    let _arr =
      data.result?.data?.map((item: any) => {
        return {
          id: item.id, // 监测
          name: item.name, // 姓名
          ccid: item.ccid,
          bedNumber: item.bed_number, // 床位号,
          isSleepOpen: item.sleep_stop_call_status === 1 ? true : false, // 夜间睡眠勿扰
          status: handleStatus(item.qt_status, item.tid_status), // 状态
          airbagBlood: item.airbag_blood, // 时间段
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

const hasMore = () => tableData.value.length < total.value;

const handleStatus = (qt_status: number, tid_status: number) => {
  if (qt_status === 1) {
    return openMode.QH;
  }
  if (tid_status === 1) {
    return openMode.TID;
  }
  return openMode.noOpen;
};

const { resetPage } = useLimitPage(getList, hasMore);
resetPage();


let dialogVisible = ref(false);
let delDialogVisible = ref(false);
let dialogObj = ref({
  id: 0,
  status: 0,
  isSleepOpen: false,
  ccid: "",
  airbagBlood: 0,
});
let dialogVisibleTID = ref(false);
let updateTimeDialog = ref(false);
let dateList = ref<{ index: number; time: string }[]>([
  {
    index: 1,
    time: "09:00",
  },
  {
    index: 2,
    time: "12:00",
  },
  {
    index: 3,
    time: "16:00",
  },
]);
let dialogConfirmTitle = ref("");
let timerloading = ref(false);
const handleBtn = async (type: string, item: bloodpressuremonitoringplan) => {
  dialogObj.value = item;
  if (type === "QH") {
    dialogVisible.value = true;
    return;
  }
   dialogVisibleTID.value = true;
   timerloading.value = true;
   try {
      let _d = {
          ccid: dialogObj.value.ccid,
          type: 2
        };
        let { data } = await dynamicMonitoringApi.planDetails(_d);
        if(data.result?.plan_data){
          let _a = JSON.parse(data.result.plan_data);
            dateList.value = 
            _a.map((item: any, index: number) => {
                return {
                  index: index + 1,
                  time: item,
                };
            })
        }else{
          dateList.value = [
              {
                index: 1,
                time: "09:00",
              },
              {
                index: 2,
                time: "12:00",
              },
              {
                index: 3,
                time: "16:00",
              },
          ];
        }
        timerloading.value = false;
   } catch (error) {
      timerloading.value = false;
       dateList.value = [
              {
                index: 1,
                time: "09:00",
              },
              {
                index: 2,
                time: "12:00",
              },
              {
                index: 3,
                time: "16:00",
              },
          ];
   }
 
};

// 关闭监测
const confirmTwo = (type: string, confirmTitle?: string) => {
  if (type === "toConfirm") {
    dialogConfirmTitle.value = confirmTitle!;
    if (dialogConfirmTitle.value === dialogTitleEnum.QHTITLE) {
      dialogVisible.value = false;
    }
    if (dialogConfirmTitle.value === dialogTitleEnum.TIDTITLE) {
      dialogVisibleTID.value = false;
    }
    delDialogVisible.value = true;
    return;
  }
  delDialogVisible.value = false;
  if (dialogConfirmTitle.value === dialogTitleEnum.QHTITLE) {
    dialogVisible.value = true;
  }
  if (dialogConfirmTitle.value === dialogTitleEnum.TIDTITLE) {
    dialogVisibleTID.value = true;
  }
};

const updatePlantime = () => {
  if( dialogObj.value.status == openMode.noOpen || dialogObj.value.status == openMode.QH){
       return ElMessage.error("TID模式关闭下无法修改计划时间");
  }
  dialogVisibleTID.value = false;
  updateTimeDialog.value = true;
};
type time = {
  hour1: string;
  hour2: string;
  error: boolean;
};
let timearr = ref<time[]>([]);

let timeComputed = computed(() => {
  timearr.value = [];
  for (let i = 0; i < dateList.value.length; i++) {
    timearr.value.push({
      hour1: dateList!.value[i]!.time.split(":")[0] as string,
      hour2: dateList!.value[i]!.time.split(":")[1] as string,
      error: false,
    });
  }
  return timearr.value;
});

let checkInput = (e: any, index: number) => {
  let value = timeComputed.value[index]!.hour1 + ":" + timeComputed.value[index]!.hour2;
  const strictTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
  timearr.value[index]!.error = !strictTimeRegex.test(value);
};

let saveTime = async () => {
  let errorFlag = timeComputed.value.some((item) => item.error);
  if (errorFlag) {
    return;
  }
  try {
    updateTimeDialog.value = false;
    dialogVisibleTID.value = true;
    timerloading.value = true;
    let _d = {
      ccid: dialogObj.value.ccid,
      patient_id: dialogObj.value.id,
      type: 2,
      sleep_switch: dialogObj.value.isSleepOpen ? 1 : 0,
      plan_data: timeComputed.value.map(
        (item) => item.hour1 + ":" + item.hour2
      ),
    };
    let { data } = await dynamicMonitoringApi.editTid(_d);
      dateList.value =  
        timearr.value.map((item: any, index: number) => {
          return {
            index: index + 1,
            time: item.hour1 + ":" + item.hour2
          };
        });
    // plan_data
    timerloading.value = false;
  } catch (error) {
    timerloading.value = false;
  }
};

let opendialogLoading = ref(false);
//
const openQhMode = async () => {
  try {
     opendialogLoading.value = true;
  await dynamicMonitoringApi.startQh({
    ccid: dialogObj.value.ccid,
    sleep_stop_call_status: dialogObj.value.isSleepOpen ? 1 : 0,
     patient_id: dialogObj.value.id
  });
  initList();
  opendialogLoading.value = false;
  dialogVisible.value = false;
  } catch (error) {
      initList();
  opendialogLoading.value = false;
  dialogVisible.value = false;
  }
 
};

let closeloading = ref(false);
const closeMode = async () => {
  closeloading.value = true;
  try {
    if(dialogConfirmTitle.value === dialogTitleEnum.QHTITLE){
       await dynamicMonitoringApi.endQh({ ccid: dialogObj.value.ccid });
    }else{
       await dynamicMonitoringApi.endTid({
        patient_id: dialogObj.value.id,
        type: 2,
        ccid: dialogObj.value.ccid
      });
    }
     initList();
    closeloading.value = false;
    delDialogVisible.value = false;
  } catch (error) {
      closeloading.value = false;
  }
 

};

const openTidMode = async () => {
    try {
       timerloading.value = true;
          await dynamicMonitoringApi.startTid({ 
            ccid: dialogObj.value.ccid,
            patient_id: dialogObj.value.id,
            type: 2
           });
          initList();
          timerloading.value = false;
          dialogVisibleTID.value = false;
    } catch (error) {
       timerloading.value = false;
       initList();
      timerloading.value = false;
      dialogVisibleTID.value = false;
    }
}
</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
.nav_btn_confirm {
  width: 101px;
  height: 48px;
  background: #24B287;
  border-radius: 4px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  user-select: none;
  box-shadow: none;
  border: none;
}
.item_error {
  font-size: 12px;
  color: #f7413d;
  position: absolute;
  bottom: -15px;
  left: 0;
}
.container_update_item {
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
  border-radius: 4px;
  color: #ffffff;
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

.gridContainer {
  /* min-height: 300px; */
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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
.active {
  background: #24B287 !important;
  color: #fff !important;
}

.dialog-content {
  width: 480px;
  margin: 30px 80px;
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
.jctime {
  font-size: 16px;
  color: #636676;
  margin-bottom: 8px;
}
.m24 {
  margin: 24px 0;
}
.timeInput {
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gapspan {
  width: 40px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #636676;
  flex-shrink: 0;
}
.int {
  height: 100%;
  flex: 1;
}
:deep(.int .el-input__inner) {
  text-align: center;
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
</style>
