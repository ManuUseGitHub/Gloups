/**
 * @Function
 * fills the config arrays according to a current service mapping provided by a json file 
 * (the file is a direct configuraiton)
 * 
 * @param  {String}
 */
function setUpProjectWatchingPaths(project_path) {
    var projectServices = readJsonConfig(project_path + '/config.mzg.json');

    console.log("Activated Services for target project under the path [FOLDER]:");
    console.log(logFilePath(project_path) + "\n");

    config.pathesToJs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToJs),
        'addon': projectServices.minify_js
    }, '/**/*.js', 'Compress .js files into .min.js files');

    config.pathesToTs = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToTs),
        'addon': projectServices.ts_to_js
    }, '/**/*.ts', 'Compile .ts files into .js file');

    config.pathesToCoffee = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToCoffee),
        'addon': projectServices.coffee_to_js
    }, '/**/*.coffee', 'Compile .coffee files into .js file');

    config.pathesToStyle = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyle),
        'addon': projectServices.minify_css
    }, '/**/*.css', 'Compress .css files');

    config.pathesToStyleLess = makePathesCoveringAllFilesFor(project_path, {
        'pathesToService': (config.pathesToStyleLess),
        'addon': projectServices.less
    }, '/**/*.less', 'Compile .less files into .css files');

    config.pathesToSass = makePathesCoveringAllFilesFor(project_path, {
        'projectPath': project_path,
        'pathesToService': (config.pathesToSass),
        'addon': projectServices.sass
    }, '/**/*.scss', 'Compile .scss files into .css files');

}

function getMatchingEntryConfig(filePath, configTab) {

    // replace '\' characters by '/' to prevent 
    // differences with the true path on windows systems
    filePath = filePath.replace(/[\\]/g, '/');

    // iterate on efery path within configTab to check 
    // what path sources fire the change event then find
    // the destination referenced via 'entry.dest'
    for (var p_path in configTab) {

        var entry = configTab[p_path];
        var watch = entry.watch.replace(/[\\]/g, '/');
        var dest = entry.dest.replace(/[\\]/g, '/');

        var pattern = '^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$';
        var base = (new RegExp(pattern, "g").exec(watch))[2];
        var matching = (new RegExp('^.*(?:' + base + ').*$', "g").exec(filePath));

        if (matching) {
            return entry;
        }
    }
    return null;
}

function watchList(configTab) {
    var list = [];
    for (var p_path in configTab) {
        var watch = configTab[p_path].watch;
        list.push(watch);
    }
    return list;
}

function mappSassMatching(projectRootPath, watchPathForSass) {
    // ===========================================================================================================
    // the configuration is set to look into every folder under the watch path ?
    var m;
    if ((m = /^(.*)[\\\/]\*\*[\\\/]\*\..*$/.exec(watchPathForSass)) && m[1]) {

        config.sassMaching = [];
        var pathsToSCSSPrimary = walkSync(m[1], [], new RegExp("^.*[\\\/](_.*)$", 'i'));
        var i = 0;

        pathsToSCSSPrimary.forEach(function(styleSheet){
            config.sassMaching.push({
                identifier: styleSheet.fileName,
                target: styleSheet.path,
                partials: []
            });

            pushEllipsizedPartials(projectRootPath, styleSheet,i++);
        });
    }
    // ===========================================================================================================
}

function pushEllipsizedPartials(projectRootPath, styleSheet, index) {

    var reading = new classReading();
    var _data = fs.readFileSync(styleSheet.path, "utf8");
    reading.initialize(_data, 0);

    var ppl = projectRootPath.length; // project path Length
    var l,m;
    
    reading.readLines(function() {
        l = reading.getLine();
        if ((m = /^@import[\s].*["](.*)["]/.exec(l)) && m[1]) {

            // full path to the partial
            var fpp = "{0}/{1}".format([styleSheet.dir, m[1]]);

            // local path to the partial 
            var lpp = fpp.substr(ppl);

            var ellipsedPath = pathEllipzizeing(fpp, 0, (lpp.split("/").length));
            config.sassMaching[index].partials.push(ellipsedPath);
        }
    });
}

function pathEllipzizeing(path, sub, sup) {
    // patern + format !!! {-1} = "{", {-2} = "}" !!!
    var patern = "^(?:(?:((?:[^\/\\]+[\\\/]{-1}1,2{-2}){-1}{0}{-2}).*((?:[\\\/][^\/\\?]+){-1}{1},{-2}[\\\/]?)[^?]*).*|([^?]*).*)$".format([sub, sup]);
    var m = new RegExp(patern, 'g').exec(path);
    return m[3] ? m[3] : (m[1] + '...' + m[2]); // if no ellips is posible, return the full path;
}

// https://gist.github.com/kethinov/6658166
// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist, regexFilter) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist, regexFilter);
        } else {
            if (!regexFilter.test(dir + '/' + file))
                filelist.push({
                    "dir": dir.replace(/[\\]/g, '/'),
                    "path": (dir + '/' + file).replace(/[\\]/g, '/'),
                    "fileName": file
                });
        }
    });
    return filelist;
};