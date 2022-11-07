type PageOptions = WechatMiniprogram.Page.Options<any, any>;
type PageNewOptions = PageOptions & { useStoreRef: any };

export function proxyPage(globalOptions: PageOptions) {
  isProxyPage = true;
  const OriginPage = Page;
  Page = function (options: PageNewOptions) {
    const newOptions: PageOptions = {
      ...globalOptions,
      ...options,
      onLoad() {
        // useStoreRef 是 store 的函数引用，不能传函数调用进来
        const { useStoreRef, mapState, mapActions, watch } = options;
        if (useStoreRef) {
          useStoreRef(this, mapState, mapActions, watch);
        }

        globalOptions?.onLoad?.call(this, ...arguments);
        options?.onLoad?.call(this, ...arguments);
      },
    };

    const hooks = [
      "onShow",
      "onReady",
      "onHide",
      "onUnload",
      "onPullDownRefresh",
      "onReachBottom",
      "onPageScroll",
      "onResize",
      "onTabItemTap",
    ];
    mixinHooks(hooks, newOptions, globalOptions, options);

    OriginPage(newOptions);
  };
}

export function proxyComponent(globalOptions = {}) {
  isProxyComponent = true;
  const OriginComponent = Component;
  Component = function (options) {
    const newOptions = {
      ...globalOptions,
      ...options,
      attached() {
        const { useStoreRef, mapState, mapActions, watch } = options;
        if (useStoreRef) {
          useStoreRef(this, mapState, mapActions, watch);
        }

        options?.attached?.call(this, ...arguments);
        globalOptions?.attached?.call(this, ...arguments);
      },
      detached() {
        if (options.useStoreRef) {
          this.data.store.cancelUse(this);
        }
        options?.detached?.call(this, ...arguments);
        globalOptions?.detached?.call(this, ...arguments);
      },
      lifetimes: {
        attached() {
          const { useStoreRef, mapState, mapActions, watch } = options;
          if (useStoreRef) {
            useStoreRef(this, mapState, mapActions, watch);
          }

          options?.lifetimes?.attached?.call(this, ...arguments);
          globalOptions?.lifetimes?.attached?.call(this, ...arguments);
        },
        detached() {
          if (options.useStoreRef) {
            this.data.store.cancelUse(this);
          }
          options?.lifetimes?.detached?.call(this, ...arguments);
          globalOptions?.lifetimes?.detached?.call(this, ...arguments);
        },
      },
    };

    const hooks = [
      "created",
      "ready",
      "moved",
      "error",
      "lifetimes.created",
      "lifetimes.ready",
      "lifetimes.moved",
      "lifetimes.error",
      "pageLifetimes.show",
      "pageLifetimes.hide",
      "pageLifetimes.resize",
    ];
    mixinHooks(hooks, newOptions, globalOptions, options);

    OriginComponent(newOptions);
  };
}

type AppOptions = WechatMiniprogram.App.Option;
type AppNewOptions = PageOptions & { useStoreRef: any };

export function proxyApp(globalOptions: PageOptions) {
  isProxyApp = true;

  const originApp = App;

  App = function (options: AppNewOptions) {
    const newOptions: PageOptions = {
      ...globalOptions,
      ...options,
      onLaunch(o: WechatMiniprogram.App.LaunchShowOption) {
        const { useStoreRef } = options;
        if (useStoreRef) {
          useStoreRef(this);
        }

        globalOptions?.onLaunch?.call(this, o);
        options?.onLaunch?.call(this, o);
      },
    };

    originApp(newOptions);
  } as any;
}

type BaseOptions = Record<string, any>;

/** 全局混入hook */
function mixinHooks(
  hooks: string[],
  newOptions: BaseOptions,
  globalOptions: BaseOptions,
  options: BaseOptions
) {
  hooks.forEach((name) => {
    // 这里分割的原因是要注入 lifetimes.created 这种 hook
    const paths = name.split(".");
    const len = paths.length;

    if (len === 1) {
      newOptions[paths[0]] = function () {
        globalOptions?.[paths[0]]?.call(this, ...arguments);
        options?.[paths[0]]?.call(this, ...arguments);
      };
    } else {
      newOptions[paths[0]] = { ...newOptions?.[paths[0]] };
      // pageLifetimes 的生命周期会覆盖this上的生命周期
      if (
        globalOptions?.[paths[0]]?.[paths[1]] ||
        options?.[paths[0]]?.[paths[1]]
      ) {
        newOptions[paths[0]][paths[1]] = function () {
          globalOptions?.[paths[0]]?.[paths[1]]?.call(this, ...arguments);
          options?.[paths[0]]?.[paths[1]]?.call(this, ...arguments);
        };
      }
    }
  });
}
