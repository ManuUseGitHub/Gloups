/*	*************************************************************************************************************************************************************************************************
	*                                 								VARIABLES :	module requirement    &    Configuration VARIABLES 																	*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/basic/mzg_modules_importation.js] -- 
// A ----------------------------------------------------------------------------------------------
var argv = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
// B ----------------------------------------------------------------------------------------------
// C ----------------------------------------------------------------------------------------------
//https://www.npmjs.com/package/chalk
var chalk = require('chalk');
var cleanCSS = require('gulp-clean-css');
var clear = require('clear');
var coffee = require('gulp-coffee');
//var combiner = require('stream-combiner');
var concat = require('gulp-concat');
// D ----------------------------------------------------------------------------------------------
var del = require('del');
// E ----------------------------------------------------------------------------------------------
// F ----------------------------------------------------------------------------------------------
// check file existance
var fs = require("fs");
var fssync = require("fs-sync");
// G ----------------------------------------------------------------------------------------------
var gulp = require('gulp');
// H ----------------------------------------------------------------------------------------------
// I ----------------------------------------------------------------------------------------------
var insert = require('gulp-insert');
// J ----------------------------------------------------------------------------------------------
// error solved : http://kuebiko.blogspot.be/2016/01/gulp-jshint200-requires-peer-of.html
var jshint = require('gulp-jshint');
var jsValidate = require('gulp-jsvalidate');
// K ----------------------------------------------------------------------------------------------
// L ----------------------------------------------------------------------------------------------
var lazyPipe = require('lazypipe');
var less = require('gulp-less');
var lessPluginAutoPrefix = require('less-plugin-autoprefix');
var lessAutoprefix = new lessPluginAutoPrefix({browsers: ["last 2 versions"]});
// M ----------------------------------------------------------------------------------------------
// N ----------------------------------------------------------------------------------------------
// for alternate manipulations where no operations is needed
var nop = require('gulp-nop');
// O ----------------------------------------------------------------------------------------------
// P ----------------------------------------------------------------------------------------------
var path = require('path');
// Q ----------------------------------------------------------------------------------------------
// R ----------------------------------------------------------------------------------------------
var rename = require("gulp-rename");
// S ----------------------------------------------------------------------------------------------
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var stylefmt = require('gulp-stylefmt');
// T ----------------------------------------------------------------------------------------------
// to write custom pipe functions
var through = require('through2');
var ts = require('gulp-typescript');
// U ----------------------------------------------------------------------------------------------
var uglify = require('gulp-uglify');
var uglifyJs = require('uglify-js');
// V ----------------------------------------------------------------------------------------------
// W ----------------------------------------------------------------------------------------------
var wait = require('gulp-wait');
// X ----------------------------------------------------------------------------------------------
// Y ----------------------------------------------------------------------------------------------
// Z ----------------------------------------------------------------------------------------------

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
var SERVICES = {

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
	'tr':'transitive',

	// presets
	'a': 'all',
	'all': 'automin autodel typescript coffeescript autominCss less sass',
	'st': 'style',
	'style': 'autominCss less sass',
	'jvs': 'autodel automin',
	'tps': 'typescript',
	'typescript': 'autodel automin typescript',
	'cof': 'coffeescript',
	'coffeescript': 'autodel automin coffeescript',
};

var PRESET_OPTIONS = "all|style|js|typescript|coffeescript";
var SERVICES_OPTIONS = "del|minjs|ts|coffee|less|sass|mincss";
var SERVICES_ADVANCED_OPTIONS = "transitive";
var GLOUPS_VERSION = "4.5";

var ALL_SERVICES_OPTIONS = PRESET_OPTIONS+'|'+SERVICES_OPTIONS+'|'+SERVICES_ADVANCED_OPTIONS;

var JS_REGEX_FILE_PATH_PATTERN = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

var GLOUPS_OPTIONS = SERVICES_OPTIONS+'|'+PRESET_OPTIONS;

var SILENT_TASKS = "watch|vet|unit-test|integration-test";
var ISALL = true;

var isdist={};

// https://stackoverflow.com/questions/43064924/how-to-target-all-browsers-with-gulp-auto-prefixer
var AUTOPREFIXER_BROWSERS = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'];

// -- [supports/rewriting/mzg_rewriting_vars.js] -- 
var bySetup = true; // messages will be displayed base on event fired by files.
var stayBeautiful = true;
var modifiedMZGEvent = null;

var gulpFileTempPath = "supports/rewriting/gulpfile_temp.js";
var gulpFileTempPath2 = "supports/rewriting/gulpfile_temp2.js";
var pathFiles = [];

var RewriteServices = {
	'u': 'ungly',
	'b': 'beauty',
	'uglyness': 'beauty',
	'1': 'once',
	'*': 'multiple',
	'times': 'once',
};

var mzgFiles = [
	'supports/rewriting/log_sections/mzg_log1.js', // section

	'supports/basic/mzg_modules_importation.js',
	'supports/basic/mzg_vars.js',

	'supports/rewriting/mzg_rewriting_vars.js', // rewrite 

	'supports/rewriting/log_sections/mzg_log2.js', // section

	'supports/basic/mzg_stable_funcs.js',

	'supports/rewriting/log_sections/mzg_log3.js', // section

	'supports/basic/tasks/mzg_default_task.js',
	'supports/basic/tasks/mzg_clear_task.js',
	'supports/basic/tasks/mzg_externalize_config_task.js',
	'projects_setup_tasks/mzg_set_vars_task.js',
	'supports/basic/tasks/mzg_set_params_task.js',
	'supports/basic/tasks/mzg_jshint_task.js',
	'supports/basic/tasks/mzg_help_me_task.js',

	'supports/rewriting/log_sections/mzg_log4.js', // section

	'projects_setup_tasks/mzg_scan_projects_task.js',
	'projects_setup_tasks/mzg_services_mapping_task.js',

	'supports/rewriting/log_sections/mzg_log5.js', // section

	// serve
	'services_tasks/mzg_serve_task.js',

	'supports/rewriting/log_sections/mzg_log6.js', // section

	// js
	'services_tasks/js_tasks/mzg_automin_task.js',
	'services_tasks/js_tasks/mzg_autodel_task.js',
	'services_tasks/js_tasks/mzg_merg_all_minified_task.js',
	'services_tasks/js_tasks/mzg_tyepscript_task.js',
	'services_tasks/js_tasks/mzg_coffeescript_task.js',

	'supports/rewriting/log_sections/mzg_log7.js', // section

	// css
	'services_tasks/css_tasks/mzg_automin_css_task.js',
	'services_tasks/css_tasks/mzg_auto_format_css_task.js',
	'services_tasks/css_tasks/mzg_less_task.js',
	'services_tasks/css_tasks/mzg_sass_task.js',

	'supports/rewriting/log_sections/mzg_log8.js', // section

	// other
	'services_tasks/mzg_other_oriented_tasks.js',

	'supports/rewriting/log_sections/mzg_log9.js', // section

	// configuration of modules here
	'services_tasks/mzg_tasks_micro_services.js',
	'services_tasks/mzg_services_funcs.js',

	'supports/rewriting/log_sections/mzg_log10.js', // section

	'supports/rewriting/tasks/mzg_apply_temp_task.js',
	'supports/rewriting/tasks/mzg_apply_dist_task.js',
	'supports/rewriting/tasks/mzg_write_temp_task.js',
	'supports/rewriting/tasks/mzg_write_dist_task.js',
	'supports/rewriting/tasks/mzg_rewrite_task.js',

	'supports/rewriting/log_sections/mzg_log11.js', // section

	'supports/mzg_runtask.js',

	'supports/rewriting/log_sections/mzg_log12.js', // section

	'supports/files/configurationSetting/mzg_config_funcs.js',
	'supports/projects/mzg_projects_funcs.js',
	'supports/mzg_argument_funcs.js',

	'supports/rewriting/log_sections/mzg_log13.js', // section

	'supports/rewriting/mzg_rewriting_funcs.js',
	'supports/rewriting/mzg_rewrite_arguments_func.js',

	'supports/rewriting/log_sections/mzg_log14.js', // section
	'supports/mzg_logging.js',

	'supports/rewriting/log_sections/mzg_log15.js', // section
	'supports/files/mzg_stable_reading_file_class.js'
];

var distFiles = mzgFiles.slice();

distFiles.splice(47, 3);
distFiles.splice(34, 5);
distFiles.splice(9, 1);
distFiles.splice(3, 1);

isdist.NOT_DISTRIBUTION = true;
/*	*************************************************************************************************************************************************************************************************
	*                                 												PARAMETERIZING and DEFAULT TASK 																				*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/basic/mzg_stable_funcs.js] -- 
// https://www.codeproject.com/Tips/201899/String-Format-in-JavaScript.
String.prototype.format = function(args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];

			// "{" and "}" escaping
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";

			// when nothing match into { } ...
		} else {
			replace = "";
		}
		return replace;
	});
};

String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

// replacement of backslash by hack. Useful for windows pathfiles
String.prototype.hackSlashes = function() {
	return this.replace(/[\\]/g, '/');
};

// https://stackoverflow.com/questions/31361309/how-can-i-get-gulp-to-be-silent-for-some-tasks-unit-tests-vet-etc
var cmd = String(process.argv[2]);

if (ISALL || new RegExp("^(({0})(:.*)?)$".format([SILENT_TASKS])).test(cmd)) {
	var isWatching = /^(watch:.*)$/.test(cmd);
	var firstCall = false; // Do not clear on first run

	var on = gulp.on;
	gulp.on = function(name, handler) {
		if (/^(task_start|task_stop)$/.test(name)) {

			// Do some inspection on the handler
			// This is a ugly hack, and might break in the future
			if (/gutil\.log\(\s*'(Starting|Finished)/.test(handler.toString())) {
				return; //No operation
			}
		}
		return on.apply(gulp, arguments);
	};
	gulp.on('start', function() {
		// start fires multiple times
		// make sure we only call this once
		if (firstCall) {

			if (isWatching) {
				// Clear console
				// Ref: https://stackoverflow.com/questions/5367068/clear-the-ubuntu-bash-screen-for-real
				process.stdout.write('\033c');
			}

			//console.log('Started task');
			firstCall = false;
		}
	});
	gulp.on('stop', function() {
		//console.log('Task finished');
		firstCall = true;
	});
}
 /*	*************************************************************************************************************************************************************************************************
	*                                 							PROJECT TASKS : Tasks used to manage and setup custom configuration project 														*
 	*************************************************************************************************************************************************************************************************/


