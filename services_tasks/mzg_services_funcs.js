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
    path = path.replace(/[\\]/g, '/'); 
    var m = null;
    m = /^.*[\/\\](.*)$/.exec(path);

    // filter to not let pass files starting by underscores "_.*"
    if (m && m[1] && /^_.*$/.test(m[1])) {

        // removing the underscor and the extension to match the import definition and 
        // then the value in configuration
        m = /^(.*[\\\/])_?(.*)[.].*$/g.exec(path);
        var normalized = m[1] + m[2];       

        var ppl = projectPath.length; // path to project length
        var lpp = path.substr(ppl); // local path to the partial 

        // ellipsizing the path to get a match with
        ellipsedPath = pathEllipzizeing(normalized, 0, (lpp.split("/").length));

        var matchings = [];
        var matchingDef = config.sassMaching;
        for (var i in matchingDef){

            // if an ellipsized path match for a project, ad the filepath targeting.
            if(contains(matchingDef[i].partials,ellipsedPath)){
                matchings.push(matchingDef[i].target);
            }            
        }
        return matchings;
    }
    return [path];
}