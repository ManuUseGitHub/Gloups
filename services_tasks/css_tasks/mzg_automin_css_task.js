gulp.task('autominCss', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyle);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (!/^(.*.min.css|.*.less|.*.map)$/.test(event.path)) {
            if (/^.*.css$/.test(event.path)) {

                var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToStyle);
                var sourcemapping = matchingEntry.sourcemaps;

                gulp.src(event.path)
                    .pipe(sourcemapInit(sourcemapping))
                    .pipe(autoprefix())

                    .pipe(cleanCssMinification())
                    .pipe(renameSuffixMin())
                    .pipe(insertSignatureAfter("Compressed", "gulp-clean-css"))
                    
                    .pipe(sourcemapWrite(sourcemapping))
                    .pipe(gulp.dest(matchingEntry.dest));

                gutil.log("Compressed file version updated/created here :\n" + breath() + "> " + logFilePath(matchingEntry.dest));
            }
        }
    });
});