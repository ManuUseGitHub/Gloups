gulp.task('applyDist', function() {
    gulp.watch(gulpFileTempPath2, function(event) {

        if (gulp.src(gulpFileTempPath2).pipe(jsValidate())) {
            var dStart = new Date();

            gulp.src(gulpFileTempPath2)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {
                    var folder = getGulpfolderFromFileBase(file);

                    var dResult = ms2Time(new Date() - dStart);
                    gutil.log("Gulp project distribution generated under "+logFilePath(folder + '/dist')+" after " + chalk.magenta(dResult));
                    return folder + '/dist';
                }));

            fssync.copy('README.md', 'dist/README.md');
            fssync.copy('help.md', 'dist/help.md');
            fssync.copy('custom/project_mapping_model.ini', 'dist/custom/config.ini');
            fssync.copy('package.json', 'dist/package.json');
        }
    })
});