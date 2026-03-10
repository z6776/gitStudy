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
        <el-button   type="primary" size="large" ghost @click="getList()">查询</el-button>
        <el-button  type="info" size="large" ghost @click="initList()">重置</el-button>
        </p>
        <div class="header">
 <div class="header_title ml-auto" @click="handleOpen">
          <img src="@/assets/images/addhz.png" alt="" />
          <span>新增康复训练计划</span>
    </div>
        </div>
       
    </nav>

    <el-table :data="tableData" row-class-name="h64px" v-loading="tableLoading" border class="rounded-12px">
      <el-table-column prop="index" label="序号" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="bedNumber" label="床位号" align="center" />
      <el-table-column prop="todayStep" label="今日步数（步）" align="center" />
      <el-table-column prop="totalStep" label="训练达成情况" align="center">
         <template #default="scope">
          <div>
             <span style="color:green" v-if="scope.row.totalStep=='已达成'">已达成</span>
             <span style="color:#F85955" v-if="scope.row.totalStep=='未达成'">未达成</span>
             <span></span>
          </div>
         </template>
      </el-table-column>
      <el-table-column prop="planStep" label="训练计划（步）" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div>
            <el-button class="update_btn" size="small"  style="margin-right:12px" @click="handleUpdate(scope.row)">修改计划</el-button>
            <el-button class="del_btn" size="small" @click="handleDel(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
      <elc-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.perPage" :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </main>
  <footer>
      <custom-dialog :title="dialogTitle" v-model="dialogVisible" :width="(1000/1920*100)+'%'">
           <div class="container_add" v-if="dialogTitle === '新增康复训练计划'">
                <div class="subtitle">
                    患者列表
                </div>
              
                <div class="lis limitPage" v-loading="loading">
                    <div v-if="personList.length === 0" class="nodata" style="text-align: center;">
                       暂无患者信息
                    </div>
                    <div v-for="(item) in personList" class="liitem" @click="handleChecked(item)" :key="item.index">
                       <div class="name">
                          {{ item.name }}
                       </div>
                       <div>
                          {{ item.bed_number }}床
                       </div>
                       <div>
                          {{ item.ccid }}
                       </div>
                       
                       <div class="icons" style="margin-left: auto;">
                          <img src="@/assets/images/icons/ischecked.png" v-if="item.ischecked" alt="" class="checkedicon">  
                           <img src="@/assets/images/icons/nochecked.png" v-else alt=""  class="checkedicon">    
                       </div>
                    </div>
                </div>
                <div class="subtitle">
                   计划周期
                </div>
                <div class="add_item_step">
                    <el-input type="text" placeholder="请填写康复计划步数" class="kfinput" v-model.trim="dialogObj.updateplanStep"></el-input>
                    <span>步</span>
                </div>
           </div>

             <div class="container_update" v-else>
                <div class="update_item">
                    <span class="update_title">患者姓名:</span>
                    <span class="update_content">{{ dialogObj!.name }}</span>
                </div>
                <div class="update_item">
                    <span class="update_title">床位号:</span>
                    <span class="update_content">{{ dialogObj!.bedNumber }}</span>
                </div> 
                <div class="update_item">
                    <span class="update_title">当前计划:</span>
                    <span class="update_content">{{ dialogObj!.planStep }}步</span>
                </div> 
                <div class="update_item">
                    <span class="update_title">设备CCID:</span>
                    <span class="update_content">{{ dialogObj!.ccid }}</span>
                </div> 

                <div class="update_title_bold">
                   修改康复训练计划
                </div>
                <div class="update_item_step">
                    <el-input type="text" placeholder="请填写康复计划步数" class="kfinput" v-model.trim="dialogObj.updateplanStep"></el-input>
                    <span>步</span>
                </div>
           </div>
            
          <template #footer>
            <span class="dialog-footer">
              <div class="cancel-btn" @click="dialogVisible = false">取消</div>
              <div  class="confirm-btn"   @click="savePlan()">保存</div>
            </span>
          </template>
      </custom-dialog>

        <custom-dialog title="删除计划" v-model="delDialogVisible"  :width="(640/1920*100)+'%'" >
          <div class="container_del" v-loading="delloading">
               是否删除该计划?
          </div>
            <template #footer>
            <span class="dialog-footer">
              <div class="cancel-btn" @click="delDialogVisible = false">取消</div>
              <div  class="confirm-btn"  @click="delConfirm()">确认</div>
            </span>
          </template>
        </custom-dialog>
  </footer>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref ,nextTick} from "vue";
import {
  bindStatusOptions,
  inOrOutOptions,
} from "@/utils/baseOptions/rehabilitationTraining";
import type { rehabilitationTrainingplan } from "@/interface/rehabilitationTraining";
import rehabilitationTrainingplanApi from "@/api/rehabilitationTraining";
import { ElMessage } from "element-plus";

