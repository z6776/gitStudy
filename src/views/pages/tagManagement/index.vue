<template>
  <div class='tagManagement p-[20px]'>
          <header class="header" >
        <div class="control_box" :class="{ 'bg-[transparent]!': active_control_button_isend===3 }">
          <div class="statubox flex">
              <div v-for="value in statusBox" class="p-[10px_12px] color-[#636676] text-[14px] cursor-pointer" :class="{'bg-[#24B287]! color-[#ffffff]!':active_control_button_isend==value.id}" @click="searchList(value.id)">
                {{  value.name }}
              </div>
          </div>
       
             <div class="p-[10px_12px] h-42px bg-[#24B287] ml-auto rounded-8px flex justify-center items-center cursor-pointer gap-4px hover:opacity-80 flex-shrink-0"
                v-if="active_control_button_isend===1"
                @click="setuseDialogVisible(true)"
                >
              <img src="@/assets/images/V2/offen.png" alt="" class="w-28px h-28px">
              <span class="color-[#FFFFFF] text-[16px]">设置常用标签</span>
            </div>

            <div class="p-[10px_12px] h-42px bg-[#24B287] ml-auto rounded-8px flex justify-center items-center cursor-pointer gap-4px hover:opacity-80 flex-shrink-0"
                v-if="active_control_button_isend===3"
                @click="bcSetFormfn(),bcShow()"
                >
              <img src="@/assets/images/V2/offen.png" alt="" class="w-28px h-28px">
              <span class="color-[#FFFFFF] text-[16px]">病症标签管理</span>
            </div>

             <div class="p-[10px_12px] h-42px bg-[#24B287] ml-auto rounded-8px flex justify-center items-center cursor-pointer gap-4px hover:opacity-80 flex-shrink-0"
                v-if="active_control_button_isend===4"
                @click="bcSetFormfn(),bcShow()"
                >
              <img src="@/assets/images/V2/offen.png" alt="" class="w-28px h-28px">
              <span class="color-[#FFFFFF] text-[16px]">病症节点管理</span>
            </div>
        </div>
     
      </header>
      <component :is="componentId" @editTag="editTag" :list="listFn"  v-loading="loading" :commonlist="copyTabdata"></component>

        <custom-dialog v-model="dialogVisible" append-to-body class="_loading" title="设置常用标签"
        :width="`${(1000 / 1920) * 100}%`" top="15vh">
        <div class="p-[24px] ">
               <div class="line-height-18px flex flex-start mb-20px">
                  <span class="color-[#384951] text-[18px] font-bold mr-[10px]">常用标签</span>
                  <span class="color-[#929FAF] tetx-[14px]">点击标签选中可设为常用标签</span>
               </div>
               <div class="h-426px overflow-y-auto">
                  <!-- <empty v-if="tabdata.length===0" /> -->
                 <TabList
                    type="multiple"
                    :column="5"
                    :list="tabdata"
                    @change="handleMultipleChange"
                  />  
                
               </div> 
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="setuseDialogVisible(false)">取消</el-button>
                <el-button size="large" type="primary" @click="settingSubmit">确定</el-button>
            </div>
        </template>
    </custom-dialog>

     <custom-dialog v-model="WarningVisible" append-to-body class="_loading" title="提示"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center">
              所有常用标签总计上限为10条，请删除部分标签后继续添加。
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="setWarningVisible(false),setuseDialogVisible(true)">取消</el-button>
                <el-button size="large" type="primary" @click="setWarningVisible(false),setuseDialogVisible(true)">确定</el-button>
            </div>
        </template>
    </custom-dialog>


      <custom-dialog v-model="jdVisible" append-to-body class="_loading" title="提示"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div class="h-200px flex justify-center items-center">
             节点已达上限，最高设置20条。
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="primary" @click="jdclose(),bcShow()">确定</el-button>
            </div>
        </template>
    </custom-dialog>
    

       <custom-dialog v-model="bcVislble" append-to-body class="_loading" :title="active_control_button_isend ===3 ? '病程标签管理' : '病程节点管理'"
        :width="`${(640 / 1920) * 100}%`" top="15vh">
        <div id="bcjd" class="h-528px  flex flex-col justify-start items-center p-[24px] overflow-auto" v-loading="bcLoading">
          <empty v-if="bcForm?.list?.length === 0" />
            <div v-else class="flex items-center gap-10px p-[10px_0px] border border-b-[#EEEEEE] border-b-solid" v-for="(item,index) in bcForm.list" :key="index">
                <el-input v-model.trim="item.label" placeholder="请输入内容" class="w-426px"/>
                <img src="@/assets/images/V3/button_close.png" alt=""
                @click="deleteLine(index as number)" class="w-20px h-20px ml-40px cursor-pointer"
                v-if="!item.default"
                />
                <div v-else class="ml-40px w-20px h-20px"></div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
               <el-button size="large" type="primary" color="#0477E0" @click="addlineData()">新增</el-button>
                <el-button size="large" type="primary" color="#24B287" @click="bcSubmit()" class="text-[#fff]!">保存</el-button>
            </div>
        </template>
    </custom-dialog>

 



    <custom-dialog v-model="editVisible" append-to-body class="_loading" title="过敏源标签编辑"
        :width="`${(1000 / 1920) * 100}%`" top="10vh">
         <div class="p-[24px] ">
               <div class="line-height-18px flex flex-start mb-10px">
                  <span class="color-[#384951] text-[18px] font-bold mr-[10px]">标签类型名称</span>
               </div>
                <div class="line-height-18px flex flex-start mb-20px items-center">
                  <span class="color-[#636676] text-[16px]  mr-[10px]">全称：</span>
                  <el-input placeholder="请输入" v-model="formTag.fullName" class="w-260px mr-20px"  maxlength="10"></el-input>
                  <template v-if="active_control_button_isend == 2">
                         <span class="color-[#636676] text-[16px]  mr-[10px]">首页简称：</span>
                         <el-input  v-model="formTag.janeName" class="w-48px" maxlength="1"></el-input>
                  </template>
               </div>
                <div class="line-height-18px flex flex-start mb-10px" >
                  <span class="color-[#384951] text-[18px] font-bold mr-[10px]">添加标签</span>
               </div>
                <div class="line-height-18px flex flex-start mb-20px">
                  <el-input placeholder="请输入" v-model="formTag.addName" class="w-260px mr-20px" maxlength="8"></el-input>
                  <el-button size="large" type="primary" class="w-150px" @click="addTag()">添加新标签</el-button>
               </div>
                <div class="line-height-18px flex flex-start mb-0px">
                  <span class="color-[#384951] text-[18px] font-bold mr-[10px]">当前标签</span>
               </div>
              <div class="maxheight-86px overflow-y-auto overflow-x-hidden pt-10px pr-20px pb-10px mb-10px">
                  <TabList
                      type="del"
                      :column="5"
                      :list="mockCurrentList"
                      @del="handleDelChange"
                    />  
                </div>
                  <template v-if="active_control_button_isend == 2">
                  <div class="line-height-18px flex flex-start mb-20px">
                      <span class="color-[#384951] text-[18px] font-bold mr-[10px]">标签颜色选择</span>
                  </div>

                <div class="flex flex-start gap-25px">
                    <div v-for="(item,index) in colors" :style="{'backgroundColor':item.bg,'color':item.color}" class="text-[16px] relative w-48px h-48px rounded-50% flex items-center justify-center cursor-pointer" :key="index" @click="handleColorChange(item)">
                          {{ formTag.janeName || '敏' }}
                          <div class="absolute inset-0 w-48px h-48px rounded-50% flex items-center justify-center cursor-pointer bg-[#0477E0]" v-if="item.bg+'-'+item.color == formTag.color">
                              <img src="@/assets/images/V2/gougou2.png" alt="" class="w-18px h-12px rounded-50%">
                          </div>
                    </div>
                </div>
               </template> 
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="seteditVisible(false)">取消</el-button>
                <el-button size="large" type="primary" @click="editTagSubmit()">确定</el-button>
            </div>
        </template>
    </custom-dialog>

    

  </div>
