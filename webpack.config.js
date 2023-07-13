const path = require("path");
module.exports = {
    mode: "development",
    entry: "./src/app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    devServer: {
        static: {
            directory: "./public",
        },
        allowedHosts: ['all'],
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                loader: "babel-loader"
            },

            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: ["file-loader"]
            },

        ]
    }
};