<template>
  <main class="main">
    <nav class="nav">
      <div>
        <span>在院/离院:</span>
        <div class="nav_select  w-200px">
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
        <div class="nav_select  w-200px">
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
        <span>设备CCID:</span>
        <el-input
          v-model="queryParams.ccid"
          placeholder="请输入"
        ></el-input>
      </div>
      <p>
          <el-button type="primary" size="large" @click="getList()">查询</el-button>
                    <el-button type="info" size="large" @click="initList()">重置</el-button>
      </p>
    </nav>

    <el-table
      :data="tableData"
      row-class-name="h64px"
      v-loading="tableLoading"
      border
      class="tableshadow"
    >
      <el-table-column prop="index" label="序号" align="center" />
      <el-table-column prop="patientName" label="姓名" align="center" />
      <el-table-column prop="bedNumber" label="床位号" align="center" />
      <el-table-column prop="deviceCcid" label="设备CCID" align="center" />
      <el-table-column prop="fenceStatus" label="围栏状态" align="center">
        <template #default="scope">
             <div v-if="scope.row.fenceStatus===fenceStatusEnum.OPEN" style="color: #24B287;">
                  开启
             </div>
             <div v-else style="color: #F7413D;">
                 关闭
             </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="crossFenceTime"
        label="跨越围栏时间"
        align="center"
      />
      <el-table-column prop="currentLocation" label="当前位置" align="center">
          <template #default="scope">
                <div class="view_location" @click="handleViewLocation(scope.row)">
                    查看位置
                </div>
        </template>
      </el-table-column>

      <el-table-column prop="handleStatus" label="处理状态" align="center">
          <template #default="scope">
             <div v-if="scope.row.handleStatus===handleStatusEnum.NOTEND" style="color: #F7413D;">
                  未处理
             </div>
             <div v-else style="color: #24B287;">
                 已处理
             </div>
          </template>
      </el-table-column>
      <el-table-column label="处理" align="center">
        <template #default="scope">
          <div>
            <el-button
              class="update_btn"
              size="small"
              style="margin-right: 12px"
              @click="handleUpdate(scope.row)"
              v-if="scope.row.handleStatus===handleStatusEnum.ISEND"
            >
             查看处理结果
          </el-button>
            <el-button
              class="del_btn"
              size="small"
              @click="handleUpdate(scope.row)"
              v-else
              >处理</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <elc-pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      :page-sizes="[10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </main>

  <footer>
    <custom-dialog :title="dialogTitle" v-model="dialogVisible" width="640px">
           <div class="container_add" v-if="dialogTitle === '跨越围栏告警处理'">
               <div class="update_item">
                    <span class="update_title">患者姓名:</span>
                    <span class="update_content">{{ dialogObj!.patientName }}</span>
                </div>
                <div class="update_item">
                    <span class="update_title">住院号:</span>
                    <span class="update_content">{{ dialogObj!.bedNumber }}</span>
                </div> 
                <div class="update_item">
                    <span class="update_title">设备CCID:</span>
                    <span class="update_content">{{ dialogObj!.deviceCcid }}</span>
                </div> 
                <div class="update_item">
                    <span class="update_title">跨越围栏时间:</span>
                    <span class="update_content">{{ dialogObj!.crossFenceTime }}</span>
                </div> 

                <div class="update_item">
                    <span class="update_title">备注<span style="opacity: 0;">围栏时间:</span></span>
                   
                </div>
                <div class="update_item_step">
                    <el-input v-model="dialogObj.remark" type="textarea" :rows="6" placeholder="请输入内容" show-word-limit maxlength="300"></el-input>
                </div>
           </div>

             <div class="container_update" v-else>
                <div class="update_item">
                    <span class="update_title">患者姓名:</span>
                    <span class="update_content">{{ dialogObj!.patientName }}</span>
                </div>
                <div class="update_item">
                    <span class="update_title">住院号:</span>
                    <span class="update_content">{{ dialogObj!.bedNumber }}</span>
                </div> 
                <div class="update_item">
                    <span class="update_title">设备 CCID:</span>
                    <span class="update_content">{{ dialogObj!.deviceCcid }}</span>
                </div> 
                <div class="update_item">
                    <span class="update_title">跨越围栏时间:</span>
                    <span class="update_content">{{ dialogObj!.crossFenceTime }}</span>
                </div> 

               <div class="update_item">
                    <span class="update_title">备注<span style="opacity: 0;">围栏时间:</span></span> 
                </div>
                <div class="update_item_step">
                  {{  dialogObj.remark  }}
                  
                </div>
           </div>
            
          <template #footer>
            <span class="dialog-footer">
              <div class="cancel-btn" @click="dialogVisible = false">取消</div>
              <div  class="confirm-btn"  @click="save()">保存</div>
            </span>
          </template>
      </custom-dialog>
     <custom-dialog title="当前位置" v-model="currentAddress" :width="(1000 / 1920 *100)+'%'">
         <div class="location" v-loading="addressLoading">
             <div class="map">
                   <qqmap :latlng="address.latlng" />
             </div>
             <div class="address">
                 <div class="child">
                     <div>详细地址</div>
                     <div>{{ address.address }}</div>
                 </div>
                 <div class="child">
                     <div>最后更新时间</div>
                     <div>{{ address.time }}</div>
                 </div>
             </div>
         </div>
    </custom-dialog>

  </footer>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, nextTick } from "vue";
