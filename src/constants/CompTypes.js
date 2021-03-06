/**
 * Created by edeity on 2018/3/5.
 */
const COMP_TYPE = {
    Line: '折线',
    Bar: '柱状',
    Pie: '饼图',
    // Scatter: '分散图',
    // Map: '地图',
    // Candlestick: '走势图',
    // Radar: '雷达图',
    // Boxplot: '盒式图',
    // Heatmap: '热点图',
    // Tree: '树形图',
    // Treemap: '矩阵树图',
    // Sunburst: '旭日图',
    // Parallel: '并行图',
    // Funnel: '漏斗图',
    // Gauge: '测量图',
    // Calendar: '日历图'
}

export default COMP_TYPE


export function getCompConfig(compType) {
    switch(compType) {
        case COMP_TYPE.Line: return {
            x: 'multiple',
            y: ''
        }
        case COMP_TYPE.Bar: return {
            x: '',
            y: 'multiple'
        }
        case COMP_TYPE.Pie: return {
            x: '',
            y: ''
        }
        default: return {
            x: '',
            y: ''
        }
    }
}