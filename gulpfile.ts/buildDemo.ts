import path from "path";
import fs from "fs";

import gulp, { series, src, task, parallel, dest, lastRun, watch } from "gulp";
import type { TaskFunction } from "gulp";

import clean from "gulp-clean";


import config from "../config/config";

const { demoSrc, demoDist } = config;

const clearDemoDist: TaskFunction = () => {
  return src(demoDist + "\\*", {}).pipe(clean({ force: true }));
};

const copyDemo: TaskFunction = () => {
  return src(demoSrc + "\\**\\*", {
    cwd: demoSrc,
  }).pipe(dest(demoDist));
};

export const demoTasks = series(clearDemoDist, copyDemo, (fn) => {
  const watcher = watch(demoSrc, { cwd: demoSrc }, copyDemo);
  // 这里监听删除文件和文件夹，不能删除空文件夹，要不然gulp就报错，无法解决并退出进程。
  watcher.on("unlink", function (p: string) {
    src(`${demoDist}\\${p}`, { allowEmpty: true }).pipe(clean({ force: true }));
  });
  fn();
});