</template>
<script setup lang="ts">
  import { ref ,computed,onMounted ,nextTick} from "vue";
  import  nursingEvents from "./components/nursingEvents.vue";
  import nursingPrecautions from "./components/nursingPrecautions.vue";
  import drugAdministration from "./components/drugAdministration.vue"
  import diseaseManagement from "./components/diseaseManagement.vue"
  import type { TagType } from "@/interface/interface";
  import type {tagTypeForm } from "./types/index";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { deepClone, getComMonAssetsV2 } from "@/utils/function/function";
  import CareApi from "@/api/care";
  import DiseaseApi from "@/api/desease";
      import { useModal } from '@/hooks/useModal';
 
  const active_control_button_isend = ref(1);

let delsDease = ref<any[]>([]);
 const componentId = computed(()=>{
     if(active_control_button_isend.value===1){
         return nursingEvents
     }else if(active_control_button_isend.value===2){
         return nursingPrecautions
     }else if(active_control_button_isend.value===3){
         return diseaseManagement
     }else if(active_control_button_isend.value===4){
         return diseaseManagement
     }
 });


 const deleteLine = (index:number)=>{
   if(bcForm.value.list[index].value){
            delsDease.value.push(bcForm.value.list[index].value)
     }
     bcForm.value.list.splice(index,1);
    
 }
