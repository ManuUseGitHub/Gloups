"use strict";

// -- [supports/basic/mzg_jshint_specifications.js] -- 
/*jshint node:true*/
/*jshint esversion: 6 */

/*!
 * copyright !
 * gvghvggc
 * ghvnfchfc
 * gfhdhfdbdfxbdf
 */

/*!ghvjgfchfcbdfxbdxvdswdswcswshfc gvjfhrtxgrdxgdx yjtdhertdgdxgbdxgbdxg fhfcbfcbfdxgfbdx*/

/*	*************************************************************************************************************************************************************************************************
	*                                 								VARIABLES :	module requirement    &    Configuration VARIABLES 																	*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/basic/mzg_modules_importation.js] -- 
// before loading other modules -----------------------------------------------------------------------
var pjson = require('./package.json');
var GLOUPS_VERSION = pjson.version;
process.title = 'Gloups ' + GLOUPS_VERSION + ' | Chears !';
// ------------------------------------------------------------------------------------------------

var gulp = require('gulp');
var chalk = require('chalk'); //https://www.npmjs.com/package/chalk

var M = {
	// A ----------------------------------------------------------------------------------------------
	autoprefixer: 'gulp-autoprefixer',
	// B ----------------------------------------------------------------------------------------------
	//babel : 'gulp-babel', // for fixing uglify with ES6 version
	// C ----------------------------------------------------------------------------------------------
	cleanCSS: 'gulp-clean-css',
	clear: 'clear',
	coffee: 'gulp-coffee',
	concat: 'gulp-concat',
	// D ----------------------------------------------------------------------------------------------
	del: 'del',
	// E ----------------------------------------------------------------------------------------------
	exit: 'gulp-exit',
	// F ----------------------------------------------------------------------------------------------
	fs: "fs", // check file existance
	fssync: "fs-sync",
	// I ----------------------------------------------------------------------------------------------
	insert: 'gulp-insert',
	// J ----------------------------------------------------------------------------------------------
	jsValidate: 'gulp-jsvalidate',
	// L ----------------------------------------------------------------------------------------------
	lazyPipe: 'lazypipe',
	less: 'gulp-less',
	// N ----------------------------------------------------------------------------------------------
	nop: 'gulp-nop', // for alternate manipulations where no operations is needed
	// P ----------------------------------------------------------------------------------------------
	path: 'path',
	// R ----------------------------------------------------------------------------------------------
	rename: "gulp-rename",
	replace: "gulp-replace",
	// S ----------------------------------------------------------------------------------------------
	sass: 'gulp-sass',
	sourcemaps: 'gulp-sourcemaps',
	stylefmt: 'gulp-stylefmt',
	stylus: 'gulp-stylus',
	// T ----------------------------------------------------------------------------------------------
	through: 'through2', // to write custom pipe functions
	ts: 'gulp-typescript',
	// U ----------------------------------------------------------------------------------------------
	uglify: 'gulp-uglifyes',
	// W ----------------------------------------------------------------------------------------------
	wait: 'gulp-wait',
};

// -- [supports/basic/mzg_vars.js] -- 
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
	't': 'typescript',
	'c': 'coffeescript',

	// styles
	's1': 'less',
	's2': 'sass',
	's3': 'stylus',

	// minifications
	'minj': 'automin',
	'minc': 'autominCss',

	// advanced 
	'tr': 'transitive',
	'es': 'essential',

	// presets
	'a': 'all',
	'all': 'automin typescript coffeescript autominCss less sass stylus',

	'styles': 'autominCss less sass stylus',

	'js': 'automin typescript coffeescript'
};

var PRESET_OPTIONS = "all|styles|js";
var SERVICES_OPTIONS = "automin|autominCss|typescript|coffeescript|less|sass|stylus";
var SERVICES_ADVANCED_OPTIONS = "transitive|essential";

var ALL_SERVICES_OPTIONS = PRESET_OPTIONS + '|' + SERVICES_OPTIONS + '|' + SERVICES_ADVANCED_OPTIONS;

var JS_REGEX_FILE_PATH_PATTERN = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

var GLOUPS_OPTIONS = SERVICES_OPTIONS + '|' + PRESET_OPTIONS;

var SILENT_TASKS = "watch|vet|unit-test|integration-test";
var ISALL = true;

var isdist = {};

// https://stackoverflow.com/questions/43064924/how-to-target-all-browsers-with-gulp-auto-prefixer
var AUTOPREFIXER_BROWSERS = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'];

var DEFAULT_CONFIG = {
	// See 'serviceMapping' project setup task
	"verbose": false, // true to enable set vars verbose

	"pathesToJs": [],
	"pathesToTs": [],
	"pathesToCoffee": [],
	"pathesToStyle": [],
	"pathesToStyleLess": [],
	"pathesToSass": [],
	"pathesToStylus": [],
	"projects": []
};

// Sets things up to serve
var config = getConfig();

var glob_found_modules = {
	'fs': true
};

var glob_visited_elements = {
	'infunc': {},
	'intask': {}
};

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
	'supports/basic/mzg_jshint_specifications.js',
	'supports/rewriting/log_sections/mzg_log1.js', // section

	'supports/basic/mzg_modules_importation.js',
	'supports/basic/mzg_vars.js',

	'supports/rewriting/mzg_rewriting_vars.js', // rewrite // 4

	'supports/rewriting/log_sections/mzg_log15.js', // section
	'supports/files/mzg_stable_reading_file_class.js',

	'supports/rewriting/log_sections/mzg_log2.js', // section

	'supports/basic/mzg_stable_funcs.js',
	'supports/basic/mzg_modules_requesting.js', // 9

	'supports/rewriting/log_sections/mzg_log3.js', // section

	'supports/basic/tasks/mzg_default_task.js',
	'supports/basic/tasks/mzg_clear_task.js',
	'supports/basic/tasks/mzg_externalize_config_task.js', // 13
	'projects_setup_tasks/mzg_set_vars_task.js',
	'supports/basic/tasks/mzg_set_params_task.js',
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
	'services_tasks/js_tasks/mzg_tyepscript_task.js',
	'services_tasks/js_tasks/mzg_coffeescript_task.js', // 25

	'supports/rewriting/log_sections/mzg_log7.js', // section

	// css
	'services_tasks/css_tasks/mzg_automin_css_task.js',
	'services_tasks/css_tasks/mzg_less_task.js',
	'services_tasks/css_tasks/mzg_sass_task.js',
	'services_tasks/css_tasks/mzg_stylus_task.js',

	'supports/rewriting/log_sections/mzg_log8.js', // section

	// other
	'services_tasks/mzg_other_oriented_tasks.js',

	'supports/rewriting/log_sections/mzg_log16.js', // section // 33
	'supports/files/mzg_module_seeking_funcs.js', // 34

	'supports/rewriting/log_sections/mzg_log9.js', // section

	// services : consumming + lazyprocess + wrapping + lisencing
	'services_tasks/funcs/mzg_run_task_process_for.js',
	'services_tasks/funcs/mzg_main_pipe_wrapping.js',
	'services_tasks/funcs/mzg_tasks_micro_services.js',

	'supports/mzg_changed_files_logging.js',

	'services_tasks/funcs/mzg_lisences_handeling.js',
	'services_tasks/funcs/mzg_services_funcs.js',

	'supports/rewriting/log_sections/mzg_log10.js', // section

	'supports/rewriting/tasks/mzg_apply_temp_task.js',
	'supports/rewriting/tasks/mzg_apply_dist_task.js',
	'supports/rewriting/tasks/mzg_write_temp_task.js',
	'supports/rewriting/tasks/mzg_write_dist_task.js',
	'supports/rewriting/tasks/mzg_rewrite_task.js',

	'supports/rewriting/log_sections/mzg_log11.js', // section 

	'supports/mzg_runtask.js', 

	'supports/rewriting/log_sections/mzg_log12.js', // section // 50

	'supports/files/configurationSetting/mzg_config_funcs.js', 
	'supports/projects/mzg_projects_funcs.js',
	'supports/mzg_argument_funcs.js',

	'supports/rewriting/log_sections/mzg_log13.js', // section

	'supports/rewriting/mzg_rewriting_funcs.js',
	'supports/rewriting/mzg_rewrite_arguments_func.js',

	'supports/rewriting/log_sections/mzg_log14.js', // section
	'supports/mzg_logging.js'
];

var distFiles = mzgFiles.slice();

distFiles.splice(54, 3);
distFiles.splice(39, 6);
distFiles.splice(33, 2);
distFiles.splice(13, 1);
distFiles.splice(9, 1);
distFiles.splice(4, 1);

isdist.NOT_DISTRIBUTION = true;
/*	*************************************************************************************************************************************************************************************************
	*                                 										CLASSES : Classes for configuration purpose 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/files/mzg_stable_reading_file_class.js] -- 
class classReading {
    constructor() {
        this.line_ = null;
        this.data_ = null;
        this.iter_ = null;
        this.stopped_ = false;
    }

    initialize(data, iter) {
        this.data_ = data + ' ';
        this.iter_ = iter;
        this.line_ = [];
    }

    readLines(processingLine) {
        var c;
        while ((!this.stopped) && (c = this.getNextChar())) {

            // the line feed is encontoured 
            if (/^[\n\r]$/g.test(c) || this.isEndReached()) {
                this.toLine();
                processingLine(this.line);
                this.resetLine();
            }

            // just add the character
            else {
                this.feed(c);
            }
        }
    }

    stop() {
        this.stopped = true;
    }

    get stopped() {
        return this.stopped_;
    }

    set stopped(stopped) {
        this.stopped_ = stopped;
    }

    get iter() {
        return this.iter_;
    }

    set iter(iter) {
        this.iter_ = iter;
    }

    get data() {
        return this.data_;
    }

    set data(data) {
        this.data_ = data;
    }

    get line() {
        return this.line_;
    }

    set line(line) {
        this.line_ = line;
    }

    toLine() {
        this.line = this.line.join("");
        this.line = this.line.replace(/^[\n\r]$/g, '');
    }

    resetLine() {
        this.line = [];
    }

    getNextChar() {
        return this.data[this.iter++];
    }

    isEndReached() {
        return !this.data[this.iter];
    }

    feed(char) {
        this.line_.push(char);
    }
}
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
				process.stdout.write('\x1B');
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

function getModule(module) {

	if (typeof module == "string") {
		for (var name in M) {
			if (M[name] == module) {
				var dStart = new Date();
				M[name] = require(module);
				// logging the time elapsed
				var dResult = ms2Time(new Date() - dStart);

				if (isdist.NOT_DISTRIBUTION) {
					console.log(forNowShortLog(" {0}{1} loaded after {2}".format([
						chalk.bgMagenta(' M:'),
						chalk.bgMagenta(module + ' '),
						chalk.magenta(dResult)
					])));
				}
				return M[name];
			}
		}
	}
	return module;
}

var logOrig = console.log;

function gloupslog(args){
	logOrig(args);
}

var mayLogEssentials = metAllArgs(['essential']);

if(mayLogEssentials){
	console.log=function(){};
	gloupslog(forNowShortLog(chalk.bgRed(' Logging only essential messages ')));
}


// -- [supports/basic/mzg_modules_requesting.js] -- 
// gloups commandes
if (process.argv[2] == '--gulpfile') {
	if (process.argv[4] && !/^serve|rewrite$/.test(process.argv[4])) {
		importNeededModules('intask', process.argv[4]);
	}
} else {
	if (process.argv[2] && !/^serve|rewrite$/.test(process.argv[2])) {
		importNeededModules('intask', process.argv[2]);
	}
}
 /*	*************************************************************************************************************************************************************************************************
	*                                 							PROJECT TASKS : Tasks used to manage and setup custom configuration project 														*
 	*************************************************************************************************************************************************************************************************/


