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