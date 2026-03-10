<template>
  <div class='device'>
      <div class="flex justify-start gap-8px pl-24px pt-24px">
          <span class="color-[#636676] text-[24px] cursor-pointer" :class="{'active':current==1}" @click="current=1">穿戴监护</span>
          <span class="color-[#636676] text-[24px]">/</span>
          <span class="color-[#636676] text-[24px] cursor-pointer" :class="{'active':current==2}" @click="current=2">血糖监护</span>
      </div>

      <component :is='componentId'></component>
  </div>
</template>
<script setup lang="ts">
    import { ref,computed } from 'vue';
    import WardWear from './device.vue';
    import WardBlood from './sugerDevice.vue';
    const current = ref(1)
    const componentId = computed(() => {
        return current.value == 1 ? WardWear : WardBlood;
    });
</script>
<style scoped>
    .active{
        font-size: 24px;
        color: #24B287;
        font-weight: bold;
    }
</style>