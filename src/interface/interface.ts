import type { Component } from "vue"


export interface RouterItem {
     meta: Record<string, any>,
    name: string
    path: string
    component?: Component
    children?: RouterItem[]
}

export interface MenuItem {
    id: string
    title: string
    path?: string
    icon?: string
    iconsel?: string
    children?: MenuChild[]
}

export interface MenuChild {
    id: string
    title: string
    path?: string
    icon?: string
}


export interface dateFormat {
    [key: string]: number
    "M+": number    //月份 
    "d+": number
    "h+": number
    "m+": number
    "s+": number
    "q+": number
    S: number
}

export interface WearTableItem {//佩戴异常监测列表item
    ccid: string
    name: string
    birthday: string
    insert_time: number,
    bed_number: string
}

export interface Timer {//定时器储存器 
    id: number | undefined
}

export interface EditPwdForm {//修改密码表单
    old_password: string
    new_password: string
    confirm_password: string
}

export interface Pagination {//分页
    page: number
    perPage: number
    total: number
}

// 监测计划
export interface BpmItem{
    index: number
    plan_date: string
    [key: string]: any
}

// 监测记录
export interface GroupItem{
    index: number
    plan_date: string
    [key: string]: any
}
  
// 患者信息
export interface personItem{
    id: number
    name: string
    ccid: string
    [key: string]: any
}


// 返回类型
export interface ResponseData{
    status: number
    result: string
    message: any
}

 
export interface TagsViewItem {//面包屑
    title: string
    path: string
}

export interface Timer {//定时器储存器 
    id: number | undefined
}

export interface EditPwdForm {//修改密码表单
    old_password: string
    new_password: string
    confirm_password: string
}

export interface Pagination {//分页
    page: number
    perPage: number
    total: number
}

export interface BedTableItem {//床位
    [key: string]: any
    id: number
    use: number
    bed_number: number
    room_number: number
    remark: string
    create_time: number
    name: string
    birthday: string
    patient_id: number
}
export interface BedTableQueryData {//床位列表api参数
    page: number
    perPage: number
    bed_number?: string
    use?: number
    name?: string
}
export interface BedForm {//床位表单
    [key: string]: any
    id?: number
    bed_number: string
    room_number: string
    remark: string
    num: string
}
export interface PatientTableItem {//患者
    [key: string]: any
    id: number
    name: string
    birthday: string
    ccid: string
    start: string
    bed_number: string
    high_heartrate_value: number
    low_heartrate_value: number
    spo2: number
    ppg: number
    normal_rate: number | string
    log: number
}

export interface treeDataItem {//下发提醒
    [key: string]: any
    id: Number
    name:string
    children:Array<[]>
}

export interface PatientTableQueryData { //患者列表api参数
    page: number
    perPage: number
    bed_number?: string
    ccid?: string
    name?: string
    bind?: string
    isDisband?: string
    group_status?:string
}

export interface PatientForm {  //患者表单 
    [key: string]: any
    id?: number
    name: string
    birthday: string
    start: string
    sex?: string
    nationality?: string
    id_card?: string
    address?: string
    emergency_contact?: string
    emergency_phone?: string
    emergency_relation?: string
    language?: string
    department?: string
    medical_record_number?: string
    responsible_doctor?: string
    illness?: string
    level_of_care?: string
    precautions?: string
    department_in_time?: string
    responsible_nurse?: string
    medication_info?: string
    end?: string,
    patient_num?: string
    language_other?: string
    situation: string | number
}

export interface SelectBedList {  //分配床位列表
    list: BedTableItem[];
};

export interface LogDialogTableItem { //患者操作日志
    id: number
    patient_id: number
    before: string
    after: string
    type: number
    create_time: number
    update_time: number
    status: number
}

export interface DeviceTableQueryData {//设备列表api参数
    page: number
    perPage: number
    bind?: string
    status?: string
    ccid?: string
    model?: string

}

export interface DeviceTableItem {//设备
    [key: string]: any
    id: number
    bind: number
    ccid: string
    status: number
    model: string
    create_time: number
    bat: number | null
    name: string | null
    bed_number: number | null
}

export interface ReportTableItem {//护理服务报告列表item
    id: number
    patient_id: string
    room_number: string
    zone_number: string
    bed_number: string
    start: number
    end: number
    ccid: string
    zone_name: string
    high_heartrate_value: number
    high_heartrate_time: number
    low_heartrate_value: number
    low_heartrate_time: number
    spo2: number
    low_spo_time: number
    ppg: number
    normal_rate: string
    update_time: number
    name: string
    is_print: number
}

export interface CallTableItem {//呼叫监测列表item
    id: number
    name: string
    bed_number: string
    ccid: string
    status: string
    create_time: number
}

export interface BodyTableItem {//患者体征数据列表item
    id: number
    ccid: string
    patient_id: string
    spo2: number
    heartrate: number
    create_time: number
    name: string
    zone_number: string
    room_number: string
    bed_number: string
}
export interface WarningTableItem {//患者体征数据列表item
    id: number
    ccid: string
    alarm_type: number,
    alarm_type_name: string,
    alarm_time: number,
    name: string,
    birthday: string,
    bed_number: string
}

export interface BatTableItem {//电量不足列表item
    id: number
    ccid: string
    name: string,
    birthday: string,
    bed_number: string
    insert_time: number
    bat: number
}

 

export interface WearPeiItem {
    data:string
    wear_percentage:string
    wear_total:string
}

// 
export interface PatientItem {
  "id": number
  "patient_num": string
  "birthday": string
  "name": string
  "level_of_care": number
  "situation": number
   "bat": number
  "ccid"?: string,
  "model"?: string,
  "bed_number"?: string
  "spo2"?: string
  "heartrate"?: number
  "body"?: string
  "dbp"?: number
  "sbp"?: number
}

// 更换手表
export interface ChangeWatchPatient {
     ccid: string  // 更换的ccid
     model: string
     patient_id: number
     old_ccid: string //  当前的ccid
}

export type BaseResult = {
    [key: string]: any;
    data?: any;
} | any[] | null | any;

// 统一接口列表类型
export type ApiResponse<T  extends BaseResult = any> = {
  status: string | number
  message: string
  result:T
}
export interface AxiosResponseType<T  extends BaseResult = any > {
  data: ApiResponse<T>;
  status: number;
  statusText: string;
  request?: any;
}

// 列表类型
export type ListItemType = {
    data:any[],
    [key:string]:any
}
// 默认值
export type NumberDefault = number | "--";
export type StringDefault = string | "--";


export interface tooltipType<T>{
       data:T,
       dataIndex:number
}
// 弹窗添加删除的判断
 export enum EventEnum{
        ISDEL = 1,
        ISADD = 2
};

// 标签
export interface TagType{
    value: number,
    label: string,
    tag_id?: number;
    selected?: boolean
}



