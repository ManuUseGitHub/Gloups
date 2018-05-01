gulp.task('writeDist', function() {
	var dStart = new Date();

	if (gulp.src(distFiles).pipe((M.jsValidate)())) {

		gulp.src(distFiles)
			.pipe((M.concat)(gulpFileTempPath2))
			.pipe((M.replace)(/(getModule[(]M[\.][\w]+[)]+)/g, function(m) {
				var match = /(M[\.][\w]+)/g.exec(m)[1];
				return match;
			}))
			.pipe((M.replace)(/(M[\.][\w]+)/g, function(m) {
				return "getModule({0})".format([m]);
			}))
			.pipe((M.uglify)())
            .pipe(insertSignatureAfter("Provided", "gulp- uglify, replace, concat, insert"))
			.pipe(gulp.dest(function(file) {
				var dResult = ms2Time(new Date() - dStart);
				console.log(forNowShortLog("{0} writen after {1}", [logFilePath(gulpFileTempPath2), chalk.magenta(dResult)]));

				return getGulpfolderFromFileBase(file);
			}));
	}
});