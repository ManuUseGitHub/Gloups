gulp.task('applyTemp', function() {
    gulp.watch(gulpFileTempPath, function(event) {
        process(event);
    })

    var process = function(event) {
        if (gulp.src(gulpFileTempPath).pipe(jsValidate())) {
            gutil.log(chalk.cyan("gulpfile.js") + "' is " + chalk.green('validate'));
            var dStart = new Date();

            gulp.src(gulpFileTempPath)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {

                    var dResult = ms2Time(new Date() - dStart);
                    gutil.log(chalk.cyan("gulpfile.js") + "' replaced after " + chalk.magenta(dResult));

                    //gulp folder
                    return getGulpfolderFromFileBase(file);
                }));
            getRidOfFileOfPath();
        }
    }
});