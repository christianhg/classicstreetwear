(function() {
  'use strict';

  var autoprefixer = require('gulp-autoprefixer');
  var del = require('del');
  var express = require('express');
  var gulp = require('gulp');
  var inject = require('gulp-inject');
  var jshint = require('gulp-jshint');
  var minifyCSS = require('gulp-minify-css');
  var rename = require('gulp-rename');
  var sass = require('gulp-ruby-sass');
  var sourcemaps = require('gulp-sourcemaps');
  var stylish = require('jshint-stylish');

  /**
   * Default
   */
  gulp.task('default', [
    'build',
    'express',
    'livereload',
    'watch'
  ], function() {

  });

  /**
   * Build
   */
  gulp.task('build', [
    'build:index',
    'inject:vendor:css',
    'inject:app:css',
    'inject:vendor:js',
    'inject:app:js'
  ], function() {

  });

  /**
   * Dist
   */
  gulp.task('dist', [

  ], function() {

  });

  /**
   * Express
   */
  gulp.task('express', [

  ], function() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')({post: 4002}));
    app.use(express.static('build'));
    app.listen(4000, '0.0.0.0');
  });

  /**
   * Live reload
   */
  var tinylr;
  gulp.task('livereload', [

  ], function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
  });

  /**
   * Watch
   */
  gulp.task('watch', [

  ], function() {
    gulp.watch('src/index.html', ['build:index']);
    gulp.watch('src/**/*.js', ['inject:app:js']);
    gulp.watch('src/scss/**/*.scss', ['inject:app:css']);

    gulp.watch('build/**/*', notifyLiveReload);
  });

  function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
      body: {
        files: [fileName]
      }
    });
  }

  /**
   * Index
   */
  gulp.task('clean:index', [

  ], function() {
    return del([
      'build/index.html'
    ]);
  });

  gulp.task('build:index', [
    'clean:index'
  ], function() {
    return gulp.src('src/index.html')
      .pipe(gulp.dest('build'));
  });

  /**
   * App CSS
   */
  gulp.task('clean:app:css', [
    'build:index'
  ], function() {
    return del([
      'build/css/app'
    ]);
  });

  gulp.task('build:app:css', [
    'clean:app:css'
  ], function() {
    return sass('src/scss', {style: 'expanded'})
      .pipe(autoprefixer('last 2 version'))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('build/css/app'));
  });

  gulp.task('inject:app:css', [
    'build:app:css'
  ], function() {
    return gulp.src('build/index.html')
      .pipe(inject(gulp.src('build/css/app/**/*.css', {read:false}), {name: 'app', relative: true}))
      .pipe(gulp.dest('build'));
  });

  /**
   * Vendor CSS
   */
  gulp.task('clean:vendor:css', [
    'build:index'
  ], function() {
    return del([
      'build/css/vendor'
    ]);
  });

  gulp.task('build:vendor:css', [
    'clean:vendor:css'
  ], function() {
    var vendorCSS = [

    ];

    return gulp.src(vendorCSS)
      .pipe(gulp.dest('build/css/vendor'))
  });

  gulp.task('inject:vendor:css', [
    'build:vendor:css'
  ], function() {
    return gulp.src('build/index.html')
      .pipe(inject(gulp.src('build/css/vendor/**/*.css', {read:false}), {name: 'vendor', relative: true}))
      .pipe(gulp.dest('build'));
  });

  /**
   * App JS
   */
  gulp.task('jshint:app:js', [
    'build:index'
  ], function() {
    var src = [
      'src/**/*.js'
    ];

    return gulp.src(src)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
  });

  gulp.task('clean:app:js', [
    'jshint:app:js'
  ], function() {
    return del([
      'build/js/app'
    ]);
  });

  gulp.task('build:app:js', [
    'clean:app:js'
  ], function() {
    return gulp.src('src/**/*.js')
      .pipe(gulp.dest('build/js/app'));
  });

  gulp.task('inject:app:js', [
    'build:app:js'
  ], function() {
    var appJS = [
      'build/js/app/**/*.module.js',
			'build/js/app/**/*.config.js',
			'build/js/app/**/*.directive.js',
			'build/js/app/**/*.js'
    ];

    return gulp.src('build/index.html')
      .pipe(inject(gulp.src(appJS, {read:false}), {name: 'app', relative: true}))
      .pipe(gulp.dest('build'));
  });

  /**
   * Vendor JS
   */
   gulp.task('clean:vendor:js', [
    'build:index'
   ], function() {
     return del([
       'build/js/app'
     ]);
   });

  gulp.task('build:vendor:js', [
    'clean:vendor:js'
  ], function() {
    var vendorJS = [
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js'
    ];

    return gulp.src(vendorJS)
      .pipe(gulp.dest('build/js/vendor'));
  });

  gulp.task('inject:vendor:js', [
    'build:vendor:js'
  ], function() {
    var vendorJS = [
      'build/js/vendor/**/*.js'
    ];

    return gulp.src('build/index.html')
      .pipe(inject(gulp.src(vendorJS, {read:false}), {name: 'vendor', relative: true}))
      .pipe(gulp.dest('build'));
  });
})();