// -- [supports/basic/tasks/mzg_default_task.js] -- 
// define the default task and add the watch task to it
gulp.task('default',["setParams"]);

// -- [supports/basic/tasks/mzg_clear_task.js] -- 
gulp.task('clear', function() {
	clear();
});

// -- [supports/basic/tasks/mzg_externalize_config_task.js] -- 
gulp.task('externalizeConfig', function(cb){
  fs.writeFile('config.json', JSON.stringify(config,null,4), cb);
});

// -- [projects_setup_tasks/mzg_set_vars_task.js] -- 
gulp.task('setVars', function() {
    setConfig();
    if (!config.verbose) {
        logTaskPurpose(this.currentTask.name);
    }
    for (var p_path in config.projects) {
        var project = config.projects[p_path];
        if (fssync.exists(project.path + '\\config.mzg.json')) {
            console.log("{0} - OK".format([chalk.green(project.project)]));
            if (project.checked) {
                setUpProjectWatchingPaths(project.path);
            }
        } else {
            logProjectErrored(project);
        }
    }

    // configuration for SASS watched paths ---------------------------
    for (p_path in config.pathesToSass) {
        var watchPathForSass = config.pathesToSass[p_path].watch;
        var projectPath = config.pathesToSass[p_path].projectPath;
        mappSassMatching(projectPath,watchPathForSass);
    }

    // gulp.task("externalizeConfig") is never undefined
    // so check if a NOT_DISTRIBUTION key is found or not
    if (isdist.NOT_DISTRIBUTION) { 
        if (!config.verbose){
            console.log(forNowLongLog("{0}\n", ["config externalized under config.json"]));
        }
            
        gulp.start("externalizeConfig");
    }

    if (!config.verbose) {
        console.log(forNowLongLog("{0}\n", ["config externalized under config.json"]));
        console.log(forNowLongLog("{0}\n", ["CONFIGURATON PROCEEDED"]));
    }
});

