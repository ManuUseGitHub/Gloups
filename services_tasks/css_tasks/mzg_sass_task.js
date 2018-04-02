gulp.task('sass', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToSass);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.scss$/.test(event.path)) {

            var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToSass);
            var sourcemapping = matchingEntry.sourcemaps;

            // getting the fileName and checking if its a qualified file to be process (not starting by undererscore "_.*");
            var realTargets = getMatchingPrincipalSCSS(matchingEntry.projectPath, event.path);

            // process compilation of less files
            var process = function() {
                gulp.src(realTargets)
                    .pipe(sourcemapInit(sourcemapping))

                    //.pipe(sass.sync().on('error', sass.logError))// synchronously
                    .pipe(sass().on('error', sass.logError))
                    .pipe(autoprefix())
                    .pipe(insertSignatureAfter("Processed", "gulp-sass"))

                    .pipe(sourcemapWrite(sourcemapping))
                    .pipe(gulp.dest(matchingEntry.dest))
                    .on('finish', function() {
                        console.log(forNowShortLog("Processed file destination:\n\n {0}", [logFilePath(matchingEntry.dest)]));
                    });
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(realTargets, 'Processing', process);
        }
    });
});