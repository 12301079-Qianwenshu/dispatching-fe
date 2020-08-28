/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-05-26 09:30:43
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-05-26 10:31:16
 */
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dispatch',
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '/': {
        // target: 'http://192.168.1.122:8080',
        target: 'http://192.168.1.110:8080/',
        pathRewrite: { '': '' },
        changeOrigin: true,
      },
    },
  },
});