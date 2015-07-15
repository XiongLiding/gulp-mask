'use strict';

var through = require('through2');
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-mask';

module.exports = function (open, close, defaultOpened) {
  function tester(key) {
    if (typeof key === 'string') {
      return function (line) {
        return line.trim() === key;
      }
    }
    return function (line) {
      return key.test(line);
    }
  }

  if (!open) {
    throw new PluginError(PLUGIN_NAME, 'Mask key required');
  }
  var shouldOpen = tester(open);
  var shouldClose = close && tester(close);

  return through.obj(function (file, enc, cb) {
    var opened = defaultOpened;
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Streaming not supported');
    }

    var lines = file.contents.toString('utf8').split("\n");
    for (var i = 0; i < lines.length; i++) {
      if (!opened) {
        opened = shouldOpen(lines[i]);
        lines[i] = "";
        continue;
      }
      if (shouldClose && shouldClose(lines[i])) {
        opened = false;
        lines[i] = "";
      }
    }
    file.contents = new Buffer(lines.join("\n"), 'utf8');
    this.push(file);
    cb();
  });
};