// -- [supports/basic/tasks/mzg_default_task.js] -- 
// define the default task and add the watch task to it
gulp.task('default', ["setParams"]);

// -- [supports/basic/tasks/mzg_clear_task.js] -- 
gulp.task('clear', function() {
	(M.clear)();
});

// -- [supports/basic/tasks/mzg_externalize_config_task.js] -- 
gulp.task('externalizeConfig', function(cb){
  (M.fs).writeFile('config.json', JSON.stringify(config,null,4), cb);
});

// -- [projects_setup_tasks/mzg_set_vars_task.js] -- 
gulp.task('setVars', function() {
    setConfig();
    if (isdist.NOT_DISTRIBUTION) {
        getModule(M.path);
    }

    if (!config.verbose) {
        logTaskPurpose(this.currentTask.name);
    }
    for (var p_path in config.projects) {
        var project = config.projects[p_path];
        if (M.fssync.exists(project.path + '\\config.mzg.json')) {
            console.log(' '+chalk.bgGreen(' '+project.project+' '));
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
        mappSassMatching(projectPath, watchPathForSass);
    }

    // gulp.task("externalizeConfig") is never undefined
    // so check if a NOT_DISTRIBUTION key is found or not
    if (isdist.NOT_DISTRIBUTION) {
        if (!config.verbose) {
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
		process.title = 'Gloups {0} | {1}'.format([GLOUPS_VERSION, 'Serve']);
		tasks = tasksToRunOnArgvs();

		if (isdist.NOT_DISTRIBUTION) {
			getAllNeededModules(tasks.concat(['setVars']));
		}

		gulp.start(tasks.length > 0 ? ['setVars'].concat(tasks) : []);

		// the fisrt task met is rewrite
	} else if (/^rewrite$/.test(firstTaskName)) {
		process.title = 'Gloups {0} | {1}'.format([GLOUPS_VERSION, 'Rewrite']);
		var _services = configurationOfRewriteOnArvs();
		var stayBeautiful = !/^ugly$/.test(_services.uglyness);
		var watchOnce = !/^multiple$/.test(_services.times);

		if (isdist.NOT_DISTRIBUTION) {
			getAllNeededModules(['rewrite', 'writeTemp', 'writeDist', 'applyTemp', 'applyDist']);
		}
		//getModule(M.nop);

		logTaskName("rewrite {0}-{1} mode".format([
				(stayBeautiful ? "imBeauty" : "imUgly"),
				(watchOnce ? "one shot" : "watching")
			])
		);
		mergingOnChanges(stayBeautiful, watchOnce);
		(stayBeautiful ? logTaskEndBeauty : logTaskEndUgly)(watchOnce);
	}
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
        if (!M.fssync.exists(project.path + '\\config.mzg.json')) {
            console.log("file :" + logFilePath(project.path + '\\config.mzg.json') + ' does not exist ... creation very soon');
            gulp.src('custom/config_model.json')
                .pipe((M.rename)('config.mzg.json'))
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
gulp.task('automin', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': "gulp-uglify",

		// defines what files extension are allowed to be processed
		'rules': [JS_REGEX_FILE_PATH_PATTERN, ['!', /.*(?:.min.js|.lisence.js)$/]],

		// gathers comments that define lisences
		'lisences': null,

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': null
	};

	obj.mainPipe = (M.lazyPipe)()
		.pipe((M.uglify))
		.pipe(renameSuffixMin);

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForCompression(this, config.pathesToJs, obj);
});

// -- [services_tasks/js_tasks/mzg_tyepscript_task.js] -- 
gulp.task('typescript', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-typescript',

		// defines what files extension are allowed to be processed
		'rules': [/.*.ts$/],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(function() {
				return (M.ts)({
					noImplicitAny: true
				});
			}),

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToTs, obj);
});

// -- [services_tasks/js_tasks/mzg_coffeescript_task.js] -- 
gulp.task('coffeescript', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-coffee',

		// defines what files extension are allowed to be processed
		'rules': [/.*.coffee$/],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(function() {
				return (M.coffee)({
					bare: true
				});
			}),

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToCoffee, obj);
});
/*	*************************************************************************************************************************************************************************************************
	*                                 													OTHER ORIENTED TASKS 																						*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/css_tasks/mzg_automin_css_task.js] -- 
gulp.task('autominCss', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': "gulp-clean-css",

		// defines what files extension are allowed to be processed
		'rules': [/^.*.css$/, ['!', /^.*(?:.min.css|.lisence.css|.less|.scss|.map)$/]],

		// gathers comments that define lisences
		'lisences': null,

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': null
	};

	obj.mainPipe = (M.lazyPipe)()
		.pipe(autoprefix)
		.pipe(cleanCssMinification)
		.pipe(renameSuffixMin);

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForCompression(this, config.pathesToStyle, obj);
});

// -- [services_tasks/css_tasks/mzg_less_task.js] -- 
gulp.task('less', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-less',

		// defines what files extension are allowed to be processed
		'rules': [/.*.less$/],

		// gathers comments that define lisences
		'lisences': null,

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': null,

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	obj.mainPipe = (M.lazyPipe)()
		.pipe(function() {
			return (M.less)({
				paths: [(M.path).join(__dirname, 'less', 'includes')]
			});
		})
		.pipe(autoprefix)
		.pipe((M.stylefmt));

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToStyleLess, obj);
});

// -- [services_tasks/css_tasks/mzg_sass_task.js] -- 
gulp.task('sass', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-sass',

		// defines what files extension are allowed to be processed
		'rules': [/.*.scss$/],

		// gathers comments that define lisences
		'lisences': null,

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': null,

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {

			// getting the fileName and checking if its a qualified file to be process 
			// (not starting by undererscore "_.*");
			// else getting files refering it via @import inside them
			return getMatchingPrincipalSCSS(matchingEntry.projectPath, filePath.hackSlashes());
		}
	};

	obj.mainPipe = (M.lazyPipe)()
		.pipe(function() {
			return (M.sass)({
				indentedSyntax: false
			}).on('error', (M.sass).logError);
		})
		.pipe(autoprefix)
		.pipe((M.stylefmt));

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToSass, obj);
});

// -- [services_tasks/css_tasks/mzg_stylus_task.js] -- 
gulp.task('stylus', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-stylus',

		// defines what files extension are allowed to be processed
		'rules': [/.*.styl$/],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(function() {
				return (M.stylus)({
					'include css': true,
					linenos: true
				}) /*.on('error', sass.logError)*/ ;
			})
			.pipe(autoprefix)
			.pipe((M.stylefmt)),

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToStylus, obj);
});
/*	*************************************************************************************************************************************************************************************************
	*                                 										module configurations 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/mzg_other_oriented_tasks.js] -- 

/*	*************************************************************************************************************************************************************************************************
	*                                 								SYNTAXICS :	module seeking in gulpfile to optimize importation 																	*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/files/mzg_module_seeking_funcs.js] -- 
function getAllNeededModules(tasks) {
	gloupslog("\n SYNTAXICALY {1} FROM {0} ...".format([logFilePath("gulpfile.js"), chalk.bgMagenta(' IMPORTING MODULES ')]));
	console.log('\n');

	getModule(M.fs);
	seekInFoundElements('intask', JSON.stringify(tasks));

	importModulesFromFoundModules();
}

function importModulesFromFoundModules() {
	var dStart = new Date();

	Object.keys(glob_found_modules).forEach(function(element) {
		getModule(M[element]);
	});

	// logging the time elapsed
	var dResult = ms2Time(new Date() - dStart);

	console.log('\n');
	gloupslog(" SYNTAXICAL  {1} DONE IN {0}".format([chalk.magenta(dResult), chalk.bgMagenta(' IMPORT ')]));
	console.log('\n');
}

function importNeededModules(kind, search) {
	var match = /^(?:[\-]+(.*)|(.*))$/.exec(search);
	search = match[1] ? match[1] : match[2];

	console.log('\n');
	gloupslog(" SYNTAXICALY  {1} FROM {0} ...".format([logFilePath("gulpfile.js"), chalk.bgMagenta(' IMPORT MODULES ')]));
	console.log('\n');

	getModule(M.fs);

	var analyser = getAnalyser();
	var reading = initReading(analyser.file);

	Macro_Seek_Modules(reading, analyser, kind, search);

	importModulesFromFoundModules();
}

gulp.task('mapFonction', function() {
	importNeededModules();
});

function Macro_Seek_Modules(reading, analyser, kind, search) {
	var line, enc = 0;

	reading.readLines(function() {
		line = reading.line.replace(/\r?\n|\r/g, '');

		// while analysing syntaxicaly the file, say if wa encountered the function / task
		// and say via the analyser object if we are in a task or a function by its fields
		defineMatchingElement(analyser, line, search);

		// if we are in a function or a task we are searching ! and not another. 
		// If so, explore that element (read inside curlybraces of kind [in a task or in a funct])
		// matched
		if (analyser[kind] && search == {
				'intask': analyser.taskMatched,
				'infunc': analyser.functMatched
			}[kind]) {

			// opening and closing curlybraces
			if ((enc = (line.split("{").length - 1) + (line.split("}").length - 1)) % 2 == 0 && enc > 0) {
				whenModuleMatched(line);

				// not equal amount of opening and closing curlybraces ... need to dig deeper
			} else {

				// say when the count of opening and closing curlybraces equals to zero to tel
				// if we reached the end of a function or a task definition.
				defineLimits(analyser, line, enc);

				whenElementMatched(line);
			}
		}
	});
}

function getAnalyser() {
	return {
		'file': "gulpfile.js",
		'intask': false,
		'infunc': false,
		'taskMatched': '',
		'functMatched': '',
		'encounter': 0,
	};
}

function initReading(path) {
	var reading = new classReading();
	var _data = (M.fs).readFileSync(path, "utf8");
	reading.initialize(_data, 0);
	return reading;
}

function defineMatchingElement(analyser, line, search) {
	var match;
	// EX. MATCH >var funcName = function(...< OR >funcName function(...<
	if ((match = /^(?:(?:var[\s]+(\b.*\b)[\s=]+function[(].*)|(?:.*[\s]?function[\s]([^\s(]+).*))$/.exec(line))) {
		analyser.functMatched = match[1] ? match[1] : match[2];
		analyser.infunc = true;

	} else if ((match = /^gulp[.]task[(]["']([^\[\]]*)["'][,\s]*([\[](?:["'][\w]+["'][,\s]*)+[\]])?.*$/.exec(line))) {
		analyser.taskMatched = match[1];

		analyser.intask = true;

		if ((line.split("{").length - 1) == 0 && match[2] && search == match[1]) {
			analyser.intask = false;
			seekInFoundElements('intask', match[2]);
		}

		//analyser.intask = (enc = line.split("{").length - 1) > 0;
	}
}

function defineLimits(analyser, line, enc) {
	if ((enc = (line.split("{").length - 1)) > 0) {
		analyser.encounter += enc;
	}
	if ((enc = (line.split("}").length - 1)) > 0) {

		analyser.encounter -= enc;

		if (analyser.encounter == 0) {
			analyser.infunc = false;
		}
	}
}

function whenElementMatched(line) {
	var match;
	if (whenModuleMatched(line)) {
		// DONE, nothing to do here ... 
	} else if ((match = /^.*[\.]pipe[(]([\w]+).*$/.exec(line))) {
		if (!/^function|gulp$/.test(match[1])) {
			seekInFoundElements('infunc', match[1]);
		}
	} else if ((match = /^.*gulp[\.]start[(](?:(?:.*([\[](?:["'][\w]+["'],?)+[\]]))|(?:.*["']([\w]+)["'])).*$/.exec(line))) {
		seekInFoundElements('intask', match[1] ? match[1] : match[2]);

	} else if ((match = /^[^\"]*[^\.]+(\b[^\.]+\b)[(].*$/.exec(line))) {
		seekInFoundElements('infunc', match[1]);
	}
}

function whenModuleMatched(line) {
	var match;
	var result;
	if ((result = /^.*M[\.]([\w]+).*$/.exec(line))) {

		var regex = /M[\.]([\w]+)/g;
		while ((match = regex.exec(line))) {
			if (!glob_found_modules[match[1]]) {
				glob_found_modules[match[1]] = true;
			}
		}
	}
	return result;
}

/**
 * @param  {String} elements : name(s) of functions or tasks. 
 * Multiple elements have to follow the array JSON string format => '["e1","e2","eN"]'
 */
