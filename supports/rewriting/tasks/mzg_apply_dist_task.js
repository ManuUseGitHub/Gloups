gulp.task('applyDist', function() {

	gulp.watch(gulpFileTempPath2, function(event) {

		if (gulp.src(gulpFileTempPath2).pipe((M.jsValidate)())) {
			var dStart = new Date();

			gulp.src(gulpFileTempPath2)
				.pipe((M.rename)('gulpfile.js'))
				.pipe((M.insert).prepend('/*jshint esversion: 6 */\n/*jshint ignore:start */\n'))
				.pipe(gulp.dest(function(file) {
					var folder = getGulpfolderFromFileBase(file);
					var dResult = ms2Time(new Date() - dStart);
					console.log(forNowShortLog("Gulp project distribution generated under {0} after {1}", [logFilePath(folder + '/dist'), chalk.magenta(dResult)]));
					return folder + '/dist';
				}))
				.pipe((M.through).obj(function(chunk, enc, cb) {
					M.fssync.copy('help.md', 'dist/help.md');
					M.fssync.copy('custom/project_mapping_model.js', 'dist/custom/config.js');
					M.fssync.copy('custom/config.mzg.js', 'dist/custom/config.mzg.js');
					M.fssync.copy('package.json', 'dist/package.json');
					M.fssync.copy('Windows', 'dist/Windows');
					cb(null, chunk);
				}));

		}
	});
});