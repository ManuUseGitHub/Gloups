// gloups commandes
if (process.argv[2] == '--gulpfile') {
	if (process.argv[4] && !/^serve|rewrite$/.test(process.argv[4])) {
		importNeededModules('intask', process.argv[4]);
	}
} else {
	if (process.argv[2] && !/^serve|rewrite$/.test(process.argv[2])) {
		importNeededModules('intask', process.argv[2]);
	}
}