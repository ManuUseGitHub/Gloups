gulp.task('pulse', function() {

	process.title = 'Gloups {0} | {1}'.format([GLOUPS_VERSION, 'Pulse !']);
	var tasks = tasksToRunOnArgvs();

	// modules are loaded automaticaly in production mode
	if (isdist.NOT_DISTRIBUTION) {

		// cannot syntaxicaly analyse following line (after this) so 
		// it has to define what services tasks is needed
		getAllNeededModules(tasks.concat(['setVars', 'pulse']));
	}

	setConfig();

	gulp.start('clear');
	// start every services matching arguments
	gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

	var folders = getAllServiceCoverageWatchFolders();
	var fileNames = getEveryFilesCoveredOnce(folders);
	if (fileNames.length > 0) {
		gloupslog('Applying services ... please wait');
		console.log(' ' + chalk.bgYellow(' ! ') + ' Long process ... few secondes required');

		// the pulse will fire a change event on every file.
		// every services will respond to it one another
		fireEnventOnEveryCoveredFiles(fileNames);
	} else {

		var currentDir = NOPE;
		if ((currentDir = getCurrentRunningDirectory()) != NOPE) {

			var foundRecord = findProjectBinding(currentDir);
			if (foundRecord) {
				//var log = logStuffedSpaceOverflowing(message,alignement,chalkColor = null);

				var warningMsg = [
					"",
					" " + chalk.bgYellow(logStuffedSpaceMessage("No services found. It may occures for different reasons.", align().center)),
					" " + chalk.bgYellow.black(logStuffedSpaceMessage(" Points :", align().left)),
					" " + chalk.bgYellow(logStuffedSpaceMessage(" (a) you did not change the config.mzg file", align().left)),
					" " + chalk.bgYellow(logStuffedSpaceMessage(" (b) you've made a mistake while writing matches into the config.mzg file", align().left)),
					" " + chalk.bgYellow(logStuffedSpaceMessage(" (c) Gloups may have a problem (unlikely but possible) ", align().left))
				];

				var msg = warningMsg.join("\n");

				gloupslog(msg);
			} else {
				var warningMsg = [
				"",
				" " + chalk.bgRed(logStuffedSpaceMessage("No services configuration found.", align().center)),
				" " + chalk.bgRed(logStuffedSpaceMessage(" set a project configuration entry by running: gloups scanHere", align().left))
				];

				var msg = warningMsg.join("\n");

				gloupslog(msg);
			}

		}
		process.exit();
	}

});