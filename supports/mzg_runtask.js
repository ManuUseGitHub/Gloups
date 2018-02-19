/**************************************************************************************************
 *                    RUNTASK : Tasks utilities that have to stay in gulpfile.js
 *************************************************************************************************/

gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
    this.currentTask = task;
    this.__runTask(task);
}