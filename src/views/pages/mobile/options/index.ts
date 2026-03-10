
 function getRem(fontSize: number, baseScreenWidth = 720) {
  // 获取当前屏幕宽度
  const clientWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return fontSize
  // 计算比例
  const scale = clientWidth / baseScreenWidth
  return Math.ceil(fontSize * scale)
}
export function scaleByHeight(base: number, baseScreenHeight = 1440) {
  // 获取当前屏幕宽度
  const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  if (!clientHeight) return base
  // 计算比例
  const scale = clientHeight / baseScreenHeight
  return Math.ceil(base * scale)
}
const AXISLABEL_FONTSIZE = getRem(12);
const LABEL_FONTSIZE = getRem(12);
const MARKLABEL_FONTSIZE = getRem(9);
const LABEL_MARKPOINT = getRem(4);
const SHAPEX = getRem(530);
const SHAPEY = scaleByHeight(70);

export const emptyOptions = {
   xAxis: {
    type: 'category',
   data: ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"],
    show: true,
    axisLine:{
       show:false
    },
    axisLabel: {
      fontSize: AXISLABEL_FONTSIZE,
      margin:4
    },
    axisTick: {
      show: false,
    },
    boundaryGap: true,
  },
   yAxis: {
    type: 'value',
    show: false,
    min: 0,
    max: 220,
  },
  grid: {
    show:true,
    borderColor:"#384951",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width:519,
    height: 111
  },
  series: [
    {
      data: Array.from({ length: 12 }).map(() => 0),
      type: 'line',
      smooth: false, 
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
        color: '#5BDD56', // 线条颜色
        width: getRem(0),
      },
     markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: {
            type: 'dashed',
            color: '#384951'
        },
        data: [
            // 在每个数据点添加垂直线
            ...Array.from({ length: 12 }).map((_, index) => ({
                xAxis: index,
                label: { show: false }
            }))
        ]
    }
    },
  ],
  backgroundColor: 'transparent',
}

//
export const hrOptions = {
  xAxis: {
    type: 'category',
    data: [],
    show: true,
    axisLine:{
       show:false
    },
    axisLabel: {
      fontSize: AXISLABEL_FONTSIZE,
      margin:4
    },
    axisTick: {
      show: false,
    },
    boundaryGap: true,
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 0,
    max: 220,
  },
  grid: {
    show:true,
    borderColor:"#384951",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width:519,
    height: 111
  },
  //  graphic,
  series: [
    {
      data: [], 
      type: 'line',
      smooth: false, 
      symbol: 'circle', 
        symbolSize: LABEL_MARKPOINT,
      label: {
        show: true,
        position: 'top',
        fontSize: LABEL_FONTSIZE,
        offset: [0, 5],
        color: '#5BDD56',
        fontStyle: 'normal',
          fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
      },
      itemStyle: {
        color: '#5BDD56',
      },
      lineStyle: {
        color: '#5BDD56', // 线条颜色
        width: getRem(2),
      },

      markPoint: {
        data: [],
        symbol: 'circle',
        symbolSize: LABEL_MARKPOINT,
        label: {
          borderRadius: 2,
          backgroundColor: '#DA4343',
          padding: [getRem(3), getRem(3), getRem(3), getRem(3)],
          position: 'top',
          fontSize: MARKLABEL_FONTSIZE,
          color: '#fff',
          fontStyle: 'normal',
            fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
          show: true,
        },
        itemStyle: {
          color: '#DA4343',
        },
      },
        markLine: {
               z: 1,
        silent: true,
        symbol: 'none',
        lineStyle: {
            type: 'dashed',
            color: '#384951'
        },
        data: [
            // 在每个数据点添加垂直线
            ...Array.from({ length: 12 }).map((_, index) => ({
                xAxis: index,
                label: { show: false }
            }))
        ]
    }
    },
  ],
  backgroundColor: 'transparent',
}

