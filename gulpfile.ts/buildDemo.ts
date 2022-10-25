import path from "path";
import fs from "fs";

import gulp, { series, src, task, parallel, dest, lastRun, watch } from "gulp";
import type { TaskFunction } from "gulp";

import clean from "gulp-clean";


import config from "../config/config";

const { devComponentPath } = config;

export const clearDevComponent: TaskFunction = () => {
  return src(devComponentPath).pipe(clean({ force: true }));
};

// const copyDemo: TaskFunction = () => {
//   return src(demoSrc + "\\**\\*", {
//     cwd: demoSrc,
//   }).pipe(dest(demoDist));
// };

// export const demoTasks = series(clearDevComponent, copyDemo, (fn) => {
//   const watcher = watch(demoSrc, { cwd: demoSrc }, copyDemo);
//   // 这里监听删除文件和文件夹，不能删除空文件夹，要不然gulp就报错，无法解决并退出进程。
//   watcher.on("unlink", function (p: string) {
//     src(`${demoDist}\\${p}`, { allowEmpty: true }).pipe(clean({ force: true }));
//   });
//   fn();
// });


// 单独维护一个 demoSrc的目录是很愚蠢的。demodev没有提示，gulp处理复杂，现在直接处理开发中的组件目录即可，demo目录自己提供一个，其他人想改也可以。这样子开啊devd
