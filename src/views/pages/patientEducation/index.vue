<template>
  <header class="header">
    <div class="header_title" @click="handleOpen">
      <img src="@/assets/images/V2/linkadd.png" alt="" />
      <span>添加链接</span>
    </div>
  </header>

  <main class="main">
    <el-table :data="tableData" row-class-name="h64px" v-loading="tableLoading" border>
      <el-table-column prop="title" label="视频标题" align="center" />
      <el-table-column prop="desc" label="描述" align="center" />
      <el-table-column prop="url" label="链接" align="center">
        <template #default="scope">
          <span class="color-[#145EFF] text-underline">{{ scope.row.url }}</span>
        </template>
      </el-table-column>
       
      <el-table-column label="操作" align="center" width="400px">
        <template #default="scope">
          <div>
            <el-button class="update_btn" size="small"  @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button class="del_btn" size="small" @click="handleDel(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
      <custom-dialog :title="dialogTitle" v-model="dialogVisible" :width="(640/1920*100)+'%'">
           <div class="dialog-content">
               <div class="line-height-18px text-[18px] bold relative color-[#384951] font-bold">
                <span class="color-[red]">*</span>
                标题
              </div>
               <div class="mt-10px flex items-end gap-10px">
                   <el-input placeholder="请输入" v-model.trim="form.title" maxlength="8" class="w-260px"></el-input>
                   <span>{{form.title.length}}/8</span>
               </div>

               <div class="flex gap-20px mt-24px" v-if="dialogTitle=='添加患者教育'">
               <div class="flex-1">
                <div class="line-height-18px text-[18px] bold relative color-[#384951] font-bold">推送病程节点</div>
                <div class="mt-10px flex items-end gap-10px">
                    <el-select v-model="form.node_id" placeholder="请选择" class="w-260px">
                       <el-option :value="value.id" :label="value.name" v-for="(value,index) in list4">
                            <template #default="row">
                              <div class="text-center">
                                  {{ value.name}}
                              </div>
                            </template>
                       </el-option>
                     
                    </el-select>
                </div>
                
               </div>
                <div class="flex-1">
                <div class="line-height-18px text-[18px] bold relative color-[#384951] font-bold">推送适应病症</div>
                <div class="mt-10px flex items-end gap-10px">
                    <el-select v-model="form.disease_tag_id" placeholder="请选择" class="w-260px">
                       <el-option :value="value.id" :label="value.name" v-for="(value,index) in diseaseList">
                            <template #default="row">
                              <div class="text-center border-b-1px border-[#EEEEEE] border-b-solid">
                                  {{ value.name }}
                              </div>
                            </template>
                       </el-option>
                    </el-select>
                </div>
               </div>
               </div>
                <div v-if="dialogTitle=='添加患者教育'" class="line-height-18px text-[18px] bold  mt-30px mb-10px  relative color-[#384951] font-bold">推送条件</div>
                <div v-if="dialogTitle=='添加患者教育'" class="mb-24px flex justify-start items-center line-height-18px">
                  <div @click="form.push = 2" class="flex justify-start items-center line-height-18px">
                    <img src="@/assets/images/V4/2sel.png" alt="" srcset="" class="w-20px h-20px" v-if="form.push == 2">
                    <img src="@/assets/images/V4/2notsel.png" alt="" srcset="" class="w-20px h-20px" v-if="form.push == 1">
                    <span class="color-[#384951] text-[16px] ml-8px mr-60px">满足全部条件</span>
                  </div>
                  <div @click="form.push = 1" class="flex justify-start items-center line-height-18px">
                    <img src="@/assets/images/V4/2sel.png" alt="" srcset="" class="w-20px h-20px" v-if="form.push == 1">
                    <img src="@/assets/images/V4/2notsel.png" alt="" srcset="" class="w-20px h-20px" v-if="form.push == 2">
                      <span class="color-[#384951] text-[16px] ml-8px mr-60px">满足任意一条</span>
                  </div>
               </div>
              
                <div class="line-height-18px text-[18px] bold  mt-30px mb-10px  relative color-[#384951] font-bold">描述</div>
                <div>
                   <el-input placeholder="描述" v-model="form.remark"  type="textarea" maxlength="50"></el-input>
               </div>
               <div class="line-height-18px text-[18px] bold relative mt-30px dialogtitle font-bold">视频链接</div>
               <div class="mt-10px flex items-end gap-10px">
                   <el-input placeholder="请输入" v-model.trim="form.link"></el-input>
               </div>
           </div>
            <!--  -->
          <template #footer>
            <span class="dialog-footer">
              <div class="cancel-btn" @click="dialogVisible = false">取消</div>
              <div  class="confirm-btn"   @click="savePlan()">确定</div>
            </span>
          </template>
      </custom-dialog>


        <custom-dialog title="删除患者教育" v-model="delDialogVisible"  :width="(640/1920*100)+'%'" >
          <div class="container_del" v-loading="delloading">
               是否删除此患者教育？
          </div>
            <template #footer>
            <span class="dialog-footer">
              <div class="cancel-btn" @click="delDialogVisible = false">取消</div>
              <div  class="confirm-btn"  @click="delConfirm()">确认</div>
            </span>
          </template>
        </custom-dialog>


         <custom-dialog title="添加患者教育" v-model="tstxt"  :width="(640/1920*100)+'%'" >
          <div class="container_del">
                      所有患者教育上线为10条，请删除部分后继续添加。
          </div>
            <template #footer>
            <span class="dialog-footer">
              <div class="cancel-btn" @click="tstxt = false">取消</div>
              <div  class="confirm-btn"  @click="tstxt = false">确认</div>
            </span>
          </template>
        </custom-dialog>
  </footer>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref ,nextTick} from "vue";
