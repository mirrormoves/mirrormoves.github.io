/*jslint browser: false, node: true, maxlen: 120 */

"use strict";

var gulp, sass, minifycss, concat, autoprefixer, gutil, styles, path;

gulp = require('gulp');
gutil = require('gulp-util');

concat = require('gulp-concat');

autoprefixer = require('gulp-autoprefixer');
minifycss = require('gulp-minify-css');
sass = require('gulp-sass');

path = require("path");

styles = {
    "input": "dev/style.scss",
    "watch": "dev/**/*.scss",
    "output": "public/style.css"
}

gulp.task("styles", function () {

    var sassConfig, prefixerConfig;

    sassConfig = { style: "expanded" };
    if (!gutil.env.production) {
        sassConfig.errLogToConsole = true;
        sassConfig.sourceComments = "map";
    }

    prefixerConfig = {};
    if (!gutil.env.production) {
        prefixerConfig.map = { inline: true };
    }

    return gulp.src(styles.input)
        .pipe(sass(sassConfig))
        .pipe(autoprefixer(
            "last 3 versions",
            "Explorer >= 8",
            "Android >= 2.3",
            "Blackberry 10",
            "> 5%",
            "OperaMini >= 5",
            prefixerConfig
        ))
        .pipe(concat(path.basename(styles.output)))
        .pipe(gutil.env.production ? minifycss() : gutil.noop())
        .pipe(gulp.dest(path.dirname(styles.output)));
});

gulp.task("rebuild", ["styles"]);

gulp.task("default", ["rebuild"]);

gulp.task("watch", ["rebuild"], function() {
    gulp.watch(["dev/**/*.scss"], ["styles"]);
});
