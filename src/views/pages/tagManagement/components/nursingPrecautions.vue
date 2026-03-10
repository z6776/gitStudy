<template>
   <div class="p-[20px] bg-[#fff]  rounded-12px">
      <div class="eventItem" v-for="(value, index) in list" :key="index">
           <div class="title flex items-center justify-start">
              <img :src="value.icon" class="w-40px h-40px" alt="" />
              <span class="color-[#384951] text-[24px] ml-12px">{{ value.title }}</span>
           </div>


           <div  v-for="(child, j) in value.list" :key="j">
           <div class="pt-24px color-[#384951] text-[18px] font-bold flex items-center justify-start line-height-28px mb-24px">
                <span>{{ child.name }}</span>
                <span class="text-18px   mr-12px ml-12px block w-28px h-28px text-center" v-if="child.simple"
                :style="styleSimple(child.color)"
                >{{ child.simple }}</span>
                <div class="w-28px h-28px flex justify-center items-center bg-[#24B287]  cursor-pointer rounded-4px" @click="editTagFn(value,child)">
                  <img src="@/assets/images/V2/editicon.png" alt="" class="w-20px h-20px cursor-pointer" />
                </div>
           </div>
            <div class="grid-box">
                <div v-for="(sun,s) in  child.tag_list"
                :key="s"
         
                class="w-160px h-40px line-height-40px cursor-pointer flex items-center justify-center bg-[#F5F7FB] rounded-[8px] text-center text-[16px] text-[#636676] border-1 border-solid border-[#F5F7FB]"
 :class="{'selectActive':isComMon(sun)}"
                > 
                <img src="@/assets/images/V2/gougou.png" class="w-20px h-20px" v-if="isComMon(sun)" />  
                 {{ sun.tag }}
                </div>
                 </div>
          </div>
      </div>
      </div>
</template>
<script setup lang="ts">
    import {ref} from "vue";    
 const typeIndex = ref(-1);
 const selectType = (i:number)=>{
       typeIndex.value = i;
 }


  const props = defineProps<{list:any[],commonlist:any[]}>(); ;

 const emits = defineEmits(["editTag"]);

 const editTagFn = (value:any,child:any)=>{
       emits("editTag",value,child)
 }


  const isComMon = (item:any)=>{
     let arr = Array.isArray(props.commonlist) ? props.commonlist : [];
     return arr.some((i:any)=>i.value == item.tag_id && i.selected)
  }

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

  
</script>
<style scoped>
      .title{
    padding-bottom: 24px;
    border-bottom: 1px solid #EEEEEE;
  }

  .grid-box{
     display: grid;
     grid-template-columns: repeat(10,1fr);
     gap: 20px;
  }

  .eventItem{
    /* width: calc(100vw - 48px); */
    background: #FFFFFF;
    border-radius: 12px 12px 12px 12px;
    border: 1px solid #EEEEEE;
    margin-bottom: 20px;
    padding: 24px;
  }
    .selectActive{
        background-color: #EAFFF9;
        color:#24B287;
        border: 1px solid #24B287;
    }

</style>