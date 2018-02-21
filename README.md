# MazeGulp
An Amazing gulp helper that provides services like compression of scripts (CSS and JS) , compilation of scripts (LESS, SASS, TS and JS) and more ... on the fly globaly from a root path like C:\ or Home folder.

the purpose is to ovoid installing gulp in every project and repeat dozen of time the same code for the same purpose in every ney project. Just configure MazeGulp and a file local to the project and you're done.

## Installation

0. download the MazeGulp project or clone it
    ```
    $ git clone https://github.com/ManuUseGitHub/MazeGulp.git
    ```

1. If MazeGulp is Your first Tool using Node installed, make sure node is installed.
    ```
    $ node --version
    ```
2. If you encounter an error saying the following "'node' is not recognized as an internal or an external command", make node available by adding the path to it in the Environnement Path 
    https://stackoverflow.com/questions/23412938/node-is-not-recognized-as-an-internal-or-an-external-command-operable-program#answer-28821955
3.  Then run
    ```
    $ npm install
    $ npm install -g gulp --save-dev
    ```
    
## Setup MazeGulp

1. Configure the projects mapping file (custom/config.ini). 
    The example template within the exemple section should gide you to setup MazeGulp accordingly to your projects.
    A project's definition should match the following syntax: 
    ```
    [ProjectNameDisplayedInMazeGulp,"root/path/folder/for/project/relative/to/MazeGulp",<enable state (star "*" means "check that")>]. 
    ```

2. Then run
    ```
    $ gulp scanProjects
    ```
    the effect of that command is to create config.mzg.ini files at the project root folder you specified in the custom/config.ini file via the project path you gave.

    config.mzg.ini file is not blank and has like the custom/config.ini file a exemple template in the exemple section.
    In those files, uncomment what services you want to enable.

    - To check what service is enabled for what project run:
        ```
        $ gulp serviceMapping    
        ```
    
## Usage
Once everything is set run gulp options you want. The simplest way is to run all services via the preset --all
```
$ gulp --all
```
Refer to the help.md file or run ```$ gulp helpMe``` (which will display help.md content) to know about what service is available and presets as well.