const addlineData = ()=>{
    if(active_control_button_isend.value===4 && bcForm.value.list.length>=20){
       bcClose();
        jdshow();
        return;
    }
     bcForm.value.list.push({label:""});
     nextTick(()=>{
       scrollToBottom();
     })
    
} 
const scrollToBottom = ()=> {
      // 获取容器元素
      const container =  document.getElementById("bcjd") as HTMLElement;
      container.scrollTop = container.scrollHeight;
    }
  
const lineDatajd = ref<any[]>([{name:"气胸"}]);
  
 const deletejdLine = (index:number)=>{
     lineDatajd.value.splice(index,1)
  
 }
 const useJd= () => {
      return useModal({
          formInit:{
            list:<any[]>[]
          },
          submitApi: ()=>Promise.resolve({code:200,message:"操作成功"}),
          
      });
  };
  const {
    visible: jdVisible, 
    show:jdshow,
    close:jdclose,
  } = useJd()

  const useBc= () => {
      return useModal({
          formInit:{
            list:<any[]>[]
          },
          beforeSubmit: (form) => {
               let flag =  form?.list.some((item:any)=>!item.label);
               if(flag && form?.list.length>0){
                  ElMessage.error("请完善表单");
                    return false;    
               }
               return true;
          },
          submitApi: savelineData,
          afterSubmit: () => {
          }
      });
  };

  
    const savelineData = async ()=>{
       try {
         
        let add:any[] = [];
        let edit:any[] = [];
        if(Array.isArray(bcForm.value.list) && bcForm.value.list.length > 0){
            bcForm.value.list.forEach((item:any)=>{
               if(!item.value){
                   add.push(item.label);
               }
               if(item.value){
                edit.push({
                    id:item.value,
                    name:item.label
                });
               }
            })
        }
        // bcForm.value.list;
         if(active_control_button_isend.value===3){
           await DiseaseApi.delTag({
                id:delsDease.value
           });
            await DiseaseApi.editTag({
                add,
                edit
           });
           refresh();
         }else{
           await DiseaseApi.delNode({
                id:delsDease.value
           });
          
             await DiseaseApi.editNode({
              add,
              edit
             });
                 refresh();
         }       
       } catch (error) {
          console.log(error,"123123")
       }
  
    }
    const {
    visible: bcVislble,
    loading: bcLoading,
    show: bcShow,
    setForm: bcSetForm,
    form: bcForm,
    close: bcClose,
    submit: bcSubmit
    } = useBc();

    const bcSetFormfn = ()=>{
      delsDease.value  = [];
      if(active_control_button_isend.value===3){
        bcSetForm({
        list:deepClone(list3.value) 
       });
       return 
      }
      bcSetForm({
        list:deepClone(list4.value) 
       });
       
    }

 


    

