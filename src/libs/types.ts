export type BaseStoreOptionItem = {
  storeKey: string;
  useStoreRef: UseStoreRef;
};

export type StoreOptionItem = BaseStoreOptionItem & {
  mapState?: string[];
  mapActions?: string[];
  mapComputed?: string[];
  watch?: Record<string, (oldV: any, v: any) => any>;
};

export type BaseStoreOptions = BaseStoreOptionItem[];
export type StoreOptions = StoreOptionItem[];

export type AppOptions = WechatMiniprogram.App.Option & { type: string };
export type AppNewOptions = Partial<AppOptions> & {
  stores?: BaseStoreOptions;
};
export type AppInstance = WechatMiniprogram.App.Instance<StateType>;

export type CustomInstance = {
  watchValue: Record<string, any>;
};

export type PageOptions = WechatMiniprogram.Page.Options<{}, {}>;
export type PageNewOptions = Partial<PageOptions> & {
  stores?: StoreOptions;
};
export type PageInstance = WechatMiniprogram.Page.Instance<
  {},
  CustomInstance & StateType
>;

export type ComponentOptions = WechatMiniprogram.Component.Options<
  {},
  {},
  {},
  { route: string }
>;
export type ComponentNewOptions = Partial<ComponentOptions> & {
  stores?: StoreOptions;
};
export type ComponentInstance = WechatMiniprogram.Component.Instance<
  {},
  {},
  {},
  CustomInstance & StateType
>;

export type Callback = (...args: any) => any;
export type DepsType = Map<any, Set<Callback>>;
export type StateType = Record<string | number | symbol, unknown>;

export type ReturnType<T> = T extends (...args: any) => infer R
  ? R extends (...args: any) => any
    ? ReturnType<R>
    : R
  : never;

export type StoreWithGetters<G> = {
  readonly [K in keyof G]: ReturnType<G[K]>;
};

export type GettersTree<S extends StateType> = Record<
  string,
  ((state: S) => any) | (() => any)
>;

export type Options<S extends StateType, A, C> = {
  state: S;
  computed?: C & ThisType<S & StoreWithGetters<C>> & GettersTree<S>;
  actions?: A & ThisType<S & A & StoreWithGetters<C>>;
};

export type Store<S, A, C> = S &
  A &
  StoreWithGetters<C> & {
    patch(v: Partial<S> | ((arg: S) => unknown)): unknown;
    useWatcher<K extends keyof S>(k: K, fn: (oldV: S[K], V: S[K]) => any): any;
  };

export type Instance = (AppInstance | PageInstance | ComponentInstance) & {
  type: string;
};

export type UseStoreRef = {
  (instance: Instance, options: Omit<BaseStoreOptionItem, "useStoreRef">): any;
};

export type DepStack = Callback[];

export type DepStateWithWatch = (StoreOptionItem & {
  instance: PageInstance | ComponentInstance;
  store: any;
})[];
