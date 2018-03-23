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
var coffee = require('gulp-coffee');
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
// logging
var gutil = require('gulp-util');
// H ----------------------------------------------------------------------------------------------
// I ----------------------------------------------------------------------------------------------
var insert = require('gulp-insert');
// J ----------------------------------------------------------------------------------------------
// error solved : http://kuebiko.blogspot.be/2016/01/gulp-jshint200-requires-peer-of.html
var jshint = require('gulp-jshint');
var jsValidate = require('gulp-jsvalidate');
// K ----------------------------------------------------------------------------------------------
// L ----------------------------------------------------------------------------------------------
var less = require('gulp-less');
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
// T ----------------------------------------------------------------------------------------------
// to write custom pipe functions
var through = require('through2');
var ts = require('gulp-typescript');
// U ----------------------------------------------------------------------------------------------
var uglify = require('gulp-uglify');
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

var PRESET_OPTIONS = "all|style|js|typescript|coffeescript";
var SERVICES_OPTIONS = "del|minjs|ts|coffee|less|sass|mincss";
var GLOUPS_OPTIONS = SERVICES_OPTIONS + "|" + PRESET_OPTIONS;

var GLOUPS_VERSION = "4.5";

var JS_REGEX_FILE_PATH_PATTERN = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

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
        if (fssync.exists(project.path + '\\config.mzg.json')) {
            console.log(chalk.green(project.project) + ' - OK');
            if (project.checked) {
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
        var _services        = configurationOfRewriteOnArvs();
        var stayBeautiful   = !/^ugly$/.test(_services.uglyness);
        var watchOnce       = !/^multiple$/.test(_services.times);

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
        if (!fssync.exists(project.path + '\\config.mzg.json')) {
            console.log("file :" + logFilePath(project.path + '\\config.mzg.json') + ' does not exist ... creation very soon')
            gulp.src('custom/config_model.json')
                .pipe(rename('config.mzg.json'))
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
        var regex = new RegExp(JS_REGEX_FILE_PATH_PATTERN, "g");
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

                        gutil.log("Compressed file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
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
        var regex = new RegExp(JS_REGEX_FILE_PATH_PATTERN, "g");
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
                    gutil.log("source folder here :\n" + breath() + "> " + logFilePath(dest));
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
                gutil.log("Compressed file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
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
                gutil.log("Compiled file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
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

                    var dest = getDestOfMatching(event.path, config.pathesToStyle);
                    gulp.src(event.path)
                        .pipe(sourcemaps.init())
                        .pipe(autoprefixer({
                            browsers: ['last 2 versions'],
                            cascade: false
                        }))
                        .pipe(cleanCSS({
                            compatibility: 'ie8'
                        })).pipe(rename({
                            suffix: '.min'
                        }))
                        .pipe(insert.append("\n/* -- Compressed with Gloups|"+GLOUPS_VERSION+" using gulp-clean-css -- */"))
                        .pipe(sourcemaps.write('./'))
                        .pipe(gulp.dest(function(file) {
                            gutil.log("Compressed file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
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

            console.log("once !");
            // process compilation of less files
            var process = function() {
                gulp.src(event.path)
                    .pipe(sourcemaps.init())
                    .pipe(autoprefixer({
                        browsers: ['last 2 versions'],
                        cascade: false
                    }))
                    .pipe(less({
                        paths: [path.join(__dirname, 'less', 'includes')]
                    }))
                    .pipe(insert.append("\n/* -- Compiled with Gloups|" + GLOUPS_VERSION + " using gulp-less -- */"))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToStyleLess);
                        var once;

                        if (once) {
                            gutil.log("Processed file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
                            once = false;
                        }

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
                    .pipe(sourcemaps.init())
                    .pipe(autoprefixer({
                        browsers: ['last 2 versions'],
                        cascade: false
                    }))
                    //.pipe(sass.sync().on('error', sass.logError))// synchronously
                    .pipe(sass().on('error', sass.logError))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(function(file) {
                        var dest = getDestOfMatching(file.path, config.pathesToSass);

                        gutil.log("Processed file version updated/created here :\n" + breath() + "> " + logFilePath(dest));
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
            gutil.log(logFilePath("gulpfile.js") + " is " + chalk.green('validate'));
            var dStart = new Date();

            gulp.src(gulpFileTempPath)
                .pipe(rename('gulpfile.js'))
                .pipe(gulp.dest(function(file) {

                    var dResult = ms2Time(new Date() - dStart);
                    gutil.log(chalk.cyan("gulpfile.js") + " replaced after " + chalk.magenta(dResult));

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
                    gutil.log("Gulp project distribution generated under " + logFilePath(folder + '/dist') + " after " + chalk.magenta(dResult));
                    return folder + '/dist';
                }));

            fssync.copy('help.md', 'dist/help.md');

            fssync.copy('custom/project_mapping_model.json', 'dist/custom/config.json');
            fssync.copy('custom/config_model.json', 'dist/custom/config_model.json');
            fssync.copy('package.json', 'dist/package.json');
        }
    })
});

// -- [supports/rewriting/tasks/mzg_write_temp_task.js] -- 
gulp.task('writeTemp', function() {
    var dStart = new Date();

    if (gulp.src(mzgFiles).pipe(jsValidate())) {
        gulp.src(mzgFiles)
            .pipe(insert.prepend(function(file){
                var pathfile = /^.*[\/\\](?:Gloups|gulp)[\/\\](.*)/.exec(file.path)[1];
                return !/^.*log_sections.*$/.test(pathfile)?"\n// -- ["+pathfile.replace(/[\\]/g, '/')+"] -- \n":"";
            }))
            .pipe(concat(gulpFileTempPath))
            .pipe((stayBeautiful ? nop : uglify)())
            .pipe(gulp.dest(function(file) {
                var dResult = ms2Time(new Date() - dStart);
                gutil.log(logFilePath(gulpFileTempPath) + " writen after " + chalk.magenta(dResult));

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
                gutil.log(logFilePath(gulpFileTempPath2) + " writen after " + chalk.magenta(dResult));

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
        "pathesToSass": [],
        "projects": []
    }
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
        if (has_smthng = (m = /^(.*)\/\/.*$/g.exec(l))) { // "(.. content ..) [//] .. .."
            content = m[1];
        } else if (has_smthng = (m = /^(.*)\/\*$/g.exec(l))) { // "(.. content ..) [/*] .. .."
            content = m[1];
            ++commentBloc;
        } else if (has_smthng = (m = /^.*\*\/(.*)$/g.exec(l))) { // ".. .. [*/] (.. content ..)"
            content = m[1];
            --commentBloc;
        } else if (has_smthng = (commentBloc == 0)) {
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

        entrySet = entrySet.concat(addon[i]);
    }
    if (config.verbose){
        console.log();
    }

    //pushing the addon to the entrySet an "entry" is a watching list for js or ts or coffee ... css ... etc."
    return entrySet;
}

function processConfigTargetProjects(project_path) {
    var projectServices = readJsonConfig(project_path + '/config.mzg.json');

    console.log("Activated Services for target project under the path [FOLDER]:");
    console.log(logFilePath(project_path) + "\n");

    config.pathesToJs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToJs),
        'addon': projectServices.minify_js
    }, '/**.js', 'Compress .js files into .min.js files');

    config.pathesToTs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToTs),
        'addon': projectServices.ts_to_js
    }, '/**.ts', 'Compile .ts files into .js file');

    config.pathesToCoffee = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToCoffee),
        'addon': projectServices.coffee_to_js
    }, '/**.coffee', 'Compile .coffee files into .js file');

    config.pathesToStyle = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyle),
        'addon': projectServices.minify_css
    }, '/**.css', 'Compress .css files');

    config.pathesToStyleLess = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyleLess),
        'addon': projectServices.less
    }, '/**.less', 'Compile .less files into .css files');

    config.pathesToSass = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToSass),
        'addon': projectServices.sass
    }, '/**.scss', 'Compile .scss files into .css files');
}

