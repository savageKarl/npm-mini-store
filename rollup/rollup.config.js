// 为什么引入 rollup，因为gulp使用是ts插件还是babel插件编译ts太慢了，虽然bable插件相对快点，但还是很慢，rollup打包ts的速度快，体积小。
// 为什么这里用的是commonjs规范？因为js被执行文件要遵循模块化规范，这个项目的gulp打包ts用的是ts-node，ts-node内部的做法是先将ts转为js，使用coomonjs规范，所以整个项目只能使用commonjs规范，rollup被打包的文件必须使用esm规范，所以tsconfig.rollup.json里面的module必须设置为 esnext等等
// 为什么不使用 rollup 打包 组件？有因为特殊文件依赖，没有明确使用导出语法的，用webpack或者rollup打包后，就会出现依赖丢失的问题，编译组件只能用gulp，组件使用ts写的。

const path = require("path");
const ts = require("rollup-plugin-typescript2");
const del = require("rollup-plugin-delete");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const config = require("../config/config.js");

const { srcLibsPath, devLibsPath, distPath } = config;

const env = process.env.NODE_ENV;

const output = [
  {
    format: "esm",
    file: path.resolve(env === "dev" ? devLibsPath : distPath, "index.js"),
  },
];

const plugins = [
  ts({
    tsconfig: path.resolve(__dirname, "tsconfig.rollup.json"),
  }),
  // let it empty the dist, because rollup faster than gulp
  del({ targets: path.resolve(distPath, "*") }),
  commonjs(),
  resolve(),
];

if (env === 'pro') plugins.push(terser())


module.exports = {
  input: path.resolve(srcLibsPath, "index.ts"),
  output: output,
  plugins,
};

// 现在测试组件使用共同scss