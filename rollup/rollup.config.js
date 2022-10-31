

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
