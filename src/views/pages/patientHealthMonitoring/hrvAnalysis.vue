<template>
  <header class="header">
    <div class="control_box">
        <div
        class="control_button"
        :class="{ active_control_button: active_control_button_isend == 2 }"
        @click="searchList(2)"
      >
        <span>全部</span>
      </div>
      <div
        class="control_button"
        :class="{ active_control_button: active_control_button_isend == 1 }"
        @click="searchList(1)"
      >
        <span>启用</span>
      </div>
      <div
        class="control_button"
        :class="{ active_control_button: active_control_button_isend == 0 }"
        @click="searchList(0)"
      >
        <span>禁用</span>
        <!-- <span>6</span> -->
      </div>
    </div>
  </header>

  <main>
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
        
        <div class="gridItem_btns">
           <el-switch v-model="item.isOpen" @change="handleStatus(item.id,item.isOpen)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
           <span>{{item.isOpen ? "关闭HRV分析" : "开启HRV分析"  }}</span>
        </div>
        </div>
    </div>

     <div class="list_no_data" v-if="tableData.length === 0 && !tableLoading">
      <img src="@/assets/images/nodata.png" />
      <div>未查询到相关信息~</div>
    </div>
    <div v-loading="tableLoading" element-loading-text="正在加载..."></div>
  </main>
</template>
<script lang="ts" setup>
import { ref,reactive } from "vue";
import type { hrvAnalysisData } from "@/interface/patientHealthMonitoring";
import { useLimitPage } from "@/hooks/useLimitPage";
import dynamicMonitoringApi from "@/api/dynamicMonitoring";
const queryParams = reactive({
  hrv: 2,
  page: 1,
  perPage: 30,
});
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<hrvAnalysisData[]>([]);
async function getList(page: number) {
  tableLoading.value = true;
  try {
    let { data } = await dynamicMonitoringApi.getHrvList({
      ...queryParams,
      page,
    });
    let _arr = data.result?.data?.map((item: any) => {
        return {
           id: item.user_id,
          bedNumber: item.bed_number,
          name: item.name,
          ccid: item.pid,
          isOpen: item.hrv===1
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

const handleStatus = async (id: number,isOpen:boolean) => {
   try {
     await dynamicMonitoringApi.getHrvSet({
       user_id:id,
       hrv:isOpen?1:0
     })
   } catch (error) {
    
   }
};

const { resetPage } = useLimitPage(getList, hasMore);
resetPage();

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

const active_control_button_isend = ref(2);

const searchList = (status: number) => {
  active_control_button_isend.value = status;
  // if (status !== active_control_button_isend.value) {
  //   active_control_button_isend.value = status;
  // } else {
  //   active_control_button_isend.value = 2;
  // }
  queryParams.hrv = active_control_button_isend.value;
    tableData.value = [];
  resetPage();
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
  margin: 24px;
  border-radius: 12px;
}
.control_box {
    height: 88px;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: 12px;
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
    background-color: #24B287;
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
  color: #24B287;
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


