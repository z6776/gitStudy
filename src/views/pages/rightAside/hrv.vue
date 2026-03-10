<template>
    <div class="p-[20px]">
         <HeaderSeach v-model="reportDate" @select-date="fetchData" yesterday/>
<!--          
          <div class="custom_title_box search_sleep mt-0">
            <div class="custom_title">{{paientInfo.bed_number }}床 {{ paientInfo.name }} CCID:{{ ccidsub || "--" }}</div>
            <div class="datepicker mr-auto">
                <el-date-picker size="large"
                :prefix-icon="customPrefix"
                class="customPrefix"
                :cell-class-name="()=>'custom_date_cell'"
                v-model="reportDate" type="date" placeholder="选择日期"  
                @change="fetchData" :clearable="false"></el-date-picker>
            </div>
           
        </div> -->
          <div v-if="nodata && loading" class="nodata">
            <img src="@/assets/images/nodata3.png" />
            <div>暂无数据</div>
        </div>
       
        <div class="custom_content_box" v-if="!nodata && loading">
            <div class="custom_content_item_left">
                <!-- 心率失常分线分析 -->
                <div class="xlsc_box" :style="{background:fxwarning[current]?.background}">
                     <div class="title">
                        <span>心率失常分线分析</span>
                        <span :style={color:fxwarning[current]?.color}>{{ fxwarning[current]?.title }}</span>
                     </div>
                     <div class="content">
                        <div v-for="(item,index) in fxwarning[current]?.list">
                            <div class="tip" :style="{background:fxwarning[current]?.color}"></div>
                            <span>  {{item}}</span>
                        </div>
                     </div>
                     <div class="conclusion">
                        本报告非医学诊断结论,所提供健康数据及建议仅供参考
                     </div>
                </div>
                <!-- 心率失常分线分析 -->
                <!-- 频域分析 -->
                <div class="plfx_box">
                    <div class="title">频域分析</div>
                    <div class="img_box">
                         <img :src="imgUrl3" style="width: 100%;height: 100%;" alt="">
                    </div>
                    <div class="bordere6">
                        <el-table :data="pldata" :cell-style="(e:any)=>cellStyle(e,'hz')" :header-row-style="cellStyle">
                          <el-table-column prop="hz" label="波段" align="center">
                               
                          </el-table-column>
                          <el-table-column prop="pmin" label="超低频" align="center">
                              <template #default="{ row }">
                                <div>
                                    <div v-for="(item,index) in row.pmin?.split(',')">
                                        <span>{{item|| "--"}} </span>
                                    </div>
                                </div>
                              </template>
                          </el-table-column>
                          <el-table-column prop="min" label="低频" align="center">
                             <template #default="{ row }">
                                <div>
                                    <div v-for="(item,index) in row.min?.split(',')">
                                        <span>{{item|| "--"}} </span>
                                    </div>
                                </div>
                              </template>
                          </el-table-column>
                          <el-table-column prop="max" label="高频" align="center">
                             <template #default="{ row }">
                                <div>
                                    <div v-for="(item,index) in row.max?.split(',')">
                                        <span>{{item || "--"}} </span>
                                    </div>
                                </div>
                              </template>
                          </el-table-column>
                    </el-table>
                         <div class="power">
                            <div>
                            <span class="power_title">总功率：</span>
                            <span class="power_value">{{ totalPower }}[ms²]</span>
                            </div>
                            <div>
                            <span class="power_title">低频/高频：</span>
                            <span class="power_value">{{ lfhf }}</span>
                            </div>
                        </div>

                    </div>
                    
                </div>
                <!-- 频域分析 -->
            </div>
            <div class="custom_content_item_right">
                <div class="custom_content_item_right_top">
                    <div class="title">
                        非线性分析
                    </div>
                    <div class="img_box">
                         <img :src="imgUrl1" style="width: 100%;height: 100%;" alt="">
                    </div>
                </div>
                 <div class="custom_content_item_right_bottom">
                     <div class="title">
                        时域分析
                     </div>
                     <div class="h-360px w-full">
                         <img :src="imgUrl2" style="width: 100%;height: 100%;" alt="">
                     </div>
                      
                    <div class="bordere6" style="border-bottom: none;">
                          <el-table :data="sydata"  :cell-style="cellStyle" :header-row-style="cellStyle">
                          <el-table-column prop="hz" label="" align="center"></el-table-column>
                          <el-table-column prop="pmin" label="平均RR期间" align="center"></el-table-column>
                          <el-table-column prop="min" label="平均心率（bpm）" align="center"></el-table-column>
                          <el-table-column prop="max" label="PNN50%" align="center"></el-table-column>
                    </el-table>
                    </div>
                  


                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

  import { ref,onMounted,toRefs } from 'vue';
  import SleepApi from '@/api/sleep';
  import { dateFtt } from '@/utils/date/dateFtt';
  import { Md5 } from 'ts-md5';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePaientInfo } from '@/stores/paientinfo.ts';
  import { useCustom } from '@/hooks/useCustom';
  const { customPrefix } = useCustom();
  const { paientInfo  } = toRefs(usePaientInfo());
  const reportDate = ref("");
  const router = useRouter();
  const ccidsub = computed(() => {
    if(paientInfo.value.ccid){
    return paientInfo.value.ccid?.substr(-5);
    }
  });
  const emits = defineEmits(['closeDialog']);
  const current = ref(-1);
 

