import path from "path";

import type { Config } from "./types";

export const joinPath = path.resolve;

const config: Config = {
  entry: "",
  srcPath: joinPath(__dirname, "../src"),
  distPath: joinPath(__dirname, "../miniprogram_dist"),
  demoSrc: joinPath(__dirname, '../tools/demo'),
  demoDist: joinPath(__dirname, '../miniprogram_dev'),
  demoComponentPath: joinPath(__dirname, '../miniprogram_dev/compoents'),
  
  css: "wxss",
  minify: {
    css: true,
    jsAndTs: true,
    img: true,
  },
};

export default config;
