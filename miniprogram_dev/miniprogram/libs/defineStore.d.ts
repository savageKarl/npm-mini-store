import type { BaseStoreOptionItem, StateType, Callback, Options, StoreOptionItem } from "./types";
export declare function defineStore<S extends StateType, A extends Record<string, Callback>, C = {}>(options: Options<S, A, C>): (instance: any, options: BaseStoreOptionItem | StoreOptionItem) => void;
