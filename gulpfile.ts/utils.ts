import fs from "fs";
import path from "path";

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

// 这里以后改一下，只找到被使用组件目录的所有文件，没办法根据组件依赖去找，因为太复杂了。先满足我的需求吧
function getAllFiles(dir: string) {
  const fileMap: Record<string, string[]> = {};

  getFiles(dir);
  function getFiles(dir: string) {
    const res = readDir(dir);
    res.forEach((file) => {
      const fullpath = path.resolve(dir, file);
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
