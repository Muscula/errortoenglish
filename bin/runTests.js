"use strict";
var fs = require("fs");
var path = require("path");

runJsHint(["lib", "test", "bin"], function (err) {
	if (err) {
		console.error("Exiting because of jsHint errors");
		return process.exit(1);
	}
	return runMocha();
});

function runMocha() {
	var realProcessExit = process.exit;
	process.exit = function(code){
		setTimeout(realProcessExit.bind(process, code), 2000);
	};
	require('../node_modules/mocha/bin/_mocha');
}

function runJsHint(pathsArray, callback) {
	var jsHint = require("../node_modules/jshint/lib/hint.js");
	var config = JSON.parse(fs.readFileSync(path.resolve(".jshintrc"), "utf-8"));
	var reporter = require("../node_modules/jshint/lib/reporters/default.js").reporter;
	var ignores = fs.readFileSync(path.resolve(".jshintignore"), "utf8").split("\n")
		.filter(function (line) {
			return !!line.trim(); //remove empty lines
		})
		.map(function(file){
            return path.resolve(file);
        });
	var results = jsHint.hint(pathsArray, config, reporter, ignores);
	if (results.length > 0) {
		return callback(new Error("JSHintErrors"));
	}
	return callback(null);
}