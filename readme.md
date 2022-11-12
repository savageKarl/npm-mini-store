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
- **支持按需渲染**
- **支持惰性渲染**


## 安装

```
npm i @savage181855/mini-store -S
```

## 使用说明

在`app.js`文件调用全局 api，这一步是必须的！！！

```javascript
import { proxyPage, proxyComponent,proxyApp } from "@savage181855/mini-store";

// 代理页面，让页面可以使用状态管理工具
proxyPage();
// 代理页面，让组件可以使用状态管理工具
proxyComponent();
// 代理 App，让 App可以使用状态管理工具
proxyApp();
// 这样子就结束了，很简单
```

定义`store/appStore.js`文件

```javascript
import { defineStore } from "@savage181855/mini-store";

const useStore = defineStore({
  state: {
    count: 0,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});

export default useStore;
```

定义`store/userStore.js`文件

```javascript
import { defineStore } from "@savage181855/mini-store";

const useStore = defineStore({
  state: {
    count: 0,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});

export default useStore;
```
### 在`app`里面使用`store`

`app.js`文件

```javascript

```

### 在`page`里面使用`store`


`indexA.js`页面

```javascript
// 导入定义的 useStore
import useStore from "../../store/store";
Page({
  // 注意：这里使用 useStore 即可，可以在this.data.store 访问 store
  useStoreRef: useStore,
  // 表示需要使用的全局状态，会自动挂载在到当前data里面，自带响应式
  mapState: ["count"],
  // 表示想要映射的全局actions，可以直接在当前页面调用 ，例如：this.increment()
  mapActions: ["increment"],
  watch: {
    count(oldValue, value) {
      // 可以访问当前页面的实例 this
      console.debug(this);
      console.debug(oldValue, value, "count change");
    },
  },
  onIncrement1() {
    // 不推荐
    this.data.store.count++;
  },
  onIncrement2() {
    this.data.store.patch({
      count: this.data.store.count + 1,
    });
  },
  onIncrement3() {
    this.data.store.patch((store) => {
      store.count++;
    });
  },
  onIncrement4() {
    this.data.store.increment();
  },
});
```

`indexA.wxml`

```html
<view>
  <view>indexA</view>
  <view>{{count}}</view>
  <button type="primary" bindtap="increment">+1</button>
  <button type="primary" bindtap="onIncrement1">+1</button>
  <button type="primary" bindtap="onIncrement2">+1</button>
  <button type="primary" bindtap="onIncrement3">+1</button>
  <button type="primary" bindtap="onIncrement4">+1</button>
</view>
```

`indexB.js`页面

```javascript
// 导入定义的 useStore
import useStore from "../xxxx/store.js";

Page({
  // 注意：这里使用 useStore 即可，可以在 this.data.store 访问 store
  useStoreRef: useStore,
  // 表示需要使用的全局状态，会自动挂载在到当前data里面，自带响应式
  mapState: ["count"],
});
```

`indexB.wxml`

```html
<view>
  <view>indexB</view>
  <view>{{count}}</view>
</view>
```

### 在`component`里面使用`store`

## 全局混入

`app.js`文件

```javascript
import { proxyPage, proxyComponent } from "@savage181855/mini-store";

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

## 代码片段

https://developers.weixin.qq.com/s/ZO0SX2mr7xDj

