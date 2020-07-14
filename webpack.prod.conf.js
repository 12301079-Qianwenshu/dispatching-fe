/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-05-26 09:30:52
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-12 08:48:17
 */ 
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin()
  ]
});
