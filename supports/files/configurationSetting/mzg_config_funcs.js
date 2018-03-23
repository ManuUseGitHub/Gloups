function getConfig() {
    return config ? config : {
        // See 'serviceMapping' project setup task
        "verbose": false, // true to enable set vars verbose

        "pathesToJs": [],
        "pathesToTs": [],
        "pathesToCoffee": [],
        "pathesToStyle": [],
        "pathesToStyleLess": [],
        "pathesToSass": [],
        "projects": []
    }
}

function readJsonConfig(filePath) {
    var _data = fs.readFileSync(filePath, "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);

    var m;
    var l;
    var commentBloc = 0;
    var has_smthng = true;
    var content = "";
    m = /^(.*)(\.json)$/.exec(filePath);
    var tempfile = m[1] + '.temp' + m[2];

    // at any line read, 
    fssync.write(tempfile, '', 'utf8');
    reading.readLines(function() {

        // stripping comments ---------------------------------------------------------------------
        l = reading.getLine();
        if (has_smthng = (m = /^(.*)\/\/.*$/g.exec(l))) { // "(.. content ..) [//] .. .."
            content = m[1];
        } else if (has_smthng = (m = /^(.*)\/\*$/g.exec(l))) { // "(.. content ..) [/*] .. .."
            content = m[1];
            ++commentBloc;
        } else if (has_smthng = (m = /^.*\*\/(.*)$/g.exec(l))) { // ".. .. [*/] (.. content ..)"
            content = m[1];
            --commentBloc;
        } else if (has_smthng = (commentBloc == 0)) {
            content = l;
        }

        //                          every matching creates a candidate to write 
        if (has_smthng) {
            if (!/^[\s]*$/g.test(content)) { // white lines are ignored
                fs.appendFileSync(tempfile, content + "\r\n", 'utf8');
            }
        }
        // ----------------------------------------------------------------------------------------
    });
    var temp = fs.readFileSync(tempfile, "utf8");
    fssync.remove(tempfile);
    return JSON.parse(temp);
}

function setConfig() {
    config.projects = readJsonConfig("custom/config.json").projects;
}

function makePathesCoveringAllFilesFor(projectFolder, matchingForEntry, subpathToExtention, purpose) {

    var addon = matchingForEntry.addon;
    var entrySet = matchingForEntry.pathesToService;

    for (var i = 0, t = addon.length; i < t; ++i) {
        // concatenate /**/*.ext to the watch folder
        addon[i].watch = addon[i].watch + subpathToExtention;

        var pathes = [addon[i].watch, addon[i].dest];

        if (0 < i) { // only the first time to avoid repeating the same purpose
            purpose = "[SAME-PURPOSE]";
        }

        logServiceActivatedPushed(purpose, projectFolder, addon[i]);

        // rebaseing the path to validate the watching
        addon[i].watch = projectFolder + "/" + addon[i].watch;
        addon[i].dest = projectFolder + "/" + addon[i].dest;

        entrySet = entrySet.concat(addon[i]);
    }
    if (config.verbose){
        console.log();
    }

    //pushing the addon to the entrySet an "entry" is a watching list for js or ts or coffee ... css ... etc."
    return entrySet;
}

function processConfigTargetProjects(project_path) {
    var projectServices = readJsonConfig(project_path + '/config.mzg.json');

    console.log("Activated Services for target project under the path [FOLDER]:");
    console.log(logFilePath(project_path) + "\n");

    config.pathesToJs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToJs),
        'addon': projectServices.minify_js
    }, '/**.js', 'Compress .js files into .min.js files');

    config.pathesToTs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToTs),
        'addon': projectServices.ts_to_js
    }, '/**.ts', 'Compile .ts files into .js file');

    config.pathesToCoffee = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToCoffee),
        'addon': projectServices.coffee_to_js
    }, '/**.coffee', 'Compile .coffee files into .js file');

    config.pathesToStyle = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyle),
        'addon': projectServices.minify_css
    }, '/**.css', 'Compress .css files');

    config.pathesToStyleLess = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyleLess),
        'addon': projectServices.less
    }, '/**.less', 'Compile .less files into .css files');

    config.pathesToSass = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToSass),
        'addon': projectServices.sass
    }, '/**.scss', 'Compile .scss files into .css files');
}