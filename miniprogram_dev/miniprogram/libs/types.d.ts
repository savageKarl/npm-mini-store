/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
export declare type BaseStoreOptionItem = {
    storeKey: string;
    useStoreRef: UseStoreRef;
};
export declare type StoreOptionItem = BaseStoreOptionItem & {
    mapState: string[];
    watch: Record<string, () => any>;
};
export declare type BaseStoreOptions = BaseStoreOptionItem[];
export declare type StoreOptions = StoreOptionItem[];
export declare type AppOptions = WechatMiniprogram.App.Option & {
    type: string;
};
export declare type AppNewOptions = Partial<AppOptions> & {
    stores?: BaseStoreOptions;
};
export declare type PageOptions = WechatMiniprogram.Page.Options<{}, {}>;
export declare type PageNewOptions = Partial<PageOptions> & {
    stores?: StoreOptions;
};
export declare type Callback = (...args: any) => any;
export declare type DepsType = Map<any, Set<Callback>>;
export declare type StateType = Record<string | number | symbol, unknown>;
export declare type ReturnType<T> = T extends (...args: any) => infer R ? R extends (...args: any) => any ? ReturnType<R> : R : never;
export declare type StoreWithGetters<G> = {
    readonly [K in keyof G]: ReturnType<G[K]>;
};
export declare type GettersTree<S extends StateType> = Record<string, ((state: S) => any) | (() => any)>;
export declare type Options<S extends StateType, A, C> = {
    state: S;
    computed?: C & ThisType<S & StoreWithGetters<C>> & GettersTree<S>;
    actions?: A & ThisType<S & A & StoreWithGetters<C>>;
};
export declare type Store<S, A, C> = S & A & StoreWithGetters<C> & {
    patch(v: Partial<S> | ((arg: S) => unknown)): unknown;
    useWatcher<K extends keyof S>(k: K, fn: (oldV: S[K], V: S[K]) => any): any;
};
export declare type UseStoreRef = {
    (instance: any, options: any): any;
};
export declare type DepStack = Callback[];
export declare type DepStateWithWatch = ((BaseStoreOptionItem | StoreOptionItem) & {
    instance: any;
})[];
