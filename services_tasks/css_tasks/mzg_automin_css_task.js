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

                    var dest = getDestOfMatching(event.path, config.pathesToStyle);
                    gulp.src(event.path)
                        .pipe(sourcemaps.init())
                        .pipe(autoprefixer({
                            browsers: ['last 2 versions'],
                            cascade: false
                        }))
                        .pipe(cleanCSS({
                            compatibility: 'ie8'
                        })).pipe(rename({
                            suffix: '.min'
                        }))
                        .pipe(insert.append("\n/* -- Compressed with Gloups|"+GLOUPS_VERSION+" using gulp-clean-css -- */"))
                        .pipe(sourcemaps.write('./'))
                        .pipe(gulp.dest(function(file) {
                            gutil.log("Compressed file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
                            return dest;
                        }));
                }

                // call with logging of the time taken by the task
                logProcessCompleteOnFile(event.path, 'compiled', process);
            }
        }
    });
});