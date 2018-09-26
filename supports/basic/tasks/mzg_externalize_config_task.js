gulp.task('externalizeConfig', function(cb) {

	writeModuleFromObject("config.js",config,cb);
});