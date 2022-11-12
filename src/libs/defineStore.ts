import {
  isObject,
  deepClone,
  hasChanged,
  isSameDeep,
} from "@savage181855/utils";

import type {
  BaseStoreOptionItem,
  StateType,
  Callback,
  Options,
  StoreOptionItem,
  DepStateWithWatch,
  Instance,
  PageInstance,
  ComponentInstance,
  DepsType,
  DepStack,
  CustomInstance,
} from "./types";

import { getCurrentPagePath } from "./utils";

const depStores: Record<string, DepStateWithWatch> = {};
const Dep: DepStack = [];

// not pure function
export function updateStoreState() {
  const path = getCurrentPagePath();
  if (!path) return;

  const stores = depStores[path];
  if (!stores) return;

  stores.forEach((s) => {
    const { mapState, instance, store, watch, mapComputed } = s;

    const stateArr = [];

    if (mapState) stateArr.push(...mapState);
    if (mapComputed) stateArr.push(...mapComputed);
    const data: Record<string, any> = {};
    stateArr?.forEach((key) => {
      if (
        !isSameDeep(
          instance.data[key as keyof typeof instance.data],
          store[key]
        )
      ) {
        data[key] = deepClone(store[key]);
      }
    });
    if (JSON.stringify(data) !== "{}") instance.setData(data);

    if (watch) {
      Object.keys(watch).forEach((key) => {
        if (!isSameDeep(instance.watchValue[key], store[key])) {
          const newValue = deepClone(store[key]);
          watch[key](instance.watchValue[key], newValue);
          instance.watchValue[key] = newValue;
        }
      });
    }
  });
}

export function clearStoreDep() {
  const path = getCurrentPagePath();
  depStores[path] = [];
}

// not pure function
export function removeStoreDep(instance: ComponentInstance) {
  const path = getCurrentPagePath();
  depStores[path] = depStores[path].filter(
    (item) => item.instance !== instance
  );
}

// not pure function
function createReactive<T extends object>(target: T): T {
  const deps: DepsType = new Map();

  const obj = new Proxy(target, {
    get(target, key: string, receiver) {
      const res = Reflect.get(target, key, receiver);
      if (Dep.length > 0) {
        if (!deps.get(key)) deps.set(key, new Set<Callback>());

        Dep.forEach((item) => {
          deps.get(key)?.add(item);
        });
      }
      return res;
    },
    set(target, key: string, value, receiver) {
      const oldV = deepClone((target as any)[key]);
      const res = Reflect.set(target, key, value, receiver);
      if (hasChanged(oldV, value)) {
        deps.get(key)?.forEach((item) => item(oldV, value));
      }
      updateStoreState();
      return res;
    },
  });

  for (let k in obj) {
    const child = obj[k];
    if (isObject(child)) {
      obj[k] = createReactive(obj[k] as any) as any;
    }
  }

  return obj;
}

// not pure function
function setupActions(plainStore: StateType, proxyStore: StateType) {
  for (let k in plainStore) {
    if (typeof plainStore[k] === "function") {
      plainStore[k] = (plainStore[k] as Function).bind(proxyStore);
    }
  }
}

// not pure function
function setupPatchOfStore(plainStore: StateType, proxyStore: StateType) {
  plainStore.patch = function (val: StateType | Callback) {
    if (typeof val === "object") {
      for (let k in val) {
        proxyStore[k] = (val as any)[k];
      }
    }

    if (typeof val === "function") {
      val(proxyStore);
    }
  };
}

// not pure function
function setupComputed(fns: Record<string, Callback>, proxyStore: StateType) {
  if (fns) {
    for (let k in fns) {
      fns[k] = fns[k].bind(proxyStore, proxyStore);
      Dep.push(() => ((proxyStore as any)[k] = fns[k]()));
      (proxyStore as any)[k] = fns[k]();
      Dep.pop();
    }
  }
}

export function defineStore<
  S extends StateType,
  A extends Record<string, Callback>,
  C = {}
>(options: Options<S, A, C>) {
  const state = options.state;
  const computed = options.computed as any as Record<string, Callback>;

  const plainStore = {
    ...state,
    ...options.actions,
    ...computed,
  };

  const store = createReactive(plainStore);
  setupActions(plainStore, store);
  setupPatchOfStore(plainStore, store);
  setupComputed(computed, store);
  
  return function useStore(
    instance: Instance,
    options: BaseStoreOptionItem | StoreOptionItem
  ) {
    instance[options.storeKey as keyof typeof instance] = store;
    if (instance.type === "app") return;

    const o = options as StoreOptionItem;

    const stateKeys = Object.keys(state);
    if (o.mapState) {
      o.mapState.forEach((key) => {
        if (!stateKeys.includes(key)) {
          console.error(
            `msg: mapState "${key}" not in ${o.storeKey};\n\n` +
              `info: filePath: ${instance.is};`
          );
          return;
        }
      });
    }

    if (o.watch) {
      // use to compare watch whether to execute
      const watchValue: StateType = {};
      Object.keys(o.watch).forEach((key) => {
        if (!stateKeys.includes(key)) {
          console.error(
            `msg: watch "${key}" not in ${o.storeKey};\n\n` +
              `info: filePath: ${instance.is};`
          );
          return;
        }
        watchValue[key] = deepClone(store[key]);
      });
      instance.watchValue = watchValue;
    }

    if (o.mapComputed) {
      // use to compare computed function whether to execute
      const computedKeys = Object.keys(computed);
      o.mapComputed.forEach((key) => {
        if (!computedKeys.includes(key)) {
          console.error(
            `msg: mapComputed "${key}" not in ${o.storeKey};\n\n` +
              `info: filePath: ${instance.is};`
          );
          return;
        }
      });
    }

    const route = instance.route as keyof typeof instance as string;

    depStores[route] = depStores[route] || [];
    depStores[route].push({
      ...o,
      instance: instance as PageInstance | ComponentInstance,
      store,
    });
  };
}
