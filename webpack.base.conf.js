/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-05-26 09:30:28
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-05-26 10:55:24
 */ 
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        bundle: ["@babel/polyfill", "./src/index.js"]
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, "dispatch")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader"]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader", "sass-loader"]
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'file-loader',
                options: {
                    esModule: false
                }
            },
            {
                test: /\.(woff|svg|eot|ttf)$/,
                loader: 'url-loader',
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            pages: path.resolve(__dirname, 'src/pages/'),
            utils: path.resolve(__dirname, 'src/utils/'),
            '@comps': path.resolve(__dirname, 'src/components/'),
        },
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new ExtractTextPlugin("bundle.[hash:8].css"),
    ],
}