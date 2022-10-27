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
// image minify
import tinypng from "gulp-tinypng-nokey";
// minify text in XML, JSON, CSS
import prettyData from "gulp-pretty-data";

import config from "../config/config";

// import { build } from "./rollup";

type PathType = "component" | "libs";
type SrcType = PathType;
type DevType = PathType;

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

    function getGlobs(srcType: PathType) {
      const srcPathMode = {
        component: srcComponentPath,
        libs: srcLibsPath,
      };

      const path = srcPathMode[srcType];
      const globs = {
        ts: [`${path}/**/*.ts`], // match ts file
        js: `${path}/**/*.js`, // match js file
        json: `${path}/**/*.json`, // match json file
        less: `${path}/**/*.less`, // match less file
        wxss: `${path}/**/*.wxss`, // match wxss file
        scss: `${path}/**/*.scss`, // match scss file
        image: `${path}/**/*.{png,jpg,jpeg,gif,svg}`, // match image file
        wxml: `${path}/**/*.wxml`, // match wxml file
      };
      return globs;
    }

    // const globs = {
    //   ts: [`${srcComponentPath}/**/*.ts`], // match ts file
    //   js: `${srcComponentPath}/**/*.js`, // match js file
    //   json: `${srcComponentPath}/**/*.json`, // match json file
    //   less: `${srcComponentPath}/**/*.less`, // match less file
    //   wxss: `${srcComponentPath}/**/*.wxss`, // match wxss file
    //   scss: `${srcComponentPath}/**/*.scss`, // match scss file
    //   image: `${srcComponentPath}/**/*.{png,jpg,jpeg,gif,svg}`, // match image file
    //   wxml: `${srcComponentPath}/**/*.wxml`, // match wxml file
    // };

    const buildSrcOption = { cwd: srcComponentPath, base: srcComponentPath };
    function ifDest(srcType: PathType) {
      const srcPathMode = {
        component: devComponentPath,
        libs: devLibsPath,
      };

      return gulpIf(env === "dev", dest(srcPathMode[srcType]), dest(distPath));
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
    // use babel faster, but no type check

    function getTaskMap(srcType: PathType): Record<string, TaskFunction> {
      const globs = getGlobs(srcType);
      const taskMap: Record<string, TaskFunction> = {
        ts() {
          return src(globs.ts, {
            ...buildSrcOption,
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
            .pipe(ifDest());
        },
        js() {
          return src(globs.js, {
            ...buildSrcOption,
            since: gulp.lastRun(taskMap.js),
          })
            .pipe(isJsMinify())
            .pipe(ifDest());
        },
        json() {
          return src(globs.json, {
            ...buildSrcOption,
            since: gulp.lastRun(taskMap.json),
          })
            .pipe(isMinifyText("json"))
            .pipe(ifDest());
        },
        wxss(fn) {
          if (cssType !== "wxss") return fn();
          return src(globs.wxss, {
            ...buildSrcOption,
            since: gulp.lastRun(taskMap.wxss),
          })
            .pipe(isCssMinify())
            .pipe(ifDest());
        },
        less(fn) {
          if (cssType !== "less") return fn();
          return src(globs.less, {
            ...buildSrcOption,
            since: gulp.lastRun(taskMap.less),
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
            since: gulp.lastRun(taskMap.scss),
          })
            .pipe(gulpSass(sass)()) // use sass plugin
            .pipe(rename({ extname: ".wxss" }))
            .pipe(isCssMinify())
            .pipe(ifDest());
        },
        image() {
          return src(globs.image, {
            ...buildSrcOption,
            since: gulp.lastRun(taskMap.image),
          })
            .pipe(isImgMinify())
            .pipe(ifDest());
        },
        wxml() {
          return src(globs.wxml, {
            ...buildSrcOption,
            since: gulp.lastRun(taskMap.wxml),
          })
            .pipe(isMinifyText("xml"))
            .pipe(ifDest());
        },
      };
      return;
    }

    // const mainTaskMap: Record<string, TaskFunction> = {
    //   ts() {
    //     return src(globs.ts, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.ts),
    //     })
    //       .pipe(
    //         babel({
    //           presets: [
    //             ["@babel/preset-env"], // use to compatible es5,but no polyfill
    //             ["@babel/preset-typescript"], // babel preset, use parse ts
    //           ],
    //         })
    //       )
    //       .pipe(isJsMinify())
    //       .pipe(ifDest());
    //   },
    //   js() {
    //     return src(globs.js, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.js),
    //     })
    //       .pipe(isJsMinify())
    //       .pipe(ifDest());
    //   },
    //   json() {
    //     return src(globs.json, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.json),
    //     })
    //       .pipe(isMinifyText("json"))
    //       .pipe(ifDest());
    //   },
    //   wxss(fn) {
    //     if (cssType !== "wxss") return fn();
    //     return src(globs.wxss, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.wxss),
    //     })
    //       .pipe(isCssMinify())
    //       .pipe(ifDest());
    //   },
    //   less(fn) {
    //     if (cssType !== "less") return fn();
    //     return src(globs.less, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.less),
    //     })
    //       .pipe(gulpLess()) // parse less
    //       .pipe(rename({ extname: ".wxss" }))
    //       .pipe(isCssMinify())
    //       .pipe(ifDest());
    //   },
    //   scss(fn) {
    //     if (cssType !== "scss") return fn();
    //     return src(globs.scss, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.scss),
    //     })
    //       .pipe(gulpSass(sass)()) // use sass plugin
    //       .pipe(rename({ extname: ".wxss" }))
    //       .pipe(isCssMinify())
    //       .pipe(ifDest());
    //   },
    //   image() {
    //     return src(globs.image, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.image),
    //     })
    //       .pipe(isImgMinify())
    //       .pipe(ifDest());
    //   },
    //   wxml() {
    //     return src(globs.wxml, {
    //       ...buildSrcOption,
    //       since: gulp.lastRun(mainTaskMap.wxml),
    //     })
    //       .pipe(isMinifyText("xml"))
    //       .pipe(ifDest());
    //   },
    // };
    const mainTaskList = Reflect.ownKeys(mainTaskMap).reduce((x, y) => {
      x.push(mainTaskMap[y as any]);
      return x;
    }, [] as TaskFunction[]);

    task("clearDist", () => {
      return src(distPath, { read: false, allowEmpty: true }).pipe(clean());
    });

    const clearDevComponent: TaskFunction = () => {
      return src(devComponentPath, { allowEmpty: true }).pipe(clean());
    };

    task("buildComponent", parallel(...mainTaskList));

    task("buildLibs", (fn) => {
      src(srcLibsPath).pipe;
      fn();
    });

    task("build", series("clearDist", "buildComponent"));

    task(
      "watch",
      series(clearDevComponent, "buildComponent", () => {
        for (let type in globs) {
          // if not pass {cwd: srcPath} options，it not working to match path
          watch(
            globs[type as keyof typeof globs],
            { cwd: srcComponentPath },
            mainTaskMap[type]
          );
        }
      })
    );

    task("default", series("build"));
  }
}

export default BuildTask;
