import type { Timer } from "@/interface/interface";

export const myInterval = (fn: any, time: number, timer: Timer) => {//解决setInterval可能存在的内存溢出问题
    return function backFn() {
        if (timer.id) {
            clearTimeout(timer.id)
        }
        timer.id = setTimeout(() => {
            fn()
            backFn()
        }, time);
    }
}