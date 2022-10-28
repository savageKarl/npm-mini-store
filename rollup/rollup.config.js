// 这里为什么这么写？因为js被执行文件要遵循模块化规范，这个项目的gulp打包ts用的是ts-node，ts-node内部的做法是先将ts转为js，使用coomonjs规范，所以整个项目只能使用commonjs规范，rollup被打包的文件必须使用esm规范，所以tsconfig.rollup.json里面的module必须设置为 esnext等等
// 为什么不使用 rollup 打包 组件？有因为特殊文件依赖，没有明确使用导出语法的，用webpack或者rollup打包后，就会出现依赖丢失的问题，打包组件只能用gulp，组件使用ts写的。

const path = require("path");
const ts = require("rollup-plugin-typescript2");
const config = require("../config/config.js");

const { srcLibsPath, devLibsPath, distPath } = config;

const env = process.env.NODE_ENV;

const output = [{ format: "esm" }];

if (env === "dev") {
  output[0].file = path.resolve(devLibsPath, "index.js");
} else {
  output[0].file = path.resolve(distPath, "index.js");
}

module.exports = {
  input: path.resolve(srcLibsPath, "index.ts"),
  output: output,
  plugins: [
    ts({
      tsconfig: path.resolve(__dirname, "tsconfig.rollup.json"),
    }),
  ],
};
