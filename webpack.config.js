module.exports = {
    entry: {
        viewerRequest: './src/viewerRequest.ts',
        originResponse: './src/originResponse.ts',
    },
    mode: "production",
    target: "node",
    output: {
        libraryTarget: 'commonjs',
        filename: "[name].js",
        path: __dirname + "/dist"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    externals: {
        'sharp': 'sharp'
    }
};
