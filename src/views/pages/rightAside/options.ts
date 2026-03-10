import {Md5} from 'ts-md5';
export const calOption = {
    grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: "10",
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            axisLine: {
                onZero: false,
                itemStyle: {
                    color: '#CDCDCD'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#9296AF'
            },
        },

    ],
    yAxis: [
        {
            type: 'value',
            startValue: -1,
            splitLine: {
                showMinLine: false,
                // showMaxLine: false,
                lineStyle: {
                    color: '#EEEEEE'
                }
            },
            // interval: 10,
            max: (val: { max: number; }) => {
                return val.max + (val.max % 10 < 5 ? 10 - val.max % 10 : 20 - val.max % 10)
            },
            axisLabel: {
                margin: 14,
                color: '#9296AF',
                showMinLabel: false,
            },
        }
    ],
    series: [
        {
            name: 'sleep',
            type: 'bar',
            stack: 'a',
            barWidth: 11,
            itemStyle: {
                color: '#6377F5',
            },
            data: [],
            markArea: {
                silent: true,
                itemStyle: {
                    color: '#E5E9FFaa'
                },
                data: [
                    [
                        {
                            xAxis: '00:00'
                        },
                        {
                            xAxis: '07:00'
                        }
                    ],
                    [
                        {
                            xAxis: '21:00'
                        },
                        {
                            xAxis: '23:00'
                        }
                    ]
                ]
            }
        },
        {
            name: 'active',
            type: 'bar',
            stack: 'a',
            itemStyle: {
                color: '#07C160'
            },
            label: {
                show: true,
                position: 'top',
                color: "#636676"
            },
            data: []
        }
    ]

}
export const hrOption = {
    grid: {
        left: '10',
        right: '16',
        bottom: '0',
        top: "10",
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            axisLine: {
                onZero: false,
                itemStyle: {
                    color: '#CDCDCD'
                }
            },
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#9296AF'
            },
        },

    ],
    yAxis: [
        {
            type: 'value',
            startValue: 0,
            splitLine: {
                showMinLine: false,
                lineStyle: {
                    color: '#EEEEEE'
                }
            },
            axisLabel: {
                margin: 14,
                color: '#9296AF'
            },
            max: (value: { max: number; }) => {
                return value.max <= 150 ? 160 : 200
            },
            // axisLabel: {
            //     showMaxLabel: false,
            // },
            interval: 40,
        }
    ],
    series: [
        {
            name: 'sleep',
            type: 'line',
            itemStyle: {
                color: '#07C160',
                borderWidth: 2,
                borderColor: "#fff"
            },
            lineStyle: {
                color: '#07C160'
            },
            label: {
                show: true,
                rich: {
                    highBg: {
                        color: '#E24040', // 文字颜色
                    }
                }
            },
            data: [],
            symbol: 'circle',
            symbolSize: 8,
            connectNulls: true,
            markArea: {
                silent: true,
                itemStyle: {
                    color: '#E5E9FFaa'
                },
                data: [
                    [
                        {
                            xAxis: '00:00'
                        },
                        {
                            xAxis: '07:00'
                        }
                    ],
                    [
                        {
                            xAxis: '21:00'
                        },
                        {
                            xAxis: '23:00'
                        }
                    ]
                ]
            },
            markLine: {
                symbol: ["none", "none"], //['none']表示是一条横线；['arrow', 'none']表示线的左边是箭头，右边没右箭头；['none','arrow']表示线的左边没有箭头，右边有箭头
                label: {
                    position: "insideStartTop", //将警示值放在哪个位置，三个值“start”,"middle","end" 开始 中点 结束
                    color: "#E24040",
                },
                data: [
                    {
                        yAxis: 100,
                        lineStyle: {
                            //警戒线的样式 ，虚实 颜色
                            type: "dashed", //样式  ‘solid’和'dotted'
                            color: "#E24040",
                            width: 1, //宽度
                        },
                        label: {
                            //   formatter: "高心率阈值：{c}",
                        },
                    },
                    {
                        yAxis: 60,
                        lineStyle: {
                            //警戒线的样式 ，虚实 颜色
                            type: "dashed", //样式  ‘solid’和'dotted'
                            color: "#E24040",
                            width: 1, //宽度
                        },
                        label: {
                            //   formatter: "低心率阈值：{c}",
                        },
                    },
                ],
            },
        },
    ]
}
import {dateFtt} from "@/utils/date/dateFtt";
export const sleepOption = {
    grid: {
        left: '50',
        right: '20',
        bottom: '0',
        top: "0",
        containLabel: true
    },
    tooltip: {
        triggerOn: 'click',
        formatter: function (params:any) {
            return ''
        },
    },

    xAxis: {
        type: 'category',
        axisTick: {
            show: false
        },
        axisLabel: {
            showMinLabel: true,
            showMaxLabel: true,
            boundaryGap: 0,
            interval: 17,
            formatter: function (value:number) {
                return dateFtt('hh:MM', new Date(Number(value)))
            },
            color: "#9296AF",
        },
        axisLine: {
            lineStyle: {
                color: '#EEEEEE'
            }
        },
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
    },
    yAxis: {
        type: 'value',
        interval: 1,
        axisTick: {
            alignWithLabel: false
        },
        splitLine: {
            lineStyle: {
                color: '#EEEEEE'
            }
        },
        axisLabel: {
            color: "#9296AF",
            lineHeight: 18,
            // fontFamily: 'Source Han Sans CN-Regular',
            position: 'inside', // 将标签放置在刻度内部
            customValues: [0.5, 1.5, 2.5, 3.5],
            formatter: (value: number) => {
                // 将数值映射为文字标签
                let labels = '';
                if (value == 0.5) {
                    labels = '深度\n睡眠';
                }
                if (value == 1.5) {
                    labels = '中度\n睡眠';
                }
                if (value == 2.5) {
                    labels = '轻度\n睡眠';
                }
                if (value == 3.5) {
                    labels = '零星小睡\n或静息';
                }
                return labels;
            }
        }
    },
    series: [
        {
            name: '深度睡眠',
            type: 'bar',
            stack: 'a',
            data: [], // 数据
            barGap: '0%', // 柱体间隔为 0
            barCategoryGap: '0%', // 类目间隔为 0
            barWidth: '120%', // 设置柱体宽度为 100
            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 10) {
                    //     color = '#6377F5';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        },
        {
            name: '中度睡眠',
            type: 'bar',
            stack: 'a',
            data: [], // 数据
            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 9) {
                    //     color = '#9E4AE3';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        },
        {
            name: '轻度睡眠',
            type: 'bar',
            stack: 'a',
            data: [], // 数据

            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 1) {
                    //     color = '#ED95F7';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        },
        {
            name: '零星小睡',
            type: 'bar',
            stack: 'a',
            data: [], // 数据

            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 3) {
                    //     color = '#80BAFA';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        }
    ]
}

export const emptyOption = {
  backgroundColor: "#fff",
  tooltip: { trigger: "axis" },
  grid: {
        left: '50',
        right: '20',
        bottom: '0',
        top: "0",
        containLabel: true
    },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [
      "21:00",
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ],
    axisLine: { lineStyle: { color: "#F5F7FB" } },
    axisLabel: {
         showMinLabel: true,
            showMaxLabel: true,
            boundaryGap: 0,
            interval: 0,
            lineHeight: 18,
            formatter: function (value:number) {
                
            },
            color: "#9296AF"
     },
  },
  yAxis: {
    type: "category",
    axisLine: { lineStyle: { color: "#F5F7FB" } },
    axisLabel: { color: "#929FAF", lineHeight: 18, fontSize: 12,  interval: 1},
  },
   series: [
        {
            name: '深度睡眠',
            type: 'bar',
            stack: 'a',
            data: [], // 数据
            barGap: '0%', // 柱体间隔为 0
            barCategoryGap: '0%', // 类目间隔为 0
            barWidth: '120%', // 设置柱体宽度为 100
            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 10) {
                    //     color = '#6377F5';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        },
        {
            name: '中度睡眠',
            type: 'bar',
            stack: 'a',
            data: [], // 数据
            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 9) {
                    //     color = '#9E4AE3';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        },
        {
            name: '轻度睡眠',
            type: 'bar',
            stack: 'a',
            data: [], // 数据

            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 1) {
                    //     color = '#ED95F7';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        },
        {
            name: '零星小睡',
            type: 'bar',
            stack: 'a',
            data: [], // 数据

            itemStyle: {
                color: function (params:any) {
                    let index = params.dataIndex,
                        color = 'transparent';
                    //   if (sleep_text[index] == 3) {
                    //     color = '#80BAFA';
                    //   } else {
                    //     color = 'transparent';
                    //   }
                    return color;
                }
            }
        }
    ]
}

export const pieOption = {
    color: ['#FE8712', '#08DBF8', '#6377F5'],
    series: {
        type: 'pie',
        
        radius: [41, 55],
        left: 'center',
        width: '100%',
        itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
        },
        label: {
            alignTo: 'edge',
            formatter: '{name|{b}} {time|{c} %}\n',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            fontSize: 14,
            rich: {
                time: {
                    fontSize: 14,
                    color: 'inherit'
                }
            }
        },
        labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80
        },
        labelLayout: function (params: { labelRect: { x: number; width: any; }; labelLinePoints: any; }) {
            // const isLeft = params.labelRect.x < myChart.getWidth() / 2;
            // const points = params.labelLinePoints;
            // // Update the end point.
            // points[2][0] = isLeft
            //     ? params.labelRect.x
            //     : params.labelRect.x + params.labelRect.width;
            // return {
            //     labelLinePoints: points
            // };
        },
        data: [
            { name: '疑似离床', value: 1 },
            { name: '轻度动作', value: 1 },
            { name: '睡眠或静息', value: 43 }
        ]
    }
};

export const dayActiveLineOption = {
    grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: "20",
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisLine: {
                itemStyle: {
                    color: '#CDCDCD'
                }
            },
            boundaryGap: true,
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#9296AF'
            },
        },

    ],
    yAxis: [
        {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: '#EEEEEE'
                }
            },
            max:(p:any)=>{
                return (p?.max + 5)%5 > 0 ? (p?.max + 5) - (p?.max + 5)%5 : p?.max + 5;
            },
            axisLabel: {
                margin: 14,
                color: '#9296AF',
            },
        }
    ],
    series: [
        {
            type: 'line',
            itemStyle: {
                color: '#3889FF',
                borderWidth: 2,
                borderColor: "#fff"
            },
            lineStyle: {
                color: '#3889FF'
            },
            label: {
                show: true,
                rich: {
                    highBg: {
                        color: '#252B50', // 文字颜色
                    }
                }
            },
            data: [],
            symbol: 'circle',
            symbolSize: 8,
            connectNulls: true,
        },
    ]
}

