
// 康复训练计划
export interface bloodpressuremonitoringplan {
    id: number;// 监测
    name: string;// 姓名
    ccid:string;
    bedNumber: string;// 床位号
    status: openMode;// 状态
    isSleepOpen:boolean;// 是否睡眠监测
    airbagBlood:number;// 时间段
}

export enum openMode {
    QH=1,   
    TID=2,
    noOpen=0
}

export enum dialogTitleEnum {
    QHTITLE='QH监测模式',   
    TIDTITLE='TID监测模式',
}