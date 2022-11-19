// import _ from "lodash-es";
// import { dataTypes } from "@savage181855/data-types";

import { dispatchRequest } from "./dispatchRequest";
import { Interceptor } from "./interceptor";

import { AxiosRequestConfig, AxiosRequestData, AxiosPromise } from "./types";

export class Axios {
  defaults = {} as AxiosRequestConfig;
  interceptors = {
    request: new Interceptor(),
    response: new Interceptor(),
  };

  constructor(defaults?: AxiosRequestConfig) {
    this.defaults = defaults || {};

    const methods = ["get", "delete", "head", "options"] as const;

    // for (let k of methods) {

    //   this[k] = <T>(url: string, config: AxiosRequestConfig) => {
    //     return this.request<T>(
    //       _.merge(config, {
    //         method: k,
    //         url,
    //         data: (config || {}).data,
    //       })
    //     );
    //   };
    // }

    const bodyMethods = ["post", "put"] as const;
    // for (let k of bodyMethods) {
    //   this[k] = <T>(
    //     url: string,
    //     data: AxiosRequestData,
    //     config: AxiosRequestConfig
    //   ) => {
    //     return this.request<T>(
    //       _.merge(config, {
    //         method: k,
    //         url,
    //         data,
    //       })
    //     );
    //   };
    // }
  }

  request<T>(config: AxiosRequestConfig) {
    // if (dataTypes.isString(config)) {
    //   // config = _.merge({ url: arguments[0] }, arguments[1]);
    // }

    // config = _.merge(this.defaults, config);

    let promise = Promise.resolve(config);
    let chain = [];

    // this.interceptors.request.forEach(function (interceptors) {
    //   if (interceptors) {
    //     chain.push(interceptors?.fulfilled, interceptors?.rejected);
    //   }
    // });
    // chain.push(dispatchRequest, null);
    // this.interceptors.response.forEach(function (interceptors) {
    //   chain.push(interceptors?.fulfilled, interceptors?.rejected);
    // });

    // while (chain.length) {
    //   promise = promise.then(chain.shift(), chain.shift());
    // }
    return promise as AxiosPromise<T>;
  }

  get<T>(url: string, config: AxiosRequestConfig) {
    return {} as AxiosPromise<T>;
  }
  options<T>(url: string, config: AxiosRequestConfig) {
    return {} as AxiosPromise<T>;
  }
  head<T>(url: string, config: AxiosRequestConfig) {
    return {} as AxiosPromise<T>;
  }
  delete<T>(url: string, config: AxiosRequestConfig) {
    return {} as AxiosPromise<T>;
  }

  post<T>(url: string, data: AxiosRequestData, config: AxiosRequestConfig<T>) {
    return {} as AxiosPromise<T>;
  }
  put<T>(url: string, data: AxiosRequestData, config: AxiosRequestConfig<T>) {
    return {} as AxiosPromise<T>;
  }

  all<T>(p: Promise<T>[]) {
    return Promise.all(p);
  }

  race<T>(p: Promise<T>[]) {
    return Promise.race(p);
  }
}
