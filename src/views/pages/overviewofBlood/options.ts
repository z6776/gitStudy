import { dateFtt } from "@/utils/date/dateFtt";
const time = new Date("2024/5/15 00:00:00").getTime();
import { getRem } from "@/utils/function/function";
import { formatter } from "element-plus";
export const sportOpitons = {
    color: ["#00B528", "#08DBF8", "#145EFF"],
    grid: {
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
    },
    series: [
        {
            type: "pie",
            radius: ["65%", "90%"],
            labelLine: {
                show: false,
            },
            emphasis: {
                disabled: true
            },
            label: {
                show: false,
                position: "center",
            },
            data: [
                { value: 0, name: "低强度" },
                { value: 0, name: "中强度" },
                { value: 0, name: "高强度" },
            ],
        },
        {
            z: 100,
            type: "gauge",
            radius: "-50%",
            // center: ['25%', '45%'],// 需和type: 'pie'中的center一致
            // 配置中间的数字的样式
            detail: {
                // 调节数字位置
                offsetCenter: [-0, 0],
                color: "#384951",
                formatter: "{value}",
                fontSize: "28",
                fontWeight: "bold",
            },
            pointer: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            // 中间的字和数字 数据
            data: [
                {
                    value: 0,
                    name: "分钟",
                    title: {
                        show: true,
                        color: "#9296AF",
                        offsetCenter: [0, "-65%"],
                        fontSize: 14,
                    },
                },
            ],
        },
        {
            z: 100,
            type: "gauge",
            radius: "-50%",
            // center: ['25%', '45%'],// 需和type: 'pie'中的center一致
            // 配置中间的数字的样式
            detail: {
                // 调节数字位置
                offsetCenter: [-0, -14],
                color: "#0076F6",
                formatter: "{value}",
                fontSize: "0",
                fontWeight: "bold",
            },
            pointer: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            // 中间的字和数字 数据
            data: [
                {
                    value: 0,
                    name: "总时间",
                    title: {
                        show: true,
                        color: "#9296AF",
                        offsetCenter: [0, "70%"],
                        fontSize: 14,
                    },
                },
            ],
        },
    ],
};