// -- [supports/basic/tasks/mzg_set_params_task.js] -- 
gulp.task('setParams', function() {

    var firstTaskName = this.seq.slice(-1)[0];
    var tasks;

    // the fisrt task met is defalut : gulp (...)
    if (/^default$/.test(firstTaskName)) {
        tasks = tasksToRunOnArgvs();
        gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

    } else if (/^serve$/.test(firstTaskName)) {
        tasks = tasksToRunOnArgvs();
        gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

        // the fisrt task met is rewrite
    } else if (/^rewrite$/.test(firstTaskName)) {
        var _services = configurationOfRewriteOnArvs();
        var stayBeautiful = !/^ugly$/.test(_services.uglyness);
        var watchOnce = !/^multiple$/.test(_services.times);

        logTaskName(
            (stayBeautiful ? "imBeauty" : "imUgly") +
            (watchOnce ? "AtOnce" : "imBeauty")
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
	*                                 															SERVE TASK 																							*
 	*************************************************************************************************************************************************************************************************/

// -- [projects_setup_tasks/mzg_scan_projects_task.js] -- 
gulp.task('scanProjects', function() {
    logTaskPurpose(this.currentTask.name);
    setConfig();
    config.projects.forEach(function(project) {
        if (!fssync.exists(project.path + '\\config.mzg.json')) {
            console.log("file :" + logFilePath(project.path + '\\config.mzg.json') + ' does not exist ... creation very soon');
            gulp.src('custom/config_model.json')
                .pipe(rename('config.mzg.json'))
                .pipe(gulp.dest(project.path));
        }
    });
});

// -- [projects_setup_tasks/mzg_services_mapping_task.js] -- 
gulp.task('serviceMapping', function() {
    logTaskPurpose(this.currentTask.name);
    config.verbose = true;
    gulp.start(['setVars']);
});
/*	*************************************************************************************************************************************************************************************************
	*                                 														JS ORIENTED TASKS 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/mzg_serve_task.js] -- 
gulp.task('serve',['setParams']);
/*	*************************************************************************************************************************************************************************************************
	*                                 														CSS ORIENTED TASKS 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/js_tasks/mzg_automin_task.js] -- 
// configure which files to watch and what tasks to use on file changes
gulp.task('automin', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToJs);

    // passing the watch list
    gulp.watch(wl, function(event) {
        var regex = new RegExp(JS_REGEX_FILE_PATH_PATTERN, "g");
        var match = regex.exec(event.path);

        // the file that fired the event change is a .min.js file
        if (!/.*.min.js$/.test(event.path) && match) {

            var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToJs);
            var sourcemapping = matchingEntry.sourcemaps;

            gulp.src(event.path)
                .pipe(sourcemapInit(sourcemapping))

                .pipe(uglify())
                .pipe(renameSuffixMin())
                .pipe(insertSignatureAfter("Compressed", "gulp-uglify"))

                .pipe(sourcemapWrite(sourcemapping))
                .pipe(gulp.dest(matchingEntry.dest));

            console.log(forNowShortLog("Compressed file version updated/created here :\n{0} > {1}", [breath(), logFilePath(matchingEntry.dest)]));
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
        var regex = new RegExp(JS_REGEX_FILE_PATH_PATTERN, "g");
        var match = regex.exec(event.path);

        if (event.type === "deleted" && match) {

            // process compression of js files
            var process = function() {
                var dest = getMatchingEntryConfig(event.path, config.pathesToJs);

                // select in all case file.min.js destination file
                var destFileName = (dest + '/' + match[2]).replace(/.min.js$/g, ".js");
                var destMinFileName = destFileName.replace(/.js$/g, ".min.js");

                // delete the compressed file (.min.js file) if the base file (.js) does not exist
                fs.stat(destMinFileName, function(error, stat) {
                    if (!error)
                        del(destMinFileName, {
                            force: true
                        });
                    console.log(forNowShortLog("source folder here :\n{0}> {1}",[breath(),logFilePath(dest)]));
                });
            };

            // call with logging of the time taken by the task
            logProcessCompleteOnFile([match[2].replace(/.js$/g, ".min.js")], 'deleted', process);

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

        var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToTs);
        var sourcemapping = matchingEntry.sourcemaps;

        gulp.src(event.path)
            .pipe(sourcemapInit(sourcemapping))

            .pipe(typescripting(matchingEntry.dest))
            .pipe(insertSignatureAfter("Compiled", "gulp-typescript"))

            .pipe(sourcemapWrite(sourcemapping))
            .pipe(gulp.dest(matchingEntry.dest));

        console.log(forNowShortLog("Compressed file version updated/created here :\n{0}> {1}", [breath(), logFilePath(matchingEntry.dest)]));

    });
});

// -- [services_tasks/js_tasks/mzg_coffeescript_task.js] -- 
var coffee = require('gulp-coffee');

gulp.task('coffeescript', function() {
    logTaskPurpose(this.currentTask.name);

    // watch every single file matching those paths
    var wl = watchList(config.pathesToCoffee);

    // passing the watch list
    gulp.watch(wl, function(event) {

        var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToCoffee);
        var sourcemapping = matchingEntry.sourcemaps;

        gulp.src(event.path)
            .pipe(sourcemapInit(sourcemapping))

            .pipe(serveCoffee())
            .pipe(insertSignatureAfter("Served coffee", "gulp-coffee"))

            .pipe(sourcemapWrite(sourcemapping))
            .pipe(gulp.dest(matchingEntry.dest));

        console.log(forNowShortLog("Compiled file version updated/created here :\n{0}> {1}", [breath(), logFilePath(matchingEntry.dest)]));
    });
});
/*	*************************************************************************************************************************************************************************************************
	*                                 													OTHER ORIENTED TASKS 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/css_tasks/mzg_automin_css_task.js] -- 
gulp.task('autominCss', function() {
    logTaskPurpose(this.currentTask.name);

    var message = getOneFeedBackForAll("Are compressed: \n");


    // watch every single file matching those paths
    var wl = watchList(config.pathesToStyle);

    gulp.watch(wl, function(event) {
        if (event.type !== "deleted" && !/^(.*.min.css|.*.less|.*.scss|.*.map)$/.test(event.path)) {
            if (/^.*.css$/.test(event.path)) {

                var mainProcess = lazyPipe()

                    .pipe(autoprefix)
                    .pipe(cleanCssMinification)
                    .pipe(renameSuffixMin);

                var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToStyle);
                var sourceMappedProcess =
                    setSourceMappingAndSign(mainProcess, matchingEntry, {
                        'action': "Compressed",
                        'module': "gulp-clean-css"
                    });

                var destinatedProcess = sourceMappedProcess
                    .pipe(function() {
                        return gulp.dest(matchingEntry.dest);
                    });

                appendFilesToLog(message, destinatedProcess, event);
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

    var glob_transitivity = getFreshTransitivity();
    // passing the watch list
    gulp.watch(wl, function(event) {
        if (/.*.less$/.test(event.path)) {

            // LAZYPIPE : main pipeline to provide SASS service -------------------------------
            var mainProcess = lazyPipe()
                .pipe(function() {
                    return sass(less({
                        plugins: [lessAutoprefix]
                    })); //.on('error', less.logError);
                })
                .pipe(autoprefix)
                .pipe(stylefmt);

            var message = {
                'action': "Processed",
                'module': "gulp-less"
            };

            consumePipeProcss(glob_transitivity, mainProcess, event.path, message);
        }
    });
});

// -- [services_tasks/css_tasks/mzg_sass_task.js] -- 
gulp.task('sass', function() {
	logTaskPurpose(this.currentTask.name);

	// watch every single file matching those paths
	var wl = watchList(config.pathesToSass);

	var glob_transitivity = getFreshTransitivity();
	// passing the watch list
	gulp.watch(wl, function(event) {
		if (/.*.scss$/.test(event.path)) {
			var message = {
				'action': "Processed",
				'module': "gulp-sass"
			};
			// find the config through the json and getting watch ; dest ; sourcemapp etc.
			var matchingEntry = getMatchingEntryConfig(event.path, config.pathesToSass);

			// getting the fileName and checking if its a qualified file to be process 
			// (not starting by undererscore "_.*");
			// else getting files refering it via @import inside them
			realTargets = getMatchingPrincipalSCSS(matchingEntry.projectPath, event.path.hackSlashes());

			var process = function() {
				// LAZYPIPE : main pipeline to provide SASS service -------------------------------
				var mainProcess = lazyPipe()
					.pipe(function() {
						return sass({indentedSyntax: false}).on('error', sass.logError);
					})
					.pipe(autoprefix)
					.pipe(stylefmt);

				// LAZYPIPE wrapping transitivity and sourcemapping -------------------------------
				var thinkTransitively = transitiveWrapAround(glob_transitivity, matchingEntry, event.path, mainProcess);
				var sourceMappedProcess = setSourceMappingAndSign(thinkTransitively, matchingEntry, message);

				gulp.src(realTargets)
					.pipe(sourceMappedProcess())
					.pipe(gulp.dest(glob_transitivity.dest));
			};

			// call with logging of the time taken by the task
			logProcessCompleteOnFile(realTargets, 'Processing', process);
		}
	});
});
/*	*************************************************************************************************************************************************************************************************
	*                                 										module configurations 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/mzg_other_oriented_tasks.js] -- 

/*	*************************************************************************************************************************************************************************************************
	*                                 										REWRITING TASKS : Tasks Changing gulpfile.js 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/mzg_tasks_micro_services.js] -- 
function renameSuffixMin() {
    return rename({
        suffix: '.min'
    });
}

function cleanCssMinification() {
    return cleanCSS({
        compatibility: 'ie8'
    });
}

function typescripting(dest) {
    return ts({
        noImplicitAny: true
    });
}

function insertSignatureAfter(actionDone, thanksToModule) {
    return insert.append("\n/* -- {0} with Gloups {1} | {2} using -- */".format([
        actionDone, GLOUPS_VERSION, thanksToModule
    ]));
}

