function tasksToRunOnArgvs() {
    var effectiveServices = [];
    var errors = [];
    var optionCount = 0;
    var service = '?';

    // start the arguments array at index 3 because argv contains [[default],TaskName,arg1,arg2, ... ,argN]
    var subAr = process.argv.slice(3, process.argv.length);

    for (serv in subAr) {
        try {
            var key = (/^([\-][\-]?)([^\-]+)$/.exec(subAr[serv]));
            service = key[2];

            // check if the argument is well formed based on the dash caracter : 
            //      > -a or --abc not --a or -abc
            checkWellForming(key, service);

            // -a to --abc
            service = convertAliasToFullNameOption(key,service);

            if (key && (matchOption = service)) {

                // check if a preset is single ; throws if not
                effectiveServices = checkPresetsOverdose(effectiveServices, optionCount);

                // check and push options that are real ; throws if no real options
                pushMatchingOption(effectiveServices, matchOption);
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

function checkWellForming(key, service) {
    if (key[1].length > 2) {
        errors = [];
        throw "GRAVE ERROR: argument malformed";
    }
}

function convertAliasToFullNameOption(key,service) {
    if (key[1].length == 1) {
        service = services[service];
    }
    return service;
}

function checkPresetsOverdose(effectiveServices, optionCount) {
    if (presetsRegex.test(matchOption)) {
        effectiveServices = services[matchOption].split(" ");
        if (optionCount > 0) {
            throw "GRAVE ERROR: Presets should be alone : " + matchOption;
        }
    }
    return effectiveServices;
}

function pushMatchingOption(effectiveServices, matchOption) {
    if (!presetsRegex.test(matchOption)) {
        if (services[matchOption]) {
            effectiveServices.push(services[matchOption]);
        } else {
            throw "GRAVE ERROR: unknown option or preset or alias : -" + matchOption + " or --" + matchOption;
        }
    }
}