const statusBox = ref<any[]>([{
    id:1,
    name:"事件标签管理"
},{
    id:2,
    name:"注意事项管理"
},{
    id:3,
    name:"适应病症管理"
},{
    id:4,
    name:"病程节点管理"
}
])



 const tabdata = ref<TagType[]>([

]);

 const list = ref<any[]>([]);
 const list2 = ref<any[]>([]);
 const list3 = ref<any[]>([]);
  const list4 = ref<any[]>([]);
 
 const listFn = computed(()=>{
   if(  active_control_button_isend.value===1){
         return list.value
     }else if(active_control_button_isend.value===2){
         return list2.value
     }else if(active_control_button_isend.value===3){
         return list3.value
     }else if(active_control_button_isend.value===4){
         return list4.value
     }
 });

 const refresh = ()=>{
  getCommonList()
    if(active_control_button_isend.value===1){
         getData();
     }else if(active_control_button_isend.value===2){
         getData2();
     }else if(active_control_button_isend.value===3){
         getData3();
     }else if(active_control_button_isend.value===4){
         getData4();
     }
 }

 onMounted(()=>{
     getData();
   
     getCommonList()

    // for (let index = 0; index < 11; index++) {
    //   tabdata.value.push({
    //       value: index,
    //       label: `标签${index}`
    //     })
    // };
    // for (let index = 0; index < 10; index++) {
    //   mockCurrentList.value.push({
    //       value: index,
    //       label: `标签${index}`
    //     })
    // }
 });
   const searchList = (status:number) => {
     active_control_button_isend.value = status;
     if(status===2 && list2.value.length===0){
        getData2();
     }
     if(status===3 && list3.value.length===0){
        getData3();
     }
      if(status===4 && list4.value.length===0){
        getData4();
     }
     
 };

 const loading = ref(false);
 
   const getData4 = async ()=>{
  loading.value = true;
      try {
          let res = await DiseaseApi.getNodeList({});
          let _list = res?.data?.result;
          if(Array.isArray(_list) && _list.length>0){
            list4.value = _list.map(item=>{
              return {
                label:item.name,
                value:item.id,
                default:item.default===1
              }
            })
          }else{
             list4.value = []
          }
              loading.value = false;
      } catch (error) {
         list4.value = []
          loading.value = false;
      }
 }
  const getData3 = async ()=>{
  loading.value = true;
      try {
          let res = await DiseaseApi.getTagList({
          });
          let _list = res?.data?.result;
          if(Array.isArray(_list) && _list.length>0){
            list3.value = _list.map(item=>{
              return {
                label:item.name,
                value:item.id,
                default:item.default===1
              }
            })
          }else{
             list3.value = []
          }
              loading.value = false;
      } catch (error) {
         list3.value = []
          loading.value = false;
      }
 }

 const getData = async ()=>{
  loading.value = true;
      try {
          let res = await CareApi.getList({
              type:1
          });
          let _list = res?.data?.result;
          if(Array.isArray(_list) && _list.length>0){
            let _result = getListfn(_list)
            list.value = JSON.parse(JSON.stringify(_result))
          }else{
             list.value = []
          }
              loading.value = false;
      } catch (error) {
         list.value = []
          loading.value = false;
      }
 }

 
  const getData2 = async ()=>{
  loading.value = true;
      try {
          let res = await CareApi.getList({
              type:2
          });
          let _list = res?.data?.result;
          if(Array.isArray(_list) && _list.length>0){
            let _result = getListfn(_list)
            list2.value = JSON.parse(JSON.stringify(_result))
          }else{
             list2.value = []
          }
              loading.value = false;
      } catch (error) {
         list2.value = []
          loading.value = false;
      }
 }

  // 获取所有标签
 let copyTabdata = ref<any[]>([])
 const getCommonList = async ()=>{
      try {
          let res = await CareApi.getCommonList();
          let _list = res?.data?.result;
          if(Array.isArray(_list) && _list.length>0){
            tabdata.value = _list.map((item:any)=>{
               return{
                  value: item.tag_id,
                label: item.tag,
                selected: item.common===1
               }
            });
          }else{
             tabdata.value = []
          }
          copyTabdata.value = JSON.parse(JSON.stringify(tabdata.value)) 
      } catch (error) {
         tabdata.value = []
          loading.value = false;
      }
 }

