/*	*************************************************************************************************************************************************************************************************
	*                                 								VARIABLES :	module requirement    &    Configuration VARIABLES 																	*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/basic/mzg_modules_importation.js] --
var argv = require('yargs').argv;

//https://www.npmjs.com/package/chalk
var chalk = require('chalk');

var cleanCSS = require('gulp-clean-css');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var del = require('del');

// check file existance
var fs = require("fs");
var fssync = require("fs-sync");

var gulp = require('gulp');

// logging
var gutil = require('gulp-util');

// error solved : http://kuebiko.blogspot.be/2016/01/gulp-jshint200-requires-peer-of.html
var jshint = require('gulp-jshint');

var jsValidate = require('gulp-jsvalidate');
var less = require('gulp-less');

// for alternate manipulations where no operations is needed
var nop = require('gulp-nop');

var rename = require("gulp-rename");
var sass = require('gulp-sass');

// to write custom pipe functions
var through = require('through2');

var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var wait = require('gulp-wait');

// -- [supports/basic/mzg_vars.js] --
// Sets things up to serve
var config = getConfig();

// Mapping of arguments for serve taks. arguments have one matching. 
// An alias matches a service, as -l matches --less (less task)
// A preset is a set of arguments that works legitimately together.
// 		> style tasks such as: 
//			autominification of css files
//			autocompilation of less files to css files
//			autocompilation of scss files to css files
// Even a preset has its own alias, as -st matches --style
var services = {

	// custom
	'd': 'del',
	'del': 'autodel',
	'mj': 'minjs',
	'minjs': 'automin',
	'ts': 'typescript',
	'c': 'coffee',
	'coffee': 'coffeescript',
	'l': 'less',
	'less': 'less',
	's': 'sass',
	'sass': 'sass',
	'mc': 'mincss',
	'mincss': 'autominCss',

	// presets
	'a': 'all',
	'all': 'autodel automin typescript coffeescript less sass autominCss',
	'st': 'style',
	'style': 'less sass autominCss',
	'jvs': 'autodel automin',
	'tps': 'typescript',
	'typescript': 'autodel automin typescript',
	'cof': 'coffeescript',
	'coffeescript': 'autodel automin coffeescript',

};

var presetsRegex = /^\b(all|style|js|typescript|coffeescript)\b$/;
var jsRegexFilePathPattern = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

// -- [supports/rewriting/mzg_rewriting_vars.js] --
var bySetup = true; // messages will be displayed base on event fired by files.
var stayBeautiful = true;
var modifiedMZGEvent = null;

var gulpFileTempPath = "supports/rewriting/gulpfile_temp.js";
var gulpFileTempPath2 = "supports/rewriting/gulpfile_temp2.js";
var pathFiles = [];

var mzgFiles = [
	'supports/rewriting/log_sections/mzg_log1.js', // section

	'supports/basic/mzg_modules_importation.js',
	'supports/basic/mzg_vars.js',

	'supports/rewriting/mzg_rewriting_vars.js', // rewrite 			

	'supports/rewriting/log_sections/mzg_log2.js', // section

	'supports/basic/tasks/mzg_default_task.js',
	'projects_setup_tasks/mzg_set_vars_task.js',
	'supports/basic/tasks/mzg_set_params_task.js',
	'supports/basic/tasks/mzg_jshint_task.js',
	'supports/basic/tasks/mzg_help_me_task.js',

	'supports/rewriting/log_sections/mzg_log3.js', // section

	'projects_setup_tasks/mzg_scan_projects_task.js',
	'projects_setup_tasks/mzg_services_mapping_task.js',

	'supports/rewriting/log_sections/mzg_log4.js', // section

	// serve
	'services_tasks/mzg_serve_task.js',

	'supports/rewriting/log_sections/mzg_log5.js', // section

	// js
	'services_tasks/js_tasks/mzg_automin_task.js',
	'services_tasks/js_tasks/mzg_autodel_task.js',
	'services_tasks/js_tasks/mzg_merg_all_minified_task.js',
	'services_tasks/js_tasks/mzg_tyepscript_task.js',
	'services_tasks/js_tasks/mzg_coffeescript_task.js',

	'supports/rewriting/log_sections/mzg_log6.js', // section

	// css
	'services_tasks/css_tasks/mzg_automin_css_task.js',
	'services_tasks/css_tasks/mzg_auto_format_css_task.js',
	'services_tasks/css_tasks/mzg_less_task.js',
	'services_tasks/css_tasks/mzg_sass_task.js',

	'supports/rewriting/log_sections/mzg_log7.js', // section

	// other
	'services_tasks/mzg_other_oriented_tasks.js',

	'supports/rewriting/log_sections/mzg_log8.js', // section

	'supports/rewriting/tasks/mzg_apply_temp_task.js',
	'supports/rewriting/tasks/mzg_apply_dist_task.js',
	'supports/rewriting/tasks/mzg_write_temp_task.js',
	'supports/rewriting/tasks/mzg_write_dist_task.js',
	'supports/rewriting/tasks/mzg_rewrite_task.js',

	'supports/rewriting/log_sections/mzg_log9.js', // section

	'supports/mzg_runtask.js',

	'supports/rewriting/log_sections/mzg_log10.js', // section

	'supports/files/configurationSetting/mzg_config_funcs.js',
	'supports/projects/mzg_projects_funcs.js',
	'supports/mzg_argument_funcs.js',

	'supports/rewriting/log_sections/mzg_log11.js', // section

	'supports/rewriting/mzg_rewriting_funcs.js',
	'supports/rewriting/mzg_rewrite_arguments_func.js',

	'supports/rewriting/log_sections/mzg_log12.js', // section
	'supports/mzg_logging.js',

	'supports/rewriting/log_sections/mzg_log13.js', // section
	'supports/files/mzg_reading_file_class.js'
];

var distFiles = mzgFiles.slice();

distFiles.splice(40, 3);
distFiles.splice(28, 5);
distFiles.splice(3, 1);

//console.log(distFiles);
/*	*************************************************************************************************************************************************************************************************
	*                                 												PARAMETERIZING and DEFAULT TASK 																				*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/basic/tasks/mzg_default_task.js] --
// define the default task and add the watch task to it
gulp.task('default',["setParams"]);

// -- [projects_setup_tasks/mzg_set_vars_task.js] --
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

// -- [supports/basic/tasks/mzg_set_params_task.js] --
gulp.task('setParams', function() {

    var firstTaskName = this.seq.slice(-1)[0];

    // the fisrt task met is defalut : gulp (...)
    if (/^default$/.test(firstTaskName)) {
        var tasks = tasksToRunOnArgvs();

        gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

    }else if (/^serve$/.test(firstTaskName)) {
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

// -- [supports/basic/tasks/mzg_jshint_task.js] --
gulp.task('jshint', function() {
    return gulp.src(config.pathesToJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// -- [supports/basic/tasks/mzg_help_me_task.js] --
gulp.task('helpMe', function() {
    logHelp();
});
 /*	*************************************************************************************************************************************************************************************************
	*                                 							PROJECT TASKS : Tasks used to manage and setup custom configuration project 														*
 	*************************************************************************************************************************************************************************************************/


