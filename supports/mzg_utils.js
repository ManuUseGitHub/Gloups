/**************************************************************************************************
 *                                       UTILS : Functions
 *************************************************************************************************/

function getConfig() {
    return config ? config : {
        "verbose":false,
        "pathesToJs": [],
        "pathesToTs": [],
        "pathesToStyle": [],
        "pathesToStyleLess": [],
        "pathesToWars": [],
        "pathesToSass": [],
        "projects": []
    }
}

var config = getConfig();

function setConfig() {
    var match;
    var _data = fs.readFileSync("custom/config.ini", "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);
    var key;

    var process =
        function() {
            if (match = /^(.*)=.*$/g.exec(reading.getLine())) {
                key = match[1];
            };
            if (/^Projects_paths$/.test(key) && /^\[$/g.test(reading.getLine())) {
                processConfig(reading, key);
            }
        }

    reading.readLines(process);
}

function configurationOfRewriteOnArvs() {
    var services = {

        // custom
        'uglyness': 'beauty',
        'times': 'once',
    };

    var subAr = process.argv.slice(2, process.argv.length);
    for (serv in subAr) {
        try {
            var opt = (/^--(.*)$/.exec(subAr[serv]));

            if (opt && (matchOption = opt[1])) {

                console.log(matchOption);
                if (matchOption == 'ugly') {
                    services.uglyness = matchOption;

                } else if (matchOption == 'multiple') {
                    services.times = matchOption;

                } else {
                    console.log(chalk.red("unknown option --" + matchOption));
                }
            }
        } catch (err) {
            errors.push(err + " Error with option: ");
        }
    }
    return services;
}

function tasksToRunOnArgvs() {
    var services = {

        // custom
        'wars': 'removeWarVersion',
        'del': 'autodel',
        'minjs': 'automin',
        'ts': 'typescript',
        'less': 'less',
        'sass': 'sass',
        'mincss': 'autominCss',

        // presets
        'all': 'autodel automin typescript less sass autominCss',
        'style': 'less sass autominCss',
        'js': 'autodel automin',
        'typescript': 'autodel automin typescript'
    };

    var effectiveServices = [];
    var errors = [];
    var optionCount = 0;

    var subAr = process.argv.slice(2, process.argv.length);
    for (serv in subAr) {
        try {
            var key = (/^--(.*)$/.exec(subAr[serv]));

            if (key && (matchOption = key[1])) {

                if (/^all|style|js|typescript$/.test(matchOption)) {
                    effectiveServices = services[matchOption].split(" ");
                    if (optionCount > 0) {
                        errors = [];
                        throw "GRAVE ERROR: Too much presets";
                    }
                } else if (services[matchOption]) {
                    effectiveServices.push(services[matchOption]);
                } else {
                    console.log(chalk.red("unknown option --" + matchOption));
                }

            }
        } catch (err) {
            errors.push(err + " Error with option: ");
            if (/^GRAVE ERROR.*$/.test(err)) {
                effectiveServices = [];
                break;
            }
        }
        optionCount++;
    }
    logErrorsOnTaskArgvs(errors);
    return effectiveServices;
}

function setUpProjectWatchingPaths(project_path) {
    var match;
    var _data = fs.readFileSync(project_path + '/config.mzg.ini', "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);
    var key;

    var process =
        function() {
            if (match = /^(.*)=.*$/g.exec(reading.getLine())) {
                key = match[1];
            };
            if (/^(minify_js|ts_to_js|minify_css|less|sass)$/.test(key) && /^\[$/g.test(reading.getLine())) {
                processConfigTargetProjects(project_path, reading, key);
            }
        }
    reading.readLines(process);
}

function processConfig(reading, key) {
    var pathReader = new classReading();
    pathReader.initialize(reading.getData(), reading.getIter());
    var match;

    var process = function() {
        var line = pathReader.getLine();
        if (match = /^.*\[(.*),"(.*)",(.*)\],?$/g.exec(line)) {
            if (key == "Projects_paths") {
                config.projects.push({
                    project: match[1],
                    path: match[2],
                    checked: match[3]
                });
            }
        }
        if (/^]$/g.test(pathReader.getLine())) {
            pathReader.stop();
            reading.setIter(pathReader.getIter());
        }
    };

    pathReader.readLines(process);
}

function processConfigTargetProjects(project_path, reading, key) {
    var pathReader = new classReading();
    pathReader.initialize(reading.getData(), reading.getIter());
    var match;

    var process = function() {
        var line = pathReader.getLine();
        if (match = /^.*\["(.*)","(.*)"\].*$/g.exec(line)) {
            var configDescription;
            var extSubpath;
            if (key == "minify_js") {
                configDescription = {
                    where: config.pathesToJs,
                    purpose: 'Compress .js files into .min.js files'
                }
                extSubpath = '/**/*.js'
            } else if (key == "ts_to_js") {
                configDescription = {
                    where: config.pathesToTs,
                    purpose: 'Compile .ts files into .js File'
                }
                extSubpath = '/**/*.ts';
            } else if (key == "minify_css") {
                configDescription = {
                    where: config.pathesToStyle,
                    purpose: 'Compress .css files'
                }
                extSubpath = '/**/*.css';
            } else if (key == "less") {
                configDescription = {
                    where: config.pathesToStyleLess,
                    purpose: 'Compile .less files into .css files'
                }
                extSubpath = '/**/*.less';
            } else if (key == "sass") {
                configDescription = {
                    where: config.pathesToSass,
                    purpose: 'Compile .scss files into .css files'
                }
                extSubpath = '/**/*.scss';
            } else if (key == "war") {
                configDescription = {
                    where: config.pathesToWars,
                    purpose: 'Rename .WAR files'
                }
                extSubpath = '/**/*.war';
            }
            var description = {
                project: project_path,
                pathes: match,
                subpathToExtention: extSubpath
            };
            pushNewEntryFor(description, configDescription);
        }
        if (/^]$/g.test(pathReader.getLine())) {
            pathReader.stop();
            reading.setIter(pathReader.getIter());
        }
    };

    pathReader.readLines(process);
}

function pushNewEntryFor(matchingEntryDefinition, configDescription) {
    var project = matchingEntryDefinition.project;
    var pathes = matchingEntryDefinition.pathes;
    var subpathToExtention = matchingEntryDefinition.subpathToExtention;
    var purpose = configDescription.purpose;

    configDescription.where.push({
        source: project + '\\' + pathes[1] + subpathToExtention,
        dest: project + '\\' + pathes[2]
    });

    if (config.verbose) {
        var match;

        if (match = /^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose)) {
            console.log("pushing entry for [Purpose] " + chalk.grey(match[1]) + chalk.magenta(match[2]) + chalk.grey(match[3]) + chalk.magenta(match[4]) + chalk.grey(match[5]));
        } else if (match = /^([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose)) {
            console.log("pushing entry for [Purpose] " + chalk.grey(match[1]) + chalk.magenta(match[2]) + chalk.grey(match[3]));
        }

        console.log("Watch : '" + chalk.cyan(project + '\\' + pathes[1] + subpathToExtention) + "'");
        console.log("Dest. : '" + chalk.cyan(project + '\\' + pathes[2]) + "'\n");
    }
}

function getDestOfMatching(filePath, configTab) {

    // replace '\' characters by '/' to prevent 
    // differences with the true path on windows systems
    filePath = filePath.replace(/[\\]/g, '/');

    // iterate on efery path within configTab to check 
    // what path sources fire the change event then find
    // the destination referenced via 'entry.dest'
    for (p_path in configTab) {

        var entry = configTab[p_path];
        var source = entry.source.replace(/[\\]/g, '/');
        var dest = entry.dest.replace(/[\\]/g, '/');

        var pattern = '^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$';
        var base = (new RegExp(pattern, "g").exec(source))[2];
        var matching = (new RegExp('^.*(?:' + base + ').*$', "g").exec(filePath));

        if (matching) {
            return entry.dest;
        }
    }
    return null;
}

function watchList(configTab) {
    var list = [];
    for (p_path in configTab) {
        var source = configTab[p_path].source;
        list.push(source);
    }
    return list;
}