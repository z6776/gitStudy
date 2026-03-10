<template>
  <div class='listItem' :class="{'warningStyle':props.item.status==='deep'}">
       <div class="header">
            <div class="introduce">
                <div class="introduce-avatar cursor-pointer" v-if="item.status != 'normal'" @click="toPaientInfo">
                  
                     <my-tooltip  :content="item.bed_number || '--'" placement="bottom" :maxwidth="120">
                           <span class="bednumber">{{item.bed_number}}</span>
                     </my-tooltip>
                     <my-tooltip   :content="item.name || '--'" placement="bottom" :maxwidth="120">
                         <span class="name">{{ item.name }}</span>
                     </my-tooltip>
                   
                    <div class="sex">
                        <img src="@/assets/images/sexicon.png" alt="">
                        <span>{{calculateAge(item.birthday) }}</span>
                    </div>
                    <div class="bedid">
                        <img src="@/assets/images/bed.png" alt=""></img>
                        <span>{{ item.patient_num || "--" }}</span>
                    </div>
                    <div class="bs">
                           <img :src="getAssetsIndexFileNew(item)" alt="" v-for="(item,index) in sourceStatusBq" :key="index">         
                           <img :src="getAssetsIndexFileNew(item)" alt="" v-for="(item,index) in sourceStatus" :key="index">                        
                    </div>
                    <img :src="getAssetsFileFace" v-if="getAssetsFileFace" alt="" class="face">
                </div>

                <div v-else class="introduce-avatar">
                    <div class="mb23px">
                        <my-tooltip  :content="item.bed_number || '--'" placement="bottom" :maxwidth="120">
                          <span class="text-[24px] color-[#929FAF] fw800 line-height-24px">{{ item.bed_number }}</span>
                     </my-tooltip>
                    </div>
                    <img src="@/assets/images/statusimage/bednone.png" class="w80px h80px m-[0px_auto] block" alt="">
                    <div class="color-[#929FAF] fw500 text-center text-[14px]">等待入住</div>
                </div>
                <div class="inttexts">
                    <div class="ins" v-for="(item,index) in source" :key="index">
                         <img class="status-icon" :src="getAssetsIndexFileNew(item.icon)" alt="">
                         <div class="probability">
                             <div class="texts line-height-12px">{{ item.text }}</div>
                             <div class="title line-height-14px" :style="namestyle">{{ item.name }}</div>
                         </div>
                    </div>
                </div>


            </div>
            <div class="watch" v-if="item.ccid">
                    <div class="flex justify-between">
                        <img src="@/assets/images/statusimage/watch.png" alt="" class="w100px h100px">
                        <div class="flex flex-col justify-berween h-100px gap-12px">
                            <div class="flex justify-end items-center ">
                                <img src="@/assets/images/statusimage/detail.png" alt="" class="w24px h24px mr8px pointer" @click="settingValue">
                                <img src="@/assets/images/statusimage/change.png" alt="" class="w24px h24px pointer" @click="changeWatch">
                            </div>
                            <div class="flex justify-start  line-height-14px">
                                <span class="text-14px fw400 mr8px color-#929FAF flex-shrink-0">型号:</span>
                                <el-tooltip :maxwidth="60" :content="item.model || '--'" placement="bottom">
                                    <span class="text-14px fw400 mr8px color-#384951 truncate max-w-60px">{{ item.model || "--" }}</span>
                                </el-tooltip>
                            </div>
                            <div class="flex justify-start  line-height-14px">
                                <span class="text-14px fw400 mr8px color-#929FAF">CCID:</span>
                                <span class="text-14px fw400 mr8px color-#384951">{{ item.ccidsubStr || "--" }}</span>
                            </div>
                            <div class="flex justify-start line-height-14px">
                                <span class="text-14px fw400 mr8px color-#929FAF">电量:</span>
                                <span  class="text-14px fw400 mr8px color-#384951" :class="{'color-#F04A4B':item.bat<=20}">{{ item.bat || "--" }}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="setting pt10px pb10px m-[0px_auto] bg-[#F5F7FB] ml10px pl55px " v-if="!item.ccid" >
                        <img src="@/assets/images/statusimage/adddevice.png" alt="" srcset="" class="w34px h34px">
                    </div>
                <div>

                </div>
            </div>

            <div v-else class="watch pointer" @click="bindWatch()">
                <img src="@/assets/images/statusimage/bindwatch.png" class="w100px h100px m-[0px_auto] block" alt="">
                  <div class="setting pt10px pb10px m-[0px_auto] bg-[#F5F7FB] ml10px pl20px" >
                        <img src="@/assets/images/statusimage/adddevice.png" alt="" srcset="" class="w34px h34px">
                    </div>
            </div>
       </div>
       <div class="data flex p-relative p-[10px_28px_10px_28px] justify-between rounded-4px">
          <div v-for="(value,index) in dataList" :key="index" class="flex flex-col justify-center items-center cursor-pointer" @click="toScreen()">
              <div class="text-[16px] color-[#636676] fw500">{{ value.title }}</div>
              <div class="text-[12px] color-[#BDCBD1] fw400">{{ value.unit }}</div>
              <div class="text-[18px] color-[#384951] fw800 mt12px">{{ value.num }}</div>
          </div>
       </div>
  </div>
