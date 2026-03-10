<template>
    <div class="sf">

        <div class="search_box flex_space_between bg-#fff mb-20px">

            <div class="flex_start gap-20px w100%">
                <div class="search_item flex_start">
                    <div class="search_label">姓名：</div>
                    <div> <el-input size="large" v-model="search_form.name" placeholder="请输入" maxlength="20"></el-input></div>
                </div>
               <div class="search_item flex_start">
                    <div class="search_label">计划状态：</div>
                    <div class="select_width_bg">
                        <el-select v-model="search_form.status" size="large" >
                             <el-option key="1" value="1" label="计划中"></el-option>
                            <el-option key="2" value="2" label="已结束"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search_btn_box mr-auto">
                    <el-button type="primary" size="large" @click="search">查询</el-button>
                    <el-button type="info" size="large" @click="reset">重置</el-button>
                </div>
                  <div class="add_btn_box" @click="isCreated = true,formInit(),ysShow()">
                <el-button type="primary" size="large">
                    <img src="@/assets/icon/addDevice.png" class="btn_icon">创建</el-button>
            </div>
            </div>
        </div>

        <div class="table_box">
            <el-table :data="tableData" border :style="{'width':'100%'}" size="large" v-loading="tableLoading" class="rounded-12px">
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="patient_num" label="性别" align="center">
                       <template #default="scope">
                        <div>
                            {{ scope.row.sex == 0 ? '未知' : scope.row.sex == 1 ? '男' : '女'}}
                        </div>
                       </template>
                </el-table-column>
                <el-table-column prop="age" label="年龄" align="center"></el-table-column>
              <el-table-column prop="patient_num" label="住院号" align="center"></el-table-column>
              <el-table-column prop="ccid" label="设备CCID" align="center"></el-table-column>
                <el-table-column prop="emergency_phone" label="计划状态" align="center">
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
                <el-table-column prop="created_at" label="计划创建时间" align="center">
                       <template #default="props">
                        <div>
                            {{ dateFtt("yyyy-mm-dd hh:MM:ss",props.row.created_at)}}
                        </div>
                       </template>
                </el-table-column>
              
                <el-table-column label="操作" align="center" min-width="100">
                    <template #default="props">
                        <div class="flex justify-center items-center">
                            <el-button type="primary" @click="lookYs(props.row)" plain class="p-[0_15px] h-32px border-none">查看</el-button>
                            <el-button type="primary" color="#F22727" @click="endPlanSetForm({id:props.row.id}),endPlanShow()" plain class="w-90px h-32px border-none">结束计划</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>


        <custom-dialog v-model="endPlanVisible" append-to-body class="_loading" title="结束计划"
        :width="`${(640 / 1920) * 100}%`" :top="`${(276 / 1080 * 100)}vh`">
        <div class="h-200px flex justify-center items-center" v-loading="endPlanLoading">
               是否结束该计划?
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="endPlanClose()">取消</el-button>
                <el-button size="large" type="primary" @click="endPlanSubmit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>


     <custom-dialog v-model="tipVisible" append-to-body class="_loading" title="提示"
        :width="`${(640 / 1920) * 100}%`" :top="`${(276 / 1080 * 100)}vh`"
        @close="tipClose(),ysShow()"
        >
        <div class="h-200px flex justify-center items-center" v-loading="ysLoading">
               {{ tipText }}
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="tipClose(),ysShow()">取消</el-button>
                <el-button size="large" type="primary" @click="saveNew()">确定</el-button>
            </div>
        </template>
    </custom-dialog>
          <custom-dialog v-model="ysVisible" append-to-body class="_loading" :title="isCreated ? '创建用药计划' : '用药计划'"
            :width="`${1000 / 1920 * 100}%`"
            :top="`${(102 / 1080 * 100)}vh`"
            @close="ysClose"
            >
            <div class="p-[48px] h-66vh overflow-y-auto relative overflowscroll pt-0" v-loading="ysLoading">
                <div class="flex line-height-48px items-center  sticky top-0 bg-[#fff] z-10 pt-48px pb-24px">
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
                                    <el-select v-model="child.medtype" placeholder="请选择" class="w-[260px]" v-else @change="(e:any)=>changeDrugType(e,child)">
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

                        <el-select v-model="child.medid" placeholder="请选择" class="w-[260px]" @change="(e:any)=>changeDrugName(e,child)"
                             filterable :remote-show-suffix="true" :filterMethod="(e:any)=>searchMed(child,e,child.medtype)"
                             :loading="loadingSearch"
                            v-else>
                            <el-option  v-for="(value,key) in child.drugNameList" :key="key" :value="value.value" :label="value.label"
                            
                            >
                                <div class="flex items-center">
                                    <img src="@/assets/images/V3/selected.png" alt="" class="w-20px h-20px mr-8px" v-if="child.medid == value.value">
                                    <img src="@/assets/images/V3/noselect.png" alt="" class="w-20px h-20px mr-8px" v-else>
                                    <span class="color-[#636676] text-[16px]" :class="{'color-[#24B287]':child.medid == value.value}">{{value.label || "--"}}{{ value.business  ? `(${value.business})` : "--" }}</span> 
                                </div>
                            </el-option>
                        </el-select>
                                    <img src="@/assets/images/V3/button_close.png" alt="" class="w-28px h-28px ml-36px"
                                    v-if="Number(j) > 0 && isCreated"
                                    @click="delChildItem(index as number,j as number)"
                                    >
                              </div>

                              <div class="flex w-115px h-36px border-24B287  bg-[#EAFFF9] rounded-[4px] items-center justify-center cursor-pointer"
                              @click="addChild(index as number)"
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
                                        @change="(e:any)=>changeWarnTime(e,item,index)"
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
                                @click="delList(index as number)"
                                v-if="index != 0 && isCreated"
                                :class="{'mt-48px':item.isSome}"
                               >
                                <img src="@/assets/images/V3/del.png" alt="" class="w-20px h-20px">
                                <span class="color-[#F04A4B] text-[16px] ml-4px">删除</span>
                              </div>
                     </div>
                </div>
                 <el-button size="large" type="primary" @click="addList()" class="w-101px p-0!" v-if="isCreated">新增</el-button>
            </div>
               <template #footer v-if="isCreated">
                    <div class="dialog-footer">
                        <el-button size="large" type="info" @click="formInit(),ysClose()">取消</el-button>
                        <el-button size="large" type="primary" @click="ysSubmit()">保存</el-button>
                    </div>
                </template>
        </custom-dialog>

    </div>
