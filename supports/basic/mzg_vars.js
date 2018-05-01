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
	'mj': 'minjs',
	'minjs': 'automin',
	'ts': 'typescript',
	'c': 'coffee',
	'coffee': 'coffeescript',
	'l': 'less',
	'less': 'less',
	's': 'sass',
	'sass': 'sass',
	'sts': 'stylus',
	'stylus': 'stylus',
	'mc': 'mincss',
	'mincss': 'autominCss',
	'tr': 'transitive',
	'es': 'essential',

	// presets
	'a': 'all',
	'all': 'automin typescript coffeescript autominCss less sass stylus',

	'st': 'style',
	'style': 'autominCss less sass stylus',

	'jvs': 'javascript',
	'javascript' : 'automin typescript coffeescript',

	'tps': 'typescript',
	'typescript': 'automin typescript',
	
	'cof': 'coffeescript',
	'coffeescript': 'automin coffeescript',
};

var PRESET_OPTIONS = "all|style|jvs|typescript|coffeescript";
var SERVICES_OPTIONS = "minjs|ts|coffee|less|sass|stylus|mincss";
var SERVICES_ADVANCED_OPTIONS = "transitive|essential";

var ALL_SERVICES_OPTIONS = PRESET_OPTIONS + '|' + SERVICES_OPTIONS + '|' + SERVICES_ADVANCED_OPTIONS;

var JS_REGEX_FILE_PATH_PATTERN = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

var GLOUPS_OPTIONS = SERVICES_OPTIONS + '|' + PRESET_OPTIONS;

var SILENT_TASKS = "watch|vet|unit-test|integration-test";
var ISALL = true;

var isdist = {};

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

// Sets things up to serve
var config = getConfig();

var glob_found_modules = {
	'fs': true
};

var glob_visited_elements = {
	'infunc': {},
	'intask': {}
};