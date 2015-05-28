'use strict';

var autoprefixer = require('autoprefixer'),
  CleanCSS = require('clean-css'),
  dargs = require('dargs'),
  EventEmitter = require('events').EventEmitter,
  fs = require('graceful-fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  temp = require('temp');

function noop () {}

module.exports = function (file, props, callback) {
  var args, passedArgs, sass, tmpfile, emitter, fireError;

  callback = callback || noop;
  tmpfile = temp.path('bp');
  passedArgs = dargs(props, ['banner', 'browsers']);
  emitter = new EventEmitter();

  fireError = function (err) {
    emitter.emit('error', err);
    callback(err);
  };

  args = [
    file,
    tmpfile,
    '--load-path', path.dirname(file)
  ].concat(passedArgs);

  args.unshift(process.platform === 'win32' ? 'sass.bat' : 'sass');

  if (path.extname(file) === '.css') {
    args.push('--scss');
  }

  sass = spawn(args.shift(), args);
  sass.on('close', function (code) {
    if (code !== 0) {
      fireError(new Error('[autosass:sass] sass process exited with code ' + code));
    } else {
      fs.readFile(tmpfile, 'utf8', function (err, cssNoPrefixed) {
        var cssPrefixed, minified;

        if (err) {
          fireError(err);
        } else {

          if (props.browsers) {
            cssPrefixed = autoprefixer(props.browsers)
              .process(cssNoPrefixed).css;
          } else {
            cssPrefixed = autoprefixer.process(cssNoPrefixed).css;
          }

          minified = new CleanCSS().minify(cssPrefixed);
          if (props.banner) {
            minified = props.banner + '\n' + minified;
          }

          fs.unlink(tmpfile, function (err) {
            if (err) {
              fireError(err);
            } else {
              emitter.emit('result', minified.styles);
              callback(null, minified);
            }
          });
        }
      });
    }
  });

  sass.stdout.on('data', function (data) {
    emitter.emit('stdout', data);
  });

  sass.stderr.on('data', function (data) {
    emitter.emit('stderr', data);
  });

  return emitter;
};
