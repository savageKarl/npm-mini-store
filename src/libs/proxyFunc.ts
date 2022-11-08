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
} from "./types";

import { setTip } from "./tips";

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

        stores?.forEach((s) => {
          const { useStoreRef, ...rest } = s;
          useStoreRef(this, rest);
        });

        options?.onLaunch?.call(this, o);
      },
    } as AppOptions;

    originApp(newOptions);
  } as any;
}

export function proxyPage(globalOptions: PageOptions) {
  setTip("isProxyPage");

  const OriginPage = Page;
  Page = function (options: PageNewOptions) {
    let newOptions: PageOptions = {
      ...globalOptions,
      ...options,
      onLoad(o) {
        const { stores } = options;
        stores?.forEach((s) => {
          const { useStoreRef, ...rest } = s;
          useStoreRef(this, rest);
        });

        globalOptions?.onLoad?.call(this, o);
        options?.onLoad?.call(this, o);
      },
      onShow() {
        // const { stores } = options;
        // stores?.forEach((s) => {
        //   const { useStoreRef, ...rest } = s;
        //   useStoreRef(this, rest);
        // });
// 这里调用
console.debug('onShow')
        globalOptions?.onLoad?.call(this, {});
        options?.onLoad?.call(this, {});
      },
      onUnload() {},
    };

    // const hooks = [
    //   "onReady",
    //   "onHide",
    //   "onPullDownRefresh",
    //   "onReachBottom",
    //   "onPageScroll",
    //   "onResize",
    //   "onTabItemTap",
    // ];
    // newOptions = mixinHooks(hooks, newOptions, globalOptions, options);

    OriginPage(newOptions);
  };
}

export function proxyComponent(globalOptions = {}) {
  setTip("isProxyComponent");

  // const OriginComponent = Component;
  // Component = function (options) {
  //   let newOptions = {
  //     ...globalOptions,
  //     ...options,
  //     attached() {
  //       const { useStoreRef, mapState, mapActions, watch } = options;
  //       if (useStoreRef) {
  //         useStoreRef(this, mapState, mapActions, watch);
  //       }

  //       options?.attached?.call(this, o);
  //       globalOptions?.attached?.call(this, o);
  //     },
  //     detached() {
  //       if (options.useStoreRef) {
  //         this.data.store.cancelUse(this);
  //       }
  //       options?.detached?.call(this, o);
  //       globalOptions?.detached?.call(this, o);
  //     },
  //     lifetimes: {
  //       attached() {
  //         const { useStoreRef, mapState, mapActions, watch } = options;
  //         if (useStoreRef) {
  //           useStoreRef(this, mapState, mapActions, watch);
  //         }

  //         options?.lifetimes?.attached?.call(this, o);
  //         globalOptions?.lifetimes?.attached?.call(this, o);
  //       },
  //       detached() {
  //         if (options.useStoreRef) {
  //           this.data.store.cancelUse(this);
  //         }
  //         options?.lifetimes?.detached?.call(this, o);
  //         globalOptions?.lifetimes?.detached?.call(this, o);
  //       },
  //     },
  //   };

  //   const hooks = [
  //     "created",
  //     "ready",
  //     "moved",
  //     "error",
  //     "lifetimes.created",
  //     "lifetimes.ready",
  //     "lifetimes.moved",
  //     "lifetimes.error",
  //     "pageLifetimes.show",
  //     "pageLifetimes.hide",
  //     "pageLifetimes.resize",
  //   ];
  //   newOptions =  mixinHooks(hooks, newOptions, globalOptions, options);

  //   OriginComponent(newOptions);
  // };
}

// type BaseOptions = Record<string, any>;

// /** 全局混入hook */
// function mixinHooks(
//   hooks: string[],
//   newOptions: BaseOptions,
//   globalOptions: BaseOptions,
//   options: BaseOptions
// ) {

//   const newO = deepClone(newOptions);

//   hooks.forEach((name) => {
//     // 这里分割的原因是要注入 lifetimes.created 这种 hook
//     const paths = name.split(".");
//     const len = paths.length;

//     if (len === 1) {
//       newO[paths[0]] = function () {
//         globalOptions?.[paths[0]]?.call(this, o);
//         options?.[paths[0]]?.call(this, o);
//       };
//     } else {
//       newO[paths[0]] = { ...newO?.[paths[0]] };
//       // pageLifetimes 的生命周期会覆盖this上的生命周期
//       if (
//         globalOptions?.[paths[0]]?.[paths[1]] ||
//         options?.[paths[0]]?.[paths[1]]
//       ) {
//         newO[paths[0]][paths[1]] = function () {
//           globalOptions?.[paths[0]]?.[paths[1]]?.call(this, o);
//           options?.[paths[0]]?.[paths[1]]?.call(this, o);
//         };
//       }
//     }
//   });

//   return newO;
// }
