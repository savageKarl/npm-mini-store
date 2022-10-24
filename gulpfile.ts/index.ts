import fs from "fs";

import gulp, { series, dest, src, watch, task, parallel } from "gulp";

import clean from "gulp-clean";
import ts from "gulp-typescript";
import print from "gulp-print";
import config, { joinPath } from "../config/config";

// 编译ts
function compile(fn) {
  const tsProject = ts.createProject("tsconfig.json");
  src(config.distPath + "\\**\\*.ts")
    .pipe(print() as any)
    .pipe(tsProject())
    .js.pipe(dest(config.distPath));
  fn();
  console.debug("compile");
}

function readDir(dir: string) {
  return fs.readdirSync(dir, {});
}

/**
 * 判断制定路径是否是文件
 * @param {读取的路径} dir
 * @returns boolean
 */
function isFile(dir: string) {
  return fs.statSync(dir).isFile();
}

function getAllFiles(dir: string) {
  const fileMap: Record<string, string[]> = {};

  getFiles(dir);
  function getFiles(dir: string) {
    const res = readDir(dir);
    res.forEach((file) => {
      const fullpath = joinPath(dir, file);
      // return;
      if (isFile(fullpath)) {
        const ext = fullpath.split(".").reverse()[0];

        fileMap[ext]?.push(fullpath) || (fileMap[ext] = [fullpath]);
      } else {
        getFiles(fullpath);
      }
    });
  }

  return fileMap;
}

class BuildTask {
  constructor() {
    this.init();
  }
  fileMap: Record<string, string[]> = {};

  init() {
    this.fileMap = getAllFiles(config.srcPath);

    for (let type in this.fileMap) {
      gulp.task(`${type}-copy`, () => {
        return gulp
          .src(this.fileMap[type], {
            cwd: config.srcPath,
            base: config.srcPath,
          })
          .pipe(gulp.dest(config.distPath));
      });
    }

    const fileKeys = Reflect.ownKeys(this.fileMap) as string[];
    const copyTasks = fileKeys
      .filter((type) => type !== "ts")
      .map((type) => `${type}-copy`);

    task("tsComplie", (fn) => {
      const tsProject = ts.createProject("tsconfig.json");
      src(this.fileMap["ts"], { cwd: config.srcPath, base: config.srcPath })
        .pipe(tsProject())
        .js.pipe(gulp.dest(config.distPath));

      fn();
    });

    // const tsTasks =

    console.debug(this.fileMap["ts"]);

    task("clearDist", (fn) => {
      const { distPath } = config;
      if (fs.existsSync(distPath)) {
        return src(distPath, { read: false, allowEmpty: true }).pipe(clean());
      }
      fn();
    });

    task("build", function (fn) {
      console.debug("build");
      fn();
    });
    task("build", series("clearDist", parallel(...copyTasks, 'tsComplie')));

    task("default", series("build"));
  }
}

new BuildTask();
