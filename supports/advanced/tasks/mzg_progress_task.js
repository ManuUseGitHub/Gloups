gulp.task('progress', function () {
  return gulp.src(config.copy_surc, { dot: true })
    .pipe(progressStream)
    .pipe(gulp.dest(config.path.dest.app));
});