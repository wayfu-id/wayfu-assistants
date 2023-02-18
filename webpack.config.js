module.exports = {
    devtool: false,
    output: {
        clean: true,
        chunkFormat: "module",
        chunkLoading: "import",
        iife: false,
        environment: {
            arrowFunction: true,
            bigIntLiteral: false,
            const: true,
            destructuring: true,
            dynamicImport: false,
            forOf: true,
            module: false,
            optionalChaining: true,
            templateLiteral: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                // options: {
                //     presets: ["latest", { modules: false, plugins: true }],
                //     //     presets: ["@babel/preset-env"],
                // },
            },
        ],
    },
    target: ["web", "es5"],
    // plugins: [new WebpackUserscript()],
};