// 

const getListfn = (_list:any)=>{
    let iconarr = ["3.png","hl.png","sh.png","yw.png","3.png","hl.png","sh.png","yw.png","3.png","hl.png","sh.png","yw.png"]
 let _r =   _list.map((item:any,index:number)=>{
              let childList = item.list;
              if(Array.isArray(childList) && childList.length>0){
                 childList = childList.map((item:any,index:number)=>{
                     let sunList = item.tag_list;
                     if(!(Array.isArray(sunList) && sunList.length>0)){
                      sunList = [];
                     }
                     return {
                        ...item,
                        tag_list:sunList
                     }
                 })
              }else{
                  childList = [];
              }
               return {
                ...item,
                list:childList,
                icon:getComMonAssetsV2(iconarr[index]!)
               }
            });
            return _r
}

  

//  多选选中的值：
let selected = ref<number[]>([])
  const handleMultipleChange = (values:number[]) => {
    let checked:boolean = values.length > 10;
     if(checked){
        setuseDialogVisible(false);
        setWarningVisible(true);
        let id = values[values.length-1];
        tabdata.value.forEach((item:any)=>{
            if(item.value == id){
                item.selected = false;
            }
        })
        return;
     }
    selected.value = [...values];
  }



 // 设置常用标签弹窗  
 const useSetting = ()=>{
    const dialogVisible = ref(false);
    const setuseDialogVisible = (b:boolean)=>{
        dialogVisible.value = b;
    }
    return {
        dialogVisible,
        setuseDialogVisible
    }
 }
 const { dialogVisible,setuseDialogVisible } = useSetting();


 // 提交设置
 const settingSubmit = async ()=>{
     let checked:boolean = selected.value.length > 10;
     if(checked){
        setuseDialogVisible(false);
        setWarningVisible(true);
        return;
     }
    //  API
      loading.value = true;
      try {
         setuseDialogVisible(false);
          let res = await CareApi.setCommon({
              tag_id:selected.value.join(",")
          });
          let _list = res?.data?.result;
          if(Array.isArray(_list) && _list.length>0){
            let _result = getListfn(_list)
            list.value = JSON.parse(JSON.stringify(_result))
          }else{
             list.value = []
          }
         
              
               ElMessage.success("设置成功");
               refresh()
                    loading.value = false;
      } catch (error) {
         list.value = []
          loading.value = false;
      }

 }


  // 过敏原标签提示
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


   // 编辑标签弹窗
 const useeditVisible = ()=>{
    const editVisible = ref(false);
    const seteditVisible = (b:boolean)=>{
        editVisible.value = b;
    }
    return {
        editVisible,
        seteditVisible
    }
 }
 const { editVisible,seteditVisible } = useeditVisible();


 

//  编辑表单
const formTag = ref<tagTypeForm>({
      fullName:"",
      janeName:"",
      currentList:[],
      color:""
});


