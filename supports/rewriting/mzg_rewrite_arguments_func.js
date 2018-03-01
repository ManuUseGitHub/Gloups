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