export type Config = {
  /** 组件源代码存放的目录 */
  srcPath: string;

  /** 打包后存放代码的目标目录 */
  distPath: string;

  /** 开发中的组件存放example目录，用于实时查看开发效果 */
  devComponentPath: string;

  /** css开发使用语言 */
  css: "wxss" | "scss" | "less";

  /** 压缩 */
  minify: {
    /** js 和 ts是否压缩 */
    jsAndTs: boolean;
    /** css 是否压缩 */
    css: boolean;
    /** 图片 是否压缩 */
    img: boolean;
  };
};