const fxwarning = ref([
    {
        type: "min",
        title: "风险等级：低风险",
        list:["时域和频域各指标基本分布在正常范围内；","非线性散点图呈“彗星状”规则分布；","心律失常风险：低；","生命体征与健康人群相符。"],
        background: "linear-gradient(180deg, #E6FDED 0%, #FFFFFF 34%)",
        color:"#00B528"
    },{
        type: "mid",
        title: "风险等级：中风险",
        list:["时域及频域部分指标异常；","非线性散点图呈“不规则形状”分布；","心律失常特征较为明显；","患心血管疾病的风险：中；"],
        background: "linear-gradient(180deg, #FFF9E7 0%, #FFFFFF 34%)",
        color:"#FF7D01"
    },{
        type: "max",
        title: "风险等级：高风险",
        list:["时域及频域部分指标异常；","非线性散点图呈明显“不规则形状”分布；","心律失常特征明显；","患心血管疾病的风险：高；"],
        background:"linear-gradient(180deg, #FFECE6 0%, #FFFFFF 34%)",
        color:"#F7413D"
    }
]);

  const closeDialog = ()=>{
        emits("closeDialog");
 }

  

 const cellStyle = (e?:any,type?:string)=>{
    if(e.rowIndex === 0 && type === 'hz'){
         return {
            height:96/80 +"rem"
         }
    }
      return {
         height:60/80 +"rem"
      }
 }

 


 const pldata = ref([
    {
       hz:"峰值（Hz）",
       pmin:"",
       min:"",
       max:""
    },{
        hz:"绝对值（ms²）",
        pmin:"",
        min:"",
        max:"",
    }
 ]);

 function myround(value:any, dots = 2): any {
    if(!value){
         return "--";
    }
    let m = 10 ** dots;
    return Math.round(value * m) / m;
 }

 const totalPower = ref("--");
 const lfhf = ref("--");
 const sydata = ref([
     {
       hz:"监测值",
       pmin:"",
       max:"",
       min:""
     }
 ]);

//  
const handleHz = (fd:any)=>{
    if(fd && fd.fft_peak){
        for (let i = 0; i < 3; i++) {
          let peak = fd.fft_peak[i];
            if (i == 0) {
              pldata.value[0]!.pmin = "（0-0.04）," + myround(peak, 2);
            }
            if (i == 1) {
                 pldata.value[0]!.min = "（0.04-0.15）," + myround(peak, 2);
            }
            if (i == 2) {
                pldata.value[0]!.max = "（0.15-0.4）," + myround(peak, 2);
            }
        }     
    }
    //abs
   
        pldata.value[1]!.pmin = String(Math.round(fd?.fft_abs[0] || "")) 
        pldata.value[1]!.min = String(Math.round(fd?.fft_abs[1] || ""))
        pldata.value[1]!.max = String(Math.round(fd?.fft_abs[2] || ""));
         //total power
         totalPower.value = myround(fd?.fft_total, 2);
         //LF/HF
         lfhf.value = myround(fd?.fft_ratio, 2);
      
}


 


 onMounted(()=>{
     fetchData();
 });

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return window.btoa(binary);
}
 
