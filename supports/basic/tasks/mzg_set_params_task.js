gulp.task('setParams', function() {

    var firstTaskName = this.seq.slice(-1)[0];
    var tasks;

    // the fisrt task met is defalut : gulp (...)
    if (/^default$/.test(firstTaskName)) {
        tasks = tasksToRunOnArgvs();
        gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

    } else if (/^serve$/.test(firstTaskName)) {
        tasks = tasksToRunOnArgvs();
        gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

        // the fisrt task met is rewrite
    } else if (/^rewrite$/.test(firstTaskName)) {
        var _services = configurationOfRewriteOnArvs();
        var stayBeautiful = !/^ugly$/.test(_services.uglyness);
        var watchOnce = !/^multiple$/.test(_services.times);

        logTaskName(
            (stayBeautiful ? "imBeauty" : "imUgly") +
            (watchOnce ? "AtOnce" : "imBeauty")
        );
        mergingOnChanges(stayBeautiful, watchOnce);
        (stayBeautiful ? logTaskEndBeauy : logTaskEndUgly)(watchOnce);
    }
});