function sourcemapInit(sourcemapping) {
    return (sourcemapping ? sourcemaps.init : nop)();
}

function sourcemapWrite(sourcemapping) {
    return sourcemapping ? sourcemaps.write('./') : nop();
}

function autoprefix() {
    return autoprefixer({
        browsers: AUTOPREFIXER_BROWSERS,
        cascade: false
    });
}

function serveCoffee() {
    return coffee({
        bare: true
    });
}

function makeLess() {
    return less({
        paths: [path.join(__dirname, 'less', 'includes')]
    });
}

function transitivitySetup(transitivity, matchingEntry, path) {
    return through.obj(function(chunk, enc, callback) {
        var shouldBeTransitive =
            metAllArgs(['all', 'transitive']) ||
            metAllArgs(['sass', 'mincss', 'transitive']) ||
            metAllArgs(['less', 'mincss', 'transitive']);

        var found = false;

        // by default the transitivity is set to the path the result should be the destination
        transitivity.dest = matchingEntry.dest;

        if (shouldBeTransitive) {
            var fileName = (/^.*[\/](.*)$/g.exec(path.hackSlashes()))[1];
            var focusedPathFileName = "{0}/{1}".format([matchingEntry.dest, fileName]);
            var matchingEntryFinal = getMatchingEntryConfig(focusedPathFileName, config.pathesToStyle);

            found = matchingEntryFinal != null;
            transitivity.should = found;

            if (found) {
                transitivity.compressing = cleanCssMinification;
                transitivity.suffixing = renameSuffixMin;
                transitivity.dest = matchingEntryFinal.dest;
            }
        }
        callback(null, chunk);
    });
}
function transitiveWrapAround(glob_transitivity, matchingEntry, path, lazyPipeProcess) {
    return lazyPipe()
        .pipe(transitivitySetup, glob_transitivity, matchingEntry, path)
        .pipe(lazyPipeProcess)

        // piping transformations when it should transit
        .pipe(glob_transitivity.compressing)
        .pipe(glob_transitivity.suffixing);
}

