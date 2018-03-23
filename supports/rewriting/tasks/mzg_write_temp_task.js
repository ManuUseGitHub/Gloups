gulp.task('writeTemp', function() {
    var dStart = new Date();

    if (gulp.src(mzgFiles).pipe(jsValidate())) {
        gulp.src(mzgFiles)
            .pipe(insert.prepend(function(file){
                var pathfile = /^.*[\/\\](?:Gloups|gulp)[\/\\](.*)/.exec(file.path)[1];
                return !/^.*log_sections.*$/.test(pathfile)?"\n// -- ["+pathfile.replace(/[\\]/g, '/')+"] -- \n":"";
            }))
            .pipe(concat(gulpFileTempPath))
            .pipe((stayBeautiful ? nop : uglify)())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                gutil.log(logFilePath(gulpFileTempPath) + " writen after " + chalk.magenta(dResult));

                return getGulpfolderFromFileBase(file);
            }));
    }
});