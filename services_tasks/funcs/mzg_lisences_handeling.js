function separateLisences(athis) {
	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {

				var _data =
					athis.lisences.source_kind == 'simple' ? (M.fs).readFileSync(chunk.path, "utf8") :
					athis.lisences.source_kind == 'complex' ? chunk._contents.toString() :
					""; // no content

				// When service are transitive, the complex service end up with a simple
				if (athis.lisences.source_kind == 'complex') {

					// Unlisenced content stripped of special comments
					var unlisenced = distributeLisencesOutOfChunk(athis, _data);

					// Content transformation but special comments have to be stripped off
					if (shouldBeTransitive()) {

						// Buffering to put in the chunk
						chunk._contents = Buffer.from(unlisenced, 'utf8');
					}

					// When services are not transitive, the service is simple
				} else if (athis.lisences.source_kind == 'simple') {

					// Special comments have to be stripped off
					chunk._contents = Buffer.from(distributeLisencesOutOfChunk(athis, _data), 'utf8');

					// Need to save the special conmments because simple services such as 
					// straight minification remove every content. So use 
					// separatePreemptedLisences lazypipe result to recover preemptedLisence
					athis.preemptedData = Buffer.from(athis.lisences.data, 'utf8');
				}

				cb(null, chunk);
			});
		});
}

function separatePreemptedLisences(athis) {
	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {

				// get data back from athis and transform it to string
				var preemptedData = athis.preemptedData.toString();

				// nothing to affect with this because that lazypipe is used with services 
				// that are not conserned by transitivities ...
				distributeLisencesOutOfChunk(athis, preemptedData);

				cb(null, chunk);
			});
		});
}

function lisencesSetup(athis) {

	athis.lisences = {
		data: '',
		source_kind: '',
	};

	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {

				// dDetermine the kind (simple or complex) of the service triggered by
				// the file regarding its extension
				athis.lisences.source_kind =

					// A sass , a stylus , a less , a typeScript or a coffeeScript file :
					// Complex service ! 
					/.*[.](?:scss|styl|less|ts|coffee)$/.test(chunk.path) ? "complex" :

					// A javaScript or a CSS file :
					// Simple service !
					/.*[.](?:css|js)$/.test(chunk.path) ? 'simple' :

					// Not sure what it is ...
					'unknown';

				cb(null, chunk);
			});
		});
}

function aLazyPipeThatIsPipingLikeNop() {
	return (M.lazyPipe)()
		.pipe((M.nop));
}

function distributeLisencesOutOfChunk(athis, _data) {
	var result = readLisences(_data);
	athis.lisences.data = result.lisences;

	return result.not_lisences;
}

function readLisences(_data) {

	var reading = new classReading();
	reading.initialize(_data, 0);

	var readingLisenceObj = {
		reading: reading,
		line: '',
		cpt: 0,
		result: [],
		anti_result: [],
		canprint: false,
		inLisence: false,
		line_count: 0.5
	};

	reading.readLines(function() {
		readingLisencesProcess(readingLisenceObj);
	});



	return {
		lisences: readingLisenceObj.result.join('\n'),
		not_lisences: readingLisenceObj.anti_result.join('\n')
	};
}

function readingLisencesProcess(R) { // R : reading object (specific to lisences reading)
	R.line = R.reading.line;
	R.canprint = false;
	if (/^.*(?:\/\*!).*(?:\*\/).*$/.test(R.line)) {
		R.canprint = true;
	} else if (/^.*(?:\/\*!).*$/.test(R.line)) {
		R.canprint = true;
		R.inLisence = true;
	} else if (R.inLisence && /^.*(?:\*\/).*$/.test(R.line)) {
		R.canprint = true;
		R.inLisence = false;
	}

	inLisenceProcess(R);
}

function inLisenceProcess(R) {
	if (R.inLisence) {
		if (R.line.length > 0 || (++R.cpt % 3 == 2)) {
			R.canprint = true;
		}
		if (R.line.length > 0) {
			R.cpt = 0;
		}
	}

	if (R.canprint) {
		R.result.push(R.line);
	} else {
		R.anti_result.push(R.line);
	}

	// progress
	(R.line_count += 0.5);
	if (Number.isInteger(R.line_count)) {
		//stepUp();
	}
}

function applyLicenceSplitting(mainLazyPipeObj) {
	return (M.through).obj(function(chunk, enc, cb) {
		var lisences = mainLazyPipeObj.process.lisences;

		if (lisences && lisences.data != '') {
			var match = /^.*[\/\\]([^\.]+.*)min.(css|js)$/.exec(chunk.path.hackSlashes());

			// The only transformation that can wiped the comments (lisences) out is 
			// minification so otherwise lisences are saved
			if (match && /^.*[.]min[.].*$/.test(chunk.path.hackSlashes())) {
				var dest = mainLazyPipeObj.destCallBack(false);

				var finalLisenseFilePath = dest + '/' + match[1] + 'lisence.' + match[2];

				(M.fssync).write(finalLisenseFilePath, "{0} \n/* -- {1} with Gloups v {2} - {3} | thanks to {4} -- */".format([
						lisences.data,
						'Lisence(s) exported',
						GLOUPS_VERSION,
						shortDateComputed(),
						'gulp-through2 ; gulp-fssync'
					]),
					'utf8'
				);

				var descr = mainLazyPipeObj.forMatchingObj.pathesDescr;

				// projectAndFileName
				var pafn = getProjectNameWithFileFromPathDesc(descr, finalLisenseFilePath.hackSlashes());

				gloupslog(" {0} '{1}{2}'".format(['Lis. reported ', chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));
			}

		}
		cb(null, chunk);
	});
}