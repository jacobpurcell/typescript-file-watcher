/**
 * Created by jacob.purcell on 16/01/2015.
 */

var console = require('better-console');
var sys = require("sys");
var Promise = require("promise");
var asciimo = require("asciimo").Figlet;

/**
 * Prints title screen and executes callback
 * @param callback - callback code to execute after title displayed
 */
exports.printTitleScreen = new Promise(function (resolve){
    asciimo.write('TypeScript', 'Colossal', function(art) {

        // clear screen
        clearScreen();

        // write text
        sys.puts(art.green);

        asciimo.write('File Watcher', 'Banner', function(art) {

            // write text
            sys.puts(art.blue);

            // wait, clear title screen, and call callback
            setTimeout(function(){
                clearScreen();
                resolve();
            }, 1500);

        });
    });
});

function clearScreen(){
    process.stdout.write('\033c');
}