function seekInFoundElements(kind, elements) {
	var list = [];

	// multiple elements (an array JSON string formated) 
	// EX.MATCH >["e1","e2","eN"]<
	if (/^([\[](?:["'][\w]+["'][,\s]*)+[\]])$/.test(elements)) {

		elements = elements.replace(/[\']/g, '"');
		list = JSON.parse(elements);

		// single element (a string)
	} else {
		list.push(elements);
	}

	list.forEach(function(element) {
		if (!glob_visited_elements[kind][element]) {
			glob_visited_elements[kind][element] = true;
			var analyser = getAnalyser();
			var r = initReading(analyser.file);

			// recursion if called by Macro_Seek_Modules. Check the matched function(s) or task(s).
			Macro_Seek_Modules(r, analyser, kind, element);
		}
	});
}
/*	*************************************************************************************************************************************************************************************************
	*                                 										SERVICES FUNCS : functions used in services 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [services_tasks/funcs/mzg_run_task_process_for.js] -- 
function runTaskProcessForCompression(athis, pathesTo, obj) {
	logTaskPurpose(athis.currentTask.name);

	var mainLazyPipeObj = createMainLazyPipeObject(pathesTo, "Compressed    ", obj.module);

	// watch every single file matching those paths
	var wl = watchList(pathesTo);

	// no transitivity for compression because the compression is a B step out of ABC
	// where A is the first and C the last step
	var glob_transitivity = null;

	gulp.watch(wl, function(event) {

		var filePath = event.path;

		// checking for extensions matching
		if (checkMultipleRules(filePath, [event.type !== "deleted"].concat(obj.rules))) {

			// set the filepath to the object
			mainLazyPipeObj.forMatchingObj.path = filePath;

			// find the config through the json and getting watch ; dest ; sourcemapp etc.
			var matchingEntry = getMatchingEntryConfig(filePath, pathesTo);

			// indicate what watch rule, the destination folder, and if there are sourcemaps.
			mainLazyPipeObj.pathesDescr = matchingEntry;

			// set the variant pipe part to the process. It will be wrapped in sourcemapps 
			// and the transitivity will have to be calculate (not really needed here )
			mainLazyPipeObj.process = obj.mainPipe;

			mainLazyPipeObj.source_kind = 'simple';

			// COMPUTE THE LAZYPIPE AND DYNAMIC BEHAVIORS -------------------------------------
			consumePipeProcss(glob_transitivity, mainLazyPipeObj, [filePath]);
		}
	});
}

function runTaskProcessForPrecompiledFiles(athis, pathesTo, obj) {
	logTaskPurpose(athis.currentTask.name);

	var mainLazyPipeObj = createMainLazyPipeObject(pathesTo, "Processed     ", obj.module);

	// watch every single file matching those paths
	var wl = watchList(pathesTo);

	// preconfigure a default "global" object for transitivity 
	var glob_transitivity = getFreshTransitivity();

	// passing the watch list
	gulp.watch(wl, function(event) {

		var filePath = event.path;

		if (checkMultipleRules(filePath, obj.rules)) {

			// set the filepath to the object 
			mainLazyPipeObj.forMatchingObj.path = filePath;

			// find the config through the json and getting watch ; dest ; sourcemapp etc.
			var matchingEntry = getMatchingEntryConfig(filePath, pathesTo);

			// LAZYPIPE : main pipeline to provide SASS service -------------------------------
			mainLazyPipeObj.process = obj.mainPipe;

			// focus on files importing other via @import
			var realTargets = obj.realTargetsFunction(filePath, matchingEntry);

			mainLazyPipeObj.source_kind = 'complex';

			// COMPUTE THE LAZYPIPE AND DYNAMIC BEHAVIORS -------------------------------------
			consumePipeProcss(glob_transitivity, mainLazyPipeObj, realTargets);
		}
	});
}

function consumePipeProcss(glob_transitivity, mainLazyPipeObj, realTargets) {

	var sourceMappedProcess = transitiveAndSourcemappingWrap(glob_transitivity, mainLazyPipeObj);

	// OVERWRITING DEFAULT DESTINATION ------------------------------------------------------------
	mainLazyPipeObj.destCallBack = function(haslog) {

		if (haslog) {
			gloupslog('');
			logChangedRealTargetedFiles(mainLazyPipeObj, realTargets);
		}

		var destPath = glob_transitivity != null ?
			glob_transitivity.dest :
			mainLazyPipeObj.pathesDescr.dest; // must be defined for non transitive services

		return destPath;
	};

	// CONSUMMING ---------------------------------------------------------------------------------
	gulp.src(realTargets)
		.pipe(sourceMappedProcess())
		.pipe(applyLicenceSplitting(mainLazyPipeObj))
		.pipe(gulp.dest(mainLazyPipeObj.destCallBack(true)));
}


// -- [services_tasks/funcs/mzg_main_pipe_wrapping.js] -- 
function transitiveAndSourcemappingWrap(glob_transitivity, mainLazyPipeObj) {

	// UNBOXING -----------------------------------------------------------------------------------
	var forMatchingObj = mainLazyPipeObj.forMatchingObj,
		path = forMatchingObj.path,
		pathesDescription = forMatchingObj.pathesDescr; // pathesToJs/CSS/SASS/etc. ...;
	var message = mainLazyPipeObj.message;

	// find the config through the json and getting watch ; dest ; sourcemapp etc.
	var matchingEntry = getMatchingEntryConfig(path, pathesDescription);

	// LAZYPIPE wrapping transitivity and sourcemapping -------------------------------
	var thinkTransitively = transitiveWrapAround(glob_transitivity, matchingEntry, path, mainLazyPipeObj);
	var sourceMappedProcess = setSourceMappingAndSign(thinkTransitively, matchingEntry, message);

	return sourceMappedProcess;
}

function setSourceMappingAndSign(lazyPipeProcess, matchingEntry, sign) {
	var sourcemapping = matchingEntry.sourcemaps;
	return (M.lazyPipe)()

		// if sourcemaps desired initialize them or do nothing
		.pipe(sourcemapping ?
			(M.sourcemaps).init :
			(M.nop))

		// transitivity handleing here in general
		.pipe(lazyPipeProcess)

		// put a sign after the end of the file stream to indicate it used Gloups and some modules
		.pipe(insertSignatureAfter, sign.action, sign.module)

		// if sourcemaps desired write them or do nothing
		.pipe(sourcemapping ?
			function() {
				return (M.sourcemaps).write('./');
			} :
			(M.nop));
}

function transitiveWrapAround(glob_transitivity, matchingEntry, path, mainLazyPipeObj) {

	// do not let the default draft folder as a destination, change it straight away
	if (glob_transitivity != null && glob_transitivity.dest == "draft") {
		transitivitySetupCore(glob_transitivity, matchingEntry, path);
	}

	// if high leveled services, make a lazypipe where the transitivity is applied
	var lzpTransitivityApplied = glob_transitivity != null ?
		(M.lazyPipe)()
		.pipe(transitivitySetup, glob_transitivity, matchingEntry, path) :

		// else do nothing
		(M.nop);

	// if high leveled services, make a lazypipe compressed and suffixed
	var lzpTransitivityCompression = glob_transitivity != null ?
		(M.lazyPipe)()
		.pipe(glob_transitivity.suffixing)
		.pipe(glob_transitivity.compressing) :

		// else do nothing
		(M.nop);

	return applyLazyPipeSet({
		opening: lzpTransitivityApplied,
		closing: lzpTransitivityCompression,
		main: mainLazyPipeObj
	});
}

function applyLazyPipeSet(obj) {
	var lazyPipeProcess = obj.main.process;
	var source_kind = obj.main.source_kind;

	if (source_kind == 'simple') {
		return (M.lazyPipe)()
			.pipe(obj.opening)
			.pipe(lisencesSetup(lazyPipeProcess))
			.pipe(separateLisences(lazyPipeProcess))
			.pipe(lazyPipeProcess)
			.pipe(separatePrehamptedLisences(lazyPipeProcess))
			.pipe(obj.closing);

	} else if (source_kind == 'complex') {
		var istransitive = metAllArgs(['transitive']);

		return (M.lazyPipe)()
			.pipe(obj.opening)
			.pipe(lisencesSetup(lazyPipeProcess))
			.pipe(lazyPipeProcess)
			.pipe(separateLisences(lazyPipeProcess, istransitive))
			.pipe(obj.closing);
	}
}

function transitivitySetup(transitivity, matchingEntry, path) {
	return (M.through).obj(function(chunk, enc, callback) {
		transitivitySetupCore(transitivity, matchingEntry, path);
		callback(null, chunk);
	});
}

function transitivitySetupCore(transitivity, matchingEntry, path) {
	var shouldBeTransitive =
		metAllArgs(['all', 'transitive']) ||

		// CSS focused
		metAllArgs(['sass', 'autominCss', 'transitive']) ||
		metAllArgs(['stylus', 'autominCss', 'transitive']) ||
		metAllArgs(['less', 'autominCss', 'transitive']) ||

		// JS focused
		metAllArgs(['coffeescript', 'automin', 'transitive']) ||
		metAllArgs(['typescript', 'automin', 'transitive']);

	var found = false;

	// by default the transitivity is set to the path the result should be the destination
	transitivity.dest = matchingEntry.dest;

	if (shouldBeTransitive) {
		var fileName = (/^.*[\/](.*)$/g.exec(path.hackSlashes()))[1];
		var focusedPathFileName = "{0}/{1}".format([matchingEntry.dest, fileName]);

		// define if it has to be transitive about CSS or JS
		// transitivityLike
		var trLike =
			/.*[.](coffee|ts)$/.test(fileName) ? 'JS' :
			/.*[.](scss|styl|less)$/.test(fileName) ? 'CSS' :
			'UNDEFINED';

		var pathesTo =
			trLike == 'JS' ? config.pathesToJs :
			trLike == 'CSS' ? config.pathesToStyle :
			null;

		// get the B step matching configuration and check if there is a matching from 
		// A step destination to B step wtching folder
		var matchingEntryFinal = getMatchingEntryConfig(focusedPathFileName, pathesTo);

		found = matchingEntryFinal != null;
		transitivity.should = found;

		if (found) {
			transitivity.compressing =
				trLike == 'JS' ? (M.uglify) :
				trLike == 'CSS' ? cleanCssMinification :
				(M.nop);

			transitivity.suffixing = renameSuffixMin;

			// substitution of matchingEntryConfig A step destination replaced by C step destination
			transitivity.dest = matchingEntryFinal.dest;
		}
	}
}

// -- [services_tasks/funcs/mzg_tasks_micro_services.js] -- 
function renameSuffixMin() {
	return (M.rename)({
		suffix: '.min'
	});
}

function cleanCssMinification() {
	return (M.cleanCSS)({
		'compatibility': 'ie8'
	});
}

function insertSignatureAfter(actionDone, thanksToModule) {
	return (M.insert).append("\n/* -- {1} wth Gloups v {2} - {3} | thanks to {4} -- */".format(
		[
			actionDone.replace(/[\s]+$/, ''),
			GLOUPS_VERSION,
			shortDateComputed(),
			thanksToModule
		]
	));
}

function autoprefix() {
	return (M.autoprefixer)({
		browsers: AUTOPREFIXER_BROWSERS,
		cascade: false
	});
}

// -- [supports/mzg_changed_files_logging.js] -- 
function logChangedRealTargetedFiles(mainLazyPipeObj, realTargets) {
	var descr = mainLazyPipeObj.forMatchingObj.pathesDescr;
	var pafn;
	var actionOnFile = mainLazyPipeObj.message.action;

	var cpt = 0;
	// call with logging of the time taken by the task
	if (realTargets.length > 1) {
		realTargets.forEach(function(file) {

			// the next time, do not output the action since it is the same
			if (cpt++ > 0)
				actionOnFile = '              ';

			// projectAndFileName
			pafn = getProjectNameWithFileFromPathDesc(descr, file);

			gloupslog(" {0} '{1}{2}'".format([actionOnFile, chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));

		});
	} else {
		var pathHackSlashed = realTargets[0].hackSlashes();

		// projectAndFileName
		pafn = getProjectNameWithFileFromPathDesc(descr, pathHackSlashed);

		gloupslog(" {0} '{1}{2}'".format([actionOnFile, chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));
	}
}

function getProjectNameWithFileFromPathDesc(descr, file) {

	var backedPath = /[^\/\\]*(\/.*)/.exec(file)[1];
	backedPath = ".." + backedPath;
	var projectName = '<PROJECT NM>';
	var fileName;

	for (var p in descr) {

		var projectPathPaternString = descr[p].projectPath.split("/").join('\\/') + '(.*)$';
		var projectPathPatern = new RegExp(projectPathPaternString, "g");
		var match = null;

		if ((match = projectPathPatern.exec(backedPath))) {
			projectName = descr[p].projectName;
			fileName = match[1];
			break;
		}
	}

	return {
		'projectName': projectName,
		'fileName': fileName
	};
}


// -- [services_tasks/funcs/mzg_lisences_handeling.js] -- 
function separateLisences(athis, isTransitive) {
	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {

				var _data =
					athis.lisences.source_kind == 'simple' ? (M.fs).readFileSync(chunk.path, "utf8") :
					athis.lisences.source_kind == 'complex' ? chunk._contents.toString() :
					""; // no content

				if (athis.lisences.source_kind == 'complex') {
					chunk._contents = distributeLisencesOutOfChunk(athis, isTransitive, _data);

					// the content must be buffered
					chunk._contents = Buffer.from(chunk._contents, 'utf8');

				} else if (athis.lisences.source_kind == 'simple') {
					athis.prehamptedData = _data;
				}

				cb(null, chunk);
			});
		});
}

function separatePrehamptedLisences(athis) {
	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {

				// get data back from athis and transforming it to string
				var prehamptedData = athis.prehamptedData;

				// nothing to affect with this because that lazypipe is used with simple services
				// which are not affected by the transitivity ...
				var isTransitive;

				chunk._contents = Buffer.from(distributeLisencesOutOfChunk(athis, isTransitive, prehamptedData), 'utf8');

				cb(null, chunk);
			});
		});
}

