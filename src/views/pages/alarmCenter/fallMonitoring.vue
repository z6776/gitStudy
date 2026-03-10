<template>
  <header class="header">
    <div class="control_box">
      <div
        class="control_button"
        :class="{ active_control_button: active_control_button_isend == 1 }"
        @click="searchList(1)"
      >
        <span>启用</span>
        <span>28</span>
      </div>
      <div
        class="control_button"
        :class="{ active_control_button: active_control_button_isend == 2 }"
        @click="searchList(2)"
      >
        <span>禁用</span>
        <span>6</span>
      </div>
    </div>
  </header>
  <main>
     <div class="gridContainer clearfix">
      <div class="gridItem" v-for="item in mockData">
        <div class="gridItem_title">
          <span>{{ item.bedNumber }}</span>
          <span>{{ item.name }}</span>
        </div>
        <div class="gridItem_content">
          <div class="ccid">CCID</div>
          <div class="ccid_value">{{ item.ccid }}</div>
        </div>
        
        <div class="gridItem_btns">
           <el-switch v-model="item.isOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
           <span>关闭HRV分析</span>
        </div>
        </div>
    </div>
  </main>
</template>

<script lang="ts" setup>

import { ref } from "vue";
import type { hrvAnalysisData } from "@/interface/patientHealthMonitoring";
const mockData = ref<hrvAnalysisData[]>([]);
for (let i = 0; i < 11;i++) {
  mockData.value.push({
    id: i,
    bedNumber: "101"+i,
    name: "张三"+i,
    ccid: "1234567897123766"+i,
    isOpen: i%2===0?true:false
  })
}

const active_control_button_isend = ref(0);
const searchList = (status: number) => {
  if (status !== active_control_button_isend.value) {
    active_control_button_isend.value = status;
  } else {
    active_control_button_isend.value = 0;
  }
};
</script>

<style scoped>
/* 头部 */
.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}
.control_box {
    height: 88px;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 12px;
}

.control_button {
    min-width: 118px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #F5F7FB;
    border-radius: 8px;
    border: 1px solid #EEEEEE;
    font-size: 16px;
    color: #636676;
    margin-right: 12px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    gap:10px;
    padding: 0 24px;
}

.active_control_button {
    background-color: #00B528;
    color: #fff;
}


/* 列表 */
main{
  padding: 0 24px;
}
.gridItem {
  padding: 20px;
  background-color: #fff;
  width: calc((100% - 80px) / 5);
  height: 203px;
  float: left;  margin-right: 20px;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
  font-weight: bold;
  
}
.gridItem_title > span:first-child {
  width: fit-content;
  padding: 3px 10px;  
  background: #636676;
  border-radius: 8px 8px 8px 8px;
  font-size: 24px;
  color: #FFFFFF; 
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
  color: #00b528;
  margin-bottom: 16px;
  text-align: center;
  margin-top: 25px;
}
.gridItem_btns {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  font-size: 16px;
color: #384951;
}
 


</style>


