const path = require("path");

const joinPath = path.resolve;

const config = {
  /** 组件源代码存放的目录 */
  srcComponentPath: joinPath(__dirname, "../src/components"),

  /** lib 源代码存放目录 */
  srcLibsPath: joinPath(__dirname, "../src/libs"),

  /** 开发中的组件存放example目录，用于实时查看开发效果 */
  devComponentPath: joinPath(
    __dirname,
    "../miniprogram_dev/miniprogram/components"
  ),

  /** 开发中的 libs 存放example目录，用于实时查看开发效果 */
  devLibsPath: joinPath(__dirname, "../miniprogram_dev/miniprogram/libs"),

  /** 打包后存放代码的目标目录 */
  distPath: joinPath(__dirname, "../miniprogram_dist"),

  /** css开发使用语言 */
  css: "scss",

  /** 压缩 */
  minify: {
    
    /** js 和 ts是否压缩 */
    jsAndTs: true,

    /** css 是否压缩 */
    css: true,

    /** 图片 是否压缩 */
    img: true,
  },
};

module.exports = config;
