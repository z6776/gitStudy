<template>
    <div class="h-260px container-box flex gap-0 items-stretch" :class="{'warningStyle':getAssetsFileFace==='deepface.png'}">
            <div class="patientInfo w-146px flex">
                 <div class="w-146px h-full bg-[#F5F7FB]  p-12px pl-12px pr-12px flex flex-col flex-shrink-0 rounded-[12px_0px_0px_12px] relative cursor-pointer"
                 @click="toDeviceDetail('detail')"
                 v-if="!patientInfoForm.patientEmpty">
                     <img :src="getAssetsFileFace" v-if="getAssetsFileFace" alt="" class="face">
                       <div class="line-height-24px flex gap-5px">
                           <div class="text-[#384951] text-[24px] font-bold max-w-70px truncate" :title="patientInfoForm.bedNumber">{{ patientInfoForm.bedNumber }}</div>
                           <div class="w-24px h-24px flex items-end justify-center active:bg-[#eeeeee]" @click.stop="setBedRow(patientInfoForm),showEditBed()">
                               <img src="@/assets/icon/editicon.png" alt="" class="w-20px h-20px">
                           </div>
                       </div>
                        <div class="text-[#384951] mt-12px line-height-18px  text-[18px] font-bold max-w-72px truncate cursor-pointer">{{ maskName(patientInfoForm.name) }}</div>
                         <div class="gap-8px flex mt-9px line-height-15px">
                                <div class="color-[#636676] text-15px">{{ getSexText }}</div>
                                <div class="w-1px h-14px bg-[#929FAF]" v-if="getSexText"></div>
                                <div class="text-[#636676] text-15px" style="white-space: nowrap;">{{ patientInfoForm.age }}</div>
                         </div>
                         
                 <div class="mt-6px flex line-height-14px mb-12px">
                     <div  class="text-[#929FAF] text-14px" style="white-space: nowrap;">住院号：</div>
                     <div  class="text-[#636676] text-15px w-100px truncate" :title="patientInfoForm.patientNum">{{ patientInfoForm.patientNum }}</div>
                 </div>

                 
                 

                 <div  class="bctag" @click.stop="toBc()" v-if="patientInfoForm?.bclist!.length>0">
                    <span v-for="(item,i) in patientInfoForm.bclist" :key="i">{{ item.name }}</span>
                     
                 </div>
                 <div  class="bctag" v-else>
                     
                 </div>

                    <div class="bg-#fff max-h-60px overflow-y-auto overflow-x-hidden rounded-4px pt-4px pb-4px"  @click.stop="AddEvent()" v-if="patientInfoForm.eventList && patientInfoForm.eventList.length > 0">
                        <div 
                            v-for="(item,index) in patientInfoForm.eventList"
                            class="flex line-height-14px items-center pl-4px pr-4px flex-start"
                            :class="{'mt-4px':index>0}"
                            >
                        <img src="@/assets/images/V2/finished.png" class="w-14px h-14px mr-4px " alt="">
                        <span class="text-[#636676] text-[12px] mr-auto max-82px truncate">{{ item.name }}</span>

                        <span class="text-[#636676] text-[12px]">{{ dateFtt('hh:MM',item.time)  }}</span>
                        </div>
                    </div>
                      
                        <div v-else class=" w-122px h-22px rounded-4px bg-#fff line-height-22px text-center text-[12px] color-[#636676] cursor-pointer active:bg-#eeeeee flex justify-center items-center"
                        @click.stop="AddEvent()"
                        >
                            <img src="@/assets/images/V2/addicon.png" class='mr-5px w14px h14px' />
                            <span class="text-12px line-height-12px color-[#636676]">添加事件</span>
                        </div>
                 </div>

                  <div class="w-163px h-full bg-[#F5F7FB]  p-12px flex flex-col flex-shrink-0 rounded-[12px_0_0_12px] relative cursor-pointer" v-else @click="toDeviceDetail()">
                        <my-tooltip  :content="patientInfoForm.bedNumber+''" placement="bottom" :maxwidth="120">
                          <span class="text-[24px] color-[#929FAF] fw800 line-height-24px">{{ patientInfoForm.bedNumber }}</span>
                           <div class="w-24px h-24px flex items-end justify-center active:bg-[#eeeeee] ml-10px" @click.stop="setBedRow(patientInfoForm),showEditBed()">
                               <img src="@/assets/icon/editicon.png" alt="" class="w-20px h-20px">
                           </div>
                            </my-tooltip>
                            <img src="@/assets/images/statusimage/bednone.png" class="w80px h80px m-[0px_auto] block mt-50px" alt="">
                            <div class="color-[#929FAF] fw500 text-center text-[14px]">等待入住</div>
                    </div>

             
            </div>
            <div class="flex flex-col flex-1">
                <div class="flex h-172px">
                <div class="bg-#fff p-[12px_16px] flex gap-16px w-276px rounded-12px">
                     <div class="flex flex-col justify-between flex-shrink-0 cursor-pointer" @mouseleave="hideTooltip()" @click="openTag()">
                          <div class="line-height-20px flex justify-start items-center relative" v-for="(item,index) in patientInfoForm.labels" :key="index"
                           @mouseenter="showTooltip(index)">
                                <div class="mr-4px w-20px h-20px text-12px  rounded-3px text-center line-height-20px" :style="styleSimple(item.color)">{{ item.label }}</div>
                                <div class="color-#636676 text-[14px] w-83px truncate">{{ item.value }}</div>
                                  <div class="modal" v-if="index==tipIndex" @click.stop>
                                     {{ item.value }}
                                   </div>
                           </div>   
                      </div>

                      <div class="flex flex-col justify-between flex-shrink-0 cursor-pointer" @click="openhl()">
                          <div class="line-height-20px flex justify-start items-center" v-for="(item,index) in patientInfoForm.fixedLabels" :key="index">
                                <img class="w-20px h-20px mr-4px" :src="getAssetsIndexFileNew(item.icon)" alt="">
                                <div class="color-#636676 text-[14px]">{{ item.label }}</div>
                                <div class="color-#636676 text-[14px] line-height-14px" :style="{'color':item.color}">
                                     {{ item.status_text }}
                                </div>
                           </div>
                      </div>
                 </div>
       <div class="right-aside flex flex-col w-196px flex-shrink-0 flex-1" v-if="!patientInfoForm.patientEmpty">
        <div class="pt-12px pb-12px  pr-12px borderbottom flex-1">
            <template v-if="patientInfoForm.bindWatch">
                <div class="flex items-stretch">
               <div class="flex justify-start items-center  mr-8px">
                   <img :src="patientInfoForm.watch?.icon" class="w-48px h-48px flex-shrink-0" />
               </div>
                <div class="flex-1">
                    <div class="line-height-14px flex items-center mb-8px">
                        <div class="color-[#384951] text-[14px] mr-auto w-80px truncate" :title="patientInfoForm.watch?.model">{{ patientInfoForm.watch?.model}}123</div> 
                        <img src="@/assets/images/V2/setting2.png"  class="w-22px h-22px mr-4px cursor-pointer" @click="settingValue"/>
                            <img src="@/assets/images/V2/changeDevice2.png" class="w-22px h-22px cursor-pointer"  @click="changeWatch('watch')"/>
                    </div>
                        <div class="line-height-14px flex items-center mb-4px">
                            <img src="@/assets/images/V2/powerlevellow.png" class="w-13px h-8px" v-if="!patientInfoForm.watch?.powerLevel || Number(patientInfoForm.watch?.powerLevel)<=20"/>
                            <img src="@/assets/images/V2/powerlevelhigh.png" class="w-13px h-8px" v-else/>
                            <span class="color-[#24B287] text-[14px] ml-2px" :class="{'color-[red]':!patientInfoForm.watch?.powerLevel || Number(patientInfoForm.watch?.powerLevel)<=20}">{{ patientInfoForm.watch?.powerLevel_text}}</span>
                        </div>
                    <div class="line-height-14px flex items-center mb-4px">
                        <span class="color-[#929FAF] text-[14px]">CCID：</span>
                        <span class="color-[#384951] text-[14px]">{{ patientInfoForm.watch?.ccidLast}}</span>
                    </div>
                    <div class="line-height-14px flex items-center">
                        <span class="color-[#929FAF] text-[14px]">监护时长：</span>
                        <span class="color-[#384951] text-[14px]">{{ patientInfoForm.watch?.totalTime}}</span>
                    </div>
                </div>
               </div>
         </template>
         <template v-else>
            <div class="w-full h-full flex items-center justify-center">
                  <img src="@/assets/images/V2/bindwatch.png" alt="" class="w-48px h-48px  cursor-pointer  m-[0_auto] block" @click="bindWatch()"/>

            </div>
         </template>
         </div>

           <div class="h-72px flex pt-12px pb-12px  pr-12px items-center">
             <template v-if="patientInfoForm.bindSuger">
                    <div class="flex justify-start items-center line-height-48px  mr-8px">
                        <img src="@/assets/images/V2/suger.png" class="w-48px h-48px  flex-shrink-0" />
                     
                    </div>
                    <div class="flex-1">
                        <div class="line-height-14px flex items-center mb-8px">
                            <span class="color-[#384951] text-[14px] mr-auto">血糖仪</span>
                               <img src="@/assets/images/V2/link2.png"  class="w-22px h-22px mr-4px cursor-pointer"  @click="setWarningVisible(true)" />
                        <img src="@/assets/images/V2/changeDevice2.png" class="w-22px h-22px cursor-pointer"  @click="changeWatch('suger')" />
                        </div>
                    <div class="line-height-14px flex items-center">
                        <span class="color-[#929FAF] text-[14px]">监护时长：</span>
                        <span class="color-[#384951] text-[14px]">{{ patientInfoForm.bloodGlucoseMeter?.totalTime}}</span>
                    </div>
                    </div>
                        
               </template>
                 <template v-else>
                    <img src="@/assets/images/V2/bindsuger.png" alt="" class="w-48px h-48px  cursor-pointer m-[0_auto] block"
                    @click="bindSuger()"
                    />
                 </template>
           </div>
        </div>

          <div class="right-aside flex flex-col items-stretch flex-1" v-else @click="toDeviceDetail()">
               <div class="pt-12px pb-12px pr-12px borderbottom w-full flex-1 flex justify-center items-center">
                  <img src="@/assets/images/V2/bindwatch.png" alt="" class="w-48px h-48px"/>
               </div>
                <div class="h-72px flex justify-center items-center">
                  <img src="@/assets/images/V2/bindsuger.png" alt="" class="w-48px h-48px"/>
               </div>
          </div>
          </div>
           <div class="patientNess w-full h-82px relative" @click="toScreen()">
                <img src="@/assets/images/V2/fullicon.png" class="fullicon" alt="">
                <div  class="flex flex-col justify-center items-center cursor-pointer">
                    <div class="text-[16px] color-[#636676] fw500">心率</div>
                    <div class="text-[12px] color-[#BDCBD1] fw400">bpm</div>
                    <div class="text-[18px] color-[#384951] fw800">{{ patientInfoForm.patientHealthy.heartRate }}</div>
                </div>
                 <div  class="flex flex-col justify-center items-center cursor-pointer">
                    <div class="text-[16px] color-[#636676] fw500">血氧</div>
                    <div class="text-[12px] color-[#BDCBD1] fw400">%</div>
                    <div class="text-[18px] color-[#384951] fw800 ">{{ patientInfoForm.patientHealthy.blood }}</div>
                </div>
                 <div  class="flex flex-col justify-center items-center cursor-pointer">
                    <div class="text-[16px] color-[#636676] fw500">血压</div>
                    <div class="text-[12px] color-[#BDCBD1] fw400">mmHg</div>
                    <div class="text-[18px] color-[#384951] fw800">
                        <span>{{ patientInfoForm.patientHealthy.bloodPressureSbp }}</span>
                         /
                        <span>{{  patientInfoForm.patientHealthy.bloodPressureDbp  }}</span>

                        <span>({{  patientInfoForm.patientHealthy.bloodPressureDifference  }})</span>
                    </div>
                </div>
                 <div  class="flex flex-col justify-center items-center cursor-pointer">
                    <div class="text-[16px] color-[#636676] fw500">体温</div>
                    <div class="text-[12px] color-[#BDCBD1] fw400">℃</div>
                    <div class="text-[18px] color-[#384951] fw800 ">{{ patientInfoForm.patientHealthy.bodyTemperature }}</div>
                </div>
                 <div  class="flex flex-col justify-center items-center cursor-pointer" @click.stop="toScreen(1)">
                    <div class="text-[16px] color-[#636676] fw500">血糖</div>
                    <div class="text-[12px] color-[#BDCBD1] fw400">mmol/L</div>
                    <div class="text-[18px] color-[#384951] fw800 mt2px">{{ patientInfoForm.patientHealthy.bloodSugar }}</div>
                </div>
            </div>
                 </div>
      

       <addPatient v-model="bindDailogVisible" @createSuccess="refreshData" :bed_number="patientInfoForm.bedNumber"></addPatient>


    <custom-dialog v-model="WarningVisible" append-to-body class="_loading" title="解绑血糖监护设备"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center" v-loading="unbindloading">
              是否解绑血糖监护设备
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="setWarningVisible(false)">取消</el-button>
                <el-button size="large" type="primary" @click="unbindSubmit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>


    <custom-dialog v-model="delConfirm" append-to-body class="_loading" title="床位删除"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center" v-loading="delLoading">
               是否删除当前床位?
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="closeDelConfirm(),showEditBed()">取消</el-button>
                <el-button size="large" type="primary" @click="delBedSubmit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>

    <custom-dialog v-model="editBedVisible" append-to-body class="_loading" title="床位编辑"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center" v-loading="editLoading">
              <div class="flex items-center">
                  <div class="color-[#636676] mr-10px text-[16px]">床位号:</div>
                  <el-input placeholder="请输入床位号" type="text" @input="editBedForm.bedNumber = editBedForm.bedNumber.replace(/[^0-9]/g, '')" v-model="editBedForm.bedNumber" class="w-337px" size="large" clearable></el-input>
              </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="closeEditBed(),showDelConfirm()" v-if="!patientInfoForm.patientId">删除床位</el-button>
                <el-button size="large" type="primary" @click="editBedSubmit()">保存修改</el-button>
            </div>
        </template>
    </custom-dialog>
    </div>
