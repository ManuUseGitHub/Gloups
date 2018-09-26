gulp.task('automin', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': "gulp-uglify",

		// defines what files extension are allowed to be processed
		'rules': [JS_REGEX_FILE_PATH_PATTERN, ['!', /.*(?:.min.js|.lisence.js)$/]],

		// gathers comments that define lisences
		'lisences': null,

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': null
	};

	obj.mainPipe = (M.lazyPipe)()
		.pipe(M.uglify)
		.pipe(renameSuffixMin);

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForCompression(this, config.pathesToJs, obj);
});