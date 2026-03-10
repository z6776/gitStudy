
// 
import type { apiIndexItemType,PatientInfoType} from "@/views/index/types/index.ts";

import { calculateAge,getTimeInterval,getDefaultValue,getAssetsFileNew,getComMonAssetsV2 } from "@/utils/function/function";
const handleDataFn = {
    adaptList:(apiIndexItemTypeList:apiIndexItemType[]):PatientInfoType[]=>{
        let _a = apiIndexItemTypeList.map((item)=>{
             return {
                sex:item.sex,
                patientId:item.id,
                name:item.name,
                age:calculateAge(item.birthday) as string,
                bed_id:item.bed_id,
                bedNumber:item.bed_number,
                patientNum:item.patient_num,
                bclist:handleData.getBclist(item.disease_node),
                eventList:handleData.geteventList(item.patient_event),   // 患者事件
                labelStatus:item?.bulletin_board?.total_rank,   // 患者标签状态
                fixedLabels:handleData.fixedLabels(item.bulletin_board,!item.bulletin_board),  // 患者固定标签 并发症概率等
                labels:handleData.getLabels(item.care_data),   // 患者标签
                watch:item.ccid ?  {
                    ccid:item.ccid,
                    ccidLast:item.ccid ? item.ccid.substring(item.ccid.length-5)  : '--',// 
                    icon:handleData.getModelIcon(item.model),
                    model:item.model, // 型号
                    powerLevel:item.bat, // 电量
                    powerLevel_text:item.bat+"%", // 电量
                    totalTime:getTimeInterval(item.bind_time), // 监护时长bind_time
                } : undefined, // 手表
                bloodGlucoseMeter:item.xt_id ? {
                   xt_id:item.xt_id,
                   xt_ccid:item.xt_ccid,
                   xt_createTime:item.xt_bind_time,
                   totalTime:getTimeInterval(item.xt_bind_time)
                } : undefined, // 血氧仪
                patientHealthy: {
                        heartRate:String(item.heartrate || "--"),
                        blood:String(item.spo2  || "--"),
                        bloodPressureSbp:String(item.sbp  || "--"),
                        bloodPressureDbp:String(item.dbp  || "--"),
                        bloodPressureDifference:handleData.handlebloodPressureDifference(item) || "--",
                        bodyTemperature:item.body || "--",
                        bloodSugar:item.calc_data || "--"
                }, // 血氧心率
                patientEmpty:getDefaultValue(item.id)==='--',  
                bindWatch:getDefaultValue(item.ccid)!=='--',
                bindSuger:getDefaultValue(item.xt_id)!=='--',
             }
        });
        return _a;
    }
}

