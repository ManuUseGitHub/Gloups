var gulpFileTempPath = "supports/rewriting/gulpfile_temp.js";
var jsRegexFilePathPattern = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";
var pathFiles = [];

var mzgFiles = [
	'supports/basic/mzg_modules_importation.js',
	'supports/basic/mzg_vars.js',
	
	'supports/basic/tasks/mzg_default_task.js',
	'supports/basic/tasks/mzg_set_params_task.js',
	'supports/basic/tasks/mzg_jshint_task.js',
	'supports/basic/tasks/mzg_help_me_task.js',

	'projects_setup_tasks/mzg_set_vars_task.js',
	'projects_setup_tasks/mzg_scan_projects_task.js',
	'projects_setup_tasks/mzg_services_mapping_task.js',
	
	'services_tasks/js_tasks/mzg_automin_task.js',
	'services_tasks/js_tasks/mzg_autodel_task.js',
	'services_tasks/js_tasks/mzg_merg_all_minified_task.js',
	'services_tasks/js_tasks/mzg_tyepscript_task.js',

	'services_tasks/css_tasks/mzg_automin_css_task.js',
	'services_tasks/css_tasks/mzg_auto_format_css_task.js',
	'services_tasks/css_tasks/mzg_less_task.js',
	'services_tasks/css_tasks/mzg_sass_task.js',

	'services_tasks/mzg_other_oriented_tasks.js',
	
	// supports
	'supports/rewriting/mzg_rewriting_vars.js',
	'supports/rewriting/mzg_rewriting_funcs.js',
	'supports/rewriting/tasks/mzg_apply_temp_task.js',
	'supports/rewriting/tasks/mzg_write_temp_task.js',
	'supports/mzg_runtask.js',
	
	// functions
	'supports/files/configurationSetting/mzg_config_funcs.js',
	'supports/projects/mzg_projects_funcs.js',
	'supports/mzg_argument_funcs.js',
	'supports/mzg_logging.js',

	// mzg classes 
	'supports/files/mzg_reading_file_class.js'
];

// sets things up to serve
var config = getConfig();