gulp.task('scanProjects', function() {
	logTaskPurpose(this.currentTask.name);
	setConfig();
	config.projects.forEach(function(project) {
		if (!M.fssync.exists(project.path + '\\config.mzg.js')) {
			console.log("creation of {0} which didn't exist".format([logFilePath(project.path+"/config.mzg.js")]));
			gulp.src('custom/config.mzg.js')
				.pipe((M.rename)('config.mzg.js'))
				.pipe(gulp.dest(project.path));
		}
	});
});