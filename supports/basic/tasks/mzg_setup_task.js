gulp.task('setup', function (cb) {
  (M.childprocess).exec('"Windows/gloupsp.bat"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});