/**
 * Created by jacob.purcell on 16/01/2015.
 */

var watch = require('node-watch');
var console = require('better-console');

exports.beginWatch = function(compiler, filepath) {
    console.info('Watching Files... ');

    watch(filepath, function (filename) {
        if (filename) {
            //console.debug('file changed: ' + filename);

            var extensionIdx = filename.lastIndexOf('.') + 1;
            var extension = filename.substr(extensionIdx);

            if (extension.toLowerCase() === "ts") {
                console.debug('compiling typescript file: ' + filename);
                compiler.compile(filename);
            }
        }
    });
};