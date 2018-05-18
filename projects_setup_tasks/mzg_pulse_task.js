gulp.task('pulse', function() {
	
	process.title = 'Gloups {0} | {1}'.format([GLOUPS_VERSION, 'Pulse !']);
	var tasks = tasksToRunOnArgvs();

	// modules are loaded automaticaly in production mode
	if (isdist.NOT_DISTRIBUTION) {

		// cannot syntaxicaly analyse following line (after this) so 
		// it has to define what services tasks is needed
		getAllNeededModules(tasks.concat(['setVars','pulse']));
	}
	
	setConfig();
	
	gulp.start('clear');

	// start every services matching arguments
	gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

	coverFoldersToServe({
		'scope': '*',
		'shouldLog': false
	});

	var folders = getAllServiceCoverageWatchFolders();
	var fileNames = getEveryFilesCoveredOnce(folders);

	gloupslog('Applying services ... please wait');
	console.log(' ' + chalk.bgYellow(' ! ') + ' Long process ... few secondes required');

	// the pulse will fire a change event on every file.
	// every services will respond to it one another
	fireEnventOnEveryCoveredFiles(fileNames);
});