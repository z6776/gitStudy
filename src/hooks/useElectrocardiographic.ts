import { ref, nextTick, shallowRef, h, reactive } from "vue";
import type { BpmItem, personItem,GroupItem ,ResponseData} from "@/interface/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import * as echarts from "echarts";
import { dateFtt } from "@/utils/date/dateFtt";
import ElectrocarDiographicApi from "@/api/electrocardiographic";
import type { ElectrocardiographicSearch } from "@/interface/electrocardiographic";
import { md5Str } from "@/utils/function/function";
let numsTop = ref({
  inNum: 0,
  outNum: 0,
  bindNum: 0,
  unbindNum: 0
});
let ecglen = ref(0);
let date = ref();
let persons = ref<personItem[]>([]);
  let groupdialog = ref(false);
  let heartdialog = ref(false);
  let planVisible = ref(false);
  let currentPerson = ref<personItem>({
    id: 0,
    name: "",
    ccid: "",
  });
  let currentResult = ref({});
  let planListLoading = ref(false);
  let tableLoading = ref(false);
  // 监测记录列表
  let groupList = ref<GroupItem[]>([]);
  // 监测计划列表
  let planList = ref<BpmItem[]>([]);
  
export const useElectrocardiographic = (module:string) => {
 let typemodule = module==='ecg' ? 1 : 2;
  const getPatientList = async (data:any) => {
     let modules = {
        "ecg":  ElectrocarDiographicApi.getPatientListEcg,
        "bp": ElectrocarDiographicApi.getPatientListBp
     }
     if (module !== 'ecg' && module !== 'bp') {
          throw new Error('Invalid module');
      }
     return (await modules[module](data)).data.result;
  };
 
  const getrecord = async (data:any) =>{
     let modules = {
        "ecg":  ElectrocarDiographicApi.getrecord,
        "bp": ElectrocarDiographicApi.getrecordbp
     }
     if (module !== 'ecg' && module !== 'bp') {
          throw new Error('Invalid module');
      }
     return (await modules[module](data)).data.result;
  };

  // 患者列表
  const fetchDataNum = async (search?:ElectrocardiographicSearch,showLoading:boolean=true) => {
        tableLoading.value = true && showLoading;
        let data: any = {
            page: search?.page || 1,
            perPage: 18,
        }
        if(search){
            data = {...data,...search};
        }
        try {
          const result = await getPatientList(data);
        if (result) {
             persons.value = [...persons.value,...result.data];
             let nums = {
                 inNum: 0,
                 outNum: 0,
                 bindNum: 0,
                 unbindNum: 0
             }
            result.data.forEach((element: any) => {
                if (element.status == 2) {
                     nums.outNum++
                } else {
                     nums.inNum++
                }
                if (element.bind == 1) {
                     nums.bindNum++
                } else {
                     nums.unbindNum++
                }
            });
            numsTop.value = nums;
              tableLoading.value = false;
              return result.data.length === 18;
        }
        } catch (error) {
           tableLoading.value = false;
        }
      
    }

  const customPrefix = shallowRef({
    render() {
      return h("p", "");
    },
  });


  async function openPlanGroup(item: personItem) {
    groupdialog.value = true;
    currentPerson.value = item;
    getPlanGroup();
  }

  async function getPlanGroup(date:(Date | string)=new Date()){
       try {
       planListLoading.value = true;
       let result = await getrecord({
         patient_id: currentPerson.value.id,
         ccid: currentPerson.value.ccid,
         type:typemodule,
         date:dateFtt("yyyymmdd",date)
       });
       if (result) {
          groupList.value = result;
       }
        planListLoading.value = false;
    } catch (error) {
      planListLoading.value = false;
    }

  }

  // 
  async function openPlanResult(d:string,item?: BpmItem) {
    groupdialog.value = false;
    heartdialog.value = true;
    date.value = d;
  
    nextTick(() => {
      // initChart(item);
    });
  }
  
  // 开启计划
  async function openPlan(item: personItem) {
    currentPerson.value = item;
    planVisible.value = true;
    initPlanList();
  }

  const initPlanList = async () => {
    planListLoading.value = true;
    try {
      const result = (await ElectrocarDiographicApi.planListApi({ 
        zone_number: localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")!).zone_number : "",
        patient_id: currentPerson.value.id,
        ccid: currentPerson.value.ccid,
        type:typemodule
       })).data
      if (result) {
        planList.value = result.result;
        planListLoading.value = false;
      }
    } catch (error: any) {
      planListLoading.value = false;
    }
  };

  // 删除计划
  const deletePlan = async (item: BpmItem) => {
    ElMessageBox.confirm("确认删除该条计划?", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      confirmButtonClass: "confirmbtnmessage",
      type: "warning",
    })
      .then(async (res) => {
        try {
           let index = planList.value.findIndex((item) => item.id === item.id);
          planList.value.splice(index, 1);
          await ElectrocarDiographicApi.delPlan({
            id: item.id
          })
          // ElMessage({
          //   type: "success",
          //   message: "删除成功",
          // });
        } catch (error) {
           planListLoading.value = false;
        }
       
       
       
      })
  };
  async function initChart(item?: BpmItem){
    
      const option = {
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      show:false
    },
    xAxis: {
      type: "time",
      data: [],
      axisLine: {
        show: false,
        lineStyle: {
          color: "#999",
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
     
      axisLabel: {
        showMinLabel:true,
        showMaxLabel:true,
        formatter: function (value: number) {
          const date = new Date(value);      
          // 假设数据范围是 2023-01-01 到 2023-12-31  
          const minDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
          ).getTime();
          const maxDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            23,
            59,
            59
          ).getTime();
          // 如果是最小值或最大值，添加标记
          if (value === minDate) {
            return "00:00";
          } else if (value === maxDate) {
            return "23:59";
          }
          return dateFtt("hh:MM", value); // 默认格式
        },
        show: false,
      },
      //  boundaryGap:false,
      splitLine: { show: false },
    },
    yAxis: {
        type: "value",  
        axisLabel: {
          show: false,
        },
        // scale: true, // 自动缩放 Y 轴
        splitLine: { show: false },
      },
    series: [
      {
        name: "ECG",
        type: "line",
        data: [],
        smooth: true, // 平滑曲线
        lineStyle: {
          color: "#E24040", // 红色线条
          width: 1,
        },
        symbol: "none", // 不显示数据点标记
      }
    ],
    dataZoom: [
      {
        type: "inside", //类型
        // filterMode:"none",
        show: true, //显示
        // minValueSpan: 9 * 60 * 1000, // 最小窗口范围：1 分钟（60,000 毫秒）
        // maxValueSpan: 24 *  60 * 60 * 1000, // 最大窗口范围：1 分钟（固定）
        start: 10,               // 初始显示 0%~100%（即整个 1 分钟范围）
        end: 20               // 结束显示 0%~100%（即整个 1 分钟范围）

      }
    ],
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
  };  
   
    // ecglen.value = 0;
  let hour = "";
  if(item?.plan_date){
      let _a = item.plan_date.split(":");
      hour = Number(_a[0])+'';
  }
  // showLoading.value = true;
  // 生成 500 个数据点  1000/200 =  5   共1分钟 1200
  const _result = await ElectrocarDiographicApi.get_m9_ecg_wave(
           {
              patient_id:currentPerson.value.id,
              date:date.value,
              md5:md5Str(currentPerson.value.id+''),
              hour
          }
);
 

  const second = 1000 / 250;  // 一秒钟250个点
  if(_result.data.result.length>0){
     ecglen.value = _result.data.result.length;
   _result.data.result.forEach((item: any, index: number) => {
    let ecgData:any = [];

    const chartOption = JSON.parse(JSON.stringify(option));

    item.ecg_data.forEach((child: any, i: number) => {
        ecgData.push([Number((new Date().getTime() + i * second).toFixed(0)), child]);
    });
    chartOption.series[0].data = ecgData;  
    nextTick(() => {
        let chartDom = document.getElementById('ecg-chart' + index) as HTMLElement;
        if (echarts && echarts.getInstanceByDom(chartDom)) {
            echarts.dispose(chartDom);
        }
        const dom = echarts.init(chartDom);
        dom && dom.setOption(chartOption);
    });
});   
      
  }else{
      ecglen.value = 0;
  }
  // 使用配置项显示图表
}

  return {
    planListLoading,
    openPlan,
    openPlanGroup,
    openPlanResult,
    planList,
    groupdialog,
    heartdialog,
    planVisible,
    currentPerson,
    currentResult,
    customPrefix,
    groupList,
    fetchDataNum,
    tableLoading,
    persons,
    initPlanList,
    deletePlan,
    getPlanGroup,
    ecglen,
    numsTop
  };
};
  
export function getStamp(time: string) {
  const date = new Date(time);
  return date.getTime();
}




  