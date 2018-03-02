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
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var wait = require('gulp-wait');