export const hrOptions = {
    grid: {
        left: "10%",
        top: "10%",
        right: "4%",
        bottom: "15%",
    },
    xAxis: {
        type: "time",
        data: [],
        // splitNumber: 12,
        interval: 1,
        min: function (value: any) {
            return value.min;
        },
        max: function (value: any) {
            return value.max;
        },
        axisLabel: {
            color: "#9296AF",
            formatter: "{HH}:{mm}",
            // interval:5
            hideOverlap: true,
            showMaxLabel: true
        },
        axisLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
                color: "#9296AF",
            },
        },
    },
    yAxis: {
        type: "value",
        axisLabel: {
            color: "#9296AF",
        },
        splitLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        min: 0,
        max: 180,
        interval: 30,
    },
    backGroundColor: "#000000",
    series: [
        {
            data: <any>[],
            type: "line",
            connectNulls: false,
            lineStyle: {
                color: "#9296AF",
                width: "2",
            },
            symbol: "none",
        },
        {
            data: <any>[],
            type: "line",
            connectNulls: false,
            lineStyle: {
                color: "#07C160",
                width: "2",
            },
            symbol: "none",
        },
    ],
};
export const sleepOptions = {
    tooltip: {
        backgroundColor: "rgba(0,0,0,.7)"
    },
    grid: {
        left: "45",
        right: "4%",
        bottom: "20",
        top: "5%",
    },
    xAxis: {
        type: "value",
        max: 144,
        min: 0,
        interval: 12,
        axisLabel: {
            formatter: (params: any) => {
                // console.log(params);
                return dateFtt("hh:MM", new Date(params * 600000 + time));
            },
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            //x轴刻度相关设置
            alignWithLabel: true,
        },
    },
    formatter: (params: any) => { },
    yAxis: {
        type: "category",
        data: <any[]>[],
        splitLine: {
            show: true,
        },
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        zlevel: 2,
    },
    series: <any[]>[]
}
export const sleepPercentOptions = {
    color: ["#FB7374", "#BE2ECD", "#A241EA"],
    series: [
        {
            type: "pie",
            radius: ["50%", "75%"],
            labelLine: {
                show: false,
            },
            emphasis: {
                disabled: true
            },
            label: {
                show: false,
                position: "center",
            },
            data: [
                { value: 0, name: "轻度睡眠" },
                { value: 0, name: "中毒睡眠" },
                { value: 0, name: "深度睡眠" },
            ],
        }
    ],
}
export const sleepHrOptions = {
    grid: {
        left: "5%",
        top: "15%",
        right: "0%",
        bottom: "5%",
    },
    xAxis: {
        type: "category",
        data: <any>[],
        axisLabel: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        axisTick: {
            show: false,
        },
    },
    yAxis: {
        type: "value",
        axisLabel: {
            color: "#9296AF",
            fontSize: 12
        },
        splitLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        axisLine: {
            show: false
        },
        min: 0,
        max: (params: any) => {
            return (params.max < 150) ? 150 : (params.max + (30 - (params.max % 30)));
        },
        interval: 30,
    },
    backGroundColor: "#000000",
    series: [
        {
            data: <any>[],
            type: "line",
            connectNulls: false,
            lineStyle: {
                color: "#07C160",
                width: "2",
            },
            symbol: "none",
        }
    ],
}
export const sleepSpo2Options = {
    grid: {
        left: "5%",
        top: "15%",
        right: "0%",
        bottom: "5%",
    },
    xAxis: {
        type: "category",
        data: <any>[],
        axisLabel: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        axisTick: {
            show: false,
        },
    },
    yAxis: {
        type: "value",
        axisLabel: {
            color: "#9296AF",
            fontSize: 12
        },
        splitLine: {
            lineStyle: {
                color: "#EEEEEE",
            },
        },
        axisLine: {
            show: false
        },
        min: 0,
        max: 100,
        interval: 25,
    },
    backGroundColor: "#000000",
    series: [
        {
            data: <any>[],
            type: "line",
            connectNulls: false,
            lineStyle: {
                color: "#07C160",
                width: "2",
            },
            symbol: "none",
        }
    ],
}
export const sportPercentChartOption = {
    color: ['#F08B2E', '#24B287', '#0477E0'],
    tooltip: {
        show: true,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        formatter: (params: any) => {

            return `
                    <div style='font-size: 13px;color: #636676;'>${params.name}</div>
                    <div style='display:flex;'>
                    <div style='margin-right:30px;color: #929FAF;font-size: 12px;display:flex;align-items: center;'>
                        <div style='width: 8px;height: 8px;background-color: ${params.color};margin-right:10px;'></div>
                        <div>人数占比</div>
                    </div>
                    <div style='font-size: 13px;color: #384951;'>${params.percent}%</div>
                    </div>
            `
        }
    },
    series: [
        {
            type: 'pie',
            radius: ['50%', '75%'],
            label: {
                formatter: (params: any) => {
                     const data = params.data;
                    return `{a|${params.name}} {b|${data.num}人}`
                },
                rich: {
                    a: {
                        color: '#929FAF'
                    },
                    b: {
                        color: "#384951",
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                }
            },
            data: [
                { value: 0, name: '血糖偏高',num: 0 },
                { value: 0, name: '血糖正常',num: 0  },
                { value: 0, name: '血糖偏低',num: 0  },
            ]
        }
    ]
}
export const sportAgeRangeOption = {
    color: ['#24B287', '#FF7D01'],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: "5%",
        containLabel: false
    },
    xAxis: [
    {
        type: 'value',
        max: (params: any) => {
            return params.max + (100 - (params.max % 100));
        },
        min: 0,
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        
        splitLine: {
            show: true, // 开启分割线
            lineStyle: {
                color: '#E8E8E8', // 分割线颜色
                type: 'solid', // 可选：'solid' | 'dashed' | 'dotted'
                width: 1
            },
            interval: 0 // 0表示显示所有分割线，可以设置为数字控制间隔
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: '#eee'
            }
        }
    },
    {
        type: 'value',
        max: (params: any) => {
            return params.max + (30 - (params.max % 30));
        },
        interval: 30,
        min: 0,
         axisLine:{
            show:false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        splitLine: {
            show: true, // 显示竖线
            lineStyle: {
                color: '#E8E8E8',
                type: 'dashed', // 虚线
                width: 1
            }
        }
    },
    {
        type: 'value',
        max: (params: any) => {
            return params.max + (10 - (params.max % 10));
        },
        min: 0,
        interval: 5,
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        axisLine:{
            show:false
        },
        splitLine: {
            show: true, // 显示竖线
            lineStyle: {
                color: '#E8E8E8',
                type: 'solid', // 实线
                width: 1,
                opacity: 0.6 // 透明度
            }
        }
    }
], 
    yAxis: {
         name: '单位：mmol/L',  // 在坐标轴名称中加入单位
           nameTextStyle: {
             align: 'right',         // 文字对齐方式
    verticalAlign: 'bottom',
                color: '#666',
                fontSize:getRem(12) ,
                lineHeight:getRem(10),
                padding: [10, 0, 0, 0]  // 调整位置
            },
        type: 'category',
        data: ['<3.9', '3.9~4.4', '4.5~6.1', '6.2~7.0', '7.1~11.1', '11.2~13.9', '14~16', '＞16'],
        axisLine: {
            lineStyle: {
                color: '#EEEEEE'
            }
        },
        axisTick: {
            show: false
        },
        
        axisLabel: {
            color: '#929FAF'
        }
    },
     tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        backgroundColor: '#FFFFFF', // 白色背景
        borderColor: '#E4E7ED',
        borderWidth: 1,
        textStyle: {
            color: '#333333' // 文字颜色
        },
        padding: [12, 12], // 内边距
        formatter: function(params:any) {
            // params是一个数组，包含每个系列的数据
            const categoryIndex = params[0].dataIndex;
            const category = sportAgeRangeOption.yAxis.data[categoryIndex];
            
            // 构建tooltip内容
            let html = `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #636676;">${category}mmol/L
            </div>`;
            
            params.forEach((param:any) => {
                const color = param.color;
                const seriesName = param.seriesName;
                const value = param.value || 0;
                
                html += `
                <div style="display: flex; align-items: center; margin: 6px 0;">
                    <div style="width: 14px; height: 14px; background-color: ${color}; margin-right: 8px;"></div>
                    <span style="flex: 1; color: #666;font-size: 14px;margin-right:14px">${seriesName}</span>
                    <span style="font-weight: bold; color: #333;font-size: 14px;">${value}人</span>
                </div>`;
            });
            
            return html;
        }
    },
    series: [
        {
            name: '病区普通患者',
            type: 'bar',
            data: <any>[],
            xAxisIndex: 0,
            barWidth: 10,
            tooltip: {
                // valueFormatter: function (value: any) {
                //     // return value + ' 步';
                // }
            },
        },
        {
            name: '病区糖尿病患者',
            type: 'bar',
            data: <any>[],
            barWidth: 10,
            xAxisIndex: 1,
            tooltip: {
                // valueFormatter: function (value: any) {
                //     return value + ' bpm';
                // }
            }
        }
    ]
}


