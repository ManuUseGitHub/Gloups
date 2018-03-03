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
var services = {

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

	// presets
	'a': 'all',
	'all': 'autodel automin typescript coffeescript less sass autominCss',
	'st': 'style',
	'style': 'less sass autominCss',
	'jvs': 'autodel automin',
	'tps': 'typescript',
	'typescript': 'autodel automin typescript',
	'cof': 'coffeescript',
	'coffeescript': 'autodel automin coffeescript',

};

var presetsRegex = /^\b(all|style|js|typescript|coffeescript)\b$/;
var jsRegexFilePathPattern = "^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";