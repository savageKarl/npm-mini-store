import { Interceptor } from "./interceptor";
import { AxiosRequestConfig, AxiosRequestData, AxiosPromise } from "./types";
export declare class Axios {
    defaults: AxiosRequestConfig<any>;
    interceptors: {
        request: Interceptor;
        response: Interceptor;
    };
    constructor(defaults?: AxiosRequestConfig);
    request<T>(config: AxiosRequestConfig): AxiosPromise<T>;
    get<T>(url: string, config: AxiosRequestConfig): AxiosPromise<T>;
    options<T>(url: string, config: AxiosRequestConfig): AxiosPromise<T>;
    head<T>(url: string, config: AxiosRequestConfig): AxiosPromise<T>;
    delete<T>(url: string, config: AxiosRequestConfig): AxiosPromise<T>;
    post<T>(url: string, data: AxiosRequestData, config: AxiosRequestConfig<T>): AxiosPromise<T>;
    put<T>(url: string, data: AxiosRequestData, config: AxiosRequestConfig<T>): AxiosPromise<T>;
    all<T>(p: Promise<T>[]): Promise<Awaited<T>[]>;
    race<T>(p: Promise<T>[]): Promise<Awaited<T>>;
}
