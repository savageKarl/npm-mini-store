const path = require("path");

const joinPath = path.resolve;

const config = {
  srcComponentPath: joinPath(__dirname, "../src/components"),
  srcLibsPath: joinPath(__dirname, "../src/libs"),

  devComponentPath: joinPath(
    __dirname,
    "../miniprogram_dev/miniprogram/components"
  ),
  devLibsPath: joinPath(__dirname, "../miniprogram_dev/miniprogram/libs"),

  distPath: joinPath(__dirname, "../miniprogram_dist"),

  css: "scss",
  minify: {
    css: true,
    jsAndTs: true,
    img: true,
  },
};

module.exports = config;