import DiseaseApi from "@/api/desease";
import type { rehabilitationTrainingplan } from "@/interface/rehabilitationTraining";
import CareApi from "@/api/care";
import { ElMessage } from "element-plus";

const queryParams = reactive({
  inOrOut: "",
  bindStatus: "",
  name: "",
  bedNumber: "",
  page:1,
  perPage:10
});
const form = ref({
    title:"",
    remark:"",
    link:"",
    id:"",
    push:2,
    node_id:-1,
    disease_tag_id:-1,
});
let total = ref(0);
let tableLoading = ref(false);
let tableData = ref<any[]>([]);
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
    let { data } = await CareApi.video_list(_q);
    let _arr = data?.result || [];;
    tableData.value =_arr;
  } catch (error) {
  } finally {
    tableLoading.value = false;
  }
}


const diseaseList = ref<any>([])
const getDiseaseList = async () => {
    try {
        let res = (await DiseaseApi.getTagList());
        if(Array.isArray(res.data?.result) && res.data?.result.length>0){
            diseaseList.value =  res.data?.result
        }else{
           diseaseList.value = []
        }
    } catch (error) {
        
    }   
    diseaseList.value = [{id:-1,name:'所有患者'},{id:-2,name:'不推送'},...diseaseList.value]
}
 const list4 = ref<any>([])
  const getData4 = async ()=>{
    try {
        let res = await DiseaseApi.getNodeList({});
        let _list = res?.data?.result;
        if(Array.isArray(_list) && _list.length>0){
          list4.value = _list;
        }else{
            list4.value = []
        }
    } catch (error) {
        list4.value = []
    }
     list4.value = [{id:-1, name:'所有患者'},{id:-2,name:'不推送'},...list4.value]
}
onMounted(() => {
  getList();
  getDiseaseList();
  getData4()
});





let dialogVisible = ref(false);
let dialogTitle = ref("添加患者教育"); 
let dialogObj = ref<rehabilitationTrainingplan>({} as rehabilitationTrainingplan);
let delDialogVisible = ref(false);
let personList = ref<any[]>([]);
const handleOpen = async () => {
   if(tableData.value.length === 10){
         tstxt.value = true;
         return;
    };
  form.value = {
    title:"",
    remark:"",
    link:"",
    id:"",
    push:2,
        node_id:-1,
    disease_tag_id:-1,
}
  dialogTitle.value = "添加患者教育";
  dialogVisible.value = true;
};

let loading = ref(false);
 
const tstxt =ref(false);


 
const savePlan = async () => {
  
 
   if(!form.value.title){
      return ElMessage.error("请填写标题");
   }
  
if(!form.value.link){
      return ElMessage.error("请填写视频链接");
   }
   try {
  
    if(dialogTitle.value === "添加患者教育"){
        if(!form.value.node_id){
          return ElMessage.error("请选择病程节点");
      }
        if(!form.value.disease_tag_id){
          return ElMessage.error("请选择适应病症");
      }
        if(tableData.value.length === 10){
            tstxt.value = true;
            return;
        };
          loading.value = true;
        await CareApi.add_video({
          url:form.value.link,
          title:form.value.title,
          desc:form.value.remark,
          push:form.value.push,
          node_id:form.value.node_id,
          disease_tag_id:form.value.disease_tag_id
      });
        loading.value = false;
getList();
  dialogVisible.value = false;
         ElMessage.success("新增成功");
        return;
    }
      let index = tableData.value.findIndex((v:any) => v.id === form.value.id);
      tableData!.value[index]!.title = form.value.title;
      tableData!.value[index]!.url = form.value.link;
      tableData!.value[index]!.desc = form.value.remark || "";
      dialogVisible.value = false;
         ElMessage.success("修改成功");
       await CareApi.edit_video({
         status:1,
          id: form.value!.id,
          url:form.value.link,
          title:form.value.title,
          desc:form.value.remark
      });
   } catch (error) {
    dialogVisible.value = false;
     loading.value = false;
   }
}
const handleUpdate = (item:any) => {
  form.value = {
      title:item.title,
    remark:item.desc,
   push:1,
   node_id:-1,
    link:item.url,
    id:item.id,
    disease_tag_id:-1
  };
  dialogTitle.value = "修改患者教育";
  dialogVisible.value = true;
};


const delloading = ref(false);
const delConfirm = async () => {
  delloading.value = true;
   try {
    
       await CareApi.edit_video({
        title:form.value.title, 
        url:form.value.link,
        desc:form.value.remark,
          status:2,
          id: form.value.id
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
   
const handleDel = (item:any) => {
   form.value = {...item};
   delDialogVisible.value = true;
}




</script>

<style scoped>
@import "@/assets/css/pageStyles/page.css";
:deep(.el-table__cell){
  height: 64px !important;
}


.dialog-content{
    padding: 24px;
}


.dialogtitle::after{
      content: "*";
      position: absolute;
      left: -10px;
      top: 0;
      color: #F04A4B;
}

:deep(.ep-textarea__inner){
      height: 100px;
}

.text-underline{
  text-decoration: underline;
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
  width: 90px;
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
  height: 80px;
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px;
  border: 1px solid #EEEEEE;
  border-radius: 12px;
}
.header .header_title {
  width: fit-content;
  height: 48px;
  font-size: 16px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap:4px;
  background-color: #24B287;
  margin: 19px 24px;
  min-width: 119px;
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
  padding: 0 24px 24px 24px;
}
.nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  background-color: #fff;
  gap: 24px;
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
