var merging = function(event) {
    if (event) {
        modifiedMZGEvent = event;
    }
    var dStart = new Date();

    // when the task is run there no fired event on a file ... this won't be displayed
    if (!bySetup) {
        console.log();
        gutil.log("CHANGING " + logFilePath("gulpfile.js") + "...");
        console.log("FIRED BY " + logFilePath(event.path) + "...\n");
    }

    bySetup = false;
    gulp.start(['writeTemp', 'writeDist']);
}

var mergingOnChanges = function(beautifully, one_time) {

    console.log("  concats these files:")
    mzgFiles.forEach(function(item, index) {
        console.log("    " + "(" + index + ")" + logFilePath(item));
    });

    console.log(
        "  to make this file:\n" +
        "    " + logFilePath("gulpfile.js") + " - the file used by gulp");

    if (!one_time) {
        // event handler on these files. Gulp will merge them into gulpfile.js
        gulp.watch(mzgFiles, function(event) {
            merging(event);
        });
    } else {
        stayBeautiful = beautifully;
        merging();
    }
}

function getGulpfolderFromFileBase(file) {
    var gulpfolder = /^(.*[\/\\](?:Gloups|gulp))[\/\\].*/.exec(file.base)[1]
    return gulpfolder;
}