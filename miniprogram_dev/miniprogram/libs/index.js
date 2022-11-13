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

// a[3].b -> a.3.b -> [a, 3, b]
/** lodash get方法 */
function getType(o) {
    return Object.prototype.toString.call(o);
}
function compare(o1, o2, type) {
    if (o1 === o2)
        return true;
    // 如果基本类型不相等或者不是引用类型，并且不是对象就不用执行了
    if (typeof o1 !== "object" ||
        o1 === null ||
        typeof o2 !== "object" ||
        o2 === null) {
        return false;
    }
    var len1 = Object.keys(o1).length;
    var len2 = Object.keys(o2).length;
    if (len1 !== len2)
        return false;
    for (var _i = 0, _a = Object.keys(o1); _i < _a.length; _i++) {
        var key = _a[_i];
        if (type === "shallow") {
            if (o1[key] !== o2[key])
                return false;
        }
        if (type === "deep") {
            var result = compare(o1[key], o2[key], "deep");
            if (!result)
                return result;
        }
    }
    return true;
}
/** 对象深比较，比较所有层数据， 深比较主要的点在于，Object或Array实例的每一个属性，基本类型或者特殊构造器类型是否相同 */
function isSameDeep(o1, o2) {
    return compare(o1, o2, "deep");
}
var dataType = {
    object: "[object Object]",
    array: "[object Array]",
};
function clone(o, type) {
    var objType = getType(o);
    if (objType === dataType.object) {
        var obj_1 = {};
        Object.keys(o).forEach(function (k) {
            obj_1[k] =
                type === "shallow"
                    ? o[k]
                    : clone(o[k], "deep");
        });
        return obj_1;
    }
    if (objType === dataType.array) {
        return o.map(function (item) {
            return type === "shallow" ? item : clone(item, "deep");
        });
    }
    return o;
}
/** 深克隆，深克隆主要的点在于，复制Object或Array实例的每一个属性，基本类型和特殊构造器类型*/
function deepClone(obj) {
    return clone(obj, "deep");
}
function isObject(value) {
    return value !== null && typeof value === "object";
}
/** 判断值，使用深比较 */
function hasChanged(value, oldValue) {
    return !isSameDeep(value, oldValue);
}
var deepClone_1 = deepClone;
var hasChanged_1 = hasChanged;
var isObject_1 = isObject;
var isSameDeep_1 = isSameDeep;

