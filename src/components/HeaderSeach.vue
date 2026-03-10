<template>
    <div class="h-80px line-height-80px boxHeader flex flex-start items-center bg-[#fff] pl-16px">
            <div class="line-height-24px flex justify-start items-center"> 
                <span class="color-[#384951] mr-12px font-bold text-24px">{{paientInfo.bed_number }}床</span>
                <span class="color-[#384951] mr-12px font-bold text-24px">{{paientInfo.name }}</span>
                <span class="color-[#384951] mr-24px font-bold text-24px">CCID:{{paientInfo.ccid ? paientInfo.ccid.substring(paientInfo.ccid.length - 5)  : '--'}}</span>
            </div>
            <div class="datepicker line-height-48px">
                <el-date-picker size="large"
                :cell-class-name="()=>'custom_date_cell'"
                v-model="reportDate" type="date" placeholder="选择日期"  
                :prefix-icon="customPrefix"
                class="customPrefix"
                @change="fetchData" :clearable="false"></el-date-picker>
            </div>
           
        </div>
</template>

<script setup lang="ts">
    import { computed, ref, type Ref,type ComputedRef ,shallowRef,h} from "vue"
    import type { PatientInfoType,watchType } from "@/views/index/types/index";
    import { getRem,getAssetsFileV4 } from "@/utils/function/function";
import { dateFtt } from "@/utils/date/dateFtt";
import {usePaientInfo } from "@/stores/paientinfo";
const { paientInfo } = usePaientInfo();

    const emits = defineEmits(["selectDate","update:modelValue"]);

    type searchRow = Pick<PatientInfoType,'bedNumber'|'name'> & Pick<watchType,'ccid'>;
     
    const props = withDefaults(defineProps<{row?:searchRow,modelValue:string, yesterday?:boolean}>(),{
        row:()=>({
          bedNumber:"--",
          name:"--",
          ccid:"--"
        }),
        modelValue:"",
        yesterday:false
    });

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


// export type ComputedGetter<T> = (oldValue?: T) => T;
// export type ComputedSetter<T> = (newValue: T) => void;
// export interface WritableComputedOptions<T, S = T> {
//     get: ComputedGetter<T>;
//     set: ComputedSetter<S>;
// }
    //  (oldValue?: T) => T;
    const reportDate:ComputedRef<string> = computed({
        get:()=>{
           if(props.yesterday && !props.modelValue){
           
             let n =  dateFtt('yyyy-mm-dd',new Date(new Date().getTime() - 24*60*60*1000));
                emits("update:modelValue",n);
              //  emits("selectDate",n);
               return n
           }
           return props.modelValue;
        },
        set:(value:string)=>{
         
            let d = dateFtt('yyyy-mm-dd',value);
            emits("update:modelValue",d);
            return value;
        }
    });


    function fetchData(e:string){
        let d = dateFtt('yyyy-mm-dd',e);
        emits("selectDate",e);
    }

     
</script>

<style>
    .boxHeader{
        box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16);
        border-radius: 12px 12px 12px 12px;
        border: 1px solid #EEEEEE;
    }
</style>