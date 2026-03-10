import { dateFtt } from "@/utils/date/dateFtt";
import { getRem } from "@/utils/function/function";
import type { tooltipType } from "@/interface/interface"
export const sugerOptions = {
  xAxis: {
    type: 'category',
    data:[],
    show: true, 
    boundaryGap: true,
    axisTick:{
       show:false
    },
    axisLine:{
      show:false
    },
     axisLabel:{
         showMaxLabel:true,
         showMinLabel:true,
         fontSize:getRem(12),
         align:"center",
         color:'#929FAF',
         formatter:(e:any)=>{
             return dateFtt("hh:MM",e);
         }
      },
  },
  yAxis: {
    type: 'value',
    show: true,
    axisLabel:{
        show:true,
        color:"#929FAF"
    },
    splitLine:{
        lineStyle:{
           color:"#EEEEEE"
        },
        show:true
    },
    min: 0,
    max:20
  },
  grid: {
    top: 20,
    left: 0,
    right: 100,
    bottom: 0,
    containLabel: true
  },
  graphic:[],
    tooltip:{
      show:true,
      padding:0,
      trigger:"axis",
      // borderWidth:3,
       shadowBlur:0,
       borderColor:"#ffffff",
        fontFamily: 'Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30',
       axisPointer: {
            show: true,
            status: 'show',
            axis: "x",
            value: 0,
            type: 'line',
            snap: true,
            label: {
                show: false
            },
            lineStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(226, 64, 64, 0)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(226, 64, 64, 1)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                type: 'solid',
                width: 2
            },
            handle: {
                show: true,
                size: 0
            }

        },
       formatter: (params:any)=>{

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
    lineStyle: {
      color: '#0477E0', // 线条颜色
      width: getRem(2)
    },
     markLine: {
      silent: true, // 不触发事件
      symbol: 'none', // 无箭头
      lineStyle: {
        type: 'solid', // 或 'dashed' 虚线
        color: '#384951',
        width: 1
      },
      label: {
        show: true,
        position: 'end', // 标签位置
        formatter: (params:any) => {
          return `${params.value}`;
        },
        color: '#384951',
        fontSize: getRem(16)
      },
      data: [{
        yAxis: 4.4, // 在y轴4.8的位置
        name: '参考线'
      },{
        yAxis: 7.8, // 在y轴7.8的位置
        name: '参考线'
      }]
    },
    markArea: {
      silent: true,
      itemStyle: {
        color: 'rgba(82, 196, 26, 0)'  // 半透明背景
      },
      label: {
        show: true,
        position: 'right',
        offset:[30,0],
        formatter: ()=>{
          return "目标\n范围";
        },
        color: '#384951',
        fontSize: getRem(16),
        fontWeight: 'normal'
      },
      data: [[
        {
          yAxis: 4.4
        },
        {
          yAxis: 7.8
        }
      ]]
    }
  }]
  // backgroundColor: 'transparent'
};

