function breath() {
    return '           ';
}

function logFilePath(filePath) {
    return "'" + chalk.cyan(filePath) + "'";
}

function logHelp() {
    var _data = fs.readFileSync("help.md", "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);
    var match, line;


    var cpt = 0;

    console.log("\n\n");
    reading.readLines(function() {
        line = reading.getLine().replace(/\r?\n|\r/g, '');
        if (match = /^([\s]*[#]+.*)$/.exec(line)) {
            console.log(chalk.cyan(match[1]));
        } else if (match = /^([\s]*)([$](?:[\s][^\s]+)+)([\s]{2,}.*|.*)$/.exec(line)) {
            console.log(chalk.grey(match[1]) + match[2] + chalk.green(match[3]));
        } else if (match = /^([\s]*[>].*)$/.exec(line)) {
            console.log(chalk.green(match[1]));
            // [WHITESPACE][OPTION],[TEXT],[OPTION2][TEXT][EXT][TEXT][EXT][TEXT] ...
        } else if (match = /^([\s]*)([\-]+[^\s,]+)([^\-.]*)((?:[\s][\-]+[^\s]+)+)([^\-.]*)((?:[.][^.\s]+)+|)([^\-.]*)((?:[.][^.\s]+)+|)(.*)$/.exec(line)) {
            console.log(chalk.grey(match[1]) + match[2] + chalk.grey(match[3]) + match[4] + chalk.grey(match[5]) + chalk.magenta(match[6]) + chalk.grey(match[7]) + chalk.magenta(match[8]) + chalk.grey(match[9]));
        } else if (match = /^([^\-]*)((?:[\-]+[^\s]+[\s]?)+)([\s]?.*)$/.exec(line)) {
            console.log(chalk.grey(match[1]) + match[2] + chalk.grey(match[3]));
        } else if (line.length > 0) {
            console.log(chalk.grey(line));
        } else if (++cpt % 3 == 2) {
            console.log(line);
        }
        if (line.length > 0) {
            cpt = 0;
        }
    });
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
        gutil.log(logFilePath(file) + " " + realAction + " after" + chalk.magenta(dResult));

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

function logServiceActivatedPushed(purpose, project, addon) {
    if (config.verbose) {
        var match;

        if (match = /^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose)) {
            console.log(chalk.grey(match[1]) + chalk.magenta(match[2]) + chalk.grey(match[3]) + chalk.magenta(match[4]) + chalk.grey(match[5]));
        } else if (match = /^([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose)) {
            console.log(chalk.grey(match[1]) + chalk.magenta(match[2]) + chalk.grey(match[3]));
        }

        console.log(
            "Watch :" + logFilePath('[..]/' + addon.watch) + " - " +
            "Dest. :" + logFilePath('[..]/' + addon.dest)
        );

        var sourcemaps = addon.sourcemaps;
        if (sourcemaps !== undefined) {
            console.log(sourcemaps ? chalk.green("Sourcemaps !") : chalk.grey("no sourcemaps"));
        }
    }
}

function logTaskPurpose(taskName) {
    logTaskName(taskName);
    var tasks = {
        "setVars": "" +
            "  Sets configuration variables \n" +
            '  See the .INI file of project mapping to set Gloups ready to serve your projects here :\n' +
            '  > ' + logFilePath('custom/config.mzg.ini') + ':\n',
        "automin": "" +
            "  Will uglify .js files matching the folowing path(s):\n",
        "autodel": "" +
            "  Delete " + logFilePath(".min.js orphan files") + " when " + logFilePath(".js files model") + " are deleted\n",
        "typescript": "" +
            "  Will compile .ts files matching the folowing path(s):\n",
        "coffeescript": "" +
            "  Will compile .coffee files matching the folowing path(s):\n",
        "autominCss": "" +
            "  Will compress .css files matching the folowing path(s):\n",
        "less": "" +
            "  Will compile .less files matching the folowing path(s):\n",
        "sass": "" +
            "  Will compile .sass files matching the folowing path(s):\n",
        "scanProjects": "" +
            "  Creates configuration file in every project root folder\n"
    };


    if (tasks[taskName]) {
        console.log(tasks[taskName]);
        logWatchList(taskName)
    } else {
        console.log(chalk.yellow("  no information provided \n"));
    }
};

function logWatchList(taskName) {

    var associations = {
        "automin": config.pathesToJs,
        "typescript": config.pathesToTs,
        "coffeescript": config.pathesToCoffee,
        "autominCss": config.pathesToStyle,
        "less": config.pathesToStyleLess,
        "sass": config.pathesToSass
    };

    if (associations[taskName]) {
        var wl = watchList(associations[taskName]);
        wl.forEach(function(t) {
            console.log("    " + logFilePath(t));
        });
        console.log();
    }
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