import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 用户信息传参
export const usePaientInfo = defineStore('paientInfo', () => {
  const paientInfo = ref(JSON.parse(localStorage.getItem('paientInfo') || '{}'));
  function savePaientInfo(value:any) {
    localStorage.setItem('paientInfo', JSON.stringify(value));
    paientInfo.value = value;
  }

  return { paientInfo, savePaientInfo }
});


