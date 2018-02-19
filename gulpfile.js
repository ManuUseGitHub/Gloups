/**************************************************************************************************
 *                               VARIABLES : module requirement
 *************************************************************************************************/

var argv = require('yargs').argv;

//https://www.npmjs.com/package/chalk
var chalk = require('chalk');

var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var del = require('del');

// check file existance
var fs = require("fs");
var fssync = require("fs-sync");

var glob = require("glob");
var gulp = require('gulp');

// logging
var gutil = require('gulp-util');

// error solved : http://kuebiko.blogspot.be/2016/01/gulp-jshint200-requires-peer-of.html
var jshint = require('gulp-jshint');

var jsValidate = require('gulp-jsvalidate');
var less = require('gulp-less');

// for alternate manipulations where no operations is needed
var nop = require('gulp-nop');

var path = require('path');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var wait = require('gulp-wait');

/**************************************************************************************************
 *                               VARIABLES : Configuration variables
 *************************************************************************************************/

var mzgFiles = [
	'supports/mzg_vars.js',
	
	'mzg_gulpfile.js',
	'tasks/mzg_starter_tasks.js',
	'tasks/mzg_js_oriented_tasks.js',
	'tasks/mzg_css_oriented_tasks.js',
	'tasks/mzg_other_oriented_tasks.js',
	
	// supports
	'supports/mzg_core_rewriting.js',
	'supports/mzg_user_output.js',
	'supports/mzg_runtask.js',
	
	// functions
	'supports/mzg_utils.js',
	'supports/mzg_logging.js',

	// mzg classes 
	'supports/mzg_classes.js'
];

var config = getConfig();
/**************************************************************************************************
 *                                PARAMETERIZING and DEFAULT TASK
 *************************************************************************************************/

// define the default task and add the watch task to it
gulp.task('default', ["setParams"]);

gulp.task('setParams', function() {

    var firstTaskName = this.seq.slice(-1)[0];

    // the fisrt task met is defalut : gulp (...)
    if (/^default$/.test(firstTaskName)) {
        var tasks = tasksToRunOnArgvs();

        gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

    // the fisrt task met is rewrite
    } else if (/^rewrite$/.test(firstTaskName)) {
        var services        = configurationOfRewriteOnArvs();
        var stayBeautiful   = !/^ugly$/.test(services.uglyness);
        var watchOnce       = !/^multiple$/.test(services.times);

        logTaskName(
            (stayBeautiful ? "imBeauty" : "imUgly") +
            (watchOnce     ? "AtOnce"   : "imBeauty")
        );
        mergingOnChanges(stayBeautiful, watchOnce);
        (stayBeautiful ? logTaskEndBeauy : logTaskEndUgly)(watchOnce);
    }
});
/**************************************************************************************************
 *             STARTER TASKS : Task used to setup a custom configuration project side
 *************************************************************************************************/

gulp.task('setVars', function() {
    setConfig();
    if(!config.verbose){
        logTaskPurpose(this.currentTask.name);
    }
    for (p_path in config.projects) {
        var project = config.projects[p_path];
        if (fssync.exists(project.path + '\\config.mzg.ini')) {
            console.log(chalk.green(project.project) + ' - OK');
            if (project.checked == '*') {
                setUpProjectWatchingPaths(project.path);
            }
        } else {
            logProjectErrored(project);
        }
    }
    if(!config.verbose){
        console.log("\n[" + chalk.gray(dateComputed()) + "] CONFIGURATON PROCEEDED\n");
    }
    
});

gulp.task('scanProjects', function() {
    logTaskPurpose(this.currentTask.name);
    setConfig();
    config.projects.forEach(function(project) {
        if (!fssync.exists(project.path + '\\config.mzg.ini')) {
            console.log("file :" + logFilePath(project.path + '\\config.mzg.ini') + ' does not exist ... creation very soon')
            gulp.src('custom/config_model.ini')
                .pipe(rename('config.mzg.ini'))
                .pipe(gulp.dest(project.path));
        }
    })
});

gulp.task('serviceMapping', function() {
    logTaskPurpose(this.currentTask.name);
    config.verbose = true;
    gulp.start(['setVars']);
});
/**************************************************************************************************
 *                                      JS ORIENTED TASKS
 *************************************************************************************************/

var jsRegexFilePathPattern = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

// configure which files to watch and what tasks to use on file changes
gulp.task('automin', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToJs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        var regex = new RegExp(jsRegexFilePathPattern, "g");
        var match = regex.exec(event.path);

        // process compression of js files
        var process = function() {

            // the file that fired the event change is a .min.js file
            if (!/.*.min.js$/.test(event.path) && match) {
                gulp.src(event.path)
                    .pipe(uglify())
                    .pipe(rename({
                        suffix: '.min'
                    }))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToJs);

                        gutil.log("Compressed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                        return dest;
                    }));
            }
        }

        // call with logging of the time taken by the task
        if ((match[5] + match[6]) === ".min.js" && event.type === "added") {
            logProcessCompleteOnFile(match[2], 'created', process);
        } else if (event.type !== "deleted") {
            logProcessCompleteOnFile(match[2], 'compressed', process);
        }


    }, jshint);
});

