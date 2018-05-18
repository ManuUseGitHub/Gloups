function coverFoldersToServe(confObj) {
	for (var p_path in config.projects) {
		var project = config.projects[p_path];
		if (confObj.scope == '*' || project.project == confObj.scope) {
			if ((M.fssync).exists(project.path + '\\config.mzg.json')) {
				if (project.checked) {
					if (confObj.shouldLog && !isPulseTask()) {
						console.log(' ' + chalk.bgGreen(' ' + project.project + ' '));
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

		if (M.fssync.exists(l)) {
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

		// pushes watch base folders paths 
		// MATCHING :: ^(abc/.../...)/**/*.ext$
		folders.push(FILE_COVERAGE_REGEXP.exec(e.watch)[1]);
	});

	return folders;
}