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
let Dep: DepStack = [];

export function updateStoreState() {
  const path = getCurrentPagePath();
  if (!path) return;

  const stores = depStores[path];
  if (!stores) return;

  let setDataCount = 0;

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
    // if (JSON.stringify(data) !== "{}") {
    //   instance.setData(data);
    //   setDataCount += 1;
    //   console.debug(setDataCount, instance, data);
    // }

    // if (mapComputed) {
    //   // 这里要diff依赖是否改变和是否和data相同
    //   // 然后 setData
    //   const data: Record<string, any> = {};
    //   mapComputed?.forEach((key) => {
    //     if (
    //       !isSameDeep(
    //         instance.data[key as keyof typeof instance.data],
    //         store[key]
    //       )
    //     ) {
    //       data[key] = deepClone(store[key]);
    //     }
    //   });
    //   if (JSON.stringify(data) !== "{}") instance.setData(data);
    // }

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

  console.debug(depStores, depStores[path]);
}

export function removeStoreDep(instance: ComponentInstance) {
  const path = getCurrentPagePath();
  depStores[path] = depStores[path].filter(
    (item) => item.instance !== instance
  );

  console.debug(depStores, depStores[path]);
}

// function createReactive<T extends object>(target: T): T {
//   const obj = new Proxy(target, {
//     get(target, key: string, receiver) {
//       const res = Reflect.get(target, key, receiver);
//       if (isObject(res)) return createReactive(res);
//       return res;
//     },
//     set(target, key: string, value, receiver) {
//       const res = Reflect.set(target, key, value, receiver);
//       updateStoreState();
//       return res;
//     },
//   });

//   return obj;
// }

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
      if (isObject(res)) return createReactive(res);

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
  const state = createReactive(options.state);
  // const state = options.state;
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
      const compuetdValue = {} as CustomInstance["compuetdValue"];
      const computedKeys = Object.keys(computed);
      o.mapComputed.forEach((key) => {
        if (!computedKeys.includes(key)) {
          console.error(
            `msg: mapComputed "${key}" not in ${o.storeKey};\n\n` +
              `info: filePath: ${instance.is};`
          );
          return;
        }
        // computed[key] = computed[key].bind(store, state);
        // Dep.push(function () {
        //   (instance.compuetdValue as CustomInstance["compuetdValue"])[
        //     key
        //   ].isChange = true;
        //   ;debugger;
        // });

        // store[key as keyof typeof store] = computed[key](state);
        // Dep.pop();

        // compuetdValue[key] = {
        //   fn: computed[key],
        //   isChange: false,
        // };
        // ;debugger;
      });
      instance.compuetdValue = compuetdValue;
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
