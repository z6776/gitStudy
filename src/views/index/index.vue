<template>
  <div class="indexcontainer">
    <div class="search" v-if="!settingvalueDialog">
      <div class="tabs">
        <div
          class="tab-name"
          v-for="(value, index) in tabs"
          :key="index"
          :class="{ active: index === cur }"
          @click="changeTab(index)"
        >
          {{ value.name }}
        </div>
      </div>
      <div class="flex">
        <div class="search-input-container">
          <Transition>
            <input
              v-model="searchText"
              type="text"
              placeholder="请输入姓名/床位号"
              maxlength="20"
              v-if="showinput"
              @keyup.enter="fetchData()"
              @input="changeInput"
            />
          </Transition>
          <div class="search-input" @click="showinput = true" :class="{ 'border-none': showinput }">
            
            <img src="@/assets/images/indexSearch.png" alt="" v-if="!showinput" />
            <img src="@/assets/images/indexclose.png" alt="" v-if="showinput && searchText" @click="cleartext" />
          </div>
        </div>
        <div class="createbed cursor-pointer" @click="createBed">
          <img src="@/assets/images/bedicon.png" alt="" />
          <span>创建床位</span>
        </div>
      </div>
    </div>
    <empty v-if="!listloading && indexItem.length === 0" />
    <template v-else>
      <div class="grid-container" v-if="!settingvalueDialog" v-loading="listloading">
        <ListItemV2
          v-for="(value, index) in indexItem"
          :key="index"
          :patientInfoForm="value"
          :unbindBedList="unbindBedList"
          @openChangeDeviceDialog="openChangeDeviceDialog"
          @settingValue="settingValue"
          @openTag="openTag(value)"
          @AddEvent="addEventFn(value)"
          @BindWatch="BindWatch"
          @refresh="fetchData()"
        />
      </div>
    </template>
    <DeviceSetCopy
      v-if="settingvalueDialog"
      :patientid="patientid"
      @closeBindDialog="closeBindDialog"
    />

    <custom-dialog
      v-model="dialogVisible"
      append-to-body
      class="_loading"
      title="创建床位"
      :width="`${(612 / 1920) * 100}%`"
      top="25vh"
    >
      <div class="form_box w-400px m-[30px_auto]">
        <el-form
          :model="bedForm"
          :rules="bedFormRules"
          label-width="auto"
          ref="bedFormRef"
          label-position="right"
        >
          <el-form-item label="床位号" prop="bed_number">
            <el-input
              maxlength="10"
              :disabled="editBedItem.item.use === 2"
              type="text"
              v-model="bedForm.bed_number"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="序号" prop="num">
            <el-input
              oninput="if(value.length>10)value=value.slice(0,10)"
              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              type="number"
              min="1"
              v-model="bedForm.num"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="房间号" prop="room_number">
            <el-input
              oninput="if(value.length>10)value=value.slice(0,10)"
              type="number"
              min="0"
              :disabled="editBedItem.item.use === 2"
              v-model="bedForm.room_number"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注说明" prop="remark">
            <el-input
              maxlength="300"
              :rows="4"
              type="textarea"
              show-word-limit
              v-model="bedForm.remark"
              placeholder="对床位信息进行补充"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="info" @click="dialogVisible = false">取消</el-button>
          <el-button size="large" type="primary" @click="submitForm()"> 确定 </el-button>
          <!-- <el-button size="large" type="danger">
                    解绑 
                </el-button> -->
        </div>
      </template>
    </custom-dialog>
 
    <changeWatch v-model="changeDailogVisible" :ptype="changeDeviceType" v-model:change-patinet="changePatinet" @refresh="fetchData" />

       <custom-dialog v-model="tagDialog" append-to-body class="_loading" title="护理注意事项标记"
        :width="`${(1000 / 1920) * 100}%`" top="15vh">
        <div class="p-[24px]">
               <div class="line-height-18px flex flex-start mb-20px">
                  <span class="color-[#384951] text-[18px] font-bold mr-[10px]">{{ currrentTitle }}</span>
               </div>
               <div class="h-160px overflow-y-auto">
                 <TabList
                    type="multiple"
                    :column="5"
                    :list="tabdataParent"
                    @change="handleMultipleChange"
                  />  
                    <!--  settingSubmit -->
               </div>

               <div class="w-936px min-h-81px selectborder p-[20px]">
                    <TabList
                    type="del"
                    :column="5"
                    :list="selectList"
                    @del="delItem"
                  />  
               </div>

        </div>
        <template #footer>
            <div class="flex gap-0px! justify-center items-center pb-20px">
                <el-button size="large" type="info" @click="isFresh = false,settagDialog(false),settagDialogAll(true)">取消</el-button>
                <el-button size="large" type="primary" @click="isFresh = false,submitFormEdit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>

    <addEvent ref="addEventRef"
    v-model="tagDialogVislble"
    @addTag="addTag"
    @refresh="fetchData"
    :patient_id="CurrentPatientID"
    :isFresh="isFresh"
 
    />

    <nursingEvents v-model="AddEventVislble"  :showDatePicker="false" :patient_id="CurrentPatientID" :ccid="ccid" @refresh="fetchData" />


     <bindWatch ref="bindWatchRef" v-model="bindWatchVislble" @refresh="fetchData" :patient-id="CurrentPatientID" :ptype='ptype'  />


  </div>