const queryParams = reactive({
  inOrOut: "",
  bindStatus: "",
  name: "",
  bedNumber: "",
  page:1,
  perPage:10
});
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<rehabilitationTrainingplan[]>([]);
const initList = () => {
  queryParams.inOrOut = "";
  queryParams.bindStatus = "";
  queryParams.name = "";
  queryParams.bedNumber = "";
  queryParams.page = 1;
  queryParams.perPage = 10;
  getList();
};
const handleSizeChange = (val: number) => {
    queryParams.perPage = val
    getList()
}
const handleCurrentChange = (val: number) => {
    queryParams.page = val
    getList()
}
async function getList() {
  tableLoading.value = true;
  try {
    let _q = {
      status:  queryParams.inOrOut,
      bed_number: queryParams.bedNumber,
      name: queryParams.name,
      bind: queryParams.bindStatus,
      page: queryParams.page,
      perPage: queryParams.perPage
    }
    let { data } = await rehabilitationTrainingplanApi.getRecoveryList(_q);
    let _arr = data?.result?.data.map((v:any,index:number)=>{
      return {
          index: (index+1)+(queryParams.page-1)*queryParams.perPage,
          id: v.training_id, // 主键
          name: v.name|| "--",// 姓名
          ccid:v.ccid,
          bedNumber: v.bed_number || "--",// 床位号
          todayStep: v.activity|| "--",// 今日步数（步）
          totalStep: v.is_success==1  ? '已达成' : '未达成',// 训练达成情况
          planStep: v.plan_active || "--",// 训练计划（步）
          ischecked: '',// 是否已完成
          updateplanStep: ''// 修改 或者新增的步数
      }
    }) || [];
    tableData.value =_arr;
    total.value = data?.result?.total || 0;
  } catch (error) {
  } finally {
    tableLoading.value = false;
  }
}
onMounted(() => {
  getList();
});





let dialogVisible = ref(false);
let dialogTitle = ref("新增康复训练计划"); 
let dialogObj = ref<rehabilitationTrainingplan>({} as rehabilitationTrainingplan);
let delDialogVisible = ref(false);
let personList = ref<any[]>([]);
const handleOpen = async () => {
  dialogObj.value.updateplanStep = undefined;
  dialogTitle.value = "新增康复训练计划";
  dialogVisible.value = true;
  getPersonList();
};

let loading = ref(false);
const getPersonList = async () => {
  try {
    loading.value = true;
    let { data } = await rehabilitationTrainingplanApi.getRecoveryPatient();
  personList.value = data?.result || [];
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
  
}


 
const savePlan = async () => {
   if(!dialogObj.value.updateplanStep){
      return ElMessage.error("请填写康复训练计划步数");
   }

   try {
  
    if(dialogTitle.value === "新增康复训练计划"){
        let _arr = personList.value.map((v:any) => {
          if(v.ischecked){
             return {
               patient_id: v.patient_id
             }
          }
        }).filter(v=>v) || [];
       
        if(_arr.length === 0){
          return ElMessage.error("请选择患者");
        }
          loading.value = true;
        await rehabilitationTrainingplanApi.addRecovery({
          data:_arr,
          plan_active: dialogObj.value.updateplanStep,
      });
        loading.value = false;
getList();
  dialogVisible.value = false;
         ElMessage.success("新增成功");
        return;
    }
      let index = tableData.value.findIndex((v:rehabilitationTrainingplan) => v.id === dialogObj.value.id);
      tableData!.value[index]!.planStep = dialogObj.value.updateplanStep;
      dialogVisible.value = false;
         ElMessage.success("修改成功");
       await rehabilitationTrainingplanApi.editRecovery({
          id: dialogObj.value.id,
          plan_active: dialogObj.value.updateplanStep,
      });
   } catch (error) {
    dialogVisible.value = false;
     loading.value = false;
   }
}
const handleUpdate = (item:rehabilitationTrainingplan) => {
  dialogObj.value = {...item};
  dialogObj.value.updateplanStep = item.planStep || undefined;
  dialogTitle.value = "修改康复训练计划";
  dialogVisible.value = true;
};


const delloading = ref(false);
const delConfirm = async () => {
  delloading.value = true;
   try {
    
       await rehabilitationTrainingplanApi.delRecovery({
          id: dialogObj.value.id
      });
      delloading.value = false;
          delDialogVisible.value = false;
           getList();
         ElMessage.success("删除成功");
   
   } catch (error) {
    delDialogVisible.value = false;
     delloading.value = false;
   }

}

const handleChecked = (item: rehabilitationTrainingplan)=>item.ischecked = !item.ischecked;
   
const handleDel = (item:rehabilitationTrainingplan) => {
   dialogObj.value = {...item};
   delDialogVisible.value = true;
}




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
  border-radius: 4px;
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
  border-radius: 4px;
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
   margin-left:auto
}
 .header_title {
  width: fit-content;
  height: 48px;
  font-size: 16px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #24B287;
  min-width: 182px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  user-select: none;
}

  .header_title:active {
  transform: translateY(5px);
}
  .header_title img {
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
  min-height: 70px;
  max-height: 350px;
  margin: 20px 0;
   border-bottom: 1px solid #EEEEEE;
}
.lis .nodata{
   height: 67px;
   display: flex;
   justify-content: center;
   align-items: center;
  border-top: 1px solid #EEEEEE;
}
.lis .liitem{
  display: flex;
  height: 70px;
  display: flex;
   align-items: center;
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
   display: flex;
   justify-content: center;
   align-items: center;
   /* line-height: 200px; */
   text-align: center;
   font-size: 16px;
    color: #636676;
}
:deep(.el-input__wrapper){
  box-shadow: none;
  background-color: #F5F7FB;
}
</style>
