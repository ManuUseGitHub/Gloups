/* jshint esversion:6 */
function runTaskProcessForCompression(athis, pathesTo, obj) {

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

			if (!isPulseTask()) {
				gloupslog('');
			}

			logLongWaiting(mainLazyPipeObj);
		}
		var destPath = glob_transitivity != null ?
			glob_transitivity.dest :
			mainLazyPipeObj.pathesDescr.dest; // must be defined for non transitive services

		return destPath;
	};

	// CONSUMMING ---------------------------------------------------------------------------------
	gulp.src(realTargets)
		.pipe(sourceMappedProcess())
		.on('end', function() {
			logChangedRealTargetedFiles(mainLazyPipeObj, realTargets);
			exitOnPulseAfterCount();
			exitCountForLongLog();
		})
		.on('error', function(error) {
			var cause = error.cause;
			cause = cause?JSON.stringify(cause):error.message;

			var msg = logStuffedSpaceOverflowing(" "+cause,align().left,chalk.bgWhite.red.inverse);
			
			console.log(" "+chalk.bgRed.black(logStuffedSpaceMessage("Plugin : "+error.plugin,align().left)));
			console.log(" {0}".format([msg]));
			
		})
		.pipe(applyLicenceSplitting(mainLazyPipeObj))
		.pipe(gulp.dest(mainLazyPipeObj.destCallBack(true)));
}

function exitCountForLongLog(){
	if (!isPulseTask()) {
		clearInterval(glob_timer);
	}
}
function exitOnPulseAfterCount() {
	if (isPulseTask()) {
		resetTimer({
			total: 100,
			format: ':bar pulse closing in (:countdown)'
		}, function() {
			
			gulp.start('clear');
			gloupslogSumerise();

			process.exit();
		}, 100);
	}
}

function isPulseTask() {
	return process.argv[2] == 'pulse';
}

function logLongWaiting(mainLazyPipeObj) {
	// complex services takes several times so they have to inform the user
	if (mainLazyPipeObj.source_kind == 'complex') {

		resetTimer({
			total: 2
		}, function() {
			console.log(' ' + chalk.bgYellow(' ! ') + ' Long process ... few secondes required');
		});
	}
}

function resetTimer(obj, callback, stepTime) {
	var format = obj.format ? obj.format : '';
	if (/.*:countdown.*/.test(format)) {
		obj.total++;
	}
	var bar = new(M.progress)(format, {
		total: obj.total,
		width: 80,
		complete:String.fromCharCode(9608),
		incomplete:chalk.grey('.')
	});

	if (glob_timer) {
		clearInterval(glob_timer);
	}
	glob_timer = setInterval(function() {
		if (/.*:countdown.*/.test(format)) {
			bar.tick({
				'countdown': (obj.total - bar.curr-1)
			});
		} else {
			bar.tick();
		}
		if (bar.complete) {
			callback();
			clearInterval(glob_timer);
		}
	}, stepTime ? stepTime : 500);
}