function getAllNeededModules(tasks) {
	gloupslog("\n SYNTAXICALY {1} FROM {0} ...".format([logFilePath("gulpfile.js"), chalk.bgMagenta(' IMPORTING MODULES ')]));
	console.log('\n');

	getModule(M.fs);
	seekInFoundElements('intask', JSON.stringify(tasks));

	importModulesFromFoundModules();
}

function importModulesFromFoundModules() {
	var dStart = new Date();

	Object.keys(glob_found_modules).forEach(function(element) {
		getModule(M[element]);
	});

	// logging the time elapsed
	var dResult = ms2Time(new Date() - dStart);

	console.log('\n');
	gloupslog(" SYNTAXICAL  {1} DONE IN {0}".format([chalk.magenta(dResult), chalk.bgMagenta(' IMPORT ')]));
	console.log('\n');
}

function importNeededModules(kind, search) {
	var match = /^(?:[\-]+(.*)|(.*))$/.exec(search);
	search = match[1] ? match[1] : match[2];

	console.log('\n');
	gloupslog(" SYNTAXICALY  {1} FROM {0} ...".format([logFilePath("gulpfile.js"), chalk.bgMagenta(' IMPORT MODULES ')]));
	console.log('\n');

	getModule(M.fs);

	var analyser = getAnalyser();
	var reading = initReading(analyser.file);

	Macro_Seek_Modules(reading, analyser, kind, search);

	importModulesFromFoundModules();
}

gulp.task('mapFonction', function() {
	importNeededModules();
});

function Macro_Seek_Modules(reading, analyser, kind, search) {
	var line, enc = 0;

	reading.readLines(function() {
		line = reading.line.replace(/\r?\n|\r/g, '');

		// while analysing syntaxicaly the file, say if wa encountered the function / task
		// and say via the analyser object if we are in a task or a function by its fields
		defineMatchingElement(analyser, line, search);

		// if we are in a function or a task we are searching ! and not another. 
		// If so, explore that element (read inside curlybraces of kind [in a task or in a funct])
		// matched
		if (analyser[kind] && search == {
				'intask': analyser.taskMatched,
				'infunc': analyser.functMatched
			}[kind]) {

			// opening and closing curlybraces
			if ((enc = (line.split("{").length - 1) + (line.split("}").length - 1)) % 2 == 0 && enc > 0) {
				whenModuleMatched(line);

				// not equal amount of opening and closing curlybraces ... need to dig deeper
			} else {

				// say when the count of opening and closing curlybraces equals to zero to tel
				// if we reached the end of a function or a task definition.
				defineLimits(analyser, line, enc);

				whenElementMatched(line);
			}
		}
	});
}

function getAnalyser() {
	return {
		'file': "gulpfile.js",
		'intask': false,
		'infunc': false,
		'taskMatched': '',
		'functMatched': '',
		'encounter': 0,
	};
}

function initReading(path) {
	var reading = new classReading();
	var _data = (M.fs).readFileSync(path, "utf8");
	reading.initialize(_data, 0);
	return reading;
}

function defineMatchingElement(analyser, line, search) {
	var match;
	// EX. MATCH >var funcName = function(...< OR >funcName function(...<
	if ((match = /^(?:(?:var[\s]+(\b.*\b)[\s=]+function[(].*)|(?:.*[\s]?function[\s]([^\s(]+).*))$/.exec(line))) {
		analyser.functMatched = match[1] ? match[1] : match[2];
		analyser.infunc = true;

	} else if ((match = /^gulp[.]task[(]["']([^\[\]]*)["'][,\s]*([\[](?:["'][\w]+["'][,\s]*)+[\]])?.*$/.exec(line))) {
		analyser.taskMatched = match[1];

		analyser.intask = true;

		if ((line.split("{").length - 1) == 0 && match[2] && search == match[1]) {
			analyser.intask = false;
			seekInFoundElements('intask', match[2]);
		}

		//analyser.intask = (enc = line.split("{").length - 1) > 0;
	}
}

function defineLimits(analyser, line, enc) {
	if ((enc = (line.split("{").length - 1)) > 0) {
		analyser.encounter += enc;
	}
	if ((enc = (line.split("}").length - 1)) > 0) {

		analyser.encounter -= enc;

		if (analyser.encounter == 0) {
			analyser.infunc = false;
		}
	}
}

function whenElementMatched(line) {
	var match;
	if (whenModuleMatched(line)) {
		// DONE, nothing to do here ... 
	} else if ((match = /^.*[\.]pipe[(]([\w]+).*$/.exec(line))) {
		if (!/^function|gulp$/.test(match[1])) {
			seekInFoundElements('infunc', match[1]);
		}
	} else if ((match = /^.*gulp[\.]start[(](?:(?:.*([\[](?:["'][\w]+["'],?)+[\]]))|(?:.*["']([\w]+)["'])).*$/.exec(line))) {
		seekInFoundElements('intask', match[1] ? match[1] : match[2]);

	} else if ((match = /^[^\"]*[^\.]+(\b[^\.]+\b)[(].*$/.exec(line))) {
		seekInFoundElements('infunc', match[1]);
	}
}

function whenModuleMatched(line) {
	var match;
	var result;
	if ((result = /^.*M[\.]([\w]+).*$/.exec(line))) {

		var regex = /M[\.]([\w]+)/g;
		while ((match = regex.exec(line))) {
			if (!glob_found_modules[match[1]]) {
				glob_found_modules[match[1]] = true;
			}
		}
	}
	return result;
}

/**
 * @param  {String} elements : name(s) of functions or tasks. 
 * Multiple elements have to follow the array JSON string format => '["e1","e2","eN"]'
 */
function seekInFoundElements(kind, elements) {
	var list = [];

	// multiple elements (an array JSON string formated) 
	// EX.MATCH >["e1","e2","eN"]<
	if (/^([\[](?:["'][\w]+["'][,\s]*)+[\]])$/.test(elements)) {

		elements = elements.replace(/[\']/g, '"');
		list = JSON.parse(elements);

		// single element (a string)
	} else {
		list.push(elements);
	}

	list.forEach(function(element) {
		if (!glob_visited_elements[kind][element]) {
			glob_visited_elements[kind][element] = true;
			var analyser = getAnalyser();
			var r = initReading(analyser.file);

			// recursion if called by Macro_Seek_Modules. Check the matched function(s) or task(s).
			Macro_Seek_Modules(r, analyser, kind, element);
		}
	});
}