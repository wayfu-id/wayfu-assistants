const Header = require("gulp-header");

function setDate() {
    return new Date().toISOString().split("T")[0];
}

function generateHeaderItem(key, app, env) {
    // const app = pkg;
    const { userscript } = app;
    const setKey = (key) => `@${key.padEnd(12, " ")}`;

    let data = userscript[key] || app[key],
        isArray = data instanceof Array;
    if (data) {
        if (isArray) {
            let newData = [];
            for (item of data) {
                if (item instanceof Object) {
                    let name = Object.keys(item).toString(),
                        newKey = `${key} ${name}`;
                    newData.push(`// ${setKey(newKey)} ${item[name]}`);
                } else {
                    newData.push(`// ${setKey(key)} ${item}`);
                }
            }
            return newData.join("\n");
        }
        data = key === "name" && env !== "production" ? "WayFu Dev" : data;
        return `// ${setKey(key)} ${data}`;
    } else {
        throw new Error(`No ${key} spesified in package.json`);
    }
}

function generateStyleHeader(package) {
    return Header(
        `/*!
* <%= pkg.userscript.name %> v<%= pkg.version %> (<%= pkg.homepage %>)
* Copyright 2018-${new Date().getFullYear()}, <%= pkg.author %>
* Licensed under <%= pkg.license %>.
*/` + "\n\n",
        {
            pkg: package,
        }
    );
}

function generateHeader(package, environment) {
    const data = [
        "name",
        "description",
        "date",
        "copyright",
        "license",
        "icon",
        "homepage",
        "supportURL",
        "version",
        "author",
        "match",
        "grant",
        "connect",
        "updateURL",
        "downloadURL",
        "resource",
    ];

    const header = ["// ==UserScript=="];

    for (let key of data) {
        header.push(generateHeaderItem(key, package, environment));
    }

    header.push("// ==/UserScript==");

    const scriptMeta = header.join("\n") + "\n\n";

    return Header(scriptMeta.replace("##timestamp##", setDate()), {
        pkg: package,
    });
}

module.exports = {
    scriptHeader: generateHeader,
    styleHeader: generateStyleHeader,
};
