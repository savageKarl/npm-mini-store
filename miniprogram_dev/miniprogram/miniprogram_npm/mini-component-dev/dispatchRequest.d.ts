import { AxiosRequestConfig, AxiosResponse } from "./types";
export declare function dispatchRequest<T extends ArrayBuffer>(config: AxiosRequestConfig): AxiosResponse<T>;
