gulp.task('writeDist', function() {
    var dStart = new Date();

    if (gulp.src(distFiles).pipe(jsValidate())) {

        gulp.src(distFiles)
            .pipe(concat(gulpFileTempPath2))
            .pipe(uglify())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                console.log(forNowShortLog("{0} writen after {1}", [logFilePath(gulpFileTempPath2), chalk.magenta(dResult)]));

                return getGulpfolderFromFileBase(file);
            }));
    }
});