<template>
<main class="main">
    <nav class="nav">
      <div>
        <span>开启状态:</span>
        <div class="nav_select w-200px">
          <el-select
            v-model="queryParams.switch"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="plan in openStatusOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>
      </div>
      
      <p>
        <el-button   type="primary" size="large" ghost @click="getList()">查询</el-button>
        <el-button  type="info" size="large" ghost @click="initList()">重置</el-button>
      </p>
    </nav>

  <section class="card-panel" v-loading="tableloading">
        <div class="card-list">
            <div class="today_nodata"  v-if="cardList.length === 0 && !tableloading">
              <img src="@/assets/images/nodata.png" />
              <div>暂无数据~</div>
            </div>
            <div class="card-item" v-for="item in cardList" :key="item.id" v-else>
            <div class="card-header">
                <span class="card-title">{{ item.name }}</span>
            </div>
            <div class="card-body">
                <div class="card-row">
                <span class="card-label">开启时段：</span>
                <span class="card-value">{{ item.interval }}</span>
                </div>
                <div class="card-row">
                <span class="card-label">告警频次：</span>
                <span class="card-value">{{ item.frequency }}</span>
                </div>
            </div>
            <div class="card-footer">
                <el-switch v-model="item.switch" @change="onSwitchChange(item)" active-color="#24B287" inactive-color="#dcdfe6" />
                <span class="card-switch-label">霸屏告警</span>
                <img src="@/assets/icon/setting.png" class="card-setting-btn" @click="onSetting(item)"  alt="" srcset="" click="onSetting(item)">
            </div>
            </div>
        </div>
    </section>
  </main>

  <footer>
         <custom-dialog v-model="settingDialogVisible" title="告警时段设置" :width="getRem(640)" :show-close="false">
      <div class="setting-dialog-content" v-loading="dloading">
        <div class="setting-row">
          <span class="setting-label flex-shrink-0">开启时段：</span>
          <div class="time-select-group">
             <el-select v-model="settingForm.startTime">
            <el-option v-for="t in timeOptions" :key="t" :label="t" :value="t" />
          </el-select>
          </div>
          
          <div style="margin:0 10px;color: #999999;text-align: center;flex-shrink: 0;">-</div>
          <el-select v-model="settingForm.endTime" class="w-150px">
            <el-option v-for="t in timeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </div>
        <div class="setting-row" style="margin-top:18px;align-items: flex-start;">
          <span class="setting-label flex-shrink-0">告警频次：</span>
          <div class="week-checkbox-group">
            <div
              v-for="(week, idx) in weekOptions"
              :key="week.value"
              class="week-checkbox"
              @click="toggleWeek(idx)"
            >
            
              <img
               v-if="week.checked"
                src="@/assets/images/V4/2sel.png"
                class="checkbox-icon"
              />
               <img
                v-else
                src="@/assets/images/V4/2notsel.png"
                class="checkbox-icon"
              />
              <span>{{ week.label }}</span>
            </div>
          </div>
        </div>
      
      </div>
      <template #footer>
            <span class="dialog-footer">
              <div class="cancel-btn" @click="settingDialogVisible = false">取消</div>
              <div  class="confirm-btn"  @click="submitSetting">确定</div>
            </span>
          </template>
    </custom-dialog>
  </footer>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref ,nextTick} from "vue";
import rehabilitationTrainingplanApi from "@/api/rehabilitationTraining";
import { ElMessage } from "element-plus";
import { getRem } from "@/utils/function/function";
const cardList = ref<any[]>([
]);

const openStatusOptions = reactive([{
    id: 1,
    name: '已开启'
  },
  {
    id: 0,
    name: '未开启'
}]);
 
const queryParams = reactive({
  switch: ""
});
 let tableloading = ref(false);
const getList = async () => {
  tableloading.value = true;
  try {
   let { data } = await rehabilitationTrainingplanApi.ddList(queryParams);
   if(data.result && data.result.length > 0){
    data.result.forEach((element: any) => {
        element.switch = element.switch === 1;
    });
     cardList.value = data.result;
   }
   tableloading.value = false;
  
  } catch (error) {
    tableloading.value = false;
    
  }
};

const initList = async () => {
  queryParams.switch = "";
  getList();
};



const settingDialogVisible = ref(false);

const timeOptions = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00',
  '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
  '22:30', '23:00', '23:30', '24:00'
];


