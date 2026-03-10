import { defineStore } from "pinia";
import { ref } from "vue";

export const useSetwsStore = defineStore('setws', () => {
    let ws = ref({});

    const savews = (w: any) => {
        ws.value = w
    }
    return {
        savews,
        ws
    }


})