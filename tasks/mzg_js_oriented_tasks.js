/**************************************************************************************************
 *                                      JS ORIENTED TASKS
 *************************************************************************************************/

var jsRegexFilePathPattern = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

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

gulp.task('autodel', function(event) {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToJs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        var regex = new RegExp(jsRegexFilePathPattern, "g");
        var match = regex.exec(event.path);

        if (event.type === "deleted" && match) {

            // process compression of js files
            var process = function() {
                var dest = getDestOfMatching(event.path, config.pathesToJs);

                // select in all case file.min.js destination file
                var destFileName = (dest + '/' + match[2]).replace(/.min.js$/g, ".js");
                var destMinFileName = destFileName.replace(/.js$/g, ".min.js");

                // delete the compressed file (.min.js file) if the base file (.js) does not exist
                fs.stat(destMinFileName, function(error, stat) {
                    if (!error)
                        del(destMinFileName, {
                            force: true
                        });
                    gutil.log("source folder here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                });
            }

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(match[2].replace(/.js$/g, ".min.js"), 'deleted', process);

        }
    }, jshint);
});

// merge all js script into one big js uglyfied
gulp.task('mergeAllMinified', function() {
    gulp.watch(config.pathesToJs, function() {
        //gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
        gulp.src(config.pathesToJs + "/scirpt/*.min.js")
            .pipe(concat('js_stack.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('../uglified'));
    });
});

/******************************************* Typescript *******************************************/
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