</template>

<script  setup lang="ts">
import { computed, onMounted, type Ref,ref,reactive ,toRefs} from 'vue';
import  { type PatientInfoType, sexStatus,MonitoringLevel,fixedLabelStatus,TOTALRANK} from "@/views/index/types/index";
import { getAssetsFileV2,getAssetsIndexFileNew } from "@/utils/function/function";
import { dateFtt } from '@/utils/date/dateFtt';
import { useRoute, useRouter } from 'vue-router';
import PatientApi from "@/api/patient";
import XtApi from '@/api/suger';
import { ElMessage } from 'element-plus';
import { usePaientInfo } from "@/stores/paientinfo";
import { maskName } from "@/utils/function/function";
const router = useRouter();
const props = defineProps<{patientInfoForm:PatientInfoType,unbindBedList:any}>();
const { paientInfo,savePaientInfo } = toRefs(usePaientInfo())
import { useModal } from '@/hooks/useModal';


// 编辑床位
const useEditBed = () => {
  return useModal({
    formInit: {
      bedId: '',
      bedNumber: "",
      patientId: ""
    },
    beforeSubmit: (form) => {
      const arr = [...props.unbindBedList];
      const checked = arr.find((item: any) => form.bedNumber === item.bed_number);
      
      if (!form.bedNumber) {
        ElMessage.error('请输入床位');
        return false;
      }
      return true;
    },
    submitApi: (form) => PatientApi.updateBedNo({
      id: props.patientInfoForm.bed_id,
      bed_number: form.bedNumber
    }),
    afterSubmit: () => {
       refreshData();
    }
  });
};

