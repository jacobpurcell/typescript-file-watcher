/**
 * Created by jacob.purcell on 16/01/2015.
 */

var watch = require('node-watch');
var fs = require("fs");
var cliArgs = require("command-line-args");
var exec = require('child_process').exec;


/* define the command-line options */
var cli = cliArgs([
    { name: "filepath", type: String, alias: "p", description: "Path of typescript files to watch e.g. '[repo]\\src'" },
    { name: "typescript", type: String, alias: "t", description: "Path of typescript compiler e.g. 'node_modules\\.bin\\tsc.cmd'" }
]);

/* parse the supplied command-line values */
var options = cli.parse();

/* generate a usage guide */
var cliUsage = cli.getUsage({
    header: "Watches TypeScript files for changes and compiles them in ES5.  \n  Groups multiple file changes into single compile command."
});

//console.log(cliUsage);
if(!options.filepath || !options.typescript) {
    console.error('Error: Both Filepath and TypeScript path must be specified.');
    console.log(cliUsage);
    return -1;
}
else{
    console.log('watching: ' + options.filepath);
    console.log('using typscript: ' + options.typescript);
}


watch(options.filepath, function(filename) {
    if (filename) {
        var extensionIdx = filename.lastIndexOf('.') + 1;
        var extension = filename.substr(extensionIdx    );
        //console.log('filename provided: ' + filename);
        //console.log('extension: ' + extension);

        if (extension.toLowerCase() === "ts"){
            // console.log('typescript file provided: ' + filename);
            compile(filename);
        }
    }
});


var shouldThrottle = false;
var filesToCompile = {}; // use dictionary to avoid duplicates
var throttleId;
var throttlePeriodInMillis = 100;

function compile(filename){
    // allow initial compile call through and throttle subsequent calls
    if (!shouldThrottle){
        console.log('compiling single file');
        exec(options.typescript + ' -t ES5 "' + filename + '"', printOutput);
        shouldThrottle = true;
    }
    else{
        // queue up files to compile
        filesToCompile[filename] = true;

        // throttle
        throttleId != null && clearTimeout(throttleId);
        throttleId = setTimeout(function() {
            shouldThrottle = false;
            compileAll(filesToCompile);
            filesToCompile = {};
        }, throttlePeriodInMillis);
    }
}

function compileAll(filesToCompile) {
    // create temporary file from filenames
    var filesString = Object.keys(filesToCompile).map(function(fn){ return '"' + fn + '"'; }).join("\r\n");
    fs.writeFileSync('files-to-compile.txt', filesString);

    // run typescript compiler
    exec(options.typescript + ' @files-to-compile.txt -t ES5', function() {
        printOutput.apply(null, arguments);

        // delete temporary file
        exec('rm files-to-compile.txt', printOutput);
    });
}

function printOutput (error, stdout, stderr) {
    stdout && console.error(stdout);
    stderr && console.error(stderr);
};