# echart 组件

这是基于小程序`ec-canvas`组件封装的`echart`组件，方便使用，简单快捷，性能优化。

## 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "echart": "path/to/echart"
}
```

## 代码演示

```html
<echart width="375" height="375" options="{{options}}"></echart>
```

## Props

| 参数    | 说明                         | 类型   | 默认值 |
| ------- | ---------------------------- | ------ | ------ |
| id      | 标识符                       | String | echart |
| width   | 宽度，自动乘以 2，单位是 rpx | Number | 375    |
| height  | 高度，自动乘以 2，单位是 rpx | Number | 375    |
| options | echarts 图表配置             | Object |        |


**注意**：没有默认值的都是必填的！！！