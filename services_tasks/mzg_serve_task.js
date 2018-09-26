gulp.task('serve', ['setParams']);

function fireEnventOnEveryCoveredFiles(fileNames) {
	fileNames.sort(function(a, b) {
		return a.localeCompare(b);
	}).forEach(function(e, i) {
		gulp.src(e)
			.pipe(gulp.dest(function(file) {
				return file.base;
			}));
	});
}