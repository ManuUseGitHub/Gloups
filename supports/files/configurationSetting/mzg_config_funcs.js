function getConfig() {
    return config ? config : {
        // See 'serviceMapping' project setup task
        "verbose": false, // true to enable set vars verbose

        "pathesToJs": [],
        "pathesToTs": [],
        "pathesToCoffee": [],
        "pathesToStyle": [],
        "pathesToStyleLess": [],
        "pathesToWars": [],
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
    var tempfile = m[1]+'.temp'+m[2];

    // at any line read, 
    fssync.write(tempfile, '', 'utf8');
    reading.readLines(function() {

        // stripping comments ---------------------------------------------------------------------
        l = reading.getLine();
        if (has_smthng = (m = /^(.*)\/\/.*$/g.exec(l))) {           // "(.. content ..) [//] .. .."
            content = m[1];
        } else if (has_smthng = (m = /^(.*)\/\*$/g.exec(l))) {      // "(.. content ..) [/*] .. .."
            content = m[1];
            ++commentBloc;
        } else if (has_smthng = (m = /^.*\*\/(.*)$/g.exec(l))) {    // ".. .. [*/] (.. content ..)"
            content = m[1];
            --commentBloc;
        } else if (has_smthng = (commentBloc == 0)) {
            content = l;
        }

        //                          every matching creates a candidate to write 
        if (has_smthng) {
            if (!/^[\s]*$/g.test(content)) {    // white lines are ignored
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

function processConfigTargetProjects(project_path, reading, key) {
    var pathReader = new classReading();
    pathReader.initialize(reading.getData(), reading.getIter());
    var match;

    pathReader.readLines(function() {
        var line = pathReader.getLine();
        if (match = /^.*\["(.*)","(.*)"\].*$/g.exec(line)) {
            var configDescription;
            var extSubpath;
            if (key == "minify_js") {
                configDescription = {
                    where: config.pathesToJs,
                    purpose: 'Compress .js files into .min.js files'
                }
                extSubpath = '/**/*.js'
            } else if (key == "ts_to_js") {
                configDescription = {
                    where: config.pathesToTs,
                    purpose: 'Compile .ts files into .js File'
                }
                extSubpath = '/**/*.coffee';
            } else if (key == "coffee_to_js") {
                configDescription = {
                    where: config.pathesToCoffee,
                    purpose: 'Compile .coffee files into .js File'
                }
                extSubpath = '/**/*.coffee';
            } else if (key == "minify_css") {
                configDescription = {
                    where: config.pathesToStyle,
                    purpose: 'Compress .css files'
                }
                extSubpath = '/**/*.css';
            } else if (key == "less") {
                configDescription = {
                    where: config.pathesToStyleLess,
                    purpose: 'Compile .less files into .css files'
                }
                extSubpath = '/**/*.less';
            } else if (key == "sass") {
                configDescription = {
                    where: config.pathesToSass,
                    purpose: 'Compile .scss files into .css files'
                }
                extSubpath = '/**/*.scss';
            } else if (key == "war") {
                configDescription = {
                    where: config.pathesToWars,
                    purpose: 'Rename .WAR files'
                }
                extSubpath = '/**/*.war';
            }
            var description = {
                project: project_path,
                pathes: match,
                subpathToExtention: extSubpath
            };
            pushNewEntryFor(description, configDescription);
        }
        if (/^]$/g.test(pathReader.getLine())) {
            pathReader.stop();
            reading.setIter(pathReader.getIter());
        }
    });
}