const {
  visible: editBedVisible,
  loading: editLoading,
  form: editBedForm,
  show: showEditBed,
  close: closeEditBed,
  setForm: setBedRow,
  submit: editBedSubmit
} = useEditBed();

 

// 删除床位
const useDelBed = () => {
  return useModal({
    submitApi: () => PatientApi.delBedNo({
      id: props.patientInfoForm.bed_id
    }),
    afterSubmit: () => {
        refreshData()
    }
  });
};
const {
  visible: delConfirm,
  loading: delLoading,
  show: showDelConfirm,
  close: closeDelConfirm,
  submit: delBedSubmit
} = useDelBed();



// 
const getSexIcon:Ref<string> = computed(()=>{
    if(props.patientInfoForm.sex === sexStatus.MAN){
          return getAssetsFileV2('sex1.png')
    }
    if(props.patientInfoForm.sex === sexStatus.WOMAN){
          return getAssetsFileV2('sex0.png')
    }
    return ""
});

const getSexText:Ref<string> = computed(()=>{
    if(props.patientInfoForm.sex === sexStatus.MAN){
          return '男'
    }
    if(props.patientInfoForm.sex === sexStatus.WOMAN){
          return '女'
    }
    return ""
});



 const styleSimple = (str:any)=>{
    let _str = str ? str.split("-") : '';
    if(Array.isArray(_str) && _str.length>1){
         return {
        backgroundColor:_str[0],
        color:_str[1]
       }
    }else{
         return {
        backgroundColor:'#EAF4FE',
        color:'#0477E0'
       }
    }
   
 }

