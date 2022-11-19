import { adapter } from "./adapter";

import { AxiosRequestConfig, AxiosResponse } from "./types";

export function dispatchRequest<T extends ArrayBuffer>(
  config: AxiosRequestConfig
): AxiosResponse<T> {
  // 在这里进行，baseUrl拼接，转换数据的操作等等。

  config.url = config.baseURL ? config.baseURL + config.url : config.url;
  return adapter(config);
}
