module.exports = {
/*
 __________________________________________________________________________________________________
|																								   |
|											  first service 									   |
|					> use this as a template or example for [Other services] below				   |
|					> put relative paths for [watch] and [dest] fields !					       |
|__________________________________________________________________________________________________|
 */
/*
	"minify_js": [
		{
			// --- the source path to watch .js file events ---
			"watch": "assets/js",

			// --- the destination folder for compressed/minified .js file ---
			"dest": "assets/js/prodution",

			// --- tells if gloups has to generate sourcemaps ---
			"sourcemaps":true
		}
	],
*/
	
/*
 __________________________________________________________________________________________________
|																								   |
|											  Other services									   |
|__________________________________________________________________________________________________|
 */	
	// follow the template above to fill lists of each service below
 	
 	// compress .js 	to 		.min.js
 	"minify_js": [],

	// compile	.ts 	to 		.js
	"ts_to_js": [],

	// compile	.coffee to 		.js
	"coffee_to_js": [], 

	// compress .css 	into	.min.css
	"minify_css": [],

	// compile	.less 	to 		.css
	"less": [],

	// compile 	.scss 	to 		.css
	"sass": [],

	// compile 	.styl 	to 		.css		
	"stylus": []
};