const toScreen = async (type?:number)=>{
    if(!props.patientInfoForm.patientId){
       return ElMessage.error("未找到患者");
    }
    let _type = type ?? "0";
    //  if(!paientInfo.value.id){
        let _res = await PatientApi.patientDetail({id:props.patientInfoForm.patientId});
        savePaientInfo.value(_res.data?.result || {});
        if(_type==1){
            router.push("/monitoringandanalysis?type=scroll");
            return;
        }
        router.push("/monitoringOverview");
        return
    //  }
    //  router.push("/monitoringOverview");
}
// 病程管理
const toBc  = () => {
    
    router.push('/courseManagement/'+props.patientInfoForm.patientId);    
}



//    DEEP = 1,
//          NORMAL=2,
//          MID=3,
//          EMPTY=4
const getAssetsFileFace =computed(()=>{
    const urls= {
        "deep":"deepface.png",
        "mid":"midface.png",
        "normal":"lowface.png"
    }
    //   DEEP = 2,
    //      LOW =0,
    //      MID=1
    if(props.patientInfoForm.labelStatus===TOTALRANK.DEEP){
        return getAssetsIndexFileNew(urls['deep'])
    }
    if(props.patientInfoForm.labelStatus===TOTALRANK.LOW){
        return getAssetsIndexFileNew(urls['normal'])
    }
    if(props.patientInfoForm.labelStatus===TOTALRANK.MID){
        return getAssetsIndexFileNew(urls['mid'])
    }
    return ""
})