// -- [supports/projects/mzg_projects_funcs.js] -- 
function setUpProjectWatchingPaths(project_path) {
    processConfigTargetProjects(project_path);
    
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
        var watch = entry.watch.replace(/[\\]/g, '/');
        var dest = entry.dest.replace(/[\\]/g, '/');

        var pattern = '^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$';
        var base = (new RegExp(pattern, "g").exec(watch))[2];
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
        var watch = configTab[p_path].watch;
        list.push(watch);
    }
    return list;
}

// -- [supports/mzg_argument_funcs.js] -- 
function translateAliassesInArgs(argvs, serviceArgs) {
    var match;
    var result = [];
    argvs.forEach(function(arg) {
        if (match = /^-([^\-]+)$/.exec(arg)) {
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

function tasksToRunOnArgvs() {
    var effectiveServices = [];
    var errors = [];
    var optionsCount = 0;

    // translate aliasses into args equivalances like -a is replaced by --all in the arg. string
    var subs = translateAliassesInArgs(process.argv, SERVICES);
    
    // strips all non options or presets arguments
    var subAr = getSliceOfMatchingOptions(subs, GLOUPS_OPTIONS);

    for (service in subAr) {
        try {
            service = (/^[\-][\-]?([^\-]+)$/.exec(subAr[service]))[1];
            
            if (new RegExp("^\\b(" + PRESET_OPTIONS + ")\\b$").test(service)) {

                // check if a preset is single ; throws if not
                checkPresetsOverdose(++optionsCount, service);

                // convert the preset into a list of matching options
                effectiveServices = SERVICES[service].split(' ');
            
            }else{
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
    if (event) {
        modifiedMZGEvent = event;
    }
    var dStart = new Date();

    // when the task is run there no fired event on a file ... this won't be displayed
    if (!bySetup) {
        console.log();
        gutil.log("CHANGING " + logFilePath("gulpfile.js") + "...");
        console.log("FIRED BY " + logFilePath(event.path) + "...\n");
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
    var gulpfolder = /^(.*[\/\\](?:Gloups|gulp))[\/\\].*/.exec(file.base)[1]
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
    })

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