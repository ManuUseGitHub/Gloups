gulp.task('setVars', function() {
    setConfig();
    if(!config.verbose){
        logTaskPurpose(this.currentTask.name);
    }
    for (p_path in config.projects) {
        var project = config.projects[p_path];
        if (fssync.exists(project.path + '\\config.mzg.json')) {
            console.log(chalk.green(project.project) + ' - OK');
            if (project.checked) {
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