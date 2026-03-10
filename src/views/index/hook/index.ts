import { ref } from "vue";
// 添加标签弹窗
export const useTagDialog = () => {
    const tagDialog = ref(false);
    const settagDialog = (b:boolean)=>{
        tagDialog.value = b;
    }
    return {
        tagDialog,
        settagDialog
    }
}

// 所有事件的弹窗
export const useTagDialogAll = () => {
    const tagDialogVislble = ref(false);
    const settagDialogAll = (b:boolean)=>{
        tagDialogVislble.value = b;
    }
    return {
        tagDialogVislble,
        settagDialogAll
    }
}



// 绑定设备的弹窗
export const usebindWatchVislble = () => {
    const bindWatchVislble = ref(false);
    const setbindWatchVislble = (b:boolean)=>{
        bindWatchVislble.value = b;
    }
    return {
        bindWatchVislble,
        setbindWatchVislble
    }
}


// 选择多种标签
export const useSelectTag = () => {
    const selectList = ref<any[]>([]);
    const setSelectList = (b:any[])=>{
        selectList.value = b;
    }
    return {
        selectList,
        setSelectList
    }
}


// 添加事件的弹窗
export const useAddEvent = () => {
    const AddEventVislble = ref(false);
    const settAddEventVislble = (b:boolean)=>{
        AddEventVislble.value = b;
    }
    return {
        AddEventVislble,
        settAddEventVislble
    }
}
 
export const usesugerDailogVisible = () => {
    const sugerDailogVisible = ref(false);
    const setsugerDailogVisible = (b:boolean)=>{
        sugerDailogVisible.value = b;
    }
    return {
        sugerDailogVisible,
        setsugerDailogVisible
    }
}



// 当前选择的人

export const useCurrentPatient = () => {
    const CurrentPatientID = ref(0);
    const setCurrentPatient = (b:number)=>{
        CurrentPatientID.value = b;
    }
    return {
        CurrentPatientID,
        setCurrentPatient
    }
}


 

export const useLoading = () => {
    const Loading = ref(false);
    const setLoading= (b:boolean)=>{
        Loading.value = b;
    }
    return {
        Loading,
        setLoading
    }
}



