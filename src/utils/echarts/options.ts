import { dateFtt } from "@/utils/date/dateFtt";
import { getRem } from "@/utils/function/function";
const time = new Date("2024/5/15 00:00:00").getTime();

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
                fontSize: "40",
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
    color: ['#08DBF8', '#145EFF', '#00B528', '#FF7D01'],
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
    series: <any[]>[
        {
            type: 'pie',
            radius: ['50%', '75%'],
              labelLine: {
                    show: (params: any) => params.value > 0,  // 根据值决定是否显示
                    length: 15,
                    length2: 10,
                    lineStyle: {
                        color: '#ccc'
                    }
                },
            label: {
                formatter: (params: any) => {
                    if(params.value  > 0){
 return `{a|${params.name}} {b|${params.value}人}`
                    }
                   
                },
                rich: {
                    a: {
                        color: '#929FAF',
                        fontSize: getRem(14),
                    },
                    b: {
                        color: "#384951",
                        fontSize: getRem(18),
                        fontWeight: 'bold'
                    }
                }
            },
            data: [
                { value: 0, name: '0-1000步', },
                { value: 0, name: '1001-2000步'  },
                { value: 0, name: '2001-3000步' },
                { value: 0, name: '>3000步'},
            ]
        }
    ]
}
export const sportAgeRangeOption = {
    tooltip: {
        trigger: 'axis',
        show: true,
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,0.7)',
        extraCssText: 'box-shadow: 0 0 24px 0px rgba(146,159,175,0.16); backdrop-filter: blur(6px);-webkit-backdrop-filter: blur(6px);    ',
        formatter: (params: any) => {
            return `
                    <div">
                     <div>${params[0]?.name}</div>
                      <div class="flex items-center">
                        <div style="width: ${getRem(12)}px;height: ${getRem(12)}px;background-color: ${params[0].color};margin-right: 5px;"></div>
                            <div style="font-size: ${getRem(14)}px;color:#929FAF;">平均步数</div>
                            <div style="font-size: ${getRem(14)}px;color:#384951;margin-left: 5px">${params[0]?.data}</div>
                            <div style="font-size: ${getRem(14)}px;color:#929FAF;margin-left: 2px">步</div>
                      </div>
                      <div class="flex items-center">
                        <div style="width: ${getRem(12)}px;height: ${getRem(12)}px;background-color: ${params[1].color};margin-right: 5px;"></div>
                            <div  style="font-size: ${getRem(14)}px;color:#929FAF;">平均运动心率</div>
                             <div style="font-size: ${getRem(14)}px;color:#384951;margin-left: 5px">${params[1]?.data}</div>
                            <div style="font-size: ${getRem(14)}px;color:#929FAF;margin-left: 2px">bpm</div>
                      </div>
                      <div class="flex items-center">
                        <div style="width: ${getRem(12)}px;height: ${getRem(12)}px;background-color: ${params[2].color};margin-right: 5px;"></div>
                            <div style="font-size: ${getRem(14)}px;color:#929FAF;">平均运动时长</div>
                             <div style="font-size: ${getRem(14)}px;color:#384951;margin-left: 5px">${params[2]?.data}</div>
                            <div style="font-size: ${getRem(14)}px;color:#929FAF;margin-left: 2px">分钟</div>
                      </div> 
                    </div>  
                  `
        }
    },
    color: ['#145EFF', '#00B528', '#FF7D01'],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: "5%",
        containLabel: true
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
                show: false
            },
            axisLine: {
                show: true,
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
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                // show: false
            },

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
            splitLine: {
                show: false
            }
        }
    ],
    yAxis: {
        type: 'category',
        data: ['＞50岁', '30-50岁', '＜30岁'],
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
    series: [
        {
            name: '平均步数',
            type: 'bar',
              // 设置同一系列内柱子之间的间距（百分比）
      barGap:1,
      // 设置不同系列之间柱子的间距（百分比）
      barCategoryGap: '30%',
      // 柱子宽度（可以是绝对值像素或百分比）
      barWidth: 10,
            data: <any>[],
            xAxisIndex: 0,
            tooltip: {
                formatter: function (value: any) {
                    return '<div style="font-size: 12px; color: #384951;">' + value + '步</div>';

                }
            },
        },
        {
            name: '平均运动心率',
              // 设置同一系列内柱子之间的间距（百分比）
      barGap: 1,
      // 设置不同系列之间柱子的间距（百分比）
      barCategoryGap: '30%',
      // 柱子宽度（可以是绝对值像素或百分比）
      barWidth: 10,
            type: 'bar',
            data: <any>[],
            xAxisIndex: 1,
            tooltip: {
                valueFormatter: function (value: any) {
                    return value + ' bpm';
                }
            }
        },
        {
            name: '平均运动时长',
            type: 'bar',
               // 设置同一系列内柱子之间的间距（百分比）
      barGap: 1,
      // 设置不同系列之间柱子的间距（百分比）
      barCategoryGap: '30%',
      // 柱子宽度（可以是绝对值像素或百分比）
      barWidth: 10,
            data: <any>[],
            xAxisIndex: 2,
            tooltip: {
                valueFormatter: function (value: any) {
                    return value + ' 分钟';
                }
            }
        }
    ]
}