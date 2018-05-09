function contains(a, obj) {
	var i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}

function getMatchingPrincipalSCSS(projectPath, path) {
	var m = /^.*[\/\\](.*)$/.exec(path);

	// filter to not let pass files starting by underscores "_.*"
	if (m && m[1] && /^_.*$/.test(m[1])) {

		// removing the underscor and the extension to match the import definition and 
		// then the value in configuration
		m = /^(.*[\\\/])_?(.*)[.].*$/g.exec(path);
		var normalized = m[1] + m[2];

		var ppl = projectPath.length; // path to project length
		var lpp = path.substr(ppl); // local path to the partial 

		// ellipsizing the path to get a match with
		var ellipsedPath = pathEllipzizeing(normalized, 0, (lpp.split("/").length));

		var matchings = [];
		var matchingDef = config.sassMaching;
		for (var i in matchingDef) {

			// if an ellipsized path match for a project, ad the filepath targeting.
			if (contains(matchingDef[i].partials, ellipsedPath)) {
				matchings.push(matchingDef[i].target);
			}
		}
		return matchings;
	}
	return [path];
}

function getFreshTransitivity() {
	return {
		'should': false,
		'dest': 'draft',
		'compressing': (M.nop),
		'suffixing': (M.nop)
	};
}

function createMainLazyPipeObject(pathesDescript, action, thanksModules) {
	return {
		'process': null,
		'destCallBack': function() {
			//use <this> to refere to forMatchingObj here or into rewriting of callbacks 
			return gulp.dest("draft");
		},
		'forMatchingObj': {
			'path': null,
			'pathesDescr': pathesDescript
		},
		'message': {
			'action': action,
			'module': thanksModules,
			'files': []
		}
	};
}

function checkMultipleRules(inputString, mixinRulesArr, index) {
	index = index != undefined ? index : 0;

	var rule = mixinRulesArr[index];
	var result = true;

	// undefined or false if it is the result of a boolean
	if (rule != undefined) {
		if (typeof rule == 'boolean') {
			result = result && (rule ? checkMultipleRules(inputString, mixinRulesArr, ++index) : false);
		}
		// an array is used to store inverter and a rule
		else if (typeof rule == 'object') {
			if (rule instanceof Array) {
				if (typeof rule[1] == "string") {
					rule[1] = new RegExp(rule[1], 'g');
				}
                result = rule[0] == '!' && !rule[1].test(inputString);

			} else if (rule instanceof RegExp) {
				result = result && (result ? checkMultipleRules(inputString, mixinRulesArr, ++index) : false);
			} else {
				gloupslog(chalk.red('undefined case ...'));
				return false;
			}

		} else if (typeof rule == 'string') {
			result = new RegExp(rule, 'g').test(inputString);
			result = result && (result ? checkMultipleRules(inputString, mixinRulesArr, ++index) : false);

		} else {
			gloupslog(chalk.red('undefined case ...'));
			return false;
		}
	}
	return result;
}