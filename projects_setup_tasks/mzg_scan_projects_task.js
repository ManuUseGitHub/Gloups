gulp.task('scanProjects', function() {
    logTaskPurpose(this.currentTask.name);
    setConfig();
    config.projects.forEach(function(project) {
        if (!fssync.exists(project.path + '\\config.mzg.ini')) {
            console.log("file :" + logFilePath(project.path + '\\config.mzg.ini') + ' does not exist ... creation very soon')
            gulp.src('custom/config_model.ini')
                .pipe(rename('config.mzg.ini'))
                .pipe(gulp.dest(project.path));
        }
    })
});