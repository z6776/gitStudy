<template>

  <div class="main">
    <div class="s-list flex_start bg-fff">
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
      <div class="nav_select w-200px">
        <el-select v-model="queryParams.bind" placeholder="请选择" clearable>
          <el-option
            v-for="plan in bindStatusOptions"
            :key="plan.id"
            :label="plan.name"
            :value="plan.id"
          />
        </el-select>
      </div>
      <div class="label fs-0">患者姓名</div>
      <el-input
        placeholder="请输入患者姓名"
        v-model="queryParams.name"
        class="intput_300_F5F7FB border-none"
        @keyup.enter="searchList()"
      >
      </el-input>

      <div class="label fs-0 m-r-12">CCID</div>
      <el-input
        placeholder="请输入CCID"
        v-model="queryParams.ccid"
        class="intput_300_F5F7FB border-none mr-12px"
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

        <div class="ccidLabel">CCID</div>
        <div class="ccid">
          {{ item.ccid || "" }}
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
    <div v-loading="tableLoading" element-loading-text="正在加载..."></div>
  </div>
  <custom-dialog
    v-model="groupdialog"
    title="ECG心电监测记录"
     :width="`${(1000 / 1920) * 100}%`"
    class="ecg-dialog"
    :modals-lock-scroll="false"
  >
    <div class="ecg-content">
      <!-- 患者信息 -->
      <div class="flex_space_between">
        <div class="patient-info">
          <p>患者姓名：{{ currentPerson.name }}</p>
          <p>CCID: {{ currentPerson.ccid }}</p>
        </div>

        <div class="date-picker">
          <el-date-picker
            v-model="datevalue"
            @change="(e:string)=>{ getPlanGroup(e)}"
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
              <th>采集方式</th>
              <th>监测结果</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in groupList"
              :key="index"
              v-if="groupList.length > 0"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ dateFtt('hh:MM',item.insert_time)  }}</td>
              <td>{{ item.msg_name || ""  }}</td>
              <td class="look-result" @click="openPlanResult(datevalue!, item)">
                查看结果
              </td>
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

  <custom-dialog
    v-model="heartdialog"
    title="ECG心电监测记录"
    :width="`${(1000 / 1920) * 100}%`"
    class="ecg-dialog"
    @close="() => ((heartdialog = false), (groupdialog = true))"
    :modals-lock-scroll="false"
  >
    <div class="heartdialog-content">
      <div class="collect-time">
        采集时间:{{ datevalue ? datevalue.replace(/-/g, "/") : "" }}
      </div>
      <div class="canvasBox">
        <div class="no-data" v-if="!ecglen">暂无数据</div>
           
       
        <div
          :id="'ecg-chart' + index"
          v-for="(item, index) in ecglen"
          style="
            width: 904px;
            height: 210px;
            border: 1px solid #eeeeee;
            position: relative;
            z-index: 3;
          "
        ></div>
      </div>
    </div>
  </custom-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, shallowRef, h, onUnmounted, watch,nextTick,computed ,onMounted} from "vue";
import {
  bindStatusOptions,
  inOrOutOptions,
} from "@/utils/baseOptions/bloodpressuremonitoring";
import { dateFtt } from "@/utils/date/dateFtt";
import axios from "axios";
import ElectrocarDiographicApi from "@/api/electrocardiographic";
import { useLimitPage } from "@/hooks/useLimitPage";
import type { BpmItem, personItem,GroupItem ,ResponseData} from "@/interface/interface";
import type { ElectrocardiographicSearch } from "@/interface/electrocardiographic";
import { useElectrocardiographic } from "@/hooks/useElectrocardiographic";
import dynamicMonitoringApi from "@/api/dynamicMonitoring";
import * as echarts from "echarts";
import { md5Str } from "@/utils/function/function"; 

