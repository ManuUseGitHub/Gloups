gulp.task('less', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyleLess);

    var glob_transitivity = getFreshTransitivity();
    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.less$/.test(event.path)) {

            // LAZYPIPE : main pipeline to provide SASS service -------------------------------
            var mainProcess = lazyPipe()
                .pipe(function() {
                    return sass(less({
                        plugins: [lessAutoprefix]
                    })); //.on('error', less.logError);
                })
                .pipe(autoprefix)
                .pipe(stylefmt);

            var message = {
                'action': "Processed",
                'module': "gulp-less"
            };

            consumePipeProcss(glob_transitivity, mainProcess, event.path, message);
        }
    });
});