const setTip = (function () {
    setTimeout(() => {
        function tip(text) {
            console.error(`必须在 app.js|ts 文件 调用 ${text}()，参考：https://www.npmjs.com/package/@savage181855/mini-store`);
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

function getCurrentPagePath() {
    var _a;
    const pages = getCurrentPages();
    return ((_a = pages[pages.length - 1]) === null || _a === void 0 ? void 0 : _a.route) || '';
}

class Dep extends Map {
}
Dep.stores = {};
Dep.stack = [];
// not pure function
function updateStoreState() {
    const path = getCurrentPagePath();
    if (!path)
        return;
    const stores = Dep.stores[path];
    if (!stores)
        return;
    stores.forEach((s) => {
        const { mapState, instance, store, watch, mapComputed } = s;
        const stateArr = [];
        if (mapState)
            stateArr.push(...mapState);
        if (mapComputed)
            stateArr.push(...mapComputed);
        const data = {};
        stateArr === null || stateArr === void 0 ? void 0 : stateArr.forEach((key) => {
            if (!isSameDeep_1(instance.data[key], store[key])) {
                data[key] = deepClone_1(store[key]);
            }
        });
        if (JSON.stringify(data) !== "{}")
            instance.setData(data);
        if (watch) {
            Object.keys(watch).forEach((key) => {
                if (!isSameDeep_1(instance.watchValue[key], store[key])) {
                    const newValue = deepClone_1(store[key]);
                    watch[key] = watch[key].bind(instance);
                    watch[key](instance.watchValue[key], newValue);
                    instance.watchValue[key] = newValue;
                }
            });
        }
    });
}
function clearStoreDep() {
    const path = getCurrentPagePath();
    Dep.stores[path] = [];
}
// not pure function
function removeStoreDep(instance) {
    const path = getCurrentPagePath();
    Dep.stores[path] = Dep.stores[path].filter((item) => item.instance !== instance);
}

function callUseStoreRef(instance, stores) {
    stores === null || stores === void 0 ? void 0 : stores.forEach((s) => {
        const { useStoreRef } = s, rest = __rest(s, ["useStoreRef"]);
        useStoreRef(instance, rest);
    });
}
function proxyApp() {
    setTip("isProxyApp");
    const originApp = App;
    App = function (options) {
        const rest = __rest(options, ["stores"]);
        const newOptions = Object.assign(Object.assign({}, rest), { onLaunch(o) {
                var _a;
                this.type = "app";
                const { stores } = options;
                callUseStoreRef(this, stores);
                (_a = options === null || options === void 0 ? void 0 : options.onLaunch) === null || _a === void 0 ? void 0 : _a.call(this, o);
            } });
        return originApp(newOptions);
    };
}
function proxyPage(globalOptions = {}) {
    setTip("isProxyPage");
    const OriginPage = Page;
    Page = function (options) {
        const rest = __rest(options, ["stores"]);
        let newOptions = Object.assign(Object.assign(Object.assign({}, globalOptions), rest), { onLoad(o) {
                var _a, _b;
                const { stores } = options;
                callUseStoreRef(this, stores);
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onLoad) === null || _a === void 0 ? void 0 : _a.call(this, o);
                (_b = options === null || options === void 0 ? void 0 : options.onLoad) === null || _b === void 0 ? void 0 : _b.call(this, o);
            },
            onShow() {
                var _a, _b;
                updateStoreState();
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onShow) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = options === null || options === void 0 ? void 0 : options.onShow) === null || _b === void 0 ? void 0 : _b.call(this);
            },
            onUnload() {
                var _a, _b;
                clearStoreDep();
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onUnload) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = options === null || options === void 0 ? void 0 : options.onUnload) === null || _b === void 0 ? void 0 : _b.call(this);
            } });
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
function proxyComponent(globalOptions = {}) {
    setTip("isProxyComponent");
    const OriginComponent = Component;
    Component = function (options) {
        const rest = __rest(options, ["stores"]);
        let newOptions = Object.assign(Object.assign(Object.assign({}, globalOptions), rest), { attached() {
                var _a, _b;
                this.route = getCurrentPagePath();
                const { stores } = options;
                callUseStoreRef(this, stores);
                updateStoreState();
                (_a = options === null || options === void 0 ? void 0 : options.attached) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.attached) === null || _b === void 0 ? void 0 : _b.call(this);
            },
            detached() {
                var _a, _b;
                removeStoreDep(this);
                (_a = options === null || options === void 0 ? void 0 : options.detached) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.detached) === null || _b === void 0 ? void 0 : _b.call(this);
            }, lifetimes: {
                attached() {
                    var _a, _b, _c, _d;
                    this.route = getCurrentPagePath();
                    const { stores } = options;
                    callUseStoreRef(this, stores);
                    updateStoreState();
                    (_b = (_a = options === null || options === void 0 ? void 0 : options.lifetimes) === null || _a === void 0 ? void 0 : _a.attached) === null || _b === void 0 ? void 0 : _b.call(this);
                    (_d = (_c = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.lifetimes) === null || _c === void 0 ? void 0 : _c.attached) === null || _d === void 0 ? void 0 : _d.call(this);
                },
                detached() {
                    var _a, _b, _c, _d;
                    removeStoreDep(this);
                    (_b = (_a = options === null || options === void 0 ? void 0 : options.lifetimes) === null || _a === void 0 ? void 0 : _a.detached) === null || _b === void 0 ? void 0 : _b.call(this);
                    (_d = (_c = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.lifetimes) === null || _c === void 0 ? void 0 : _c.detached) === null || _d === void 0 ? void 0 : _d.call(this);
                },
            } });
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
/** 全局混入hook */
function mixinHooks(hooks, newOptions, globalOptions, options) {
    const newO = deepClone_1(newOptions);
    hooks.forEach((name) => {
        var _a, _b;
        // 这里分割的原因是要注入 lifetimes.created 这种 hook
        const paths = name.split(".");
        const len = paths.length;
        const indexOne = paths[0];
        if (len === 1) {
            newO[indexOne] = function () {
                var _a, _b;
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions[indexOne]) === null || _a === void 0 ? void 0 : _a.call(this, ...Array.from(arguments));
                (_b = options === null || options === void 0 ? void 0 : options[indexOne]) === null || _b === void 0 ? void 0 : _b.call(this, ...Array.from(arguments));
            };
        }
        else {
            const indexTwo = paths[1];
            // pageLifetimes 的生命周期会覆盖this上的生命周期
            if (((_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions[indexOne]) === null || _a === void 0 ? void 0 : _a[indexTwo]) ||
                ((_b = options === null || options === void 0 ? void 0 : options[indexOne]) === null || _b === void 0 ? void 0 : _b[indexTwo])) {
                newO[indexOne][indexTwo] = function () {
                    var _a, _b, _c, _d;
                    (_b = (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions[indexOne]) === null || _a === void 0 ? void 0 : _a[indexTwo]) === null || _b === void 0 ? void 0 : _b.call(this, ...Array.from(arguments));
                    (_d = (_c = options === null || options === void 0 ? void 0 : options[indexOne]) === null || _c === void 0 ? void 0 : _c[indexTwo]) === null || _d === void 0 ? void 0 : _d.call(this, ...Array.from(arguments));
                };
            }
        }
    });
    return newO;
}

// not pure function
function createReactive(target) {
    const deps = new Dep();
    const obj = new Proxy(target, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            if (Dep.stack.length > 0) {
                if (!deps.get(key))
                    deps.set(key, new Set());
                Dep.stack.forEach((item) => {
                    var _a;
                    (_a = deps.get(key)) === null || _a === void 0 ? void 0 : _a.add(item);
                });
            }
            return res;
        },
        set(target, key, value, receiver) {
            var _a;
            const oldV = deepClone_1(target[key]);
            const res = Reflect.set(target, key, value, receiver);
            if (hasChanged_1(oldV, value)) {
                (_a = deps.get(key)) === null || _a === void 0 ? void 0 : _a.forEach((item) => item(oldV, value));
            }
            updateStoreState();
            return res;
        },
    });
    for (let k in obj) {
        const child = obj[k];
        if (isObject_1(child)) {
            obj[k] = createReactive(obj[k]);
        }
    }
    return obj;
}
// not pure function
function setupActions(plainStore, proxyStore) {
    for (let k in plainStore) {
        if (typeof plainStore[k] === "function") {
            plainStore[k] = plainStore[k].bind(proxyStore, proxyStore);
        }
    }
}
// not pure function
function setupPatchOfStore(plainStore, proxyStore) {
    plainStore.patch = function (val) {
        if (typeof val === "object") {
            for (let k in val) {
                proxyStore[k] = val[k];
            }
        }
        if (typeof val === "function") {
            val(proxyStore);
        }
    };
}
// not pure function
function setupComputed(fns, proxyStore) {
    if (fns) {
        for (let k in fns) {
            fns[k] = fns[k].bind(proxyStore, proxyStore);
            Dep.stack.push(() => (proxyStore[k] = fns[k]()));
            proxyStore[k] = fns[k]();
            Dep.stack.pop();
        }
    }
}
function createStore(options) {
    const plainStore = Object.assign(Object.assign(Object.assign({}, options.state), options.actions), options.computed);
    const store = createReactive(plainStore);
    setupActions(plainStore, store);
    setupPatchOfStore(plainStore, store);
    setupComputed(options.computed, store);
    return store;
}

