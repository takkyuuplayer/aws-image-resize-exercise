module.exports = {
    entry: "./src/index.ts",
    mode: "production",
    target: "node",
    output: {
        filename: "index.js",
        path: __dirname + "/dist"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    externals: {
        'sharp': 'sharp'
    }
};