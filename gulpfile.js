const { parallel } = require('gulp');

function javascript(cb) {
  // body omitted
  console.debug('shit')
  cb();
}

function css(cb) {
  // body omitted
  console.debug("fuck")
  cb();
}

exports.build = parallel(javascript, css);