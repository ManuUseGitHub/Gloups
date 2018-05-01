gulp.task('typescript', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-typescript',

		// defines what files extension are allowed to be processed
		'rules': [/.*.ts$/],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(function() {
				return (M.ts)({
					noImplicitAny: true
				});
			}),

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToTs, obj);
});