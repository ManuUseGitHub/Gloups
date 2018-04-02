gulp.task('less', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyleLess);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.less$/.test(event.path)) {
            var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToStyleLess);
            var sourcemapping = matchingEntry.sourcemaps;

            gulp.src(event.path)
                .pipe(sourcemapInit(sourcemapping))

                .pipe(less({
                    plugins: [lessAutoprefix]
                }))
                .pipe(insertSignatureAfter("Processed", "gulp-less"))

                .pipe(sourcemapWrite(sourcemapping))
                .pipe(gulp.dest(matchingEntry.dest));

            console.log(forNowShortLog("Processed file version updated/created here :\n{0}> {1}", [breath(), logFilePath(matchingEntry.dest)]));
        }
    });
});