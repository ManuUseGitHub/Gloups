var merging = function(event) {
    (M.clear)();
    
    if (event) {
        modifiedMZGEvent = event;
    }
    var dStart = new Date();

    // when the task is run there no fired event on a file ... this won't be displayed
    if (!bySetup) {
        console.log();
        console.log(forNowShortLog("CHANGING {0} ...", [logFilePath("gulpfile.js")]));
        console.log("FIRED BY {0} ...\n".format([logFilePath(event.path)]));
    }

    bySetup = false;
    gulp.start(['writeTemp', 'writeDist']);
};

var mergingOnChanges = function(beautifully, one_time) {

    console.log("  concats these files:");
    mzgFiles.forEach(function(item, index) {
        console.log("    " + "(" + index + ")" + logFilePath(item));
    });

    console.log("to make this file:\n{0} - the file used by gulp".format([logFilePath("gulpfile.js")]));

    if (!one_time) {
        // event handler on these files. Gulp will merge them into gulpfile.js
        gulp.watch(mzgFiles, function(event) {
            merging(event);
        });
    } else {
        stayBeautiful = beautifully;
        merging();
    }
};

function getGulpfolderFromFileBase(file) {
    var gulpfolder = /^(.*[\/\\](?:gloups|gulp|dist))[\/\\].*/.exec(file.base)[1];
    return gulpfolder;
}