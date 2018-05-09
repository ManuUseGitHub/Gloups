function transitiveAndSourcemappingWrap(glob_transitivity, mainLazyPipeObj) {

	// UNBOXING -----------------------------------------------------------------------------------
	var forMatchingObj = mainLazyPipeObj.forMatchingObj,
		path = forMatchingObj.path,
		pathesDescription = forMatchingObj.pathesDescr; // pathesToJs/CSS/SASS/etc. ...;
	var message = mainLazyPipeObj.message;

	// find the config through the json and getting watch ; dest ; sourcemapp etc.
	var matchingEntry = getMatchingEntryConfig(path, pathesDescription);

	// LAZYPIPE wrapping transitivity and sourcemapping -------------------------------
	var thinkTransitively = transitiveWrapAround(glob_transitivity, matchingEntry, path, mainLazyPipeObj);
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

function transitiveWrapAround(glob_transitivity, matchingEntry, path, mainLazyPipeObj) {

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
		.pipe(glob_transitivity.suffixing)
		.pipe(glob_transitivity.compressing) :

		// else do nothing
		(M.nop);

	return applyLazyPipeSet({
		opening: lzpTransitivityApplied,
		closing: lzpTransitivityCompression,
		main: mainLazyPipeObj
	});
}

function applyLazyPipeSet(obj) {
	var lazyPipeProcess = obj.main.process;
	var source_kind = obj.main.source_kind;

	if (source_kind == 'simple') {
		return (M.lazyPipe)()
			.pipe(obj.opening)
			.pipe(lisencesSetup(lazyPipeProcess))
			.pipe(separateLisences(lazyPipeProcess))
			.pipe(lazyPipeProcess)
			.pipe(separatePrehamptedLisences(lazyPipeProcess))
			.pipe(obj.closing);

	} else if (source_kind == 'complex') {
		var istransitive = metAllArgs(['transitive']);

		return (M.lazyPipe)()
			.pipe(obj.opening)
			.pipe(lisencesSetup(lazyPipeProcess))
			.pipe(lazyPipeProcess)
			.pipe(separateLisences(lazyPipeProcess, istransitive))
			.pipe(obj.closing);
	}
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
		metAllArgs(['sass', 'autominCss', 'transitive']) ||
		metAllArgs(['stylus', 'autominCss', 'transitive']) ||
		metAllArgs(['less', 'autominCss', 'transitive']) ||

		// JS focused
		metAllArgs(['coffeescript', 'automin', 'transitive']) ||
		metAllArgs(['typescript', 'automin', 'transitive']);

	var found = false;

	// by default the transitivity is set to the path the result should be the destination
	transitivity.dest = matchingEntry.dest;

	if (shouldBeTransitive) {
		var fileName = (/^.*[\/](.*)$/g.exec(path.hackSlashes()))[1];
		var focusedPathFileName = "{0}/{1}".format([matchingEntry.dest, fileName]);

		// define if it has to be transitive about CSS or JS
		// transitivityLike
		var trLike =
			/.*[.](coffee|ts)$/.test(fileName) ? 'JS' :
			/.*[.](scss|styl|less)$/.test(fileName) ? 'CSS' :
			'UNDEFINED';

		var pathesTo =
			trLike == 'JS' ? config.pathesToJs :
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