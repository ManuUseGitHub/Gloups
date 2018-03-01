gulp.task('typescript', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToTs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        gulp.src(event.path)
            .pipe(ts({
                noImplicitAny: true,
                outFile: event.path + ".js"
            }))

            .pipe(gulp.dest(function(file) {
                var dest = getDestOfMatching(file.path, config.pathesToTs);
                gutil.log("Compressed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                return dest;
            }));
    })
});