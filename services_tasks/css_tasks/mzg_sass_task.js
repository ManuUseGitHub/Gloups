gulp.task('sass', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToSass);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.scss$/.test(event.path)) {

            var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToSass);
            var sourcemapping = matchingEntry.sourcemaps;

            // process compilation of less files
            var process = function() {

                gulp.src(event.path)
                    .pipe(sourcemapInit(sourcemapping))
                    .pipe(autoprefix())

                    //.pipe(sass.sync().on('error', sass.logError))// synchronously
                    .pipe(sass().on('error', sass.logError))
                    .pipe(insertSignatureAfter("Processed", "gulp-sass"))

                    .pipe(sourcemapWrite(sourcemapping))
                    .pipe(gulp.dest(matchingEntry.dest));

                gutil.log("Processed file version updated/created here :\n" + breath() + "> " + logFilePath(matchingEntry.dest));
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(event.path, 'compiled', process);
        }
    });
});