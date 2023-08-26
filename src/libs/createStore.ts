import { deepCopy, deepCompare } from "savage-utils";
import { dataTypes } from "savage-data-types";

import type { StateType, Callback, Options } from "./types";

import { Dep, updateStoreState } from "./dep";

// not pure function
function createReactive<T extends object>(target: T): T {
    const deps = new Dep();

    const obj = new Proxy(target, {
        get(target, key: string, receiver) {
            const res = Reflect.get(target, key, receiver);
            if (Dep.stack.length > 0) {
                if (!deps.get(key)) deps.set(key, new Set<Callback>());

                Dep.stack.forEach((item) => {
                    deps.get(key)?.add(item);
                });
            }
            return res;
        },
        set(target, key: string, value, receiver) {
            const oldV = deepCopy((target as any)[key]);
            const res = Reflect.set(target, key, value, receiver);
            if (deepCompare(oldV, value)) {
                deps.get(key)?.forEach((item) => item(oldV, value));
            }
            updateStoreState();
            return res;
        },
    });

    for (let k in obj) {
        const child = obj[k];
        if (dataTypes.isObject(child)) {
            obj[k] = createReactive(obj[k] as any) as any;
        }
    }

    return obj;
}

// not pure function
function setupActions(plainStore: StateType, proxyStore: StateType) {
    for (let k in plainStore) {
        if (typeof plainStore[k] === "function") {
            plainStore[k] = (plainStore[k] as Function).bind(
                proxyStore,
                proxyStore
            );
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
            Dep.stack.push(() => ((proxyStore as any)[k] = fns[k]()));
            (proxyStore as any)[k] = fns[k]();
            Dep.stack.pop();
        }
    }
}

export function createStore<
    S extends StateType,
    A extends Record<string, Callback>,
    C = {}
>(options: Options<S, A, C>) {
    const plainStore = {
        ...options.state,
        ...options.actions,
        ...options.computed,
    };

    const store = createReactive(plainStore);
    setupActions(plainStore, store);
    setupPatchOfStore(plainStore, store);
    setupComputed(options.computed as any, store);

    return store;
}
