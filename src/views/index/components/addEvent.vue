<template>
      <custom-dialog v-model="tagDialog" append-to-body class="_loading" title="护理注意事项标记"
        :width="`${(1000 / 1920) * 100}%`" top="10vh">
        <div class="p-[24px] h-600px overflow-y-auto" v-loading="Loading">
             <div v-for="(item,key) in mockList" class="mb-20px" :key="key">
                <div class="text-[18px] color-[#384951] font-bold mb-[10px]">
                    {{ item.title }}
                </div>
               <div class="">
                 <TabList
                    type="multiple"
                    :disabled="true"
                    :column="5"
                    :list="item.tabdata"
                    showAddIcon
                    @change="handleMultipleChange"
                    @add="(e)=>handleAdd(e,item,key)"
                  />
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
<script setup>
import { computed, onMounted, ref, watch,nextTick } from 'vue'
import CareApi from '@/api/care';
import { useLoading } from "../hook/index";
import { ElMessage } from 'element-plus';
const {
        Loading,
        setLoading
    } = useLoading()
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    patient_id:{
         type: Number,
         required: true
    },
    isFresh:{
        type: Boolean,
         required: true
    }
});
const mockList = ref([]);

const tagDialog = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emits('update:modelValue', val)
    }
})

const closeDialog = () => {
    emits('update:modelValue', false)
}
const emits = defineEmits(['settagDialog',"update:modelValue",'addTag',"update:isSave"])

watch(()=>props.modelValue,(val)=>{
     if(val && props.isFresh){
         getCarePatient();
     }
})

const handleMultipleChange = (val) => {
}
let selects = ref([]);
const curindex = ref(-1);
const handleAdd = (val,item,index) => {
    curindex.value = index;
    if(!item.tabdata.length){
        return ElMessage.error("没有可添加标签");
    }
     emits("addTag",val,selects.value,item.title);
}

const getCarePatient = async ( ) => {
    try {
        setLoading(true)
        let _res = await CareApi.getNotice({patient_id:props.patient_id});
        let _arr = [];
        if(_res.data?.result?.tag_id?.length > 0 && typeof _res.data?.result?.tag_id === 'string'){
           _arr = _res.data?.result?.tag_id?.split(',').map(item=>Number(item));
        }
      
        selects.value = JSON.parse(JSON.stringify(_arr));
        let res = await CareApi.getPatientList({type:2});
        if(Array.isArray(res.data?.result) && res.data?.result.length > 0){
              mockList.value = res.data.result.map(item => {
                  let _list = [];
                  if(Array.isArray(item.list) && item.list.length > 0){
                        _list = item.list.map(_item => {
                            return {
                                label:_item.tag,
                                value:_item.tag_id,
                                selected:_arr.includes(_item.tag_id)
                            }
                        })
                  }
                    return {
                        title:item.name,
                        tabdata:JSON.parse(JSON.stringify(_list)) 
                    }
              })
        }
        
          setLoading(false)
    } catch (error) {
          setLoading(false)
    }
}

// /care/patient

const saveList = async () => {
    setLoading(true)
    try {
         let str = "";
    if(Array.isArray(selects.value) && selects.value.length > 0){
         str = selects.value.join(",")
    }
     await CareApi.editNotice({patient_id:props.patient_id,tag_id:str});
     emits("update:modelValue",false);
     emits("refresh")
     setLoading(false)
     ElMessage.success("操作成功");
    } catch (error) {
        setLoading(false)
    }
   
}

onMounted(()=>{
    getCarePatient();
})


const editList = (list)=>{
    let _arr = list.map(item => item.value);
    // 编辑选中
    
    mockList.value[curindex.value].tabdata.forEach((item)=>{
           if(_arr.includes(item.value)){
                item.selected = true;
           }else{
                item.selected = false;
           }
    });
    selects.value = [];
    mockList.value.forEach((item)=>{
          item.tabdata.forEach((child)=>{
              if(child.selected){
                 selects.value.push(child.value);
              }
          })
    });
    emits("update:isSave",false);
}

defineExpose({
    editList
})


</script>
<style scoped>
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