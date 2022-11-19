const path = require("path");
const { execFile } = require("node:child_process");
const config = require("../config/config");
const pkg = require("../package.json");

// const script = [
//   "cd " + process.cwd(),
//   "npm link",
//   "cd " + path.resolve(__dirname, config.devLibsPath),
//   "npm link " + pkg.name,
//   "cd D:/100_software/微信web开发者工具",
//   "cli open --project " +
//     "D:\\300_program\\openSource\\mini\\mini-component-dev\\miniprogram_dev",
// ];
// console?.time();
// const { code } = shell.exec(script.join(" & "));
// console.debug(code)
// console?.timeEnd();

function execShellFile(path, arg) {
  return new Promise((resolve, reject) => {
    execFile(path, arg, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// execShellFile(path.resolve(__dirname, "shell", "shell.bat"), [
//   process.cwd(),
//   path.resolve(__dirname, config.devLibsPath),
//   pkg.name,
//   "D:/100_software/微信web开发者工具",
//   "D:\\300_program\\openSource\\mini\\mini-component-dev\\miniprogram_dev",
// ]).then((res) => {
//   console.debug(res)
//   console?.timeEnd();
//   return execShellFile(path.resolve(__dirname, "shell", "shell2.bat"), [
//     path.resolve(__dirname, config.devLibsPath),
//     pkg.name,
//     "D:/100_software/微信web开发者工具",
//     "D:\\300_program\\openSource\\mini\\mini-component-dev\\miniprogram_dev",
//   ])
// }).then((res) => {
//   console.debug(res)
//   console?.timeEnd();
//   return execShellFile(path.resolve(__dirname, "shell", "shell3.bat"), [
//     "D:/100_software/微信web开发者工具",
//     "D:\\300_program\\openSource\\mini\\mini-component-dev\\miniprogram_dev",
//   ])
// })

// 用node执行 npm link 命令太慢了，快则3，4秒，慢则30，40秒，这里只用启动开发工具即可
execShellFile(path.resolve(__dirname, "shell", "shell3.bat"), [
  config.devToolPath,
  config.devPath,
])