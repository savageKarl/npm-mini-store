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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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

var setTip = (function () {
    setTimeout(function () {
        function tip(text) {
            console.error("\u5FC5\u987B\u5728 app.js|ts \u6587\u4EF6 \u8C03\u7528 ".concat(text, "()\uFF0C\u53C2\u8003\uFF1Ahttps://www.npmjs.com/package/@savage181855/mini-store"));
        }
        if (!types.isProxyPage)
            tip("proxyPage");
        if (!types.isProxyComponent)
            tip("proxyComponent");
        if (!types.isProxyApp)
            tip("proxyApp");
    });
    var types = {
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
    var pages = getCurrentPages();
    return ((_a = pages[pages.length - 1]) === null || _a === void 0 ? void 0 : _a.route) || '';
}

var Dep = /** @class */ (function (_super) {
    __extends(Dep, _super);
    function Dep() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dep.stores = {};
    Dep.stack = [];
    return Dep;
}(Map));
// not pure function
function updateStoreState() {
    var path = getCurrentPagePath();
    if (!path)
        return;
    var stores = Dep.stores[path];
    if (!stores)
        return;
    stores.forEach(function (s) {
        var mapState = s.mapState, instance = s.instance, store = s.store, watch = s.watch, mapComputed = s.mapComputed;
        var stateArr = [];
        if (mapState)
            stateArr.push.apply(stateArr, mapState);
        if (mapComputed)
            stateArr.push.apply(stateArr, mapComputed);
        var data = {};
        stateArr === null || stateArr === void 0 ? void 0 : stateArr.forEach(function (key) {
            if (!isSameDeep_1(instance.data[key], store[key])) {
                data[key] = deepClone_1(store[key]);
            }
        });
        if (JSON.stringify(data) !== "{}")
            instance.setData(data);
        if (watch) {
            Object.keys(watch).forEach(function (key) {
                if (!isSameDeep_1(instance.watchValue[key], store[key])) {
                    var newValue = deepClone_1(store[key]);
                    watch[key] = watch[key].bind(instance);
                    watch[key](instance.watchValue[key], newValue);
                    instance.watchValue[key] = newValue;
                }
            });
        }
    });
}
function clearStoreDep() {
    var path = getCurrentPagePath();
    Dep.stores[path] = [];
}
// not pure function
function removeStoreDep(instance) {
    var path = getCurrentPagePath();
    Dep.stores[path] = Dep.stores[path].filter(function (item) { return item.instance !== instance; });
}

function callUseStoreRef(instance, stores) {
    stores === null || stores === void 0 ? void 0 : stores.forEach(function (s) {
        var useStoreRef = s.useStoreRef, rest = __rest(s, ["useStoreRef"]);
        useStoreRef(instance, rest);
    });
}
function proxyApp() {
    setTip("isProxyApp");
    var originApp = App;
    App = function (options) {
        options.stores; var rest = __rest(options, ["stores"]);
        var newOptions = __assign(__assign({}, rest), { onLaunch: function (o) {
                var _a;
                this.type = "app";
                var stores = options.stores;
                callUseStoreRef(this, stores);
                (_a = options === null || options === void 0 ? void 0 : options.onLaunch) === null || _a === void 0 ? void 0 : _a.call(this, o);
            } });
        return originApp(newOptions);
    };
}
function proxyPage(globalOptions) {
    if (globalOptions === void 0) { globalOptions = {}; }
    setTip("isProxyPage");
    var OriginPage = Page;
    Page = function (options) {
        options.stores; var rest = __rest(options, ["stores"]);
        var newOptions = __assign(__assign(__assign({}, globalOptions), rest), { onLoad: function (o) {
                var _a, _b;
                var stores = options.stores;
                callUseStoreRef(this, stores);
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onLoad) === null || _a === void 0 ? void 0 : _a.call(this, o);
                (_b = options === null || options === void 0 ? void 0 : options.onLoad) === null || _b === void 0 ? void 0 : _b.call(this, o);
            }, onShow: function () {
                var _a, _b;
                updateStoreState();
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onShow) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = options === null || options === void 0 ? void 0 : options.onShow) === null || _b === void 0 ? void 0 : _b.call(this);
            }, onUnload: function () {
                var _a, _b;
                clearStoreDep();
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.onUnload) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = options === null || options === void 0 ? void 0 : options.onUnload) === null || _b === void 0 ? void 0 : _b.call(this);
            } });
        var hooks = [
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
function proxyComponent(globalOptions) {
    if (globalOptions === void 0) { globalOptions = {}; }
    setTip("isProxyComponent");
    var OriginComponent = Component;
    Component = function (options) {
        options.stores; var rest = __rest(options, ["stores"]);
        var newOptions = __assign(__assign(__assign({}, globalOptions), rest), { attached: function () {
                var _a, _b;
                this.route = getCurrentPagePath();
                var stores = options.stores;
                callUseStoreRef(this, stores);
                updateStoreState();
                (_a = options === null || options === void 0 ? void 0 : options.attached) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.attached) === null || _b === void 0 ? void 0 : _b.call(this);
            }, detached: function () {
                var _a, _b;
                removeStoreDep(this);
                (_a = options === null || options === void 0 ? void 0 : options.detached) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.detached) === null || _b === void 0 ? void 0 : _b.call(this);
            }, lifetimes: {
                attached: function () {
                    var _a, _b, _c, _d;
                    this.route = getCurrentPagePath();
                    var stores = options.stores;
                    callUseStoreRef(this, stores);
                    updateStoreState();
                    (_b = (_a = options === null || options === void 0 ? void 0 : options.lifetimes) === null || _a === void 0 ? void 0 : _a.attached) === null || _b === void 0 ? void 0 : _b.call(this);
                    (_d = (_c = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.lifetimes) === null || _c === void 0 ? void 0 : _c.attached) === null || _d === void 0 ? void 0 : _d.call(this);
                },
                detached: function () {
                    var _a, _b, _c, _d;
                    removeStoreDep(this);
                    (_b = (_a = options === null || options === void 0 ? void 0 : options.lifetimes) === null || _a === void 0 ? void 0 : _a.detached) === null || _b === void 0 ? void 0 : _b.call(this);
                    (_d = (_c = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.lifetimes) === null || _c === void 0 ? void 0 : _c.detached) === null || _d === void 0 ? void 0 : _d.call(this);
                },
            } });
        var hooks = [
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
    var newO = deepClone_1(newOptions);
    hooks.forEach(function (name) {
        var _a, _b;
        // 这里分割的原因是要注入 lifetimes.created 这种 hook
        var paths = name.split(".");
        var len = paths.length;
        var indexOne = paths[0];
        if (len === 1) {
            newO[indexOne] = function () {
                var _a, _b;
                (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions[indexOne]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([this], Array.from(arguments), false));
                (_b = options === null || options === void 0 ? void 0 : options[indexOne]) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([this], Array.from(arguments), false));
            };
        }
        else {
            var indexTwo_1 = paths[1];
            // pageLifetimes 的生命周期会覆盖this上的生命周期
            if (((_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions[indexOne]) === null || _a === void 0 ? void 0 : _a[indexTwo_1]) ||
                ((_b = options === null || options === void 0 ? void 0 : options[indexOne]) === null || _b === void 0 ? void 0 : _b[indexTwo_1])) {
                newO[indexOne][indexTwo_1] = function () {
                    var _a, _b, _c, _d;
                    (_b = (_a = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions[indexOne]) === null || _a === void 0 ? void 0 : _a[indexTwo_1]) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([this], Array.from(arguments), false));
                    (_d = (_c = options === null || options === void 0 ? void 0 : options[indexOne]) === null || _c === void 0 ? void 0 : _c[indexTwo_1]) === null || _d === void 0 ? void 0 : _d.call.apply(_d, __spreadArray([this], Array.from(arguments), false));
                };
            }
        }
    });
    return newO;
}

