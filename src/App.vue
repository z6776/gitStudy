<template>
  <el-config-provider namespace="ep" :locale="zhCn">
    <router-view> </router-view>
  </el-config-provider>
</template>
<script setup lang="ts">
import { zhCn } from 'element-plus/es/locales.mjs'
</script>
<style>
#app {
  min-height: 100vh;
  background: #f3f5f7;
}
</style>
