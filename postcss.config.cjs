module.exports = {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 80, // 根元素的字体大小   1920/24  设计稿宽度1920px pc 80 安卓 200
        unitPrecision: 5, // 小数点后精度
        propList: ["*"], // 可以从px改变为rem的属性
        // exclude: /node_modules/i, // 要忽略并保留为px的文件路径
        minPixelValue: 0, // 最小的px转s化值（小于这个值的不转化）
        mediaQuery: false, //  允许在媒体查询中转换px
        selectorBlackList: [], // 要忽略并保留为px的选择器
        replace: true, // 直接在css规则上替换值而不是添加备用
      }
    }
  }