function lisencesSetup(athis) {

	athis.lisences = {
		data: '',
		source_kind: '',
	};

	return (M.lazyPipe)()
		.pipe(function() {
			return (M.through).obj(function(chunk, enc, cb) {
				athis.lisences.source_kind =
					/.*[.](?:scss|styl|less|ts|coffee)$/.test(chunk.path) ? "complex" :
					/.*[.](?:css|js)$/.test(chunk.path) ? 'simple' :
					'unknown';
				cb(null, chunk);
			});
		});
}

function aLazyPipeThatIsPipingLikeNop() {
	return (M.lazyPipe)()
		.pipe((M.nop));
}

function distributeLisencesOutOfChunk(athis, isTransitive, _data) {
	var result = readLisences(_data);
	athis.lisences.data = result.lisences;

	return isTransitive ? result.not_lisences : _data;
}

function readLisences(_data) {

	var reading = new classReading();
	reading.initialize(_data, 0);

	var readingLisenceObj = {
		reading: reading,
		line: '',
		cpt: 0,
		result: [],
		anti_result: [],
		canprint: false,
		inLisence: false
	};

	reading.readLines(function() {
		readingLisencesProcess(readingLisenceObj);
	});
	return {
		lisences: readingLisenceObj.result.join('\n'),
		not_lisences: readingLisenceObj.anti_result.join('\n')
	};
}

