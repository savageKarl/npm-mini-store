/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const setTip = (function () {
    setTimeout(() => {
        function tip(text) {
            console.error(`必须在 app.js 文件 调用 ${text}()，参考：https://www.npmjs.com/package/@savage181855/mini-store`);
        }
        if (!types.isProxyPage)
            tip("proxyPage");
        if (!types.isProxyComponent)
            tip("proxyComponent");
        if (!types.isProxyApp)
            tip("proxyApp");
    });
    const types = {
        isProxyPage: false,
        isProxyComponent: false,
        isProxyApp: false,
    };
    return function (text) {
        types[text] = true;
    };
})();

function proxyApp() {
    setTip("isProxyApp");
    const originApp = App;
    App = function (options) {
        const rest = __rest(options, ["stores"]);
        const newOptions = Object.assign(Object.assign({}, rest), { onLaunch(o) {
                var _a;
                this.type = "app";
                const { stores } = options;
                stores === null || stores === void 0 ? void 0 : stores.forEach((s) => {
                    const { useStoreRef } = s, rest = __rest(s, ["useStoreRef"]);
                    useStoreRef(this, rest);
                });
                (_a = options === null || options === void 0 ? void 0 : options.onLaunch) === null || _a === void 0 ? void 0 : _a.call(this, o);
            } });
        originApp(newOptions);
    };
}
function proxyPage(globalOptions) {
    setTip("isProxyPage");
    const OriginPage = Page;
    Page = function (options) {
        let newOptions = Object.assign(Object.assign(Object.assign({}, globalOptions), options), { onLoad(o) {
                var _a, _b;
                const { stores } = options;
                stores === null || stores === void 0 ? void 0 : stores.forEach((s) => {
                    const { useStoreRef } = s, rest = __rest(s, ["useStoreRef"]);
                    useStoreRef(this, rest);
                });
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onLoad) === null || _a === void 0 ? void 0 : _a.call(this, o);
                (_b = options === null || options === void 0 ? void 0 : options.onLoad) === null || _b === void 0 ? void 0 : _b.call(this, o);
            },
            onShow() {
                var _a, _b;
                // const { stores } = options;
                // stores?.forEach((s) => {
                //   const { useStoreRef, ...rest } = s;
                //   useStoreRef(this, rest);
                // });
                // 这里调用
                console.debug('onShow');
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onLoad) === null || _a === void 0 ? void 0 : _a.call(this, {});
                (_b = options === null || options === void 0 ? void 0 : options.onLoad) === null || _b === void 0 ? void 0 : _b.call(this, {});
            },
            onUnload() { } });
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
function proxyComponent(globalOptions = {}) {
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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dist = createCommonjsModule(function (module, exports) {
function t(e,n){if(e===n)return !0;if("object"!=typeof e||null===e||"object"!=typeof n||null===n)return !1;const r=/Function|RegExp|Date|Object|Array/,o=Object.prototype.toString.call(e).slice(8,-1),s=Object.prototype.toString.call(n).slice(8,-1);if("Object"!==o&&"Array"!==o&&"Object"!==s&&"Object"!==s&&r.exec(o)[0]===r.exec(s)[0]&&o===s)return !0;if(Object.keys(e).length!==Object.keys(n).length)return !1;for(let r of Object.keys(e)){const o=t(e[r],n[r]);if(!o)return o}return !0}function e(t){if(!t||"object"!=typeof t)return t;if(/Function|RegExp|Date/.test(Object.prototype.toString.call(t)))return t;const n="Array"===Object.prototype.toString.call(t)?[]:{};for(let r in t)n[r]="object"==typeof t[r]?e(t[r]):t[r];return n}const n={subscribeList:{},pubAndNoSub:{},subscribe(t,e){this.pubAndNoSub[t]&&(e(this.pubAndNoSub[t]),Reflect.deleteProperty(this.pubAndNoSub,t)),this.subscribeList[t]?.push(e)||(this.subscribeList[t]=[e]);},publish(t,e){const n=this.subscribeList[t];n&&0!==n.length?n.forEach((t=>t(e))):this.pubAndNoSub[t]=e;},remove(t,e){const n=this.subscribeList[t];n&&0!==n.length&&(e?n.forEach(((n,r)=>{n===e&&this.subscribeList[t].splice(r,1);})):this.subscribeList[t]=[]);}};exports.debounce=function(t,e=1500,n=!0){let r;return function(...o){r&&clearTimeout(r),n?(r||t.apply(this,o),r=setTimeout((()=>r=null),e)):r=setTimeout((()=>t.apply(this,o)),e);}},exports.deepClone=e,exports.get=function(t,e){return e.replace(/\[(\w+)\]/g,".$1").replace(/\["(\w+)"\]/g,".$1").replace(/\['(\w+)'\]/g,".$1").split(".").reduce(((t,e)=>t?.[e]),t)},exports.getSingle=function(t){let e;return function(...n){return e||(e=t.apply(this,n))}},exports.hasChanged=function(e,n){return !t(e,n)},exports.installEventCenter=function(t){const r=e(n);for(let e in n)t[e]=r[e];return t},exports.isObject=function(t){return null!==t&&"object"==typeof t},exports.isSameDeep=t,exports.isSameShallow=function(t,e){if(t===e)return !0;if("object"!=typeof t||null===t||"object"!=typeof e||null===e)return !1;if(Object.keys(t).length!==Object.keys(e).length)return !1;for(let n of Object.keys(t))if(t[n]!==e[n])return !1;return !0},exports.parseAreaListData=function(t){const e=[],{province_list:n,city_list:r,county_list:o}=t;for(const t in n){const s=t.substr(0,2),i={};i.value=n[t],i.label=n[t];for(const t in r){const e=t.substr(0,4),n={};if(e.includes(s)){n.value=r[t],n.label=r[t];for(const t in o){const r={};t.includes(e)&&(r.value=o[t],r.label=o[t],n.children.push(r));}i.children.push(n);}}e.push(i);}return e},exports.shallowClone=function(t){if(!t||"object"!=typeof t)return t;if(/Function|RegExp|Date/.test(Object.prototype.toString.call(t)))return t;const e="Array"===Object.prototype.toString.call(t)?[]:{};for(let n in t)e[n]=t[n];return e},exports.throttle=function(t,e=1500,n="timestamp"){if("timestamp"===n){let n=0;return function(...r){const o=Date.now();o-n>e&&(t.apply(this,r),n=o);}}{let n;return function(...r){n||(n=setTimeout((()=>{t.apply(this,r),n=null;}),e));}}};
});
dist.debounce;
var dist_2 = dist.deepClone;
dist.get;
dist.getSingle;
var dist_5 = dist.hasChanged;
dist.installEventCenter;
var dist_7 = dist.isObject;
dist.isSameDeep;
dist.isSameShallow;
dist.parseAreaListData;
dist.shallowClone;
dist.throttle;

const depens = {};
function createReactive(target) {
    // const deps: DepsType = new Map();
    const obj = new Proxy(target, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            // debugger;
            if (dist_7(res))
                return createReactive(res);
            return res;
        },
        set(target, key, value, receiver) {
            const oldV = dist_2(target[key]);
            const res = Reflect.set(target, key, value, receiver);
            // debugger;
            // 不搞根据属性收集依赖那一套了，store，一变化，拿到当前route，然后区分是哪一个store，再diff mapState和 watch
            if (dist_5(oldV, value)) ;
            return res;
        },
    });
    return obj;
}
/** convert actions to solve the problem of this loss in store actions */
function setupActions(plainStore, proxyStore) {
    for (let k in plainStore) {
        if (typeof plainStore[k] === "function") {
            plainStore[k] = plainStore[k].bind(proxyStore);
        }
    }
}
/** install the patch method to the store */
function setupPatchOfStore(store) {
    store.patch = function (val) {
        if (typeof val === "object") {
            for (let k in val) {
                store[k] = val[k];
            }
        }
        if (typeof val === "function") {
            val(store);
        }
    };
}
function defineStore(options) {
    const update = Symbol('update');
    // 给store设置一个update的方法，这样子proxy set 改变的时候
    const plainStore = Object.assign(Object.assign(Object.assign({}, options.state), options.actions), { [update]() {
            // proxy set 以及page show 生命周期会调用这个方法
            // 这里逻辑，获取当前 page route，然后去  depens，里面拿当前page的所有依赖，mapState，watch，然后diff，再进行setData或者调用回调
        } });
    const store = createReactive(plainStore);
    setupActions(plainStore, store);
    setupPatchOfStore(store);
    return function useStore(instance, options) {
        instance[options.storeKey] = store;
        if (instance.type === "app")
            return;
        depens[instance.route] = depens[instance.route] || [];
        depens[instance.route].push(Object.assign({ instance }, options));
    };
}
// export function defineStore(options) {
//   const obj = {
//     ...options.state,
//     ...options.actions,
//     // 批量修改值
//     patch(val) {
//       if (typeof val === "object") {
//         for (let k in val) {
//           store[k] = val[k];
//         }
//       }
//       if (typeof val === "function") {
//         val(store);
//       }
//     },
//     // 组件无法劫持生命周期自动取消订阅，故提供方法
//     cancelUse(_this) {
//       _this.onUnload();
//     },
//   };
//   installEventCenter(obj);
//   function createGetter() {
//     return function get(target, key, receiver) {
//       const res = Reflect.get(target, key, receiver);
//       // 深层代理对象的关键！！！判断这个属性是否是一个对象，是的话继续代理动作，使对象内部的值可追踪
//       if (isObject(res)) {
//         return reactive(res);
//       }
//       return res;
//     };
//   }
//   function createSetter() {
//     return function set(target, key, value, receiver) {
//       const oldStore = deepClone(store);
//       const result = Reflect.set(target, key, value, receiver);
//       Reflect.ownKeys(store.subscribeList).forEach((key) => {
//         const oldValue = get(oldStore, key);
//         const value = get(store, key);
//         if (hasChanged(oldValue, value)) {
//           store.subscribeList[key].forEach((fn) => fn(oldValue, value));
//         }
//       });
//       return result;
//     };
//   }
//   const mutableHandlers = {
//     get: createGetter(),
//     set: createSetter(),
//   };
//   function reactive(target) {
//     return createReactiveObject(target, mutableHandlers);
//   }
//   // 创建一个响应式对象
//   function createReactiveObject(target, baseHandlers) {
//     const proxy = new Proxy(target, baseHandlers);
//     return proxy;
//   }
//   let store = null;
//   store = reactive(obj);
//   /**
//    * 注意：该方法一定要在onLoad或者attached钩子里面调用
//    * pageInstance 当前页面实例
//    * arrState 需要映射的数据
//    * arrActions 需要映射的方法
//    * watch 监听
//    */
//   return function (pageInstance, arrState = [], arrActions = [], watch = {}) {
//     // 调用函数的时候就要注入state，actions和store
//     arrActions.forEach((fn) => (pageInstance[fn] = store[fn].bind(store)));
//     pageInstance.data.store = store;
//     const data = {};
//     arrState.forEach((key) => (data[key] = store[key]));
//     pageInstance.setData(data);
//     const dataCallbacks = {};
//     arrState.forEach((key) => {
//       dataCallbacks[key] = (oldValue, value) => {
//         pageInstance.setData({ [key]: value });
//       };
//       store.subscribe(key, dataCallbacks[key]);
//     });
//     Reflect.ownKeys(watch).forEach((key) => {
//       store.subscribe(key, watch[key].bind(pageInstance));
//     });
//     // console.debug(store.subscribeList);
//     const _onUnload = pageInstance.onUnload || function () {};
//     pageInstance.onUnload = function () {
//       // 装饰onUnload取消订阅，性能优化
//       _onUnload();
//       Reflect.ownKeys(dataCallbacks).forEach((k) =>
//         store.remove(k, dataCallbacks[k])
//       );
//       Reflect.ownKeys(watch).forEach((k) => store.remove(k, watch[k]));
//     };
//     return store;
//   };
// }

export { defineStore, proxyApp, proxyComponent, proxyPage };
