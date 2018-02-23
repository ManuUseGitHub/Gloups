gulp.task('setParams', function() {

    var firstTaskName = this.seq.slice(-1)[0];

    // the fisrt task met is defalut : gulp (...)
    if (/^default$/.test(firstTaskName)) {
        var tasks = tasksToRunOnArgvs();

        gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

    // the fisrt task met is rewrite
    } else if (/^rewrite$/.test(firstTaskName)) {
        var services        = configurationOfRewriteOnArvs();
        var stayBeautiful   = !/^ugly$/.test(services.uglyness);
        var watchOnce       = !/^multiple$/.test(services.times);

        logTaskName(
            (stayBeautiful ? "imBeauty" : "imUgly") +
            (watchOnce     ? "AtOnce"   : "imBeauty")
        );
        mergingOnChanges(stayBeautiful, watchOnce);
        (stayBeautiful ? logTaskEndBeauy : logTaskEndUgly)(watchOnce);
    }
});