function setSourceMappingAndSign(lazyPipeProcess, matchingEntry, sign) {
    var sourcemapping = matchingEntry.sourcemaps;
    return lazyPipe()
        .pipe(sourcemapInit, sourcemapping)
        .pipe(lazyPipeProcess)
        .pipe(insertSignatureAfter, sign.action, sign.module)
        .pipe(sourcemapWrite, sourcemapping);
}

function appendFilesToLog(message, lazyPipeProcess, event) {
    // -- end process logging -----------------------------------------------------
    gulp.src(event.path)
        // append files in order to output all files compressed at once
        .pipe(through.obj(function(chunk, enc, cb) {
            --message.k;
            message.files.push(chunk.path);
            cb(null, chunk);
        }))

        .pipe(lazyPipeProcess())

        .pipe(wait(500))
        // let the files be added by creating a race condition

        // log final message when all files are done
        .on('end', function() {
            if (++message.k == 0) {
                console.log(forNowShortLog(message.txt, []));
                message.files.forEach(function(element, index) {
                    console.log(logFilePath(element.hackSlashes()));
                });
                console.log();
                message.files = [];
            }
        });
}

function consumePipeProcss(glob_transitivity, lasyPipeProcess, path, message) {
    // find the config through the json and getting watch ; dest ; sourcemapp etc.
    var matchingEntry = getMatchingEntryConfig(path, config.pathesToStyleLess);

    // LAZYPIPE wrapping transitivity and sourcemapping -------------------------------
    var thinkTransitively = transitiveWrapAround(glob_transitivity, matchingEntry, path, lasyPipeProcess);
    var sourceMappedProcess = setSourceMappingAndSign(thinkTransitively, matchingEntry, message);

    gulp.src(path)
        .pipe(sourceMappedProcess())
        .pipe(gulp.dest(glob_transitivity.dest));

    // call with logging of the time taken by the task
    console.log(forNowShortLog("Processed file version updated/created here :\n{0}> {1}", [breath(), logFilePath(matchingEntry.dest)]));
}

// -- [services_tasks/mzg_services_funcs.js] -- 
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function getMatchingPrincipalSCSS(projectPath, path) {
    var m = null;
    m = /^.*[\/\\](.*)$/.exec(path);

    // filter to not let pass files starting by underscores "_.*"
    if (m && m[1] && /^_.*$/.test(m[1])) {

        // removing the underscor and the extension to match the import definition and 
        // then the value in configuration
        m = /^(.*[\\\/])_?(.*)[.].*$/g.exec(path);
        var normalized = m[1] + m[2];       

        var ppl = projectPath.length; // path to project length
        var lpp = path.substr(ppl); // local path to the partial 

        // ellipsizing the path to get a match with
        ellipsedPath = pathEllipzizeing(normalized, 0, (lpp.split("/").length));

        var matchings = [];
        var matchingDef = config.sassMaching;
        for (var i in matchingDef){

            // if an ellipsized path match for a project, ad the filepath targeting.
            if(contains(matchingDef[i].partials,ellipsedPath)){
                matchings.push(matchingDef[i].target);
            }            
        }
        return matchings;
    }
    return [path];
}

function getFreshTransitivity() {
    return {
        'should': false,
        'dest': 'draft',
        'compressing': nop,
        'suffixing': nop
    };
}