</template>
<script setup lang="ts">
import { ref, watch, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import addEvent from "./components/addEvent.vue";
import bindWatch from "./components/bindWatch.vue";
import changeWatch from "./components/changeWatch.vue";
import type { BedForm, ChangeWatchPatient, PatientItem } from '@/interface/interface'
import { ElLoading, ElMessage, ElMessageBox, type FormRules } from 'element-plus'
import   { type PatientInfoType ,fixedLabelStatus,MonitoringLevel,type PatientLabels} from "@/views/index/types/index";
import ScreenApi from '@/api/screen';
import { useTagDialog,useSelectTag,useTagDialogAll ,useAddEvent,usebindWatchVislble,useCurrentPatient,usesugerDailogVisible} from "./hook/index"
import type { TagType } from "@/interface/interface";
import {
  debounce,
} from '@/utils/function/function'
import { useCounterStore } from '@/stores/counter'
import BedApi from '@/api/bed'
const counterStore = useCounterStore()
// 标签数据
const { tagDialog,settagDialog } = useTagDialog();
const { selectList, setSelectList } = useSelectTag();
const { tagDialogVislble,settagDialogAll } = useTagDialogAll();
const {AddEventVislble,settAddEventVislble } = useAddEvent();

 
const  {
        CurrentPatientID,
        setCurrentPatient
    }= useCurrentPatient();
const {
        bindWatchVislble,
        setbindWatchVislble
    }= usebindWatchVislble();

const ccid = ref<string>();
const addEventFn = (item:PatientInfoType)=>{
  CurrentPatientID.value =item.patientId as number;
  ccid.value = item.watch?.ccid || "";
  settAddEventVislble(true)
}

const tabdataParent = ref<TagType[]>([

]);

const handleMultipleChange = (values:number[])=>{
      let _arr:any[] = [];
      values.forEach((item)=>{
        _arr.push(tabdataParent.value.find((item1)=>item1.value === item))
      });
      setSelectList(_arr)
}
const delItem = (index: number) => {
   let item = selectList.value[index];
   let _index = tabdataParent.value.findIndex((item1)=>item1.value === item.value);
   if(_index > -1){         
      tabdataParent.value[_index] = Object.assign({}, tabdataParent.value[_index], { selected: false });
   }

   selectList.value.splice(index, 1);
}

const currrentTitle = ref<string>("");
 
const addTag = (list: any,selectes:any,title:string) => {
  currrentTitle.value = title
  tabdataParent.value = JSON.parse(JSON.stringify(list));
  if(Array.isArray(selectes) && selectes.length > 0){
     let _s = list.filter((item:any)=>{
         return selectes.includes(item.value)
     });
      setSelectList(_s);
  }else{
    setSelectList([]);
  }
   settagDialogAll(false);
    settagDialog(true);
}

const isFresh = ref(false);

const openTag = (value:PatientInfoType)=>{
  isFresh.value = true;
  CurrentPatientID.value = value.patientId as number;
  settagDialogAll(true);
}

const addEventRef = ref<any>(null);
const submitFormEdit = ()=>{
  isFresh.value = false;
  settagDialog(false)
  settagDialogAll(true);
  nextTick(()=>{
   addEventRef.value!.editList(selectList.value);
  })
  
}





const ptype = ref("watch");
//
const BindWatch = (id:number,type:'suger'|'watch')=>{
  ptype.value = type; 
  setCurrentPatient(id)
    setbindWatchVislble(true);
}




// 更换设备
const changeDailogVisible = ref(false)

const changePatinet = ref<any>({
})

 
const changeDeviceType = ref<'suger'|'watch'>("watch");
const openChangeDeviceDialog = (item:any) => {
  nextTick(() => {
     changeDeviceType.value  = item.type;
    changePatinet.value = item;
    changeDailogVisible.value = true
  })
}

const debounceFetchData = debounce(() => {
  indexItem.value = []
  listloading.value = true
  fetchData()
}, 500)
const changeInput = (e: any) => {
  searchText.value = e.target.value
  debounceFetchData()
}

// 设置阈值
const settingvalueDialog = ref(false)
const patientid = ref(0)
const settingValue = (item: any) => {
  patientid.value = item.id
  settingvalueDialog.value = true
}
const closeBindDialog = () => {
  settingvalueDialog.value = false
}

  
const checkNum = (rule: any, value: any, callback: any) => {
  setTimeout(() => {
    if (!Number.isInteger(Number(value))) {
      callback(new Error('请输入从1开始的整数'))
    } else {
      if (value == 0) {
        callback(new Error('请输入从1开始的整数'))
      } else {
        callback()
      }
    }
  }, 200)
}
const bedFormRules = reactive<FormRules<typeof bedForm>>({
  bed_number: [{ required: true, message: '请输入床位号', trigger: 'blur' }],
  num: [
    { required: true, message: '请输入序号', trigger: 'blur' },
    { validator: checkNum, trigger: 'blur' },
  ],
  remark: [{ required: false }],
})

const bedForm = reactive<BedForm>({
  bed_number: '',
  room_number: '',
  remark: '',
  num: '',
})
type EditBedItem = {
  item: Partial<{
    use?: number
  }>
}
const editBedItem = reactive<EditBedItem>({
  item: {},
})
const dialogVisible = ref(false)
const bedFormRef = ref()
const createBed = () => {
  bedForm.id && delete bedForm.id
  for (const key in bedForm) {
    if (Object.prototype.hasOwnProperty.call(bedForm, key)) {
      bedForm[key] = ''
    }
  }
  editBedItem.item = {}
  dialogVisible.value = true
  bedFormRef.value?.clearValidate()
}
const submitForm = () => {
  const formEl = bedFormRef.value //elform实例
  if (!formEl) return
  formEl.validate(async (valid: any) => {
    //表单验证
    if (valid) {
      const Formloading = ElLoading.service({
        target: '._loading',
      })
      let data = Object.assign({}, bedForm)
      try {
        const result = await BedApi.editBed(data)
        if (result) {
          fetchData();
          getBedList();
          Formloading.close()
          ElMessage.success('操作成功')
          dialogVisible.value = false
          cleartext()
        }
      } catch (error) {
        Formloading.close()
      }
    }
  })
}

const cur = ref(0);
const changeTab = (index: number) => {
  
 
    cur.value = index;
    indexItem.value = [];
    listloading.value = true;
    fetchData();
 
}
const tabs = ref([
  {
    name: '全部',
    value: '',
  },
  {
    name: '特级护理',
    value: '4',
  },
  {
    name: '一级护理',
    value: '1',
  },
  {
    name: '二级护理',
    value: '2',
  },
  {
    name: '三级护理',
    value: '3',
  },
])

const searchText = ref('')
const showinput = ref(false)
const cleartext = () => {
  if (!searchText.value) {
    return
  }
  searchText.value = ''
  indexItem.value = []
  listloading.value = true
  fetchData()
}
const timer = ref(0)
watch(
  [() => searchText.value, () => showinput.value],
  ([newval, inputnew], [oldval, inputold]) => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    // 不存在搜索内容，且inputnew = true; 五秒后关闭
    if (!searchText.value && inputnew) {
      timer.value = setTimeout(() => {
        showinput.value = false
        clearTimeout(timer.value)
      }, 5000)
    }
  },
  { immediate: true },
)

