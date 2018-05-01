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

			// COMPUTE THE LAZYPIPE AND DYNAMIC BEHAVIORS -------------------------------------
			consumePipeProcss(glob_transitivity, mainLazyPipeObj, realTargets);
		}
	});
}

function consumePipeProcss(glob_transitivity, mainLazyPipeObj, realTargets) {

	var sourceMappedProcess = transitiveAndSourcemappingWrap(glob_transitivity, mainLazyPipeObj);

	// OVERWRITING DEFAULT DESTINATION ------------------------------------------------------------
	mainLazyPipeObj.destCallBack = function() {
		gloupslog('');
		logChangedRealTargetedFiles(mainLazyPipeObj, realTargets);

		var destPath = glob_transitivity != null ?
			glob_transitivity.dest :
			mainLazyPipeObj.pathesDescr.dest; // must be defined for non transitive services

		return destPath;
	};

	// CONSUMMING ---------------------------------------------------------------------------------
	gulp.src(realTargets)
		.pipe(sourceMappedProcess())
		.pipe(gulp.dest(mainLazyPipeObj.destCallBack()));
}

function logChangedRealTargetedFiles(mainLazyPipeObj, realTargets) {
	var descr = mainLazyPipeObj.forMatchingObj.pathesDescr;
	var pafn;
	var actionOnFile = mainLazyPipeObj.message.action;

	cpt = 0;
	// call with logging of the time taken by the task
	if (realTargets.length > 1) {
		realTargets.forEach(function(file) {

			// the next time, do not output the action since it is the same
			if (cpt++ > 0)
				actionOnFile = '              ';

			// projectAndFileName
			pafn = getProjectNameWithFileFromPathDesc(descr, file);

			gloupslog(" {0} '{1}{2}'".format([actionOnFile, chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));

		});
	} else {
		var pathHackSlashed = realTargets[0].hackSlashes();

		// projectAndFileName
		pafn = getProjectNameWithFileFromPathDesc(descr, pathHackSlashed);

		gloupslog(" {0} '{1}{2}'".format([actionOnFile, chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));
	}
}

function getProjectNameWithFileFromPathDesc(descr, file) {

	var backedPath = /[^\/\\]*(\/.*)/.exec(file)[1];
	backedPath = ".." + backedPath;
	var projectName = '<PROJECT NM>';
	var fileName;

	for (var p in descr) {

		var projectPathPaternString = descr[p].projectPath.split("/").join('\\/') + '(.*)$';
		var projectPathPatern = new RegExp(projectPathPaternString, "g");
		var match = null;

		if ((match = projectPathPatern.exec(backedPath))) {
			projectName = descr[p].projectName;
			fileName = match[1];
			break;
		}
	}

	return {
		'projectName': projectName,
		'fileName': fileName
	};
}

function transitiveAndSourcemappingWrap(glob_transitivity, mainLazyPipeObj) {

	// UNBOXING -----------------------------------------------------------------------------------
	var lazyPipeProcess = mainLazyPipeObj.process;
	var forMatchingObj = mainLazyPipeObj.forMatchingObj,
		path = forMatchingObj.path,
		pathesDescription = forMatchingObj.pathesDescr; // pathesToJs/CSS/SASS/etc. ...;
	var message = mainLazyPipeObj.message;

	// find the config through the json and getting watch ; dest ; sourcemapp etc.
	var matchingEntry = getMatchingEntryConfig(path, pathesDescription);

	// LAZYPIPE wrapping transitivity and sourcemapping -------------------------------
	var thinkTransitively = transitiveWrapAround(glob_transitivity, matchingEntry, path, lazyPipeProcess);
	var sourceMappedProcess = setSourceMappingAndSign(thinkTransitively, matchingEntry, message);

	return sourceMappedProcess;
}

function setSourceMappingAndSign(lazyPipeProcess, matchingEntry, sign) {
	var sourcemapping = matchingEntry.sourcemaps;
	return (M.lazyPipe)()

		// if sourcemaps desired initialize them or do nothing
		.pipe(sourcemapping ?
			(M.sourcemaps).init :
			(M.nop))

		// transitivity handleing here in general
		.pipe(lazyPipeProcess)

		// put a sign after the end of the file stream to indicate it used Gloups and some modules
		.pipe(insertSignatureAfter, sign.action, sign.module)

		// if sourcemaps desired write them or do nothing
		.pipe(sourcemapping ?
			function() {
				return (M.sourcemaps).write('./');
			} :
			(M.nop));
}

function transitiveWrapAround(glob_transitivity, matchingEntry, path, lazyPipeProcess) {

	// do not let the default draft folder as a destination, change it straight away
	if (glob_transitivity != null && glob_transitivity.dest == "draft") {
		transitivitySetupCore(glob_transitivity, matchingEntry, path);
	}

	// if high leveled services, make a lazypipe where the transitivity is applied
	var lzpTransitivityApplied = glob_transitivity != null ?
		(M.lazyPipe)()
		.pipe(transitivitySetup, glob_transitivity, matchingEntry, path) :

		// else do nothing
		(M.nop);

	// if high leveled services, make a lazypipe compressed and suffixed
	var lzpTransitivityCompression = glob_transitivity != null ?
		(M.lazyPipe)()
		.pipe(glob_transitivity.compressing)
		.pipe(glob_transitivity.suffixing) :

		// else do nothing
		(M.nop);

	return (M.lazyPipe)()
		.pipe(lzpTransitivityApplied)
		.pipe(lazyPipeProcess)
		.pipe(lzpTransitivityCompression);
}


function transitivitySetup(transitivity, matchingEntry, path) {
	return (M.through).obj(function(chunk, enc, callback) {
		transitivitySetupCore(transitivity, matchingEntry, path);
		callback(null, chunk);
	});
}

function transitivitySetupCore(transitivity, matchingEntry, path) {
	var shouldBeTransitive =
		metAllArgs(['all', 'transitive']) ||

		// CSS focused
		metAllArgs(['sass', 'mincss', 'transitive']) ||
		metAllArgs(['stylus', 'mincss', 'transitive']) ||
		metAllArgs(['less', 'mincss', 'transitive']) ||

		// JS focused
		metAllArgs(['coffee', 'minjs', 'transitive']) ||
		metAllArgs(['typescript', 'minjs', 'transitive']);

	var found = false;

	// by default the transitivity is set to the path the result should be the destination
	transitivity.dest = matchingEntry.dest;

	if (shouldBeTransitive) {
		var fileName = (/^.*[\/](.*)$/g.exec(path.hackSlashes()))[1];
		var focusedPathFileName = "{0}/{1}".format([matchingEntry.dest, fileName]);

		// define if it has to be transitive about CSS or JS
		// transitivityLike
		var trLike = /.*[.](coffee|ts)$/.test(fileName) ? 'JS' :
			/.*[.](scss|styl|less)$/.test(fileName) ? 'CSS' :
			'UNDEFINED';

		var pathesTo = trLike == 'JS' ? config.pathesToJs :
			trLike == 'CSS' ? config.pathesToStyle :
			null;

		// get the B step matching configuration and check if there is a matching from 
		// A step destination to B step wtching folder
		var matchingEntryFinal = getMatchingEntryConfig(focusedPathFileName, pathesTo);

		found = matchingEntryFinal != null;
		transitivity.should = found;

		if (found) {
			transitivity.compressing =
				trLike == 'JS' ? (M.uglify) :
				trLike == 'CSS' ? cleanCssMinification :
				(M.nop);

			transitivity.suffixing = renameSuffixMin;

			// substitution of matchingEntryConfig A step destination replaced by C step destination
			transitivity.dest = matchingEntryFinal.dest;
		}
	}
}

function renameSuffixMin() {
	return (M.rename)({
		suffix: '.min'
	});
}

function cleanCssMinification() {
	return (M.cleanCSS)({
		compatibility: 'ie8'
	});
}

function insertSignatureAfter(actionDone, thanksToModule) {
	return (M.insert).append("\n/* -- {0} with Gloups {1} | using {2} -- */".format([
        actionDone, GLOUPS_VERSION, thanksToModule
    ]));
}

function autoprefix() {
	return (M.autoprefixer)({
		browsers: AUTOPREFIXER_BROWSERS,
		cascade: false
	});
}