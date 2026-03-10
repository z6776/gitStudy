<template>
  <div class="nursingEventRecord">
    <customDialog
      v-model="bindDailogVisible"
      append-to-body
      class="_loading"
      title="护理事件记录"
      :show-close="false"
      :width="`${(1000 / 1920) * 100}%`"
      top="10vh"
    >
      <div class="p-[24px_48px]">
        <el-date-picker
          class="w-260px mb-20px customPrefix"
          v-model="date"
          type="date"
          :prefix-icon="customPrefix"
          placeholder="请选择"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="getTableData1"
          v-if="showDatePicker"
        />
<!-- :height="isShow ? 'auto' : '700px'"  -->
        <el-table :data="tableData"
         header-row-class-name="h-56px"
        header-cell-class-name="color-#384951 text-16px font-bold"
        style="width: 100%"  :max-height="isShow ? '250px' : '700px'" class="overflow-x-hidden tableshadow" v-loading="Loading1">
          <el-table-column
            prop="name"
            label="患者姓名"
            align="center"
            width="175px"
          ></el-table-column>
          <el-table-column prop="ccid" label="CCID" align="center" width="200px"></el-table-column>
          <el-table-column prop="tag" label="记录时间" align="center" width="175px">
            <template #default="scope">
              <span>{{ dateFtt('yyyy-mm-dd hh:MM:ss',  scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="tag"
            label="事件描述"
            align="center"
            width="175px"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="props">
              <el-button
                type="danger"
                @click="
                
                  (setRow(props.row),
                  setdialogObj(EventEnum.ISDEL),
                  setDialog(false),
                  openTwoConfirm(true))
                "
                plain
                class="w-100px border-none"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <template v-if="isShow">
          <!--  -->
        <div
          class="w-900px max-h-254px m-[24px_0px] border border-1 border-solid border-[#EEEEEE] rounded-[8px] p-[24px] overflow-y-auto overflow-x-hidden"
           v-loading="Loading"
        >
          <div class="color-[#384951] font-bold text-[16px] line-height-16px">护理类型</div>
          <div class="flex justify-start items-center mt-[12px] gap-12px">
            <div
              v-for="(item, index) in typelist"
              :key="index"
              @click="selectType(index)"
              class="w-160px h-40px line-height-40px gap-8px cursor-pointer flex items-center justify-center bg-[#F5F7FB] rounded-[8px] text-center text-[16px] text-[#636676] border-1 border-solid border-[#F5F7FB]"
              :class="{ selectActive: index == typeIndex }"
            >
              <img
                 src="@/assets/images/V2/gougou.png"
                class="w-18px h-18px"
                v-if="index == typeIndex"
              />
              {{ item.label || '--' }}
            </div>
          </div>

          <div class="color-[#384951] font-bold text-[16px] line-height-16px mt-24px">护理标签</div>
          <div class="col-5 mt-[12px] w-846px">
            <div
              v-for="(item, n) in typeValueChild"
              :key="n"
              @click="selectValue(n)"
              class="w-160px h-40px line-height-40px gap-8px cursor-pointer flex items-center justify-center bg-[#F5F7FB] rounded-[8px] text-center text-[16px] text-[#636676] border-1 border-solid border-[#F5F7FB]"
              :class="{ selectActive: n == valueIndex }"
            >
              <img
                src="@/assets/images/V2/gougou.png"
                class="w-18px h-18px"
                v-if="n == valueIndex"
              />
              <span>{{ item.tag || '--' }}</span>
            </div>
          </div>
        </div>

        <div
          class="flex justify-center items-center gap-4px w-130px h-48px mb-30px bg-[#24B287] rounded-[8px] w-100% m-[24px_auto] line-height-16px hover:opacity-80 cursor-pointer"
          @click="(setdialogObj(EventEnum.ISADD), checkForm())"
        >
          
          <img src="@/assets/images/V2/add.png" class="w-18px h-18px" />
          <span class="color-[#FFFFFF] text-[16px]">添加事件</span>
        </div>
          </template>
      </div>
    </customDialog>

    <custom-dialog
      v-model="twoConfirm"
      append-to-body
      class="_loading"
      :title="dialogObj.title"
      :show-close="false"
      :width="`${(640 / 1920) * 100}%`"
      top="25vh"
     
    >
      <div class="h-300px  flex justify-center items-center">
        <div   v-loading="loading">{{ dialogObj.content }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="info" @click="(openTwoConfirm(false), setDialog(true))"
            >取消</el-button
          >
          <el-button size="large" type="primary" @click="submitConfirmAdd()"> 确认 </el-button>
        </div>
      </template>
    </custom-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch,nextTick } from 'vue'
import { EventEnum } from '@/interface/interface'
import CareApi from '@/api/care'
import { dateFtt } from '@/utils/date/dateFtt'
import { ElMessage } from 'element-plus'
 import { useCustom } from '@/hooks/useCustom';
  const { customPrefix } =  useCustom();  

const props = withDefaults(
  defineProps<{ modelValue: boolean; showDatePicker?: boolean; patient_id: number,ccid?:string }>(),
  {
    modelValue: false,
    ccid:'',
    patient_id: 0,
    showDatePicker: true,
  },
)
const emits = defineEmits(['update:modelValue','refresh'])
const date = ref( dateFtt('yyyy-mm-dd', new Date()))

const typeIndex = ref(0)
const typelist = ref<any[]>([])

const selectType = (i: number) => {
  typeIndex.value = i;
  valueIndex.value = -1;
}

const typeValue = ref<any[]>([])

const valueIndex = ref(-1)

const selectValue = (i: number) => {
  valueIndex.value = i
}

const isShow = computed(() => {
   return date.value === dateFtt('yyyy-mm-dd', new Date())
})


watch(
  () => props.modelValue,
  (val) => {
    if (val) {
        selectValue(-1),
      getTableData1()
      getTableData()
    }
  },
  { immediate: true },
)



 const useLoading = () => {
    const Loading = ref(false);
    const setLoading= (b:boolean)=>{
        Loading.value = b;
    }
    return {
        Loading,
        setLoading
    }
}

const { Loading, setLoading } = useLoading();

 const useLoading1 = () => {
    const Loading1 = ref(false);
    const setLoading1= (b:boolean)=>{
        Loading1.value = b;
    }
    return {
        Loading1,
        setLoading1
    }
}

const { Loading1, setLoading1 } = useLoading1();


const getTableData1 = async () => {
  try {
    setLoading1(true);
    const res = await CareApi.getEventLog({
      patient_id: props.patient_id,
      page: 1,
      perPage: 99999,
      date_time:dateFtt('yyyymmdd',date.value) 
    })
    tableData.value = res?.data?.result?.data  || []
       setLoading1(false);
    //  /care/patient
  } catch (error) {
    tableData.value = []
  
     setLoading1(false);
  }
}


const getTableData = async () => {
  try {
    setLoading(true);
    const _res = await CareApi.getPatientList({
      type: 1,
    })
    nextTick(() => {

    if (Array.isArray(_res?.data?.result) && _res?.data?.result.length > 0) {
      typelist.value = _res?.data?.result.map((item: any, index: number) => {
        return {
          label: item.name,
          value: index,
        }
      })

      typeValue.value = _res?.data?.result.map((item: any, index: number) => {
        return item.list || []
      });
    } else {
      typelist.value = []
      typeValue.value = []
    }
      })
       setLoading(false);
    //  /care/patient
  } catch (error) {
    typelist.value = []
    typeValue.value = []
     setLoading(false);
  }
}


const typeValueChild = computed(() => {
  if (!Array.isArray(typeValue.value)) {
    return []
  }
   if (Array.isArray(typeValue.value) && typeValue.value.length === 0) {
    return []
  }
  return typeValue.value[typeIndex.value] as any[];
})

const tableData = ref<any[]>([])

const bindDailogVisible = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  },
})