// not pure function
function createReactive(target) {
    var deps = new Dep();
    var obj = new Proxy(target, {
        get: function (target, key, receiver) {
            var res = Reflect.get(target, key, receiver);
            if (Dep.stack.length > 0) {
                if (!deps.get(key))
                    deps.set(key, new Set());
                Dep.stack.forEach(function (item) {
                    var _a;
                    (_a = deps.get(key)) === null || _a === void 0 ? void 0 : _a.add(item);
                });
            }
            return res;
        },
        set: function (target, key, value, receiver) {
            var _a;
            var oldV = deepClone_1(target[key]);
            var res = Reflect.set(target, key, value, receiver);
            if (hasChanged_1(oldV, value)) {
                (_a = deps.get(key)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) { return item(oldV, value); });
            }
            updateStoreState();
            return res;
        },
    });
    for (var k in obj) {
        var child = obj[k];
        if (isObject_1(child)) {
            obj[k] = createReactive(obj[k]);
        }
    }
    return obj;
}
// not pure function
function setupActions(plainStore, proxyStore) {
    for (var k in plainStore) {
        if (typeof plainStore[k] === "function") {
            plainStore[k] = plainStore[k].bind(proxyStore, proxyStore);
        }
    }
}
// not pure function
function setupPatchOfStore(plainStore, proxyStore) {
    plainStore.patch = function (val) {
        if (typeof val === "object") {
            for (var k in val) {
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
        var _loop_1 = function (k) {
            fns[k] = fns[k].bind(proxyStore, proxyStore);
            Dep.stack.push(function () { return (proxyStore[k] = fns[k]()); });
            proxyStore[k] = fns[k]();
            Dep.stack.pop();
        };
        for (var k in fns) {
            _loop_1(k);
        }
    }
}
function createStore(options) {
    var plainStore = __assign(__assign(__assign({}, options.state), options.actions), options.computed);
    var store = createReactive(plainStore);
    setupActions(plainStore, store);
    setupPatchOfStore(plainStore, store);
    setupComputed(options.computed, store);
    return store;
}

function defineStore(options) {
    var state = options.state;
    var computed = options.computed;
    var actions = options.actions;
    var store = createStore(options);
    return function useStore(instance, options) {
        instance[options.storeKey] = store;
        if (instance.type === "app")
            return;
        // ;debugger;
        var o = options;
        var stateKeys = Object.keys(state);
        if (o.mapState) {
            o.mapState.forEach(function (key) {
                if (!stateKeys.includes(key)) {
                    console.error("msg: mapState \"".concat(key, "\" not in ").concat(o.storeKey, ";\n\n") +
                        "info: filePath: ".concat(instance.is, ";"));
                    return;
                }
            });
        }
        if (o.watch) {
            // use to compare watch whether to execute
            var watchValue_1 = {};
            Object.keys(o.watch).forEach(function (key) {
                if (!stateKeys.includes(key)) {
                    console.error("msg: watch \"".concat(key, "\" not in ").concat(o.storeKey, ";\n\n") +
                        "info: filePath: ".concat(instance.is, ";"));
                    return;
                }
                watchValue_1[key] = deepClone_1(store[key]);
            });
            instance.watchValue = __assign(__assign({}, instance.watchValue), watchValue_1);
        }
        if (o.mapComputed) {
            // use to compare computed function whether to execute
            var computedKeys_1 = Object.keys(computed);
            o.mapComputed.forEach(function (key) {
                if (!computedKeys_1.includes(key)) {
                    console.error("msg: mapComputed \"".concat(key, "\" not in ").concat(o.storeKey, ";\n\n") +
                        "info: filePath: ".concat(instance.is, ";"));
                    return;
                }
            });
        }
        if (o.mapActions) {
            // use to compare computed function whether to execute
            var actionKeys_1 = Object.keys(actions);
            o.mapActions.forEach(function (key) {
                if (!actionKeys_1.includes(key)) {
                    console.error("msg: mapActions \"".concat(key, "\" not in ").concat(o.storeKey, ";\n\n") +
                        "info: filePath: ".concat(instance.is, ";"));
                    return;
                }
                instance[key] = store[key];
            });
        }
        var route = instance.route;
        Dep.stores[route] = Dep.stores[route] || [];
        var isExist = Dep.stores[route].some(function (v) {
            return v.instance === instance && v.store === store;
        });
        if (!isExist) {
            Dep.stores[route].push(__assign(__assign({}, o), { instance: instance, store: store }));
        }
    };
}

export { defineStore, proxyApp, proxyComponent, proxyPage };
//# sourceMappingURL=index.js.map
