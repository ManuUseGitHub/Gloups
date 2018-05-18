gulp.task('setVars', function() {
    setConfig();
    if (isdist.NOT_DISTRIBUTION) {
        getModule(M.path);
    }

    if (!config.verbose && !isPulseTask()) {
        logTaskPurpose(this.currentTask.name);
    }

    coverFoldersToServe({
        'scope': '*',
        'shouldLog': true
    });

    // configuration for SASS watched paths ---------------------------
    for (var p_path in config.pathesToSass) {
        var watchPathForSass = config.pathesToSass[p_path].watch;
        var projectPath = config.pathesToSass[p_path].projectPath;
        mappSassMatching(projectPath, watchPathForSass);
    }

    // gulp.task("externalizeConfig") is never undefined
    // so check if a NOT_DISTRIBUTION key is found or not
    if (isdist.NOT_DISTRIBUTION && !isPulseTask()) {
        if (!config.verbose) {
            console.log(forNowLongLog("{0}\n", ["config externalized under config.json"]));
        }

        gulp.start("externalizeConfig");
    }

    if (!config.verbose && !isPulseTask()) {
        console.log(forNowLongLog("{0}\n", ["CONFIGURATON PROCEEDED"]));
    }
});