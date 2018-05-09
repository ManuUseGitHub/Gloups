function configurationOfRewriteOnArvs() {
    var argvs = translateAliassesInArgs(process.argv, RewriteServices);
    var subAr = getSliceOfMatchingOptions(argvs, "ugly|beauty|once|multiple");
    var matchOption;

    subAr.forEach(function(serv) {
        try {
            var opt = (/^--(.*)$/.exec(serv));

            if (opt && (matchOption = opt[1])) {
                RewriteServices.uglyness = matchOption == 'ugly' ? matchOption : RewriteServices.uglyness;
                RewriteServices.times = matchOption == 'multiple' ? matchOption : RewriteServices.times;
            }

        } catch (err) {/* nothing */}
    });

    return {
        'times': RewriteServices.times,
        'uglyness': RewriteServices.uglyness
    };
}