/// <reference types="miniprogram-api-typings" />
export declare function extend(target: WechatMiniprogram.IAnyObject, source: WechatMiniprogram.IAnyObject, thisArg: any): WechatMiniprogram.IAnyObject;
export declare function each<T extends object>(obj: T, fn: (v: T[keyof T], i: keyof T, obj: T) => unknown): void;
