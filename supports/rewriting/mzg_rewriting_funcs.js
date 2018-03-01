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
    var gulpfolder = /^(.*[\/\\]gulp)[\/\\].*/.exec(file.base)[1]
    return gulpfolder;
}

function getRidOfFileOfPath() {
    var cpt = 0;
    pathFiles.forEach(function(item) {
        if (fssync.exists(item)) {
            fssync.remove(item);
        } else {
            if (cpt++ < 3) {
                //console.log(chalk.yellow('file \'' + item + '\' might\'ve been removed'));
            }
        }
    })
    if (cpt > 0) {
        console.log(chalk.green('OK : ' + cpt + ' file(s) could not have been removed ... they do not exist'));
    }
    pathFiles = [];
}

function insertPath(files) {
    var newpaths = [];
    files.forEach(function(item) {
        var m = /^(.*)[.].*$/.exec(item);
        var pathOfFile = m[1] + '.path.js';
        newpaths.push(pathOfFile);
        pathFiles.push(pathOfFile);
        newpaths.push(item);

        //var l = (100 - (5 + pathOfFile.length + 2 + 2));
        //l = l > 0 ? l : 0;

        if (!/^.*log_sections.*$/.test(pathOfFile)) {
            fssync.write(pathOfFile, '\n// -- [' + item + '] ' + "--"); //Array(l).join("-"));    
        }
    });

    return newpaths;
}