</template>

<script setup lang='ts'>
import type {  Pagination } from '@/interface/interface';
import { onMounted, reactive,onUnmounted, ref, shallowRef,nextTick} from 'vue';
import MedicineApi from '@/api/medicine';
import { useModal } from '@/hooks/useModal';
import { dateFtt } from '@/utils/date/dateFtt';
import PatientApi from '@/api/patient';
import { deepClone } from '@/utils/function/function';
import { ElMessage } from 'element-plus';
// 创建用药计划
let isExit = ref<boolean>(false);
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
    beforeSubmit:async (form) => {
        if(!form.patientId){
           ElMessage.error('请选择患者');
           return false;
        }
        let index = form.list.findIndex((item:any)=>item.childList.some((child:any)=>!child.medid));
        if(index > -1){
           ElMessage.error(`请补全表单第${index+1}项药品名称`);
           return false;
        }
        let index1 = form.list.findIndex((item:any)=>!item.warnTime);
        if(index1 > -1){
           ElMessage.error(`请补全表单第${index1+1}项提醒时间`);
           return false;
        }
         let index2 = form.list.findIndex((item:any)=>!item.warnFrequency);
        if(index2 > -1){
           ElMessage.error(`请补全表单第${index2+1}项提醒频率`);
           return false;
        }
        // 保存不用检查
        if(form.isSave===1){
           return true
        }
        let flag = await checkData(form.patientId);
        if(flag){
            isExit.value = true;
            tipText.value = "该患者已有一条计划正在进行中，是否继续保存将新计划覆盖原计划？";
             ysClose();
            tipShow();
            return false;
        }else{
             isExit.value = false;
        }
      return true;
    },
    submitApi: (form) => MedicineApi.addAdvice({
       data:getData(),
      patient_id: form.patientId
    }),
    afterSubmit:() => {
        fetchData();
         tipClose();
        ElMessage.success('提交成功');
    }
  });
};
const checkData = async (id:any)=>{
     let flag = false;
     let res = await MedicineApi.checkPlan({
         patient_id:id
     })
     if(res.data.result && res.data.result.num!=0){
         flag = true;
     }
     return flag;
}
const saveNew = ()=>{
    if(isExit.value){
        ysForm.value.isSave = 1;
         ysSubmit()
    }else{
tipShow();
     ysShow();
    }    
}
const loadingSearch = ref(false);
const searchMed = async (child:any,val:any,type?:any)=>{
loadingSearch.value = true;
         const result = (await MedicineApi.getMedicineList({cate_id:type|| "",medicine:val || ""})).data.result;
      let _a = result.map((item:any)=>{
             return {
                 label: item.general,
                 value: item.detail_id,
                 cate_id: item.cate_id,
                 general: item.general,
                 business:item.business
             }
        });
    if (result) {
        child.drugNameList = deepClone(_a); 
        
    }else{
        child.drugNameList = [];
    }
    loadingSearch.value = false;
       
}
// /medicine/check_plan
const getData = ():any=>{
    // [{"medicine":[{"cate_name":"xxx","general":"xxx","business":"xxx"}],"notice":"xxx","rate":"xxx"}]
    let data = [];
    for(let i = 0;i<ysForm.value.list.length;i++){
        let item = ysForm.value.list[i];
       let arr = item.childList.map((item:any)=>{
            return {
                cate_name:item.cate_name,
                general:item.general,
                business:item.business
            }
       })
        let obj = {
            medicine:arr,
            notice:item.warnTime,
            rate:item.warnFrequency
        }
        data.push(obj);
    };
    return data;
}
const scrollToBottom = ()=> {
      // 获取容器元素
      const container =  document.querySelector(".overflowscroll") as HTMLElement;
      // 滚动到底部
      container.scrollTop = container.scrollHeight;
      
      // 或者使用 scrollIntoView
      // container.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
const pList = ref<any[]>([]);
let isCreated = ref(false);
const {
  visible: ysVisible,
  show: ysShow,
  loading: ysLoading,
  close: ysClose,
  form: ysForm,
  submit: ysSubmit
} = useCreate();
// 初始化表单
const formInit = () => {
  ysForm.value = {
    isSave:0,
     list: [{
        warnTime:"",    // 提醒时间
        warnFrequency:"", // 提醒频率
        childList:[{
              drugTypeList:deepClone(medTypes.value),
              drugType:"",   // 药品类型
              drugNameList:deepClone(medNames.value),
              drugName:"",   // 药品名称
        }]
      }],
      patientId: ""
  }
}

const delChildItem = (index: number, childIndex: number) => {
  ysForm.value.list[index].childList.splice(childIndex, 1);
}
const addChild = (index: number) => {
if(ysForm.value.list[index].childList.length>=10){
    return ElMessage.error("已达到10条，无法添加");
}
  ysForm.value.list[index].childList.push({
    drugType:"",   // 药品类型
    drugName:""
  });
  settingList();
}
const delList = (index: number) => {
  ysForm.value.list.splice(index, 1);
}

const lookYs = async (row:any) => {
    try {
         ysLoading.value = true;
         isCreated.value = false;
         ysShow();
      const result = (await MedicineApi.getAdviceDetail({id:row.id})).data.result
    if (result) {
        ysLoading.value = false;
        let arr:any[] = [];
        if(Array.isArray(result)){
            arr = result.map((item: any) => {
                return {
                    warnTime:item.notice,
                    warnFrequency_text:txPl.value.find((_item:any)=>_item.value==item.rate)?.label,
                    childList:item?.medicine?.map((item: any) => {
                        return {
                            medtype:item.cate_name,
                            medid:item.general,
                        }
                    })
                }
            })
            
        }
        ysForm.value = {
            patientId:row.name,
            sex:row.sex == 0 ? '未知' : row.sex == 1 ? '男' : '女',
            age:row.age,
            patientNum:row.patient_num,
            list:arr
        }
    //      list: [{
    //     warnTime:"",    // 提醒时间
    //     warnFrequency:"", // 提醒频率
    //     childList:[{
    //           drugTypeList:[],
    //           drugType:"",   // 药品类型
    //           drugNameList:[],
    //           drugName:"",   // 药品名称
    //     }]
    //   }],
    //   patientId: ""
    }
    } catch (error) {
        
    }
}


const addList = () => {
    if(ysForm.value.list.length>=5){
    return ElMessage.error("已达到5条，无法添加");
    }
  ysForm.value.list.push({
    warnTime:"",    // 提醒时间
    warnFrequency:"", // 提醒频率
    childList:[{
          drugType:"",   // 药品类型
          drugName:"",   // 药品名称
    }]
  });
  settingList();
  nextTick(()=>{
      scrollToBottom();
  })
}



// 结束计划
const useEndPlan = () => {
  return useModal({
    formInit:{
       id:""
    },
    submitApi: (form) => MedicineApi.finishPlan({
      id: form.id 
    }),
    afterSubmit:() => {
        fetchData()
    }
  });
};
const {
  visible: endPlanVisible,
  loading: endPlanLoading,
  setForm: endPlanSetForm,
  show: endPlanShow,
  close: endPlanClose,
  submit: endPlanSubmit
} = useEndPlan();


// 提示
let tipText = ref("");
const useTip = () => {
  return useModal({});
};
const {
  visible: tipVisible,
  show: tipShow,
  close: tipClose
} = useTip();

// 搜索
const search_form = reactive({
    name: "",
    patient_num: "",
    status: "",
    visit: 0
})

const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}
 
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    search_form.patient_num = ''
    search_form.name = ''
    search_form.status = ''
    search_form.visit = 0
    fetchData()
}
// 分页器
const pageQuery = reactive<Pagination>({
    page: 1,
    perPage: 10,
    total: 0
})