// -- [projects_setup_tasks/mzg_scan_projects_task.js] --
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

// -- [projects_setup_tasks/mzg_services_mapping_task.js] --
gulp.task('serviceMapping', function() {
    logTaskPurpose(this.currentTask.name);
    config.verbose = true;
    gulp.start(['setVars']);
});
/*	*************************************************************************************************************************************************************************************************
	*                                 															SERVE TASK 																							*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/mzg_serve_task.js] --
gulp.task('serve',['setParams']);
/*	*************************************************************************************************************************************************************************************************
	*                                 														JS ORIENTED TASKS 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/js_tasks/mzg_automin_task.js] --
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

// -- [services_tasks/js_tasks/mzg_autodel_task.js] --
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

// -- [services_tasks/js_tasks/mzg_merg_all_minified_task.js] --
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

// -- [services_tasks/js_tasks/mzg_tyepscript_task.js] --
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

// -- [services_tasks/js_tasks/mzg_coffeescript_task.js] --
var coffee = require('gulp-coffee');
 
gulp.task('coffeescript', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToCoffee);

    // passing the watch list
    gulp.watch(wl, function(event) {
        gulp.src(event.path)
        	.pipe(coffee({bare: true}))
            .pipe(gulp.dest(function(file) {
                var dest = getDestOfMatching(file.path, config.pathesToCoffee);
                gutil.log("Compiled file version updated/created here :\n" + breath() + "> '" + chalk.cyan(dest) + "'");
                return dest;
            }));
    })
});
/*	*************************************************************************************************************************************************************************************************
	*                                 														CSS ORIENTED TASKS 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/css_tasks/mzg_automin_css_task.js] --
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

// -- [services_tasks/css_tasks/mzg_auto_format_css_task.js] --
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

// -- [services_tasks/css_tasks/mzg_less_task.js] --
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

// -- [services_tasks/css_tasks/mzg_sass_task.js] --
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
/*	*************************************************************************************************************************************************************************************************
	*                                 													OTHER ORIENTED TASKS 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/mzg_other_oriented_tasks.js] --
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
/*	*************************************************************************************************************************************************************************************************
	*                                 										REWRITING TASKS : Tasks Changing gulpfile.js 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/rewriting/tasks/mzg_apply_temp_task.js] --
gulp.task('applyTemp', function() {
    gulp.watch(gulpFileTempPath, function(event) {
        if (gulp.src(gulpFileTempPath).pipe(jsValidate())) {
            gutil.log(chalk.cyan("gulpfile.js") + "' is " + chalk.green('validate'));
            var dStart = new Date();

            gulp.src(gulpFileTempPath)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {

                    var dResult = ms2Time(new Date() - dStart);
                    gutil.log(chalk.cyan("gulpfile.js") + "' replaced after " + chalk.magenta(dResult));

                    //gulp folder
                    var folder = getGulpfolderFromFileBase(file);
                    return folder;
                }));
            fssync.copy('help.md', 'site/help.md');
            getRidOfFileOfPath();
        }
    });
});

// -- [supports/rewriting/tasks/mzg_apply_dist_task.js] --
gulp.task('applyDist', function() {
    gulp.watch(gulpFileTempPath2, function(event) {

        if (gulp.src(gulpFileTempPath2).pipe(jsValidate())) {
            var dStart = new Date();

            gulp.src(gulpFileTempPath2)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {
                    var folder = getGulpfolderFromFileBase(file);
                    var dResult = ms2Time(new Date() - dStart);
                    gutil.log("Gulp project distribution generated under " + logFilePath(folder + '/dist') + " after " + chalk.magenta(dResult));
                    return folder + '/dist';
                }));

            gulp.src("site")
                .pipe(through.obj(function(chunk, enc, cb) {
                    fssync.copy('help.md', 'dist/help.md');
                    fssync.copy('help.md', 'site/help.md');
                    fssync.copy('README.md', 'site/README.md');
                    fssync.copy('LICENSE', 'site/LICENSE');
                    
                    fssync.copy('custom/project_mapping_model.ini', 'dist/custom/config.ini');
                    fssync.copy('custom/config_model.ini', 'dist/custom/config_model.ini');
                    fssync.copy('package.json', 'dist/package.json');

                    var distFolder = (/^(.*)[\\/].*$/.exec(chunk.base)[1]) + '/dist/site';
                    fssync.copy(chunk.path, distFolder);
                    cb(null, chunk);
                }));
        }
    })
});

// -- [supports/rewriting/tasks/mzg_write_temp_task.js] --
gulp.task('writeTemp', function() {
    var dStart = new Date();

    if (gulp.src(mzgFiles).pipe(jsValidate())) {

        var newMzgFiles = insertPath(mzgFiles);

        gulp.src(newMzgFiles)
            .pipe(concat(gulpFileTempPath))
            .pipe((stayBeautiful ? nop : uglify)())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                gutil.log(chalk.cyan(gulpFileTempPath) + "' writen after " + chalk.magenta(dResult));

                return getGulpfolderFromFileBase(file);
            }));
    }
});

// -- [supports/rewriting/tasks/mzg_write_dist_task.js] --
gulp.task('writeDist', function() {
    var dStart = new Date();

    if (gulp.src(distFiles).pipe(jsValidate())) {

        var newMzgFiles = insertPath(distFiles);

        gulp.src(newMzgFiles)
            .pipe(concat(gulpFileTempPath2))
            .pipe(uglify())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                gutil.log(chalk.cyan(gulpFileTempPath2) + "' writen after " + chalk.magenta(dResult));

                return getGulpfolderFromFileBase(file);
            }));
    }
});

// -- [supports/rewriting/tasks/mzg_rewrite_task.js] --
gulp.task('rewrite', ['setParams', 'applyTemp','applyDist']);
/*	*************************************************************************************************************************************************************************************************
	*                              									RUNTASK : Tasks utilities that have to stay in gulpfile.js 																		*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/mzg_runtask.js] --
gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
    this.currentTask = task;
    this.__runTask(task);
}
/*	*************************************************************************************************************************************************************************************************
	*                                 														FUNCTIONS : utils 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/files/configurationSetting/mzg_config_funcs.js] --
function getConfig() {
    return config ? config : {
        // See 'serviceMapping' project setup task
        "verbose": false, // true to enable set vars verbose

        "pathesToJs": [],
        "pathesToTs": [],
        "pathesToCoffee": [],
        "pathesToStyle": [],
        "pathesToStyleLess": [],
        "pathesToWars": [],
        "pathesToSass": [],
        "projects": []
    }
}

function setConfig() {
    var match;
    var _data = fs.readFileSync("custom/config.ini", "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);
    var key;

    // at ery line read, 
    reading.readLines(function() {

        // when a key is read:
        if (match = /^(.*)=.*$/g.exec(reading.getLine())) {
            key = match[1];
        };

        // the key 'Projects_paths' was read : analyse of project definitions within.
        if (/^Projects_paths$/.test(key) && /^\[$/g.test(reading.getLine())) {
            pushProjectIntoConfigViaReading(reading, key);
        }
    });
}


function pushProjectIntoConfigViaReading(reading, key) {
    var projectReader = new classReading();
    projectReader.initialize(reading.getData(), reading.getIter());
    var projectPattern = /^.*\[(.*),"(.*)",(.*)\],?$/g,
        match;

    projectReader.readLines(function() {
        var line = projectReader.getLine();

        //is the line matches the project pattern
        if (match = projectPattern.exec(line)) {

            if (key == "Projects_paths") {

                // pushing projects informations
                config.projects.push({
                    project: match[1],
                    path: match[2],
                    checked: match[3]
                });
            }

        }

        // the end of list (EOL.) is reached ! Stop it all
        if (/^]$/g.test(projectReader.getLine())) {
            projectReader.stop();
            reading.setIter(projectReader.getIter());
        }
    });
}

function processConfigTargetProjects(project_path, reading, key) {
    var pathReader = new classReading();
    pathReader.initialize(reading.getData(), reading.getIter());
    var match;

    pathReader.readLines(function() {
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
                extSubpath = '/**/*.coffee';
            } else if (key == "coffee_to_js") {
                configDescription = {
                    where: config.pathesToCoffee,
                    purpose: 'Compile .coffee files into .js File'
                }
                extSubpath = '/**/*.coffee';
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
    });
}

