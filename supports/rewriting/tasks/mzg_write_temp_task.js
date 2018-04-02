gulp.task('writeTemp', function() {
    var dStart = new Date();

    var pathfile = '';
    if (gulp.src(mzgFiles).pipe(jsValidate())) {
        gulp.src(mzgFiles)
            .pipe(insert.prepend(function(file) {
                pathfile = /^.*[\/\\](?:Gloups|gulp)[\/\\](.*)/.exec(file.path)[1];

                // outputing a comment with the file path if not a log_section file
                return !/^.*log_sections.*$/.test(pathfile) ?
                    // a path or nothing 
                    "\n// -- [{0}] -- \n".format([pathfile.replace(/[\\]/g, '/')]) : "";
            }))
            .pipe(concat(gulpFileTempPath))
            .pipe((stayBeautiful ? nop : uglify)())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                console.log(forNowShortLog("{0} writen after {1}", [logFilePath(gulpFileTempPath), chalk.magenta(dResult)]));

                return getGulpfolderFromFileBase(file);
            }));
    }
});