/**
 * Created by jacob.purcell on 16/01/2015.
 */

var cliArgs = require("command-line-args");

/**
 * Retrieves the command line arguments
 * @returns command line options
 */
exports.getCliOptions = function() {
    /* define the command-line options */
    var cli = cliArgs([
        { name: "filepath", type: String, alias: "p", description: "Path of typescript files to watch e.g. '[repo]\\src'" },
        { name: "typescript", type: String, alias: "t", description: "Path of typescript compiler e.g. 'node_modules\\.bin\\tsc.cmd'" }
    ]);

    /* parse the supplied command-line values */
    var options = cli.parse();

    /* generate a usage guide */
    var usage = cli.getUsage({
        header: "Watches TypeScript files for changes and compiles them in ES5.\n" +
              "  Throttles multiple file changes into single compile command."
    });

    if(!options.filepath || !options.typescript) {
        console.error('Error: Both Filepath and TypeScript path must be specified.');
        console.log(usage);
        process.exit(1)
    }

    return options
};