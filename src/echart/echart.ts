// @ts-ignore
import * as echarts from "./ec-canvas/echarts";

let chart: any | null = null;
// chart 加载慢，传入的 options 快，会无法渲染，这里缓存一下 chart 加载前的 options
let cacheOptions: any | null = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: Number,
      value: 750,
      observer(value) {
        if (value) {
          this.setData({ _width: value * 2 });
        }
      },
    },
    height: {
      type: Number,
      value: 750,
      observer(value) {
        if (value) {
          this.setData({ _height: value * 2 });
        }
      },
    },
    options: {
      type: Object,
      observer(value) {
        if (value && JSON.stringify(value) !== "{}") {
          if (chart) {
            chart.clear();
            chart.setOption(value);
          } else cacheOptions = value;
        }
      },
    },
    id: {
      type: String,
      value: "echart",
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    ec: { lazyLoad: true },
    _width: 0, // 内置属性，用于px2rpx
    _height: 0,
  },
  methods: {
    // 获取dpr可以使图表在手机上不模糊
    async getPixelRatio() {
      return await (await wx.getSystemInfo()).pixelRatio;
    },
  },
  async ready() {
    const dpr = await this.getPixelRatio();
    this.selectComponent("#" + this.data.id).init(
      (canvas: any, width: any, height: any) => {
        // 初始化图表
        chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr,
        });
console.debug('sedfudfk')
        chart.setOption(cacheOptions);
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      }
    );
  },
});
