// Sets things up to serve
var config = getConfig();

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
	'd': 'del',
	'del': 'autodel',
	'mj': 'minjs',
	'minjs': 'automin',
	'ts': 'typescript',
	'c': 'coffee',
	'coffee': 'coffeescript',
	'l': 'less',
	'less': 'less',
	's': 'sass',
	'sass': 'sass',
	'mc': 'mincss',
	'mincss': 'autominCss',
	'tr':'transitive',

	// presets
	'a': 'all',
	'all': 'automin autodel typescript coffeescript autominCss less sass',
	'st': 'style',
	'style': 'autominCss less sass',
	'jvs': 'autodel automin',
	'tps': 'typescript',
	'typescript': 'autodel automin typescript',
	'cof': 'coffeescript',
	'coffeescript': 'autodel automin coffeescript',
};

var PRESET_OPTIONS = "all|style|js|typescript|coffeescript";
var SERVICES_OPTIONS = "del|minjs|ts|coffee|less|sass|mincss";
var SERVICES_ADVANCED_OPTIONS = "transitive";
var GLOUPS_VERSION = "4.5";

var ALL_SERVICES_OPTIONS = PRESET_OPTIONS+'|'+SERVICES_OPTIONS+'|'+SERVICES_ADVANCED_OPTIONS;

var JS_REGEX_FILE_PATH_PATTERN = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";

var GLOUPS_OPTIONS = SERVICES_OPTIONS+'|'+PRESET_OPTIONS;

var SILENT_TASKS = "watch|vet|unit-test|integration-test";
var ISALL = true;

var isdist={};

// https://stackoverflow.com/questions/43064924/how-to-target-all-browsers-with-gulp-auto-prefixer
var AUTOPREFIXER_BROWSERS = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'];