
// 康复训练计划
export interface rehabilitationTrainingplan {
     id: number; // 主键
    index: number;  // 序号
    name: string;// 姓名
    ccid:string;
    bedNumber: string;// 床位号
    todayStep: number;// 今日步数（步）
    totalStep: string;// 训练达成情况
    planStep: number;// 训练计划（步）
    ischecked?: boolean;// 是否已完成
    updateplanStep?: number | undefined;// 修改 或者新增的步数
}

// 呼吸训练
export interface breathingTraining {
    id: number; // 主键
    index: number;  // 序号
    name: string;// 姓名
    bedNumber: string;// 床位号
    trainingTime: string;// 训练时间
    trainingMode: string;// 训练模式
    trainingDuration: number;// 训练时长（分钟）
    heartRateBeforeTraining: number;// 训练前心率（次/分）
    heartRateAfterTraining: number;// 训练后心率（次/分）
}

