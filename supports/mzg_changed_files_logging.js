function logChangedRealTargetedFiles(mainLazyPipeObj, realTargets) {
	var descr = mainLazyPipeObj.forMatchingObj.pathesDescr;
	var pafn;
	var actionOnFile = mainLazyPipeObj.message.action;

	var cpt = 0;
	// call with logging of the time taken by the task
	if (realTargets.length > 1) {
		realTargets.forEach(function(file) {

			// the next time, do not output the action since it is the same
			if (cpt++ > 0)
				actionOnFile = '              ';

			// projectAndFileName
			pafn = getProjectNameWithFileFromPathDesc(descr, file);

			gloupslog(" {0} '{1}{2}'".format([actionOnFile, chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));

		});
	} else {
		var pathHackSlashed = realTargets[0].hackSlashes();

		// projectAndFileName
		pafn = getProjectNameWithFileFromPathDesc(descr, pathHackSlashed);

		gloupslog(" {0} '{1}{2}'".format([actionOnFile, chalk.bgCyan(' ' + pafn.projectName + ' '), chalk.cyan(pafn.fileName + ' ')]));
	}
}

function getProjectNameWithFileFromPathDesc(descr, file) {

	var backedPath = /[^\/\\]*(\/.*)/.exec(file)[1];
	backedPath = ".." + backedPath;
	var projectName = '<PROJECT NM>';
	var fileName;

	for (var p in descr) {

		var projectPathPaternString = descr[p].projectPath.split("/").join('\\/') + '(.*)$';
		var projectPathPatern = new RegExp(projectPathPaternString, "g");
		var match = null;

		if ((match = projectPathPatern.exec(backedPath))) {
			projectName = descr[p].projectName;
			fileName = match[1];
			break;
		}
	}

	return {
		'projectName': projectName,
		'fileName': fileName
	};
}
