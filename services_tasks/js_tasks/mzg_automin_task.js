// configure which files to watch and what tasks to use on file changes
gulp.task('automin', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToJs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        var regex = new RegExp(jsRegexFilePathPattern, "g");
        var match = regex.exec(event.path);

        // process compression of js files
        var process = function() {

            // the file that fired the event change is a .min.js file
            if (!/.*.min.js$/.test(event.path) && match) {
                gulp.src(event.path)
                    .pipe(uglify())
                    .pipe(rename({
                        suffix: '.min'
                    }))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToJs);

                        gutil.log("Compressed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                        return dest;
                    }));
            }
        }

        // call with logging of the time taken by the task
        if ((match[5] + match[6]) === ".min.js" && event.type === "added") {
            logProcessCompleteOnFile(match[2], 'created', process);
        } else if (event.type !== "deleted") {
            logProcessCompleteOnFile(match[2], 'compressed', process);
        }


    }, jshint);
});