function readingLisencesProcess(R) { // R : reading object (specific to lisences reading)
	R.line = R.reading.line;
	R.canprint = false;
	if (/^.*(?:\/\*!).*(?:\*\/).*$/.test(R.line)) {
		R.canprint = true;
	} else if (/^.*(?:\/\*!).*$/.test(R.line)) {
		R.canprint = true;
		R.inLisence = true;
	} else if (R.inLisence && /^.*(?:\*\/).*$/.test(R.line)) {
		R.canprint = true;
		R.inLisence = false;
	}

	inLisenceProcess(R);
}

function inLisenceProcess(R) {
	if (R.inLisence) {
		if (R.line.length > 0) {
			R.canprint = true;

		} else if (++R.cpt % 3 == 2) {
			R.canprint = true;
		}

		if (R.line.length > 0) {
			R.cpt = 0;
		}
	}
	if (R.canprint) {
		R.result.push(R.line);
	} else {
		R.anti_result.push(R.line);
	}
}

function applyLicenceSplitting(mainLazyPipeObj) {
	return (M.through).obj(function(chunk, enc, cb) {
		var lisences = mainLazyPipeObj.process.lisences;

		if (lisences && lisences.data != '') {
			var match = /^.*[\/\\]([^\.]+).*[.](css|js)$/.exec(chunk.path.hackSlashes());

			// The only transformation that can wiped the comments (lisences) out is 
			// minification so otherwise lisences are saved
			if (match && /^.*[.]min[.].*$/.test(chunk.path.hackSlashes())) {
				var dest = mainLazyPipeObj.destCallBack(false);

				var finalLisenseFilePath = dest + '/' + match[1] + '.lisence.' + match[2];

				(M.fssync).write(finalLisenseFilePath, "{0} \n/* -- {1} with Gloups v {2} - {3} | thanks to {4} -- */".format([
						lisences.data,
						'Lisence(s) exported',
						GLOUPS_VERSION,
						shortDateComputed(),
						'gulp-through2 ; gulp-fssync'
					]),
					'utf8'
				);

				var descr = mainLazyPipeObj.forMatchingObj.pathesDescr;

				// projectAndFileName
				var pafn = getProjectNameWithFileFromPathDesc(descr, finalLisenseFilePath.hackSlashes());

				gloupslog(" {0} '{1}{2}'".format(['Lis. reported ', chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));
			}

		}
		cb(null, chunk);
	});
}

// -- [services_tasks/funcs/mzg_services_funcs.js] -- 
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
	var m = /^.*[\/\\](.*)$/.exec(path);

	// filter to not let pass files starting by underscores "_.*"
	if (m && m[1] && /^_.*$/.test(m[1])) {

		// removing the underscor and the extension to match the import definition and 
		// then the value in configuration
		m = /^(.*[\\\/])_?(.*)[.].*$/g.exec(path);
		var normalized = m[1] + m[2];

		var ppl = projectPath.length; // path to project length
		var lpp = path.substr(ppl); // local path to the partial 

		// ellipsizing the path to get a match with
		var ellipsedPath = pathEllipzizeing(normalized, 0, (lpp.split("/").length));

		var matchings = [];
		var matchingDef = config.sassMaching;
		for (var i in matchingDef) {

			// if an ellipsized path match for a project, ad the filepath targeting.
			if (contains(matchingDef[i].partials, ellipsedPath)) {
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
		'compressing': (M.nop),
		'suffixing': (M.nop)
	};
}

function createMainLazyPipeObject(pathesDescript, action, thanksModules) {
	return {
		'process': null,
		'destCallBack': function() {
			//use <this> to refere to forMatchingObj here or into rewriting of callbacks 
			return gulp.dest("draft");
		},
		'forMatchingObj': {
			'path': null,
			'pathesDescr': pathesDescript
		},
		'message': {
			'action': action,
			'module': thanksModules,
			'files': []
		}
	};
}

function checkMultipleRules(inputString, mixinRulesArr, index) {
	index = index != undefined ? index : 0;

	var rule = mixinRulesArr[index];
	var result = true;

	// undefined or false if it is the result of a boolean
	if (rule != undefined) {
		if (typeof rule == 'boolean') {
			result = result && (rule ? checkMultipleRules(inputString, mixinRulesArr, ++index) : false);
		}
		// an array is used to store inverter and a rule
		else if (typeof rule == 'object') {
			if (rule instanceof Array) {
				if (typeof rule[1] == "string") {
					rule[1] = new RegExp(rule[1], 'g');
				}
                result = rule[0] == '!' && !rule[1].test(inputString);

			} else if (rule instanceof RegExp) {
				result = result && (result ? checkMultipleRules(inputString, mixinRulesArr, ++index) : false);
			} else {
				gloupslog(chalk.red('undefined case ...'));
				return false;
			}

		} else if (typeof rule == 'string') {
			result = new RegExp(rule, 'g').test(inputString);
			result = result && (result ? checkMultipleRules(inputString, mixinRulesArr, ++index) : false);

		} else {
			gloupslog(chalk.red('undefined case ...'));
			return false;
		}
	}
	return result;
}
/*	*************************************************************************************************************************************************************************************************
	*                                 										REWRITING TASKS : Tasks Changing gulpfile.js 																			*
 	*************************************************************************************************************************************************************************************************/

// -- [supports/rewriting/tasks/mzg_apply_temp_task.js] -- 
gulp.task('applyTemp', function() {
    gulp.watch(gulpFileTempPath, function(event) {
        if (gulp.src(gulpFileTempPath).pipe((M.jsValidate)())) {
            console.log(forNowShortLog("{0} is {1}", [logFilePath("gulpfile.js"), chalk.green('validate')]));
            var dStart = new Date();

            gulp.src(gulpFileTempPath)
                .pipe((M.insert).prepend('"use strict";\n'))
                .pipe((M.rename)('gulpfile.js'))
                .pipe(gulp.dest(function(file) {

                    var dResult = ms2Time(new Date() - dStart);
                    gloupslog(forNowShortLog("{0} replaced after {1}", [chalk.cyan("gulpfile.js"), chalk.magenta(dResult)]));

                    //gulp folder
                    var folder = getGulpfolderFromFileBase(file);
                    return folder;
                }))
                .pipe((RewriteServices.times == 'multiple' ?(M.nop) : (M.exit))());
        }
    });
});

// -- [supports/rewriting/tasks/mzg_apply_dist_task.js] -- 
gulp.task('applyDist', function() {

	gulp.watch(gulpFileTempPath2, function(event) {

		if (gulp.src(gulpFileTempPath2).pipe((M.jsValidate)())) {
			var dStart = new Date();

			gulp.src(gulpFileTempPath2)
				.pipe((M.rename)('gulpfile.js'))
				.pipe((M.insert).prepend('/*jshint esversion: 6 */\n/*jshint ignore:start */\n'))
				.pipe(gulp.dest(function(file) {
					var folder = getGulpfolderFromFileBase(file);
					var dResult = ms2Time(new Date() - dStart);
					console.log(forNowShortLog("Gulp project distribution generated under {0} after {1}", [logFilePath(folder + '/dist'), chalk.magenta(dResult)]));
					return folder + '/dist';
				}))
				.pipe((M.through).obj(function(chunk, enc, cb) {
					M.fssync.copy('help.md', 'dist/help.md');

					M.fssync.copy('custom/project_mapping_model.json', 'dist/custom/config.json');
					M.fssync.copy('custom/config_model.json', 'dist/custom/config_model.json');
					M.fssync.copy('package.json', 'dist/package.json');
					M.fssync.copy('gloups.bat', 'dist/gloups.bat');
					cb(null, chunk);
				}));

		}
	});
});

// -- [supports/rewriting/tasks/mzg_write_temp_task.js] -- 
gulp.task('writeTemp', function() {
    var dStart = new Date();

    var pathfile = '';
    if (gulp.src(mzgFiles).pipe((M.jsValidate)())) {
        gulp.src(mzgFiles)
            .pipe((M.insert).prepend(function(file) {
                pathfile = /^.*[\/\\](?:gloups|gulp|dist)[\/\\](.*)/.exec(file.path)[1];

                // outputing a comment with the file path if not a log_section file
                return !/^.*log_sections.*$/.test(pathfile) ?
                    // a path or nothing 
                    "\n// -- [{0}] -- \n".format([pathfile.hackSlashes()]) : "";
            }))
            .pipe((M.concat)(gulpFileTempPath))
            .pipe((stayBeautiful ? (M.nop) : (M.uglify))())
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

	if (gulp.src(distFiles).pipe((M.jsValidate)())) {

		gulp.src(distFiles)
			.pipe((M.concat)(gulpFileTempPath2))
			.pipe((M.replace)(/(getModule[(]M[\.][\w]+[)]+)/g, function(m) {
				var match = /(M[\.][\w]+)/g.exec(m)[1];
				return match;
			}))
			.pipe((M.replace)(/(M[\.][\w]+)/g, function(m) {
				return "getModule({0})".format([m]);
			}))
			.pipe((M.uglify)())
            .pipe(insertSignatureAfter("Provided", "gulp- uglify, replace, concat, insert"))
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
	return config ? config : DEFAULT_CONFIG;
}

function readJsonConfig(filePath) {
	var _data = (M.fs).readFileSync(filePath, "utf8");
	var reading = new classReading();
	reading.initialize(_data, 0);

	var m;
	var l;
	var commentBloc = 0;
	var has_smthng = true;
	var content = "";
	m = /^(.*)(\.json)$/.exec(filePath);
	var tempfile = m[1] + '.temp' + m[2];
    var tempfileVisual = m[1] + '2.temp' + m[2];

	// at any line read, 
	(M.fssync).write(tempfile, '', 'utf8');
	reading.readLines(function() {

		// stripping comments ---------------------------------------------------------------------
		l = reading.line;
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
                getModule(M.fs).appendFileSync(tempfileVisual, content + "\r\n", 'utf8');
                getModule(M.fs).appendFileSync(tempfile, /^[\s\t]*((?:[^\s\t]*[\s\t]*[^\s\t])+)[\s\t]*$/.exec(content)[1], 'utf8');
            }
		}
		// ----------------------------------------------------------------------------------------
	});
	
    var temp = getModule(M.fs).readFileSync(tempfile, "utf8");
    
    getModule(M.fssync).remove(tempfile);
    getModule(M.fssync).remove(tempfileVisual);

    return JSON.parse(temp.replace(/}(,)]/g,'}]'));
}

function setConfig() {
	config.projects = readJsonConfig("custom/config.json").projects;
}

function makePathesCoveringAllFilesFor(projectFolder, matchingForEntry, subpathToExtention, purpose) {

	var addon = matchingForEntry.addon;
	var entrySet = matchingForEntry.pathesToService;

	matchingForEntry.projectPath = projectFolder;

	if (addon) {
		for (var i = 0, t = addon.length; i < t; ++i) {
			// concatenate /**/*.ext to the watch folder
			addon[i].watch = addon[i].watch + subpathToExtention;

			var pathes = [addon[i].watch, addon[i].dest];

			if (0 < i) { // only the first time to avoid repeating the same purpose
				purpose = "[SAME-PURPOSE]";
			}

			var projectName = getProjectNameFromRootPath(projectFolder);

			logServiceActivatedPushed(purpose, projectName, addon[i]);

			// rebaseing the path to validate the watching
			addon[i].watch = projectFolder + "/" + addon[i].watch;
			addon[i].dest = projectFolder + "/" + addon[i].dest;
			addon[i].projectPath = projectFolder;
			addon[i].projectName = projectName;

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
        'pathesToService': (config.pathesToSass),
        'addon': projectServices.sass
    }, '/**/*.scss', 'Compile .scss files into .css files');

    config.pathesToStylus = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStylus),
        'addon': projectServices.stylus
    }, '/**/*.styl', 'Compile .styl files into .css files');
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

        // EX. >abc/efg/hij/klm/nop<
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

