gulp.task('applyTemp', function() {
    gulp.watch(gulpFileTempPath, function(event) {
        if (gulp.src(gulpFileTempPath).pipe(jsValidate())) {
            console.log(forNowShortLog("{0} is {1}", [logFilePath("gulpfile.js"), chalk.green('validate')]));
            var dStart = new Date();

            gulp.src(gulpFileTempPath)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {

                    var dResult = ms2Time(new Date() - dStart);
                    console.log(forNowShortLog("{0} replaced after {1}", [chalk.cyan("gulpfile.js"), chalk.magenta(dResult)]));

                    //gulp folder
                    var folder = getGulpfolderFromFileBase(file);
                    return folder;
                }));
        }
    });
});