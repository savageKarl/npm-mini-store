import {
  AxiosRequestConfig,
  AxiosResponse
} from "./types";

export function adapter(config: AxiosRequestConfig):AxiosResponse<any> {
  return new Promise((resovle, reject) => {
    wx.request({
      ...(config as any),
      success(res) {
        resovle(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}