const setDialog = (b: boolean) => {
  emits('update:modelValue', b)
}

// 添加删除类别区分
const useContent = () => {
  const dialogObj = ref({
    title: '',
    content: '',
    status: 0,
  })
  const setdialogObj = (type: EventEnum) => {
    dialogObj.value.status = type
    if (type === EventEnum.ISADD) {
      dialogObj.value = {
        title: '添加护理事件记录',
        content: '是否确定添加护理事件记录',
        status: EventEnum.ISADD,
      }
      return
    }

    dialogObj.value = {
      title: '删除护理事件记录',
      content: '是否确定删除本条记录',
      status: EventEnum.ISDEL,
    }
  }
  return {
    dialogObj,
    setdialogObj,
  }
}
const { dialogObj, setdialogObj } = useContent()

const useDialog = () => {
  const twoConfirm = ref(false)
  const openTwoConfirm = (b: boolean) => {
    twoConfirm.value = b
  }
  const row = ref<any>({})
  const setRow = (r: any) => {
    row.value = r
  }
  return {
    twoConfirm,
    openTwoConfirm,
    row,
    setRow,
  }
}

const { twoConfirm, openTwoConfirm, row, setRow } = useDialog()
 

const checkForm = ()=>{
  if(valueIndex.value===-1){
    return ElMessage({
          message: '请选择护理标签',
          type: 'error',
        })
  }
    if(!props.ccid){
          return ElMessage.error("未绑定设备");
      }
   setDialog(false),
 openTwoConfirm(true);
}
const loading = ref(false);
const submitConfirmAdd = async () => {
  try {
   loading.value = true;
    if(dialogObj.value.status === EventEnum.ISADD){
       let _d = {
        ccid:props.ccid,
        patient_id: props.patient_id,
        tag_id:typeValue.value[typeIndex.value][valueIndex.value].tag_id,
      }
     await CareApi.addEvent(_d);
       ElMessage.success("添加成功");
       openTwoConfirm(false);
    }else{
       let _d = {
        patient_id: props.patient_id,
        log_id:row.value?.log_id || ""
      }
     await CareApi.deleteEvent(_d);
     openTwoConfirm(false);
      emits("update:modelValue", true);
    getTableData1();
    }
     loading.value = false;
     emits("refresh")
    
  } catch (error) {
    loading.value = false;
  }
}
</script>
<style scoped>
.col-5 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 12px;
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
    background: #24B287;
    border-radius: 4px;
    min-height: 70px;
    transition: background 0.2s;
  }

  /* 鼠标悬停时滑块颜色 */
  ::-webkit-scrollbar-thumb:hover {
    background: #24B287;
  }

  /* 横向滚动条（如有） */
  ::-webkit-scrollbar-horizontal {
    height: 12px;
  }

.selectActive {
  background-color: #eafff9;
  color: #24b287;
  border: 1px solid #24b287;
}
</style>
