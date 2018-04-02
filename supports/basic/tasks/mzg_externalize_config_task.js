gulp.task('externalizeConfig', function(cb){
  fs.writeFile('config.json', JSON.stringify(config,null,4), cb);
});