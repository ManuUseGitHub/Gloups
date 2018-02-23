function getConfig() {
    return config ? config : {
        // See 'serviceMapping' project setup task
        "verbose": false, // true to enable set vars verbose

        "pathesToJs": [],
        "pathesToTs": [],
        "pathesToStyle": [],
        "pathesToStyleLess": [],
        "pathesToWars": [],
        "pathesToSass": [],
        "projects": []
    }
}

function setConfig() {
    var match;
    var _data = fs.readFileSync("custom/config.ini", "utf8");
    var reading = new classReading();
    reading.initialize(_data, 0);
    var key;

    // at ery line read, 
    reading.readLines(function() {

        // when a key is read:
        if (match = /^(.*)=.*$/g.exec(reading.getLine())) {
            key = match[1];
        };

        // the key 'Projects_paths' was read : analyse of project definitions within.
        if (/^Projects_paths$/.test(key) && /^\[$/g.test(reading.getLine())) {
            pushProjectIntoConfigViaReading(reading, key);
        }
    });
}


function pushProjectIntoConfigViaReading(reading, key) {
    var projectReader = new classReading();
    projectReader.initialize(reading.getData(), reading.getIter());
    var projectPattern = /^.*\[(.*),"(.*)",(.*)\],?$/g,
        match;

    projectReader.readLines(function() {
        var line = projectReader.getLine();

        //is the line matches the project pattern
        if (match = projectPattern.exec(line)) {

            if (key == "Projects_paths") {

                // pushing projects informations
                config.projects.push({
                    project: match[1],
                    path: match[2],
                    checked: match[3]
                });
            }

        }

        // the end of list (EOL.) is reached ! Stop it all
        if (/^]$/g.test(projectReader.getLine())) {
            projectReader.stop();
            reading.setIter(projectReader.getIter());
        }
    });
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
                extSubpath = '/**/*.ts';
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