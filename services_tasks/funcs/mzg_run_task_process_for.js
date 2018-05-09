function runTaskProcessForCompression(athis, pathesTo, obj) {
	logTaskPurpose(athis.currentTask.name);

	var mainLazyPipeObj = createMainLazyPipeObject(pathesTo, "Compressed    ", obj.module);

	// watch every single file matching those paths
	var wl = watchList(pathesTo);

	// no transitivity for compression because the compression is a B step out of ABC
	// where A is the first and C the last step
	var glob_transitivity = null;

	gulp.watch(wl, function(event) {

		var filePath = event.path;

		// checking for extensions matching
		if (checkMultipleRules(filePath, [event.type !== "deleted"].concat(obj.rules))) {

			// set the filepath to the object
			mainLazyPipeObj.forMatchingObj.path = filePath;

			// find the config through the json and getting watch ; dest ; sourcemapp etc.
			var matchingEntry = getMatchingEntryConfig(filePath, pathesTo);

			// indicate what watch rule, the destination folder, and if there are sourcemaps.
			mainLazyPipeObj.pathesDescr = matchingEntry;

			// set the variant pipe part to the process. It will be wrapped in sourcemapps 
			// and the transitivity will have to be calculate (not really needed here )
			mainLazyPipeObj.process = obj.mainPipe;

			mainLazyPipeObj.source_kind = 'simple';

			// COMPUTE THE LAZYPIPE AND DYNAMIC BEHAVIORS -------------------------------------
			consumePipeProcss(glob_transitivity, mainLazyPipeObj, [filePath]);
		}
	});
}

function runTaskProcessForPrecompiledFiles(athis, pathesTo, obj) {
	logTaskPurpose(athis.currentTask.name);

	var mainLazyPipeObj = createMainLazyPipeObject(pathesTo, "Processed     ", obj.module);

	// watch every single file matching those paths
	var wl = watchList(pathesTo);

	// preconfigure a default "global" object for transitivity 
	var glob_transitivity = getFreshTransitivity();

	// passing the watch list
	gulp.watch(wl, function(event) {

		var filePath = event.path;

		if (checkMultipleRules(filePath, obj.rules)) {

			// set the filepath to the object 
			mainLazyPipeObj.forMatchingObj.path = filePath;

			// find the config through the json and getting watch ; dest ; sourcemapp etc.
			var matchingEntry = getMatchingEntryConfig(filePath, pathesTo);

			// LAZYPIPE : main pipeline to provide SASS service -------------------------------
			mainLazyPipeObj.process = obj.mainPipe;

			// focus on files importing other via @import
			var realTargets = obj.realTargetsFunction(filePath, matchingEntry);

			mainLazyPipeObj.source_kind = 'complex';

			// COMPUTE THE LAZYPIPE AND DYNAMIC BEHAVIORS -------------------------------------
			consumePipeProcss(glob_transitivity, mainLazyPipeObj, realTargets);
		}
	});
}

function consumePipeProcss(glob_transitivity, mainLazyPipeObj, realTargets) {

	var sourceMappedProcess = transitiveAndSourcemappingWrap(glob_transitivity, mainLazyPipeObj);

	// OVERWRITING DEFAULT DESTINATION ------------------------------------------------------------
	mainLazyPipeObj.destCallBack = function(haslog) {

		if (haslog) {
			gloupslog('');
			logChangedRealTargetedFiles(mainLazyPipeObj, realTargets);
		}

		var destPath = glob_transitivity != null ?
			glob_transitivity.dest :
			mainLazyPipeObj.pathesDescr.dest; // must be defined for non transitive services

		return destPath;
	};

	// CONSUMMING ---------------------------------------------------------------------------------
	gulp.src(realTargets)
		.pipe(sourceMappedProcess())
		.pipe(applyLicenceSplitting(mainLazyPipeObj))
		.pipe(gulp.dest(mainLazyPipeObj.destCallBack(true)));
}