let imgUrl1 = ref("");
let imgUrl2 = ref("");
let imgUrl3 = ref("");
let nodata  = ref(false);
let loading = ref(false);
 const fetchData = async ()=>{

     const result4 = (await SleepApi.reporthrv_info({
         patient_id:paientInfo.value.id,
         date:dateFtt("yyyymmdd", reportDate.value),
         md5: Md5.hashStr(String(paientInfo.value.id)) + "xoJWeO24ZLU3xibLDv8aGaqN4M33Ee",
     })).data;
     let tmp = result4;
     handleHz(tmp.fd);
     if(!tmp.fd || tmp.msg=="数据不足"){
        nodata.value = true;
     }else{
        nodata.value = false;
     }
     if(tmp.MEANRRI && !isNaN(tmp.MEANRRI)){
          sydata.value[0]!.pmin =  String(Math.round(tmp.MEANRRI));
     }
     if(tmp.MEANHR && !isNaN(tmp.MEANHR)){
          sydata.value[0]!.min =  String(Math.round(tmp.MEANHR));
     }
    if(tmp.PNN50 && !isNaN(tmp.PNN50)){
          sydata.value[0]!.max =  String(Math.round(tmp.PNN50));
    }
    if (tmp.hrv_report === '' || tmp.hrv_report == 'None') {
        if ((tmp.hrv_result == 1 || tmp.hrv_result == 6)) {
            current.value = 2;
        } else {
            current.value = 0;
        }
    } else {
        
        if (tmp.hrv_report == 0) {
            current.value = 0;
        } else if (tmp.hrv_report == 1) {
            current.value = 1;
        } else if (tmp.hrv_report == 2) {
            current.value = 2;
        }
    }


    //  44 20250928
    const result1 = (await SleepApi.reportHrvImg({
         patient_id:paientInfo.value.id,
         filename:"poincare.png",
         date:dateFtt("yyyymmdd", reportDate.value),
         md5: Md5.hashStr(String(paientInfo.value.id)) + "xoJWeO24ZLU3xibLDv8aGaqN4M33Ee",
     })).data;    

     if(arrayBufferToBase64(result1)){
        imgUrl1.value = "data:image/png;base64," +  arrayBufferToBase64(result1);
     }else{
        imgUrl1.value = "";
     }
      const result3 = (await SleepApi.reportHrvImg({
         patient_id:paientInfo.value.id,
         filename:"psd.png",
         date:dateFtt("yyyymmdd", reportDate.value),
         md5: Md5.hashStr(String(paientInfo.value.id)) + "xoJWeO24ZLU3xibLDv8aGaqN4M33Ee",
     })).data;
     if(arrayBufferToBase64(result3)){
        imgUrl3.value ="data:image/png;base64," +  arrayBufferToBase64(result3);

     }else{
           imgUrl3.value = ""
     }
      const result2 = (await SleepApi.reportHrvImg({
         patient_id:paientInfo.value.id,
         filename:"heatplot.png",
         date:dateFtt("yyyymmdd", reportDate.value),
         md5: Md5.hashStr(String(paientInfo.value.id)) + "xoJWeO24ZLU3xibLDv8aGaqN4M33Ee",
     })).data;
       if(arrayBufferToBase64(result2)){
        imgUrl2.value ="data:image/png;base64," +  arrayBufferToBase64(result2);
     }else{
           imgUrl2.value = ""
     };

     loading.value = true;

    


 }
</script>

<style scoped>
.search_sleep{
    height: 62px;
    background: #FFFFFF;
    border-radius: 8px 8px 8px 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 12px 24px;
}
.datepicker{
    width: 288px;
    margin-left: 20px;
}
:deep(.datepicker .el-input__wrapper){
    background-color: #F5F7FB;
    box-shadow: none;
}

