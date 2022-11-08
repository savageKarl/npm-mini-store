import {
  installEventCenter,
  isObject,
  hasChanged,
  deepClone,
  get,
} from "@savage181855/utils";

import type {
  Store,
  UseStoreRef,
  BaseStoreOptions,
  AppOptions,
  AppNewOptions,
  PageOptions,
  PageNewOptions,
  ComponentOptions,
  ComponentNewOptions,
  StoreOptions,
} from "./types";

import { setTip } from "./tips";

import { updateStoreState, clearStoreDep, removeStoreDep } from "./defineStore";

import { getCurrentPagePath } from "./utils";

function callUseStoreRef(
  instance: any,
  stores?: BaseStoreOptions | StoreOptions
) {
  stores?.forEach((s) => {
    const { useStoreRef, ...rest } = s;
    useStoreRef(instance, rest);
  });
}

export function proxyApp() {
  setTip("isProxyApp");

  const originApp = App;

  App = function (options: AppNewOptions) {
    const { stores, ...rest } = options;
    const newOptions = {
      ...rest,
      onLaunch(o: WechatMiniprogram.App.LaunchShowOption) {
        this.type = "app";
        const { stores } = options;
        callUseStoreRef(this, stores);

        options?.onLaunch?.call(this, o);
      },
    } as AppOptions;

    return originApp(newOptions);
  };
}

export function proxyPage(globalOptions: PageOptions) {
  setTip("isProxyPage");

  const OriginPage = Page;
  Page = function (options: PageNewOptions) {
    const { stores, ...rest } = options;
    let newOptions: PageOptions = {
      ...globalOptions,
      ...rest,
      onLoad(o) {
        const { stores } = options;
        callUseStoreRef(this, stores);

        globalOptions?.onLoad?.call(this, o);
        options?.onLoad?.call(this, o);
      },
      onShow() {
        updateStoreState();

        globalOptions?.onShow?.call(this);
        options?.onShow?.call(this);
      },
      onUnload() {
        clearStoreDep();
        globalOptions?.onUnload?.call(this);
        options?.onUnload?.call(this);
      },
    };

    const hooks = [
      "onReady",
      "onHide",
      "onPullDownRefresh",
      "onReachBottom",
      "onPageScroll",
      "onResize",
      "onTabItemTap",
    ];
    newOptions = mixinHooks(hooks, newOptions, globalOptions, options);

    return OriginPage(newOptions);
  };
}

export function proxyComponent(globalOptions: ComponentOptions) {
  setTip("isProxyComponent");

  const OriginComponent = Component;
  Component = function (options: ComponentNewOptions) {
    const { stores, ...rest } = options;

    let newOptions: ComponentOptions = {
      ...globalOptions,
      ...rest,
      attached() {
        this.route = getCurrentPagePath();
        const { stores } = options;
        callUseStoreRef(this, stores);

        options?.attached?.call(this);
        globalOptions?.attached?.call(this);
      },
      detached() {
        removeStoreDep(this);

        options?.detached?.call(this);
        globalOptions?.detached?.call(this);
      },
      lifetimes: {
        attached() {
          this.route = getCurrentPagePath();
          const { stores } = options;

          callUseStoreRef(this, stores);

          options?.lifetimes?.attached?.call(this);
          globalOptions?.lifetimes?.attached?.call(this);
        },
        detached() {
          removeStoreDep(this);

          options?.lifetimes?.detached?.call(this);
          globalOptions?.lifetimes?.detached?.call(this);
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
    newOptions = mixinHooks(hooks, newOptions, globalOptions, options);

    return OriginComponent(newOptions);
  };
}

type BaseOptions = Record<string, any>;

/** 全局混入hook */
function mixinHooks(
  hooks: string[],
  newOptions: BaseOptions,
  globalOptions: BaseOptions,
  options: BaseOptions
) {
  const newO = deepClone(newOptions);

  hooks.forEach((name) => {
    // 这里分割的原因是要注入 lifetimes.created 这种 hook
    const paths = name.split(".");
    const len = paths.length;

    if (len === 1) {
      newO[paths[0]] = function () {
        globalOptions?.[paths[0]]?.call(this, ...arguments);
        options?.[paths[0]]?.call(this, ...arguments);
      };
    } else {
      newO[paths[0]] = { ...newO?.[paths[0]] };
      // pageLifetimes 的生命周期会覆盖this上的生命周期
      if (
        globalOptions?.[paths[0]]?.[paths[1]] ||
        options?.[paths[0]]?.[paths[1]]
      ) {
        newO[paths[0]][paths[1]] = function () {
          globalOptions?.[paths[0]]?.[paths[1]]?.call(this, ...arguments);
          options?.[paths[0]]?.[paths[1]]?.call(this, ...arguments);
        };
      }
    }
  });

  return newO;
}
