import { ref } from 'vue';

export const useShowRightAside = () => {
    const showRightAside = ref(true);

    const toggleRightAside = (flag:boolean) => {
        showRightAside.value = flag;
    }

    return {
        showRightAside,
        toggleRightAside  
        }
}