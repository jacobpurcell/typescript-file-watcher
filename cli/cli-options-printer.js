/**
 * Created by jacob.purcell on 16/01/2015.
 */

var Table = require('cli-table');

exports.printOptions = function (options) {

    var table = new Table();
    table.push(
        {'TypeScript': options.typescript },
        {'Files to watch': options.filepath }
    );

    console.log(table.toString());

};
