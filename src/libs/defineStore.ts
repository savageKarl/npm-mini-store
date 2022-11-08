import { installEventCenter } from "@savage181855/utils";
import { isObject, hasChanged, deepClone, get } from "./utils";

// 定义一个 useStore，可用于全局使用
export function defineStore(options) {
  const obj = {
    ...options.state,
    ...options.actions,
    // 批量修改值
    patch(val) {
      if (typeof val === "object") {
        for (let k in val) {
          store[k] = val[k];
        }
      }

      if (typeof val === "function") {
        val(store);
      }
    },
    // 组件无法劫持生命周期自动取消订阅，故提供方法
    cancelUse(_this) {
      _this.onUnload();
    },
  };
  installEventCenter(obj);

  function createGetter() {
    return function get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      // 深层代理对象的关键！！！判断这个属性是否是一个对象，是的话继续代理动作，使对象内部的值可追踪
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    };
  }

  function createSetter() {
    return function set(target, key, value, receiver) {
      const oldStore = deepClone(store);
      const result = Reflect.set(target, key, value, receiver);

      Reflect.ownKeys(store.subscribeList).forEach((key) => {
        const oldValue = get(oldStore, key);
        const value = get(store, key);
        if (hasChanged(oldValue, value)) {
          store.subscribeList[key].forEach((fn) => fn(oldValue, value));
        }
      });
      return result;
    };
  }

  const mutableHandlers = {
    get: createGetter(),
    set: createSetter(),
  };

  function reactive(target) {
    return createReactiveObject(target, mutableHandlers);
  }
  // 创建一个响应式对象
  function createReactiveObject(target, baseHandlers) {
    const proxy = new Proxy(target, baseHandlers);
    return proxy;
  }

  let store = null;

  store = reactive(obj);

  /**
   * 注意：该方法一定要在onLoad或者attached钩子里面调用
   * pageInstance 当前页面实例
   * arrState 需要映射的数据
   * arrActions 需要映射的方法
   * watch 监听
   */
  return function (pageInstance, arrState = [], arrActions = [], watch = {}) {
    // 调用函数的时候就要注入state，actions和store
    arrActions.forEach((fn) => (pageInstance[fn] = store[fn].bind(store)));
    pageInstance.data.store = store;
    const data = {};
    arrState.forEach((key) => (data[key] = store[key]));
    pageInstance.setData(data);

    const dataCallbacks = {};
    arrState.forEach((key) => {
      dataCallbacks[key] = (oldValue, value) => {
        pageInstance.setData({ [key]: value });
      };
      store.subscribe(key, dataCallbacks[key]);
    });

    Reflect.ownKeys(watch).forEach((key) => {
      store.subscribe(key, watch[key].bind(pageInstance));
    });

    // console.debug(store.subscribeList);

    const _onUnload = pageInstance.onUnload || function () {};
    pageInstance.onUnload = function () {
      // 装饰onUnload取消订阅，性能优化
      _onUnload();
      Reflect.ownKeys(dataCallbacks).forEach((k) =>
        store.remove(k, dataCallbacks[k])
      );
      Reflect.ownKeys(watch).forEach((k) => store.remove(k, watch[k]));
    };

    return store;
  };
}


