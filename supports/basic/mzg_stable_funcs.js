// https://www.codeproject.com/Tips/201899/String-Format-in-JavaScript.
String.prototype.format = function(args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];

			// "{" and "}" escaping
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";

			// when nothing match into { } ...
		} else {
			replace = "";
		}
		return replace;
	});
};

String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

// replacement of backslash by hack. Useful for windows pathfiles
String.prototype.hackSlashes = function() {
	return this.replace(/[\\]/g, '/');
};

// https://stackoverflow.com/questions/31361309/how-can-i-get-gulp-to-be-silent-for-some-tasks-unit-tests-vet-etc
var cmd = String(process.argv[2]);

if (ISALL || new RegExp("^(({0})(:.*)?)$".format([SILENT_TASKS])).test(cmd)) {
	var isWatching = /^(watch:.*)$/.test(cmd);
	var firstCall = false; // Do not clear on first run

	var on = gulp.on;
	gulp.on = function(name, handler) {
		if (/^(task_start|task_stop)$/.test(name)) {

			// Do some inspection on the handler
			// This is a ugly hack, and might break in the future
			if (/gutil\.log\(\s*'(Starting|Finished)/.test(handler.toString())) {
				return; //No operation
			}
		}
		return on.apply(gulp, arguments);
	};
	gulp.on('start', function() {
		// start fires multiple times
		// make sure we only call this once
		if (firstCall) {

			if (isWatching) {
				// Clear console
				// Ref: https://stackoverflow.com/questions/5367068/clear-the-ubuntu-bash-screen-for-real
				process.stdout.write('\033c');
			}

			//console.log('Started task');
			firstCall = false;
		}
	});
	gulp.on('stop', function() {
		//console.log('Task finished');
		firstCall = true;
	});
}

function getModule(module) {

	if (typeof module == "string") {
		for (var name in M) {
			if (M[name] == module) {
				var dStart = new Date();
				M[name] = require(module);
				// logging the time elapsed
				var dResult = ms2Time(new Date() - dStart);

				if (isdist.NOT_DISTRIBUTION) {
					console.log(forNowShortLog(" {0}{1} loaded after {2}".format([
						chalk.bgMagenta(' M:'),
						chalk.bgMagenta(module + ' '),
						chalk.magenta(dResult)
					])));
				}
				return M[name];
			}
		}
	}
	return module;
}

var logOrig = console.log;

function gloupslog(args){
	logOrig(args);
}

var mayLogEssentials = metAllArgs(['essential']);

if(mayLogEssentials){
	console.log=function(){};
	gloupslog(forNowShortLog(chalk.bgRed(' Logging only essential messages ')));
}
