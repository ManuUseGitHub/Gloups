var coffee = require('gulp-coffee');

gulp.task('coffeescript', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToCoffee);

    // passing the watch list
    gulp.watch(wl, function(event) {
        
        var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToCoffee);
        var sourcemapping = matchingEntry.sourcemaps;

        gulp.src(event.path)
            .pipe(sourcemapInit(sourcemapping))
            
            .pipe(serveCoffee())
            .pipe(insertSignatureAfter("Served coffee", "gulp-coffee"))
            
            .pipe(sourcemapWrite(sourcemapping))
            .pipe(gulp.dest(matchingEntry.dest));

        gutil.log("Compiled file version updated/created here :\n" + breath() + "> " + logFilePath(matchingEntry.dest));
    })
});