/**************************************************************************************************
 *                                      CSS ORIENTED TASKS
 *************************************************************************************************/
gulp.task('autominCss', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyle);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (!/^(.*.min.css|.*.less)$/.test(event.path)) {
            if (/^.*.css$/.test(event.path)) {
                // process compilation of less files
                var process = function() {
                    gulp.src(event.path)
                        .pipe(cleanCSS({
                            compatibility: 'ie8'
                        })).pipe(rename({
                            suffix: '.min'
                        }))
                        .pipe(gulp.dest(function(file) {
                            var dest = getDestOfMatching(file.path, config.pathesToStyle);

                            gutil.log("Compressed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                            return dest;
                        }));
                }

                // call with logging of the time taken by the task
                logProcessCompleteOnFile(event.path, 'compiled', process);
            }
        }
    });
});

gulp.task('autoformatCss', function() {
    gulp.watch(config.pathesToStyleLess, function(event) {
        if (!/^(.*.min.css)$/.test(event.path)) {
            console.log("try");
            gulp.src(event.path)
                .pipe(cssbeautify({
                    format: 'beautify',
                }))
                .pipe(gulp.dest(function(file) {
                    return file.base;
                }));
            console.log("done");
        }
    });
});

gulp.task('less', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyleLess);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.less$/.test(event.path)) {

            // process compilation of less files
            var process = function() {
                gulp.src(event.path)
                    .pipe(less({
                        paths: [path.join(__dirname, 'less', 'includes')]
                    }))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToStyleLess);

                        gutil.log("Processed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                        return dest;
                    }));
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(event.path, 'compiled', process);
        }
    });
});

gulp.task('sass', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToSass);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.scss$/.test(event.path)) {

            // process compilation of less files
            var process = function() {

                gulp.src(event.path)
                    //.pipe(sass.sync().on('error', sass.logError))// synchronously
                    .pipe(sass().on('error', sass.logError))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToSass);

                        gutil.log("Processed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                        return dest;
                    }));
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(event.path, 'compiled', process);
        }
    });
});