<template>
   <custom-dialog
      v-model="bindDailogVisible"
      append-to-body
      class="_loading"
      :title="watchOrSuger[ptype].dialogTitle"
      :show-close="false"
      :width="`${(1200 / 1920) * 100}%`"
      top="5vh"
    >
      <div class="flex_space_between change_device_box">
        <div class="change_left">
          <div class="bind_head">{{watchOrSuger[ptype].currentTitle}}</div>
          <div class="flex gap-20px items-center w-full p-[20px]" v-if='ptype=="watch"'>
            <img :src="handleData.getModelIcon(changePatinet?.model)" alt="" class="w-66px h-66px" />
            <div class="device_info">
              <div class="device_model">
                设备型号：<span style="color: #384951">{{ changePatinet?.model }}</span>
              </div>
              <div class="device_ccid">
                设备ccid：<span style="color: #384951">{{ changePatinet?.old_ccid }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-20px items-center w-full p-[20px]" v-else>
            <img :src="getModelSuger()" alt="" class="w-66px h-66px" />
            <div class="device_info">
              <div class="device_model">
                设备类型：<span style="color: #384951">血糖传感器</span>
              </div>
              <div class="device_ccid">
                设备ID：<span style="color: #384951">{{ changePatinet?.ccid }}</span>
              </div>
               <div class="device_ccid">
                  创建时间：<span style="color: #384951">{{  dateFtt("yyyy/mm/dd",changePatinet?.xt_create_time)  }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="change_icon">
          <img src="@/assets/images/zh.png" />
        </div>
        <div class="change_right">
          <div class="bind_head">{{watchOrSuger[ptype].dialogContent}}</div>
          <div class="flex flex-col items-center mt-20px" v-loading="unbindTableLoading">
             <div class="flex justify-start items-center flex-shrink-0 mb-20px w-300px">
          <div class="color-[#636676] text-[16px]">{{watchOrSuger[ptype].label}}</div>
          <div class="flex-1">
               <el-input v-model="deviceName" :placeholder="watchOrSuger[ptype].holder" @input="changeInputDevice"/>
          </div>
        </div>
           <empty v-if="!devices.length"  />
            <div
            v-else
              class="change_ccid_item"
              v-for="item in devices"
              @click="setChangeCcidRadioChoose(item)"
            >
              <div class="flex gap-20px items-center w-full p-[20px_0] borderb" v-if="ptype=='watch'">
                <img :src="handleData.getModelIcon(item.model)" alt="" class="w-66px h-66px" />
                <div class="device_info mr-auto">
                  <div class="device_model">
                    设备型号：<span style="color: #384951">{{ item.model }}</span>
                  </div>
                  <div class="device_ccid">
                    设备ccid：<span style="color: #384951">{{ item.ccid }}</span>
                  </div>
                </div>

                <img src="@/assets/images/V2/isopen.png" alt="" class="w-20px h-20px"  v-if="item.ccid===changePatinet?.ccid"/>
                 <img src="@/assets/images/V2/isclose.png" alt="" class="w-20px h-20px"  v-else/>
              </div>
              <div class="flex gap-20px items-center w-full p-[20px_0] borderb" v-else>
                <img :src="getModelSuger()" alt="" class="w-66px h-66px" />
                <div class="device_info mr-auto">
                  <div class="device_model">
                    设备型号：<span style="color: #384951">血糖传感器</span>
                  </div>
                  <div class="device_ccid">
                    设备ID：<span style="color: #384951">{{ item.ccid }}</span>
                  </div>
                  <div class="device_ccid">
                    创建时间：<span style="color: #384951">{{  dateFtt("yyyy/mm/dd",item.xt_create_time)  }}</span>
                  </div>
                </div>

                <img src="@/assets/images/V2/isopen.png" alt="" class="w-20px h-20px"  v-if="item.ccid===changePatinet?.new_ccid"/>
                 <img src="@/assets/images/V2/isclose.png" alt="" class="w-20px h-20px"  v-else/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" type="info" @click="closeDialog">取消</el-button>
          <el-button size="large" type="primary" @click="submitChange()"> 确定 </el-button>
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
import { dateFtt } from "@/utils/date/dateFtt";
import {
  debounce
} from '@/utils/function/function'
import PatientInfo from '@/components/PatientInfo.vue';



const closeDialog = () => {
    emits('update:modelValue', false)
}
const emits = defineEmits(['settagDialog',"update:modelValue",'addTag','refresh','update:changePatinet'])

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    changePatinet:{
        type: Object,
        require:true
    },
    ptype:{
      type: String,
        default: "watch"
    }
});

