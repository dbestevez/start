'use strict';

var gulp       = require('gulp');
var concat     = require('gulp-concat');
var htmlmin    = require('gulp-htmlmin');
var prefixer   = require('gulp-autoprefixer');
var rename     = require('gulp-rename');
var rewritecss = require('gulp-rewrite-css');
var uglifycss  = require('gulp-uglifycss');
var uglifyjs   = require('gulp-uglify');

var target  = 'dist';

// Uglify and unify CSS assets
gulp.task('css', function () {
  gulp.src([
      'src/vendor/font-awesome/css/font-awesome.min.css',
      'src/components/clock/clock.css',
      'src/components/weather/weather.css',
      'src/css/style.css'
    ])
    .pipe(prefixer('last 10 version'))
    .pipe(rewritecss({ destination: target }))
    .pipe(concat('style.css'))
    .pipe(uglifycss({
      'maxLineLen': 80,
      'uglyComments': true
    }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(target));
});

// Uglify and unify JS assets
gulp.task('js', function () {
  gulp.src([
      './src/vendor/angular/angular.min.js',
      './src/vendor/store-js/store.min.js',
      './src/components/clock/clock.js',
      './src/components/weather/weather.js',
      './src/js/app.js',
      './src/js/controllers/MasterCtrl.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(uglifyjs({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    }))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(target));
});

// Minify HTML
gulp.task('html', function() {
	gulp.src('src/index.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(gulp.dest(target));
});

// Run tasks
gulp.task('default', [ 'css', 'js', 'html' ]);
