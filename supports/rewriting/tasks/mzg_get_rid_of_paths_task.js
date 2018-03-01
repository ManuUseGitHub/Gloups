gulp.task('getRidOfPaths', function() {
    console.log('hello');
    var cpt = 0;
    pathFiles.forEach(function(item) {
        if (fssync.exists(item)) {
            fssync.remove(item);
        } else {
            if (cpt++ < 3) {
                console.log(chalk.yellow('file \'' + item + '\' might\'ve been removed'));
            }
        }
    })
    if(cpt >0){
        console.log(chalk.yellow('WARN. : '+cpt+' file(s) could not been removed ...'));
    }
    pathFiles = [];
});