const settingForm = ref({
  startTime: '00:00',
  endTime: '24:00'
});

const weekOptions = ref([
  { label: '周一', value: 1, checked: true },
  { label: '周二', value: 2, checked: true },
  { label: '周三', value: 3, checked: true },
  { label: '周四', value: 4, checked: true },
  { label: '周五', value: 5, checked: true },
  { label: '周六', value: 6, checked: false },
  { label: '周日', value: 7, checked: false },
]);

function toggleWeek(idx: number) {
  weekOptions.value[idx]!.checked = !weekOptions!.value[idx]!.checked;
}

let dloading = ref(false);
let detail = ref<any>({});
async function onSetting(item: any) {
  settingDialogVisible.value = true;
  dloading.value = true;
    try {
   let { data } = await rehabilitationTrainingplanApi.planDetails({
     id: item.id
   });
   let arr = [];
   if(data.result.allowed_days){
      arr = JSON.parse(data.result.allowed_days);
   }
   weekOptions.value.forEach((week, idx) => {
     week.checked = arr.includes(week.value);
   });
   detail.value = data.result;
    settingForm.value = {
      startTime: detail.value.date_interval_start ||  '00:00',
      endTime:  detail.value.date_interval_end ||  '00:00'
};
   dloading.value = false;
  
  } catch (error) {
    dloading.value = false;
    
  }

}

async function onSwitchChange(item: any) {
  try {
     await rehabilitationTrainingplanApi.planBtn({
     id: item.id,
     switch: item.switch ? 1 : 0
   });
  } catch (error) {
  }

}

async function submitSetting() {
  // TODO: 提交逻辑
   dloading.value = true;
   let d = new Date().toLocaleDateString().replace(/\//g, "-");
   
  
   let startTime = new Date(d+" "+settingForm.value.startTime).getTime();
   let endTime = new Date(d+" "+settingForm.value.endTime).getTime();
   if (startTime >= endTime) {
     dloading.value = false;
     ElMessage.error('开始时间必须早于结束时间');
     return;
   }
  try {
    let arr:any[] = [];
    weekOptions.value.forEach((week) => {
      if (week.checked) {
        arr.push(week.value);
      }
    });
     let { data } = await rehabilitationTrainingplanApi.planEdit({
     id: detail.value.id,
     date_interval_start: settingForm.value.startTime,
     date_interval_end: settingForm.value.endTime,
     allowed_days:arr
   });
    dloading.value = false;
    getList();
  } catch (error) {
    dloading.value = false;
  }
  settingDialogVisible.value = false;
}

onMounted(()=>{
  getList()
})



</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
:deep(.el-table__cell){
  height: 64px !important;
}


.today_nodata {
  font-size: 16px;
  color: #929faf;
  text-align: center;
    margin: 100px auto;
}

.today_nodata img {
  width: 240px;
  margin: 0 auto;
}

.card-panel {
  width: 100%;
  margin-top: 24px;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-between; */
  gap: 24px;
}

.card-item {
  background: #ffffff;
  background: linear-gradient(to bottom,#E8FDEF 0%,#ffffff 30%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  width: calc((100% - 120px) / 6);
  min-height: 160px;
  padding: 24px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.card-header {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #384951;
  margin-bottom: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #EEEEEE;
  font-size: 28px;
color: #384951;
font-weight: bold;
}
.card-body {
  flex: 1;
  margin-bottom: 12px;
}
.card-row {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #636676;
  margin-bottom: 4px;
}
.card-label {
  width: 80px;
  font-size: 16px;
color: #929FAF;
}
.card-value {
    font-size: 16px;
color: #384951;
}
.card-footer {
    width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}
.card-switch-label {
  font-size: 14px;
  color: #636676;
}
.card-setting-btn {
  margin-left: auto;
  background: #fff;
  color: #24B287;
  border: none;
  box-shadow: none;
  width: 28px;
  height: 28px;
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

.time-select-group{
   width: 150px;
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


.setting-dialog-content {
  padding: 24px 40px;
}
.setting-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.setting-label {
  width: 80px;
  flex-shrink:0;
color: #636676;
  font-size: 16px;
  margin-right: 2px;
}
.week-checkbox-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  width: 300px;
  align-items: flex-start;
}
.week-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
  margin-bottom: 8px;
}
.checkbox-icon {
  width: 20px;
  height: 20px;
}
.setting-dialog-footer {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
}
</style>
