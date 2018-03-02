![logo](site/mzg2.ico)
# Gloups
|License|JS|CSS|
| :---: | :---: | :---: |
|[![MIT license][license-badge]][license-link]|[![uglify service][uglify-badge]][uglify-link] [![typescript service][typescript-badge]][typescript-link] [![coffeescript service][coffee-badge]][coffee-link]|[![less service][less-badge]][less-link] [![sass service][sass-badge]][sass-link] [![clean css service][cleanCSS-badge]][cleanCSS-link]|

## A Gulp implementation once and for all
That ecosystem provides services like compression of scripts (CSS and JS) , compilation of scripts (LESS, SASS, TS and JS) and more ... on the fly globaly from a root path like C:\ or Home folder. Say no more implementation of gulp localy for every project use juste one, use this one.

### in other words
The purpose is to ovoid installing gulp in every project and repeat dozen of time the same code for the same purpose in every project. Just configure Gloups and a file local to the project and you're done.

## End user installation

1. Download the Gloups project or clone it.
    
    ```
    $ git clone https://github.com/ManuUseGitHub/Gloups.git 
    ```
    
    Extract the 'dist' folder and copy it where you want and open a terminal in it 
    If Gloups is Your first Tool using Node installed, make sure node is installed.
    
    ```
    $ node --version
    ```

2.  run 
    
    ```
    $ npm install
    ```

3.  Gloups use the gulp task runner so make sure it is installed
    
    ```
    $ npm install -g gulp --save-dev
    ```
    

## Setup

1. Configure the projects mapping file *(custom/config.ini)*.  

    The example template within the exemple section should gide you to setup Gloups accordingly to your projects.
    A project's definition should match the following syntax 
    
    ```INI
    [
        ProjectNameDisplayedInGloups,
        "root/path/folder/for/project/relative/to/Gloups",
        *
    ],

    ```

    The star "\*" at last index means (check that project). To avoid checking a project, just let the value blank and keep the coma "," symbole.

2.  Scan projects

        $ gulp scanProjects 

    The effect of that command is to create config.mzg.ini files at the project root folder you specified in the custom/config.ini file via the project path you gave.

    > config.mzg.ini file is not blank and has like the custom/config.ini file a exemple template in the exemple section.
    > In those files, uncomment what services you want to enable.

    To check what service is enabled for what project run
    
    ```
    $ gulp serviceMapping    
    ```

>## Frequent Windows issue
>If you encounter an error saying the following "'node' is not recognized as an internal or an external command", make node available by >adding the path to it in the Environnement Path. 
>    
>[![stackoverflow][stackoverflow-icon]][stackoverflow-link] [stackoverflow &bull; answer-28821955](https://stackoverflow.com/questions/23412938/node-is-not-recognized-as-an-internal-or-an-external-command-operable-program#answer-28821955)

## Usage
Once everything is set run gulp task 'serve' with options you want. The simplest way is to run all services via the preset --all.

    $ gulp serve --all

Or use alias '-a'

    $ gulp serve -a

For every possibilities, refer to the help.md file or run 

    $ gulp helpMe

(which will display help.md content) to know about what service is available and presets as well.

## Static support webpage
You can dispose of the static support webpage. It provides a stylish view for this README.md file and the help.md file

## License
[MIT][license-link] © [ManuUseGitHub (Jean Luc Emmanuel VERHANNEMAN)](https://www.linkedin.com/in/jean-luc-emmanuel-verhanneman-5a9381ab/)

[uglify-badge]: images/js-gulp--uglify-f9ea85.svg
[uglify-link]: https://www.npmjs.com/package/gulp-uglify

[typescript-badge]: https://img.shields.io/badge/ts-gulp--typescript-152740.svg?style=flat-square
[typescript-link]: https://www.npmjs.com/package/gulp-typescript

[coffee-badge]: https://img.shields.io/badge/coffee-gulp--coffee-3e2723.svg?style=flat-square
[coffee-link]: https://www.npmjs.com/package/gulp-coffee

[less-badge]: https://img.shields.io/badge/less-gulp--less-1d365d.svg?style=flat-square
[less-link]: https://www.npmjs.com/package/gulp-less

[sass-badge]: https://img.shields.io/badge/sass-gulp--sass-c6538c.svg?style=flat-square
[sass-link]: https://www.npmjs.com/package/gulp-sass

[cleanCSS-badge]: https://img.shields.io/badge/css-gulp--clean--css-17cfa3.svg?style=flat-square
[cleanCSS-link]: https://www.npmjs.com/package/gulp-clean-css

[license-badge]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-link]: LICENSE

[stackoverflow-icon]: images/so-icon.svg
[stackoverflow-link]: https://stackoverflow.com
