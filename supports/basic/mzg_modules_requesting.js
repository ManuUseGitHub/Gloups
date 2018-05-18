// gloups commandes
if (process.argv[2] == '--gulpfile') {
	process.argv[2] = process.argv[4];
}

if (process.argv[2] && !/^serve|pulse|rewrite$/.test(process.argv[2])) {
	importNeededModules('intask', process.argv[2]);
}