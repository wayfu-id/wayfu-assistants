const Vinyl = require("vinyl");
const { src } = require("gulp");
const del = require("gulp-clean");
const stream = require("stream");

const fileFromString = (filename, string) => {
    var src = stream.Readable({ objectMode: true });
    src._read = function () {
        this.push(
            new Vinyl({
                path: filename,
                contents: Buffer.from(string, "utf-8"),
            })
        );
        this.push(null);
    };
    return src;
};

const readJSON = (filename) => {
    const fs = require("fs");
    if (!fs.existsSync(filename)) {
        return false;
    }
    return JSON.parse(fs.readFileSync(filename, "utf8"));
};

const removeDir = (dir) => {
    return src(`${dir}**`, {
        allowEmpty: true,
        read: false,
    }).pipe(
        del({
            force: true,
        })
    );
};

module.exports = {
    readJSON: readJSON,
    createFile: fileFromString,
    cleanDir: removeDir,
};
