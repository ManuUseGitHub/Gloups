/**************************************************************************************************
 *             STARTER TASKS : Task used to setup a custom configuration project side
 *************************************************************************************************/

gulp.task('setVars', function() {
    setConfig();
    if(!config.verbose){
        logTaskPurpose(this.currentTask.name);
    }
    for (p_path in config.projects) {
        var project = config.projects[p_path];
        if (fssync.exists(project.path + '\\config.mzg.ini')) {
            console.log(chalk.green(project.project) + ' - OK');
            if (project.checked == '*') {
                setUpProjectWatchingPaths(project.path);
            }
        } else {
            logProjectErrored(project);
        }
    }
    if(!config.verbose){
        console.log("\n[" + chalk.gray(dateComputed()) + "] CONFIGURATON PROCEEDED\n");
    }
    
});

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

gulp.task('serviceMapping', function() {
    logTaskPurpose(this.currentTask.name);
    config.verbose = true;
    gulp.start(['setVars']);
});