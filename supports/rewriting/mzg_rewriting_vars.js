gulp.task('rewrite', ['setParams', 'applyTemp']);

var bySetup = true; // messages will be displayed base on event fired by files.
var stayBeautiful = true;
var modifiedMZGEvent = null;