/**
 * Created by jacob.purcell on 16/01/2015.
 */


var cliOptionsProvider = require("./cli/cli-options-provider.js");
var cliOptionsPrinter = require("./cli/cli-options-printer.js");
var cliTitleScreen = require("./cli/cli-title-screen.js");
var compilers = require("./compilation/throttled-typescript-compiler.js");
var fileWatcher = require('./watchers/typescript-file-watcher.js');

var options = cliOptionsProvider.getCliOptions();

cliTitleScreen.printTitleScreen
              .then(function () { cliOptionsPrinter.printOptions(options) });

var compiler = new compilers.ThrottledTypeScriptCompiler(options.typescript);

fileWatcher.beginWatch(compiler, options.filepath);