const addTag = ()=>{
     //
     if(!formTag.value.addName){
        ElMessage({
            message: '标签名称不能为空',
            type: 'error',
        });
        return;
     }
     mockCurrentList.value.push({
         label:formTag.value.addName,
         value:mockCurrentList.value.length,
     });
     formTag.value.addName = "";
}
const editTagObj = ref<any>({
   parent:{},
   child:{}
});
const editTag = (parent:any,child:any)=>{
  if( active_control_button_isend.value===1){
     formTag.value = {
    fullName:child.name || "",
      janeName:"",
      currentList:child.tag_list || [],
      color:""
  }
    
  }else{
       formTag.value = {
      fullName:child.name || "",
      janeName:child.simple || "",
      currentList:child.tag_list || [],
      color:child.color || ""
  }

  }
 
  editTagObj.value.parent = parent;
  editTagObj.value.child = child;
  if(Array.isArray(child.tag_list) && child.tag_list.length > 0){
mockCurrentList.value = child.tag_list.map((item:any)=>{
      return {
          label:item.tag,
          value:item.tag_id,
          tag_id:item.tag_id
      }
})
  }else{
    mockCurrentList.value = [];
    dels.value = []
  }
    seteditVisible(true);
};

const editTagSubmit = async ()=>{
     if(!formTag.value.fullName){
        ElMessage({
            message: '请填写标签全称',
            type: 'error',
        });
        return;
     };
     if(!formTag.value.janeName && active_control_button_isend.value==2){
       ElMessage({
            message: '请填写首页简称',
            type: 'error',
        });
       return;
     }
     if(!formTag.value.color && active_control_button_isend.value==2){
       ElMessage({
            message: '请填写当前标签颜色',
            type: 'error',
        });
       return;
     }
     let adds = mockCurrentList.value.map((item:any)=>{
         if(!item.tag_id){
            return item.label
         }
     }).filter((item:any)=>item);
     try {
       ElMessage.success("编辑成功");
         seteditVisible(false);
        let res = await CareApi.edit({
          care_id:editTagObj.value.child.care_id,//	是	int	总标签id
          name:formTag.value.fullName,//	是	string	总标签名称
          add:adds,//	是	array	子标签名称，["酒精","光源"]
          del:dels.value,//	是	array	子标签id，[1,2]
          simple:formTag.value.janeName,//	否	string	总标签简称（仅护理注意事项时传值）
          color:formTag.value.color,//	否	string	简称显示的颜色（仅护理注意事项时此字段传值）red,orange,yellow,green,blue
          });
       
         
         
           refresh()
     } catch (error) {
      
     }
}

// 删除
const mockCurrentList = ref<TagType[]>([]);
const dels = ref<any[]>([]);
const handleDelChange = (i:number)=>{
   let item = mockCurrentList.value[i];
   if(item?.tag_id){
      dels.value.push(item?.tag_id)  
   }
     mockCurrentList.value.splice(i,1)
}


// 颜色
const colors = ref([{
  bg:"#FFEBEB",
  color:'#F7413D'
},{
  bg:"#FFF5EA",
  color:'#F08B2E'
},{
  bg:"#EAF4FE",
  color:'#0477E0'
},{
  bg:"#EAFFF9",
  color:'#24B287'
},{
  bg:"#EFEAFE",
  color:'#8F66FF'
}]);

const handleColorChange = (item:any)=>{
  formTag.value.color = item.bg+'-'+item.color;
}


</script>
<style scoped>
.statubox{
}
.statubox>div{
  height: 42px;
  border-bottom: 1px solid #24B287;
   border-top: 1px solid #24B287;
   background-color: #fff;
}
.statubox>div:not(:last-child){
    border-right: 1px solid #24B287;
}
.statubox>div:nth-child(1){
  border-radius: 8px 0 0 8px;
  border-left: 1px solid #24B287;
}
.statubox>div:nth-child(4){
  border-radius: 0 8px 8px 0px;
  border-right: 1px solid #24B287;
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

  /* 头部 */
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.control_box {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.control_button{
   cursor: pointer;
}
.active_control_button {
    color: #24B287;
}

</style>