export const nightActiveLineOption = {
    grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: "20",
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisLine: {
                itemStyle: {
                    color: '#CDCDCD'
                }
            },
            boundaryGap: true,
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#9296AF'
            },
        },

    ],
    yAxis: [
        {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: '#EEEEEE'
                }
            },
            axisLabel: {
                margin: 14,
                color: '#9296AF'
            },
            max: (value: { max: number; }) => {
                return value.max <= 4 ? 5 : value.max + 2
            },
        }
    ],
    series: [
        {
            type: 'line',
            itemStyle: {
                color: '#3889FF',
                borderWidth: 2,
                borderColor: "#fff"
            },
            lineStyle: {
                color: '#3889FF'
            },
            label: {
                show: true,
                rich: {
                    highBg: {
                        color: '#E24040', // 文字颜色
                    }
                }
            },
            data: [],
            symbol: 'circle',
            symbolSize: 8,
            connectNulls: true,
        },
    ]
}
 

export const md5Str = (str: string) => {
    if(str){
      let _str = String(str)
       return Md5.hashStr(_str) + "xoJWeO24ZLU3xibLDv8aGaqN4M33Ee"       
    }
    return ""
  }

export const suggestcontent = [{
    title: '中度睡眠比例偏高',
    content:"中度睡眠是过渡到深度睡眠的重要阶段。中度睡眠比例较高，可能意味着您的睡眠结构不够理想，睡眠较浅。建议您日间适度有氧运动(如快走、游泳)可有效调整中度睡眠比例，但避免睡前剧烈运动。"
},{
    title: '轻度睡眠比例偏低',
    content:"轻度睡眠是睡眠的初始阶段，比例过低可能意味着您直接进入了较深的睡眠阶段，这可能是由于过度疲劳所致。建议您睡前1小时避免使用电子设备;限制咖啡因和酒精摄入。" 
}]