const handleSizeChange = (val: number) => {
    pageQuery.perPage = val
    fetchData()
}
const handleCurrentChange = (val: number) => {
    pageQuery.page = val
    fetchData()
}
//列表

 
const tableLoading = ref<boolean>(false)
let tableData = ref<any[]>([])

const fetchData = async (type?:Number) => {
    tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        name: search_form.name,
        status: search_form.status || "",
    }
      const result = (await MedicineApi.getAdviceList(data)).data.result
    if (result) {
        tableLoading.value = false
        pageQuery.total = result.total
        tableData.value = result.data
    }
}

const medTypes = ref<any[]>([]);
// 药品类型列表
const getMedTypes = async (e?:any) => {
      const result = (await MedicineApi.getMedicineCateList()).data.result;
      let _a = result.map((item:any)=>{
             return {
                 label: item.cate_name,
                 value: item.cate_id
             }
        });
      if(e){
         return Promise.resolve(_a);
      }
    if (result) {
        medTypes.value = deepClone(_a);
    }else{
        medTypes.value = [];
    }
}


const medNames = ref<any[]>([])
// 药品列表
const getMedNames = async (e?:any) => {
      const result = (await MedicineApi.getMedicineList({cate_id:e|| ""})).data.result;
      let _a = result.map((item:any)=>{
             return {
                 label: item.general,
                 value: item.detail_id,
                 cate_id: item.cate_id,
                 general: item.general,
                 business:item.business
             }
        });
      if(e){
          return Promise.resolve(_a);
      }
    if (result) {
        medNames.value = deepClone(_a); 
        
    }else{
        medNames.value = [];
    }
}
const settingList = ()=>{
           ysForm.value.list.forEach((item:any)=>{
               if(!item.childList){
                  item.childList =  [];
               }
               item.childList = item.childList.map((child:any)=>{
                     return {
                         ...child,
                         drugTypeList: deepClone(medTypes.value) ,
                         drugNameList: deepClone(medNames.value) 
                     }
               })
           })
      
}


