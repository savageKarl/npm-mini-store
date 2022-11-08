import {
  isObject,
  deepClone,
} from "@savage181855/utils";

import type {
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

  const stores = depens[path];
  if (!stores) return;

  stores.forEach((s) => {
    const { mapState, instance, store, watch } = s;
    // debugger;
    const data: Record<string, any> = {};
    mapState?.forEach((key) => {
      if (instance.data[key] !== store[key]) {
        data[key] = deepClone(store[key]);
      }
    });
    instance.setData(data);

    if (watch) {
      Object.keys(watch).forEach((key) => {
        if (instance.watchValue[key] !== store[key]) {
          watch[key](instance.watchValue[key], store[key]);
          instance.watchValue[key] = deepClone(store[key]);
        }
      });
    }
  });

  // console.debug("在这里进行diff， setData 和 watch", depens, depens[path]);
}

export function clearStoreDep() {
  const path = getCurrentPagePath();
  depens[path] = [];

  console.debug(depens, depens[path]);
}

export function removeStoreDep(instance: any) {
  const path = getCurrentPagePath();
  depens[path] = depens[path].filter((item) => item.instance !== instance);

  console.debug(depens, depens[path]);
}

function createReactive<T extends object>(target: T): T {
  // const deps: DepsType = new Map();

  const obj = new Proxy(target, {
    get(target, key: string, receiver) {
      const res = Reflect.get(target, key, receiver);
      if (isObject(res)) return createReactive(res);
      return res;
    },
    set(target, key: string, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      updateStoreState();
      return res;
    },
  });

  return obj;
}

function setupActions(plainStore: StateType, proxyStore: StateType) {
  for (let k in plainStore) {
    if (typeof plainStore[k] === "function") {
      plainStore[k] = (plainStore[k] as Function).bind(proxyStore);
    }
  }
}

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
  const state = options.state;
  const plainStore = {
    ...options.state,
    ...options.actions,
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

    const o = options as StoreOptionItem;


    const stateKeys = Object.keys(state);
    if (o.mapState) {
      o.mapState.forEach((key) => {
        if (!stateKeys.includes(key)) {
          console.error(
            `msg: mapState "${key}" not in ${o.storeKey};\n\n` +
            `info: pagePath: ${instance.route}, nodeId: "${instance.__wxExparserNodeId__}";\n`
          );
          return;
        }
      });
    }


    if (o.watch) {
      const watchValue: StateType = {};
      Object.keys(o.watch).forEach((key) => {
        if (!stateKeys.includes(key)) {
          console.error(
            `msg: watch "${key}" not in ${o.storeKey};\n\n` +
            `info: pagePath: ${instance.route}, nodeId: "${instance.__wxExparserNodeId__}";\n`
          );
          return;
        }
        watchValue[key] = deepClone(store[key]);
      });
      instance.watchValue = watchValue;
    }

    depens[instance.route] = depens[instance.route] || [];
    depens[instance.route].push({
      ...o,
      instance,
      store,
    });
  };
}