export const sugerOptionseven = {
  xAxis: {
    type: 'category',
    data:[],
    show: true, 
    boundaryGap: true,
    axisTick:{
       show:false
    },
    axisLine:{
      show:false
    },
     axisLabel:{
         showMaxLabel:true,
         showMinLabel:true,
         fontSize:getRem(12),
         align:"center",
         color:'#929FAF',
         formatter:(e:any)=>{
             return e;
         }
      },
  },
  yAxis: {
    type: 'value',
    show: true,
    axisLabel:{
        show:true,
        color:"#929FAF"
    },
    splitLine:{
        lineStyle:{
           color:"#EEEEEE"
        },
        show:true
    },
    min: 0,
    max:20
  },
  grid: {
    top: 20,
    left: 0,
    right: 100,
    bottom: 0,
    containLabel: true
  },
  graphic:<any[]>[],
    tooltip:{
      show:true,
      padding:0,
      trigger:"axis",
      // borderWidth:3,
       shadowBlur:0,
       borderColor:"#ffffff",
        fontFamily: 'Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30',
       axisPointer: {
            show: true,
            status: 'show',
            axis: "x",
            value: 0,
            type: 'line',
            snap: true,
            label: {
                show: false
            },
            lineStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(226, 64, 64, 0)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(226, 64, 64, 1)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                type: 'solid',
                width: 2
            },
            handle: {
                show: true,
                size: 0
            }

        },
       formatter: (params:any)=>{

       }
    },
  series: [
    {
    data: <number[][]>[],
    type: 'line',
    smooth: true, // 平滑曲线
      symbol: 'none',
    itemStyle:{
      color:'#56E3E1'
    },
    lineStyle: {
      color: '#0477E0', // 线条颜色
      width: getRem(2)
    },
     markLine: {
      silent: true, // 不触发事件
      symbol: 'none', // 无箭头
      lineStyle: {
        type: 'solid', // 或 'dashed' 虚线
        color: '#384951',
        width: 1
      },
      label: {
        show: true,
        position: 'end', // 标签位置
        formatter: (params:any) => {
          return `${params.value}`;
        },
        color: '#384951',
        fontSize: getRem(16)
      },
      data: [{
        yAxis: 4.4, // 在y轴4.8的位置
        name: '参考线'
      },{
        yAxis: 7.8, // 在y轴7.8的位置
        name: '参考线'
      }]
    }
  },
  {
        type: 'line',
        data: [],  
         markArea: {
      silent: true,
      itemStyle: {
        color: 'rgba(82, 196, 26, 0)'  // 半透明背景
      },
      label: {
        show: true,
        position: 'right',
        offset:[30,0],
        formatter: ()=>{
          return "目标\n范围";
        },
        color: '#384951',
        fontSize: getRem(16),
        fontWeight: 'normal'
      },
      data: [[
        {
          yAxis: 4.4
        },
        {
          yAxis: 7.8
        }
      ]]
    }
    },
  {
        type: 'line',
        data: []
    },
    {
    data: <number[][]>[],
    type: 'line',
    smooth: true, // 平滑曲线
      symbol: 'none',
      stack:"total",
    areaStyle:{
        opacity:0
    },
    lineStyle: {
      opacity:0,
      width: 0
    }
  },
     {
    data: <number[][]>[],
    type: 'line',
    smooth: true, // 平滑曲线
      symbol: 'none',
    stack:"total",
    areaStyle:{
        color:"rgba(234, 244, 254, 1)",
          opacity: 1  
    },
     emphasis: {
      disabled: true,
            // 悬浮状态下的样式
            areaStyle: {
                opacity: 1  // 保持与正常状态相同的透明度
            }
        },
    lineStyle: {
      color: 'red', // 线条颜色
      width: 0
    }
  },
   {
    data: <number[][]>[],
    type: 'line',
    smooth: true, // 平滑曲线
      symbol: 'none',
      stack:"fill",
    areaStyle:{
        opacity:0
    },
    lineStyle: {
      opacity:0,
      width: 0
    }
  },
     {
    data: <number[][]>[],
    type: 'line',
    smooth: true, // 平滑曲线
      symbol: 'none',
    stack:"fill",
    areaStyle:{
        color:"rgba(193, 224, 254, 1)",
         opacity: 1  
    },
    emphasis: {
      disabled: true,
            // 悬浮状态下的样式
            areaStyle: {
                opacity: 1  // 保持与正常状态相同的透明度
            }
        },
    lineStyle: {
      color: 'red', // 线条颜色
      width: 0
    }
  },
  
  ],
  backgroundColor: '#fff'
};


// pieSuger

export const pieSugerOptions = {
  color: ['#0477E0', '#24B287','#F08B2E'], // 低 正常  高
  tooltip: {
    trigger: 'item'
  },
  
     emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
//  labelLayout(params:any) {
//     return {
//         x: params.rect.x + 10,
//         y: params.rect.y + params.rect.height / 2,
//         verticalAlign: 'middle',
//         align: 'left'
//     }
// },
  series: [
    {
       radius: ['55%', '80%'],  // 内外半径接近 - 细环
         center: ['50%', '50%'],
         avoidLabelOverlap: false,
         label: {
            show: true,
            fontSize: getRem(14),
            // fontFamily: 'Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30',
            // fontWeight: 'bold',
            formatter:(e:tooltipType<number>):void=>{
                   
            }
          },
          labelLine: {
            show:true,
            length: 10, // 第一段线长
            length2: 20  // 第二段线长[citation:1]
          },
          type: 'pie',
          data:<number[]> [],
    },
  ],
}



export const sugerAgeRangeOption = {
  tooltip:{
      show:true,
      padding:0,
      trigger:"axis",
      // borderWidth:3,
       shadowBlur:0,
       borderColor:"#ffffff",
        fontFamily: 'Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30',
       axisPointer: {
            show: true,
            status: 'show',
            axis: "x",
            value: 0,
            type: 'line',
            snap: true,
            label: {
                show: false
            },
            lineStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(226, 64, 64, 0)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(226, 64, 64, 1)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                type: 'solid',
                width: 2
            },
            handle: {
                show: true,
                size: 0
            }

        },
       formatter: (params:any)=>{

       }
    },
        graphic: [],
        xAxis: {
            type: 'category',
            data: <any[]>[],
            axisLine: {
                show:false
            }
        },
        yAxis: {
            type: 'category',
            data:  <any[]>[],
            axisPointer: {
            type: 'none'  // 同时禁用y轴的axisPointer
        },
            axisLine: {
                show:false
            },
             minorSplitLine :{
                show:true
            },
            inverse: true // 让第一天在最上方
        },
          grid: {
            top: "20px",
            left: "20px",
            right: 0,
            bottom: 0,
            containLabel: true
          },
        series: <any[]>[]
         
    };

     