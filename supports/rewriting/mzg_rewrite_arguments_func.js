function translateAliassesInArgs(argvs, serviceArgs) {
    var match;
    var result = [];
    argvs.forEach(function(arg) {
        if (match = /^-([^\-]+)$/.exec(arg)) {
            result.push('--' + serviceArgs[match[1]]);
        } else {
            result.push(arg);
        }
    });
    return result;
}

function configurationOfRewriteOnArvs() {
    var argvs = translateAliassesInArgs(process.argv, RewriteServices);
    var subAr = getSliceOfMatchingOptions(argvs, "ugly|beauty|once|multiple");
    subAr.forEach(function(serv) {
        try {
            var opt = (/^--(.*)$/.exec(serv));

            if (opt && (matchOption = opt[1])) {
                RewriteServices.uglyness = matchOption == 'ugly' ? matchOption : RewriteServices.uglyness;
                RewriteServices.times = matchOption == 'multiple' ? matchOption : RewriteServices.times;
            }

        } catch (err) {
            errors.push(err + " Error with option: ");
        }
    })

    return {
        'times': RewriteServices.times,
        'uglyness': RewriteServices.uglyness
    };
}

function getSliceOfMatchingOptions(argvs, args) {
    var start = 0;
    var end = 0;
    try {
        argvs.forEach(function(arg) {
            if (!(new RegExp("^--(" + args + ")$", "g")).test(arg)) {
                if (start != end) {
                    // there is no 'break' statement in JS ... so throw an exception is the best solution
                    throw {};
                }
                start++;
            }
            end++;
        });
    } catch (e) { /*nothing*/ }

    return argvs.slice(start, end);
}