/**************************************************************************************************
 *                      LOGGING : helps logging informations to the enduser
 *************************************************************************************************/
function breath() {
    return '           ';
}

function logFilePath(filePath) {
    return "'" + chalk.cyan(filePath) + "'";
}

function logHelp() {
    console.log(fs.readFileSync("help.md", "utf8"));
}

function logErrorsOnTaskArgvs(errors) {
    if (errors.length > 0) {
        console.log(chalk.red(errors.join('\n')));
        console.log("WARNING \n\nYou may have made mistakes in shoosing wrong options");
        console.log("call the folowing command to have more info of what options are valid");
        console.log("gulp --help");
    }
}

function logProjectErrored(project) {
    console.log(chalk.red(project.project) + ' - SOMETING IS WRONG');
    console.log(breath() + "this project seems to have no configuration .INI file defined");
    console.log(breath() + logFilePath(project.path + '\\config.mzg.ini') + chalk.red(' : MISSING'));
    console.log('\n' + breath() + 'SOLUTION:');
    console.log(breath() + 'run the command to setup projects local configuraitons:');
    console.log(breath() + '> ' + chalk.grey('$ gulp scanProjects'));
}

function logProcessCompleteOnFile(file, realAction, process) {
    try {
        // run the process treatment
        var dStart = new Date();
        process();

        // logging the time elapsed
        var dResult = ms2Time(new Date() - dStart);
        console.log();
        gutil.log("'" + chalk.cyan(file) + "' " + realAction + " after" + chalk.magenta(dResult));

    } catch (err) {

        //logging eventual errors
        console.log(chalk.red(err));
    }
}

function ms2Time(ms) {
    //https://stackoverflow.com/questions/1210701/compute-elapsed-time#16344621
    var secs, minutes, hours;

    hours =
        Math.floor((minutes = Math.floor((secs = Math.floor(((ms = Math.floor(ms % 1000)) / 1000) % 60)) % 60)) % 24);

    return [(hours ? hours + "h " : ""), (minutes ? minutes + "min " : ""), (secs ? secs + "sec " : ""), ms, "ms"].join("");
}

function dateComputed() {
    var date = new Date();

    var days = ["Mon", "Tues", "Wednes", "Thirth", "Fri", "Satur", "Sun"];
    return [days[date.getDay() - 1], "day,", [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("-")].join("");
}

function timeComputed() {
    var date = new Date();

    return [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
}

function logTaskPurpose(taskName) {
    logTaskName(taskName);
    switch (taskName) {
        case "setVars":
            console.log("  Sets configuration variables")
            console.log('  See the .INI file of project mapping to set MazeGulp ready to serve your projects here :');
            console.log('  > ' + logFilePath('custom/config.mzg.ini') + ':\n');
            break;
        case "automin":
            console.log("  Will uglify .js files matching the folowing path(s):\n");
            logWatchList(config.pathesToJs);
            break;
        case "autodel":
            console.log(
                "  Delete " + logFilePath(".min.js orphan files") + " when " + logFilePath(".js files model") + " are deleted\n"
            );
            break;
        case "typescript":
            console.log("  Will compile .ts files matching the folowing path(s):\n");
            logWatchList(config.pathesToTs);
            break;
        case "autominCss":
            console.log("  Will compress .css files matching the folowing path(s):\n");
            logWatchList(config.pathesToStyle);
            break;
        case "less":
            console.log("  Will compile .less files matching the folowing path(s):\n");
            logWatchList(config.pathesToStyleLess);
            break;
        case "sass":
            console.log("  Will compile .sass files matching the folowing path(s):\n");
            logWatchList(config.pathesToSass);
            break;
        case "scanProjects":
            console.log("  Creates .INI configuration files in your project root folder need to make MazeGulp able to serve\n");
            break;
        default:
            console.log("  Task unknown: " + taskName + "\n");
    }
};

function logWatchList(configTab) {
    var wl = watchList(configTab);
    wl.forEach(function(t) {
        console.log("    '" + chalk.cyan(t) + "'");
    });
    console.log();
}

function logTaskName(taskName) {
    console.log(".............................................................")
    console.log("[Task] " + chalk.red(taskName) + ":");
}

function logTaskEndUgly(one_time) {
    console.log("      > which is uglyfied " + chalk.red("for performances"));
    if (one_time) {
        console.log("  once: " + chalk.red("not watching specific files") + "\n");
    } else {
        console.log();
    }
}

function logTaskEndBeauy(one_time) {
    console.log("      > which is beautifull " + chalk.red("for debugging") + "\n");
    if (one_time) {
        console.log("  once: " + chalk.red("not watching specific files") + "\n");
    } else {
        console.log();
    }
}