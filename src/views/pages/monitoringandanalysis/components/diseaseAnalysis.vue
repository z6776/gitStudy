<template>
  <div class='diseaseAnalysis '>
     <p class="card-title">慢病分析</p>
    <empty msg="暂无分析数据" :custom-style="{ width: scaleByHeight(100)+'px', height: scaleByHeight(100)+'px',color: '#636676' }" />
  </div>
</template>

<script setup>
  import { scaleByHeight } from "@/utils/function/function" 
</script>
<style scoped>
.diseaseAnalysis {
       border-radius: 8px;
  border: 1px solid #EEEEEE;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding:calc(20 / 1024 * 100vh) calc(24 / 1920 * 100vw);
  height:calc(594 / 1024 * 100vh); 
}
.card-title {
    font-size: calc(18 / 1024 * 100vh);
    font-weight: bold;
    color: #384951;
    padding-bottom:calc(20 / 1024 * 100vh);
     margin-bottom:calc(20 / 1024 * 100vh);
}
</style>