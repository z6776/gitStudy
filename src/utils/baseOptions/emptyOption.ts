import { getRem, scaleByHeight } from '@/utils/function/function'
export const emptyOptions = {
  xAxis: {
    type: 'category',
    data: [
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ],
    show: true,
    boundaryGap: true,
    axisLine: {
      lineStyle: {
        color: '#EEEEEE',
      },
      show: true,
    },
    axisLabel: {
      interval: 0,
      color: '#929FAF',
      fontSize: scaleByHeight(12),
      margin: 4,
    },
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  series: [
    {
      data: Array.from({ length: 12 }).map(() => 80),
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
      markArea: {
        silent: true, // 是否不响应鼠标事件
        label: {
          show: false,
          position: ['50%'], // 标签位置
        },
        itemStyle: {
          color: '#EAFFF9', // 区域颜色
          opacity: 0, // 透明度
        },
        data: [
          [
            {
              yAxis: 20,
              itemStyle: {
                color: '#EAFFF9',
              },
            },
            {
              yAxis: 60,
            },
          ],
        ], // 区域数据
      },
    },
  ],
  backgroundColor: 'transparent',
}

export const emptyOptionsspo = {
  xAxis: {
    type: 'category',
    data: [
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ],
    show: true,
    boundaryGap: true,
    axisLine: {
      lineStyle: {
        color: '#EEEEEE',
      },
      show: true,
    },
    axisLabel: {
      interval: 0,
      color: '#929FAF',
      fontSize: scaleByHeight(12),
      margin: 4,
    },
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  series: [
    {
      data: Array.from({ length: 12 }).map(() => 80),
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
      markArea: {
        silent: true, // 是否不响应鼠标事件
        label: {
          show: true,
          position: 'right',
          offset: [0, 0],
          formatter: () => {
            return '90'
          },
          color: '#fff',
          fontSize: getRem(12),
          fontWeight: 'normal',
        },
        itemStyle: {
          color: '#EAF4FE', // 区域颜色
          opacity: 0, // 透明度
        },
        data: [
          [
            {
              yAxis: 20,
              itemStyle: {
                color: '#EAF4FE',
              },
            },
            {
              yAxis: 60,
            },
          ],
        ], // 区域数据
      },
    },
  ],
  backgroundColor: 'transparent',
}
