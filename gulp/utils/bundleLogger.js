/* bundleLogger
   ------------
   Provides gulp style logs to the bundle method in browserify.js
*/

const log = require("fancy-log");
const { green, magenta } = require("ansi-colors");
const prettyHrtime = require("pretty-hrtime");

let startTime;

function start() {
    startTime = process.hrtime();
    log("Running", green("`bundle`") + "...");
}
function end() {
    const taskTime = process.hrtime(startTime);
    const prettyTime = prettyHrtime(taskTime);
    log("Finished", green("`bundle`"), "in", magenta(prettyTime));
}

module.exports = { start: start, end: end };
