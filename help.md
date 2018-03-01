# Maze Gulp
### COMMANDES
Viable commandes are:

    $ gulp helpMe           Shows this help ...
    $ gulp serve --options  Allows to mixin options (see options)
    $ gulp setve --preset   WARN: one preset only (no mixin)

Viable rewrite gulpfile.js commandes are:

    $ gulp rewrite [--multiple] [--ugly] 
         > rewrite the file [watching for changes on files (see MZG_FILES)]
         > rewrite the file [minified].

> WARN: unavailable for production very soon.

that command will watch for MZG_FILES changes and wll then merge them into the gulpfile.js


### OPTIONS

Valid options are:

    --del, -d           Delete .min.js files when .js files are (re)moved

    --minjs, -mj        Minify (compress) .js files

    --ts, -t            Compile .ts (typescript) files

    --coffee, -c        Compile .coffee (coffeescript) files

    --less, -l          Compile .less files

    --mincss, -mc       Compress .css files

    --wars              rename .war files by removing version suffixes


Presets are:

    --all,              Provides all services.
    -a                  Equals to : --del --minjs --ts --coffee --less --mincss
                        Or equals to : -d -mj -ts -c -l -mc

    --style,            Provides .less and .css files oriented services.
    -st                 Equals to : --less --mincss
                        Or equals to : -l -mc

    --js,               Provides .js files oriented services.
    -jvs                Equals to : --del --minjs
                        Or equals to : -d -mj

    --typescript,       Provides .js and .ts files oriented services.
    -tps                Equals to : --del --minjs --ts
                        Or equals to : -d -mj -ts

    --coffeescript,     Provides .js and .coffee files oriented services.
    -cof                Equals to : --del --minjs --coffee
                        Or equals to : -d -mj -c

