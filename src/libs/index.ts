export * from "./proxyFunc";
export * from "./defineStore";

import {defineStore} from './defineStore'


const useStore = defineStore({
  state: {
    count: 0
  },
  actions: {
    add() {
      this.add
    }
  }
})


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

// const compuetdValue = {
//   fullname: {
//     value: function(){},
//     dep: {
//       firstname: 'xxx',
//       lastname: 'ssss',
//     }
//   }
// }


const compuetdValue = {
  fullname: {
    value: function(){},
    isChange: false, // 让依赖自动改这个字段就好了，然后我判断一下就好，不用每一个都去diff，太low了
  }
}