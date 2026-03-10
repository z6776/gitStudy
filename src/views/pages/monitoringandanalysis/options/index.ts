import { getRem,scaleByHeight } from "@/utils/function/function"
import * as echarts from "echarts";

export const emptyPieOption = {
  color: ['#F5F7FB', '#F5F7FB','#F5F7FB'],
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      radius: ['65%', '100%'],
      avoidLabelOverlap: false,
      tooltip:{
        show:false,
      },
      itemStyle: {
        borderWidth: getRem(2),       // 设置扇形边框宽度
        borderColor: '#F5F7FB'   // 设置扇形边框颜色
      },
      emphasis: {
         scale:false,
         scaleSize:0.5,
        
        label: {
          show: false,
          position: 'center',
          fontSize: getRem(10),
        },
      },
      labelLine: {
        show: false,
      },
      type: 'pie',
      data:<number[]> [100,0,0],
    },
  ],
}

export const monitoringAndAnalysisOptionshr = {
  color: ['#24B287', '#DA4343','#E89E2E'],
  tooltip: {
    trigger: 'item',
     formatter: (e:any)=>{
      return `<div>
         <div style="width:${getRem(6)}px; height:${getRem(6)}px; background:${e.color}; border-radius:50%; margin-right:${getRem(5)}px; display:inline-block; vertical-align:middle;"></div>  
         ${e.value}%
      </div>`
    }
  },
  series: [
    {
      radius: ['65%', '100%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderWidth: getRem(3),       // 设置扇形边框宽度
        borderColor: '#F5F7FB'   // 设置扇形边框颜色
      },
      emphasis: {
         scale:true,
         scaleSize:0.5,
        
        label: {
          show: false,
          position: 'center',
          fontSize: getRem(10),
        },
      },
      labelLine: {
        show: false,
      },
      type: 'pie',
      data:<number[]> [],
    },
     {
        // 背景内环
        type: 'pie',
        radius: ['60%', '70%'],
        silent: true,
        label: {
            show: false
        },
        labelLine: {
            show: false
        },
        data: [{
            value: 1,
            itemStyle: {
                color: '#F5F7FB'  // 设置背景环的颜色
            }
        }]
    }
  ],
  // backgroundColor:"#000"
}
export const monitoringAndAnalysisOptionsblood = {
  color: ['#24B287', '#DA4343', '#E89E2E'],
  tooltip: {
    trigger: 'item',
     formatter: (e:any)=>{
      return `<div>
         <div style="width:${getRem(6)}px; height:${getRem(6)}px; background:${e.color}; border-radius:50%; margin-right:${getRem(5)}px; display:inline-block; vertical-align:middle;"></div>  
         ${e.value}%
      </div>`
    }
  },
  series: [
    {
      radius: ['65%', '100%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderWidth: getRem(3),       // 设置扇形边框宽度
        borderColor: '#F5F7FB'   // 设置扇形边框颜色
      },
      emphasis: {
         scale:true,
         scaleSize:0.5,
        
        label: {
          show: false,
          position: 'center',
          fontSize: getRem(10),
        },
      },
      labelLine: {
        show: false,
      },
      type: 'pie',
      data: [80, 15, 5],
    },
     {
        // 背景内环
        type: 'pie',
        radius: ['60%', '70%'],
        silent: true,
        label: {
            show: false
        },
        labelLine: {
            show: false
        },
        data: [{
            value: 1,
            itemStyle: {
                color: '#F5F7FB'  // 设置背景环的颜色
            }
        }]
    }
  ],
}
export const monitoringAndAnalysisOptionshx = {
 color: ['#24B287', '#DA4343', '#E89E2E'],
  tooltip: {
    trigger: 'item',
     formatter: (e:any)=>{
      return `<div>
         <div style="width:${getRem(6)}px; height:${getRem(6)}px; background:${e.color}; border-radius:50%; margin-right:${getRem(5)}px; display:inline-block; vertical-align:middle;"></div>  
         ${e.value}%
      </div>`
    }
  },
  series: [
    {
      radius: ['65%', '100%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderWidth: getRem(3),       // 设置扇形边框宽度
        borderColor: '#F5F7FB'   // 设置扇形边框颜色
      },
      emphasis: {
        scale:true,
        scaleSize:0.5,
        label: {
          show: false,
          position: 'center',
          fontSize: getRem(10),
        },
      },
      labelLine: {
        show: false,
      },
      type: 'pie',
      data: [80, 15, 5],
    },
     {
        // 背景内环
        type: 'pie',
        radius: ['60%', '70%'],
        silent: true,
        label: {
            show: false
        },
        labelLine: {
            show: false
        },
        data: [{
            value: 1,
            itemStyle: {
                color: '#F5F7FB'  // 设置背景环的颜色
            }
        }]
    }
  ],
}

export const monitoringAndAnalysisOptionstem = {
  color: ['#24B287', '#DA4343', '#E89E2E','#EFF841'],
  tooltip: {
    trigger: 'item',
    formatter: (e:any)=>{
      return `<div>
         <div style="width:${getRem(6)}px; height:${getRem(6)}px; background:${e.color}; border-radius:50%; margin-right:${getRem(5)}px; display:inline-block; vertical-align:middle;"></div>  
         ${e.value}%
      </div>`
    }
  },
  series: [
    {
      radius: ['0%', '100%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderWidth: getRem(2),       // 设置扇形边框宽度
        borderColor: '#fff'   // 设置扇形边框颜色
      },
      emphasis: {
         scale:true,
         scaleSize:0.5,          
        label: {
          show: false,
          position: 'center',
          fontSize: getRem(10),
        },
      },
      labelLine: {
        show: false,
      },
      type: 'pie',
      data:<number[]>[],
    },
    
  ]
}