// 首页列表接口
const indexItem = ref<PatientInfoType[]>([]);
const listloading = ref(false)
const fetchData = async () => {
  try {
    let res = await ScreenApi.indexV2List({
      level_of_care: tabs.value[cur.value]?.value || '',
      search: searchText.value
    })
    indexItem.value = res;
    listloading.value = false;
  } catch (error) {
    listloading.value = false
    return (indexItem.value = [])
  }
}
watch(
  () => counterStore.count,
  (val) => {
    settingvalueDialog.value = false;
    changeTab(0); 
  },
  { deep: true, immediate: true },
)

const pollInterval = ref(10000) // 默认轮询间隔10秒
const isPolling = ref(true) // 轮询开关
let nextPollTimeout: number | null = null

// 递归轮询函数
const startPolling = async () => {
  if (!isPolling.value) return

  try {
    await fetchData()
 
    nextPollTimeout = window.setTimeout(startPolling, pollInterval.value)
  } catch (error) {
 
    nextPollTimeout = window.setTimeout(startPolling, pollInterval.value * 2)
  }
}

// 停止轮询
const stopPolling = () => {
  isPolling.value = false
  if (nextPollTimeout !== null) {
    clearTimeout(nextPollTimeout)
    nextPollTimeout = null
  }
}
const unbindBedList = ref<any>([])
const getBedList = async () => {
    try {
        let res = (await BedApi.getBedList({ page: 1, perPage: 999, use: 1 }));
      
        if(Array.isArray(res.data?.result?.data) && res.data?.result?.data.length>0){
            unbindBedList.value = [...res.data?.result?.data];
        }else{
           unbindBedList.value = []
        }
    
    } catch (error) {
        
    }   
} 
onMounted(() => {

  getBedList();
  // fetchData() // 初始加载
    // for (let index = 0; index < 11; index++) {
    //   tabdataParent.value.push({
    //       value: index,
    //       label: `标签${index}`,
    //       selected: false,
    //     })
    // };
    listloading.value = true
  isPolling.value = true
  startPolling() // 开始轮询
})

