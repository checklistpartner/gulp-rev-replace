'use strict';
var crypto = require('crypto');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var gulp = require('gulp');
var batchReplace = require('gulp-batch-replace');

function relPath(base, filePath) {
  var newPath = filePath.replace(base, '');
  if (filePath !== newPath && newPath[0] === path.sep) {
    return newPath.substr(1);
  } else {
    return newPath;
  }
}



/**
 * forked from gulp-rev-replace
 * instead of replacing in the stream, it replaces whats in replaceGlob
 */
var plugin = function (options) {
  var renames = [];

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-replace-revs-in', 'Streaming not supported'));
      return cb();
    }

    if (file.revOrigPath) {
      renames.push([relPath(path.resolve(file.revOrigBase), file.revOrigPath), options.prefix + '/' +  relPath(file.base, file.path)]);
      this.push(file);
    }
    cb();
  },

  function(cb) {
	  gulp.src(options.replaceGlob, {base: './'})
		  .pipe(batchReplace(renames))
		  .pipe(gulp.dest('./'))
	    .on('end', cb)
		  .on('error', gutil.log);
  });
};

module.exports = plugin;