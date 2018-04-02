// configure which files to watch and what tasks to use on file changes
gulp.task('automin', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToJs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        var regex = new RegExp(JS_REGEX_FILE_PATH_PATTERN, "g");
        var match = regex.exec(event.path);

        // the file that fired the event change is a .min.js file
        if (!/.*.min.js$/.test(event.path) && match) {

            var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToJs);
            var sourcemapping = matchingEntry.sourcemaps;

            gulp.src(event.path)
                .pipe(sourcemapInit(sourcemapping))

                .pipe(uglify())
                .pipe(renameSuffixMin())
                .pipe(insertSignatureAfter("Compressed", "gulp-uglify"))

                .pipe(sourcemapWrite(sourcemapping))
                .pipe(gulp.dest(matchingEntry.dest));

            console.log(forNowShortLog("Compressed file version updated/created here :\n{0} > {1}", [breath(), logFilePath(matchingEntry.dest)]));
        }
    }, jshint);
});