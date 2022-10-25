import gulp, { series, src, watch, task, parallel, dest } from "gulp";
import type { TaskFunction } from "gulp";

// 清除目录
import clean from "gulp-clean";
// 打包 ts
import babel from "gulp-babel";
// 打包 sass
import gulpSass from "gulp-sass";
import sass from "sass";
// 打包 less
import gulpLess from "gulp-less";
// 改文件名字
import rename from "gulp-rename";
// 压缩 css
import mincss from "gulp-clean-css";
// 压缩 js
import uglify from "gulp-uglify";
// 判断插件
import gulpIf from "gulp-if";

import config from "../config/config";

import { demoTasks } from "./buildDemo";

const { srcPath, distPath, css: cssType, minify, demoComponentPath } = config;

class BuildTask {
  constructor() {
    this.init();
  }

  init() {
    const env = process.env.NODE_ENV;
    const globs = {
      ts: [`${srcPath}/**/*.ts`], // 匹配 ts 文件
      js: `${srcPath}/**/*.js`, // 匹配 js 文件
      json: `${srcPath}/**/*.json`, // 匹配 json 文件
      less: `${srcPath}/**/*.less`, // 匹配 less 文件
      wxss: `${srcPath}/**/*.wxss`, // 匹配 wxss 文件
      scss: `${srcPath}/**/*.scss`, // 匹配 scss 文件
      image: `${srcPath}/**/*.{png,jpg,jpeg,gif,svg}`, // 匹配 image 文件
      wxml: `${srcPath}/**/*.wxml`, // 匹配 wxml 文件
    };

    const buildSrcOption = { cwd: srcPath, base: srcPath };
    function ifDest() {
      return gulpIf(env === "dev", dest(demoComponentPath), dest(distPath));
    }
    function isJsMinify() {
      return gulpIf(env === "pro" && minify.jsAndTs, uglify());
    }
    function isCssMinify() {
      return gulpIf(env === "pro" && minify.css, mincss());
    }
    // 用babel编译ts快，但是没有类型检查
    const mainTaskMap: Record<string, TaskFunction> = {
      ts() {
        return src(globs.ts, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.ts),
        })
          .pipe(
            babel({
              presets: [
                ["@babel/preset-env"],
                ["@babel/preset-typescript"], // 用于解析 typescript
              ],
            })
          )
          .pipe(isJsMinify())
          .pipe(ifDest());
      },
      js() {
        return src(globs.js, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.js),
        })
          .pipe(isJsMinify())
          .pipe(ifDest());
      },
      json() {
        return src(globs.json, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.json),
        }).pipe(ifDest());
      },
      wxss() {
        if (cssType !== "wxss") return;
        return src(globs.wxss, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.wxss),
        })
          .pipe(isCssMinify())
          .pipe(ifDest());
      },
      less(fn) {
        if (cssType !== "less") return fn();
        return src(globs.less, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.less),
        })
          .pipe(gulpLess()) // 解析 less
          .pipe(rename({ extname: ".wxss" }))
          .pipe(isCssMinify())
          .pipe(ifDest());
      },
      scss(fn) {
        if (cssType !== "scss") return fn();
        return src(globs.scss, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.scss),
        })
          .pipe(gulpSass(sass)()) // 解析 sass
          .pipe(rename({ extname: ".wxss" })) // 改扩展名
          .pipe(isCssMinify())
          .pipe(ifDest());
      },
      image() {
        return src(globs.image, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.image),
        }).pipe(ifDest());
      },
      wxml() {
        return src(globs.wxml, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.wxml),
        }).pipe(ifDest());
      },
    };
    const mainTaskList = Reflect.ownKeys(mainTaskMap).reduce((x, y) => {
      x.push(mainTaskMap[y as any]);
      return x;
    }, [] as TaskFunction[]);

    task("clearDist", () => {
      return src(distPath, { read: false, allowEmpty: true }).pipe(clean());
    });

    task("buildComponent", parallel(...mainTaskList));

    task("build", series("clearDist", "buildComponent"));

    task(
      "watch",
      series(demoTasks, "buildComponent", () => {
        for (let type in globs) {
          // cwd: srcPath 必要要传这个，要不然匹配不到文件
          watch(
            globs[type as keyof typeof globs],
            { cwd: srcPath },
            mainTaskMap[type]
          );
        }
      })
    );

    task("default", series("build"));
  }
}

export default BuildTask;
