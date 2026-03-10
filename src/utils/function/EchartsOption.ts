interface FormatterParams {
    componentType: 'series',
    // 系列类型
    seriesType: string,
    // 系列在传入的 option.series 中的 index
    seriesIndex: number,
    // 系列名称
    seriesName: string,
    // 数据名，类目名
    name: string,
    // 数据在传入的 data 数组中的 index
    dataIndex: number,
    // 传入的原始数据项
    data: Object,
    // 传入的数据值。在多数系列下它和 data 相同。在一些系列下是 data 中的分量（如 map、radar 中）
    value: number|Array<any>|Object,
    // 坐标轴 encode 映射信息，
    // key 为坐标轴（如 'x' 'y' 'radius' 'angle' 等）
    // value 必然为数组，不会为 null/undefined，表示 dimension index 。
    // 其内容如：
    // {
    //     x: [2] // dimension index 为 2 的数据映射到 x 轴
    //     y: [0] // dimension index 为 0 的数据映射到 y 轴
    // }
    encode: Object,
    // 维度名列表
    dimensionNames: Array<String>,
    // 数据的维度 index，如 0 或 1 或 2 ...
    // 仅在雷达图中使用。
    dimensionIndex: number,
    // 数据图形的颜色
    color: string,
    // 饼图/漏斗图的百分比
    percent: number,
    // 旭日图中当前节点的祖先节点（包括自身）
    treePathInfo: Array<any>,
    // 树图/矩形树图中当前节点的祖先节点（包括自身）
    treeAncestors: Array<any>,
    // 坐标轴标签文本是否溢出隐藏，可以使用此函数判断是否需要弹出提示框
    isTruncated: Function,
    // 当前坐标轴标签刻度索引
    tickIndex: number
}
interface EOption {
    xAxisType?: "value" | "category" | "time" | "log"; // 轴类型
    xAxisShow?: boolean; // x轴是否显示
    xAxisMin?: any; // x轴最小值
    xAxisMax?: any; // x轴最大值
    xaxisLineShow?: boolean; // x轴线是否显示
    xaxisLineColor?: string; // x轴颜色
    xaxisLineWidth?: string; // x轴宽度
    xaxisTickShow?: boolean; // x轴刻度是否显示
    xaxisTickInside?: boolean; // x轴刻度是否在内部
    xaxisTickColor?: string; // x轴刻度颜色
    xaxisTickWidth?: number; // x轴刻度宽度
    xaxisLabelShow?: boolean; // x轴标签是否显示
    xaxisLabelColor?: string; // x轴标签颜色
    xaxisLabelFontSize?: number; // x轴标签字体大小
    xaxisLabelInterval?: number; // x轴标签间隔
    xaxisLabelMargin?: number; // x轴标签距离轴线间距
    xaxisLabelFormatter?: string | Function; // x轴标签格式化
    xshowMinLabel?: boolean; // 是否显示最小值标签
    xshowMaxLabel?: boolean; // 是否显示最大值标签
    xalignMinLabel?: 'left' | 'center' | 'right'; // 最小值标签对齐方式
    xalignMaxLabel?: 'left' | 'center' | 'right',
    xcustomValues?: any[]; // 自定义显示x轴数据
    xsplitLineShow?: boolean; // 分割线是否显示
    xsplitLineColor?: string; // 分割线颜色
    xsplitLineWidth?: number; // 分割线宽度
    xaxisData?: any[]; // x轴数据
}
type AllOptions = {
    x: EOption;
    y: EOption;
} 
type graphicType = 'image'| 'text'| 'circle'| 'sector'| 'ring'| 'polygon'| 'polyline'| 'rect'| 'line'| 'bezierCurve'| 'arc'|'group'
interface Elements {
    type: graphicType;
    left?: string; // 图形左上角x坐标
    top?: string; // 图形左上角y坐标
    right?: string; // 图形右下角x坐标
    bottom?: string; // 图形右下角y坐标
    width?: number; // 图形宽度
    height?: number; // 图形高度
}
type graphicEle = {
    elements: Elements[]
}
// 折线图 柱状图 饼图 自定义图 散点图 雷达图 树图 雷达图 热力图 地图 线图 图谱 平行坐标系 仪表盘 漏斗图 象形柱图
type SeriesType = 'line' | 'bar' | 'pie' |  'custom' | 'scatter' | 'effectScatter' | 'radar' | 'tree' | 'treemap' | 'sunburst' | 'boxplot' | 'candlestick' | 'heatmap' | 'map' | 'lines' | 'graph' | 'parallel'  | 'gauge' | 'funnel' | 'pictorialBar' | 'themeRiver' 
interface SeriesItemType {
    name?: string;
    type?: SeriesType;
    symbol?: 'circle'| 'rect'| 'roundRect'| 'triangle'| 'diamond'| 'pin'| 'arrow'| 'none';
    symbolSize?: number | [number, number] | (()=>number);
    data?: any[];
    label:{
        show: boolean;
        position?: 'top'| 'left'| 'right'| 'bottom'| 'inside'| 'insideLeft'| 'insideRight'| 'insideTop'| 'insideBottom'| 'insideTopLeft'| 'insideBottomLeft'| 'insideTopRight'| 'insideBottomRight';
        offset?: [number, number];
        minMargin?:number;
        formatter?:()=>any;
        color?: string;
        fontFamily?: string;
        fontSize?: number;
    },
    itemStyle: {
        color:string; // 标点的颜色
        borderColor?: string; // 标点边框颜色
        borderWidth?: number; // 标点边框宽度
    },
    lineStyle: {
        color:string; // 标点的颜色
        width?: number; // 边框宽度
    },
    areaStyle?:{
        color:string; // 标点的颜色
    },
    markPoint?:Omit<SeriesItemType,'lineStyle'|'areaStyle'|'markLine'>, // 标记点
    markLine?:Omit<SeriesItemType,'itemStyle'|'areaStyle'|'markPoint'>, // 标记线 竖线
    markArea?:Omit<SeriesItemType,'areaStyle'|'markPoint'>, // 标记线 竖线
    tooltip?:{
        formatter:(params:FormatterParams)=>string;
        padding?:0;
    }
}
interface ComMonOptions extends AllOptions{
    graphic?: graphicEle; // 自定义图形
    series?: SeriesItemType[]; // 系列列表
}

