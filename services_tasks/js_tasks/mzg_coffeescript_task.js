gulp.task('coffeescript', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-coffee',

		// defines what files extension are allowed to be processed
		'rules': [/.*.coffee$/],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(function() {
				return (M.coffee)({
					bare: true
				});
			}),

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToCoffee, obj);
});