const changeWatch = (type:string)=>{ 
   emits("openChangeDeviceDialog",type=='watch'? {
     type:type,
     model:props.patientInfoForm?.watch?.model,
     id:props.patientInfoForm?.patientId,
     old_ccid:props.patientInfoForm?.watch?.ccid,
   } : {
     type:type,
     xt_id:props.patientInfoForm?.bloodGlucoseMeter?.xt_id,
     model:"血糖传感器",
     id:props.patientInfoForm?.patientId,
     ccid:props.patientInfoForm?.bloodGlucoseMeter?.xt_ccid,
     createTime:props.patientInfoForm?.bloodGlucoseMeter?.xt_createTime,
    
   }
)
};


// 
const AddEvent = ()=>{
    emits("AddEvent")
}
const tipIndex = ref(-1);
const showTooltip = (index:number)=>{
      if(Array.isArray(props.patientInfoForm.labels) && props.patientInfoForm.labels[index] && props.patientInfoForm.labels[index].value.length > 6){
            tipIndex.value = index;
            return;
      }
      tipIndex.value = -1;
}
const hideTooltip = ()=>{
      tipIndex.value = -1;
}

const emits = defineEmits(["openTag","AddEvent","BindWatch",'refresh','settingValue','openChangeDeviceDialog','addSuger'])
//

