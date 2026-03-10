<template>

  <main class="main">
    <nav class="nav">
      <div>
        <span>在院/离院:</span>
        <div class="nav_select w-200px">
          <el-select
            v-model="queryParams.inOrOut"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="plan in inOrOutOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>绑定状态:</span>
        <div class="nav_select w-200px">
          <el-select
            v-model="queryParams.bindStatus"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="plan in bindStatusOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>
      </div>
      <div>
        <span>姓名:</span>
        <el-input v-model="queryParams.name" placeholder="请输入"></el-input>
      </div>
      <div>
        <span>床位号:</span>
        <el-input
          v-model="queryParams.bedNumber"
          placeholder="请输入"
        ></el-input>
      </div>
      <p>
        <el-button  type="primary"  size="large"  ghost @click="getList()">查询</el-button>
        <el-button  type="info" size="large" ghost @click="initList()">重置</el-button>
      </p>
    </nav>

    <el-table :data="tableData" row-class-name="h64px" v-loading="tableLoading" border class="rounded-12px">
      <el-table-column prop="index" label="序号" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="bedNumber" label="床位号" align="center" />
      <el-table-column prop="trainingTime" label="训练时间" align="center" width="300"/>
      <el-table-column prop="trainingMode" label="训练模式" align="center" />
      <el-table-column prop="trainingDuration" label="训练时长（分钟）" align="center" />
      <el-table-column prop="heartRateBeforeTraining" label="训练前心率（次/分）" align="center" />
      <el-table-column prop="heartRateAfterTraining" label="训练后心率（次/分）" align="center" />
    </el-table>
      <elc-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize" :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </main>
</template>

<script setup lang="ts">

import { reactive, onMounted, ref ,nextTick} from "vue";
import {
  bindStatusOptions,
  inOrOutOptions,
} from "@/utils/baseOptions/rehabilitationTraining";
import type { breathingTraining } from "@/interface/rehabilitationTraining";
import rehabilitationTrainingplanApi from "@/api/rehabilitationTraining";
import { dateFtt } from "@/utils/date/dateFtt";
 
const queryParams = reactive({
  inOrOut: "",
  bindStatus: "",
  name: "",
  bedNumber: "",
  page:1,
  pageSize:10
});
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<breathingTraining[]>([]);
const initList = () => {
  queryParams.inOrOut = "";
  queryParams.bindStatus = "";
  queryParams.name = "";
  queryParams.bedNumber = "";
  queryParams.page = 1;
  queryParams.pageSize = 10;
  getList();
};
const handleSizeChange = (val: number) => {
    queryParams.pageSize = val
    getList()
}
const handleCurrentChange = (val: number) => {
    queryParams.page = val
    getList()
}
async function getList() {
  tableLoading.value = true;
  try {
    let _d = {
       page: queryParams.page,
       perPage: queryParams.pageSize,
       status: queryParams.inOrOut,
       bind: queryParams.bindStatus,
       name: queryParams.name,
       bed_number: queryParams.bedNumber
    }
    let { data } = await rehabilitationTrainingplanApi.getBreatheList(_d);
    let _arr = data?.result?.data?.map((item: any,index:number)=>{ 
      return {
        id: item.id, // 主键
        index: (index+1)+(queryParams.page-1)*queryParams.pageSize,  // 序号
        name: item.name,// 姓名
        bedNumber: item.bed_number,// 床位号
        trainingTime:dateFtt('yyyy-mm-dd -- hh:MM:ss',item.start_time) ,// 训练时间
        trainingMode: trainingMode(item.train_type),// 训练模式
        trainingDuration: item.train_time,// 训练时长（分钟）
        heartRateBeforeTraining: item.before_heart,// 训练前心率（次/分）
        heartRateAfterTraining: item.after_heart// 训练后心率（次/分）
        }
    }) || [];
    tableData.value = _arr;
    total.value = data?.result?.total || 0;
  } catch (error) {
  } finally {
    tableLoading.value = false;
  }
}


function trainingMode(type: number) {
    let types:Record<number,string> = {
      1: "稍快",
      2:"缓慢",
      3:"舒缓"
    };
    return types[type] || "";
}
onMounted(() => {
  getList();
});

</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
:deep(.el-table__cell){
  height: 64px !important;
}



.nav_btn_confirm {
  width: 101px;
  height: 48px;
  background: #24B287;
  border-radius: 4px;
  color: #ffffff;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  user-select: none;
  box-shadow: none;
  border: none;
}
.update_btn , .update_btn:hover{
  width: 90px;
  height: 32px;
  background: #e6fded;;
  border-radius: 8px 8px 8px 8px;
  font-size: 16px;
  color: #24B287;
  user-select: none;
  box-shadow: none;
  border: none;
}

.del_btn , .del_btn:hover{
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
.header .header_title {
  width: fit-content;
  height: 48px;
  font-size: 16px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #24B287;
  margin: 19px 24px;
  min-width: 182px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  user-select: none;
}

.header .header_title:active {
  transform: translateY(5px);
}
.header .header_title img {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
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
.container_add{
  padding:48px;
}
.lis{
  width: 100%;
  overflow-y: auto;
  height: 350px;
  margin: 20px 0;
   border-bottom: 1px solid #EEEEEE;
}
.lis .liitem{
  display: flex;
  height: 70px;
  line-height: 70px;
  border-top: 1px solid #EEEEEE;
  padding:0 30px;
  font-size: 16px;
  color: #384951;
  transition: backgroundColor 0.3s ease;
}
.lis .liitem:hover{
  background-color: #f5f7fa;

}
.lis .liitem .name{
  width: 60px;
}
.lis .liitem > div{
margin-left: 24px;
}

.icons{
   display: flex;
    align-items: center;
}
.checkedicon{
  width: 24px;
  height: 24px;
}

.container_add .subtitle{
  font-size: 16px;
color: #384951;
font-weight: bold;
}

.kfinput{
  width: 368px;
  height: 48px;
  background-color: #F5F7FB;

  border: 1px solid transparent;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-right: 10px;
}
.kfinput:focus{
  border: 1px solid #24B287;
}

.container_update{
  padding: 60px 70px;
}
.update_item{
  margin-bottom: 24px;
}
.update_title{
  display: inline-block;
  width: 100px;
  text-align: right;
  font-size: 16px;
color: #636676;
margin-right: 10px;
}
.update_content{
  font-size: 16px;
color: #384951;
}
.update_title_bold{
  font-size: 16px;
  color: #384951;
  font-weight: 800;
  padding-left: 30px;
}
.update_item_step{
  padding-left: 30px;
  display: flex;
  align-items: center;
    margin-top: 10px;
}
.add_item_step{
  margin-top: 10px;
}
.container_del{
   height: 200px;
   line-height: 200px;
   text-align: center;
   font-size: 16px;
    color: #636676;
}
:deep(.el-input__wrapper){
  box-shadow: none;
  background-color: #F5F7FB;
}
</style>
