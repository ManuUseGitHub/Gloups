gulp.task('setParams', function() {

	var firstTaskName = this.seq.slice(-1)[0];
	var tasks;

	// the fisrt task met is defalut : gulp (...)
	if (/^default$/.test(firstTaskName)) {
		tasks = tasksToRunOnArgvs();
		gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

	} else if (/^serve$/.test(firstTaskName)) {
		process.title = 'Gloups {0} | {1}'.format([GLOUPS_VERSION, 'Serve']);
		tasks = tasksToRunOnArgvs();

		if (isdist.NOT_DISTRIBUTION) {
			getAllNeededModules(tasks.concat(['setVars']));
		}

		gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

		// the fisrt task met is rewrite
	} else if (/^rewrite$/.test(firstTaskName)) {
		process.title = 'Gloups {0} | {1}'.format([GLOUPS_VERSION, 'Rewrite']);
		var _services = configurationOfRewriteOnArvs();
		var stayBeautiful = !/^ugly$/.test(_services.uglyness);
		var watchOnce = !/^multiple$/.test(_services.times);

		if (isdist.NOT_DISTRIBUTION) {
			getAllNeededModules(['rewrite', 'writeTemp', 'writeDist', 'applyTemp', 'applyDist']);
		}
		//getModule(M.nop);

		logTaskName("rewrite {0}-{1} mode".format([
				(stayBeautiful ? "imBeauty" : "imUgly"),
				(watchOnce ? "one shot" : "watching")
			])
		);
		mergingOnChanges(stayBeautiful, watchOnce);
		(stayBeautiful ? logTaskEndBeauty : logTaskEndUgly)(watchOnce);
	}
});