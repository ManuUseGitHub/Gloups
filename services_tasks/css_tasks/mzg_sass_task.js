gulp.task('sass', function() {
	logTaskPurpose(this.currentTask.name);

	// watch every single file matching those paths
	var wl = watchList(config.pathesToSass);

	var glob_transitivity = getFreshTransitivity();
	// passing the watch list
	gulp.watch(wl, function(event) {
		if (/.*.scss$/.test(event.path)) {
			var message = {
				'action': "Processed",
				'module': "gulp-sass"
			};
			// find the config through the json and getting watch ; dest ; sourcemapp etc.
			var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToSass);

			// getting the fileName and checking if its a qualified file to be process 
			// (not starting by undererscore "_.*");
			// else getting files refering it via @import inside them
			realTargets = getMatchingPrincipalSCSS(matchingEntry.projectPath, event.path.hackSlashes());

			var process = function() {
				// LAZYPIPE : main pipeline to provide SASS service -------------------------------
				var mainProcess = lazyPipe()
					.pipe(function() {
						return sass({indentedSyntax: false}).on('error', sass.logError);
					})
					.pipe(autoprefix)
					.pipe(stylefmt);

				// LAZYPIPE wrapping transitivity and sourcemapping -------------------------------
				var thinkTransitively = transitiveWrapAround(glob_transitivity, matchingEntry, event.path, mainProcess);
				var sourceMappedProcess = setSourceMappingAndSign(thinkTransitively, matchingEntry, message);

				gulp.src(realTargets)
					.pipe(sourceMappedProcess())
					.pipe(gulp.dest(glob_transitivity.dest));
			};

			// call with logging of the time taken by the task
			logProcessCompleteOnFile(realTargets, 'Processing', process);
		}
	});
});