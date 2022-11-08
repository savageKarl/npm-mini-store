export * from "./proxyFunc";
export * from "./defineStore";

// 响应式机制改变

// 页面和组件使用同一个页面路径，因为组件依赖页面运行

// 保存所有得依赖
const dep = {
  "pages/xxx/xxx": [
    {
      storeKey: "appStore",
      store: {},
      instance: {},
      mapState: ["xxxxxxx"],
      watch: {
        count() {
          console.debug("xxxxxxxxxxxx");
        },
      },
    },
    {
      storeKey: "appStore",
      instance: {},
      mapState: ["xxxxxxx"],
      watch: {
        count() {
          console.debug("xxxxxxxxxxxx");
        },
      },
    },
  ],
};

// 开发逻辑

// 在 proxy 里面 set 改变得时候，获取当前页面所有依赖，并且拿出所属得store，再拿出 mapState，进行diff，diff得数据进行setData，再将watch进行diff进行一个调用


// 使用方式

