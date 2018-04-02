gulp.task('typescript', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToTs);

    // passing the watch list
    gulp.watch(wl, function(event) {

        var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToTs);
        var sourcemapping = matchingEntry.sourcemaps;

        gulp.src(event.path)
            .pipe(sourcemapInit(sourcemapping))

            .pipe(typescripting(matchingEntry.dest))
            .pipe(insertSignatureAfter("Compiled", "gulp-typescript"))

            .pipe(sourcemapWrite(sourcemapping))
            .pipe(gulp.dest(matchingEntry.dest));

        console.log(forNowShortLog("Compressed file version updated/created here :\n{0}> {1}", [breath(), logFilePath(matchingEntry.dest)]));

    });
});