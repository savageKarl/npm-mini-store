import { AxiosRequestConfig } from "./types";

export const defaultConfig: AxiosRequestConfig = {
  url: "",
  data: {},
  header: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
  method: "GET",
  dataType: "json",
  responseType: "text",
};
