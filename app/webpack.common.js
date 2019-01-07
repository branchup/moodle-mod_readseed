var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: {
    app: ['@babel/polyfill', './index.js']
  },
  output: {
    filename: '[name]-lazy.js',
    path: path.resolve(__dirname, '../amd/src'),
    libraryTarget: 'amd'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      }
    ]
  }
};
