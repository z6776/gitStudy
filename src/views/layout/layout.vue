<template>
    <div class="layout">
        <baseHeader />
        <div class="layout-content">
             <router-view />
        </div>
        <baseMenu />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.layout{
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
    .layout-content{
        width: 100vw;
        overflow-x: hidden;
        height: calc(100vh - 128px);
        overflow-y: auto;
        
    }
     /* 滚动条整体宽度 */
    ::-webkit-scrollbar {
      width: 4px;
      height: 545px;
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
border-radius: 8px 8px 8px 8px;
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
   
}
</style>