<template>
  <div class='courseManagement' v-if="emptyLoading">
      <div class="empty" v-if="empty">
        <img src="@/assets/images/V4/empty.png" alt="">
        <p>患者暂未开启病程管理，请先开启病程管理。</p>
        <el-button type="primary" size="large" @click="openbc()" :loading="loadingbtn">立即开启</el-button>
      </div>
      <div class="content" v-else>
            <div class="flex justify-start items-stretch topContent gap-50px">
                <div class="flex justify-start items-stretch gap-50px max-500px flex-wrap">
                      <div class="top-line flex flex-col justify-center items-center" v-for="(item,index) in lineData" :key="index"
                @click="clickLine(item,index)"
                >
                        <div class="text14cus color-[#384951] font-bold" :class="{'color-[#24B287]!':avtiveArr.indexOf(index) > -1}">{{item.name}}</div>
                        <div class="icon relative">
                              <div class="line"  v-if="index < lineData.length - 1" :class="{'bg-[#24B287]!':avtiveArr.indexOf(index) > -1 && avtiveArr.indexOf(index + 1) > -1}"></div>
                              <img :src="avtiveArr.indexOf(index) > -1 ? getAssetsFileV4('sel.png') : getAssetsFileV4('nosel.png')" alt="" class="w-full h-full z-5 relative"  />
                        </div>
                        <div class="flex flex-col justify-center items-center">
                            <div class="text12cus color-[#384951] mb-4px">{{item.date}}</div>
                           <div class="text12cus color-[#384951]">{{item.hour}}</div>
                        </div>
                </div>
                </div>
               

                <div class="ml-auto flex justify-center items-end h-hull">
                     <el-button type="primary" class="h-40px" @click="handData(),bcShow()">编辑病程</el-button>
                      <el-button type="danger" class="h-40px" @click="showDelConfirm()">结束病程</el-button>
                </div>
            </div>

            <!-- tables -->
            <div class="tables">
                 <div class="tab1">
                    <div class="title color-[#384951] font-bold">护理事件</div>
                    <el-table :data="allData.care" row-class-name="h64px"
                    class="tableshadow"
                    :height="(624 / 1080 * 100)+'vh'" v-loading="loading4">
                    <el-table-column prop="totalStep" label="序号" align="center">
                        <template #default="scope">
                            <div>
                                <span>{{ (scope.$index + 1)}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="处理时间" align="center"> 
                        <template #default="scope">
                            <span>{{ dateFtt('yyyy-mm-dd hh:MM:ss',  scope.row.time) }}</span>
                            </template>
                    </el-table-column>
                    <el-table-column prop="tag" label="事件" align="center">
                         
                    </el-table-column> 
                    </el-table>
                 </div>
                 <div class="tab2">
                     <div class="title color-[#384951] font-bold">告警事件</div>
                    <el-table  :data="allData.warn" row-class-name="h64px" :height="(624 / 1080 * 100)+'vh'" v-loading="loading4">
                    <el-table-column prop="totalStep" label="序号" align="center">
                        <template #default="scope">
                            <div>
                                <span>{{ (scope.$index + 1)}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="告警时间" align="center"> 
                        <template #default="scope">
                            <span>{{ dateFtt('yyyy-mm-dd hh:MM:ss',  scope.row.time) }}</span>
                            </template>
                    </el-table-column>
                    <el-table-column prop="time" label="类型" align="center"> 
                        <template #default="scope">
                            <div>
                                <span v-if="scope.row.alarm_type === 266">低血氧报警</span>
                                <span v-if="scope.row.alarm_type === 267">高心率预警</span>
                                <span v-if="scope.row.alarm_type === 268">低心率报警</span>
                                <span v-if="scope.row.alarm_type === 271">跌倒报警</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sbp" label="详情" align="center">
                          <template #default="props">
                            <div>
                                 <span v-if="props.row.status === 1">未处理</span>
                                <span v-if="props.row.status === 2">已处理</span>
                            </div>
                        </template>
                    </el-table-column> 
                    </el-table>
                 </div>
                 <div class="tab3">
                    <div class="yyMed">
                        <div class="title color-[#384951] font-bold">用药计划</div>
                    <el-table class="tableshadow" :data="allData.medicine" row-class-name="h64px" :height="(276 / 1080 * 100)+'vh'" v-loading="loading4">
                                <el-table-column prop="totalStep" label="序号" align="center">
                                    <template #default="scope">
                                        <div>
                                            <span>{{ scope.$index + 1 }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="time" label="创建时间" align="center" width="200"> 
                                        <template #default="props">
                                <div>
                                    {{ dateFtt("yyyy-mm-dd hh:MM:ss",props.row.time)}}
                                </div>
                            </template>
                                </el-table-column>
                                <el-table-column prop="time" label="计划状态" align="center"> 
                                <template #default="props">
                                <div>
                                    <div v-if="props.row.status===1" class="line-height-16px flex justify-center items-center">
                                        <span class="color-[#24B287] text-[16px]">计划中</span>
                                    </div>
                                <div v-if="props.row.status===2"  class="line-height-16px flex justify-center items-center">
                                        <span class="color-[#F04A4B] text-[16px]">已结束</span>
                                    </div>
                                </div>
                            </template>
                                </el-table-column>
                                <el-table-column prop="sbp" label="详情" align="center">
                                    <template #default="props">
                                        <div>
                                            <span class="color-[#0477E0] text-[16px] cursor-pointer" @click="lookYs(props.row)">查看详情</span>
                                        </div>
                                    </template>
                                </el-table-column> 
                        </el-table>
                    </div>
                    <div class="yyMed">
                        <div class="title color-[#384951] font-bold">康复训练</div>
                        
                            <el-table class="tableshadow" :data="allData.train" row-class-name="h64px" :height="(276 / 1080 * 100)+'vh'" v-loading="loading4">
                        <el-table-column prop="totalStep" label="序号" align="center">
                            <template #default="scope">
                                <div>
                                    <span>{{ scope.$index + 1}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="time" label="上传时间" align="center"> 
                              <template #default="props">
                                <div>
                                    {{ dateFtt("yyyy-mm-dd hh:MM:ss",props.row.time)}}
                                </div>
                            </template>
                        
                        </el-table-column>
                        <el-table-column prop="time" label="类型" align="center"> 
                                <template #default="props">
                                        <div>
                                            <span v-if="props.row.status === 1">稍快</span>
                                            <span v-if="props.row.status === 2">舒缓</span>
                                              <span v-if="props.row.status === 3">缓慢</span>
                                        </div>
                                    </template>
                        </el-table-column>
                        <el-table-column prop="sbp" label="详情" align="center">
                            <template #default="props">
                                        <div>
                                            <span>训练前心率:{{  props.row.before_heart || "--"  }}</span>
                                            <span>训练后心率:{{  props.row.after_heart || "--"  }}</span>
                                        </div>
                                    </template>
                          
                        </el-table-column> 
                        </el-table>
                    </div>
                 </div>
            </div>
      </div>
    <!--  -->
      <custom-dialog v-model="tipVislble" append-to-body class="_loading" title="提示"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center" v-loading="tipLoading">
              {{ tipText  }}
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="primary" @click="tipClose(),bcShow()">确定</el-button>
            </div>
        </template>
    </custom-dialog>

     <custom-dialog v-model="bcVislble" append-to-body class="_loading" title="病程节点管理"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-528px flex flex-col justify-start items-center p-[24px] overflow-y-auto" v-loading="bcLoading">
                <div class="flex items-center gap-10px p-[10px_0px] border border-b-[#EEEEEE] border-b-solid" v-for="(item,index) in lineDataAll" :key="index">
                    <img :src="item.isSelected ?  getSelectedicon('sel') : getSelectedicon('nosel')"
                    @click="selLine(item,index)"
                    class="w-20px h-20px"/>
                   <div  class="w-241px color-[#676767] bg-[#F5F7FB] h-48px line-height-48px pl-12px" >{{ item.name }}</div>
                   <el-date-picker
                   :prefix-icon="customPrefix"
                   v-model="item.bcTime" type="datetime" placeholder="选择日期时间"
                   @change="(e)=>changeDesease(e,item)"
                   format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" class="w-241px customPrefix"/>
                </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="primary" @click="bcSubmit()">保存</el-button>
            </div>
        </template>
    </custom-dialog>

     <custom-dialog v-model="ysVisible" append-to-body class="_loading" :title="isCreated ? '创建用药计划' : '查看'"
            :width="`${1000 / 1920 * 100}%`"
            :top="`${(102 / 1080 * 100)}vh`"
            @close="ysClose"
            >
            <div class="p-[48px] h-66vh overflow-y-auto relative overflowscroll pt-0" v-loading="ysLoading">
                <div class="flex line-height-48px items-center mb-24px sticky top-0 bg-[#fff] z-10 pt-48px">
                    <div class="color-[#636676] text-[16px]">患者姓名：</div>
                    <el-input type="text" class="w-[260px] color-[#636676]!" readonly v-if="!isCreated"  v-model="ysForm.patientId" />
                    <el-select  
                    popper-class="custom-select-dropdown"
                    @change="handleChange"
                     v-model="ysForm.patientId" :loading="loading" filterable :remote-show-suffix="true" :filterMethod="searchPatient" placeholder="请选择患者姓名" class="w-[260px]" v-else>
                          <el-option  v-for="(value,key) in patientList" :key="key" :value="value.patient_id" :label="value.name">

                          </el-option>
                    </el-select>
                    <div class="color-[#636676] text-[16px] mr-48px ml-48px">
                        性别：{{ ysForm.sex || "--" }}
                    </div>
                    <div class="color-[#636676] text-[16px] mr-48px">
                        年龄：{{ ysForm.age|| "--" }}
                    </div>
                    <div class="color-[#636676] text-[16px] mr-48px">
                        住院号：{{ ysForm.patientNum|| "--" }}
                    </div>
                </div>
                <div class="yyItem mb-24px" v-for="(item,index) in ysForm.list" :key="index">
                     <div class="h50% p-[20px] borderbottom">

                             <div class="flex line-height-48px items-center mb-12px" v-for="(child,j) in item.childList" :key="j">
                                    <div class="color-[#636676] text-[16px] mr-8px">药品类型：</div>
                                    <el-input type="text" class="w-[260px] color-[#636676]!" readonly v-if="!isCreated" v-model="child.medtype"  />
                                    <el-select v-model="child.medtype" placeholder="请选择" class="w-[260px]" v-else  >
                                        <el-option  v-for="(value,key) in child.drugTypeList" :key="key" :value="value.value" :label="value.label">
                                            <div class="flex items-center">
                                                <img src="@/assets/images/V3/selected.png" alt="" class="w-20px h-20px mr-8px" v-if="child.medtype == value.value">
                                                <img src="@/assets/images/V3/noselect.png" alt="" class="w-20px h-20px mr-8px" v-else>
                                                <span class="color-[#636676] text-[16px]" :class="{'color-[#24B287]':child.medtype == value.value}">{{value.label || "--"}}</span> 
                                            </div>
                                        </el-option>
                                    </el-select>
                                    <div class="color-[#636676] text-[16px] ml-76px mr-8px"><span class="color-[red]">*</span>药品名称：</div>
                                    <el-input type="text" class="w-[260px] color-[#636676]!" readonly v-if="!isCreated" v-model="child.medid"/>
                        <el-select v-model="child.medid" placeholder="请选择" class="w-[260px]"  
                             filterable :remote-show-suffix="true"  
                             :loading="loadingSearch"
                            v-else>
                            <el-option  v-for="(value,key) in child.drugNameList" :key="key" :value="value.value" :label="value.label"
                            
                            >
                                <div class="flex items-center">
                                    <img src="@/assets/images/V3/selected.png" alt="" class="w-20px h-20px mr-8px" v-if="child.medid == value.value">
                                    <img src="@/assets/images/V3/noselect.png" alt="" class="w-20px h-20px mr-8px" v-else>
                                    <span class="color-[#636676] text-[16px]" :class="{'color-[#24B287]':child.medid == value.value}">{{value.business || "--"}}{{ value.label ? `(${value.label})` : "--" }}</span> 
                                </div>
                            </el-option>
                        </el-select>
                                    <img src="@/assets/images/V3/button_close.png" alt="" class="w-28px h-28px ml-36px"
                                    v-if="Number(j) > 0 && isCreated"
                                    
                                    >
                              </div>

                              <div class="flex w-115px h-36px border-24B287  bg-[#EAFFF9] rounded-[4px] items-center justify-center cursor-pointer"
                              
                              v-if="isCreated"
                              >
                                <img src="@/assets/images/V3/add.png" alt="" class="w-20px h-20px">
                                <span class="color-[#24B287] text-[16px] ml-4px">新增药品</span>
                              </div>
                     </div>
                     <div class="h50% p-[20px]">
                         <div class="flex line-height-48px">
                                    <div class="color-[#636676] text-[16px] mr-8px">提醒时间：</div>
                                    <el-input type="text" class="w-[260px] color-[#636676]!" readonly v-if="!isCreated" v-model="item.warnTime"/>
                                    <div class="relative w-[260px] timepicker" v-else>
                                        <el-time-picker
                                        format="HH:mm"
                                        value-format="HH:mm"
                                        v-model="item.warnTime" class="w-[260px]!" :prefix-icon="''" placeholder="请选择"
                                        
                                        :editable="false" />
                                        <span v-if="item.isSome" class="color-[#F04A4B] text-[16px] absolute left-0 top-60px line-height-16px">已有同时间计划</span>
                                    </div>
                                    
                                    <div class="color-[#636676] text-[16px] ml-76px mr-8px"><span class="color-[red]">*</span>提醒频率：</div>
                                     <el-input type="text" class="w-[260px] color-[#636676]!" readonly v-if="!isCreated" v-model="item.warnFrequency_text"  />
                                    <el-select v-model="item.warnFrequency" placeholder="请选择" class="w-[260px]" v-else>
                                        <el-option  v-for="(value,key) in txPl" :key="key" :value="value.value" :label="value.label">
                                        </el-option>
                                    </el-select>
                              </div>
                               <div class="flex w-115px h-36px border-F04A4B mt-12px bg-[#FFEBEB] rounded-[4px] items-center justify-center cursor-pointer"
                                
                                v-if="index != 0 && isCreated"
                                :class="{'mt-48px':item.isSome}"
                               >
                                <img src="@/assets/images/V3/del.png" alt="" class="w-20px h-20px">
                                <span class="color-[#F04A4B] text-[16px] ml-4px">删除</span>
                              </div>
                     </div>
                </div>
            </div>
            
        </custom-dialog>


          <custom-dialog v-model="delConfirm" append-to-body class="_loading" title="结束病程"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center" v-loading="delLoading">
               是否结束该病程?
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="closeDelConfirm(),showEditBed()">取消</el-button>
                <el-button size="large" type="primary" @click="delBedSubmit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>


  </div>
</template>
<script setup>
    import { ref,onMounted,computed ,shallowRef,h} from 'vue';
    import { getAssetsFileV4,getComMonAssetsV2,calculateAge,getRem} from '@/utils/function/function';
    import { useModal } from '@/hooks/useModal';
    import  PatientApi from "@/api/patient";
    import MedicineApi from '@/api/medicine';
    import { dateFtt} from "@/utils/date/dateFtt";
    import CareApi from "@/api/care";
    import DiseaseApi  from "@/api/desease";
    import rehabilitationTrainingplanApi from "@/api/rehabilitationTraining";
    import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
    const route = useRoute();
    const empty = ref(false);
    
    const getSelectedicon = (type)=>{
          return type=='sel' ? getComMonAssetsV2('isopen.png') : getComMonAssetsV2('isclose.png')
    };

    
const customPrefix = shallowRef({
  render() {
    return h('img', {
      src: getAssetsFileV4('date.png'),  // 替换为你的图片路径
      style: {
        width:getRem(28)+'px',  // 设置合适的宽度
        height:getRem(28)+ 'px', // 设置合适的高度
        
      }
    })
  },
})


    

    const loadingbtn = ref(false);
    const openbc = async () => {
        try {
            loadingbtn.value = true;
             await DiseaseApi.beginProcess({
                patient_id: route.params.id
             })
             loadingbtn.value = false;
             getEmpty();
             empty.value = false;
        } catch (error) {
              console.log(error,'openbc')
            loadingbtn.value = false;
        }
    }


    const clickLine = (item,index)=>{
          if(item.time > Number((new Date().getTime()/1000).toFixed(0))){
                return ElMessage.error("该节点时间未到");
          }
        // 选择未选择的节点重新连接
          if((avtiveArr.value.length >= 2) || avtiveArr.value.length===0){
               minDate.value =item.time;
               maxDate.value = item.time;
          }else if(avtiveArr.value.length == 1){
              if(item.time < minDate.value){
                  minDate.value = item.time;
              }else if(item.time > maxDate.value){
                  maxDate.value = item.time;
              }else{
                  minDate.value = '';
                  maxDate.value = "";
          }
        }
        getTableData1();
    }


    


    const handData = ()=>{
             lineDataAll.value.forEach((v,index)=>{
                 lineData.value.forEach((child,i)=>{
                    if(v.node_id===child.node_id){
                        v.bcTime = dateFtt("yyyy-mm-dd hh:MM",child.time);
                   }
                }) 
            });
    }

    const avtiveArr = computed(()=>{
        let _arr = [];
        let t = Number((new Date().getTime()/1000).toFixed(0));
        lineData.value.forEach((v,index)=>{
            if(v.time>=minDate.value && v.time<=maxDate.value && v.time < t){
                _arr.push(index);
            }
        })
        return _arr;
    })


    // 结束病程
    const useDelBed = () => {
        return useModal({
            submitApi: () => DiseaseApi.finish_process({
            patient_id: route.params.id,
            process_id: process_id.value
            }),
            afterSubmit:()=> {
                ElMessage.success("病程已结束");
                 getEmpty();
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

    const sortTime = ()=>{
        lineDataAll.value.sort((a,b)=>new Date(a.bcTime)-new Date(b.bcTime));
    }

    const selLine = (item)=>{
            let arr = lineDataAll.value.filter(v=>v.isSelected);
            
            if(arr.length>=12 && !item.isSelected){
                  tipText.value = "节点已达上限,最多选择12个。";
                  bcClose();
                  tipShow();
                  return
            }
              item.isSelected = !item.isSelected;
              sortTime()
    }

    const changeDesease = (e,item)=>{
         if(!e){
            return;
         }
            let arr = lineDataAll.value.filter(v=>v.bcTime===e && e);
            if(arr.length>1){
                  tipText.value = "当前节点时间与其他节点有冲突,请检查节点时间";
                  item.bcTime = "";
                  bcClose();
                  tipShow();
                  return
            }
             sortTime()
    }

const useCreate = () => {
  return useModal({
    formInit: {
      list: [{
        warnTime:"",    // 提醒时间
        warnFrequency:"", // 提醒频率
        childList:[{
              drugTypeList:[],
              drugType:"",   // 药品类型
              drugNameList:[],
              drugName:"",   // 药品名称
        }]
      }],
      isSave:0,
      patientId: ""
    },
    submitApi: (form) => MedicineApi.addAdvice({
       data:getData(),
       patient_id: form.patientId
    }),
  });
};
let isCreated = ref(false);
const {
  visible: ysVisible,
  show: ysShow,
  loading: ysLoading,
  close: ysClose,
  form: ysForm,
  submit: ysSubmit
} = useCreate();


const txPl = ref([{
   label:"每天",
   value:"0"
},{
   label:"每隔1天",
   value:"1"
},{
   label:"每隔2天",
   value:"2"
},{
   label:"每隔3天",
   value:"3"
},{
   label:"每隔4天",
   value:"4"
},{
   label:"每隔5天",
   value:"5"
},{
   label:"每隔6天",
   value:"6"
}])

const lookYs = async (row) => {
    try {
         ysLoading.value = true;
         isCreated.value = false;
         ysShow();
      const result = (await MedicineApi.getAdviceDetail({id:row.id})).data.result
    if (result) {
        ysLoading.value = false;
        let arr  = [];
        if(Array.isArray(result)){
            arr = result.map((item) => {
                return {
                    warnTime:item.notice,
                    warnFrequency_text:txPl.value.find((_item)=>_item.value==item.rate)?.label,
                    childList:item?.medicine?.map((item) => {
                        return {
                            medtype:item.cate_name,
                            medid:item.general,
                        }
                    })
                }
            })   
        }
        ysForm.value = {
            patientId:pInfo.value.name,
            sex:pInfo.value.sex == 0 ? '未知' : pInfo.value.sex == 1 ? '男' : '女',
            age:calculateAge(pInfo.value.birthday),
            patientNum:pInfo.value.patient_num,
            list:arr
        }
    }
    } catch (error) {
        console.log(error)
    }
}





 
    const loading4 = ref(false);
 
    const allData = ref({})
const getTableData1 = async () => {
    loading4.value = true;
  try {
     
    let min = minDate.value ? ((new Date(Number((minDate.value*1000).toFixed(0))).setHours(0,0,0,0))/1000).toFixed(0) : '';
    let max = maxDate.value ? ((new Date(Number((maxDate.value*1000).toFixed(0))).setHours(23,59,59,59))/1000).toFixed(0) : ''
    const res = await DiseaseApi.diseaseData({
        patient_id: route.params.id,
        start:  min,
        end: max
    })
    allData.value = res?.data?.result || {};
    for(let key in allData.value){
         if(!allData.value[key]){
            allData.value[key] = []
         }
    }
     loading4.value = false;
  } catch (error) {
   allData.value = {}
    console.log(error)
    loading4.value = false;
  }
}
 

    // 
    const lineData = ref([]);
    const tipText =  ref("当前节点时间与其他节点有冲突，请检查节点时间。");
    // 
    const useTip = () => {
    return useModal({
        submitApi: () => PatientApi.delBedNo({
        id:""
        }),
        afterSubmit: () => {
            refreshData()
        }
    });
    };
    const {
    visible: tipVislble,
    loading: tipLoading,
    show: tipShow,
    close: tipClose,
    submit: tipSubmit
    } = useTip();



     const useBc= () => {
        return useModal({
            beforeSubmit: (form) => {
                let isNoSave = lineDataAll.value.every(v=>!v.isSelected && !v.patient_node_id);
                if(isNoSave){
                      bcClose()
                        return false;
                }
                let flag = lineDataAll.value.some(v=>v.isSelected && (!v.bcTime || v.bcTime==""));
                if(flag){
                    ElMessage.error("请选择已选节点的时间");
                    return false;
                };
                // 未选中且有node_id的
                form.del = lineDataAll.value.filter(v=>!v.isSelected && v.patient_node_id).map(v=>{
                    return {
                        patient_node_id:v.patient_node_id
                    }
                });
                // 选中且没有node_id的
                form.add = lineDataAll.value.filter(v=>v.isSelected && !v.patient_node_id).map(v=>{
                    return {
                        node_time: (new Date(v.bcTime).getTime()/1000).toFixed(0),
                        node_id:v.node_id
                    }
                });
                // 选中且有node_id的
                form.edit = lineDataAll.value.filter(v=>v.isSelected && v.patient_node_id).map(v=>{
                    return {
                        node_time: (new Date(v.bcTime).getTime()/1000).toFixed(0),
                        patient_node_id:v.patient_node_id
                    }
                });

                return true;
            },
            submitApi: (form) => DiseaseApi.editProcess({
                patient_id:route.params.id,
                process_id:process_id.value,
                del:form.del,
                add:form.add,
                edit:form.edit
            }),
            afterSubmit: () => {
                ElMessage.success("保存成功");
                getEmpty()
            }
        });
    };
    const {
        visible: bcVislble,
        loading: bcLoading,
        show: bcShow,
        close: bcClose,
        submit: bcSubmit
    } = useBc();


    const pid = ref(route.params.id || "");
    const process_id = ref(0);
    const emptyLoading = ref(false);
    const lineDataAll = ref([]);
    const minDate = ref("");
    const maxDate = ref("");
    const getEmpty=async ()=>{
        try {
            let _res = await DiseaseApi.beginProcessLine({
                patient_id:pid.value
            });
            let res = _res?.data?.result || {};
           if(Array.isArray(res?.line) && res?.line.length>0){
              let _arr = res?.line.filter(v=>v.show==1);
              lineDataAll.value = res?.line.map((v,index)=>{
                        return {
                            ...v,
                            isSelected:v.patient_node_id && v.patient_node_id > 0
                        }  
              });
                lineData.value = _arr.map((v,index)=>{
                    return {
                        name:v.name,
                        icon:getAssetsFileV4('nosel.png'),
                        node_id:v.node_id,
                        time:v.node_time || '',
                        date:v.node_time && v.node_time>0 ? dateFtt("yyyy-mm-dd", v.node_time) : '',
                        hour:v.node_time && v.node_time>0 ? dateFtt("hh:MM", v.node_time) : '',
                    }
                });
                // 小于当前时间置灰
                minDate.value =_arr.length>0 ?  _arr[0]?.node_time :'';
                // 小于当前时间置灰
                maxDate.value =_arr.length>1 ?  _arr[1]?.node_time :'';
                 
           }else{
            lineData.value = [];
            lineDataAll.value = [];
           }
            getTableData1();
           if(res?.process_id==0){
                empty.value = true;
           }
           process_id.value = res?.process_id || 0;
           emptyLoading.value = true;
            
        } catch (error) {
             lineData.value = [];
            lineDataAll.value = [];
             getTableData1();
            console.log(error)
              emptyLoading.value = true;
        }
        
    };

    const pInfo = ref({})
        const fetchPatientInfo = async () => {
            let data = {
                id:route.params.id,
            }
            try {
                const result = (await PatientApi.patientDetail(data)).data.result
                if (result) {
                    pInfo.value = result;
                    console.log(pInfo.value,"pInfo")
                }
            } catch (error) {
                console.log(error)
            }
        }
    
    onMounted(()=>{
        getEmpty();
        fetchPatientInfo();
    })


</script>
<style scoped>

  /* 滚动条整体宽度 */
  ::-webkit-scrollbar {
    width: 4px; /* 可根据需要调整宽度 */
    background: #e6f0ff;
    margin-left: 10px;
  }

:deep(.ep-table){
    border-radius: 0px !important;
   box-shadow: none !important;
   border: none !important;
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
    .text14cus{
         font-size: calc(14 / 1080 * 100vh);
         line-height:1;
    }
    .text12cus{
         font-size: calc(12 / 1080 * 100vh);
         line-height:1;
    }
    .text16cus{
         font-size: calc(16 / 1080 * 100vh);
    }
    .courseManagement{
         padding: calc(20 / 1080 * 100vh);
    }
    .icon{
         width: calc(47 / 1080 * 100vh);
         height: calc(46 / 1080 * 100vh);
    }
    .topContent{
        padding: calc(40 / 1080 * 100vh);
        padding-bottom:  calc(24 / 1080 * 100vh);;
        background-color: #fff;
         border-radius: 12px;
         box-shadow: 0px 8px 24px 0px rgba(146, 15, 21, 0.08);
         min-height: calc(176 / 1080 * 100vh);
    }
    .tables{
         display: grid;
         grid-template-columns: repeat(3,614px);
         gap: calc(20 / 1920 * 100vw);
         margin-top: calc(20 / 1080 * 100vh);
    }
    .tab3,.tab2,.tab1{
         height: calc(714 / 1080 * 100vh);  
    }
    .tab3{
        display: grid;
        grid-template-rows: repeat(2,calc(347 / 1080 * 100vh));
        gap: calc(20 / 1080 * 100vh);
    }
    /*  */
    .tab2,.tab1{
        box-shadow: 0px 8px 24px 0px rgba(146, 15, 21, 0.08);
        border-radius: 12px;
        padding:calc(20 / 1080 * 100vh);  
        background:#fff;
    }
    .yyMed{
          box-shadow: 0px 8px 24px 0px rgba(146, 15, 21, 0.08);
        border-radius: 12px;
        padding:calc(20 / 1080 * 100vh);  
        background:#fff;
    }
    .title{
        margin-bottom: calc(20 / 1080 * 100vh);
        font-size: calc(18 / 1080 * 100vh);
        
    }
    .top-line{
       gap: calc(12 / 1080 * 100vh);
       position:relative;
    }
    .line{
        left: calc(50 / 1080 * 100vh);
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        width:60px;
        height:2px;
        background-color:#F5F7FB;
        z-index:1;
    }
     
    .content{
         height: calc(912 / 1080 * 100vh);
    }
    .empty{
         background-color:#fff;
         height: calc(912 / 1080 * 100vh);
         box-shadow: 0px 8px 24px 0px rgba(146, 159, 175, 0.16);
         border-radius:12px;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         gap: calc(32 / 1080 * 100vh);
    }
    .empty img{
         width: calc(144 / 1080 * 100vh);
         height: calc(144 / 1080 * 100vh);
    }
    .empty p{
         font-size: calc(16 / 1080 * 100vh);
         line-height: calc(16 / 1080 * 100vh);

    }
</style>