const _ = require('lodash'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  path = require('path'),
  sourcemaps = require('gulp-sourcemaps'),
  map = require('vinyl-map'),
  uglify = require('gulp-uglify'),
  yaml = require('gulp-yaml'),
  tmpAppDirectory = 'app',
  outputMap = {
    app: tmpAppDirectory,
    fonts: path.join(tmpAppDirectory, 'fonts'),
    lang: path.join(tmpAppDirectory, 'lang'),
    themes: path.join(tmpAppDirectory, 'themes'),
  };

gulp.task('ace:core', function () {
  return gulp.src([
    'src/ace/ace.js',
    'src/ace/**/*.js',
    '!src/ace/mode-*.js',
    '!src/ace/theme-*.js'
  ]).pipe(sourcemaps.init())
    .pipe(concat('ace.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputMap.app));
});

gulp.task('ace:modes-js', function () {
  return gulp.src([
    'src/ace/mode-*.js'
  ]).pipe(gulp.dest(outputMap.app));
});

gulp.task('ace:themes-js', function () {
  return gulp.src([
    'src/ace/theme-*.js'
  ]).pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputMap.app));
});

/**
 * Ace is so large that its easier to keep it separate.
 * Also, it minifies well, unlike other ext
 */
gulp.task('ace', ['ace:core', 'ace:themes-js', 'ace:modes-js']);

/**
 * This files should be included in every screen, and have already been processed, so keep it separate.
 */
gulp.task('external', function () {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'src/browser/lib/*.js'
  ]).pipe(sourcemaps.init())
    .pipe(concat('external.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputMap.app));
});

gulp.task('html', function () {
  return gulp.src([
    'src/browser/entry/*.html'
  ]).pipe(gulp.dest(outputMap.app));
});

/**
 * I don't know why less doesn't do this automatically.
 */
gulp.task('fonts', function () {
  return gulp.src([
    'node_modules/font-awesome/fonts/**/*',
    'src/fonts/lato/Lato-Regular.ttf',
    'src/fonts/NotoMono-hinted/NotoMono-Regular.ttf',
    'src/fonts/NotoSans-unhinted/NotoSans-Regular.ttf',
    'src/fonts/NotoSerif-unhinted/NotoSerif-Regular.ttf',
    'src/fonts/roboto/Roboto-Regular.ttf',
    'src/fonts/fonts.css'
  ]).pipe(gulp.dest(outputMap.fonts));
});

gulp.task('themes', ['fonts'], function () {
  return gulp.src([
    'src/themes/*.scss'
  ]).pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputMap.themes));
});

gulp.task('lang', function () {
  return gulp.src([
    'src/lang/*.yml'
  ]).pipe(yaml({safe: false, space: 0}).on('error', error => console.error('yaml error:', error)))
    .pipe(gulp.dest(outputMap.lang));
});

/**
 * Make an "app" version of the package.json according to electron-builder's arbitrary rules and put it in the
 * temp directory to be consumed by them.
 */
gulp.task('package.json', function () {
  return gulp.src('package.json')
    .pipe(map(function (chunk) {
      const pkg = JSON.parse(chunk.toString());

      pkg.main = 'index.js';

      return JSON.stringify(_.omit(pkg, ['devDependencies', 'build', 'bin', 'scripts', 'jest']), null, 2);
    }))
    .pipe(gulp.dest(outputMap.app));
});

gulp.task('watch', function () {
  gulp.watch(['src/themes/**/*'], ['themes']);
  gulp.watch(['src/lang'], ['lang']);
});

gulp.task('build', ['themes', 'lang', 'external', 'ace', 'html', 'package.json']);
gulp.task('default', ['build']);
