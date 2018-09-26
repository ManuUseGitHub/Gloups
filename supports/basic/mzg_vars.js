// Mapping of arguments for serve taks. arguments have one matching. 
// An alias matches a service, as -l matches --less (less task)
// A preset is a set of arguments that works legitimately together.
// 		> style tasks such as: 
//			autominification of css files
//			autocompilation of less files to css files
//			autocompilation of scss files to css files
// Even a preset has its own alias, as -st matches --style
var SERVICES = {

	// custom
	't': 'typescript',
	'c': 'coffeescript',

	// styles
	's1': 'less',
	's2': 'sass',
	's3': 'stylus',

	// minifications
	'minj': 'automin',
	'minc': 'autominCss',

	// advanced 
	'tr': 'transitive',
	'es': 'essential',
	'n' : 'name',

	// presets
	'a': 'all',
	'all': 'automin typescript coffeescript autominCss less sass stylus',

	'styles': 'autominCss less sass stylus',

	'js': 'automin typescript coffeescript',

	'cof': 'automin coffeescript',

	'tps': 'automin typescript'
};

var NOPE = "ACTUALY NOPE :( !";
var PRESET_OPTIONS = "all|styles|cof|tps|js";
var SERVICES_OPTIONS = "automin|autominCss|typescript|coffeescript|less|sass|stylus";
var SERVICES_ADVANCED_OPTIONS = "transitive|essential|name";

var ALL_SERVICES_OPTIONS = PRESET_OPTIONS + '|' + SERVICES_OPTIONS + '|' + SERVICES_ADVANCED_OPTIONS;

// REGEX PATTERNS ---------------------------------------------------------------------------------
var JS_REGEX_FILE_PATH_PATTERN = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";
var FILE_COVERAGE_REGEXP = /^(.*)[\\\/]\*\*[\\\/]\*\..*$/;
var FILE_STARTING_BY_UNDERSCORE = /^.*[\/\\](_.*)$/i;
// ------------------------------------------------------------------------------------------------

var GLOUPS_OPTIONS = SERVICES_OPTIONS + '|' + PRESET_OPTIONS;

var SILENT_TASKS = "watch|vet|unit-test|integration-test";
var ISALL = true;

// https://stackoverflow.com/questions/43064924/how-to-target-all-browsers-with-gulp-auto-prefixer
var AUTOPREFIXER_BROWSERS = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'];

var DEFAULT_CONFIG = {
	// See 'serviceMapping' project setup task
	"verbose": false, // true to enable set vars verbose

	"pathesToJs": [],
	"pathesToTs": [],
	"pathesToCoffee": [],
	"pathesToStyle": [],
	"pathesToStyleLess": [],
	"pathesToSass": [],
	"pathesToStylus": [],
	"projects": []
};

// configurations
var isdist = {};

var config = getConfig();

// global objects
var glob_found_modules = {
	'fs': true
};

var glob_visited_elements = {
	'infunc': {},
	'intask': {}
};

var glob_timer;

var glob_logging_obj = {};

var glob_mayLogEssentials = metAllArgs(['essential']);