export interface fallAlarmRecord {
    index: number;
    id: number;
    name: string;
    bedNumber: string;
    mode: string;
    startTime: string;
    warningTime: string;
    remark: string;
    status:boolean;
}

export interface alarmManagement {
    index: number;
    id: number;
    patientName: string;
    bedNumber: string;
    deviceCcid: string;
    fenceStatus: fenceStatusEnum;
    crossFenceTime: string;
    currentLocation: string;
    handleStatus: handleStatusEnum;
    remark?: string;
}

 export enum fenceStatusEnum {
    OPEN = '开启',
    CLOSE = '关闭'
 }

 export enum handleStatusEnum {
    ISEND = 1,  // 已处理
    NOTEND = 0   // 未处理
 }
