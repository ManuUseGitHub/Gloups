/**
 @Function
 * fills the config arrays according to a current service mapping provided by a json file 
 * (the file is a direct configuraiton)
 * 
 * @param {String} project_path [description]
 * @param {Boolean} shouldLog    [description]
 */
function setUpProjectWatchingPaths(project_path,shouldLog) {
	var configPath = project_path + '/config.mzg.js';
	var projectServices = require(configPath);

	var noService = removeUnconsistentServices(projectServices);

	if (shouldLog && !isPulseTask()) {
		if (noService) {
			var msgNoService = logStuffedSpaceMessage(" No service ",align().center);
			console.log(" {0}\n".format([chalk.bgWhite.yellow.inverse(msgNoService)]));
		} else {

			var msgPathAt = " Services of path : ";
			var msg = logStuffedSpaceOverflowing(msgPathAt,align().left,chalk.bgWhite.cyan.inverse);
			console.log(" {0}".format([msg]));

			
			var msg2 = logStuffedSpaceOverflowing(project_path,align().center,chalk.bgCyan.black);
			console.log(" {0}\n".format([msg2]));
		}
	}


	config.pathesToJs = makePathesCoveringAllFilesFor(project_path, {
		'pathesToService': (config.pathesToJs),
		'addon': projectServices.minify_js
	}, '/**/*.js', 'Compress .js files into .min.js files');

	config.pathesToTs = makePathesCoveringAllFilesFor(project_path, {
		'pathesToService': (config.pathesToTs),
		'addon': projectServices.ts_to_js
	}, '/**/*.ts', 'Compile .ts files into .js file');

	config.pathesToCoffee = makePathesCoveringAllFilesFor(project_path, {
		'pathesToService': (config.pathesToCoffee),
		'addon': projectServices.coffee_to_js
	}, '/**/*.coffee', 'Compile .coffee files into .js file');

	config.pathesToStyle = makePathesCoveringAllFilesFor(project_path, {
		'pathesToService': (config.pathesToStyle),
		'addon': projectServices.minify_css
	}, '/**/*.css', 'Compress .css files');

	config.pathesToStyleLess = makePathesCoveringAllFilesFor(project_path, {
		'pathesToService': (config.pathesToStyleLess),
		'addon': projectServices.less
	}, '/**/*.less', 'Compile .less files into .css files');

	config.pathesToSass = makePathesCoveringAllFilesFor(project_path, {
		'pathesToService': (config.pathesToSass),
		'addon': projectServices.sass
	}, '/**/*.scss', 'Compile .scss files into .css files');

	config.pathesToStylus = makePathesCoveringAllFilesFor(project_path, {
		'pathesToService': (config.pathesToStylus),
		'addon': projectServices.stylus
	}, '/**/*.styl', 'Compile .styl files into .css files');
}

function removeUnconsistentServices(projectServices) {
	var projectServicesCopy = projectServices;
	var isEmpty = true;

	for (var e in projectServicesCopy) {

		// remove services that has no entry
		if (projectServicesCopy[e].length == 0) {
			delete projectServices[e];
		} else if (isEmpty) {
			isEmpty = false;
		}
	}

	return isEmpty;
}


function getMatchingEntryConfig(filePath, configTab) {
	filePath = filePath.hackSlashes();

	// iterate on efery path within configTab to check 
	// what path sources fire the change event then find
	// the destination referenced via 'entry.dest'
	for (var p_path in configTab) {

		var entry = configTab[p_path];
		var watch = entry.watch.hackSlashes();
		var dest = entry.dest.hackSlashes();

		// EX. >abc/efg/hij/klm/nop<
		var pattern = '^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$';
		var base = (new RegExp(pattern, "g").exec(watch))[2];
		var matching = (new RegExp('^.*(?:' + base + ').*$', "g").exec(filePath));

		if (matching) {
			return entry;
		}
	}
	return null;
}

function watchList(configTab) {
	var list = [];
	for (var p_path in configTab) {
		var watch = configTab[p_path].watch;
		list.push(watch);
	}
	return list;
}

function watchListLight(configTab) {
	var list = [];

	configTab.forEach(function(element) {
		var watch = element.watch;

		var ppl = element.projectPath.length; // path to project length
		var lpp = watch.substr(ppl); // local path to the partial 

		list.push({
			'project': element.projectName,
			'watch': lpp
		});
	});
	return list;
}

function mappSassMatching(projectRootPath, watchPathForSass) {
	// ===========================================================================================================
	// the configuration is set to look into every folder under the watch path ?
	var m;
	if ((m = /^(.*)[\\\/]\*\*[\\\/]\*\..*$/.exec(watchPathForSass)) && m[1]) {

		config.sassMaching = [];
		var pathsToSCSSPrimary = walkSync(m[1], [], new RegExp("^.*[\\\/](_.*)$", 'i'));
		var i = 0;

		pathsToSCSSPrimary.forEach(function(styleSheet) {
			config.sassMaching.push({
				identifier: styleSheet.fileName,
				target: styleSheet.path,
				partials: []
			});

			pushEllipsizedPartials(projectRootPath, styleSheet, i++);
		});
	}
	// ===========================================================================================================
}

function pushEllipsizedPartials(projectRootPath, styleSheet, index) {

	var reading = new classReading();
	var _data = (M.fs).readFileSync(styleSheet.path, "utf8");
	reading.initialize(_data, 0);

	var ppl = projectRootPath.length; // project path Length
	var l, m;

	reading.readLines(function() {
		l = reading.line;
		if ((m = /^@import[\s]+["](.*)["]/.exec(l)) && m[1]) {

			// full path to the partial
			var fpp = "{0}/{1}".format([styleSheet.dir, m[1]]);

			// local path to the partial 
			var lpp = fpp.substr(ppl);

			var ellipsedPath = pathEllipzizeing(fpp, 0, (lpp.split("/").length));
			config.sassMaching[index].partials.push(ellipsedPath);
		}
	});
}

function pathEllipzizeing(path, sub, sup) {
	// patern + format !!! {-1} = "{", {-2} = "}" !!!
	var patern = "^(?:(?:((?:[^\/\\]+[\\\/]{-1}1,2{-2}){-1}{0}{-2}).*((?:[\\\/][^\/\\?]+){-1}{1},{-2}[\\\/]?)[^?]*).*|([^?]*).*)$".format([sub, sup]);
	var m = new RegExp(patern, 'g').exec(path);
	return m[3] ? m[3] : (m[1] + '...' + m[2]); // if no ellips is posible, return the full path;
}

// https://gist.github.com/kethinov/6658166
// List all files in a directory in Node.js recursively in a synchronous fashion
function walkSync(dir, filelist, regexFilter) {
	var files = (M.fs).readdirSync(dir);
	var pathModule = (M.path);
	filelist = filelist || [];
	files.forEach(function(file) {
		if ((M.fs).statSync(pathModule.join(dir, file)).isDirectory()) {
			filelist = walkSync(pathModule.join(dir, file), filelist, regexFilter);
		} else {
			if (!regexFilter.test(dir + '/' + file))
				filelist.push({
					"dir": dir.hackSlashes(),
					"path": (dir + '/' + file).hackSlashes(),
					"fileName": file
				});
		}
	});
	return filelist;
}

function getProjectNameFromRootPath(projectRootPath) {
	var projects = getConfig().projects;
	for (var p in projects) {
		if (projectRootPath == projects[p].path) {
			return projects[p].project;
		}
	}

	// default
	return projectRootPath;
}