onUnmounted(() => {
  stopPolling() // 组件卸载时停止轮询
})
</script>
<style scoped>

:deep(.ep-textarea .ep-input__count){
    background-color: transparent !important;
}

  .selectborder{
background: #FFFFFF;
border-radius: 8px 8px 8px 8px;
border: 1px solid #EEEEEE;
  }
/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; 
  background: #cdcdcd;
  margin-left: 10px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #cdcdcd;
  border-radius: 4px;
    width: 4px; 
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #24b287;
  border-radius: 4px;
    width: 4px; 
  min-height: 70px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #24b287;
}
.borderb {
  border-bottom: 1px solid #eeeeee;
}
.device_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 0;
}

.device_model {
  font-size: 14px;
  color: #636676;
}

.device_ccid {
  font-size: 14px;
  color: #636676;
  display: flex;
  flex-wrap: nowrap;
}
.indexcontainer {
  box-sizing: border-box;
  position: relative;
  .search {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    position: sticky;
    z-index: 10;
    top: 0;
    /* border-radius: 12px; */
    padding: 0px 20px;
    .tabs {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      .tab-name {
        box-sizing: border-box;
        min-width: 66px;
        padding: 0 12px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 8px;
        cursor: pointer;
        font-family:
          Alibaba PuHuiTi 3,
          Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 14px;
        color: #636676;
        background-color: #f5f7fb;
        border: 1px solid #eeeeee;
      }
      .active {
        background-color: #24b287;
        border: 1px solid #24b287;
        color: #fff;
        font-weight: 800;
      }
    }

    .search-input-container {
      /* width: 260px; */

      display: flex;
      height: 32px;
      background: #f5f7fb;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #eeeeee;
      /* transition: all 3s linear; */
      .v-enter-active,
      .v-leave-active {
        transition: width 0.2s ease-out;
      }

      .v-enter-from,
      .v-leave-to {
        width: 0px;
      }
      .border-none {
        border: none !important;
      }
      input {
        width: 230px;
        height: 32px;
        font-size: 14px;
        color: #384951;
        line-height: 16px;
        padding-left: 12px;
        padding-right: 12px;
        outline: none;
        border: none;
        background-color: transparent;
      }

      .search-input {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        background: #f5f7fb;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #eeeeee;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 16px;
          height: 16px;
        }
      }
      .search-input:active {
        background-color: rgba(146, 159, 175, 0.16);
      }
    }

    .createbed {
      width: fit-content;
      display: flex;
      gap: 4px;
      padding: 0 12px;
      height: 32px;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
      font-family:
        Alibaba PuHuiTi 3,
        Alibaba PuHuiTi 30;
      font-weight: normal;
      font-size: 14px;
      color: #ffffff;
      background-color: #24b287;
      border-radius: 8px;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .grid-container {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 20px;
  }
}



.change_device_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 148px;
  background: #fff;
  border-radius: 12px;
  /* box-shadow: 0 4px 24px 0 rgba(146,159,175,0.10); */
  height: 624px;
  /* padding: 24px 111px; */
}

