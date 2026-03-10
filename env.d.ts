/// <reference types="vite/client" />


declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const componentOptions: ComponentOptions;
  export default componentOptions;
}

declare module "nprogress" {
    const nprogress: any;
    export default nprogress;
}

declare module "unocss"{
  const unocss: any;
  export default unocss;
}


// Electron API 类型定义
interface ElectronAPI {
    sendPrint(html: string): void;
}

// 扩展全局 Window 接口
interface Window {
    electron?: ElectronAPI;
}

declare namespace NodeJS {
    type Timeout = any;
}

declare module 'js-md5' {
    export const Md5: (str: string) => string;
}

declare module 'js-cookie' {
    export const get: (str: string) => string;
    export const remove: (str: string) => void;
}

