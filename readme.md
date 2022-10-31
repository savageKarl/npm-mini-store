# mini-component-dev

> 基于 `gulp4` +`rollup2`+ `typescript`开发的微信小程序组件库打包脚手架

## 安装

```
git clone https://github.com/savage181855/mini-component-dev.git
```

## 支持功能

- ts 编译
- sass 编译
- less 编译
- js 压缩
- wxss 压缩
- wxml 压缩
- json 压缩
- png | jpg 压缩

## 目录结构

```
├─config               // 打包配置
├─gulpfile.ts          // gulp任务
├─miniprogram_dev      // 开发环境构建目录，在config里面配置
│  ├─miniprogram
│  │  ├─components     // 组件开发编译存放的目录，在config里面配置
│  │  ├─libs           // 函数库开发打包存放的目录，在config里面配置
│  │  └─pages
│  │      └─index
│  └─typings
├─miniprogram_dist     // 生产环境构建目录，自动压缩，可以自行替换
├─rollup               // rollup 打包器的配置文件
├─src                  // 库开发的代码
│  ├─components        // 组件库
│  ├─libs              // 函数库
└─types                // ts类型声明文件

```

## 主要说明 config.js 配置文件

`gulp`打包任务会读取`config.ts`的配置内容，这里可以自行修改配置和相关文件目录。

**类型说明**

```
declare const config: {
   /** 组件源代码存放的目录 */
  srcComponentPath: string;

  /** lib 源代码存放目录 */
  srcLibsPath: string;

  /** 开发中的组件存放example目录，用于实时查看开发效果 */
  devComponentPath: string;

  /** 开发中的 libs 存放example目录，用于实时查看开发效果 */
  devLibsPath: string;

  /** 打包后存放代码的目标目录 */
  distPath: string;

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
export default config;


```

**当前配置**

```
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


```

## 使用

1.安装依赖

```
npm install
```

2.开发环境自动检测文件改变自动编译

```
npm run dev
```

`gulp`会自动监测`config.srcComponentPath`目录并编译至`config.devComponentPath`，文件修改会自动重写进行编译。

`rollup`会自动监测`config.srcLibsPath`目录并打包至`config.devLibsPath`，文件修改会自动重写进行打包。

3.生产环境打包自动压缩

```
npm run build
```

`gulp`会编译`config.srcComponentPath`目录并根据`config`文件配置压缩至`config.distPath`。

`rollup`会打包`config.srcLibsPath`目录并根据`config`文件配置压缩至`config.distPath`。

## 重点

`gulp`会用于编译`components`目录，`rollup`会打包`libs`目录并生成类型声明文件。

`libs`只支持`typescript`文件，`components`支持`js`和`ts`混用，这里建议尽量用`ts`开发。

## 发布

**注意**：必须使用官网的镜像！！！

1.去[npmjs 官网](https://www.npmjs.com/)注册一个账号。

2.在当前目录执行`npm login`命令进行登录。

3.在当前目录执行`npm publish`进行`npm`包的发布。
