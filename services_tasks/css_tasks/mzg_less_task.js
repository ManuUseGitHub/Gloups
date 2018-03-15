gulp.task('less', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyleLess);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.less$/.test(event.path)) {

            // process compilation of less files
            var process = function() {
                gulp.src(event.path)
                    .pipe(sourcemaps.init())
                    .pipe(autoprefixer({
                        browsers: ['last 2 versions'],
                        cascade: false
                    }))
                    .pipe(less({
                        paths: [path.join(__dirname, 'less', 'includes')]
                    }))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToStyleLess);

                        gutil.log("Processed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                        return dest;
                    }));
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(event.path, 'compiled', process);
        }
    });
});