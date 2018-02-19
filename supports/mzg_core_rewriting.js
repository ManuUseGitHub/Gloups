/**************************************************************************************************
 *                             CORE REWRITING : Tasks Changing gulpfile.js
 *************************************************************************************************/

gulp.task('rewrite', ['setParams', 'applyTemp']);

var bySetup = true; // messages will be displayed base on event fired by files.
var stayBeautiful = true;
var modifiedMZGEvent = null;

var merging = function(event) {
    if (event) {
        modifiedMZGEvent = event;
    }
    var dStart = new Date();

    // when the task is run there no fired event on a file ... this won't be displayed
    if (!bySetup) {
        console.log();
        gutil.log("CHANGING '" + chalk.cyan("gulpfile.js") + "'...");
        console.log("FIRED BY '" + chalk.cyan(event.path) + "'...\n");
    }

    bySetup = false;
    gulp.start('writeTemp');
}

var mergingOnChanges = function(beautifully, one_time) {

    console.log("  fuses:\n" +
        "    '" + chalk.cyan("mzg_gulpfile.js") + "'\t: tasks\n" +
        "    '" + chalk.cyan("mzg_utils.js") + "'\t: utilities\n" +
        "    '" + chalk.cyan("mzg_classes.js") + "'\t: classes\n\n" +
        "  into:\n" +
        "    '" + chalk.cyan("gulpfile.js") + "'\t: the file used by gulp");

    if (!one_time) {
        // event handler on these 3 files. Gulp will merge them into gulpfile.js
        gulp.watch(mzgFiles, function(event) {
            merging(event);
        });
    } else {
        stayBeautiful = beautifully;
        merging();
    }
}

function getGulpfolderFromFileBase(file) {
    var gulpfolder = /^(.*[\/\\]gulp)[\/\\].*/.exec(file.base)[1]
    return gulpfolder;
}

gulp.task('writeTemp', function() {
    var dStart = new Date();

    if (gulp.src(mzgFiles).pipe(jsValidate())) {
        gulp.src(mzgFiles)
            .pipe(concat('gulpfile_temp.js'))
            .pipe((stayBeautiful ? nop : uglify)())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                gutil.log(chalk.cyan("gulpfile_temp.js") + "' writen after " + chalk.magenta(dResult));
            
                return getGulpfolderFromFileBase(file);
            }));
    }
});

gulp.task('applyTemp', function() {
    gulp.watch('gulpfile_temp.js', function(event) {
        process(event);
    })

    var process = function(event) {
        if (gulp.src('gulpfile_temp.js').pipe(jsValidate())) {
            gutil.log(chalk.cyan("gulpfile.js") + "' is " + chalk.green('validate'));
            var dStart = new Date();

            gulp.src('gulpfile_temp.js')
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {

                    var dResult = ms2Time(new Date() - dStart);
                    gutil.log(chalk.cyan("gulpfile.js") + "' replaced after " + chalk.magenta(dResult));

                    //gulp folder
                    return getGulpfolderFromFileBase(file);
                }));
        }
    }
});