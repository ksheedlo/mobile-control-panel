'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadTasks('./lib/grunt');

  grunt.initConfig({});

  grunt.config('autosass', {
    dist: {
      files: {
        'reach/styles/main.css': 'app/styles/main.scss'
      }
    }
  });

  grunt.config('browserify', {
    dist: {
      src: 'src/index.js',
      dest: 'reach/bundle.js'
    }
  });

  grunt.config('clean', {
    build: ['reach/', 'intelligence/']
  });

  grunt.config('connect', {
    reach: {
      options: {
        port: 5050,
        base: 'reach'
      }
    },
    intelligence: {
      options: {
        port: 5051,
        base: 'intelligence'
      }
    }
  });

  grunt.config('copy', {
    reachCommon: {
      src: [
        '**',

        '!**/*.scss',
        '!reach/**',
        '!intelligence/**'
      ],
      dest: 'reach/',
      cwd: 'app/',
      expand: true
    },
    intelligenceCommon: {
      src: [
        '**',

        '!**/*.scss',
        '!reach/**',
        '!intelligence/**'
      ],
      dest: 'intelligence/',
      cwd: 'app/',
      expand: true
    },
    reachSpecific: {
      src: [
        'index.html'
      ],
      dest: 'reach/',
      cwd: 'app/reach/',
      expand: true
    },
    intelligenceSpecific: {
      src: [
        'index.html'
      ],
      dest: 'intelligence/',
      cwd: 'app/intelligence/',
      expand: true
    },
    compiledSass: {
      src: [
        'styles/main.css'
      ],
      dest: 'intelligence/',
      cwd: 'reach/',
      expand: true
    },
    compiledJs: {
      src: [
        'bundle.js'
      ],
      dest: 'intelligence/',
      cwd: 'reach/',
      expand: true
    }
  });

  grunt.config('watch', {
    server: {
      files: [
        'app/**/*',
        'src/**/*',

        '!app/bower_components/**/*'
      ],
      tasks: 'package'
    }
  });

  grunt.registerTask('package', [
    'clean',
    'copy:reachCommon',
    'copy:intelligenceCommon',
    'copy:reachSpecific',
    'copy:intelligenceSpecific',
    'autosass',
    'copy:compiledSass',
    'browserify',
    'copy:compiledJs'
  ]);

  grunt.registerTask('default', ['package']);

  grunt.registerTask('dev', [
    'package',
    'connect:reach',
    'connect:intelligence',
    'watch:server'
  ]);
};
