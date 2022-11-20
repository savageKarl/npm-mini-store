# mini-store

> 简单，优雅的微信小程序全局状态管理器

## 特点

- **轻量**
- **响应式**
- **高性能**
- **灵活**
- **渐进式**
- **模块化**

## 功能

- **支持多个`store`**
- **支持`computed`计算属性**
- **支持`watch`监听**
- **支持`state`映射到页面或组件实例**
- **支持`actions`映射到页面或组件实例**
- **按需渲染：只渲染当前页面或组件所使用到的`state`和`computed`**
- **惰性渲染：只渲染当前页面使用的`state`和`computed`**

## 安装

```
npm i @savage181855/mini-store -S
```

## 使用说明

在`app.js`文件调用全局 api，这一步是必须的！！！

```javascript
import { proxyPage, proxyComponent, proxyApp } from "@savage181855/mini-store";

// 代理 App，让 App可以使用状态管理工具
proxyApp();
// 代理页面，让页面可以使用状态管理工具
proxyPage();
// 代理页面，让组件可以使用状态管理工具
proxyComponent();

// 这样子就结束了，很简单
```

定义`store/appStore.js`文件

```javascript
import { defineStore } from "@savage181855/mini-store";

export const useAppStore = defineStore({
  state: {
    count: 0,
  },
  actions: {
    increment() {
      // this 指向 store，可以直接访问 this.count
      this.count += 1;
    },
  },
  computed: {
    dbCount(store) {
      // this 指向 store，可以直接访问 this.count
      return store.count * 2;
    },
  },
});
```

定义`store/userStore.js`文件

```javascript
import { defineStore } from "@savage181855/mini-store";

export const userStore = defineStore({
  state: {
    user: {
      age: 0,
      firstname: "greet",
      lastname: "bar",
    },
  },
  actions: {
    changeName(state) {
      state.user.firstname = "foo";
    },
  },
  computed: {
    fullname(state) {
      return state.user.firstname + state.user.lastname;
    },
  },
});
```

### 在`app`里面使用`store`

`app.js`文件

```javascript
import { proxyApp, proxyPage, proxyComponent } from "@savage181855/mini-store";

import { useAppStore } from "./store/appStore";
import { userStore } from "./store/userStore";

proxyApp();
proxyPage();
proxyComponent();


// 可以直接这样子使用
const appStore = useAppStore()
console.debug(appStore);

App({
  stores: [
    {
      // 引入 store，这里要注意，传入 useAppStore 即可
      useStoreRef: useAppStore,
      // 表示当前使用store的名字，可以在 this.appStore 获取 store
      storeKey: "appStore",
    },
    {
      storeKey: "userStore",
      useStoreRef: userStore,
    },
  ],
  onLaunch() {
    console.debug(this.appStore);
    console.debug(this.userStore);
  },
});
```

### 在`page`里面使用`store`

`indexA.js`页面

```javascript
import { useAppStore } from "../../store/appStore";
import { userStore } from "../../store/userStore";

Page({
  stores: [
    {
      // 引入 store，这里要注意，传入 useAppStore 即可
      useStoreRef: useAppStore,
      // 表示当前使用store的名字，可以在 this.appStore 获取 store
      storeKey: "appStore",
      // 表示需要使用的全局状态，会自动挂载在到当前页面或组件实例 data 里面，自带响应式
      mapState: ["count"],
      // 表示需要使用的计算属性，会自动挂载在到当前页面或组件实例 data 里面，自带响应式
      mapComputed: ["dbCount"],
      // 表示想要映射的store actions，可以直接在当前页面调用 ，例如：this.increment()
      mapActions: ["increment"],
      // 表示要监听的 state 字段
      watch: {
        count(oldValue, value) {
          // 可以访问当前页面或组件的实例 this
          console.debug(this);
          console.debug("count", oldValue, value);
        },
      },
    },
    {
      storeKey: "userStore",
      useStoreRef: userStore,
      mapState: ["user"],
      mapActions: ["changeName"],
      mapComputed: ["fullname"],
      watch: {
        user(oldValue, value) {
          console.debug("user", oldValue, value);
        },
      },
    },
  ],
  onIncrement1() {
    // 不推荐
    this.appStore.count++;
  },
  onIncrement2() {
    this.appStore.patch({
      count: this.appStore.count + 1,
    });
  },
  onIncrement3() {
    this.appStore.patch((store) => {
      store.count++;
    });
  },
  onIncrement4() {
    this.appStore.increment();
  },
});
```

`indexA.wxml`

```html
<view>
  <view>user.age: {{user.age}}</view>
  <view>count: {{count}}</view>
  <view>dbCount：{{dbCount}}</view>
  <view>fullname: {{fullname}}</view>
  
  <button bindtap="onIncrement1" size="mini">onIncrement1</button>
  <button bindtap="onIncrement2" size="mini">onIncrement2</button>
  <button bindtap="onIncrement3" size="mini">onIncrement3</button>
  <button bindtap="onIncrement4" size="mini">onIncrement4</button>

  <button bindtap="changeName" type="primary" size="mini">
    userStore.changeName
  </button>
</view>
```

### 在`component`里面使用`store`

**组件和页面的使用方式是一样的！**

### 注意

在`App`里面只能使用`useStoreRef`和`storeKey`;

`Page`和`Component`可以使用

- `useStoreRef`
- `mapState`
- `storeKey`
- `mapActions`
- `mapComputed`
- `watch`

## 使用建议

`mapState`和`mapComputed`都是会映射到页面或组件实例的`data`里面，也就是说，可以直接在视图里面使用，当使用的`store`的数据改变时，会进行diff之后，然后进行`this.setData`。

如果不是要在视图里面直接访问`store`的数据，那么最好少用`mapState`和`mapComputed`，使用`this.xxxx`来访问`store`，来达到性能最大化。

## 使用示例

代码片段：https://developers.weixin.qq.com/s/3bI6ELmM71DL

## 注意

本地调试需要`npm`包需要在当前项目目录下执行`npm link`，在小程序目录执行`npm link xxxx`

## 发布

## 全局混入

`app.js`文件

```javascript
import { proxyPage, proxyComponent } from "@savage181855/mini-store";

// 代理 App，让 App可以使用状态管理工具
proxyApp();
// 这里的配置可以跟页面的配置一样，但是有一些规则
// 'onShow', 'onReady', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom',
// 'onPageScroll', 'onResize', 'onTabItemTap'等方法，全局的和页面会合并，其余的方法，页面会覆盖全局的。
proxyPage({
  onLoad() {
    console.debug("global onLoad");
  },
  onReady() {
    console.debug("global onReady");
  },
  onShow() {
    console.debug("global onShow");
  },
  onShareAppMessage() {
    return {
      title: "我是标题-- 全局",
    };
  },
});
// 这里的配置可以跟组件的配置一样，但是有一些规则
// 'created','ready','moved','error','lifetimes.created','lifetimes.ready',
// 'lifetimes.moved','lifetimes.error','pageLifetimes.show','pageLifetimes.hide',
// 'pageLifetimes.resize'等方法，全局的和组件会合并，其余的方法，组件会覆盖全局的。
proxyComponent({
  lifetimes: {
    created() {
      console.debug("global lifetimes.created");
    },
  },
});
```
