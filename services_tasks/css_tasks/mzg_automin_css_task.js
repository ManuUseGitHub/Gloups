gulp.task('autominCss', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': "gulp-clean-css",

		// defines what files extension are allowed to be processed
		'rules': [/^.*.css$/, ['!', /^(?:.*.min.css|.*.less|.*.scss|.*.map)$/]],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(autoprefix)
			.pipe(cleanCssMinification)
			.pipe(renameSuffixMin)
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForCompression(this, config.pathesToStyle, obj);
});