export const bloodPressureMonitorOptions = {
  xAxis: {
    type: 'category',
    data: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "22:00", "00:00"],
    show: true, 
    boundaryGap: true,
    axisLine:{
      lineStyle:{
           color:"#EEEEEE"
      }
    },
    axisTick:{
       show:false
    },
     axisLabel:{
         color:"#929FAF",
         align:"center",
         fontSize:getRem(12)
      },
  },
  yAxis: {
    type: 'value',
    show: true,
    axisLabel:{
       fontSize:getRem(12),
       color:"#929FAF",
        show:true
    },
    splitLine:{
        lineStyle:{
           color:"#EEEEEE"
        },
        show:true
    },
    min: 0,
    max:200
  },
  grid: {
    top: 0,
    left: 17,
    right: 9,
    bottom: 0
  },
  series: [{
    data: <number[]>[], // 示例心率数据
    type: 'line',
    smooth: true, // 平滑曲线
    symbol: 'none', // 不显示数据点标记
    itemStyle:{
      color:'#56E3E1'
    },
  areaStyle: {
    color:{
     type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [{
      offset: 0, color: 'rgba(86, 227, 225, 0.20)' // 0% 处的颜色
  }, {
      offset: 1, color: 'rgba(86, 227, 225, 0)' // 100% 处的颜色
  }],
  global: false
  },
  },
    lineStyle: {
      color: '#56E3E1', // 线条颜色
      width: getRem(2)
    }
  },{
    data:  <number[]>[], 
    type: 'line',
    smooth: true,  
    symbol: 'none',  
      areaStyle: {
         color:{
     type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [{
      offset: 0, color: 'rgba(0, 136, 255, 0.20)' // 0% 处的颜色
  }, {
      offset: 1, color: 'rgba(0, 136, 255, 0)' // 100% 处的颜色
  }],
  global: false
  }
  },
    itemStyle:{
      color:'#0088FF'
    },
    lineStyle: {
      color: '#0088FF', // 线条颜色
      width: getRem(2)
    }
  }],
  backgroundColor: 'transparent'
};


export const sugerOptions = {
    xAxis: {
    type: 'category',
    data: <string[]>[],
    show: true,
    boundaryGap: true,
    axisTick:{
        show:true,
         inside:true
    },
    axisLine:{
      show:true,  
      lineStyle:{
        color:'#CDCDCD',
      }
    },
    axisLabel: {
        showMaxLabel:true,
         showMinLabel:true,
         color:"#929FAF",
      fontSize: scaleByHeight(12),
    },
    // bound
  },
 
  // xAxis: {
  //   type: 'category',
  //   data: [],
  //   show: true, 
  //   boundaryGap: true,
  //   axisTick:{
  //      show:false
  //   },
  //    axisLabel:{
  //        showMaxLabel:false,
  //        showMinLabel:false,
  //        fontSize:getRem(12),
  //        color:"#929FAF",
  //        align:"center",
  //        formatter:(e:any)=>{}
  //     },
  // },
  yAxis: {
    type: 'value',
    show: true,
    axisLabel:{
        show:false
    },

    splitLine:{
        lineStyle:{
           color:"rgba(56, 73, 81, 1)"
        },
        show:false
    },
    min: (value:any)=>{
      return value.min
    },
    max: (value:any)=>{
      return value.max+2
    },
  },
  grid: {
    top: 0,
    left: 20,
    right: 20,
    bottom: 0,
  },
    tooltip:{
      show:true,
      padding:0,
      trigger:"axis",
      borderWidth:1,
       borderColor:"#EEEEEE",
        fontFamily: 'Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30',
         position: function (pos:Array<number>) {
          // Number((pos[0]??0+100).toFixed(0))
           return [Number((pos[0]??0).toFixed(0)),-20];
      },
      axisPointer:{
         type:"line",
         snap:true,
         z:9,
         lineStyle:{
          width:scaleByHeight(2),
           color:"#E24040",
           type: "solid"
         }
      },
       formatter: (params:any) => {
        }
    },
  series: [{
    data: <number[][]>[],
    type: 'line',
    smooth: true, // 平滑曲线
      symbol: 'none',
    itemStyle:{
      color:'#56E3E1'
    },
    markPoint: {
      z:99,
        data:<Record<string,any>>[],
        symbol: 'circle',
        symbolSize: '10',
        itemStyle: {
          color: '#24B287',
        },
      },
    lineStyle: {
      color: '#24B287', // 线条颜色
      width: scaleByHeight(2)
    }
  },{
      type: 'line',
      markArea: {
        silent: true,
        itemStyle: {
          color: '#EAFFF9'
        },
        data: [[
          {
            yAxis: 4.4,
            label: {
              fontSize:scaleByHeight(12) ,
              show: false,
              position: 'right',
              formatter: '4.4',
              color: '#EAFFF9'
            }
          },
          {
            yAxis: 7.8,
             label: {
              fontSize:scaleByHeight(12),
              show: false,
              position: 'right',
              formatter: '7.8',
              color: '#EAFFF9'
            }
          }
        ]]
      }
    }],
   graphic:<any>[],
  backgroundColor: 'transparent'
};



