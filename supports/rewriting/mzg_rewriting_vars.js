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
	'projects_setup_tasks/mzg_pulse_task.js',
	'projects_setup_tasks/mzg_services_mapping_task.js',

	'supports/rewriting/log_sections/mzg_log5.js', // section

	// serve
	'services_tasks/mzg_serve_task.js',

	'supports/rewriting/log_sections/mzg_log6.js', // section

	// js
	'services_tasks/js_tasks/mzg_automin_task.js',
	'services_tasks/js_tasks/mzg_tyepscript_task.js', // 25
	'services_tasks/js_tasks/mzg_coffeescript_task.js', 

	'supports/rewriting/log_sections/mzg_log7.js', // section

	// css
	'services_tasks/css_tasks/mzg_automin_css_task.js',
	'services_tasks/css_tasks/mzg_less_task.js',
	'services_tasks/css_tasks/mzg_sass_task.js',
	'services_tasks/css_tasks/mzg_stylus_task.js',

	'supports/rewriting/log_sections/mzg_log8.js', // section

	// other
	'services_tasks/mzg_other_oriented_tasks.js',

	'supports/rewriting/log_sections/mzg_log16.js', // section // 34
	'supports/files/mzg_module_seeking_funcs.js', // 35

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

	'supports/mzg_runtask.js', // 50

	'supports/rewriting/log_sections/mzg_log12.js', // section 

	'supports/files/configurationSetting/mzg_config_funcs.js', 
	'supports/projects/mzg_project_converage_funcs.js',
	'supports/projects/mzg_projects_funcs.js',
	'supports/mzg_argument_funcs.js',

	'supports/rewriting/log_sections/mzg_log13.js', // section

	'supports/rewriting/mzg_rewriting_funcs.js',
	'supports/rewriting/mzg_rewrite_arguments_func.js',

	'supports/rewriting/log_sections/mzg_log14.js', // section
	'supports/mzg_logging.js'
];

var distFiles = mzgFiles.slice();

distFiles.splice(56, 3);
distFiles.splice(43, 6);
distFiles.splice(34, 2);
distFiles.splice(13, 1);
distFiles.splice(9, 1);
distFiles.splice(4, 1);

isdist.NOT_DISTRIBUTION = true;