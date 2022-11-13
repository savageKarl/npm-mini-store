import {
  deepClone,
} from "@savage181855/utils";

import type {
  BaseStoreOptionItem,
  StateType,
  Callback,
  Options,
  StoreOptionItem,
  Instance,
  PageInstance,
  ComponentInstance,
} from "./types";

import { Dep } from "./dep";

import { createStore } from "./createStore";

export function defineStore<
  S extends StateType,
  A extends Record<string, Callback>,
  C = {}
>(options: Options<S, A, C>) {
  const state = options.state;
  const computed = options.computed as any as Record<string, Callback>;
  const actions = options.actions as any as Record<string, Callback>;

  const store = createStore(options);

  return function useStore(
    instance: Instance,
    options: BaseStoreOptionItem | StoreOptionItem
  ) {
    instance[options.storeKey as keyof typeof instance] = store;
    if (instance.type === "app") return;
    // ;debugger;
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
      instance.watchValue = { ...(instance.watchValue as any), ...watchValue };
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

    if (o.mapActions) {
      // use to compare computed function whether to execute
      const actionKeys = Object.keys(actions);
      o.mapActions.forEach((key) => {
        if (!actionKeys.includes(key)) {
          console.error(
            `msg: mapActions "${key}" not in ${o.storeKey};\n\n` +
              `info: filePath: ${instance.is};`
          );
          return;
        }
        instance[key] = store[key];
      });
    }

    const route = instance.route as keyof typeof instance as string;

    Dep.stores[route] = Dep.stores[route] || [];

    const isExist = Dep.stores[route].some((v) => {
      return v.instance === instance && v.store === store;
    });

    if (!isExist) {
      Dep.stores[route].push({
        ...o,
        instance: instance as PageInstance | ComponentInstance,
        store,
      });
    }
  };
}
