/**
 * Created by jacob.purcell on 16/01/2015.
 */

var exec = require('child_process').exec;
var fs = require("fs");
var console = require('better-console');

exports.ThrottledTypeScriptCompiler = function (typeScriptPath, throttleThresholdMillis){
    this.typeScriptPath = typeScriptPath;
    this.throttleThresholdMillis = throttleThresholdMillis || 100;
    this.filesToCompileLookup = {}; // use dictionary to avoid duplicates
};

/**
 * Compiles a TypeScript file.
 * Throttles when multiple calls are made within time threshold.
 * @param filename - name of the file to compile
 */
exports.ThrottledTypeScriptCompiler.prototype.compile = function(filename){
    var that = this;

    // allow initial compile call through and throttle subsequent calls
    if (!this.shouldThrottle){
        exec(this.typeScriptPath + ' -t ES5 "' + filename + '"', printOutput);
        this.shouldThrottle = true;
    }
    else{
        // queue up files to compile
        this.filesToCompileLookup[filename] = true;

        // clear existing scheduled compilation call
        this.throttleId && clearTimeout(this.throttleId);

        // schedule compilation call
        this.throttleId = setTimeout(function() {
            that.shouldThrottle = false;
            var filesToCompile = Object.keys(that.filesToCompileLookup);
            that.compileAll(filesToCompile);
            that.filesToCompileLookup = { };
        }, exports.throttleThresholdMillis);
    }
};

/**
 * Compiles multiple typescript files
 * @param filesToCompile - array of files to compile
 */
exports.ThrottledTypeScriptCompiler.prototype.compileAll = function(filesToCompile) {
    // create temporary text file for specifying which files are to be compile
    var filesString = filesToCompile.map(function(fn){ return '"' + fn + '"'; }).join("\r\n");
    fs.writeFileSync('files-to-compile.txt', filesString);

    // run typescript compiler
    exec(this.typeScriptPath + ' @files-to-compile.txt -t ES5', function() {
        printOutput.apply(null, arguments);

        // delete temporary file
        exec('rm files-to-compile.txt', printOutput);
    });
}

function printOutput (error, stdout, stderr) {
    stdout && console.error(stdout);
    stderr && console.error(stderr);
}