// -- [supports/rewriting/tasks/mzg_apply_temp_task.js] -- 
gulp.task('applyTemp', function() {
    gulp.watch(gulpFileTempPath, function(event) {
        if (gulp.src(gulpFileTempPath).pipe(jsValidate())) {
            console.log(forNowShortLog("{0} is {1}", [logFilePath("gulpfile.js"), chalk.green('validate')]));
            var dStart = new Date();

            gulp.src(gulpFileTempPath)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {

                    var dResult = ms2Time(new Date() - dStart);
                    console.log(forNowShortLog("{0} replaced after {1}", [chalk.cyan("gulpfile.js"), chalk.magenta(dResult)]));

                    //gulp folder
                    var folder = getGulpfolderFromFileBase(file);
                    return folder;
                }));
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
                    console.log(forNowShortLog("Gulp project distribution generated under {0} after {1}",[logFilePath(folder + '/dist'),chalk.magenta(dResult)]));
                    return folder + '/dist';
                }));

            fssync.copy('help.md', 'dist/help.md');

            fssync.copy('custom/project_mapping_model.json', 'dist/custom/config.json');
            fssync.copy('custom/config_model.json', 'dist/custom/config_model.json');
            fssync.copy('package.json', 'dist/package.json');
        }
    });
});

// -- [supports/rewriting/tasks/mzg_write_temp_task.js] -- 
gulp.task('writeTemp', function() {
    var dStart = new Date();

    var pathfile = '';
    if (gulp.src(mzgFiles).pipe(jsValidate())) {
        gulp.src(mzgFiles)
            .pipe(insert.prepend(function(file) {
                pathfile = /^.*[\/\\](?:Gloups|gulp)[\/\\](.*)/.exec(file.path)[1];

                // outputing a comment with the file path if not a log_section file
                return !/^.*log_sections.*$/.test(pathfile) ?
                    // a path or nothing 
                    "\n// -- [{0}] -- \n".format([pathfile.hackSlashes()]) : "";
            }))
            .pipe(concat(gulpFileTempPath))
            .pipe((stayBeautiful ? nop : uglify)())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                console.log(forNowShortLog("{0} writen after {1}", [logFilePath(gulpFileTempPath), chalk.magenta(dResult)]));

                return getGulpfolderFromFileBase(file);
            }));
    }
});

// -- [supports/rewriting/tasks/mzg_write_dist_task.js] -- 
gulp.task('writeDist', function() {
    var dStart = new Date();

    if (gulp.src(distFiles).pipe(jsValidate())) {

        gulp.src(distFiles)
            .pipe(concat(gulpFileTempPath2))
            .pipe(uglify())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                console.log(forNowShortLog("{0} writen after {1}", [logFilePath(gulpFileTempPath2), chalk.magenta(dResult)]));

                return getGulpfolderFromFileBase(file);
            }));
    }
});

// -- [supports/rewriting/tasks/mzg_rewrite_task.js] -- 
gulp.task('rewrite', ['setParams', 'applyTemp', 'applyDist']);
/*	*************************************************************************************************************************************************************************************************
	*                              									RUNTASK : Tasks utilities that have to stay in gulpfile.js 																		*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/mzg_runtask.js] -- 
gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
    this.currentTask = task;
    this.__runTask(task);
};
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
        "pathesToSass": [],
        "projects": []
    };
}

function readJsonConfig(filePath) {
    var _data = fs.readFileSync(filePath, "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);

    var m;
    var l;
    var commentBloc = 0;
    var has_smthng = true;
    var content = "";
    m = /^(.*)(\.json)$/.exec(filePath);
    var tempfile = m[1] + '.temp' + m[2];

    // at any line read, 
    fssync.write(tempfile, '', 'utf8');
    reading.readLines(function() {

        // stripping comments ---------------------------------------------------------------------
        l = reading.getLine();
        if ((has_smthng = (m = /^(.*)\/\/.*$/g.exec(l)))) { // "(.. content ..) [//] .. .."
            content = m[1];
        } else if ((has_smthng = (m = /^(.*)\/\*$/g.exec(l)))) { // "(.. content ..) [/*] .. .."
            content = m[1];
            ++commentBloc;
        } else if ((has_smthng = (m = /^.*\*\/(.*)$/g.exec(l)))) { // ".. .. [*/] (.. content ..)"
            content = m[1];
            --commentBloc;
        } else if ((has_smthng = (commentBloc == 0))) {
            content = l;
        }

        //                          every matching creates a candidate to write 
        if (has_smthng) {
            if (!/^[\s]*$/g.test(content)) { // white lines are ignored
                fs.appendFileSync(tempfile, content + "\r\n", 'utf8');
            }
        }
        // ----------------------------------------------------------------------------------------
    });
    var temp = fs.readFileSync(tempfile, "utf8");
    fssync.remove(tempfile);
    return JSON.parse(temp);
}

function setConfig() {
    config.projects = readJsonConfig("custom/config.json").projects;
}

function makePathesCoveringAllFilesFor(projectFolder, matchingForEntry, subpathToExtention, purpose) {

    var addon = matchingForEntry.addon;
    var entrySet = matchingForEntry.pathesToService;

    if (addon) {
        for (var i = 0, t = addon.length; i < t; ++i) {
            // concatenate /**/*.ext to the watch folder
            addon[i].watch = addon[i].watch + subpathToExtention;

            var pathes = [addon[i].watch, addon[i].dest];

            if (0 < i) { // only the first time to avoid repeating the same purpose
                purpose = "[SAME-PURPOSE]";
            }

            logServiceActivatedPushed(purpose, projectFolder, addon[i]);

            // rebaseing the path to validate the watching
            addon[i].watch = projectFolder + "/" + addon[i].watch;
            addon[i].dest = projectFolder + "/" + addon[i].dest;

            if (matchingForEntry.projectPath){
                addon[i].projectPath = projectFolder;
            }

            entrySet = entrySet.concat(addon[i]);
        }
        if (config.verbose) {
            console.log();
        }
    }

    //pushing the addon to the entrySet an "entry" is a watching list for js or ts or coffee ... css ... etc."
    return entrySet;
}

