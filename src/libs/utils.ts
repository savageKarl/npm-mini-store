// import { dataTypes } from "@savage181855/data-types";

// import forEach from "lodash-es/forEach";

export function extend(
  target: WechatMiniprogram.IAnyObject,
  source: WechatMiniprogram.IAnyObject,
  thisArg: any
) {
  // forEach(source, function (val, key) {
  //   if (dataTypes.isObject(thisArg) && dataTypes.isFunction(val)) {
  //     target[key] = (val as Function).bind(thisArg);
  //   } else {
  //     target[key] = val;
  //   }
  // });
  return target;
}

export function each<T extends object>(
  obj: T,
  fn: (v: T[keyof T], i: keyof T, obj: T) => unknown
) {
  // if (dataTypes.isObject(obj) || dataTypes.isArray(obj)) {
  //   for (let k in obj) {
  //     const res = fn(obj[k], k, obj);
  //     if (dataTypes.isBoolean(res) && String(res) === 'false') break;
  //   }
  // }
}