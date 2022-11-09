import type { BaseStoreOptionItem, StateType, Callback, Options, StoreOptionItem, Instance, ComponentInstance } from "./types";
export declare function updateStoreState(): void;
export declare function clearStoreDep(): void;
export declare function removeStoreDep(instance: ComponentInstance): void;
export declare function defineStore<S extends StateType, A extends Record<string, Callback>, C = {}>(options: Options<S, A, C>): (instance: Instance, options: BaseStoreOptionItem | StoreOptionItem) => void;
