function renameSuffixMin() {
    return rename({
        suffix: '.min'
    });
}

function cleanCssMinification() {
    return cleanCSS({
        compatibility: 'ie8'
    });
}

function typescripting(dest) {
    return ts({
        noImplicitAny: true
    });
}

function insertSignatureAfter(actionDone, thanksToModule) {
    return insert.append("\n/* -- {0} with Gloups {1} | {2} using -- */".format([
        actionDone, GLOUPS_VERSION, thanksToModule
    ]));
}

function sourcemapInit(sourcemapping) {
    return (sourcemapping ? sourcemaps.init : nop)();
}

function sourcemapWrite(sourcemapping) {
    return sourcemapping ? sourcemaps.write('./') : nop();
}

function autoprefix() {
    return autoprefixer({
        browsers: AUTOPREFIXER_BROWSERS,
        cascade: false
    });
}

function serveCoffee() {
    return coffee({
        bare: true
    });
}

function makeLess() {
    return less({
        paths: [path.join(__dirname, 'less', 'includes')]
    });
}

function transitivitySetup(transitivity, matchingEntry, path) {
    return through.obj(function(chunk, enc, callback) {
        var shouldBeTransitive =
            metAllArgs(['all', 'transitive']) ||
            metAllArgs(['sass', 'mincss', 'transitive']) ||
            metAllArgs(['less', 'mincss', 'transitive']);

        var found = false;

        // by default the transitivity is set to the path the result should be the destination
        transitivity.dest = matchingEntry.dest;

        if (shouldBeTransitive) {
            var fileName = (/^.*[\/](.*)$/g.exec(path.hackSlashes()))[1];
            var focusedPathFileName = "{0}/{1}".format([matchingEntry.dest, fileName]);
            var matchingEntryFinal = getMatchingEntryConfig(focusedPathFileName, config.pathesToStyle);

            found = matchingEntryFinal != null;
            transitivity.should = found;

            if (found) {
                transitivity.compressing = cleanCssMinification;
                transitivity.suffixing = renameSuffixMin;
                transitivity.dest = matchingEntryFinal.dest;
            }
        }
        callback(null, chunk);
    });
}
function transitiveWrapAround(glob_transitivity, matchingEntry, path, lazyPipeProcess) {
    return lazyPipe()
        .pipe(transitivitySetup, glob_transitivity, matchingEntry, path)
        .pipe(lazyPipeProcess)

        // piping transformations when it should transit
        .pipe(glob_transitivity.compressing)
        .pipe(glob_transitivity.suffixing);
}

function setSourceMappingAndSign(lazyPipeProcess, matchingEntry, sign) {
    var sourcemapping = matchingEntry.sourcemaps;
    return lazyPipe()
        .pipe(sourcemapInit, sourcemapping)
        .pipe(lazyPipeProcess)
        .pipe(insertSignatureAfter, sign.action, sign.module)
        .pipe(sourcemapWrite, sourcemapping);
}

function appendFilesToLog(message, lazyPipeProcess, event) {
    // -- end process logging -----------------------------------------------------
    gulp.src(event.path)
        // append files in order to output all files compressed at once
        .pipe(through.obj(function(chunk, enc, cb) {
            --message.k;
            message.files.push(chunk.path);
            cb(null, chunk);
        }))

        .pipe(lazyPipeProcess())

        .pipe(wait(500))
        // let the files be added by creating a race condition

        // log final message when all files are done
        .on('end', function() {
            if (++message.k == 0) {
                console.log(forNowShortLog(message.txt, []));
                message.files.forEach(function(element, index) {
                    console.log(logFilePath(element.hackSlashes()));
                });
                console.log();
                message.files = [];
            }
        });
}

function consumePipeProcss(glob_transitivity, lasyPipeProcess, path, message) {
    // find the config through the json and getting watch ; dest ; sourcemapp etc.
    var matchingEntry = getMatchingEntryConfig(path, config.pathesToStyleLess);

    // LAZYPIPE wrapping transitivity and sourcemapping -------------------------------
    var thinkTransitively = transitiveWrapAround(glob_transitivity, matchingEntry, path, lasyPipeProcess);
    var sourceMappedProcess = setSourceMappingAndSign(thinkTransitively, matchingEntry, message);

    gulp.src(path)
        .pipe(sourceMappedProcess())
        .pipe(gulp.dest(glob_transitivity.dest));

    // call with logging of the time taken by the task
    console.log(forNowShortLog("Processed file version updated/created here :\n{0}> {1}", [breath(), logFilePath(matchingEntry.dest)]));
}