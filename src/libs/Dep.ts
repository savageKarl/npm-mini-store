import type {
  Callback,
  DepStateWithWatch,
  DepStack,
  ComponentInstance,
} from "./types";

import { deepClone, isSameDeep } from "@savage181855/utils";

import { getCurrentPagePath } from "./utils";
export class Dep extends Map<any, Set<Callback>> {
  static stores: Record<string, DepStateWithWatch> = {};
  static stack: DepStack = [];
}

// not pure function
export function updateStoreState() {
  const path = getCurrentPagePath();
  if (!path) return;

  const stores = Dep.stores[path];
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
          instance.data[key as keyof typeof instance.data] as any,
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
          watch[key] = watch[key].bind(instance);
          watch[key](instance.watchValue[key], newValue);
          instance.watchValue[key] = newValue;
        }
      });
    }
  });
}

export function clearStoreDep() {
  const path = getCurrentPagePath();
  Dep.stores[path] = [];
}

// not pure function
export function removeStoreDep(instance: ComponentInstance) {
  const path = getCurrentPagePath();
  Dep.stores[path] = Dep.stores[path].filter(
    (item) => item.instance !== instance
  );
}
