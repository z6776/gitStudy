<template>
  <div class='contentdisease border border-[#EEEEEE] border-solid p-[24px] rounded-12px'>
    <empty v-if="list.length==0" />
     <TabList :list="list" disabled :column="10" v-else/>
  </div>
</template>
<script setup>
     import { ref,onMounted } from "vue";
    const props = defineProps({
       list:{
          type: Array,
           default: ()=>[]
       }
    });
    onMounted(()=>{})
</script>
<style scoped>
    .contentdisease{
         background-color: #fff;
         
    }
</style>