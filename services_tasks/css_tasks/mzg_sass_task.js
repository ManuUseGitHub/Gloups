gulp.task('sass', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-sass',

		// defines what files extension are allowed to be processed
		'rules': [/.*.scss$/],

		// gathers comments that define lisences
		'lisences': null,

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': null,

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {

			// getting the fileName and checking if its a qualified file to be process 
			// (not starting by undererscore "_.*");
			// else getting files refering it via @import inside them
			return getMatchingPrincipalSCSS(matchingEntry.projectPath, filePath.hackSlashes());
		}
	};

	obj.mainPipe = (M.lazyPipe)()
		.pipe(function() {
			return (M.sass)({
				indentedSyntax: false
			}).on('error', (M.sass).logError);
		})
		.pipe(autoprefix)
		.pipe((M.stylefmt));

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToSass, obj);
});