gulp.task('autodel', function(event) {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToJs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        var regex = new RegExp(jsRegexFilePathPattern, "g");
        var match = regex.exec(event.path);

        if (event.type === "deleted" && match) {

            // process compression of js files
            var process = function() {
                var dest = getDestOfMatching(event.path, config.pathesToJs);

                // select in all case file.min.js destination file
                var destFileName = (dest + '/' + match[2]).replace(/.min.js$/g, ".js");
                var destMinFileName = destFileName.replace(/.js$/g, ".min.js");

                // delete the compressed file (.min.js file) if the base file (.js) does not exist
                fs.stat(destMinFileName, function(error, stat) {
                    if (!error)
                        del(destMinFileName, {
                            force: true
                        });
                    gutil.log("source folder here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                });
            }

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(match[2].replace(/.js$/g, ".min.js"), 'deleted', process);

        }
    }, jshint);
});

// merge all js script into one big js uglyfied
gulp.task('mergeAllMinified', function() {
    gulp.watch(config.pathesToJs, function() {
        //gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
        gulp.src(config.pathesToJs + "/scirpt/*.min.js")
            .pipe(concat('js_stack.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('../uglified'));
    });
});

/******************************************* Typescript *******************************************/
gulp.task('typescript', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToTs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        gulp.src(event.path)
            .pipe(ts({
                noImplicitAny: true,
                outFile: event.path + ".js"
            }))

            .pipe(gulp.dest(function(file) {
                var dest = getDestOfMatching(file.path, config.pathesToTs);
                gutil.log("Compressed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                return dest;
            }));
    })
});
/**************************************************************************************************
 *                                      CSS ORIENTED TASKS
 *************************************************************************************************/
gulp.task('autominCss', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyle);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (!/^(.*.min.css|.*.less)$/.test(event.path)) {
            if (/^.*.css$/.test(event.path)) {
                // process compilation of less files
                var process = function() {
                    gulp.src(event.path)
                        .pipe(cleanCSS({
                            compatibility: 'ie8'
                        })).pipe(rename({
                            suffix: '.min'
                        }))
                        .pipe(gulp.dest(function(file) {
                            var dest = getDestOfMatching(file.path, config.pathesToStyle);

                            gutil.log("Compressed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                            return dest;
                        }));
                }

                // call with logging of the time taken by the task
                logProcessCompleteOnFile(event.path, 'compiled', process);
            }
        }
    });
});

gulp.task('autoformatCss', function() {
    gulp.watch(config.pathesToStyleLess, function(event) {
        if (!/^(.*.min.css)$/.test(event.path)) {
            console.log("try");
            gulp.src(event.path)
                .pipe(cssbeautify({
                    format: 'beautify',
                }))
                .pipe(gulp.dest(function(file) {
                    return file.base;
                }));
            console.log("done");
        }
    });
});

gulp.task('less', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyleLess);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.less$/.test(event.path)) {

            // process compilation of less files
            var process = function() {
                gulp.src(event.path)
                    .pipe(less({
                        paths: [path.join(__dirname, 'less', 'includes')]
                    }))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToStyleLess);

                        gutil.log("Processed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                        return dest;
                    }));
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(event.path, 'compiled', process);
        }
    });
});

gulp.task('sass', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToSass);

    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.scss$/.test(event.path)) {

            // process compilation of less files
            var process = function() {

                gulp.src(event.path)
                    //.pipe(sass.sync().on('error', sass.logError))// synchronously
                    .pipe(sass().on('error', sass.logError))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToSass);

                        gutil.log("Processed file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                        return dest;
                    }));
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile(event.path, 'compiled', process);
        }
    });
});
/**************************************************************************************************
 *                                     OTHER ORIENTED TASKS
 *************************************************************************************************/

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
/**************************************************************************************************
 *                  USER OUTPUT : Tasks that helps to communinicate with the user
 *************************************************************************************************/

gulp.task('jshint', function() {
    return gulp.src(config.pathesToJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('helpMe', function() {
    logHelp();
});

/**************************************************************************************************
 *                    RUNTASK : Tasks utilities that have to stay in gulpfile.js
 *************************************************************************************************/

gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
    this.currentTask = task;
    this.__runTask(task);
}
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
/**************************************************************************************************
 *                           CLASSES : Classes for configuration purpose
 *************************************************************************************************/

function classReading() {
    this.line;
    this.data;
    this.iter;
    this.stopped = false;
    this.initialize = function (data, iter) {
        this.data = data;
        this.iter = iter; 
        this.line = [];
    };

    this.readLines = function (processingLine){
        var c;
        while ( (!this.isStopped()) && (c = this.getNextChar())) {
            
            // the line feed is encontoured 
            if (/^[\r\n]$/g.test(c) || this.isEndReached()) {
                this.toLine();
                processingLine(this.getLine());
                this.resetLine();
            }

            // just add the character
            else {
                this.feed(c);
            }
        }
    }

    this.stop = function () {
        this.stopped = true;
    }
    this.isStopped = function () {
        return this.stopped;
    }

    this.setIter = function (iter) {
        this.iter = iter;
    }
    this.setData = function (data) {
        this.data = data;
    }

    this.toLine = function() {
        this.line = this.line.join("").replace('\r', '').replace('\n', '');
    }
    this.resetLine = function () {
        this.line = [];
    }

    this.getIter = function () {
        return this.iter;
    }
    this.getData = function (){
        return this.data;
    }
    this.getLine = function () {
        return this.line;
    }

    this.getNextChar = function(){
        return this.data[this.iter++];
    }
    this.isEndReached = function () {
        return !this.data[this.iter];
    }

    this.feed = function (char) {
        this.line.push(char);
    }
}