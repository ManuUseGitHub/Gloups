function setUpProjectWatchingPaths(project_path) {
    var match;
    var _data = fs.readFileSync(project_path + '/config.mzg.ini', "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);
    var key;

    var process =
        function() {
            if (match = /^(.*)=.*$/g.exec(reading.getLine())) {
                key = match[1];
            };
            if (/^(minify_js|ts_to_js|coffee_to_js|minify_css|less|sass)$/.test(key) && /^\[$/g.test(reading.getLine())) {
                processConfigTargetProjects(project_path, reading, key);
            }
        }
    reading.readLines(process);
}

function pushNewEntryFor(matchingEntryDefinition, configDescription) {
    var project = matchingEntryDefinition.project;
    var pathes = matchingEntryDefinition.pathes;
    var subpathToExtention = matchingEntryDefinition.subpathToExtention;
    var purpose = configDescription.purpose;

    configDescription.where.push({
        source: project + '\\' + pathes[1] + subpathToExtention,
        dest: project + '\\' + pathes[2]
    });

    if (config.verbose) {
        var match;

        if (match = /^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose)) {
            console.log("pushing entry for [Purpose] " + chalk.grey(match[1]) + chalk.magenta(match[2]) + chalk.grey(match[3]) + chalk.magenta(match[4]) + chalk.grey(match[5]));
        } else if (match = /^([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose)) {
            console.log("pushing entry for [Purpose] " + chalk.grey(match[1]) + chalk.magenta(match[2]) + chalk.grey(match[3]));
        }

        console.log("Watch : '" + chalk.cyan(project + '\\' + pathes[1] + subpathToExtention) + "'");
        console.log("Dest. : '" + chalk.cyan(project + '\\' + pathes[2]) + "'\n");
    }
}

function getDestOfMatching(filePath, configTab) {

    // replace '\' characters by '/' to prevent 
    // differences with the true path on windows systems
    filePath = filePath.replace(/[\\]/g, '/');

    // iterate on efery path within configTab to check 
    // what path sources fire the change event then find
    // the destination referenced via 'entry.dest'
    for (p_path in configTab) {

        var entry = configTab[p_path];
        var source = entry.source.replace(/[\\]/g, '/');
        var dest = entry.dest.replace(/[\\]/g, '/');

        var pattern = '^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$';
        var base = (new RegExp(pattern, "g").exec(source))[2];
        var matching = (new RegExp('^.*(?:' + base + ').*$', "g").exec(filePath));

        if (matching) {
            return entry.dest;
        }
    }
    return null;
}

function watchList(configTab) {
    var list = [];
    for (p_path in configTab) {
        var source = configTab[p_path].source;
        list.push(source);
    }
    return list;
}