</template>
<script setup lang="ts">
import { getAssetsIndexFileNew, md5Str } from "@/utils/function/function";
import { ElMessage } from "element-plus";
import { computed,ref, toRefs } from 'vue';
import { usePaientInfo } from "@/stores/paientinfo";
import { useRouter } from "vue-router";
import PatientApi from "@/api/patient";
import { calculateAge } from "@/utils/function/function";
const router = useRouter();
const { paientInfo,savePaientInfo } = toRefs(usePaientInfo())
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(["openChangeDeviceDialog","settingValue","openBindDialog"])
const changeWatch = ()=>{ 
   emits("openChangeDeviceDialog")
};
const toScreen = async ()=>{
     if(!paientInfo.value.id){
        let _res = await PatientApi.patientDetail({id:props.item.id});
        savePaientInfo.value(_res.data?.result || {});
        router.push("/monitoringOverview");
        return
     }
     router.push("/monitoringOverview");
}
const toPaientInfo = ()=>{
    router.push("/paientInfo/"+props.item.id);
}

const settingValue = ()=>{
 emits("settingValue")
}
const bindWatch = ()=>{
    emits("openBindDialog")
}
const isEmpty = (value:any)=>{
    if(value===undefined || value===null || value===""){
         return "--"
    };
    return value;
}
const dataList = computed(()=>
[
    {
        title:"心率",
        unit:"bpm",
        num:isEmpty(props?.item?.heartrate)
    },
    {
        title:"血氧",
        unit:"%",
        num:isEmpty(props?.item?.spo2)
    },
    {
        title:"高压",
        unit:"mmHg",
        num:isEmpty(props?.item?.sbp)
    },
    {
        title:"低压",
        unit:"mmHg",
        num:isEmpty(props?.item?.dbp)
    },
    {
        title:"体温",
        unit:"℃",
        num:isEmpty(props?.item.body)
    },
    {
        title:"血糖",
        unit:"mmol/L",
        num:"无"
    },
    {
        title:"血脂",
        unit:"mmol/L",
        num:"无"
    },
    {
        title:"尿酸",
        unit:"μmol/L",
        num:"无"
    }
])



const namestyle = computed(() => {
    if(props.item.status === "deep"){
        return {
            color: "#F04A4B"
        }
    }
    if(props.item.status === "mid"){
        return {
            color: "#F08B2E"
        }
    }
    if(props.item.status === "low"){
        return {
            color: "#24B287"
        }
    }
    return {
        color: "#384951"
    }
})

const sourceStatus = computed(() => {
    // "te.png","wei.png","er.png"
     if(props.item.level_of_care === 1){
        return ["yi.png"]
     }
     if(props.item.level_of_care === 2){
        return ["er.png"]
     }
     if(props.item.level_of_care === 3){
        return ["san.png"]
     }
     if(props.item.level_of_care === 4){
        return ["te.png"]
     }
     return [];
});

const sourceStatusBq = computed(() => {
     if(props.item.situation === 2){
        return ["wei.png"]
     }
     if(props.item.situation === 3){
        return ["zhong.png"]
     }
     return [];
});



