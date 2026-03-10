<template>
    <div class="sf">

        <div class="search_box flex_space_between bg-#fff mb-20px">

            <div class="flex_start gap-20px w100%">
                <div class="search_item flex_start">
                    <div class="search_label">药品编码：</div>
                    <div> <el-input size="large" v-model="search_form.code" placeholder="请输入"></el-input></div>
                </div>
                <div class="search_item flex_start">
                    <div class="search_label">药品名称：</div>
                    <div> <el-input size="large" v-model="search_form.medicine" placeholder="请输入"></el-input></div>
                </div>
               <div class="search_item flex_start">
                    <div class="search_label">药品类型：</div>
                    <div class="select_width_bg">
                        <el-select v-model="search_form.cate_id" size="large" >
                             <el-option v-for="(item,index) in medTypes" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search_btn_box mr-auto">
                    <el-button type="primary" size="large" @click="search">查询</el-button>
                    <el-button type="info" size="large" @click="reset">重置</el-button>
                </div>


                  <div class="add_btn_box" @click="medShow()">
                    <el-button type="primary" size="large">
                    <img src="@/assets/images/V3/med.png" class="btn_icon">药品类型管理</el-button>
            </div>
            </div>
        </div>

        <div class="table_box">
            <el-table :data="tableData" border :style="{'width':'100%'}" size="large" v-loading="tableLoading" class="rounded-12px">
                <el-table-column prop="code" label="药品编码" align="center"></el-table-column>
                <el-table-column prop="general" label="药品通用名" align="center"></el-table-column>
                <el-table-column prop="business" label="药品商用名" align="center"></el-table-column>
                <el-table-column prop="form" label="药品剂型" align="center"></el-table-column>
                <el-table-column prop="standard" label="药品规格" align="center"></el-table-column>
                <el-table-column prop="unit" label="计量单位" align="center"></el-table-column>
                <el-table-column prop="cate_name" label="药品类型" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template #default="props">
                        <div class="flex justify-center items-center">
                            <el-button type="primary" @click="medDetailSetFormHand(props.row),medDetailShow()" plain class="p-[0_15px] h-32px border-none" >编辑</el-button>
                            <el-button type="primary" @click="medDelSetForm(props.row),showDelConfirm()"  color="#F22727"  plain class="p-[0_15px] h-32px border-none">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <elc-pagination v-model:current-page="pageQuery.page" v-model:page-size="pageQuery.perPage"
                :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageQuery.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>


        


         
         <custom-dialog v-model="medVisible" append-to-body class="_loading" title="药品类型管理"
        :width="`${(1000 / 1920) * 100}%`" top="10vh"
        :before-close="closeMed"
        >
         <div class="p-[24px] relative">
                <div class="line-height-18px flex flex-start mb-20px">
                  <el-input placeholder="请输入" v-model.trim="medForm.addName" class="w-260px mr-12px" maxlength="8"></el-input>
                  <el-button size="large" type="primary" class="w-150px" @click="addTag()">添加新类型</el-button>
                  <el-button size="large" type="danger"  @click="showEdit()" v-if="!isEdit && mockCurrentList.length > 0" class="ml-auto!">删除</el-button>
                  <div class="flex gap-12px ml-auto" v-if="isEdit">
                     <el-button size="large" type="info" @click="cancelDel()" class="ml-auto!">取消</el-button>
                    <el-button size="large" type="primary" @click="saveDel()" class="ml-auto!">保存</el-button>
                  </div>
               </div>
              <div class="maxheight-300px mh-100px overflow-y-auto overflow-x-hidden pt-10px pr-20px pb-10px mb-10px" v-loading="medIcineLoading">
                  <TabList
                      :type="isEdit ? 'delByItem' : 'single'"
                      :disabled="true"
                      :column="5"
                      :list="mockCurrentList"
                      @del="handleDelChange"
                    />  
                </div>
                 <!-- -->
                <div  v-if="tipShow" class="abcenter w-fitcontent p-[0_22px] h-32px line-height-32px text-center rounded-50px color-[#FFFFFF] text-16px" >
                    请先保存编辑内容
                </div>
        </div>
        <!-- <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="medClose()">取消</el-button>
                <el-button size="large" type="primary" @click="medSubmit()">确定</el-button>
            </div>
        </template> -->
    </custom-dialog>


       <custom-dialog v-model="medDetailVisible" append-to-body class="_loading" title="药品信息"
        :width="`${(640 / 1920) * 100}%`" top="10vh">
         <div class="p-[48px]" v-loading="medDetailloading">
             <div class="form p-[0_80px]">
                    <div class="flex justify-start items-center mb-20px line-height-22px">
                        <div class="w-95px text-right">药品编码：</div>
                        <div>{{ medDetailForm.code || "--" }}</div>
                    </div>
                     <div class="flex justify-start items-center mb-20px line-height-22px">
                        <div class="w-95px text-right">药品通用名：</div>
                        <div>{{ medDetailForm.general || "--" }}</div>
                    </div>
                     <div class="flex justify-start items-center mb-20px line-height-22px">
                        <div class="w-95px text-right">药品商用名：</div>
                        <div>{{ medDetailForm.business || "--" }}</div>
                    </div>
                     <div class="flex justify-start items-center mb-20px">
                            <div class="w-95px text-right">药品类型：</div>
                            <el-select v-model="medDetailForm.medtype" size="large" placeholder="请选择" class="w-[260px]">
                                   <el-option v-for="(item,index) in medTypes" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                </div>
             </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="medDetailCloseHand()">取消</el-button>
                <el-button size="large" type="primary" @click="medDetailSubmit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>


      <custom-dialog v-model="delConfirm" append-to-body class="_loading" title="删除药品"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center" v-loading="delLoading">
               是否删除该药品?
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="closeDelConfirm()">取消</el-button>
                <el-button size="large" type="primary" @click="delBedSubmit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>

    </div>