const settingValue = ()=>{
 emits("settingValue",{
    id:props.patientInfoForm.patientId
 })
}
const refreshData = ()=>{
    emits("refresh")
}
const openTag = ()=>{
    emits("openTag")
}

const bindWatch = ()=>{
    emits("BindWatch",props.patientInfoForm.patientId,'watch');
}

const bindDailogVisible = ref(false);
const toDeviceDetail = (type?:string)=>{
    if(type==="detail"){
           router.push("/paientInfo/"+props.patientInfoForm.patientId);
    }else{
           router.push("/paientInfo/add-"+props.patientInfoForm.bedNumber+"-"+props.patientInfoForm.bed_id);
    }  
}

const openhl = ()=>{
   router.push("/tagManagement/index"); 
}



const bindSuger = ()=>{
      emits("BindWatch",props.patientInfoForm.patientId,'suger');
}



  // 解绑
 const useSettingWarning = ()=>{
    const WarningVisible = ref(false);
    const setWarningVisible = (b:boolean)=>{
        WarningVisible.value = b;
    }
    return {
        WarningVisible,
        setWarningVisible
    }
 }
 const { WarningVisible,setWarningVisible } = useSettingWarning();

 const unbindloading = ref(false);

 const unbindSubmit = async () => {
  try {
    unbindloading.value = true;
     await XtApi.unbind({
      ccid: props.patientInfoForm?.bloodGlucoseMeter?.xt_ccid,
      patient_id: props.patientInfoForm?.patientId,
    })
    ElMessage.success('解绑成功');  
    unbindloading.value = false;
    setWarningVisible(false);
    refreshData();
    
  } catch (error) {
        unbindloading.value = false;
  }
}

</script>


<style scoped>
.warningStyle{
    background: linear-gradient(to bottom, #FFEBEB 0%, #FFFFFF 30%) !important;
    box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16) !important;
    border-radius: 12px 12px 12px 12px !important;
    border: 1px solid #F04A4B !important;
}
.borderbottom{
     border-bottom: 1px solid #E0E0E0;
}
    .fullicon{
        position:absolute;
        top:10px;
        right:10px; 
        width:15px;
        height:15px;   
    }

    .modal{
        position: absolute;
        left: 20px;
        top: -20px;
        width: 168px;
        padding: 12px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #F5F7FB;
        z-index: 1;
        height: auto !important;
        font-size: 14px;
        color: #636676;
        line-height: 14px;
        transition: all 0.3s ease-in-out;
    }


    .container-box{
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #EEEEEE;
        /* padding: 12px; */
     box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16);
    }
    .left-aside{
        width: 451px;
        height: calc(274px -24px);
    }
    .right-aside{
        background: #FFFFFF;
        border-radius: 0px 12px 0px 0px;
        border-left: 1px solid #EEEEEE;
        /* width: 131px; */
        height: calc(274px -24px);
    }
     .face{
                width: 44px;
                height:44px;
                position: absolute;
                top: 0px;
                right: 0px;

            }
    /* 滚动条整体宽度 */
    ::-webkit-scrollbar {
    width: 4px; /* 可根据需要调整宽度 */
    background: #cdcdcd;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
    background: #24b287;
    border-radius: 4px;
    height: 10px;
    transition: background 0.2s;
    }
    .border{
           border: 1px solid #EEEEEE;
             border-radius: 7px;
    }
    .patientNess{
        border-top: 1px solid #EEEEEE;
        /* border-radius: 8px; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        padding-right: 40px;
    }

    .bctag{
        display: flex;
        flex-wrap: wrap;
        align-items: start;
        height: 58px;
        overflow-y: auto;
        gap:4px;
        margin-bottom: auto;
    }
      .bctag span{
         display:block;
         /* height:24px; */
         width:fit-content;
          border: 1px solid #0477E0;
          background-color: #EAF4FE;
          color: #0477E0;
          border-radius: 4px;
          padding: 4px;
          font-size:12px;
      }

</style>


