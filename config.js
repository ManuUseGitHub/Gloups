/*
 _____________________________________________________________________________________________
|                                                                                             |
|                               -- YOUR PROJECTS MAPPING HERE --                              |
|_____________________________________________________________________________________________|
*/
module.exports = {
    "verbose": false,
    "pathesToJs": [
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/Scripts/vanilla/**/*.js",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/Scripts/Production",
            "sourcemaps": false,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        },
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/MyDev/Scripts/**/*.js",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/MyDev/Scripts/Production2",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        }
    ],
    "pathesToTs": [
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/Scripts/ts/**/*.ts",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/Scripts/vanilla",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        }
    ],
    "pathesToCoffee": [
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/Scripts/coffee/**/*.coffee",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/Scripts/vanilla",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        }
    ],
    "pathesToStyle": [
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/**/*.css",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/Production",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        }
    ],
    "pathesToStyleLess": [
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/less/**/*.less",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        }
    ],
    "pathesToSass": [
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/sass/**/*.scss",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        },
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/sass/**/*.scss",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        }
    ],
    "pathesToStylus": [
        {
            "watch": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/stylus/**/*.styl",
            "dest": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS",
            "sourcemaps": true,
            "projectPath": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "projectName": "Gloups-Site"
        }
    ],
    "projects": [
        {
            "project": "Gloups-Site",
            "path": "../xampp/htdocs/www/laravel/mysite/Gloups-Site",
            "checked": true
        }
    ],
    "sassMaching": [
        {
            "identifier": "test.scss",
            "target": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/sass/components/test.scss",
            "partials": [
                ".../Gloups-Site/CSS/sass/components/Ideas/concept"
            ]
        },
        {
            "identifier": "started_style.scss",
            "target": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/sass/started/started_style.scss",
            "partials": [
                ".../Gloups-Site/CSS/sass/started/variables",
                ".../Gloups-Site/CSS/sass/started/mixins/mixins",
                ".../Gloups-Site/CSS/sass/started/components/startedheader",
                ".../Gloups-Site/CSS/sass/started/components/components",
                ".../Gloups-Site/CSS/sass/started/components/microcomponents",
                ".../Gloups-Site/CSS/sass/started/components/conduct",
                ".../Gloups-Site/CSS/sass/started/components/sidebar",
                ".../Gloups-Site/CSS/sass/started/components/alternsidebar",
                ".../Gloups-Site/CSS/sass/started/components/foot"
            ]
        },
        {
            "identifier": "style.scss",
            "target": "../xampp/htdocs/www/laravel/mysite/Gloups-Site/CSS/sass/style.scss",
            "partials": [
                ".../Gloups-Site/CSS/sass/basics/variables",
                ".../Gloups-Site/CSS/sass/stylingDetails/titles",
                ".../Gloups-Site/CSS/sass/components/Ideas/concept",
                ".../Gloups-Site/CSS/sass/functions_mixins/mixins",
                ".../Gloups-Site/CSS/sass/basics/others",
                ".../Gloups-Site/CSS/sass/components/components",
                ".../Gloups-Site/CSS/sass/components/main_descr",
                ".../Gloups-Site/CSS/sass/animations/solar-system-animation"
            ]
        }
    ]
};