// -- [supports/projects/mzg_projects_funcs.js] -- 
/**
 * @Function
 * fills the config arrays according to a current service mapping provided by a json file 
 * (the file is a direct configuraiton)
 * 
 * @param  {String}
 */
function setUpProjectWatchingPaths(project_path) {
    var projectServices = readJsonConfig(project_path + '/config.mzg.json');

    console.log("Activated Services for target project under the path [FOLDER]:");
    console.log(logFilePath(project_path) + "\n");

    config.pathesToJs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToJs),
        'addon': projectServices.minify_js
    }, '/**/*.js', 'Compress .js files into .min.js files');

    config.pathesToTs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToTs),
        'addon': projectServices.ts_to_js
    }, '/**/*.ts', 'Compile .ts files into .js file');

    config.pathesToCoffee = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToCoffee),
        'addon': projectServices.coffee_to_js
    }, '/**/*.coffee', 'Compile .coffee files into .js file');

    config.pathesToStyle = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyle),
        'addon': projectServices.minify_css
    }, '/**/*.css', 'Compress .css files');

    config.pathesToStyleLess = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyleLess),
        'addon': projectServices.less
    }, '/**/*.less', 'Compile .less files into .css files');

    config.pathesToSass = makePathesCoveringAllFilesFor(project_path, {
        'projectPath': project_path,
        'pathesToService': (config.pathesToSass),
        'addon': projectServices.sass
    }, '/**/*.scss', 'Compile .scss files into .css files');

}

function getMatchingEntryConfig(filePath, configTab) {
    filePath = filePath.hackSlashes();

    // iterate on efery path within configTab to check 
    // what path sources fire the change event then find
    // the destination referenced via 'entry.dest'
    for (var p_path in configTab) {

        var entry = configTab[p_path];
        var watch = entry.watch.hackSlashes();
        var dest = entry.dest.hackSlashes();

        var pattern = '^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$';
        var base = (new RegExp(pattern, "g").exec(watch))[2];
        var matching = (new RegExp('^.*(?:' + base + ').*$', "g").exec(filePath));

        if (matching) {
            return entry;
        }
    }
    return null;
}

function watchList(configTab) {
    var list = [];
    for (var p_path in configTab) {
        var watch = configTab[p_path].watch;
        list.push(watch);
    }
    return list;
}

function mappSassMatching(projectRootPath, watchPathForSass) {
    // ===========================================================================================================
    // the configuration is set to look into every folder under the watch path ?
    var m;
    if ((m = /^(.*)[\\\/]\*\*[\\\/]\*\..*$/.exec(watchPathForSass)) && m[1]) {

        config.sassMaching = [];
        var pathsToSCSSPrimary = walkSync(m[1], [], new RegExp("^.*[\\\/](_.*)$", 'i'));
        var i = 0;

        pathsToSCSSPrimary.forEach(function(styleSheet){
            config.sassMaching.push({
                identifier: styleSheet.fileName,
                target: styleSheet.path,
                partials: []
            });

            pushEllipsizedPartials(projectRootPath, styleSheet,i++);
        });
    }
    // ===========================================================================================================
}

function pushEllipsizedPartials(projectRootPath, styleSheet, index) {

    var reading = new classReading();
    var _data = fs.readFileSync(styleSheet.path, "utf8");
    reading.initialize(_data, 0);

    var ppl = projectRootPath.length; // project path Length
    var l,m;
    
    reading.readLines(function() {
        l = reading.getLine();
        if ((m = /^@import[\s].*["](.*)["]/.exec(l)) && m[1]) {

            // full path to the partial
            var fpp = "{0}/{1}".format([styleSheet.dir, m[1]]);

            // local path to the partial 
            var lpp = fpp.substr(ppl);

            var ellipsedPath = pathEllipzizeing(fpp, 0, (lpp.split("/").length));
            config.sassMaching[index].partials.push(ellipsedPath);
        }
    });
}

function pathEllipzizeing(path, sub, sup) {
    // patern + format !!! {-1} = "{", {-2} = "}" !!!
    var patern = "^(?:(?:((?:[^\/\\]+[\\\/]{-1}1,2{-2}){-1}{0}{-2}).*((?:[\\\/][^\/\\?]+){-1}{1},{-2}[\\\/]?)[^?]*).*|([^?]*).*)$".format([sub, sup]);
    var m = new RegExp(patern, 'g').exec(path);
    return m[3] ? m[3] : (m[1] + '...' + m[2]); // if no ellips is posible, return the full path;
}

// https://gist.github.com/kethinov/6658166
// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist, regexFilter) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist, regexFilter);
        } else {
            if (!regexFilter.test(dir + '/' + file))
                filelist.push({
                    "dir": dir.hackSlashes(),
                    "path": (dir + '/' + file).hackSlashes(),
                    "fileName": file
                });
        }
    });
    return filelist;
};

// -- [supports/mzg_argument_funcs.js] -- 
function translateAliassesInArgs(argvs, serviceArgs) {
    var match;
    var result = [];
    argvs.forEach(function(arg) {
        if ((match = /^-([^\-]+)$/.exec(arg))) {
            result.push('--' + serviceArgs[match[1]]);
        } else {
            result.push(arg);
        }
    });
    return result;
}

