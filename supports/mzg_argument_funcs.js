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

function tasksToRunOnArgvs() {
    var effectiveServices = [];
    var errors = [];
    var optionsCount = 0;

    // translate aliasses into args equivalances like -a is replaced by --all in the arg. string
    var subs = translateAliassesInArgs(process.argv, SERVICES);
    
    // strips all non options or presets arguments
    var subAr = getSliceOfMatchingOptions(subs, GLOUPS_OPTIONS);

    for (var service in subAr) {
        try {
            service = (/^[\-][\-]?([^\-]+)$/.exec(subAr[service]))[1];
            
            if (new RegExp("^\\b(" + PRESET_OPTIONS + ")\\b$").test(service)) {

                // check if a preset is single ; throws if not
                checkPresetsOverdose(++optionsCount, service);

                // convert the preset into a list of matching options
                effectiveServices = SERVICES[service].split(' ');
            
            }else{
                effectiveServices.push(SERVICES[service]);    
            }
        } catch (err) {
            errors.push(err + " Error with option: ");
            if (/^GRAVE ERROR.*$/.test(err)) {
                effectiveServices = [];
                break;
            }
        }
        optionsCount++;
    }

    logErrorsOnTaskArgvs(errors);
    return effectiveServices;
}

function checkPresetsOverdose(optionsCount, service) {
    if (optionsCount > 1) {
        throw "GRAVE ERROR: Presets should be alone : " + service;
    }
}