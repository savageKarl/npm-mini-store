const path = require("path");

const joinPath = path.resolve;
const pkg = require("../package.json");

const config = {
  /** 微信开发工具的安装路径，用于启动项目 */
  devToolPath: "D:/100_software/微信web开发者工具",

  /** 组件源代码存放的目录 */
  srcComponentPath: joinPath(process.cwd(), "src/components"),

  /** lib 源代码存放目录 */
  srcLibsPath: joinPath(process.cwd(), "src/libs"),

  /** example目录，用于实时查看开发效果 */
  devPath: joinPath(process.cwd(), 'miniprogram_dev'),

  /** 开发中的组件存放example目录，用于实时查看开发效果 */
  devComponentPath: joinPath(
    process.cwd(),
    "miniprogram_dev/miniprogram/components"
  ),

  /** 开发中的 libs 存放example/miniprogram_npm目录，用于实时查看开发效果 */
  devLibsPath: joinPath(
    process.cwd(),
    "miniprogram_dev/miniprogram/miniprogram_npm",
    pkg.name
  ),

  /** 打包后存放代码的目标目录 */
  distPath: joinPath(process.cwd(), "miniprogram_dist"),

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