// -- [supports/projects/mzg_projects_funcs.js] --
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
            if (/^(minify_js|ts_to_js|coffee_to_js|minify_css|less|sass)$/.test(key) && /^\[$/g.test(reading.getLine())) {
                processConfigTargetProjects(project_path, reading, key);
            }
        }
    reading.readLines(process);
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

// -- [supports/mzg_argument_funcs.js] --
function tasksToRunOnArgvs() {
    var effectiveServices = [];
    var errors = [];
    var optionCount = 0;
    var service = '?';

    // start the arguments array at index 3 because argv contains [[default],TaskName,arg1,arg2, ... ,argN]
    var subAr = process.argv.slice(3, process.argv.length);

    for (serv in subAr) {
        try {
            var key = (/^([\-][\-]?)([^\-]+)$/.exec(subAr[serv]));
            service = key[2];

            // check if the argument is well formed based on the dash caracter : 
            //      > -a or --abc not --a or -abc
            checkWellForming(key, service);

            // -a to --abc
            service = convertAliasToFullNameOption(key,service);

            if (key && (matchOption = service)) {

                // check if a preset is single ; throws if not
                effectiveServices = checkPresetsOverdose(effectiveServices, optionCount);

                // check and push options that are real ; throws if no real options
                pushMatchingOption(effectiveServices, matchOption);
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

function checkWellForming(key, service) {
    if (key[1].length > 2) {
        errors = [];
        throw "GRAVE ERROR: argument malformed";
    }
}

function convertAliasToFullNameOption(key,service) {
    if (key[1].length == 1) {
        service = services[service];
    }
    return service;
}

function checkPresetsOverdose(effectiveServices, optionCount) {
    if (presetsRegex.test(matchOption)) {
        effectiveServices = services[matchOption].split(" ");
        if (optionCount > 0) {
            throw "GRAVE ERROR: Presets should be alone : " + matchOption;
        }
    }
    console.log(effectiveServices);
    return effectiveServices;
}

function pushMatchingOption(effectiveServices, matchOption) {
    if (!presetsRegex.test(matchOption)) {
        if (services[matchOption]) {
            effectiveServices.push(services[matchOption]);
        } else {
            throw "GRAVE ERROR: unknown option or preset or alias : -" + matchOption + " or --" + matchOption;
        }
    }
}
 /*	*************************************************************************************************************************************************************************************************
	*                                 													 REWRITING FUNCTIONS 																						*
 	*************************************************************************************************************************************************************************************************/


// -- [supports/rewriting/mzg_rewriting_funcs.js] --
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

// -- [supports/rewriting/mzg_rewrite_arguments_func.js] --
function configurationOfRewriteOnArvs() {
    var services = {

        // custom
        'uglyness': 'beauty',
        'times': 'once',
    };

    var subAr = process.argv.slice(2, process.argv.length);
    subAr.forEach(function(serv) {
        try {
            var opt = (/^--(.*)$/.exec(serv));

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
    })
    return services;
}
 /*	*************************************************************************************************************************************************************************************************
	*                                 													 	LOGGING UTILITIES 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/mzg_logging.js] --
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
        }else if (match = /^([\s]*)([$](?:[\s][^\s]+)+)([\s]{2,}.*|.*)$/.exec(line)) {
            console.log(chalk.grey(match[1]) + match[2] + chalk.green(match[3]));
        }else if (match = /^([\s]*[>].*)$/.exec(line)) {
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
            console.log('  See the .INI file of project mapping to set Gloups ready to serve your projects here :');
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
        case "coffeescript":
            console.log("  Will compile .coffee files matching the folowing path(s):\n");
            logWatchList(config.pathesToCoffee);
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
            console.log("  Creates .INI configuration files in your project root folder need to make Gloups able to serve\n");
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
/*	*************************************************************************************************************************************************************************************************
	*                                 										CLASSES : Classes for configuration purpose 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/files/mzg_reading_file_class.js] --
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
            if (/^[\n\r]$/g.test(c) || this.isEndReached()) {
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
        this.line = this.line.join("")
        this.line = this.line.replace(/^[\n\r]$/g, '');
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