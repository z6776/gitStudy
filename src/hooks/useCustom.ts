 
 import { shallowRef,h } from "vue"
 import { getAssetsFileV4,getRem } from "@/utils/function/function"
 export const useCustom = () => {
     const customPrefix = shallowRef({
  render() {
    return h('img', {
      src: getAssetsFileV4('date.png'),  // 替换为你的图片路径
      style: {
        width:getRem(28)+'px',  // 设置合适的宽度
        height:getRem(28)+ 'px', // 设置合适的高度
        
      }
    })
  },
});
     return {
         customPrefix
     }
     
 }