.bordere6{
    border: 1px solid #e6e6e6;
}
.h60{
    height: 60px;
}
.custom_title {
    color: #252b50;
    font-size: 24px;
    font-weight: bold;
}
.custom_title_btn{
    width:50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    line-height: 0;
    cursor: pointer;
}
.custom_date_cell{
    border: none !important;
    height: 32px;
}  

.custom_content_box {
     display: flex;
     height: 1219px;
     justify-content: space-between;
     align-items: stretch;
     gap: 20px;
     margin-top: 20px;
}
.custom_content_box .custom_content_item_left .xlsc_box{
     height: 233px;
     padding: 24px;
     box-sizing: border-box;
     background: linear-gradient( 180deg, #FFF9E7 0%, #FFFFFF 34%); 
     margin-bottom: 20px; 
     border-radius: 8px;
     border: 1px solid #EEEEEE;
}
.xlsc_box .title{
    font-weight: bold;
    font-size: 18px;
    color: #384951;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}
.xlsc_box .title > span:first-child{
    font-weight: bold;
    font-size: 18px;
    color: #384951;
}
.xlsc_box .title > span:last-child{
    font-weight: bold;
    font-size: 18px;
    color: #FF7D01;
}
.xlsc_box .content{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    gap: 8px;
    padding: 24px 0;
    border-top: 1px solid #EEEEEE;
}
.xlsc_box .content > div{
    font-weight: 400;
    font-size: 18px;
    color: #384951;
    position: relative;
    padding-left: 12px;
}

.xlsc_box .content div .tip{
    position: absolute; 
    top: 50%; 
 transform: translateY(-50%); 
    left: 0; 
    width: 4px;
    height: 16px;
    margin-right: 12px;
}
.conclusion{
    font-weight: 400;
    font-size: 14px;
    color: #929FAF;
}

.plfx_box{
    padding: 24px;
    background-color: #FFFFFF;
    height: 966px;
    border-radius: 8px;
    border: 1px solid #EEEEEE;
}
.plfx_box .title{
    font-weight: bold;
    font-size: 18px;
    color: #384951;
    margin-bottom: 12px;
}
.plfx_box .img_box{
    width: 729px;
    height: 571px;
    border: 1px solid #EEEEEE;
    margin-bottom: 20px;
}
.custom_content_item_right{
    width: 100%;
}
.custom_content_item_right_top{
    padding: 24px;
    background-color: #FFFFFF;
    margin-bottom: 20px;
    height: 636px;
     border-radius: 8px;
    border: 1px solid #EEEEEE;
}
.custom_content_item_right_top .img_box{
    width: 601px;
    height: 549px;
    border: 1px solid #EEEEEE;
    margin: 0 auto;
    margin-top: 12px;
}
.custom_content_item_right_top .title{
    font-weight: bold;
    font-size: 18px;
    color: #384951;
}

.custom_content_item_right_bottom{
    padding: 24px;
    background-color: #fff;
    height: 563px;
     border-radius: 8px;
    border: 1px solid #EEEEEE;
}
.custom_content_item_right_bottom .title{
    font-weight: bold;
    font-size: 18px;
    color: #384951;
    margin-bottom: 12px;
}
.custom_content_item_right_bottom .img_box{
    width: 729px;
    height: 336px;
    border: 1px solid #EEEEEE;
    margin-bottom: 12px;
}

.power{
    /* border-bottom: 1px solid #e6e6e6;
     border-right: 1px solid #e6e6e6;
      border-left: 1px solid #e6e6e6; */
      display: flex;
    justify-content: center;
    gap: 24px;
    align-items: center;
    height: 60px;
}
.power div{
    align-items: center;
    display: flex;
    justify-content: center;
}
.power_title{
    font-weight: 400;
font-size: 16px;
color: #636676;

}
.power_value{
font-weight: 400;
font-size: 16px;
color: #384951;
}
.nodata {
    text-align: center;
    padding: 15% 0 60px;
    font-size: 14px;
    color: #929faf;
    height: 60vh;
}
.mb_20{
    margin-bottom: 24px;
}
.nodata img {
    width: 162px;
    margin: 0 auto;
}
</style>