import { baseMenuList, baseScreenMenuList } from './baseMenuList'
export const pathRoutes = [
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '首页',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/index/index.vue'),
  },
  {
    path: '/BedDetail/:tab',
    name: 'BedDetail',
    meta: {
      title: '个人阈值设置',
    },
    component: () => import('@/components/BedDetail.vue'),
  },
  {
    path: '/paientInfo/:id',
    name: 'paientInfo',
    meta: {
      title: '患者信息',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/paientInfo/BedDetail.vue'),
  },
  {
    path: '/home/patientManagement',
    name: 'patientManagement',
    meta: {
      title: '患者管理',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/home/patientManagement.vue'),
  },
  {
    path: '/healthAnalysis/wardMovementAnalysis',
    name: 'wardMovementAnalysis',
    meta: {
      title: '病区活动总览',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/healthAnalysis/wardMovementAnalysis.vue'),
  },
  {
    path: '/overviewofBlood/index',
    name: 'overviewofBlood',
    meta: {
      title: '病区血糖总览',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/overviewofBlood/index.vue'),
  },
  {
    path: '/electrocardiogramMonitoring/electrocardiogramMonitoringplan',
    name: 'electrocardiogramMonitoringplan',
    meta: {
      title: '心电监测计划',
      baseMenuList: baseMenuList,
    },
    component: () =>
      import('@/views/pages/electrocardiogramMonitoring/electrocardiogramMonitoringplan.vue'),
  },
  {
    path: '/electrocardiogramMonitoring/electrocardiogramMonitoringplannew',
    name: 'electrocardiogramMonitoringplannew',
    meta: {
      title: '心电监测记录',
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () =>
      import('@/views/pages/electrocardiogramMonitoring/electrocardiogramMonitoringplannew.vue'),
  },
  {
    path: '/bloodpressuremonitoring/bloodpressuremonitoringplan',
    name: 'bloodpressuremonitoringplan',
    meta: {
      title: '血压监测计划',
      baseMenuList: baseMenuList,
    },
    component: () =>
      import('@/views/pages/bloodpressuremonitoring/bloodpressuremonitoringplan.vue'),
  },
  {
    path: '/electrocardiogramMonitoring/bloodPressureRecord',
    name: 'bloodPressureRecord',
    meta: {
      title: '血压检测记录',
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () => import('@/views/pages/electrocardiogramMonitoring/bloodPressureRecord.vue'),
  },
  {
    path: '/rehabilitationTraining/rehabilitationTrainingplan',
    name: 'rehabilitationTrainingplan',
    meta: {
      title: '康复运动记录',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/rehabilitationTraining/rehabilitationTrainingplan.vue'),
  },
  {
    path: '/rehabilitationTraining/breathingTraining',
    name: 'breathingTraining',
    meta: {
      title: '呼吸训练记录',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/rehabilitationTraining/breathingTraining.vue'),
  },
  {
    path: '/reportPrintingManagement/nursingReport',
    name: 'nursingReport',
    meta: {
      title: '报告打印',
      baseMenuList: [],
    },
    component: () => import('@/views/pages/reportPrintingManagement/nursingReport.vue'),
  },
  {
    path: '/patientHealthMonitoring/hrvAnalysis',
    name: 'hrvAnalysis',
    meta: {
      title: 'HRV开关',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages//patientHealthMonitoring/hrvAnalysis.vue'),
  },
  {
    path: '/alarmCenter/blockingManagement',
    name: 'blockingManagement',
    meta: {
      title: '霸屏管理',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/alarmCenter/blockingManagement.vue'),
  },
  {
    name: 'sosEmergencyCall',
    meta: {
      title: 'SOS紧急呼叫',
      baseMenuList: [],
    },
    path: '/alarmCenter/sosEmergencyCall',
    component: () => import('@/views/pages/alarmCenter/sosEmergencyCall.vue'),
  },
  {
    name: 'abnormalPhysical',
    meta: {
      title: '体征异常告警',
      baseMenuList: [],
    },
    path: '/alarmCenter/abnormalPhysical',
    component: () => import('@/views/pages/alarmCenter/abnormalPhysical.vue'),
  },
  {
    name: 'lowbatterymonitoring',
    meta: {
      title: '低电量监测',
      baseMenuList: [],
    },
    path: '/alarmCenter/lowbatterymonitoring',
    component: () => import('@/views/pages/alarmCenter/lowbatterymonitoring.vue'),
  },
  {
    name: 'wearAbnormalMonitoring',
    meta: {
      title: '传输异常监测',
      baseMenuList: [],
    },
    path: '/alarmCenter/wearAbnormalMonitoring',
    component: () => import('@/views/pages/alarmCenter/wearAbnormalMonitoring.vue'),
  },
  {
    name: 'fallMonitoring',
    meta: {
      title: '跌倒监测',
      baseMenuList: [],
    },
    path: '/alarmCenter/fallMonitoring',
    component: () => import('@/views/pages/alarmCenter/fallMonitoring.vue'),
  },
  {
    name: 'fallAlarmRecord',
    meta: {
      title: '跌倒告警记录',
      baseMenuList: [],
    },
    path: '/alarmCenter/fallAlarmRecord',
    component: () => import('@/views/pages/alarmCenter/fallAlarmRecord.vue'),
  },
  {
    name: 'alarmManagement',
    meta: {
      title: '电子围栏告警管理',
      baseMenuList: [],
    },
    path: '/alarmCenter/alarmManagement',
    component: () => import('@/views/pages/alarmCenter/alarmManagement.vue'),
  },
  {
    name: 'equipmentManagement',
    meta: {
      title: '设备管理',
      baseMenuList: baseMenuList,
    },
    path: '/wardOverview/equipmentManagement',
    component: () => import('@/views/pages/wardOverview/equipmentManagement.vue'),
  },
  {
    name: 'wearingSituationManagement',
    meta: {
      title: '佩戴统计',
      baseMenuList: baseMenuList,
    },
    path: '/wardOverview/wearingSituationManagement',
    component: () => import('@/views/pages/wardOverview/wearingSituationManagement.vue'),
  },
  {
    name: 'activefollowup',
    meta: {
      title: '主动随访',
      baseMenuList: baseMenuList,
    },
    path: '/researchfollowup/activefollowup',
    component: () => import('@/views/pages/researchfollowup/activefollowup.vue'),
  },
  {
    name: 'groupRemovalRecord',
    meta: {
      title: '脱组记录',
      baseMenuList: baseMenuList,
    },
    path: '/researchfollowup/groupRemovalRecord',
    component: () => import('@/views/pages/researchfollowup/groupRemovalRecord.vue'),
  },
  {
    name: 'hrv',
    path: '/rightAside/hrv',
    meta: {
      title: 'HRV',
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () => import('@/views/pages/rightAside/hrv.vue'),
  },
  {
    name: 'activity_inner',
    path: '/rightAside/activity_inner',
    meta: {
      title: 'activity_inner',
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () => import('@/views/pages/rightAside/activity_inner.vue'),
  },
  {
    name: 'sleep',
    path: '/rightAside/sleep',
    meta: {
      title: '睡眠监测',
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () => import('@/views/pages/rightAside/sleep.vue'),
  },
  {
    name: 'patientMovementAnalysis',
    path: '/patientMovementAnalysis/index',
    meta: {
      title: '活动报告',
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () => import('@/views/pages/patientMovementAnalysis/index.vue'),
  },
  {
    name: 'bloodSugarAnalysis',
    path: '/bloodSugarAnalysis/index',
    meta: {
      title: '个人血糖分析',
      hideRight: 1,
      baseMenuList: baseScreenMenuList,
    },
    component: () => import('@/views/pages/bloodSugarAnalysis/index.vue'),
  },
  {
    name: 'tagManagement',
    path: '/tagManagement/index',
    meta: {
      title: '标签管理',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/tagManagement/index.vue'),
  },
  {
    name: 'nursingEventRecord',
    path: '/nursingEventRecord/index',
    meta: {
      title: '护理记录',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/nursingEventRecord/index.vue'),
  },
  {
    name: 'patientEducation',
    path: '/patientEducation/index',
    meta: {
      title: '患者教育',
      baseMenuList: [],
    },
    component: () => import('@/views/pages/patientEducation/index.vue'),
  },
  {
    name: 'medicalorder',
    path: '/researchfollowup/medicalorder',
    meta: {
      title: '医嘱管理',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/researchfollowup/medicalorder.vue'),
  },
  {
    name: 'drugAdministration',
    path: '/tagManagement/drugAdministration',
    meta: {
      title: '药品管理',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/tagManagement/components/drugAdministration.vue'),
  },
  {
    name: 'WardWear',
    path: '/wardOverview/device',
    meta: {
      title: '穿戴监护',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/wardOverview/device.vue'),
  },
  {
    name: 'sugerDevice',
    path: '/wardOverview/sugerDevice',
    meta: {
      title: '血糖监护',
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/wardOverview/sugerDevice.vue'),
  },
  {
    path: '/monitoringOverview',
    name: 'monitoringOverview',
    meta: {
      title: '监测总览',
      KeepAlive: true,
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () => import('@/views/pages/monitoringOverview/index/index.vue'),
  },
  {
    path: '/monitoringandanalysis',
    name: 'monitoringandanalysis',
    meta: {
      title: '监测分析',
      KeepAlive: true,
      baseMenuList: baseScreenMenuList,
      hideRight: 1,
    },
    component: () => import('@/views/pages/monitoringandanalysis/index.vue'),
  },
  {
    path: '/courseManagement/:id',
    name: 'courseManagement',
    meta: {
      title: '病程管理',
      KeepAlive: true,
      baseMenuList: baseMenuList,
    },
    component: () => import('@/views/pages/courseManagement/index.vue'),
  },

  //
]
