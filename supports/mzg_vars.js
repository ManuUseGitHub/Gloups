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