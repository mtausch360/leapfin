const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'build/');
const APP_DIR = path.resolve(__dirname, 'client/');

const config = {
  entry: [
    'whatwg-fetch',
    APP_DIR + '/index.js',
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
            'stage-0'
          ]
        }
      }
    ]
  }
};

module.exports = config;