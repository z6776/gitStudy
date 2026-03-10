import { defineStore } from "pinia";


export const useWarningStore = defineStore('warning', () => {
    let warningCount = 0

    const increment = () => {
        warningCount++
    }
    return {
        warningCount,
        increment
    }


})
