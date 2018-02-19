Maze Gulp 

[COMMANDES]
Viable commandes are:
    $ gulp helpMe       which shows this help ...
    $ gulp --options    which allows to mixin options (see options)
    $ gulp --preset     WARN: one preset only (no mixin)

Viable rewrite gulpfile.js commandes are:
    $ gulp rewrite [--multiple] [--ugly] 
                        : rewrite the file [watching for changes on files (see MZG_FILES)]
                        : rewrite the file [minified].
    
    comment : that command wile watch MZG_FILES and merge them into the gulpfile.js

[OPTIONS]
Valid options are:
    --del           Delete orphan .min.js files when .js files are (re)moved
    --minjs         Minify (compress) .js files
    --ts            Compile .ts (typescript) files
    --less          Compile .less files
    --mincss        Compress .css files
	--wars			rename .war files by removing version suffixes

Presets:
    --all           Provide all services.
                    Equals to : --del --minjs --ts --less --mincss

    --style         Provide LESS and CSS style services.
                    Equals to : --less --mincss
    
    --js            Provide JavaScript services.
                    Equals to : --del --minjs

    --typescript    Provide JavaScript and TypeScript services.
                    Equals to : --del --minjs --ts

MAY - NOVEMBER 2017