import type { BaseStoreOptionItem, StateType, Callback, Options, StoreOptionItem, Instance } from "./types";
export declare function defineStore<S extends StateType, A extends Record<string, Callback>, C = {}>(options: Options<S, A, C>): (instance: Instance, options: BaseStoreOptionItem | StoreOptionItem) => void;
