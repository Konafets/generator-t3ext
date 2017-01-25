'use strict';

const babel = require('gulp-babel');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const lazypipe = require('lazypipe');
const plumber = require('gulp-plumber');
const merge = require('merge-stream');
const runSequence = require('run-sequence');

let watching = false;

const transpile = lazypipe()
    .pipe(babel);

gulp.task('clean', () => {
    return del(['generators/**/*', './test/**/*']);
});

gulp.task('babel', () => {
    let generators = gulp.src(['src/generators/**/*.js'])
    .pipe(gulpIf(watching, plumber()))
        .pipe(transpile())
        .pipe(gulp.dest('generators'));

    let test = gulp.src(['src/test/**/*.js'])
    .pipe(gulpIf(watching, plumber()))
        .pipe(transpile())
        .pipe(gulp.dest('test'));

    return merge(generators, test);
});

gulp.task('watch', () => {
    watching = true;
    return gulp.watch('src/**/*.js', ['babel']);
});

gulp.task('copy', () => {
    let nonJsGen = gulp.src(['src/generators/**/*', '!src/generators/**/*.js'], {dot: true})
        .pipe(gulp.dest('generators'));

    let nonJsTest = gulp.src(['src/test/**/*', '!src/test/**/*.js'], {dot: true})
        .pipe(gulp.dest('test'));

    return merge(nonJsGen, nonJsTest)
});

gulp.task('build', cb => {
    return runSequence(
        'clean',
        'babel',
        'copy',
        cb
    );
});