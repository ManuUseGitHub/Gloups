![logo](images/mzg2.ico) [![uglify service][uglify-badge]][uglify-link] [![typescript service][typescript-badge]][typescript-link] [![coffeescript service][coffee-badge]][coffee-link] [![less service][less-badge]][less-link] [![sass service][sass-badge]][sass-link] [![stylus service][stylus-badge]][stylus-link] [![clean css service][cleanCSS-badge]][cleanCSS-link]

# Gloups v6.3

[![MIT license][license-badge]][license-link]

## A GULP IMPLEMENTATION ONCE AND FOR ALL
Gloups is a tool that uses the gulp ecosystem and provides services like compression of scripts (<b>CSS</b> and <b>JS</b>), compilation/processing <b>LESS</b>, <b>SASS</b>, <b>STYLUS</b>, <b>TS</b>, <b>JS</b>, <b>CoffeeScript</b>. The difference between Gloups and simply using gulp is that Gloups is set globally from a root path like C:\ folder on Windows systems or Home folder on Unix systems once and watches for multiple projects.

## END USER INSTALLATION (DEV)

1. Get the gloups folder

       $ git clone https://github.com/ManuUseGitHub/gloups.git

2. Make sure gulp is updated and install npm dependencies

       $ npm i -g gulp 
       $ cd gloups
       $ npm install

3. Check default configuration by running bellow command ... bad news should be printed out to catch your attention and guide you in order to show you how you have to configure gloups

       $ gulp serviceMapping

4. Once gloups is configured, generate custom configuration files by running the command : 

       $ gulp scanprojects
       
   
    The effect of that command is to create a <b>config.mzg.json</b> file in project root folders you specified in the custom/config.json file.

    > Config.mzg.json files are not blank and have instructions.
    > In these files, uncomment what services you want to enable.
    > Enable sourcemapping for services you want by switching sourcemaps fields to true.

5. Follow the paths you gave in the configuration, open the config.mzg.json file. Configure it by following instructions and examples. 

6. Open a terminal into gloups folder and make Gloups serve you (watch over your projects)

       $ gulp serve --all [--transitivity]
   
   Shorter :
       
       $ gulp serve -a [-a]

## END USER INSTALLATION (DISTRIBUTION)

1. Get the dist folder

       $ mkdir gloups
       $ cd gloups
       $ git init
       $ git remote add origin -f https://github.com/ManuUseGitHub/gloups.git
       $ git config core.sparsecheckout true
       $ echo dist/* >> .git/info/sparse-checkout
       $ git pull origin master

2. Make sure gulp is updated and install npm dependencies

       $ npm i -g gulp 
       $ npm install

3. Follow same steps as the installation for devs in <b>End user installation (dev) section</b> from step 3.
 
## USAGE
Once everything is set run gulp task 'serve' with options you want. The simplest way is to run all services via the preset --all with the transitive option :

    $ gulp serve --sass --less --stylus --mincss --ts --coffeescript --minjs --transitive
    
Shorter (with --all option) :

    $ gulp serve -a -tr

## HELP
> For every possibility, refer to the help.md file or with command run  ```$ gulp helpMe```. 
> Some of them can make the experience better such as the ```--essential``` option if Gloups is too much verbose for you. Just run ```$ gulp task --option(s) --essential``` or shorter:```$ gulp task -aliases -es```

Go check [help.md](HELP.md) !

## EXTRAS

More fun stuffs ! The Gloups project aims to be scalable in terms of implementing the solution but also in user experience. This section covers what Gloups can offer to improve its utilization. Be aware without further ado. We've been creative to make you saving time!

Go check [Extras.md](EXTRAS.md) !

## LICENSE
[MIT][license-link] © [ManuUseGitHub (Jean Luc Emmanuel VERHANNEMAN)](https://www.linkedin.com/in/jean-luc-emmanuel-verhanneman-5a9381ab/)

[uglify-badge]: images/js-gulp--uglify-f9ea85.svg
[uglify-link]: https://www.npmjs.com/package/gulp-uglify

[typescript-badge]: https://img.shields.io/badge/ts-gulp--typescript-152740.svg?style=flat-square
[typescript-link]: https://www.npmjs.com/package/gulp-typescript

[coffee-badge]: https://img.shields.io/badge/coffee-gulp--coffee-3e2723.svg?style=flat-square
[coffee-link]: https://www.npmjs.com/package/gulp-coffee

[less-badge]: https://img.shields.io/badge/less-gulp--less-1d365d.svg?style=flat-square
[less-link]: https://www.npmjs.com/package/gulp-less

[stylus-badge]: https://img.shields.io/badge/stylus-gulp--stylus-ff6347.svg?style=flat-square
[stylus-link]: https://www.npmjs.com/package/gulp-stylus

[sass-badge]: https://img.shields.io/badge/sass-gulp--sass-c6538c.svg?style=flat-square
[sass-link]: https://www.npmjs.com/package/gulp-sass

[cleanCSS-badge]: https://img.shields.io/badge/css-gulp--clean--css-17cfa3.svg?style=flat-square
[cleanCSS-link]: https://www.npmjs.com/package/gulp-clean-css

[license-badge]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-link]: LICENSE

[stackoverflow-icon]: images/so-icon.svg
[stackoverflow-link]: https://stackoverflow.com
