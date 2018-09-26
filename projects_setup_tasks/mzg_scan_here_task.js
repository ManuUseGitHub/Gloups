gulp.task('scanHere', function() {
	var currentDir;

	// if you used gloups commands, the path is given for you
	if ((currentDir = getCurrentRunningDirectory()) != NOPE) {

		logTaskPurpose(this.currentTask.name);
		setConfig();

		var foundRecord = findProjectBinding(currentDir);
		fixProjectBinding(currentDir, foundRecord);
	}
});