<template>
  <div class='bloodlipids flex-1'>
        <p class="card-title">血脂监测分析</p>
        <div class="h-15vh color-[#636676] text16cus flex justify-center items-center">
            暂无分析数据
        </div>
  </div>
</template>
<script setup>
</script>
<style scoped>
.bloodlipids {
  border-radius: 8px;
  border: 1px solid #EEEEEE;
  background-color: #fff;
  box-shadow: 0 8px 24px 0 rgba(146, 159, 175, 0.16);
  padding:calc(20 / 1080 * 100vh) calc(24 / 1920 * 100vw);
  height:calc(278 / 1080 * 100vh);
}
.card-title {
 font-size: calc(18 / 1080 * 100vh);
    font-weight: bold;
    color: #384951;
     margin-bottom:calc(20 / 1080 * 100vh); 
}
.text16cus{
    font-size: calc(16 / 1080 * 100vh);
    font-weight: 400;
    color: #636676;
}
</style>