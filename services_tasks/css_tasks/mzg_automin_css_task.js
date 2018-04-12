gulp.task('autominCss', function() {
    logTaskPurpose(this.currentTask.name);

    var message = getOneFeedBackForAll("Are compressed: \n");


    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyle);

    gulp.watch(wl, function(event) {
        if (event.type !== "deleted" && !/^(.*.min.css|.*.less|.*.scss|.*.map)$/.test(event.path)) {
            if (/^.*.css$/.test(event.path)) {

                var mainProcess = lazyPipe()

                    .pipe(autoprefix)
                    .pipe(cleanCssMinification)
                    .pipe(renameSuffixMin);

                var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToStyle);
                var sourceMappedProcess =
                    setSourceMappingAndSign(mainProcess, matchingEntry, {
                        'action': "Compressed",
                        'module': "gulp-clean-css"
                    });

                var destinatedProcess = sourceMappedProcess
                    .pipe(function() {
                        return gulp.dest(matchingEntry.dest);
                    });

                appendFilesToLog(message, destinatedProcess, event);
            }
        }
    });
});