watch(() => props.modelValue, (newVal) => {
   if(newVal){
    fetchUnBindCcidList();
   }
})



const watchOrSuger = ref<Record<string,any>>({
    'watch': {
      'dialogTitle': '更换设备',
      "currentTitle":"当前设备",
      'dialogContent': '更换设备',
      'label': '设备查询：',
      'holder': '请输入设备CCID查询',
    },
    'suger': {
       'dialogTitle': '换绑血糖监护设备',
      "currentTitle":"当前血糖设备",
      'dialogContent': '更换血糖设备',
      'label': '设备查询：',
      'holder': '请输入设备ID查询',
    },
});

const bindDailogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emits('update:modelValue', val)
    }
});

const submitChange = async () => {
  if (!props.changePatinet?.ccid) {
    ElMessage.error('请先选择设备')
    return
  }
  let data = {
    ccid: props.changePatinet.ccid,
    id: props.changePatinet.id,
    old_ccid: props.changePatinet.old_ccid,
  }
  let suger  = {
      patient_id: props.changePatinet.id,
      old_ccid: props.changePatinet.ccid,
      old_id: props.changePatinet.xt_id,
      new_ccid: props.changePatinet.new_ccid,
      new_id: props.changePatinet.new_id
  }
  const Formloading = ElLoading.service({
    target: '._loading',
  })
  try {
      const result =  props.ptype==='watch' ? await PatientApi.changePatientDevice(data) : await XtApi.changeBind(suger)
    if (result) {
      ElMessage({
        type: 'success',
        message: '操作成功',
      })
       emits('update:modelValue', false);
      Formloading.close();
      emits("refresh")
    }
  } catch (error) {
    Formloading.close()
  }
}

const setChangeCcidRadioChoose = (item: any) => {
    let _changePatinet = {...props.changePatinet};
  if(props.ptype==='watch'){
_changePatinet.ccid =item.ccid;

  }else{
    _changePatinet.new_ccid =item.ccid
    _changePatinet.new_id =item.id
  }
  emits('update:changePatinet',_changePatinet);
  
}


const debounceFetchDataDevice = debounce(() => {
  devices.value = []
   unbindTableLoading.value = true
  fetchUnBindCcidList()
}, 500)
const changeInputDevice = (e: any) => {
  deviceName.value = e;
  debounceFetchDataDevice()
}




//绑定设备
const deviceName = ref('');
type watchDia = Pick<watchType,'ccid' | 'model' | 'icon'> & {isSelected:boolean,xt_create_time?:string};
let devices = ref<watchDia[]>([]);
const unbindTableLoading = ref(false)
const fetchUnBindCcidList = async () => {
  unbindTableLoading.value = true
   let res  = props.ptype==='watch'  ?
     (await PatientApi.getUnBindCcidList({ bind: 2 ,ccid:deviceName.value })).data.result
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
            icon: getModelSuger(),
            xt_create_time:item.create_time
        }
      });
    //   debugger;
       unbindTableLoading.value = false
  }else{
    devices.value = []
     unbindTableLoading.value = false
  }  
}

 

</script>
<style scoped>
 
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

:deep(.list_no_data){
    padding-top: 0 !important;
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
  width: 5px !important;
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
    min-width: 352px;
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
/* 滚动条整体宽度 */
::-webkit-scrollbar {
  width: 4px; /* 可根据需要调整宽度 */
  background: #cdcdcd;
  margin-left: 10px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #cdcdcd;
  border-radius: 8px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #24b287;
  border-radius: 4px;
  min-height: 70px;
  transition: background 0.2s;
}

/* 鼠标悬停时滑块颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #24b287;
}
</style>