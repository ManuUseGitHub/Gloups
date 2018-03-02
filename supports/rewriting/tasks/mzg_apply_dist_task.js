gulp.task('applyDist', function() {
    gulp.watch(gulpFileTempPath2, function(event) {

        if (gulp.src(gulpFileTempPath2).pipe(jsValidate())) {
            var dStart = new Date();

            gulp.src(gulpFileTempPath2)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {
                    var folder = getGulpfolderFromFileBase(file);
                    var dResult = ms2Time(new Date() - dStart);
                    gutil.log("Gulp project distribution generated under " + logFilePath(folder + '/dist') + " after " + chalk.magenta(dResult));
                    return folder + '/dist';
                }));

            gulp.src("site")
                .pipe(through.obj(function(chunk, enc, cb) {
                    var distFolder = (/^(.*)[\\/].*$/.exec(chunk.base)[1])+'/dist/site';
                    fssync.copy(chunk.path,distFolder);
                    cb(null, chunk);
                }));

            fssync.copy('help.md', 'dist/help.md');
            fssync.copy('custom/project_mapping_model.ini', 'dist/custom/config.ini');
            fssync.copy('custom/config_model.ini', 'dist/custom/config_model.ini');
            fssync.copy('package.json', 'dist/package.json');
        }
    })
});