</template>

<script setup lang='ts'>
import type {  Pagination } from '@/interface/interface';
import { onMounted, reactive, ref, shallowRef,nextTick} from 'vue';
import PatientApi from '@/api/patient';
import { useModal } from '@/hooks/useModal';
import { ElMessage } from 'element-plus';
import MedicineApi from '@/api/medicine';
import { deepClone } from '@/utils/function/function';
const useMed = ()=>{
      return useModal({
         formInit:{
            addName:""
         },
         beforeSubmit:(form)=>{
             if(mockCurrentList.value.length<=0){
                ElMessage.error("请先添加药品");
                return false
             }
         },
         submitApi:()=>MedicineApi.addMedicineCate({}).then().catch((err)=>{
             
         }),
      })
};
// 药品类型管理
const isEdit = ref(false);
const mockCurrentList = ref<any[]>([]); // 列表数据

const {form:medForm,show:medShow,close:medClose,visible:medVisible,submit:medSubmit} = useMed();

let dels = ref<any[]>([]);
const handleDelChange = (i:number)=>{
   let item = mockCurrentList.value[i];
      dels.value.push(item);
     mockCurrentList.value.splice(i,1);
     
}


const medDetailSetFormHand = (item:any)=>{
    let obj = {
        ...item,
        medtype:medTypes.value.find((i:any)=>i.label===item.cate_name)?.value
    }
    medDetailSetForm(obj);
}


const medIcineLoading = ref(false);
const saveDel = async ()=>{
    medIcineLoading.value = true;
     const result = (await MedicineApi.getMedicineCateList()).data.result;
     if(result && result.length>0){
         let _dels:any[] = [];
          console.log(result,dels.value)
         result.forEach((item:any)=>{
            let _item = dels.value.find((i:any)=>i.label==item.cate_name);
             if(_item){
                 _dels.push(item.cate_id);
             }
         });
         MedicineApi.deleteMedicineCate({cate_id:_dels}).then(res=>{
            ElMessage({
                message: '保存成功',
                type: 'success',
                duration: 3000,
            });
            getMedTypes();
            dels.value = [];
            medIcineLoading.value = false;
            isEdit.value=false;
        }).catch(err=>{
            medIcineLoading.value = false;
             isEdit.value=false;
        })
     }
      medIcineLoading.value = false;
       isEdit.value=false;
    
}
// 药品信息
const useMedDetail = ()=>{
      return useModal({
         formInit:{
            medtype:""
         },
         submitApi:(form)=>MedicineApi.editMedicine({cate_id:form.medtype,detail_id:form.detail_id}),
         afterSubmit:()=>{
             fetchData()
         }
      })
};
const {loading:medDetailloading,form:medDetailForm,show:medDetailShow,close:medDetailClose,setForm:medDetailSetForm,visible:medDetailVisible,submit:medDetailSubmit} = useMedDetail();

