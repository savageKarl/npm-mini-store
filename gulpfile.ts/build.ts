import gulp, { series, src, watch, task, parallel, dest } from "gulp";
import type { TaskFunction } from "gulp";

// clear directory
import clean from "gulp-clean";
// pack typescript
import babel from "gulp-babel";
// pack sass
import gulpSass from "gulp-sass";
import sass from "sass";
// pack less
import gulpLess from "gulp-less";
// change file name
import rename from "gulp-rename";
// minify css
import mincss from "gulp-clean-css";
// minify js
import uglify from "gulp-uglify";
// conditional judgement
import gulpIf from "gulp-if";

import config from "../config/config";

import { clearDevComponent } from "./buildDemo";

const {
  srcPath,
  distPath,
  css: cssType,
  minify,
  devComponentPath: demoComponentPath,
} = config;

class BuildTask {
  constructor() {
    this.init();
  }

  init() {
    const env = process.env.NODE_ENV;
    const globs = {
      ts: [`${srcPath}/**/*.ts`], // match ts 文件
      js: `${srcPath}/**/*.js`, // match js 文件
      json: `${srcPath}/**/*.json`, // match json 文件
      less: `${srcPath}/**/*.less`, // match less 文件
      wxss: `${srcPath}/**/*.wxss`, // match wxss 文件
      scss: `${srcPath}/**/*.scss`, // match scss 文件
      image: `${srcPath}/**/*.{png,jpg,jpeg,gif,svg}`, // match image file
      wxml: `${srcPath}/**/*.wxml`, // match wxml 文件
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
    // use babel faster, but no type check
    const mainTaskMap: Record<string, TaskFunction> = {
      ts() {
        return src(globs.ts, {
          ...buildSrcOption,
          since: gulp.lastRun(mainTaskMap.ts),
        })
          .pipe(
            babel({
              presets: [
                ["@babel/preset-env"], // use to compatible es5,but no polyfill 
                ["@babel/preset-typescript"], // babel preset, use parse ts
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
          .pipe(gulpLess()) // parse less
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
          .pipe(gulpSass(sass)()) // use sass plugin
          .pipe(rename({ extname: ".wxss" })) 
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
      series(clearDevComponent, "buildComponent", () => {
        for (let type in globs) {
          // if not pass {cwd: srcPath} options，it not working to match path
          watch(
            globs[type as keyof typeof globs],
            { cwd: srcPath },
            mainTaskMap[type]
          );
        }
      })
    );

      task('watch', clearDevComponent)
      
    task("default", series("build"));
  }
}

export default BuildTask;
