gulp.task('applyDist', function() {
    gulp.watch(gulpFileTempPath2, function(event) {

        if (gulp.src(gulpFileTempPath2).pipe(jsValidate())) {
            var dStart = new Date();

            gulp.src(gulpFileTempPath2)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {
                    var folder = getGulpfolderFromFileBase(file);
                    var dResult = ms2Time(new Date() - dStart);
                    console.log(forNowShortLog("Gulp project distribution generated under {0} after {1}",[logFilePath(folder + '/dist'),chalk.magenta(dResult)]));
                    return folder + '/dist';
                }));

            fssync.copy('help.md', 'dist/help.md');

            fssync.copy('custom/project_mapping_model.json', 'dist/custom/config.json');
            fssync.copy('custom/config_model.json', 'dist/custom/config_model.json');
            fssync.copy('package.json', 'dist/package.json');
        }
    });
});