const medDetailCloseHand = ()=>{
    medDetailForm.value = {};
      medDetailClose();
};


// 删除药品
const useDelMed = () => {
  return useModal({
    formInit: {
      medId:""  
    },
    submitApi: (form) => MedicineApi.deleteMedicine({
      detail_id: form.detail_id
    }),
    afterSubmit:()=>{
        fetchData();   
    }
  });
};
const {
  visible: delConfirm,
  loading: delLoading,
  setForm: medDelSetForm,
  show: showDelConfirm,
  close: closeDelConfirm,
  submit: delBedSubmit
} = useDelMed();
 




// 搜索
const search_form = reactive({
    code:"",
    medicine:"",
    cate_id:""

})

const search = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    fetchData()
}
 
const reset = () => {
    pageQuery.page = 1
    pageQuery.perPage = 10
    search_form.code = ''
    search_form.medicine = ''
    search_form.cate_id = "";
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

const fetchData = async () => {
   tableLoading.value = true
    let data = {
        page: pageQuery.page,
        perPage: pageQuery.perPage,
        code: search_form.code,
        medicine: search_form.medicine,
        cate_id: search_form.cate_id
    }
      const result = (await MedicineApi.getMedicineList(data))?.data?.result;
    if (result) {
        pageQuery.total = result.total
        tableData.value = result.data
    }
    tableLoading.value = false;
}

const medTypes = ref<any[]>([])
const getMedTypes = async () => {
      const result = (await MedicineApi.getMedicineCateList()).data.result
    if (result) {
        medTypes.value = result.map((item:any)=>{
             return {
                 label: item.cate_name,
                 value: item.cate_id,
                 showDel:item.del==1
             }
        });
        mockCurrentList.value = deepClone(medTypes.value);
    }else{
        medTypes.value = [];
        mockCurrentList.value = []
    }
}
const cancelDel = ()=>{
    mockCurrentList.value = deepClone(medTypes.value); ;
    isEdit.value=false;
}

const addTag = ()=>{
     if(isEdit.value){
         ElMessage.error({
             message: '请先保存编辑内容',
            type: 'error'
         });
         return 
     }
     if(!(medForm.value.addName)){
        ElMessage({
            message: '请输入药品类型',
            type: 'error',
        });
        return;
     }
     if(medTypes.value.some(item=>item.label.trim()===medForm.value.addName.trim())){
        ElMessage({
            message: '药品类型已存在',
            type: 'error',
        });
        return;
     }
       medTypes.value.push({
         label:medForm.value.addName.trim(),
         value:new Date().getTime(),
         showDel:true
     })
     mockCurrentList.value.push({
         label:medForm.value.addName.trim(),
         value:new Date().getTime(),
         showDel:true
     });
     let _s = medForm.value.addName;
   
      ElMessage({
            message: '添加成功',
            type: 'success',
            duration: 3000,
        });
      medForm.value.addName = "";
     MedicineApi.addMedicineCate({cate_name:_s}).then(res=>{
        
     })
}

const showEdit = ()=>{
    nextTick(()=>{
        dels.value = [];
      isEdit.value=true;
    })
      
}


let tipShow = ref(false);
const closeMed = (done: () => void)=>{
    if(isEdit.value){
       tipShow.value = true;
    
       setTimeout(()=>{
            tipShow.value = false;
       },3000)
       return
    }
    done()
    //  medVisible.value = false;
}
onMounted(()=>{
    tableLoading.value = true
     Promise.all([fetchData(),getMedTypes()]).then(() => {
         tableLoading.value = false
     }).catch((error) => {
         tableLoading.value = false
     })
})



</script>

<style scoped>
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

.abcenter{
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     z-index: 999;
     background-color: #F08B2E;
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
.mh-100px{
    min-height: 200px;
}
.maxheight-300px{
    max-height: 300px;
}
</style>