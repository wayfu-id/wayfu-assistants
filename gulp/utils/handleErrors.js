const { onError } = require("gulp-notify");

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    onError({
        title: "Compile Error",
        message: "<%= error.message %>",
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit("end");
}

module.exports = { handleErrors: handleErrors };