let ecglen = ref(0);
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<personItem[]>([]);
const queryParams = reactive({
  status: "",
  bind: "",
  name: "",
  ccid: "",
  perPage: 18,
});
const initList = () => {
  queryParams.status = "";
  queryParams.bind = "";
  queryParams.name = "";
  queryParams.ccid = "";
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
    let { data } = await dynamicMonitoringApi.getPatientListEcg({
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
    console.log(error);
  } finally {
    tableLoading.value = false;
  }
}

const customPrefix = shallowRef({
  render() {
    return h("p", "");
  },
});

const sumbox = computed( () => {
  const bgWidth = 30;
  const bgHeight = 30;
  const swidth = 5;
  const sheight= 5;
  const width = 900;
  const height = document.querySelector(".canvasBox")!.scrollHeight;
  return {
    largeBox:Math.floor( (width * height) / (bgWidth * bgHeight)),
    smallBox:Math.floor( (bgWidth * bgHeight) / (swidth * sheight)),
  }
});

const hasMore = () => tableData.value.length < total.value;
const { resetPage } = useLimitPage(getList, hasMore);
resetPage();   
  let groupdialog = ref(false);
  let groupList = ref<any[]>([]);
  let planListLoading = ref(false);
  let datevalue = ref(new Date().toISOString().split("T")[0]);
  let currentPerson = ref<personItem>({
    id: 0,
    name: "",
    ccid: "",
  });
  async function openPlanGroup(item: personItem) {
    groupdialog.value = true;
    currentPerson.value = item;
    datevalue.value = new Date().toISOString().split("T")[0];
    getPlanGroup();
  }

  async function getPlanGroup(date:(Date | string)=new Date()){
       try {
       planListLoading.value = true;
       let result = await dynamicMonitoringApi.getPatientplanEcgDetails({
         ccid: currentPerson.value.ccid || "",
         patient_id: currentPerson.value!.id || "",
         date:dateFtt("yyyymmdd",date)
       });
       if (result) {
          groupList.value = result.data?.result;
       }
        planListLoading.value = false;
    } catch (error) {
      planListLoading.value = false;
    }

  }

  let heartdialog = ref(false);
  let date = ref();
  async function openPlanResult(d:string,item?: BpmItem) {
    groupdialog.value = false;
    heartdialog.value = true;
    date.value = d;
  
    nextTick(() => {
      initChart(item);
    });
  }

  onMounted(()=>{
    // initChart();
  })
  async function initChart(item?: BpmItem){
    
      const option = {
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      show:false
    },
    xAxis: {
      type: "time",
      data: [],
      axisLine: {
        show: false,
        lineStyle: {
          color: "#999",
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
     
      axisLabel: {
        showMinLabel:true,
        showMaxLabel:true,
        formatter: function (value: number) {
          const date = new Date(value);      
          // 假设数据范围是 2023-01-01 到 2023-12-31  
          const minDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
          ).getTime();
          const maxDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            23,
            59,
            59
          ).getTime();
          // 如果是最小值或最大值，添加标记
          if (value === minDate) {
            return "00:00";
          } else if (value === maxDate) {
            return "23:59";
          }
          return dateFtt("hh:MM", value); // 默认格式
        },
        show: false,
      },
      // scale: true, // 自动缩放 Y 轴
      splitLine: {
          show: false
      }
    },
    yAxis: {
        type: "value",  
        axisLabel: {
          show: false,
        },
      // scale: true, // 自动缩放 Y 轴
        splitLine: {
          show: false
        }
    },
    series: [
      {
        name: "ECG",
        type: "line",
        data: [],
        smooth: true, // 平滑曲线
        lineStyle: {
          color: "#E24040", // 红色线条
          width: 1,
        },
        symbol: "none", // 不显示数据点标记 
      }
    ],
    dataZoom: [
      {
        type: "inside", //类型
        // filterMode:"none",
        show: true, //显示
        // minValueSpan: 9 * 60 * 1000, // 最小窗口范围：1 分钟（60,000 毫秒）
        // maxValueSpan: 24 *  60 * 60 * 1000, // 最大窗口范围：1 分钟（固定）
        start: 70,               // 初始显示 0%~100%（即整个 1 分钟范围）
        end: 100               // 结束显示 0%~100%（即整个 1 分钟范围）

      }
    ],
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
  };  
   
    // ecglen.value = 0;
  let hour = "";
  if(item?.insert_time){
      let _a =  dateFtt('hh:MM',item.insert_time).split(':');
      hour = Number(_a[0])+'';
  }
  // showLoading.value = true;
  // 生成 500 个数据点  1000/200 =  5   共1分钟 1200
  // 生成 500 个 ECG 假数据点
const generateECGData = (numPoints = 500) => {
  const ecgData = [];
  for (let i = 0; i < numPoints; i++) {
    // 生成一个在 -1.0 到 1.0 之间的随机数
    const randomValue = Math.random() * 2 - 1;
    ecgData.push(randomValue);
  }
  return ecgData;
};

// 使用生成的 ECG 假数据
// const _result = {
//   data: {
//     result:[{
//       ecg_data:generateECGData(),
//     },{
//       ecg_data:generateECGData(),
//     },{
//       ecg_data:generateECGData(),
//     },{
//       ecg_data:generateECGData(),
//     },{
//       ecg_data:generateECGData(),
//     }
//   ]
//   }
// };
  const _result = await ElectrocarDiographicApi.get_m9_ecg_wave(
           {
              patient_id:currentPerson.value.id,
              date:date.value,
              md5:md5Str(currentPerson.value.id+''),
              hour
          }
);
 

  const second = 1000 / 250;  // 一秒钟250个点
  
  if(_result.data.result.length>0){
     ecglen.value = _result.data.result.length;
   
   _result.data.result.forEach((item: any, index: number) => {
    let ecgData:any = [];

    const chartOption = JSON.parse(JSON.stringify(option));

    item.ecg_data.forEach((child: any, i: number) => {
        ecgData.push([Number((new Date().getTime() + i * second).toFixed(0)), child]);
    });
    chartOption.series[0].data = ecgData;  
    nextTick(() => {
        let chartDom = document.getElementById('ecg-chart' + index) as HTMLElement;
        if (echarts && echarts.getInstanceByDom(chartDom)) {
            echarts.dispose(chartDom);
        }
        const dom = echarts.init(chartDom);
        dom && dom.setOption(chartOption);      
        createBackGround(); 
         let linstyle = {
         "box-sizing": "border-box",
          "position": "absolute",
          "width": "2px",
          "height": document.querySelector(".canvasBox")!.scrollHeight + "px",
          'top': "0px",
          'background-color':"#bfc0c6"
      }
      let maginLeft = ["30","150" ,"200","400","600","670","800"]
       for (let i = 0; i < 7; i++) {
          let item = document.createElement("div");
          item.style.left = maginLeft[i] + "px";
          Object.keys(linstyle).forEach((key) => {
              item.style.setProperty(key, linstyle[key as keyof typeof linstyle]);
          });
         document.querySelector(".canvasBox")!.appendChild(item);
        }


    });
});   
      
  }else{
      ecglen.value = 0;
  }
  // 使用配置项显示图表
}


