function breath() {
    return '           ';
}

function logFilePath(filePath) {
    return "'{0}'".format([chalk.cyan(filePath)]);
}

/**
 * @function
 * opens a tream on the help.md file and read all lines to the end. It will outpout the content
 * formated with colors to make more sens to the commun user.
 */
function logHelp() {
    var _data = fs.readFileSync("help.md", "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);
    var match, line;

    var cpt = 0;

    console.log("\n\n");
    reading.readLines(function() {
        line = reading.getLine().replace(/\r?\n|\r/g, '');

        // reading the help.md file [MARKDOWN]
        // Titles are cyan
        if ((match = /^([\s]*[#]+.*)$/.exec(line))) {
            console.log(chalk.cyan(match[1]));

            // commands explanations see $ gulp helpMe +[void]+ effects ...
        } else if ((match = /^([\s]*)([$](?:[\s][^\s]+)+)([\s]{2,}.*|.*)$/.exec(line))) {
            console.log("{0}{1}{2}".format([chalk.grey(match[1]), match[2], chalk.green(match[3])]));

            // Commentq are green
        } else if ((match = /^([\s]*[>].*)$/.exec(line))) {
            console.log(chalk.green(match[1]));

            // Alternation between extensions (magenta) and regular text (grey) ... (2 extensions)
        } else if ((match = /^([\s]*)([\-]+[^\s,]+)([^\-.]*)((?:[\s][\-]+[^\s]+)+)([^\-.]*)((?:[.][^.\s]+)+|)([^\-.]*)((?:[.][^.\s]+)+|)(.*)$/.exec(line))) {
            console.log("{0}{1}{2}{3}{4}{5}{6}{7}{8}".format([chalk.grey(match[1]), match[2], chalk.grey(match[3]), match[4], chalk.grey(match[5]), chalk.magenta(match[6]), chalk.grey(match[7]), chalk.magenta(match[8]), chalk.grey(match[9])]));

            // Alternation between extensions (magenta) and regular text (grey) ... (1 extension)
        } else if ((match = /^([^\-]*)((?:[\-]+[^\s]+[\s]?)+)([\s]?.*)$/.exec(line))) {
            console.log("{0}{1}{2}".format([chalk.grey(match[1]), match[2], chalk.grey(match[3])]));

            // Reguar text are grey
        } else if (line.length > 0) {
            console.log(chalk.grey(line));

            // when two wite line are count, the dev wanted to put a real line feed
        } else if (++cpt % 3 == 2) {
            console.log(line);
        }

        /* Each time a line is not blank (no length), count it as a real line because the reading 
        process reeds line feeds as a lines which is not excpected*/
        if (line.length > 0) {
            cpt = 0;
        }
    });
}

/**
 * @deprecated not realy used right now
 * 
 * @function
 * Logs the error list obtained from the parameter in red
 * 
 * @param  {array[String]}
 */
function logErrorsOnTaskArgvs(errors) {
    if (errors.length > 0) {
        console.log("{0}\n{1}\n{2}\n{3}".format(chalk.red(errors.join('\n'))), [
            "WARNING \n\nYou may have made mistakes in shoosing wrong options.",
            "call the folowing command to have more info of what options are valid",
            "gulp --help"
        ]);
    }
}

function logProjectErrored(project) {
    console.log(
        "{0}  - SOMETING IS WRONG\n    {1}\n    {2} {3}\n{4}\n{5}\n    > {6}".format([
            chalk.red(project.project),
            'this project seems to have no configuration .INI file defined',
            logFilePath(project.path + '\\config.mzg.ini'), chalk.red(': MISSING'),
            'SOLUTION:',
            'run the command to setup projects local configuraitons:',
            chalk.grey('$ gulp scanProjects')
        ]));
}

function logProcessCompleteOnFile(files, realAction, process) {
    try {
        // run the process treatment
        var dStart = new Date();
        process();

        // logging the time elapsed
        var dResult = ms2Time(new Date() - dStart);
        console.log();
        
        if(files.length > 1){
            console.log(forNowShortLog("{0} of these files:\n".format([realAction])));
                files.forEach( function(file) {
                    console.log(logFilePath(file));
                });
            console.log();
            console.log(forNowShortLog("after {0}".format([chalk.magenta(dResult)])));
        }else{
            console.log(forNowShortLog("{0} {1} after {2}".format([logFilePath(files), realAction, chalk.magenta(dResult)])));    
        }
        
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

function forNowLongLog(fmt, messageComponents) {
    return "[{0}] {1}".format([chalk.gray(dateComputed()), fmt.format(messageComponents)]);
}

function forNowShortLog(fmt, messageComponents) {
    var transformed = fmt.format(messageComponents);
    return "[{0}] {1}".format([chalk.gray(timeComputed()), transformed]);
}

function logServiceActivatedPushed(purpose, project, addon) {
    if (config.verbose) {
        var match;

        if ((match = /^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose))) {
            console.log("{0}{1}{2}{3}{4}".format([chalk.grey(match[1]), chalk.magenta(match[2]), chalk.grey(match[3]), chalk.magenta(match[4]), chalk.grey(match[5])]));

        } else if ((match = /^([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose))) {
            console.log("{0}{1}{2}".format([chalk.grey(match[1]), chalk.magenta(match[2]), chalk.grey(match[3])]));
        }

        console.log("Watch :{0} - Dest. :{1}".format([logFilePath('[..]/' + addon.watch), logFilePath('[..]/' + addon.dest)]));

        var sourcemaps = addon.sourcemaps;
        if (sourcemaps !== undefined) {
            console.log(sourcemaps ? chalk.green("Sourcemaps !") : chalk.grey("no sourcemaps"));
        }
    }
}

/**
 * @function
 * Log what the task is designed for. to get the task name refere to RUNTASK section.
 * However the taskName can be obtained via "this.curentTask". After the name is got, 
 * this function will check a dictionnary and provide definitions regarding the key 
 * wich is te name obtained.
 * 
 * @see gulp.Gulp.prototype.__runTask ~ supports/mzg_runtask.js
 * @param  {string}
 */
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
        logWatchList(taskName);
    } else {
        console.log(chalk.yellow("  no information provided \n"));
    }
}

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
    console.log(".............................................................");
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