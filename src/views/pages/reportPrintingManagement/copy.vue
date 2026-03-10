<template>
    <div>
        <!-- 护理事件 -->
         <div class="print_page"></div>
        <div class="print_title">
        {{ admin.hospital_name }}医院{{ admin.name }}护理单元病区{{printObj.bed_number}}床<br />护理事件报告
        </div>
        <table border="0" cellspacing="0">
          <tbody>
              <tr>
              <td class="table_bg" style="width: 240px">患者姓名</td>
              <td>{{ printObj.interval_data }}</td>
            </tr>
            <tr>
            <td class="table_bg" style="width: 240px">住院号</td>
            <td>{{ printObj.interval_data }}</td>
          </tr>
            <tr>
                  <td class="table_bg" style="width: 240px">统计时间</td>
                  <td>
                    <div v-for="(item, index) in printObj.interval_time" :key="index">
                      {{ item }}
                    </div>
                  </td>
          </tr>
          <tr>
            <td class="table_bg" style="width: 240px">统计小时数</td>
            <td>{{ printObj.interval_data }}</td>
          </tr>
          </tbody>
        </table>

        <div class="part_title">1.护理事件分布(住院期间)</div>
      <table border="0" cellspacing="0">
        <tbody>
        <tr>
          <td class="table_bg" style="width: 190px">采集指标</td>
          <td class="table_bg">分布区间（取标签管理大类型发生次数，括号内删除）</td>
          <td class="table_bg" style="width: 190px">出现次数</td>
          <td class="table_bg" style="width: 170px">占比</td>
        </tr>
        <tr>
          <td rowspan="4">护理事件</td>
          <td>护理事件</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        <tr>
          <td>换药及处理</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        <tr>
          <td>术后相关事件</td>
          <td>7</td>
          <td>100.0%</td>
        </tr>
        <tr>
          <td>意外事项</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        </tbody>
      </table>
      <div class="text-right">https://ward-v14.release.jiuletech.com/#/device_list</div>
       <div class="print_page"></div>
       <div class="part_title">2、数据采集明细数据（住院期间）</div>
       <div v-for="(list, index) in printObj.data_list_l" :key="index" :class="{ print_page: index != 0, table_padding: index != 0 }">
              <table border="0" cellspacing="0">
                <thead>
                  <tr>
                    <td class="table_bg">采集日期</td>
                    <td class="table_bg">采集时分秒</td>
                    <td class="table_bg">事件(去标签内文字，括号内删除)</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="i">
                    <td>
                      {{ dateFtt("yyyy-mm-dd", new Date(item.insert_time * 1000)) }}
                    </td>
                    <td>{{ dateFtt("hh:00:00", new Date(item.insert_time * 1000)) }}</td>
                    <td>{{ item.heartrate }}（次/分）</td>
                    <td>{{ item.spo2 }}%</td>
                  </tr>
                </tbody>
              </table>
        </div>

        <!-- 血糖监测服务 -->
        <div class="print_page"></div>
          <div class="print_title">
          {{ admin.hospital_name }}医院{{ admin.name }}护理单元病区{{printObj.bed_number}}床<br />血糖监测服务报告
          </div>
          <table border="0" cellspacing="0">
          <tbody>
              <tr>
              <td class="table_bg" style="width: 240px">患者姓名</td>
              <td>{{ printObj.interval_data }}</td>
            </tr>
            <tr>
            <td class="table_bg" style="width: 240px">住院号</td>
            <td>{{ printObj.interval_data }}</td>
          </tr>
            <tr>
                  <td class="table_bg" style="width: 240px">统计时间</td>
                  <td>
                    <div v-for="(item, index) in printObj.interval_time" :key="index">
                      {{ item }}
                    </div>
                  </td>
          </tr>
          <tr>
            <td class="table_bg" style="width: 240px">统计小时数</td>
            <td>{{ printObj.interval_data }}</td>
          </tr>
          </tbody>
        </table>
        <div class="part_title">1、血糖监测情况(住院期间)</div>
      <div class="part_text">
       血糖最高12.3mmol/L，最低3.1mmol/L；
      </div>
       <div class="part_title">2.血压整体区间分布(住院期间)</div>
      <table border="0" cellspacing="0">
        <tbody>
        <tr>
          <td class="table_bg" style="width: 190px">采集指标</td>
          <td class="table_bg">分布区间</td>
          <td class="table_bg" style="width: 190px">出现次数</td>
          <td class="table_bg" style="width: 170px">占比</td>
        </tr>
        <tr>
          <td rowspan="4">血糖</td>
          <td>危险高血糖＞16.7mmol/L</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        <tr>
          <td>高血糖＞7.0mmol/L</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        <tr>
          <td>正常血糖3.9~6.1mmol/L</td>
          <td>7</td>
          <td>100.0%</td>
        </tr>
        <tr>
          <td>低血糖＜3.9mmol/L</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        </tbody>
      </table>
         <div class="print_page"></div>
       <div class="part_title">3、数据采集明细数据（住院期间）</div>
       <div v-for="(list, index) in printObj.data_list_l" :key="index" :class="{ print_page: index != 0, table_padding: index != 0 }">
              <table border="0" cellspacing="0">
                <thead>
                  <tr>
                    <td class="table_bg">采集日期</td>
                    <td class="table_bg">采集时分秒</td>
                    <td class="table_bg">血糖</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="i">
                    <td>
                      {{ dateFtt("yyyy-mm-dd", new Date(item.insert_time * 1000)) }}
                    </td>
                    <td>{{ dateFtt("hh:00:00", new Date(item.insert_time * 1000)) }}</td>
                    <td>{{ item.heartrate }}（次/分）</td>
                    <td>{{ item.spo2 }}mmol/L</td>
                  </tr>
                </tbody>
              </table>
        </div>

          <!-- 血压监测服务报告 -->
        <div class="print_page"></div>
          <div class="print_title">
          {{ admin.hospital_name }}医院{{ admin.name }}护理单元病区{{printObj.bed_number}}床<br />血压监测服务报告
          </div>
          <table border="0" cellspacing="0">
          <tbody>
              <tr>
              <td class="table_bg" style="width: 240px">患者姓名</td>
              <td>{{ printObj.interval_data }}</td>
            </tr>
            <tr>
            <td class="table_bg" style="width: 240px">住院号</td>
            <td>{{ printObj.interval_data }}</td>
          </tr>
            <tr>
                  <td class="table_bg" style="width: 240px">统计时间</td>
                  <td>
                    <div v-for="(item, index) in printObj.interval_time" :key="index">
                      {{ item }}
                    </div>
                  </td>
          </tr>
          <tr>
            <td class="table_bg" style="width: 240px">统计小时数</td>
            <td>{{ printObj.interval_data }}</td>
          </tr>
          </tbody>
        </table>
        <div class="part_title">1.血压监测情况(住院期间)</div>
      <div class="part_text">
         收缩压最高123，最低110；
      </div>
       <div class="part_text">
         舒张压最高93，最低82；
      </div>
       <div class="part_text">
        脉压差平均52。
      </div>
       <div class="part_title">2.脉率监测情况(住院期间)</div>
        <div class="part_text">
            脉率最高123，最低110，平均123；
        </div>
       <div class="part_title">2.血压整体区间分布(住院期间)</div>
      <table border="0" cellspacing="0">
        <tbody>
        <tr>
          <td class="table_bg" style="width: 190px">采集指标</td>
          <td class="table_bg">分布区间</td>
          <td class="table_bg" style="width: 190px">出现次数</td>
          <td class="table_bg" style="width: 170px">占比</td>
        </tr>
        <tr>
          <td rowspan="4">血压</td>
          <td>收缩压＞120</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        <tr>
          <td>舒张压＞80</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        <tr>
          <td>脉压差＞60</td>
          <td>7</td>
          <td>100.0%</td>
        </tr>
        <tr>
          <td>脉压差＜30</td>
          <td>0</td>
          <td>0.0%</td>
        </tr>
        </tbody>
      </table>
         <div class="print_page"></div>
       <div class="part_title">3、数据采集明细数据（住院期间）</div>
       <div v-for="(list, index) in printObj.data_list_l" :key="index" :class="{ print_page: index != 0, table_padding: index != 0 }">
              <table border="0" cellspacing="0">
                <thead>
                  <tr>
                    <td class="table_bg">采集日期</td>
                    <td class="table_bg">采集时分秒</td>
                    <td class="table_bg">收缩压</td>
                    <td class="table_bg">舒张压</td>
                    <td class="table_bg">脉率</td>
                    <td class="table_bg">脉压差</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="i">
                    <td>
                      {{ dateFtt("yyyy-mm-dd", new Date(item.insert_time * 1000)) }}
                    </td>
                    <td>{{ dateFtt("hh:00:00", new Date(item.insert_time * 1000)) }}</td>
                    <td>{{ item.heartrate }}（次/分）</td>
                    <td>{{ item.spo2 }}mmol/L</td>
                      <td>{{ item.spo2 }}mmol/L</td>
                        <td>{{ item.spo2 }}mmol/L</td>
                  </tr>
                </tbody>
              </table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {
  bindStatusOptions,
  inOrOutOptions,
  printOptions
} from "@/utils/baseOptions/reportPrintingManagement";
import PatientApi from "@/api/patient";
import ReportApi from "@/api/report";
import printcss from "@/assets/js/printcss.ts";
import { getCookie } from "@/utils/cookie/cookie";
import { dateFtt } from "@/utils/date/dateFtt";
import { ElMessage } from "element-plus";
import { onMounted, ref,computed } from "vue";
const admin = JSON.parse(getCookie("admin") as string);

let printObj = ref<any>({
  patientId: "",
  reportId: "",
  printType: "",
  printStatus: "",
  pageNum: 1,
  pageSize: 10,
  total: 0,
  patientName: "",
  patientPhone: "",
  patientSex: "",
  patientAge: "",
  patientIdCard: "",
  patientAddress: "",
  patientHeight: "",
  patientWeight: "",
})

</script>