export const handleData = {
     handlebloodPressureDifference:(item:any):any=>{
        if(getDefaultValue(item.sbp)!=='--' && getDefaultValue(item.dbp)!=='--' && !isNaN(item.sbp - item.dbp)){
            return Number((item.sbp - item.dbp).toFixed(0));
        }else{
            return '--';
        }
     },
     getBclist:(list:any)=>{ // 获取血氧心率
      if(Array.isArray(list) && list.length>0){
       
         return list.map((item,index)=>{
            return{
               name:item.disease_node_name,
               id:item.node_id,
            }
         })
      }else{
          
         return []
      }

     },
     geteventList:(list:any)=>{
      if(Array.isArray(list) && list.length>0){
         return list.map((item,index)=>{
            return{
             
               name:item.tag,
               time:item.create_time,
            }
         })
      }else{
         return []
      }
     },
     getLabels:(list:any)=>{
      const getColor = (a:any,b:boolean)=>{
          if(Array.isArray(a) && a.length>0 && !b){
              return a[0].color
          }else{
              return "#F5F7FB-#929FAF"
          }
      }
      const value = (a:any)=>{
          if(Array.isArray(a) && a.length>0){
              return a.map((item,index)=>{
                  return item.tag
              }).join("、")
          }else{
              return "--"

          }
      }
      if(Array.isArray(list) && list.length>0){
         return list.map((item,index)=>{
            return{
                 color:getColor(item.data,value(item.data)=="--"),
               label:item.simple,
               value:value(item.data),
            }
         })
      }else{
         return []
      }
     },
     // 获取设备图片路径
 getModelIcon : (model: string) => {
  // 这里可以根据设备型号返回不同的图片路径
  let imgurls: Record<string, string> = {
    "M9": 'M9@2x.png',
    "T2PRO": 'T2PRO@2x.png',
    "T3": 'T3@2x.png',
    "WB1": 'WB1@2x.png',
    "WB2": 'WB2@2x.png',
    "WB3": 'WB3@2x.png',
  }

  let url = ''
  if (!model) {
    return getAssetsFileNew(imgurls['M9']!);
  }
  for (const key in imgurls) {
    let model_key = key.toLowerCase()
    let _model = model.toLowerCase()
    if (_model.includes(model_key)) {
      url = imgurls[key]!
    }
  }
  return url ? getAssetsFileNew(url) : getComMonAssetsV2('binddevice.png')
},
 fixedLabels:(obj:any,isEmpty:Boolean=false)=>{
   const hasStatus_text = !obj?.sleep_rank|| obj?.sleep_rank=='-';
   const hasActive_rank = !obj?.active_rank|| obj?.active_rank=='-';
   const hasHrv_rank = !obj?.hrv_rank|| obj?.hrv_rank=='-';
   const hasComplication_rank = !obj?.complication_rank|| obj?.complication_rank=='-';
   const hasPain_rank = !obj?.pain_rank|| obj?.pain_rank=='-';
  return [{
    icon:!isEmpty&& !hasStatus_text ? handleData.getStatus(obj,4)?.icon : 'normal4.png',
    color:!isEmpty && !hasStatus_text ?handleData.getStatus(obj,4)?.color : "#636676",
    label:'睡眠质量：',
    status_text:hasStatus_text ? "--" : obj?.sleep_rank
  },{
    icon:!isEmpty&& !hasActive_rank ? handleData.getStatus(obj,5)?.icon : 'normal5.png',
    color:!isEmpty && !hasActive_rank ?handleData.getStatus(obj,5)?.color : "#636676",
    label:'活动分析：',
      status_text:hasActive_rank ? "--" : obj?.active_rank
  },{
    icon:!isEmpty&&!hasHrv_rank ? handleData.getStatus(obj,3)?.icon : 'normal3.png',
    color:!isEmpty&&!hasHrv_rank ?handleData.getStatus(obj,3)?.color : "#636676",
    label:'HRV风险：',
    status_text:hasHrv_rank ? "--" : obj?.hrv_rank
  },{
     icon:!isEmpty&&!hasComplication_rank ? handleData.getStatus(obj,1)?.icon : 'normal1.png',
    color:!isEmpty&&!hasComplication_rank ?handleData.getStatus(obj,1)?.color : "#636676",
    label:'并发症概率：',
    status_text:hasComplication_rank ? "--" : obj?.complication_rank   
  },{
    icon:!isEmpty&&!hasPain_rank ? handleData.getStatus(obj,2)?.icon : 'normal2.png',
    color:!isEmpty&&!hasPain_rank ?handleData.getStatus(obj,2)?.color : "#636676",
    label:'疼痛等级：',
    status_text:hasPain_rank ? "--" : obj?.pain_rank
  }]
},
getStatus:(obj:any,type?:number) => {   
  if (obj?.total_rank===2) return {
     color:"#F04A4B",
     icon:`deep${type}.png`,
     status:"",
     monitoringLevelStatusts:""
  }
  if (obj?.total_rank===1) return {
     color:"#F08B2E",
     icon:`mid${type}.png`,
      status:"",
     monitoringLevelStatusts:""
  }
  if (obj?.total_rank===0) return {
     color:"#24B287",
     icon:`low${type}.png`,
      status:"",
     monitoringLevelStatusts:""
  }  
}
}


export default handleDataFn;