function defineStore(options) {
    const state = options.state;
    const computed = options.computed;
    const actions = options.actions;
    const store = createStore(options);
    return function useStore(instance, options) {
        instance[options.storeKey] = store;
        if (instance.type === "app")
            return;
        // ;debugger;
        const o = options;
        const stateKeys = Object.keys(state);
        if (o.mapState) {
            o.mapState.forEach((key) => {
                if (!stateKeys.includes(key)) {
                    console.error(`msg: mapState "${key}" not in ${o.storeKey};\n\n` +
                        `info: filePath: ${instance.is};`);
                    return;
                }
            });
        }
        if (o.watch) {
            // use to compare watch whether to execute
            const watchValue = {};
            Object.keys(o.watch).forEach((key) => {
                if (!stateKeys.includes(key)) {
                    console.error(`msg: watch "${key}" not in ${o.storeKey};\n\n` +
                        `info: filePath: ${instance.is};`);
                    return;
                }
                watchValue[key] = deepClone_1(store[key]);
            });
            instance.watchValue = Object.assign(Object.assign({}, instance.watchValue), watchValue);
        }
        if (o.mapComputed) {
            // use to compare computed function whether to execute
            const computedKeys = Object.keys(computed);
            o.mapComputed.forEach((key) => {
                if (!computedKeys.includes(key)) {
                    console.error(`msg: mapComputed "${key}" not in ${o.storeKey};\n\n` +
                        `info: filePath: ${instance.is};`);
                    return;
                }
            });
        }
        if (o.mapActions) {
            // use to compare computed function whether to execute
            const actionKeys = Object.keys(actions);
            o.mapActions.forEach((key) => {
                if (!actionKeys.includes(key)) {
                    console.error(`msg: mapActions "${key}" not in ${o.storeKey};\n\n` +
                        `info: filePath: ${instance.is};`);
                    return;
                }
                instance[key] = store[key];
            });
        }
        const route = instance.route;
        Dep.stores[route] = Dep.stores[route] || [];
        const isExist = Dep.stores[route].some((v) => {
            return v.instance === instance && v.store === store;
        });
        if (!isExist) {
            Dep.stores[route].push(Object.assign(Object.assign({}, o), { instance: instance, store }));
        }
    };
}

export { defineStore, proxyApp, proxyComponent, proxyPage };
