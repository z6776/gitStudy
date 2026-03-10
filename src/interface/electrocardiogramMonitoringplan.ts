

export interface electrocardiogramMonitoringplan {
    id: number;// 监测
    name: string;// 姓名
    ccid:string;
    bedNumber: string;// 床位号
    status: openModeEcg;// 状态
}

export enum openModeEcg {
    OPEN=1,
    CLOSE=0
} 