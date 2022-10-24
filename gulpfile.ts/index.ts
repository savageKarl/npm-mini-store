import fs from "fs";

import gulp, { series, dest, src, watch, task, parallel, lastRun } from "gulp";
import type { TaskFunction } from "gulp";

import clean from "gulp-clean";
import ts from "gulp-typescript";
import print from "gulp-print";
import config, { joinPath } from "../config/config";
import babel from "gulp-babel";

const { srcPath, distPath, css: cssType, minify } = config;

class BuildTask {
  constructor() {
    this.init();
  }
  // fileMap: Record<string, string[]> = {};

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
      // other:[`${srcPath}/**`,`!${globs.ts[0]}`,...] // 除上述文件外的其它文件
    };

    const tsProject = ts.createProject("tsconfig.json");
    const mainTaskMap: Record<string, TaskFunction> = {
      ts(cb) {
        console.debug("ts dabo");
        src(globs.ts, { cwd: srcPath, base: srcPath })
          .pipe(
            babel({
              presets: [
                [
                  "@babel/preset-env",
                  // {
                  //   // 配置转换语法
                  //   useBuiltIns: "usage", // 配置只转换在时代实际使用到的语法和填充ap
                  //   corejs: 3, // 使用版本为 3的corejs 来进行 polyfill
                  // },
                ],
                ["@babel/preset-typescript"], // 用于解析 typescript
              ],
            })
          )
          .pipe(gulp.dest(distPath));
        // .pipe(tsProject())
        cb();
      },
      js(cb) {
        src(globs.js, {
          cwd: srcPath,
          base: srcPath,
        }).pipe(gulp.dest(distPath));
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
        }).pipe(gulp.dest(distPath));
        cb();
      },
      less(cb) {
        if (cssType !== "less") return cb();
        src(globs.less, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.less),
        }).pipe(gulp.dest(distPath));
        cb();
      },
      scss(cb) {
        if (cssType !== "scss") return;
        src(globs.scss, {
          cwd: srcPath,
          base: srcPath,
          since: gulp.lastRun(mainTaskMap.scss),
        }).pipe(gulp.dest(distPath));
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

    task(
      "build",
      series("clearDist", parallel(...mainTaskList))
    );

    task(
      "watch",
      series(function () {

        for(let type in globs) {
          // cwd: srcPath 必要要传这个，要不然匹配不到文件
          watch(globs[type], { cwd: srcPath }, mainTaskMap[type])
        }


        // glob(globs["ts"][0], (err, files) => {
        //   console.debug(files, "tmd");
        //   watch(
        //     globs["ts"],
        //     { cwd: srcPath },
        //     series(function (fn) {
        //       console.debug(files[0], "修改了");
        //       fn();
        //     }, mainTaskMap["ts"])
        //   );
        // });
        // watch(
        //   "D:\\300_program\\openSource\\mini-component-dev\\src\\naigationBar\\naigationBar.wxss",
        //   function (e) {
        //     console.debug("fuckyou");
        //   }
        // );
      })
    );

    task("default", series("build"));
  }
}
console.log("stat");
new BuildTask();
