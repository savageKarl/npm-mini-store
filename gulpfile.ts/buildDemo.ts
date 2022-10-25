import gulp, { series, src, watch, task, parallel, dest, lastRun } from "gulp";
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

export const demoTasks = series(clearDemoDist, copyDemo, () => {
  watch(demoSrc + "\\**\\*", { cwd: demoSrc }, copyDemo);
});

// clean demo
