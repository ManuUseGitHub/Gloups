
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

function typescripting(dest){
    return ts({
        noImplicitAny: true
    });
}

function insertSignatureAfter(actionDone, thanksToModule) {
    return insert.append("\n" +
        "/* -- " + actionDone + " with Gloups|" + GLOUPS_VERSION +
        " using " + thanksToModule + " -- */");
}

function sourcemapInit(sourcemapping) {
    return (sourcemapping ? sourcemaps.init : nop)();
}

function sourcemapWrite(sourcemapping) {
    return sourcemapping ? sourcemaps.write('./') : nop();
}

function autoprefix() {
    return autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    });
}

function serveCoffee(){
    return coffee({
        bare: true
    });
}

function makeLess(){
    return less({
        paths: [path.join(__dirname, 'less', 'includes')]
    })
}