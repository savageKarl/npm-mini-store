import fs from "fs";

import { series, dest, src, watch, task } from "gulp";
import type { TaskFunction } from "gulp";

import clean from "gulp-clean";
import ts from "gulp-typescript";
import print from "gulp-print";
import config, { joinPath } from "../config/config";

// 清理dist目录
function cleanDist() {
  const { distPath } = config;
  if (fs.existsSync(distPath)) {
    return src(distPath, { read: false }).pipe(clean({ force: true }));
  }
}
// 复制任务
function copy() {
  src(config.srcPath + "\\**\\*").pipe(dest(config.distPath));
}

// 编译ts
function compile() {
  const tsProject = ts.createProject("tsconfig.json");

  // fs.readdir(config.distPath, (err, files) => {
  //   console.debug(err);
  //   console.debug(files);
  // });
  // return;
  // 查找dist目录下所有的js和ts
  src(config.distPath + "\\**\\*.ts")
    .pipe(print() as any)
    .pipe(tsProject())
    .js.pipe(dest(config.distPath));
}

// compile();

// 压缩
function minify() {
  //
}

function minifyJs() {}

function minifyCss() {}

function minifyImg() {}

// task("build", (done) => {
//   // 这里的执行都是异步的，我他妈直接无语，
//   const actions = series(cleanDist, copy, compile)
//   // cleanDist();
//   // copy();
//   // compile();
//   actions(function() {
    
//   });
// });

// exports.build = series(cleanDist, copy, compile)

