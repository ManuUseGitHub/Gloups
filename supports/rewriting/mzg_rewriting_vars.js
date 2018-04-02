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