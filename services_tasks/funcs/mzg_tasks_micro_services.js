function renameSuffixMin() {
	return (M.rename)({
		suffix: '.min'
	});
}

function cleanCssMinification() {
	return (M.cleanCSS)({
		'compatibility': 'ie8'
	});
}

function insertSignatureAfter(actionDone, thanksToModule) {
	return (M.insert).append("\n/* -- {1} wth Gloups v {2} - {3} | thanks to {4} -- */".format(
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