const txPl = ref<any[]>([{
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


const patientList = ref<any[]>([]);

const loading = ref(false);
const selpage = ref(1);
const isEnd = ref(false);
const getPatientList = async (e?:string)=>{
    loading.value = true;
    const data = {
        name: e || "",
    }
      const result = (await PatientApi.getunbindPatientList(data)).data.result;
      if(selpage.value==1){patientList.value = []}
    if (result) {

          patientList.value = [...patientList.value,...result];
         if(result.length < 8){
              isEnd.value = true;
         }
    }
     loading.value = false;
}

const visibleChange = (visible:any)=>{
     if (visible) {
        nextTick(() => {
            setTimeout(() => {
              const dropdown = document.querySelector('.custom-select-dropdown .ep-select-dropdown__list');
              if (dropdown) {
                dropdown.addEventListener('scroll', handleScroll);
              }
            },100)
         
        });
      }
}
const handleChange = (e:any)=>{
    let _item = patientList.value.find((item:any)=>item.patient_id == e);
    if(_item){
        ysForm.value.sex = _item.sex==1 ? '男' :  _item.sex==2 ? '女' : '--';
         ysForm.value.age =  _item.birthday ?
                            ((new Date().getTime() - new Date(_item.birthday).getTime())) / 86400000 < 365 ? Math.floor
                                ((new Date().getTime() - new Date(_item.birthday).getTime()) / 86400000) + '天' :
                                Math.floor(((new Date().getTime() - new Date(_item.birthday).getTime())) / 86400000 /
                                    365) + '周岁' : "" ;
          ysForm.value.patientNum = _item.patient_num;
    }
}

const handleScroll = (e:any)=>{
    const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        if(!isEnd){
             selpage.value++;
             getPatientList();
        }
      }
}
 

const searchPatient = (e:any)=>{
    getPatientList(e)
    // patientList.value = patientList.value.filter((item:any)=>item.name.indexOf(e)>=0);
}

const changeDrugType = async (e:any,child:any)=>{
    if(!child.drugNameList){
          child.drugNameList = [];
    }
    child.medid = "";
    child.cate_name  =  child.drugTypeList.find((item:any)=>item.value==e).label;
    child.drugNameList = [];
    child.drugNameList = await getMedNames(e);
}
const changeDrugName = async (e:any,child:any)=>{
    if(!child.drugTypeList){
          child.drugTypeList = [];
    }
   
    let item = medNames.value.find((item:any)=>item.value == e);
    if(item){
         child.general = item.general;
         child.business = item.business;
         child.medtype = item.cate_id;
    }
}

const changeWarnTime = async (e:any,item:any,index:any)=>{
    let _index = ysForm.value.list.findIndex((item:any)=>item.warnTime == e);
    if(_index > -1 && _index != index){
        item.warnTime = "";
        item.isSome = true;
        tipText.value = "患者已有同时间计划，请错开时间至少1分钟。";
        ysClose();
        tipShow();
    }else{
         item.warnTime = e;
         item.isSome = false;
    }
}

onMounted(()=>{
    tableLoading.value = true
     Promise.all([fetchData(),getMedTypes(),getMedNames()]).then(() => {
         tableLoading.value = false;
         getPatientList();
         settingList();
     }).catch((error) => {
         tableLoading.value = false
     });
})

onUnmounted(() => {
  const dropdown = document.querySelector('.custom-select-dropdown .ep-select-dropdown__list');
  if (dropdown) {
    dropdown.removeEventListener('scroll', handleScroll);
  }
});
 



</script>

<style scoped>

    ::deep(.timepicker .ep-input){
          width:260px;
    } 
        /* 滚动条整体宽度 */
  ::-webkit-scrollbar {
    width: 4px; /* 可根据需要调整宽度 */
    background: #e6f0ff;
    margin-left: 10px;
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: #CDCDCD;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: #24B287;
    /* min-height: 70px; */
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

    .border-24B287{
         border: 1px solid #24B287;
    }
    .borderbottom{
           border-bottom: 1px solid #EEEEEE;
    }
    .border-F04A4B{
         border: 1px solid #F04A4B;
    }
.yyItem{
 
    border-radius: 8px 8px 8px 8px;
border: 1px solid #EEEEEE;
}
.header {
  height: 86px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
}
.sf{
    margin:24px; 
}

 

.patientjournal {
    height: 90px;
    width: 100%;
    background-color: #fff;
}


.wfit{
  width:fit-content !important;
}


.sf_btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    text-align: center;
    line-height: 48px;
    color: white;
    background-color: #1ab8cc;
    position: absolute;
    bottom: -2px;
}

.dia_con {
    width: 100%;
    /* height: 739px; */
    display: flex;
    box-sizing: border-box;
}

.dia_l {
    width: 177px;
    background-color: #F5F7FB;
}

.dia_l .item {
    cursor: pointer;
    background-color: #fff;
    font-size: 14px;
    color: #929FAF;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 100%;
}

.dia_con .dia_l .pitch {
    background: #24B287;
    color: #FFFFFF;
}

.item_btn {
    cursor: pointer;
    font-size: 14px;
    color: #24B287;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 100%;
}

.item_btn .text {
    color: #fff;
    background-color: #24B287;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dia_r {
    width: 688px;
}

.dia_r_box {
    padding: 24px;
    /* height: 659px; */
    box-sizing: border-box;
    overflow-y: auto;
}

.dia_r_b {
    width: 100%;
    border-top: 1px solid #EEEEEE;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
}

:deep(.dia_r_box .el-table__cell) {
    padding: 5px !important;
}
.nodata{
    padding: 24px;
}

.nodata img {
    width: 50%;
    margin: 0 auto;
    display: block;
    margin-top: 0px;
}

.nodata_add {
    text-align: center;
    margin-bottom: 48px;
}

.nodata .add {
    width: 135px;
    height: 48px;
}

.addsui {
    /* width: 100%; */
    padding: 24px 60px;
    padding-right: 20px;
}

.fk_box {
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #EEEEEE;
    padding: 24px 48px;
    margin-top: 22px;
}

.addsui .item {
    display: flex;
    margin-bottom: 12px;
}

/* .item_inp { */
/* width: 284px; */
/* } */

:deep(.patient_input_width1) {
    width: 284px !important;
}

:deep(.patient_input_width2) {
    width: 426px !important;
}

:deep(.patient_input_width3) {
    width: 120px !important;
}

:deep(.sss) {
    display: flex !important;
    align-items: center !important;
}

.deit {
    display: flex;
    justify-content: center;
}
.w100{
  width: 80px;
  text-align: right;
}

.left {
    justify-content: left;

}

.item_leb {
    margin-left: 5px;
}

.addsui ._item {
    margin-right: 48px;
}


.dialog_flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.dialog_right {
    padding-right: 20px;
    width: 60%;
}

.right_title {
    margin: 20px 0 12px;
}


.echarts_nodata img {
    width: 162px;
    margin: 0 auto;
}

.echarts_nodata p {
    font-size: 12px;
    color: #929FAF;
}

.echarts_nodata {
    text-align: center;
    height: 280px;
    padding-top: 54px;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #ffffff;
}

.echart_size {
    width: 100%;
    height: 300px;
}

.report_right {
    border-radius: 10px;
    border: 1px solid #eaeaea;
    padding: 12px;
    width: calc(100% - 234px);
}

.select_width{
    width: 220px;
} 
.select_width_bg{
    width: 220px;
}

:deep(.select_width_bg .ep-select .ep-select__wrapper){
    background-color: #F5F7FB !important;
    height: 48px !important;
}
:deep(.search_item .ep-input__inner){
    height: 48px;
}
:deep(.select_width .ep-select .ep-select__wrapper){
    background-color: #fff !important;
    height: 48px !important;
}

.date_search_box {
    background-color: #F5F7FB;
    padding: 9px 24px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-top: 10px;
}

.report_left {
    background-color: #F5F7FB;
    border-radius: 5px;
    width: 224px;
    padding: 12px;
}

.left_title {
    font-size: 16px;
    font-weight: bold;
    color: #07C160;
    margin-bottom: 12px;
}

.left_content_box {
    padding: 8px;
    border-radius: 4px;
    background-color: #ffffff;
}

.left_data_box_title img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.left_content_box .d_name {
    /* width: 184px; */
    height: 24px;
    line-height: 24px;
    color: #384951;
    font-size: 16px;
}

.left_content_box .unit {
    height: 24px;
    font-size: 16px;
    color: #929FAF;
    line-height: 24px;
}

.left_value_box {
    height: 48px;
    line-height: 48px;
    font-size: 24px;
    color: #384951;
    font-weight: bold;
    border-bottom: 1px solid #EEEEEE;
    margin-bottom: 12px;
    text-align: center;
}

.avg_data {
    text-align: center;
}

.avg_data .value {
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    font-weight: bold;
    color: #384951;
}

.avg_data .text {
    font-size: 12px;
    font-weight: 400;
    color: #929FAF;
}

.mb_8 {
    margin-bottom: 8px;
}

.table_height {
    max-height: 60px;
    overflow-y: auto;
}

.table_height::-webkit-scrollbar {
    width: 1px;

}

.table_height::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* 滑块颜色 */
    border-radius: 10px;
    /* 滑块圆角 */
}

.table_height::-webkit-scrollbar-track {
    background: #e1e1e1;
    /* 轨道颜色 */
}
</style>