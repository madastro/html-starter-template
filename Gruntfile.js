module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    appConfig: {
      timestamp: Date.now()
    },

    clean: {
      build: ['**/*.css.map','css/']
    },

    sass: {
      options: {
        compass: true,
        style: 'expanded',
        require: ['sass-timestamp','susy','breakpoint','compass/import-once/activate'],
      },
      dist: {
        files: {
          'css/style.css':'sass/style.scss',
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%','android >= 4','ff >= 20'],
        map: true
      },
      files: {
        src: 'css/style.css',
        dest: 'style.css'
      }
    },

    cssmin: {
      dist: {
        options: {
          keepBreaks: true,
          keepSpecialComments: "*"
        },
        files: {
          'css/style.min.css':'css/style.css',
        }
      },
    },

    concat: {
      dist: {
        files: {
          'js/src/lib.js' : ['js/vendor/jquery.min.js','js/vendor/modernizr.min.js','js/vendor/*.js'],
          'js/site.js' : ['js/src/lib.js','js/src/script.js']
        },
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.date(appConfig.timestamp, "yyyy-mm-dd H:M:s") %> */\n',
      },
      target: {
        files: {
          'js/site.min.js' : 'js/site.js',
        }
      }
    },

    watch: {
      options: {
        spawn: false,
        livereload: true
      },
      grunt: {
        files: 'Gruntfile.js',
      },
      css: {
        files: ['sass/**/*.scss'],
        tasks: ['sass','autoprefixer'],
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['concat','uglify'],
      },
      all: {
        files: ['**/*.php','**/*.json','**/*.html','!*/.hg'],
      }
    },
  });

  grunt.registerTask('css',['sass','autoprefixer','cssmin']);
  grunt.registerTask('scripts',['concat','uglify']);
  grunt.registerTask('build',['clean','css','cssmin','scripts']);
  grunt.registerTask('devel',['clean','css','watch']);
  grunt.registerTask('default',['watch']);
};