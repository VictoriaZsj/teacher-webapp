'use strict';

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var cssmin = require('gulp-cssmin');
var salad = require('postcss-salad')(require('./salad.config.json'));

gulp.task('compile', function() {
  return gulp.src('./src/*.css')
    .pipe(postcss([salad]))
    .pipe(cssmin())
    // .pipe(gulp.dest('./lib'));
    .pipe(gulp.dest('../../static/ui-css'));
});

gulp.task('copyfont', function() {
  return gulp.src('./src/fonts/**')
    .pipe(cssmin())
    // .pipe(gulp.dest('./lib/fonts'));
    .pipe(gulp.dest('../../static/ui-css/fonts'));
});

gulp.task('build', ['compile', 'copyfont']);
