gulp.task('scanProjects', function() {
    logTaskPurpose(this.currentTask.name);
    setConfig();
    config.projects.forEach(function(project) {
        if (!M.fssync.exists(project.path + '\\config.mzg.json')) {
            console.log("file :" + logFilePath(project.path + '\\config.mzg.json') + ' does not exist ... creation very soon');
            gulp.src('custom/config_model.json')
                .pipe((M.rename)('config.mzg.json'))
                .pipe(gulp.dest(project.path));
        }
    });
});