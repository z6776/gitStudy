import { defineStore } from "pinia";
import { ref } from "vue";

export const useZoomStore = defineStore('zoom', () => {
    type admin = {
        name:string,
        zone_number:string
    }
    let _admin = localStorage.getItem("admin") === null ? {
        name:"",
        zone_number:""
    } : JSON.parse(localStorage.getItem("admin") as string)  
    let zoom = ref<admin>(_admin);

    const createZoom = (createZoom:any) => {
           zoom.value = createZoom
    }
    return {
        zoom,
        createZoom
    }
})