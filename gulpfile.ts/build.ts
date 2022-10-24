import gulp, { series, src, watch, task, parallel } from "gulp";
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

const { srcPath, distPath, css: cssType, minify } = config;

class BuildTask {
  constructor() {
    this.init();
  }

  init() {
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

    // 用babel编译ts快，但是没有类型检查
    const mainTaskMap: Record<string, TaskFunction> = {
      ts(cb) {
        src(globs.ts, { cwd: srcPath, base: srcPath })
          .pipe(
            babel({
              presets: [
                ["@babel/preset-env"],
                ["@babel/preset-typescript"], // 用于解析 typescript
              ],
            })
          )
          .pipe(
            gulpIf(process.env.NODE_ENV === "pro" && minify.jsAndTs, uglify())
          )
          .pipe(gulp.dest(distPath));
        cb();
      },
      js(cb) {
        src(globs.js, {
          cwd: srcPath,
          base: srcPath,
        })
          .pipe(
            gulpIf(process.env.NODE_ENV === "pro" && minify.jsAndTs, uglify())
          )
          .pipe(gulp.dest(distPath));
        cb();
      },
      json(cb) {
        src(globs.json, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.json),
        }).pipe(gulp.dest(distPath));
        cb();
      },
      wxss(cb) {
        if (cssType !== "wxss") return cb();
        src(globs.wxss, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.wxss),
        })
          .pipe(gulpIf(process.env.NODE_ENV === "pro" && minify.css, mincss()))
          .pipe(gulp.dest(distPath));
        cb();
      },
      less(cb) {
        if (cssType !== "less") return cb();
        src(globs.less, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.less),
        })
          .pipe(gulpLess()) // 解析 less
          .pipe(rename({ extname: ".wxss" }))
          .pipe(gulpIf(process.env.NODE_ENV === "pro" && minify.css, mincss()))
          .pipe(gulp.dest(distPath));
        cb();
      },
      scss(cb) {
        if (cssType !== "scss") return cb();
        src(globs.scss, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.scss),
        })
          .pipe(gulpSass(sass)()) // 解析 sass
          .pipe(rename({ extname: ".wxss" })) // 改扩展名
          .pipe(gulpIf(process.env.NODE_ENV === "pro" && minify.css, mincss()))
          .pipe(gulp.dest(distPath));
        cb();
      },
      image(cb) {
        src(globs.image, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.image),
        }).pipe(gulp.dest(distPath));
        cb();
      },
      wxml(cb) {
        src(globs.wxml, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.wxml),
        }).pipe(gulp.dest(distPath));
        cb();
      },
    };
    const mainTaskList = Reflect.ownKeys(mainTaskMap).reduce((x, y) => {
      x.push(mainTaskMap[y as any]);
      return x;
    }, [] as TaskFunction[]);

    task("clearDist", (fn) => {
      return src(distPath, { read: false, allowEmpty: true }).pipe(clean());
    });

    task("build", series("clearDist", parallel(...mainTaskList)));

    task(
      "watch",
      series("build", () => {
        for (let type in globs) {
          // cwd: srcPath 必要要传这个，要不然匹配不到文件
          watch(globs[type], { cwd: srcPath }, mainTaskMap[type]);
        }
      })
    );

    task("default", series("build"));
  }
}

export default BuildTask;