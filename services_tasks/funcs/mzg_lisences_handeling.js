function separateLisences(athis, isTransitive) {
	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {

				var _data =
					athis.lisences.source_kind == 'simple' ? (M.fs).readFileSync(chunk.path, "utf8") :
					athis.lisences.source_kind == 'complex' ? chunk._contents.toString() :
					""; // no content

				if (athis.lisences.source_kind == 'complex') {
					chunk._contents = distributeLisencesOutOfChunk(athis, isTransitive, _data);

					// the content must be buffered
					chunk._contents = Buffer.from(chunk._contents, 'utf8');

				} else if (athis.lisences.source_kind == 'simple') {
					athis.prehamptedData = _data;
				}

				cb(null, chunk);
			});
		});
}

function separatePrehamptedLisences(athis) {
	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {

				// get data back from athis and transforming it to string
				var prehamptedData = athis.prehamptedData;

				// nothing to affect with this because that lazypipe is used with simple services
				// which are not affected by the transitivity ...
				var isTransitive;

				chunk._contents = Buffer.from(distributeLisencesOutOfChunk(athis, isTransitive, prehamptedData), 'utf8');

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
				athis.lisences.source_kind =
					/.*[.](?:scss|styl|less|ts|coffee)$/.test(chunk.path) ? "complex" :
					/.*[.](?:css|js)$/.test(chunk.path) ? 'simple' :
					'unknown';
				cb(null, chunk);
			});
		});
}

function aLazyPipeThatIsPipingLikeNop() {
	return (M.lazyPipe)()
		.pipe((M.nop));
}

function distributeLisencesOutOfChunk(athis, isTransitive, _data) {
	var result = readLisences(_data);
	athis.lisences.data = result.lisences;

	return isTransitive ? result.not_lisences : _data;
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
		inLisence: false
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
		if (R.line.length > 0) {
			R.canprint = true;

		} else if (++R.cpt % 3 == 2) {
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
}

function applyLicenceSplitting(mainLazyPipeObj) {
	return (M.through).obj(function(chunk, enc, cb) {
		var lisences = mainLazyPipeObj.process.lisences;

		if (lisences && lisences.data != '') {
			var match = /^.*[\/\\]([^\.]+).*[.](css|js)$/.exec(chunk.path.hackSlashes());

			// The only transformation that can wiped the comments (lisences) out is 
			// minification so otherwise lisences are saved
			if (match && /^.*[.]min[.].*$/.test(chunk.path.hackSlashes())) {
				var dest = mainLazyPipeObj.destCallBack(false);

				var finalLisenseFilePath = dest + '/' + match[1] + '.lisence.' + match[2];

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