import { defineStore } from "pinia";
import { ref } from "vue";

export const useTopNums = defineStore('setTopNums', () => {
    type topNumsType = {
        "warn_count": number,
        "bat_count": number,
        "wear_count": number,
        "fall_count": number,
        "fence_count": number,
        "sos_count": number
    }
    type key = keyof topNumsType;
    let topNums = ref<Partial<topNumsType>>({});
    const saveTopNums = (w: any) => {
        topNums.value = w
    }
     const jianTopNums = (type: key) => {
        if (topNums.value[type] && topNums.value[type] > 0) {
            topNums.value[type] = (Number(topNums.value[type]) - 1).toFixed(0) as any;
        }
    }
    const clear=()=>{
       topNums.value = {}
    }
    return {
        jianTopNums,
        saveTopNums,
        topNums,
        clear
    }
})