// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";

import { LineChart, PieChart, BarChart ,GaugeChart,ScatterChart} from "echarts/charts";

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent
} from "echarts/components";

// 标签自动布局
import { LabelLayout, UniversalTransition } from "echarts/features";

// 引入 Canvas 渲染器
import { CanvasRenderer } from "echarts/renderers";

// 注册
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LabelLayout,
  MarkLineComponent,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  GaugeChart,
  MarkPointComponent,
  DataZoomComponent,
  ScatterChart
]);
export default echarts;
