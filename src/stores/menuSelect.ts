import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 
export const useMenuSelect = defineStore('menuSelect', () => {
  const currentMenu = ref('index');
  function changeCurrentMenu(value:any) {
    currentMenu.value = value;
  }
  const currentChildMenu = ref("");
function changeCurrentChildMenu(value:any) {
    currentChildMenu.value = value;
  }
  return { currentMenu, changeCurrentMenu,currentChildMenu,changeCurrentChildMenu }
});


