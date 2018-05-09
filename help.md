# Gloups
### COMMANDS
Viable commands are:

    $ gulp helpMe           Shows this help ...
    $ gulp serve --options  Allows to mixin options (see options)
    $ gulp setve --preset   WARN: one preset only (no mixin)

Viable rewrite gulpfile.js commands are:

    $ gulp rewrite [--multiple] [--ugly] 
         > rewrite the file [watching for changes on files (see MZG_FILES)]
         > rewrite the file [minified].

> WARN: unavailable for production very soon.

that command will watch for MZG_FILES changes and wll then merge them into the gulpfile.js


### OPTIONS

Valid options are:

    --minjs, -minj      Minify (compress) .js files

    --ts, -t            Compile .ts (typescript) files

    --coffee, -c        Compile .coffee (coffeescript) files

    --less, -s1         Compile .less files

    --sass, -s2         Compile .scss files

    --stylus, -s3       Compile .styl files

    --mincss, -minc     Compress .css files


Presets are:

    --all,              Provides all services.
    -a                  Equals to : --minjs --ts --coffee --less --mincss
                        Or equals to : -mj -ts -c -l -mc

    --style,            Provides .less and .css files oriented services.
    -st                 Equals to : --less --sass --mincss
                        Or equals to : -l -s -mc

    --js,               Provides .js files oriented services.
    -jvs                Equals to : --del --minjs
                        Or equals to : -d -mj

    --typescript,       Provides .js and .ts files oriented services.
    -tps                Equals to : --minjs --ts
                        Or equals to : -mj -ts

    --coffeescript,     Provides .js and .coffee files oriented services.
    -cof                Equals to : --minjs --coffee
                        Or equals to : -mj -c


Advanced options are:

    --transitive        Remove a B step in ABC set of transformations
    -tr                 For less, sass or stylus coupled with autominCss
                        For typescript or coffeescript coupled with
                        automin. The same effect when --all option 
                        is selected

    --essential         Make certain messages printed out to lightweight
    -es                 the terminal and make Gloups less verbose

