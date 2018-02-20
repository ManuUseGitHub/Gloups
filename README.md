# MazeGulp
An Amazing gulp helper that provides services like compression of scripts (CSS and JS) , compilation of scripts (LESS, SASS, TS and JS) and more ... on the fly globaly from a root path like C:\ or Home folder.

the purpose is to ovoid installing gulp in every project and repeat dozen of time the same code for the same purpose in every ney project. Just configure MazeGulp and a file local to the project and you're done.

## Installation

    $ git clone https://github.com/ManuUseGitHub/MazeGulp.git
    $ npm install

certain modules may have been installed before continuing. Here are npm installation and how they are used:

```
npm install argv --save-dev
npm install chalk --save-dev
npm install cleanCSS --save-dev
npm install concat --save-dev
npm install del --save-dev
npm install fs --save-dev
npm install fssync --save-dev
npm install glob --save-dev
npm install gulp --save-dev
npm install gutil --save-dev
npm install jshint --save-dev
npm install jsValidate --save-dev
npm install less --save-dev
npm install nop --save-dev
npm install path --save-dev
npm install rename --save-dev
npm install runSequence --save-dev
npm install sass --save-dev
npm install ts --save-dev
npm install uglify --save-dev
npm install wait --save-dev
```
    
## Setup MazeGulp

The very first thing you have to do after fully installed MazeGulp is to configure the projects mapping file (custom/config.ini). 
The example template within the exemple section should gide you to setup MazeGulp accordingly to your projects.

A project's definition should match the following syntax: 
```
[ProjectNameDisplayedInMazeGulp,"root/path/folder/for/project/relative/to/MazeGulp",<enable state (star "*" means "check that")>]. 
```

Then run
```
$ gulp scanProjects
```
the effect of that command is to create config.mzg.ini files at the project root folder you specified in the custom/config.ini file via the project path you gave.

config.mzg.ini file is not blank and has like the custom/config.ini file a exemple template in the exemple section.
In those files, uncomment what services you want to enable.

To check what service is enabled for what project run:
```
$ gulp serviceMapping    
```
    
## Usage
Once everything is set run gulp options you want. The simplest way is to run all services via the preset --all
```
$ gulp --all
```
Refer to the help.md file or run ```$ gulp helpMe``` (which will display help.md content) to know about what service is available and presets as well.