import qqmap from "@/components/map.vue";
import {
  bindStatusOptions,
  inOrOutOptions
} from "@/utils/baseOptions/rehabilitationTraining";
import type { alarmManagement } from "@/interface/alarmCenter";
import  { fenceStatusEnum, handleStatusEnum } from "@/interface/alarmCenter";
import rehabilitationTrainingplanApi from "@/api/rehabilitationTraining";
import { dateFtt } from "@/utils/date/dateFtt";
import { ElMessage } from "element-plus";
import { useTopNums } from "@/stores/topNums";
const { jianTopNums }  = useTopNums();
const mockData = reactive<alarmManagement[]>([]);

for (let i = 0; i < 11; i++) {
  mockData.push({
    index: i,
    id: i,
    patientName: `患者${i}`,
    bedNumber: `床位${i}`,
    deviceCcid: `设备${i}`,
    fenceStatus: i%2===0 ?  fenceStatusEnum.OPEN : fenceStatusEnum.CLOSE,
    crossFenceTime: `2023-01-0${i} 10:00:00`,
    currentLocation: `位置${i}`,
    handleStatus: i%2===0 ?   handleStatusEnum.NOTEND: handleStatusEnum.ISEND
  })
}

const queryParams = reactive({
  inOrOut: "",
  bindStatus: "",
  name: "",
  ccid: "",
  page: 1,
  pageSize: 10
});
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<alarmManagement[]>([]);
const initList = () => {
  queryParams.inOrOut = "";
  queryParams.bindStatus = "";
  queryParams.name = "";
  queryParams.ccid = "";
  queryParams.page = 1;
  queryParams.pageSize = 10;
  getList();
};
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  queryParams.page = val;
  getList();
};
async function getList() {
  tableLoading.value = true;
  try {
        let _d = {
          page: queryParams.page,
          perPage:queryParams.pageSize,
          name:queryParams.name,
          ccid: queryParams.ccid,
          status: queryParams.inOrOut,
          bind:queryParams.bindStatus
    }
    let { data } = await rehabilitationTrainingplanApi.fenceList(_d);
      let arr:alarmManagement[] =  data?.result?.data.map((item:any,index:number)=>{
       return {
         index: (index+1)+(_d.page-1)*_d.perPage,
          id: item.id,
          patientName: item.name,
          bedNumber: item.bed_number,
          deviceCcid: item.ccid,
          fenceStatus: '开启',
          crossFenceTime: dateFtt('yyyy-mm-dd hh:MM:ss',item.time),
          currentLocation: '',
          handleStatus: item.status,
          remark: "",
       }
    });
    tableData.value = arr;
    total.value = data?.result?.total || 0;
    // mockData = mockData;
  } catch (error) {
  } finally {
    tableLoading.value = false;
  }
}
onMounted(() => {
  getList();
});

let dialogVisible = ref(false);
let dialogTitle = ref("跨越围栏告警处理");
let dialogObj = ref<alarmManagement>(
  {} as alarmManagement
);



const save = async () => {
  try {
    if(!dialogObj.value.remark){
     return ElMessage.error('请填写备注');
    }
    let index = tableData.value.findIndex((item) => item.id === dialogObj.value.id);
    if (index !== -1) {
      tableData.value[index]!.handleStatus = handleStatusEnum.ISEND;
      ElMessage.success('处理成功');
        jianTopNums("fence_count");
       dialogVisible.value = false;
    }
    let _d = {
      id: dialogObj.value.id,
      remark: dialogObj.value.remark
    }
    await rehabilitationTrainingplanApi.fenceProcess(_d);
    // dialogVisible.value = false;
    // initList();
  } catch (error) {
  }
}