.change_right {
  flex: 1;
  height: 100%;
  min-width: 260px;
  border: 1px solid #eeeeee;
  .bind_head {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    color: #384951;
    text-align: center;
    background-color: #f5f7fb;
    height: 48px;
    line-height: 48px;
    position: sticky;
    top: 0;
    z-index:999;
  }
}
.bind_head {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  background: #f5f7fb;
}



.change_left {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 397px;
  border: 1px solid #eeeeee;
  .bind_head {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    color: #384951;
    text-align: center;
    background-color: #f5f7fb;
    height: 48px;
    line-height: 48px;
    position: sticky;
    top: 0;
  }
}

.ccid_list {
  height: 250px;
  overflow-y: auto;
}
.ccid_list::-webkit-scrollbar {
  width: 4px !important;
}
 

.change_ccid_item {
  background: #fff;
  border-radius: 8px;
  /* box-shadow: 0 2px 8px 0 rgba(146,159,175,0.08); */
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  min-height: 72px;
  position: relative;
}

.change_left .change_ccid_item {
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 120px;
  margin-bottom: 0;
}

.change_left .change_ccid_item::before {
  content: '';
  display: block;
  width: 48px;
  height: 48px;
  /* background: url('@/assets/images/device_icon.png') no-repeat center/contain; */
  margin-bottom: 12px;
}
.change_right {
  height: 100%;
  overflow-y: auto;
  position: relative;
}
.change_right .change_ccid_item {
  cursor: pointer;
  padding-left: 20px;
  padding-right: 20px;
}

.change_right .change_ccid_item.selected,
.change_right .change_ccid_item[aria-checked='true'] {
  border-color: #24b287;
}

.change_right .change_ccid_item .el-radio {
  margin-right: 12px;
}

.change_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  margin: 0 24px;
}

.change_icon img {
  width: 40px;
  height: 40px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 24px;
}

/* @media (max-width: 900px) {
  .change_device_box {
    flex-direction: column;
    padding: 24px 8px;
  }
  .change_icon {
    margin: 16px 0;
  }
} */
</style>
