
    

    interface apicare_data {
           simple:string,
           data:{tag:string, color: string,title: string, name: string, simple: string}[]
    }
    export type apiIndexItemType = {
          id: number;
          sex: 1 | 2; // 性别：1-男，2-女
          bed_id:number,
          patient_num: string;
          birthday: string;
          name: string;
          level_of_care: 1 | 2 | 3 | 4; // 护理等级：1-一级，2-二级，3-三级，4-特级
          ccid: string;
          model: string;
          spo2: number; // 血氧
          heartrate: number; // 心率
          body: string; // 体温
          dbp: number; // 低压
          sbp: number; // 高压
          calc_data:string; //血糖值
          bat: number; // 电量
          bed_number: string;
          situation: 1 | 2 | 3; // 1-一般，2-病危，3-病重
          xt_id: number; // 血糖id
          xt_ccid: string; // 血糖ccid
          xt_bind_time: number; // 血糖设备绑定时间
          bind_time: number; // 手表绑定时间
          disease_node:any[]; // 病程列表
          bulletin_board:any,
          care_data:apicare_data[]
          patient_event?:{name:string, create_time:string}[]
    };
   import type { NumberDefault,StringDefault } from "@/interface/interface"; 
    

    export type PatientInfoType = {
        patientId:NumberDefault;
        sex:sexStatus;
        name:StringDefault;
        age:StringDefault;
        bedNumber:StringDefault;
        bed_id:number;
        patientNum:StringDefault;
        eventList?:PatientEvents[]   // 患者事件
        fixedLabels:any[];  // 患者固定标签 并发症概率等
        labels?:PatientLabels[]   // 患者标签
        labelStatus:TOTALRANK  // 笑脸显示状态
        watch?:watchType // 手表
        bclist?:any[] // 病程列表
        bloodGlucoseMeter?:bloodGlucoseMeterType // 血氧仪
        patientHealthy:patientHealthyType // 血氧心率
        patientEmpty:boolean //
        bindWatch:boolean
        bindSuger:boolean
    }
    
    //血氧仪监测时间
   export type bloodGlucoseMeterType = {
        xt_id:number;
        xt_ccid:string;
        xt_createTime:number;
        totalTime:StringDefault;
    }
    
    export type watchType = {
        ccid:StringDefault;
        ccidLast?:StringDefault,
        icon?:StringDefault;
        model:StringDefault; // 型号
        powerLevel:NumberDefault; // 电量
        powerLevel_text?:StringDefault; // 电量
        totalTime:StringDefault; // 监护时长
    }

    // 
    export type PatientEvents = {
        name:StringDefault;
        time:StringDefault;
    }
    

    export type PatientLabels = {
         color:StringDefault;
         label:StringDefault;
         value:StringDefault;
    }


    export type fixedLabelsType = {
         icon:StringDefault;
         color:StringDefault;
         label:StringDefault;
         status:fixedLabelStatus;
         status_text:StringDefault;
         monitoringLevelStatus:MonitoringLevel
    }
   
    // 病人各项监测的等级
    export enum MonitoringLevel {
         LOW = 1,
         NORMAL = 2,
         Excellent = 3,
         EMPTY  = 4
    }
    
    // 病人患病等级的状态
   export enum fixedLabelStatus {
         DEEP = 1,
         NORMAL=2,
         MID=3,
         EMPTY=4
    }

    // 病人患病等级的状态
   export enum TOTALRANK {
         DEEP = 2,
         LOW =0,
         MID=1
    }

     // 男女
   export enum sexStatus {
         MAN = 1,
         WOMAN=2,
         NOTKNOW=0
    }

    // 血氧心率
   export type patientHealthyType = {
        heartRate:StringDefault;
        blood:StringDefault;
        bloodPressureSbp:StringDefault;
        bloodPressureDbp:StringDefault;
        bloodPressureDifference:StringDefault;
        bodyTemperature:StringDefault;
        bloodSugar:StringDefault;
    }
    
    