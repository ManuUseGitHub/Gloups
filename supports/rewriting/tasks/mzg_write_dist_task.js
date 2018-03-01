gulp.task('writeDist', function() {
    var dStart = new Date();

    if (gulp.src(distFiles).pipe(jsValidate())) {

        var newMzgFiles = insertPath(distFiles);

        gulp.src(newMzgFiles)
            .pipe(concat(gulpFileTempPath2))
            .pipe(uglify())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                gutil.log(chalk.cyan(gulpFileTempPath2) + "' writen after " + chalk.magenta(dResult));

                return getGulpfolderFromFileBase(file);
            }));
    }
});