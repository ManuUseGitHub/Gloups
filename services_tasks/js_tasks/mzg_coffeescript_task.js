var coffee = require('gulp-coffee');
 
gulp.task('coffeescript', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToCoffee);

    // passing the watch list
    gulp.watch(wl, function(event) {
        gulp.src(event.path)
        	.pipe(coffee({bare: true}))
            .pipe(gulp.dest(function(file) {
                var dest = getDestOfMatching(file.path, config.pathesToCoffee);
                gutil.log("Compiled file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
                return dest;
            }));
    })
});