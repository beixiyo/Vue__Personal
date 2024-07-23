const { resolve } = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'development',
    // devtool: 'source-map',
    entry: {
        main: resolve(__dirname, 'index.js')
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'script/[name].[chunkhash:5].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'index.html'),
        }),
    ],
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': resolve(__dirname, './src'),
            'utils': resolve(__dirname, './src/utils'),
            'vue': resolve(__dirname, './src/Vue'),
        }
    },
    devServer: {
        port: 9527,
        open: true,
        hot: true,
    }
}