// 
const getAssetsFileFace =computed( ()=>{
    const urls:{[key:string]:string} = {
        "deep":"deepface.png",
        "mid":"midface.png",
        "low":"lowface.png"
    }
    if(urls[props.item.status]){
        return getAssetsIndexFileNew(urls[props.item.status]!)
    }
    return ""
})

const gettext = (str:string)=>{
    let arr0 = ["高概率","高","高风险","高风险","频次较低"];
    let arr1 = ["中概率","中","中风险","中风险","频次较低"];
    let arr2 = ["低概率","低","低风险","低风险","频次正常"];
    let arr3 = ["--","--","--","--","--"];
    let strttolist:{[key:string]:string[]} = {
        "deep":arr0,
        "mid":arr1,
        "low":arr2,
        "normal":arr3
    };
    return strttolist[str];
}

const source = computed(() => {
    if(props?.item?.status){
       return [{
        name:gettext(props?.item?.status)![0],
        icon:props.item.status+"1.png",
        text:"并发症概率"
      },
      {
        name:gettext(props.item?.status)![1],
        icon:props.item.status+"2.png",
        text:"疼痛等级"
      },
    {
        name:gettext(props.item?.status)![2],
        icon:props.item.status+"3.png",
        text:"HRV风险"
      },{
        name:gettext(props.item?.status)![3],
        icon:props.item.status+"4.png",
        text:"睡眠分析"
      },{
        name:gettext(props.item?.status)![4],
        icon:props.item.status+"5.png",
        text:"活动分析"
      }
    ]
    }    
})
</script>
<style scoped>
.warningStyle{
    background: linear-gradient(to bottom, #FFEBEB 0%, #FFFFFF 30%) !important;
    box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16) !important;
    border-radius: 12px 12px 12px 12px !important;
    border: 1px solid #F04A4B !important;
}
:deep(.introduce-avatar .contentRefEnough){
    line-height: 24px;
    margin-bottom: 10px;
}
:deep(.introduce-avatar .overflowhidden) {
    line-height: 24px;
    margin-bottom: 10px;
}
 
.listItem{
    height: 320px;
    background: #fff;
    box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16);
    border-radius: 12px 12px 12px 12px;
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
    padding: 16px;
    .header{
        height: 182px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 7px;
        .introduce{
            width: 368px;
            height: 100%;
            display: flex;
            border: 1px solid #EEEEEE;
             border-radius: 7px;
            .introduce-avatar{
                padding: 12px 16px;
                box-sizing: border-box;
                width: 129px;
                height: 100%;
                background: #F5F7FB;
                border-radius: 7px 0px 0px 7px;
                position: relative;
            .face{
                width: 44px;
                height:44px;
                position: absolute;
                top: 0px;
                right: 0px;

            }
            .bednumber{
                        font-weight: 800;
                    font-size: 24px;
                    color: #384951;
                
            }
            .name{
                font-weight: 800;
                    font-size: 24px;
                    color: #384951;
            }
            .sex{
                display: flex;
                font-size: 15px;
                color: #636676;
                img{
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;
                }
                }
            .bedid{
                display: flex;
                font-size: 15px;
                color: #636676;
                margin-bottom: 12px;
                img{
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;
                }
            }
    .bs{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        img{
            width: 28px;
            height: 28px;
        }
    }

}
}

.inttexts{
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 24px;
    padding-right: 20px;
    box-sizing: border-box;
    gap: 10px;
    .ins{
        display: flex;
        align-items: stretch;
        line-height: 30px;
        height: 30px;
        img{
            width: 30px;
            height: 30px;
            margin-right: 7px;
        }
    .probability{
         display: flex;
         flex-direction: column;
         gap:4px;
         .texts{
            font-weight: normal;
            font-size: 12px;
            color: #929FAF;
         }
         .title{
            font-weight: 800;
            font-size: 14px;
            color: #F04A4B;
         }
    }
}




             
            
        }
        .watch{
            width: 207px;
            height: 100%;
            border: 1px solid #EEEEEE;
            padding: 12px;
            box-sizing: border-box;
            border-radius: 12px;
            padding-left: 0;

        }
    }

    .data{
        border: 1px solid #EEEEEE;
    }


    .pointer{
        cursor: pointer;
    }


}
</style>