function watchListLight(configTab) {
    var list = [];

    configTab.forEach( function(element) {
        var watch = element.watch;

        var ppl = element.projectPath.length; // path to project length
        var lpp = watch.substr(ppl); // local path to the partial 

        list.push({'project':element.projectName,'watch':lpp});
    });
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

        pathsToSCSSPrimary.forEach(function(styleSheet) {
            config.sassMaching.push({
                identifier: styleSheet.fileName,
                target: styleSheet.path,
                partials: []
            });

            pushEllipsizedPartials(projectRootPath, styleSheet, i++);
        });
    }
    // ===========================================================================================================
}

function pushEllipsizedPartials(projectRootPath, styleSheet, index) {

    var reading = new classReading();
    var _data = (M.fs).readFileSync(styleSheet.path, "utf8");
    reading.initialize(_data, 0);

    var ppl = projectRootPath.length; // project path Length
    var l, m;

    reading.readLines(function() {
        l = reading.line;
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
    var files = (M.fs).readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if ((M.fs).statSync((M.path).join(dir, file)).isDirectory()) {
            filelist = walkSync(M.path.join(dir, file), filelist, regexFilter);
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

function getProjectNameFromRootPath(projectRootPath){
    var projects = getConfig().projects;
    for(var p in projects){
        if(projectRootPath == projects[p].path){
            return projects[p].project;
        }        
    }

    // default
    return projectRootPath;
}

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

    for (var service in subAr) {
        try {
            service = (/^[\-][\-]?([^\-]+)$/.exec(subAr[service]))[1];

            if (new RegExp("^\\b(" + PRESET_OPTIONS + ")\\b$").test(service)) {

                // check if a preset is single ; throws if not
                checkPresetsOverdose(++optionsCount, service);

                // convert the preset into a list of matching options
                effectiveServices = SERVICES[service].split(' ');

            } else {
                effectiveServices.push(service);
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

// -- [supports/rewriting/mzg_rewrite_arguments_func.js] -- 
function configurationOfRewriteOnArvs() {
    var argvs = translateAliassesInArgs(process.argv, RewriteServices);
    var subAr = getSliceOfMatchingOptions(argvs, "ugly|beauty|once|multiple");
    var matchOption;

    subAr.forEach(function(serv) {
        try {
            var opt = (/^--(.*)$/.exec(serv));

            if (opt && (matchOption = opt[1])) {
                RewriteServices.uglyness = matchOption == 'ugly' ? matchOption : RewriteServices.uglyness;
                RewriteServices.times = matchOption == 'multiple' ? matchOption : RewriteServices.times;
            }

        } catch (err) {/* nothing */}
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
	var _data = (M.fs).readFileSync("help.md", "utf8");
	var reading = new classReading();
	reading.initialize(_data, 0);
	var match, line;

	var cpt = 0;

	console.log("\n\n");
	reading.readLines(function() {
		line = reading.line.replace(/\r?\n|\r/g, '');

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
	// terminalCols
	gloupslog(" {0}  - SOMETHING IS WRONG \n".format([chalk.bgRed(' ' + project.project + ' ')]));
	gloupslog(" {0} {1}\n".format([logFilePath(project.path + '/config.mzg.json'), chalk.red(': MISMATCH')]));

	console.log(
		(getColoredParagraph(" The path to that folder does not match to an actual project root folder containing a config.mzg.json file.",chalk.bgRed)) +
		("\n\n {0}\n".format([chalk.bgWhite.black(' SOLUTION ')])) +
		('\n' + getColoredParagraph(" ", chalk.bgWhite.grey)) +
		(getColoredParagraph(" Check the path to see if there is no mistake and fix it in the project definition.", chalk.bgWhite.grey)) +
		('\n' + getColoredParagraph(" ", chalk.bgWhite.grey)) +
		(getColoredParagraph(" You can otherwise run the command to set up a configuration file at this path and also create nonexistent folders :", chalk.bgWhite.grey)) +
		('\n' + getColoredParagraph(" $ gulp scanProjects", chalk.bgWhite.black)) +
		(getColoredParagraph(" ", chalk.bgWhite.grey))
	);
}

function getColoredParagraph(paragraph, chalkColor) {
	var tc = process.stdout.columns;
	return chalkColor(paragraph + Array(tc - paragraph.length % tc).join(' '));
}

function logProcessCompleteOnFile(files, realAction, process) {
	try {
		// run the process treatment
		var dStart = new Date();
		process();

		// logging the time elapsed
		var dResult = ms2Time(new Date() - dStart);

		if (files.length > 1) {
			console.log(forNowShortLog("{0} of these files:\n".format([realAction])));
			files.forEach(function(file) {
				console.log(logFilePath(file));
			});
			console.log();
			console.log(forNowShortLog("after {0}".format([chalk.magenta(dResult)])));
		} else {
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

	var days = ["Mon", "Tues", "Wednes", "Thurth", "Fri", "Satur", "Sun"];
	return [days[date.getDay() - 1], "day,", [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("-")].join("");
}

function twodigits(num) {
	return ("0" + num).slice(-2)
}

function shortDateComputed() {
	var date = new Date();

	return [twodigits(date.getMonth() + 1), twodigits(date.getDate()), date.getFullYear()].join("-");
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

function logServiceActivatedPushed(purpose, projectName, addon) {
	if (config.verbose) {
		var match;

		if ((match = /^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose))) {
			console.log("{0}{1}{2}{3}{4}".format([chalk.grey(match[1]), chalk.magenta(match[2]), chalk.grey(match[3]), chalk.magenta(match[4]), chalk.grey(match[5])]));

		} else if ((match = /^([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose))) {
			console.log("{0}{1}{2}".format([chalk.grey(match[1]), chalk.magenta(match[2]), chalk.grey(match[3])]));
		}

		console.log(" Watch :'{0}{1}'\n Dest. :'{2}{3}'".format([
            chalk.bgCyan(' ' + projectName + ' '), chalk.cyan('/' + addon.watch + ' '),
            chalk.bgCyan(' ' + projectName + ' '), chalk.cyan('/' + addon.dest + ' ')
        ]));

		var sourcemaps = addon.sourcemaps;
		if (sourcemaps !== undefined) {
			console.log(sourcemaps ? '         ' + chalk.bgGreen(" Sourcemaps ! ") : '');
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
			'  See the mapping file to set Gloups able to serve your projects here :\n' +
			'  > ' + logFilePath('custom/config.mzg.ini') + ':\n',
		"automin": "" +
			"  Will uglify .js files matching the folowing path(s):\n",
		"typescript": "" +
			"  Will compile .ts files matching the folowing path(s):\n",
		"coffeescript": "" +
			"  Will compile .coffee files matching the folowing path(s):\n",
		"autominCss": "" +
			"  Will compress .css files matching the folowing path(s):\n",
		"less": "" +
			"  Will process .less files matching the folowing path(s):\n",
		"sass": "" +
			"  Will process .sass files matching the folowing path(s):\n",
		"stylus": "" +
			"  Will process .styl files matching the folowing path(s):\n",
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
		"sass": config.pathesToSass,
		"stylus": config.pathesToStylus
	};

	if (associations[taskName]) {
		var wl = watchListLight(associations[taskName]);

		wl.forEach(function(p, i) {
			console.log("    '{0}{1}'".format([chalk.bgCyan(' ' + p.project), chalk.cyan(p.watch + ' ')]));
		});
		console.log();
	}
}

function logTaskName(taskName) {
	console.log("\n {0}{1}\n".format(
        [chalk.bgWhite.black(' T:'), chalk.bgWhite.black(taskName + ' ')]
	));
}

function logTaskEndUgly(one_time) {
	console.log("      > which is uglyfied " + chalk.red("for performances"));
	if (one_time) {
		console.log("  once: " + chalk.red("not watching specific files") + "\n");
	} else {
		console.log();
	}
}

function logTaskEndBeauty(one_time) {
	console.log("      > which is beautifull " + chalk.red("for debugging") + "\n");
	if (one_time) {
		console.log("  once: " + chalk.red("not watching specific files") + "\n");
	} else {
		console.log();
	}
}