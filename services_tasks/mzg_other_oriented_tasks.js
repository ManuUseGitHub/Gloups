gulp.task('removeWarVersion', function() {
    //logTaskPurpose(this.currentTask.name);

    var process = function(event) {
        var nameWithoutVersion = "";
        gulp.src(event.path)
            .pipe(wait(1500))
            .pipe(rename(function(path) {
                nameWithoutVersion = /^(.*)(?:-[0-9]*.[0-9]*.*)$/g.exec(event.path);
                console.log(nameWithoutVersion[1]);
                return nameWithoutVersion[1] + ".war";
            }))
            .pipe(gulp.dest(function(file) {
                return file.base;
            }));
        console.log(nameWithoutVersion);
        return nameWithoutVersion;
    }

    var last = "";
    gulp.watch(config.pathesToWars, function(event) {
        //if(last != last){}
        if (/^(.*.war)$/.test(event.path)) {

            try {
                last = process(event);
                // call with logging of the time taken by the task
                logProcessCompleteOnFile("", 'renamed', function() {});
            } catch (ex) {

            }
        }
    });
});