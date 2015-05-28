'use strict';

var async = require('async'),
  autosass = require('../autosass'),
  numCPUs = require('os').cpus().length;

function noop () {}

module.exports = function (grunt) {
  grunt.registerMultiTask('autosass', 'build and minify SASS', function () {

    var done = this.async(), options;

    options = this.options({
      precision: 3,
      quiet: true,
      loadPath: null,
      banner: null,
      browsers: null
    });

    async.eachLimit(this.files, numCPUs, function (file, cb) {
      var cbAlias = cb, sass;

      sass = autosass(file.src[0], options);
      sass.on('error', function (err) {
        cbAlias(err);
        cbAlias = noop;
      });

      sass.on('stdout', function (data) {
        grunt.log.debug('sass.stdout: ' + data);
      });

      sass.on('stderr', function (data) {
        grunt.log.debug('sass.stderr: ' + data);
      });

      sass.on('result', function (res) {
        grunt.file.write(file.dest, res);
        grunt.log.ok('Wrote ' + file.dest);
        cbAlias();
        cbAlias = noop;
      });
    }, done);
  });
};
