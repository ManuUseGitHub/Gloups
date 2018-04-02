gulp.task('setVars', function() {
    setConfig();
    if (!config.verbose) {
        logTaskPurpose(this.currentTask.name);
    }
    for (var p_path in config.projects) {
        var project = config.projects[p_path];
        if (fssync.exists(project.path + '\\config.mzg.json')) {
            console.log("{0} - OK".format([chalk.green(project.project)]));
            if (project.checked) {
                setUpProjectWatchingPaths(project.path);
            }
        } else {
            logProjectErrored(project);
        }
    }

    // configuration for SASS watched paths ---------------------------
    for (p_path in config.pathesToSass) {
        var watchPathForSass = config.pathesToSass[p_path].watch;
        var projectPath = config.pathesToSass[p_path].projectPath;
        mappSassMatching(projectPath,watchPathForSass);
    }

    // gulp.task("externalizeConfig") is never undefined
    // so check if a NOT_DISTRIBUTION key is found or not
    if (isdist.NOT_DISTRIBUTION) { 
        if (!config.verbose){
            console.log(forNowLongLog("{0}\n", ["config externalized under config.json"]));
        }
            
        gulp.start("externalizeConfig");
    }

    if (!config.verbose) {
        console.log(forNowLongLog("{0}\n", ["config externalized under config.json"]));
        console.log(forNowLongLog("{0}\n", ["CONFIGURATON PROCEEDED"]));
    }
});