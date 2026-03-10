import { getRem } from "@/utils/function/function";
// 更新y轴为4.8的位置的直线
export const updateReferenceLine = (chartInstance: any, yAxisValue: number = 4.8) => {
  if (!chartInstance) return;
  
  // 获取y轴范围
  const yAxis = chartInstance.getModel().getComponent('yAxis', 0);
  const axisScale = yAxis.axis.scale;
  
  // 计算4.8在图表中的像素位置
  const pixelY = axisScale.getPixelForValue(yAxisValue);
  
  // 获取grid区域
  const grid = chartInstance.getModel().getComponent('grid', 0);
  const gridRect = grid.gridRect;
  
  // 更新graphic中的直线
  const newGraphic = {
    id: 'line-4.8',
    type: 'line',
    shape: {
      x1: gridRect.x,  // 左边起始点
      y1: pixelY,
      x2: gridRect.x + gridRect.width,  // 右边结束点
      y2: pixelY
    },
    style: {
      stroke: '#ff0000',
      lineWidth: 2,
      lineDash: [5, 5]
    },
    zlevel: 1
  };

  // 更新图表
  chartInstance.setOption({
    graphic: [newGraphic]
  });
};

// 添加文字标签的函数
export const addReferenceLineLabel = (chartInstance: any, yAxisValue: number = 4.8, labelText: string = '4.8') => {
  if (!chartInstance) return;
  
  const yAxis = chartInstance.getModel().getComponent('yAxis', 0);
  const axisScale = yAxis.axis.scale;
  const pixelY = axisScale.getPixelForValue(yAxisValue);
  
  const grid = chartInstance.getModel().getComponent('grid', 0);
  const gridRect = grid.gridRect;
  
  // 添加文字标签
  const labelGraphic = {
    type: 'text',
    id: 'label-4.8',
    style: {
      text: labelText,
      fill: '#ff0000',
      fontSize: getRem(12),
      fontFamily: 'Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30'
    },
    position: [gridRect.x + gridRect.width + 10, pixelY - 8],  // 在直线右侧显示
    zlevel: 1
  };
  
  chartInstance.setOption({
    graphic: [{
      id: 'line-4.8',
      type: 'line',
      shape: {
        x1: gridRect.x,
        y1: pixelY,
        x2: gridRect.x + gridRect.width,
        y2: pixelY
      },
      style: {
        stroke: '#ff0000',
        lineWidth: 2,
        lineDash: [5, 5]
      },
      zlevel: 1
    }, labelGraphic]
  });
};
