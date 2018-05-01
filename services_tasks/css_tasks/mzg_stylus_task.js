gulp.task('stylus', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-stylus',

		// defines what files extension are allowed to be processed
		'rules': [/.*.styl$/],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(function() {
				return (M.stylus)({
					'include css': true,
					linenos: true
				}) /*.on('error', sass.logError)*/ ;
			})
			.pipe(autoprefix)
			.pipe((M.stylefmt)),

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToStylus, obj);
});