export const spoOptions = {
xAxis: {
    type: 'category',
    data: [],
    show: true,
    axisLine:{
       show:false
    },
    axisLabel: {
      fontSize: AXISLABEL_FONTSIZE,
       margin:4
    },
    axisTick: {
      show: false,
    },
    boundaryGap: true,
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 0,
    max: 220,
  },
  grid: {
     show:true,
    borderColor:"#384951",
      top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width:519,
    height: 111,
  },
    // graphic,
  series: [
    {
      data: [], 
      type: 'line',
      smooth: false, 
      symbol: 'circle', 
        symbolSize: LABEL_MARKPOINT,
      label: {
        show: true,
        position: 'top',
        fontSize:  LABEL_FONTSIZE,
        offset: [0, 5],
        color: '#56E3E1',
         fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
      },
      itemStyle: {
        color: '#56E3E1',
      },
      lineStyle: {
        color: '#56E3E1',
        width: getRem(2),
      },
      markLine: {
        z: 1,
        lineStyle: {
          color: '#314349',
          type: 'dashed',
        },
        symbol: ['none', 'none'],
        label: { show: false },
        data: [],
      },
      markPoint: {
        data: [],
        symbol: 'circle',
        symbolSize: LABEL_MARKPOINT,
        label: {
          borderRadius: 2,
          backgroundColor: '#DA4343',
          padding: [getRem(3), getRem(3), getRem(3), getRem(3)],
          show: true,
          position: 'top',
          fontSize: MARKLABEL_FONTSIZE,
          color: '#fff',
          fontStyle: 'normal',
            fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
        },
        itemStyle: {
          color: '#DA4343',
        },
      },
      
    },
  ],
  backgroundColor: 'transparent',
}


export const NibpOptions = {
xAxis: {
    type: 'category',
    data: [],
    show: true,
    axisLine:{
       show:false
    },
    axisLabel: {
      fontSize: AXISLABEL_FONTSIZE,
       margin:4
    },
    axisTick: {
      show: false,
    },
    boundaryGap: true,
  },
  yAxis: {
    type: 'value',
    show: false,
    min: -20,
    max: 220,
  },
  grid: {
     show:true,
    borderColor:"#384951",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width:519,
      height: 130,
  },
    // graphic,
  series: [
    {
      data: [], 
      type: 'line',
      smooth: false, 
      symbol: 'circle', 
        symbolSize: LABEL_MARKPOINT,
      label: {
        show: true,
        position: 'top',
        fontSize: LABEL_FONTSIZE,
        offset: [0, 5],
        color: '#ffffff',
        fontStyle: 'normal',
          fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
      },
      itemStyle: {
        color: '#ffffff',
      },
      lineStyle: {
        color: '#ffffff',
        width: getRem(2),
      },
      markLine: {
        z: 1,
        lineStyle: {
          color: '#314349',
          type: 'dashed',
        },
        symbol: ['none', 'none'],
        label: { show: false },
        data: [],
      },
      markPoint: {
        data: [],
        symbol: 'circle',
        symbolSize: LABEL_MARKPOINT,
        label: {
          borderRadius: 2,
          backgroundColor: '#DA4343',
          padding: [getRem(3), getRem(3), getRem(3), getRem(3)],
          show: true,
          position: 'top',
          fontSize: MARKLABEL_FONTSIZE,
          color: '#fff',
          fontStyle: 'normal',
            fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
        },
        itemStyle: {
          color: '#DA4343',
        },
      },
      
    },
      {
      data: [], 
      type: 'line',
      smooth: false, 
      symbol: 'circle', 
        symbolSize: LABEL_MARKPOINT,
      label: {
        show: true,
        position: 'bottom',
        fontSize: LABEL_FONTSIZE,
        offset: [0, 5],
        color: '#D8D8D8',
        fontStyle: 'normal',
          fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
      },
      itemStyle: {
        color: '#ffffff',
      },
      lineStyle: {
        color: '#ffffff',
        width: getRem(2),
      },
      markLine: {
        z: 1,
        lineStyle: {
          color: '#314349',
          type: 'dashed',
        },
        symbol: ['none', 'none'],
        label: { show: false },
        data: [],
      },
      markPoint: {
        data: [],
        symbol: 'circle',
        symbolSize: LABEL_MARKPOINT,
         label: {
                  show: true,
                  offset: [0,0],
                  backgroundColor: '#DA4343',
                  padding: [getRem(3), getRem(3), getRem(3), getRem(3)],
                  position: 'bottom',
                  fontSize: MARKLABEL_FONTSIZE,
                  color: '#ffffff',
                  fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
                },
        itemStyle: {
          color: '#DA4343',
        },
      },
      
    }
  ],
  backgroundColor: 'transparent',
}

type DataPoint = [number, number][]
export const electrocardiogramOptions = {
  xAxis: {
    type: 'time',
    data: <number[]>[],
    show: false,
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  backgroundColor: 'transparent',
  grid: {
     show:true,
    borderColor:"#384951",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zlevel: 99,
  },
  series: [
    {
      data: <DataPoint>[],
      type: 'line',
      smooth: true,
      color: '#FF4DA3',
      symbol: 'none',
      lineStyle: {
        width: 1,
      },
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      show: true, 
      start: 90,
      end: 100,
    },
  ],
}
