import path from "path";

import type { Config } from "./types";

export const joinPath = path.resolve;

const config: Config = {
  srcPath: joinPath(__dirname, "../src"),
  distPath: joinPath(__dirname, "../miniprogram_dist"),
  devComponentPath: joinPath(
    __dirname,
    "../miniprogram_dev/miniprogram/components"
  ),

  css: "wxss",
  minify: {
    css: true,
    jsAndTs: true,
    img: true,
  },
};

export default config;