const handleUpdate = async (item:alarmManagement) => {
   dialogTitle.value = ( item.handleStatus === handleStatusEnum.ISEND ?  '跨越围栏告警处理记录' : '跨越围栏告警处理')
 dialogObj.value = {...item};
   dialogVisible.value = true;
  let { data } = await rehabilitationTrainingplanApi.fenceLog({
       id : item.id,
    });
    dialogObj.value.remark = data?.result?.remark || '';
};


// 查看当前位置
let currentAddress = ref(false);
let address = ref({
    address: '',
    time: '',
    latlng: {
        lat: 0,
        lng: 0,
    }
});
let addressLoading = ref(false);
const handleViewLocation = async (item: alarmManagement) => {
  dialogObj.value = { ...item };
  currentAddress.value = true;
addressLoading.value = true;
 const { data } = await rehabilitationTrainingplanApi.fenceLocation({
       id : item.id
   });
    await nextTick();
    address.value = {
        address: data?.result?.address?.details || '',
        time: dateFtt('yyyy-mm-dd hh:MM:ss',data?.result?.time),
        latlng:{
            lat:Number(data?.result?.latitude),
            lng:Number(data?.result?.longitude)
             
        }
    }
    addressLoading.value = false;
};
</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
:deep(.el-table__cell) {
  height: 64px !important;
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
.update_btn,
.update_btn:hover {
  width: 123px;
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
.view_location:active{
  background-color: #145EFF;
  color: #fff;
}
.del_btn:active {
  background-color: #f7413d;
  color: #fff;
}

.view_location{
  cursor: pointer;
  margin:0 auto;
  width: 90px;
height: 32px;
background: #EAF4FF;
border-radius: 8px 8px 8px 8px;
font-size: 16px;
color: #145EFF;
line-height: 32px;
text-align: center;
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
.container_add {
  padding: 48px;
}
.lis {
  width: 100%;
  overflow-y: auto;
  height: 350px;
  margin: 20px 0;
  border-bottom: 1px solid #eeeeee;
}
.lis .liitem {
  display: flex;
  height: 70px;
  line-height: 70px;
  border-top: 1px solid #eeeeee;
  padding: 0 30px;
  font-size: 16px;
  color: #384951;
  transition: backgroundColor 0.3s ease;
}
.lis .liitem:hover {
  background-color: #f5f7fa;
}
.lis .liitem .name {
  width: 60px;
}
.lis .liitem > div {
  margin-left: 24px;
}

.icons {
  display: flex;
  align-items: center;
}
.checkedicon {
  width: 24px;
  height: 24px;
}

.container_add .subtitle {
  font-size: 16px;
  color: #384951;
  font-weight: bold;
}

.kfinput {
  width: 368px;
  height: 48px;
  background-color: #f5f7fb;

  border: 1px solid transparent;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-right: 10px;
}
.kfinput:focus {
  border: 1px solid #24B287;
}

.container_update {
  padding: 60px 70px;
}
.update_item{
  margin-bottom: 15px;
}
.update_title {
  display: inline-block;
  width: 120px;
  text-align: right;
  font-size: 16px;
  color: #636676;
  margin-right: 10px;
}
.update_content {
  font-size: 16px;
  color: #384951;
}
.update_title_bold {
  font-size: 16px;
  color: #384951;
  font-weight: 800;
  /* padding-left: 30px; */
}
.update_item_step {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding-left: 20px;
}
.add_item_step {
  margin-top: 10px;
}
.container_del {
  height: 200px;
  line-height: 200px;
  text-align: center;
  font-size: 16px;
  color: #636676;
}
:deep(.el-input__wrapper) {
  box-shadow: none;
  background-color: #f5f7fb;
}

.location{
  box-sizing: border-box;
  padding:48px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
}
.location .map{
    width: 420px;
    height: 420px;
    /* background-color: pink; */
}
.location .address{
   display: flex;
   flex-direction: column;
   justify-content: flex-start;
   align-items: flex-start;
   gap: 40px;
}
.location .address .child > div{
    font-size: 16px;
    color: #636676;
    margin-bottom: 10px;
}
.location .address .child > div:nth-child(2){
    font-size: 16px;
    color: #384951;
    font-weight: bold;
}

:deep(.el-textarea__inner){
  background-color: #F5F7FB !important;
  box-shadow: none !important;
}



</style>
