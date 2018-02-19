/**************************************************************************************************
 *                  USER OUTPUT : Tasks that helps to communinicate with the user
 *************************************************************************************************/

gulp.task('jshint', function() {
    return gulp.src(config.pathesToJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('helpMe', function() {
    logHelp();
});