export const sugerOptions = {
  xAxis: {
    type: 'category',
    data: <string[]>[],
    show: true,
    boundaryGap: false,
    axisTick:{
        show:false,
    }, axisLine:{
      show:false,  
     
    },
    axisLabel: {
      fontSize: getRem(12),
    },
  },
  yAxis: {
    type: 'value',
    show: true,
    min: 0,
    max:(max:any)=>{
        const _v = max.value || 20;
        return Math.ceil((_v+10)-(_v+10)%5);
    },
    axisLabel: {
      fontSize: getRem(12),
    },
    splitLine:{
        lineStyle:{
              color:"#EEEEEE"
        }
     
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
        type: 'line',
    },
    formatter: function (params: any) {
        if(Array.isArray(params)){
               let item = params.find((item: any) => item.value);
                if (!item) {
                    return ""
                }
                return item.name + '<br/>' + item.seriesName + ' : ' + item.value + ' mmol/L'
        }
        return ""
    }
  },
  grid: {
    top: 10,
    left: 20,
    right: 20,
    bottom: 20,
    containLabel: true,
  },
  
  series: [
    {
      data:<any> [],
      type: 'line',
      smooth: false, // 平滑曲线
      symbol: 'none',
      // zlevel: 1,
      label: {
        show: false,
        position: 'top',
        offset: [0, 5],
        fontSize: getRem(12),
        color: '#5BDD56',
        fontStyle: 'normal',
        fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
      },
      itemStyle: {
        color: '#5BDD56',
      },
      lineStyle: {
        color: "red",
        width: getRem(2),
      },
      
      markLine: {
       
        lineStyle: {
          color: '#F04A4B',
          type: 'solid',
        },
        symbol: ['none', 'none'],
        label: { show: false },
        data:<any[]> [],
      }
    },
  ],
      graphic: <any>[
   
  ],
  backgroundColor: 'transparent',
}