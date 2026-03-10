// 患者监测数据完整接口
export interface PatientMonitorData {
  // 患者基本信息
  bedNumber: string; // 床号，如"601床"
  patientName: string; // 姓名
  patientId: string; // 患者编号，如"22806"
  bindingTime: string; // 绑定时间，如"2025/2/17 14:33"
  batteryLevel: number; // 电量，如"19%"
  monitorTime: string; // 监测时间，如"18:00"
  
  // 血压数据
  systolicPressure: string; // 收缩压
  diastolicPressure: string; // 舒张压
  pulsePressureDifference: string; // 脉压差
}