const createBackGround = ()=>{
    const innerWidth = document.querySelector('.canvasBox')?.clientWidth || 0;
    const innerHeight = document.querySelector('.canvasBox')?.scrollHeight || 0;
    let boxWidth = 7;
    let boxHeight = 7;
    if(window.innerWidth <= 1280){
      boxWidth = 3.5;
      boxHeight = 3.5;
    };

    let rowlen = Math.ceil(innerWidth/boxWidth);
    let collen = Math.ceil(innerHeight/boxHeight);
    for (let i = 0; i < rowlen; i++) {
      for (let j = 0; j < collen; j++) {
        const box = document.createElement('div');
        box.style.width = boxWidth + 'px';
        box.style.height = boxHeight + 'px';
        box.style.position = 'absolute';
        box.style.left = i * boxWidth + 'px';
        box.style.top = j * boxHeight + 'px';
        box.style.boxSizing = 'border-box';
        box.style.borderRight = '1px solid #F5F7FB';
        box.style.borderBottom = '1px solid #F5F7FB';
        document.querySelector('.canvasBox')?.appendChild(box);
      }
    }
}


onUnmounted(() => {
  ecglen.value = 0;
});
</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
.main {
  padding: 24px;
  background-color: #f5f7fb;
}

.look-result {
  font-weight: 400;
  font-size: 16px;
  color: #145eff;
  cursor: pointer;
  user-select: none;
}
.look-result:active {
  opacity: 0.8;
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
.intput_300_F5F7FB {
  width: 300px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background-color: #f5f7fb !important;
  /* padding-left: 12px; */
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
.loadingBox {
  height: calc(100vh - 200px);
}

.d-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-top: 12px;
}
.d-item {
  min-height: 231px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px 20px;
}
.d-item .num {
  min-height: 36px;
  width: fit-content;
  padding: 0 12px;
  /* height: 33px; */
  background: #636676;
  border-radius: 8px 8px 8px 8px;
  font-weight: bold;
  font-size: 24px;
  color: #ffffff;
  word-break: break-all;
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
  color: #00b528;
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

.ecg-content {
  padding: 48px;
}
.patient-info p:first-child {
  margin-bottom: 8px;
}
.canvasBox {
  width: 902px;
  height: 212px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  border: 1px solid #eeeeee;
}



.canvasBox .no-data {
  height: 210px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #384951;
  margin-bottom: 0;
}
/* .no-weblen{
  overflow: auto;
} */

.patient-info {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 16px;
  color: #384951;
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

.no-data {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #384951;
  margin-bottom: 8px;
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

.intput_300_F5F7FB::placeholder {
  font-size: 16px;
}
.loading {
  font-size: 24px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
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
.status-executed {
  color: #00b528;
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
  position: relative;
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
  background: #00b528;
  border-radius: 4px;
  min-height: 70px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #00b528;
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

.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
