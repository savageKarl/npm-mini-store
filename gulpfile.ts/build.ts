import gulp, { series, src, watch, task, parallel, dest } from "gulp";
import type { TaskFunction } from "gulp";

// clear directory
import clean from "gulp-clean";
// pack typescript
// use babel faster, but no type check
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
// image minify
import tinypng from "gulp-tinypng-nokey";
// minify text in XML, JSON, CSS
import prettyData from "gulp-pretty-data";

import config from "../config/config.js";

import { objectValueToArray } from "./utils";

type PathType = "component" | "libs";

const {
  srcComponentPath,
  srcLibsPath,
  distPath,
  css: cssType,
  minify,
  devComponentPath,
  devLibsPath,
} = config;

class BuildTask {
  constructor() {
    this.init();
  }

  init() {
    const env = process.env.NODE_ENV;
    const srcPathMode = {
      component: srcComponentPath,
      libs: srcLibsPath,
    };

    function getGlobs(pathType: PathType) {
      const path = srcPathMode[pathType];
      return {
        ts: [`${path}/**/*.ts`], // match ts file
        js: `${path}/**/*.js`, // match js file
        json: `${path}/**/*.json`, // match json file
        less: `${path}/**/*.less`, // match less file
        wxss: `${path}/**/*.wxss`, // match wxss file
        scss: `${path}/**/*.scss`, // match scss file
        image: `${path}/**/*.{png,jpg,jpeg,gif,svg}`, // match image file
        wxml: `${path}/**/*.wxml`, // match wxml file
      };
    }

    function getBuildOptions(pathType: PathType) {
      return { cwd: srcPathMode[pathType], base: srcPathMode[pathType] };
    }

    function ifDest(pathType: PathType) {
      const devPathMode = {
        component: devComponentPath,
        libs: devLibsPath,
      };

      return gulpIf(env === "dev", dest(devPathMode[pathType]), dest(distPath));
    }
    function isJsMinify() {
      return gulpIf(env === "pro" && minify.jsAndTs, uglify());
    }
    function isCssMinify() {
      return gulpIf(env === "pro" && minify.css, mincss());
    }
    function isImgMinify() {
      return gulpIf(env === "pro" && minify.img, tinypng());
    }
    function isMinifyText(ext: "xml" | "json") {
      return gulpIf(
        env === "pro" && minify.img,
        prettyData({
          type: "minify",
          extensions: {
            wxml: ext,
          },
        })
      );
    }

    function getTaskMap(pathType: PathType): Record<string, TaskFunction> {
      const globs = getGlobs(pathType);
      const buildOptions = getBuildOptions(pathType);

      const taskMap = {
        ts() {
          return (
            src(globs.ts, {
              ...buildOptions,
              since: gulp.lastRun(taskMap.ts),
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
              // here must to call ifDest function
              .pipe(ifDest(pathType))
          );
        },
        js() {
          return src(globs.js, {
            ...buildOptions,
            since: gulp.lastRun(taskMap.js),
          })
            .pipe(isJsMinify())
            .pipe(ifDest(pathType));
        },
        json() {
          return src(globs.json, {
            ...buildOptions,
            since: gulp.lastRun(taskMap.json),
          })
            .pipe(isMinifyText("json"))
            .pipe(ifDest(pathType));
        },
        wxss(fn: Function) {
          if (cssType !== "wxss") return fn();
          return src(globs.wxss, {
            ...buildOptions,
            since: gulp.lastRun(taskMap.wxss),
          })
            .pipe(isCssMinify())
            .pipe(ifDest(pathType));
        },
        less(fn: Function) {
          if (cssType !== "less") return fn();
          return src(globs.less, {
            ...buildOptions,
            since: gulp.lastRun(taskMap.less),
          })
            .pipe(gulpLess()) // parse less
            .pipe(rename({ extname: ".wxss" }))
            .pipe(isCssMinify())
            .pipe(ifDest(pathType));
        },
        scss(fn: Function) {
          if (cssType !== "scss") return fn();
          return src(globs.scss, {
            ...buildOptions,
            since: gulp.lastRun(taskMap.scss),
          })
            .pipe(gulpSass(sass)()) // use sass plugin
            .pipe(rename({ extname: ".wxss" }))
            .pipe(isCssMinify())
            .pipe(ifDest(pathType));
        },
        image() {
          return src(globs.image, {
            ...buildOptions,
            since: gulp.lastRun(taskMap.image),
          })
            .pipe(isImgMinify())
            .pipe(ifDest(pathType));
        },
        wxml() {
          return src(globs.wxml, {
            ...buildOptions,
            since: gulp.lastRun(taskMap.wxml),
          })
            .pipe(isMinifyText("xml"))
            .pipe(ifDest(pathType));
        },
      };
      return taskMap;
    }

    const mainTaskMap = {
      component: getTaskMap("component"),
      // libs: getTaskMap("libs"),
    };

    // task("clearDist", () => {
    //   return src(distPath, { read: false, allowEmpty: true }).pipe(clean());
    // });

    const clearDevComponent: TaskFunction = () => {
      return src(devComponentPath, { allowEmpty: true }).pipe(clean());
    };

    task(
      "buildComponent",
      parallel(...objectValueToArray(mainTaskMap["component"]))
    );

    // task("buildLibs", parallel(...objectValueToArray(mainTaskMap["libs"])));

    task("build", series(parallel("buildComponent")));

    task(
      "watch",
      series(clearDevComponent, "buildComponent", function watchTask() {
        watchTask();
        function watchTask() {
          const taskKeys = Reflect.ownKeys(
            mainTaskMap
          ) as any as (keyof typeof mainTaskMap)[];

          for (let taskType of taskKeys) {
            const globs = getGlobs(taskType);
            const buildOptions = getBuildOptions(taskType);
            const task = mainTaskMap[taskType];

            for (let subType in globs) {
              // if not pass {cwd: srcPath} options，it not working to match path
              watch(
                globs[subType as keyof typeof globs],
                buildOptions,
                task[subType]
              );
            }
          }
        }
      })
    );

    task("default", series("build"));
  }
}

export default BuildTask;
