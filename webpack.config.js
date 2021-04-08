const path = require('path')

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        main: './src/main.ts',
    },
    output: {
        path: path.resolve(__dirname, './docs'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },
}
