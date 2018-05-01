function getConfig() {
	return config ? config : DEFAULT_CONFIG;
}

function readJsonConfig(filePath) {
	var _data = (M.fs).readFileSync(filePath, "utf8");
	var reading = new classReading();
	reading.initialize(_data, 0);

	var m;
	var l;
	var commentBloc = 0;
	var has_smthng = true;
	var content = "";
	m = /^(.*)(\.json)$/.exec(filePath);
	var tempfile = m[1] + '.temp' + m[2];
    var tempfileVisual = m[1] + '2.temp' + m[2];

	// at any line read, 
	(M.fssync).write(tempfile, '', 'utf8');
	reading.readLines(function() {

		// stripping comments ---------------------------------------------------------------------
		l = reading.getLine();
		if ((has_smthng = (m = /^(.*)\/\/.*$/g.exec(l)))) { // "(.. content ..) [//] .. .."
			content = m[1];
		} else if ((has_smthng = (m = /^(.*)\/\*$/g.exec(l)))) { // "(.. content ..) [/*] .. .."
			content = m[1];
			++commentBloc;
		} else if ((has_smthng = (m = /^.*\*\/(.*)$/g.exec(l)))) { // ".. .. [*/] (.. content ..)"
			content = m[1];
			--commentBloc;
		} else if ((has_smthng = (commentBloc == 0))) {
			content = l;
		}

		//                          every matching creates a candidate to write 
		if (has_smthng) {
			if (!/^[\s]*$/g.test(content)) { // white lines are ignored
                getModule(M.fs).appendFileSync(tempfileVisual, content + "\r\n", 'utf8');
                getModule(M.fs).appendFileSync(tempfile, /^[\s\t]*((?:[^\s\t]*[\s\t]*[^\s\t])+)[\s\t]*$/.exec(content)[1], 'utf8');
            }
		}
		// ----------------------------------------------------------------------------------------
	});
	
    var temp = getModule(M.fs).readFileSync(tempfile, "utf8");
    
    getModule(M.fssync).remove(tempfile);
    getModule(M.fssync).remove(tempfileVisual);

    return JSON.parse(temp.replace(/}(,)]/g,'}]'));
}

function setConfig() {
	config.projects = readJsonConfig("custom/config.json").projects;
}

function makePathesCoveringAllFilesFor(projectFolder, matchingForEntry, subpathToExtention, purpose) {

	var addon = matchingForEntry.addon;
	var entrySet = matchingForEntry.pathesToService;

	matchingForEntry.projectPath = projectFolder;

	if (addon) {
		for (var i = 0, t = addon.length; i < t; ++i) {
			// concatenate /**/*.ext to the watch folder
			addon[i].watch = addon[i].watch + subpathToExtention;

			var pathes = [addon[i].watch, addon[i].dest];

			if (0 < i) { // only the first time to avoid repeating the same purpose
				purpose = "[SAME-PURPOSE]";
			}

			var projectName = getProjectNameFromRootPath(projectFolder);

			logServiceActivatedPushed(purpose, projectName, addon[i]);

			// rebaseing the path to validate the watching
			addon[i].watch = projectFolder + "/" + addon[i].watch;
			addon[i].dest = projectFolder + "/" + addon[i].dest;
			addon[i].projectPath = projectFolder;
			addon[i].projectName = projectName;

			entrySet = entrySet.concat(addon[i]);
		}
		if (config.verbose) {
			console.log();
		}
	}

	//pushing the addon to the entrySet an "entry" is a watching list for js or ts or coffee ... css ... etc."
	return entrySet;
}