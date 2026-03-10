 <template>
  <custom-dialog
      v-model="bindDailogVisible"
      append-to-body
      class="_loading"
      :title="watchOrSuger[ptype].dialogTitle"
      :show-close="false"
      :width="`${(640 / 1920) * 100}%`"
      top="19vh"
    >
      <div class=" p-[24px]  h-500px overflow-y-auto">
        <div class="w-420px m-[0_auto]">
        <div class="flex justify-start items-center flex-shrink-0 mb-20px">
          <div class="color-[#636676] text-[16px]">{{watchOrSuger[ptype].dialogContent}}</div>
          <div class="flex-1">
               <el-input v-model="deviceName" :placeholder="watchOrSuger[ptype].dialogBtn" @input="changeInput"/>
          </div>
        </div>
        <div class=""  v-loading="unbindTableLoading">
            <debiceItem v-for="(device, index) in devices" :key="index"
            v-if="devices.length > 0"
              v-model="device.isSelected"
                :model="device.model"
                :ccid="device.ccid"
                :device-image="device.icon!"
                @handleClick="handleClick(index)"
            />
             <div v-else>
            <empty />
        </div>
        </div>
       
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
           <el-button size="large" type="info" @click="closeDialog()">取消</el-button>
                <el-button size="large" type="primary" @click="saveList">保存</el-button>
        </div>
      </template>
    </custom-dialog>
 </template>
 <script setup lang="ts">
import { computed, onMounted, ref,watch } from 'vue';
import PatientApi from '@/api/patient';
import XtApi from '@/api/suger';
import { getModelSuger } from '@/utils/function/function';
import {handleData} from '@/utils/handleDataFn';
import  { type watchType} from "@/views/index/types/index";
import { ElMessage,ElLoading } from 'element-plus';
import {
  debounce
} from '@/utils/function/function'
import PatientInfo from '@/components/PatientInfo.vue';
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    patientId:{
        type: Number,
        require:true
    },
    ptype:{
      type: String,
        default: "watch"
    }
});

watch(()=>props.modelValue, (newVal) => {
     if(newVal){
      unbindTableLoading.value = true;
      fetchUnBindCcidList();
     }
})

const watchOrSuger = ref<Record<string,any>>({
    'watch': {
      'dialogTitle': '绑定设备',
      'dialogContent': '设备名称：',
      'dialogBtn': '请输入设备CCID查询'
    },
    'suger': {
      'dialogTitle': '绑定设备',
      'dialogContent': '设备查询：',
      'dialogBtn': '请输入设备ID查询'
    },
})


const bindDailogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emits('update:modelValue', val)
    }
});

const closeDialog = () => {
    emits('update:modelValue', false)
}
const emits = defineEmits(['settagDialog',"update:modelValue",'addTag','refresh'])
const saveList = async () => {
  let flag  = devices.value.some(item => item.isSelected)
  if (!flag) {
    ElMessage.error('请先选择设备')
    return
  }
  let data = {
    ccid: devices.value.find(item => item.isSelected)!.ccid,
    bind: 1,
    patient_id: props.patientId
  }
  let item = devices.value.find(item => item.isSelected) as any;
  let sgger = {
     id: item.id,
     patient_id: props.patientId
  }
  const Formloading = ElLoading.service({
    target: '._loading',
  })
  try {
    const result =  props.ptype==='watch' ? await PatientApi.editBedDevice(data) : await XtApi.bind(sgger)
    if (result) {
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
      bindDailogVisible.value = false
      Formloading.close()
      emits('refresh')
    }
  } catch (error) {
    Formloading.close()
  }
}

const handleClick = (index:number) => {
    let arr = [...devices.value];
    arr.forEach((item, i) => {
        if (i == index) {
            item.isSelected = true;
        } else {
            item.isSelected = false
        }
    })
    devices.value = arr
}

const deviceName = ref('');
let unbindTableLoading = ref(false);
type watchDia = Pick<watchType,'ccid' | 'model' | 'icon'> & {isSelected:boolean};
let devices = ref<watchDia[]>([]);
const fetchUnBindCcidList = async () => {
  let res = props.ptype==='watch' ?  (await PatientApi.getUnBindCcidList({ bind: 2 ,ccid:deviceName.value })).data.result
  : (await XtApi.getBindNotList({ ccid: deviceName.value })).data.result;
  if(Array.isArray(res) && res.length > 0){
      devices.value = res.map(item => {
        return props.ptype==='watch' ? {
             ccid:item.ccid,
             isSelected:false,
            model:item.model,
            icon: handleData.getModelIcon(item.model)
        } : {
            id:item.id,
            ccid:item.ccid,
            isSelected:false,
            model:'血糖传感器',
            icon: getModelSuger()
        }
      });
       unbindTableLoading.value = false
  }else{
    devices.value = []
     unbindTableLoading.value = false
  }  
}




const debounceFetchData = debounce(() => {
  devices.value = []
   unbindTableLoading.value = true
  fetchUnBindCcidList()
}, 500)
const changeInput = (e: any) => {
  deviceName.value = e;

  debounceFetchData()
}
 

onMounted(()=>{
    // fetchUnBindCcidList()
})
 </script>
 <style scoped>
    :deep(.list_no_data){
        padding-top: 20px;
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
 </style>
 
 