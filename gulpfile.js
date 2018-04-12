'use strict'
const gulp         = require('gulp')
const sassfn       = require('gulp-sass')
const cssmin       = require('gulp-minify-css')
const jsfn         = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer')
const browsersync  = require('browser-sync')
const rev          = require('gulp-rev-append')
const replace      = require('gulp-replace')

const src  = './src/'
const sass = src+ 'sass/**/*.scss'
const js  = src+ 'js/**/*.js'
const html = './*.html'
const staticpath = './static/**/*'

const dist = './dist/'

// css scss
gulp.task('sass', function() {
  gulp.src(sass)
  .pipe(sassfn())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true,
      remove:true, 
    }))
    .pipe(gulp.dest(dist + 'css'))
})

gulp.task('css', function() {
  gulp.src(sass)
    .pipe(sassfn())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true,
      remove:true, 
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(dist + 'css'))
})

// rev
gulp.task('rev', function() {
  gulp.src(html)
    .pipe(rev())
    .pipe(replace('/dist', ''))
    .pipe(gulp.dest(dist))
})

// js
gulp.task('jsmin', function() {
  gulp.src(js)
    .pipe(jsfn())
    .pipe(gulp.dest(dist + 'js'))
})

gulp.task('jscopy', function() {
  gulp.src(js, {
    base: './src'
  })
  .pipe(gulp.dest(dist))
})

gulp.task('static', function() {
  gulp.src(staticpath, {
    base: './'
  })
  .pipe(gulp.dest(dist))
})

gulp.task('dev', ['jscopy', 'sass', 'static', 'rev'], function() {
  browsersync.init({
    server: "./dist",
    notify: false,
  })
  gulp.watch(sass, ['sass', 'rev']).on('change', browsersync.reload)
  gulp.watch(js, ['jscopy', 'rev']).on('change', browsersync.reload)
  gulp.watch(html, ['rev']).on('change', browsersync.reload)
  gulp.watch(staticpath, ['static', 'rev']).on('change', browsersync.reload)
})

gulp.task('build', ['jsmin', 'css', 'static', 'rev'], function() {})

