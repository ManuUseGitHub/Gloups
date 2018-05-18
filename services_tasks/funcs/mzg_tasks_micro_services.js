function renameSuffixMin() {
	return (M.rename)(function(path) {
		var suffix = '.min';
		path.extname = suffix + path.extname;
	});
}

function renameCustomSuffix(suffix) {
	return (M.rename)(function(path) {
		path.extname = suffix + path.extname;
	});
}

function cleanCssMinification() {
	return (M.cleanCSS)({
		'compatibility': 'ie8'
	});
}

function insertSignatureAfter(actionDone, thanksToModule) {
	return (M.insert).append("\n/* -- {0} wth Gloups v {1} - {2} | thanks to {3} -- */".format(
		[
			actionDone.replace(/[\s]+$/, ''),
			GLOUPS_VERSION,
			shortDateComputed(),
			thanksToModule
		]
	));
}

function autoprefix() {
	return (M.autoprefixer)({
		browsers: AUTOPREFIXER_BROWSERS,
		cascade: false
	});
}