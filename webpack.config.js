module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader",
                exclude: /node_modules\/@reown\/appkit/,
            },
        ],
    },
};
