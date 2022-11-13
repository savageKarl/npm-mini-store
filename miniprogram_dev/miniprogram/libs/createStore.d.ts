import type { StateType, Callback, Options } from "./types";
export declare function createStore<S extends StateType, A extends Record<string, Callback>, C = {}>(options: Options<S, A, C>): S & {
    [x: string]: Callback | (() => any) | ((state: S) => any);
};
