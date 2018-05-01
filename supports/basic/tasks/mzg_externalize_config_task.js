gulp.task('externalizeConfig', function(cb){
  (M.fs).writeFile('config.json', JSON.stringify(config,null,4), cb);
});