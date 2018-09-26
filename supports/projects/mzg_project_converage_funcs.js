function purgeCoverage(confObj) {
	var currentDir;

	// if you used gloups commands, the path is given for you
	if ((currentDir = getCurrentRunningDirectory()) != NOPE) {
		var purgedList = [];

		// checking all projects paths
		config.projects.forEach(function(element, index) {

			var p = element.path;
			var match;

			if ((match = /^..\/(.+)$/.exec(p))) {

				// setting the path as a patern
				var patern = "^(?:{0}.*)".format([p.replaceAll("/", "\\/")]);

				var regex = new RegExp(patern, "g");

				if (regex.test(currentDir)) {
					purgedList.push(element);
					if (purgedList.length > 1) {
						purgedList = keepBest(purgedList, element);
					}
				}
			}
		});

		config.projects = purgedList;
	}
}

function keepBest(purgedList) {
	var bestIndex = 0;
	var bestPurgedList = [purgedList[0]];

	for (var i = 0, t = purgedList.length; i < t; ++i) {
		var aThisElem = purgedList[i];

		if (purgedList[bestIndex].path.length < aThisElem.path.length) {
			bestIndex = i;
		}
	}

	var temp = purgedList[bestIndex];
	bestPurgedList = [];
	bestPurgedList.push(temp);
	return bestPurgedList;
}

function coverFoldersToServe(confObj) {

	// checking the --currentDir (the place where the terminal is running via gloups command) option 
	// > removing unmaching projects if their path does not match with the current
	purgeCoverage(confObj);

	for (var p_path in config.projects) {
		var project = config.projects[p_path];
		if (confObj.scope == '*' || project.project == confObj.scope) {
			if ((M.fssync).exists(project.path + '\\config.mzg.js')) {
				if (project.checked) {
					if (confObj.shouldLog && !isPulseTask()) {
						var projectNameCentered = logStuffedSpaceMessage(project.project, align().center);
						console.log(" {0}".format([chalk.bgGreen(projectNameCentered)]));
					}
					setUpProjectWatchingPaths(project.path, confObj.shouldLog);
				}
			} else {
				if (confObj.shouldLog && !isPulseTask()) {
					logProjectErrored(project);
				}
			}
		}
	}
}

function fireEnventOnEveryCoveredFiles(fileNames) {
	fileNames.sort(function(a, b) {
		return a.localeCompare(b);
	}).forEach(function(e, i) {
		gulp.src(e)
			.pipe(gulp.dest(function(file) {
				return file.base;
			}));
	});
}

function getEveryFilesCoveredOnce(folders) {
	var ficsObj = {};

	folders.forEach(function(l, j) {
		var pathExists = M.fssync.exists(l);

		if (pathExists) {
			var pathsOfKind = walkSync(l, [], FILE_STARTING_BY_UNDERSCORE);

			pathsOfKind.forEach(function(e, i) {
				ficsObj[e.path] = true;
			});
		}
	});

	return Object.keys(ficsObj);
}

function getAllServiceCoverageWatchFolders() {
	var folders = [];

	[].concat(

		// Javascript services folders
		config.pathesToJs,
		config.pathesToTs,
		config.pathesToCoffee,

		// CSS services folders
		config.pathesToStylus,
		config.pathesToSass,
		config.pathesToStyle,
		config.pathesToStyleLess

		// every coverage
	).forEach(function(e, i) {
		if (e) {
			// pushes watch base folders paths 
			// MATCHING :: ^(abc/.../...)/**/*.ext$
			folders.push(FILE_COVERAGE_REGEXP.exec(e.watch)[1]);
		}
	});

	return folders;
}

function findProjectBinding(currentDir) {
	var foundRecord = false;
	config.projects.forEach(function(project) {
		var match;

		if ((match = /^..\/(.+)$/.exec(project.path))) {

			// setting the path as a patern
			var patern = "^[^\\/]+\\/(?:{0})$".format([match[1].replaceAll("/", "\\/")]);

			if (new RegExp(patern).test(currentDir)) {
				foundRecord = true;
			}
		}
	});
	return foundRecord;
}

function fixProjectBinding(currentDir, foundRecord) {
	if (!foundRecord) {
		console.log("No registration for :" + logFilePath(currentDir + '\\config.mzg.js') + ' updating now !');

		var subs = translateAliassesInArgs(process.argv, SERVICES);
		var sububar = getSliceOfMatchingOptions(subs, SERVICES_ADVANCED_OPTIONS);
		var projectName = getOptionValue(subs, sububar[0]);

		// set the folder name ass project name if no name given
		projectName = projectName != null ? projectName : /^.*\/(.*)/.exec(currentDir)[1];

		var projectDeff = {
			"project": projectName,
			"path": "{0}/{1}".format(["..", /^[^\/]+\/(.*)/.exec(currentDir)[1]]),
			"checked": true
		};

		config.projects.push(projectDeff);
		writeModuleFromObject("custom/config.js", config.projects);
	}

	if (!M.fssync.exists(currentDir + '\\config.mzg.js')) {
		console.log("file :" + logFilePath(currentDir + '\\config.mzg.js') + ' does not exist ... creation very soon');

		gulp.src('custom/config.mzg.js')
			.pipe((M.rename)('config.mzg.js'))
			.pipe(gulp.dest(currentDir));
	}
}

function writeModuleFromObject(filepath, obj, cb = null) {
	var destFolder = /^((?:[^\/]+\/?)+)\/.*/.exec(filepath);

	// define the destination folder ... 
	// if there is a full path like go/to/path/filename.xyz : 
	// 		go/to/path 	will be given
	// else :
	// 		./ 			will be given (current)
	destFolder = destFolder != null ? destFolder[1] : "./";


	var heading = [
		"/*",
		" _____________________________________________________________________________________________",
		"|                                                                                             |",
		"|                               -- YOUR PROJECTS MAPPING HERE --                              |",
		"|_____________________________________________________________________________________________|",
		"*/\n"
	];
	(M.fssync).write(filepath, "", 'utf8');
	gulp.src(filepath)
		.pipe((M.insert).append(JSON.stringify(obj, null, 4)))
		.pipe((M.insert).append(';'))
		.pipe((M.insert).prepend('module.exports = '))
		.pipe((M.insert).prepend(heading.join('\n')))
		.pipe(gulp.dest(destFolder));
}