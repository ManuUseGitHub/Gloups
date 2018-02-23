function configurationOfRewriteOnArvs() {
    var services = {

        // custom
        'uglyness': 'beauty',
        'times': 'once',
    };

    var subAr = process.argv.slice(2, process.argv.length);
    subAr.forEach(function(serv) {
        try {
            var opt = (/^--(.*)$/.exec(serv));

            if (opt && (matchOption = opt[1])) {

                console.log(matchOption);
                if (matchOption == 'ugly') {
                    services.uglyness = matchOption;

                } else if (matchOption == 'multiple') {
                    services.times = matchOption;

                } else {
                    console.log(chalk.red("unknown option --" + matchOption));
                }
            }
        } catch (err) {
            errors.push(err + " Error with option: ");
        }
    })
    return services;
}

function tasksToRunOnArgvs() {
    var services = {

        // custom
        'wars': 'removeWarVersion',
        'del': 'autodel',
        'minjs': 'automin',
        'ts': 'typescript',
        'less': 'less',
        'sass': 'sass',
        'mincss': 'autominCss',

        // presets
        'all': 'autodel automin typescript less sass autominCss',
        'style': 'less sass autominCss',
        'js': 'autodel automin',
        'typescript': 'autodel automin typescript'
    };

    var effectiveServices = [];
    var errors = [];
    var optionCount = 0;

    var subAr = process.argv.slice(2, process.argv.length);
    for (serv in subAr) {
        try {
            var key = (/^--(.*)$/.exec(subAr[serv]));

            if (key && (matchOption = key[1])) {

                if (/^all|style|js|typescript$/.test(matchOption)) {
                    effectiveServices = services[matchOption].split(" ");
                    if (optionCount > 0) {
                        errors = [];
                        throw "GRAVE ERROR: Too much presets";
                    }
                } else if (services[matchOption]) {
                    effectiveServices.push(services[matchOption]);
                } else {
                    console.log(chalk.red("unknown option --" + matchOption));
                }

            }
        } catch (err) {
            errors.push(err + " Error with option: ");
            if (/^GRAVE ERROR.*$/.test(err)) {
                effectiveServices = [];
                break;
            }
        }
        optionCount++;
    }
    logErrorsOnTaskArgvs(errors);
    return effectiveServices;
}