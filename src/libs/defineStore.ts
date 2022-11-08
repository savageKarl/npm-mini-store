import {
  installEventCenter,
  isObject,
  hasChanged,
  deepClone,
  get,
} from "@savage181855/utils";

import type {
  Store,
  UseStoreRef,
  BaseStoreOptions,
  AppOptions,
  AppNewOptions,
  BaseStoreOptionItem,
  StateType,
  Callback,
  Options,
  StoreOptionItem,
  DepStateWithWatch,
} from "./types";

import { getCurrentPagePath } from "./utils";

const depens: Record<string, DepStateWithWatch> = {};

export function updateStoreState() {
  const path = getCurrentPagePath();
  if (!path) return;

  console.debug("在这里进行diff， setData 和 watch", depens, depens[path]);
}

export function clearStoreDep() {
  const path = getCurrentPagePath();
  depens[path] = [];

  console.debug(depens, depens[path]);
}

export function removeStoreDep(instance: any) {
  const path = getCurrentPagePath();
  depens[path] = depens[path].filter(item => item.instance !== instance);

  console.debug(depens, depens[path]);
}

function createReactive<T extends object>(target: T): T {
  // const deps: DepsType = new Map();

  const obj = new Proxy(target, {
    get(target, key: string, receiver) {
      const res = Reflect.get(target, key, receiver);
      // debugger;
      if (isObject(res)) return createReactive(res);

      return res;
    },
    set(target, key: string, value, receiver) {
      const oldV = deepClone((target as any)[key]);
      const res = Reflect.set(target, key, value, receiver);
      // debugger;
      // 不搞根据属性收集依赖那一套了，store，一变化，拿到当前route，然后区分是哪一个store，再diff mapState和 watch
      if (hasChanged(oldV, value)) {
        // deps.get(key)?.forEach((item) => item(oldV, value));
      }
      return res;
    },
  });

  return obj;
}

/** convert actions to solve the problem of this loss in store actions */
function setupActions(plainStore: StateType, proxyStore: StateType) {
  for (let k in plainStore) {
    if (typeof plainStore[k] === "function") {
      plainStore[k] = (plainStore[k] as Function).bind(proxyStore);
    }
  }
}

/** install the patch method to the store */
function setupPatchOfStore(store: StateType) {
  store.patch = function (val: StateType | Callback) {
    if (typeof val === "object") {
      for (let k in val) {
        store[k] = (val as any)[k];
      }
    }

    if (typeof val === "function") {
      val(store);
    }
  };
}

export function defineStore<
  S extends StateType,
  A extends Record<string, Callback>,
  C = {}
>(options: Options<S, A, C>) {
  const update = Symbol("update");

  // 给store设置一个update的方法，这样子proxy set 改变的时候
  const plainStore = {
    ...options.state,
    ...options.actions,
    [update]() {
      // proxy set 以及page show 生命周期会调用这个方法
      // 这里逻辑，获取当前 page route，然后去  depens，里面拿当前page的所有依赖，mapState，watch，然后diff，再进行setData或者调用回调
    },
  };

  const store = createReactive(plainStore);
  setupActions(plainStore, store);
  setupPatchOfStore(store);

  return function useStore(
    instance: any,
    options: BaseStoreOptionItem | StoreOptionItem
  ) {
    instance[options.storeKey] = store;
    if (instance.type === "app") return;

    depens[instance.route] = depens[instance.route] || [];
    depens[instance.route].push({
      instance,
      ...options,
    });
  };
}


