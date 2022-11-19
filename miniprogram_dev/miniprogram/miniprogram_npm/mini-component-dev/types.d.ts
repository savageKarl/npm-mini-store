/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
export declare type Callback<T extends any | any[] = any[]> = T extends any[] ? (...arg: T) => any : (arg: T) => any;
export declare type HandlerItem = {
    fulfilled: Callback;
    rejected: Callback;
} | null;
export declare type HandlersType = HandlerItem[];
export declare type AxiosRequestData = string | WechatMiniprogram.IAnyObject | ArrayBuffer;
export declare type AxiosRequestHeaders = Record<string, string | number | boolean>;
export declare type AxiosResponseHeaders = Record<string, string> & {
    "set-cookie"?: string[];
};
export interface AxiosRequestTransformer {
    (data: any, headers?: AxiosRequestHeaders): any;
}
export interface AxiosResponseTransformer {
    (data: any, headers?: AxiosResponseHeaders): any;
}
export interface AxiosAdapter {
    (config: AxiosRequestConfig): AxiosPromise;
}
export interface AxiosProxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}
export declare type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "delete" | "DELETE" | "trace" | "TRACE" | "connect" | "CONNECT";
export declare type ResponseType = "arraybuffer" | "text";
export interface TransitionalOptions {
    silentJSONParsing?: boolean;
    forcedJSONParsing?: boolean;
    clarifyTimeoutError?: boolean;
}
export interface AxiosRequestConfig<D = any> {
    url?: string;
    method?: Method;
    baseURL?: string;
    enableChunked?: boolean;
    enableCache?: boolean;
    enableHttp2?: boolean;
    enableHttpDNS?: boolean;
    enableQuic?: boolean;
    dataType?: string | "其他";
    forceCellularNetwork?: boolean;
    header?: AxiosRequestHeaders;
    params?: any;
    data?: D;
    timeout?: number;
    adapter?: AxiosAdapter;
    responseType?: "arraybuffer" | "text";
}
export declare type AxiosResponse<T = any> = Promise<{
    cookies: string[];
    data: T;
    header: WechatMiniprogram.IAnyObject;
    profile: WechatMiniprogram.RequestProfile;
    statusCode: number;
    errMsg: string;
}>;
export interface AxiosError<T = any, D = any> extends Error {
    config: AxiosRequestConfig<D>;
    code?: string;
    request?: any;
    isAxiosError: boolean;
    toJSON: () => object;
}
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}
export declare type AxiosInstance<T> = {
    (config: AxiosRequestConfig): AxiosPromise;
    (url: string, config?: AxiosRequestConfig): AxiosPromise;
} & T;