function getSliceOfMatchingOptions(argvs, args) {
    var start = 0;
    var end = 0;
    try {
        argvs.forEach(function(arg) {
            if (!(new RegExp("^--(" + args + ")$", "g")).test(arg)) {
                if (start != end) {
                    // there is no 'break' statement in JS ... so throw an exception is the best solution
                    throw {};
                }
                start++;
            }
            end++;
        });
    } catch (e) { /*nothing*/ }

    return argvs.slice(start, end);
}

function metAllArgs(argvNames) {
    var subs = translateAliassesInArgs(process.argv, SERVICES);
    var subAr = getSliceOfMatchingOptions(subs, ALL_SERVICES_OPTIONS);

    var subRegex = '';

    subAr.forEach(function(arg, index) {

        var argName = (new RegExp("^--(.*)$", "g")).exec(arg);
        var argNam = argName[1];

        if (index != 0) {
            subRegex += '|';
        }
        subRegex += argNam;
    });

    var failed = false;
    for (var i in argvNames) {
        var arg = argvNames[i];

        // the arg is misspeled !
        if (!(new RegExp("^(" + subRegex + ")$", "g").test(arg))) {
            failed = true;
            break;
        }
    }
    return !failed;
}

function tasksToRunOnArgvs() {
    var effectiveServices = [];
    var errors = [];
    var optionsCount = 0;

    // translate aliasses into args equivalances like -a is replaced by --all in the arg. string
    var subs = translateAliassesInArgs(process.argv, SERVICES);

    // strips all non options or presets arguments
    var subAr = getSliceOfMatchingOptions(subs, GLOUPS_OPTIONS);
    var subAdvAr = getSliceOfMatchingOptions(subs, SERVICES_ADVANCED_OPTIONS);

    for (var service in subAr) {
        try {
            service = (/^[\-][\-]?([^\-]+)$/.exec(subAr[service]))[1];

            if (new RegExp("^\\b(" + PRESET_OPTIONS + ")\\b$").test(service)) {

                // check if a preset is single ; throws if not
                checkPresetsOverdose(++optionsCount, service);

                // convert the preset into a list of matching options
                effectiveServices = SERVICES[service].split(' ');

            } else {
                effectiveServices.push(SERVICES[service]);
            }
        } catch (err) {
            errors.push(err + " Error with option: ");
            if (/^GRAVE ERROR.*$/.test(err)) {
                effectiveServices = [];
                break;
            }
        }
        optionsCount++;
    }

    logErrorsOnTaskArgvs(errors);
    return effectiveServices;
}

function checkPresetsOverdose(optionsCount, service) {
    if (optionsCount > 1) {
        throw "GRAVE ERROR: Presets should be alone : " + service;
    }
}
 /*	*************************************************************************************************************************************************************************************************
	*                                 													 REWRITING FUNCTIONS 																						*
 	*************************************************************************************************************************************************************************************************/


// -- [supports/rewriting/mzg_rewriting_funcs.js] -- 
var merging = function(event) {
    clear();
    
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
    var gulpfolder = /^(.*[\/\\](?:Gloups|gulp))[\/\\].*/.exec(file.base)[1];
    return gulpfolder;
}

// -- [supports/rewriting/mzg_rewrite_arguments_func.js] -- 
function configurationOfRewriteOnArvs() {
    var argvs = translateAliassesInArgs(process.argv, RewriteServices);
    var subAr = getSliceOfMatchingOptions(argvs, "ugly|beauty|once|multiple");
    subAr.forEach(function(serv) {
        try {
            var opt = (/^--(.*)$/.exec(serv));

            if (opt && (matchOption = opt[1])) {
                RewriteServices.uglyness = matchOption == 'ugly' ? matchOption : RewriteServices.uglyness;
                RewriteServices.times = matchOption == 'multiple' ? matchOption : RewriteServices.times;
            }

        } catch (err) {
            errors.push(err + " Error with option: ");
        }
    });

    return {
        'times': RewriteServices.times,
        'uglyness': RewriteServices.uglyness
    };
}
 /*	*************************************************************************************************************************************************************************************************
	*                                 													 	LOGGING UTILITIES 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/mzg_logging.js] -- 
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


function getOneFeedBackForAll(intro){
    return {
        'files': [],
        'txt': intro,
        'k': 0
    };
}
/*	*************************************************************************************************************************************************************************************************
	*                                 										CLASSES : Classes for configuration purpose 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/files/mzg_stable_reading_file_class.js] -- 
function classReading() {
    this.line = null;
    this.data = null;
    this.iter = null;
    this.stopped = false;
    this.initialize = function(data, iter) {
        this.data = data+' ';
        this.iter = iter;
        this.line = [];
    };

    this.readLines = function(processingLine) {
        var c;
        while ((!this.isStopped()) && (c = this.getNextChar())) {

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
    };

    this.stop = function() {
        this.stopped = true;
    };
    
    this.isStopped = function() {
        return this.stopped;
    };

    this.setIter = function(iter) {
        this.iter = iter;
    };

    this.setData = function(data) {
        this.data = data;
    };

    this.toLine = function() {
        this.line = this.line.join("");
        this.line = this.line.replace(/^[\n\r]$/g, '');
    };

    this.resetLine = function() {
        this.line = [];
    };

    this.getIter = function() {
        return this.iter;
    };

    this.getData = function() {
        return this.data;
    };

    this.getLine = function() {
        return this.line;
    };

    this.getNextChar = function() {
        return this.data[this.iter++];
    };

    this.isEndReached = function() {
        return !this.data[this.iter];
    };

    this.feed = function(char) {
        this.line.push(char);
    };
}