class EchartsOption {
    baseOptions: any;
    constructor(options: ComMonOptions) {
        // 折线图
        this.baseOptions = {
            tooltip: {
                trigger:"item"
            },
            xAxis: {
                type:options.x.xAxisType || 'category',
                data: EchartsOption.getData(options.x),
                show: options.x.xAxisShow || true,
                min: options.x.xAxisMin || '',
                max: options.x.xAxisMax || '',// 坐标轴刻度最大值
                axisLine:EchartsOption.getAxisLine(options.x),
                axisLabel: EchartsOption.getAxisLabel(options.x),
                axisTick: EchartsOption.getAxisTick(options.x),
                splitLine: EchartsOption.getSplitLine(options.x),
                boundaryGap: true,
            },
            grid:{},
            dataZoom:[{
                type: 'inside',
                disabled:true,
                start:null,
                end:null,
                minValueSpan: null,
                maxValueSpan: null,
            }],
            yAxis: {
                type:options.y.xAxisType || 'category',
                data: EchartsOption.getData(options.y),
                show: options.y.xAxisShow || true,
                min: options.y.xAxisMin || '',
                max: options.y.xAxisMax || '',
                axisLine:EchartsOption.getAxisLine(options.y),
                axisLabel: EchartsOption.getAxisLabel(options.y),
                axisTick: EchartsOption.getAxisTick(options.y),
                splitLine: EchartsOption.getSplitLine(options.y)
            },
            series:options.series || [],
            graphic:options.graphic || [],
            backgroundColor: 'transparent'
        }
    }
   
    // 轴线配置
    private static getAxisLabel(options:EOption){
         return  {
            show:options.xaxisLabelShow || true,
            fontSize:options.xaxisLabelFontSize || 12,
            lineHeight:options.xaxisLabelFontSize || 12,
            color:options.xaxisLabelColor || "#000",
            axisLabelInterval:options.xaxisLabelInterval || 0,
            margin:options.xaxisLabelMargin || 4,
            formatter:options.xaxisLabelFormatter || '{value}',
            showMinLabel:options.xshowMinLabel || null,
            showMaxLabel:options.xshowMaxLabel || null,
            alignMinLabel:options.xalignMinLabel || null,
            alignMaxLabel:options.xalignMaxLabel || null,
            customValues:options.xcustomValues || null,
            fontStyle: 'normal',
            fontFamily: '"Alibaba PuHuiTi 3.0", "Alibaba PuHuiTi 30"',
        }    
    }
    // 轴线配置
    private static getAxisLine(options:EOption){
         return  {     // 轴线配置
                   show: options.xaxisLineShow || true,
                   lineStyle:{
                       color:options.xaxisLineColor  ||"#000",
                       width:options.xaxisLineWidth || 1,
                   },
                   name:"",  // 坐标轴名称
                   nameLocation:"end", // 坐标轴显示位置
                   nameTextStyle:{}, // 坐标轴名称样式
             }    
    }
    // 轴线配置
     private static getAxisTick(options:EOption){
         return {
                   show:options.xaxisTickShow || true,
                   inside:options.xaxisTickInside || false,
                   lineStyle:{
                       color:options.xaxisTickColor || "#000",
                       width:options.xaxisTickWidth || 1,
                   }
                
                }
    }
    // 坐标轴在 grid 区域中的分隔线。
    private static getSplitLine(options:EOption){
         return {
                   show:options.xsplitLineShow || true,
                   lineStyle:{
                       color:options.xsplitLineColor || "#000",
                       width:options.xsplitLineWidth || 1,
                   }
        }
    }
     // 轴线配置
    private static getData(options:EOption){
         return options.xaxisData || []
    }
    getOption() {
        return this.baseOptions;
    }
    // 分类轴设置x轴数据
    setXdata(list:any[],field:string) {
        if(this.baseOptions.xAxis.xAxis!='category'){
            throw new Error("xAxis.type must be category")
        }
        if(Array.isArray(list)){
            if(list.length==0)return this.getEmptyXOption()
            this.baseOptions.xAxis.data = list.map((item:any)=>{
               return item[field]
           })
        }else if(typeof list==='object' && list!==null ){
            if(Object.keys(list).length==0)return this.getEmptyXOption()
            this.baseOptions.xAxis.data = Object.keys(list).sort().map((item:any)=>{
                return list[item]
            })
        }else{
            throw new Error("xAxis.data must be Array or Object")

        }   
    }
    getEmptyXOption(){
         return [];
    }
}

export default EchartsOption;