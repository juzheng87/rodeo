'use strict';

const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src/browser/jsx'),
  devtool: 'source-map',
  entry: {
    startup: './src/browser/jsx/entry/startup',
    main: './src/browser/jsx/entry/main'
  },
  externals: {
    'ascii-table': 'AsciiTable',
    jquery: 'jQuery',
    templates: 'templates',
    ace: 'ace'
  },
  module: {
    // preLoaders: [
    //   {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    // ],
    loaders: [
      { test: /\.less$/, loader: 'style?sourceMap!css?sourceMap!less?sourceMap' },
      { test: /\.css$/, loader: 'style?sourceMap!css?sourceMap' },
      { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.svg$/, loaders: ['file?name=[name].[hash].[ext]', 'svgo-loader?useConfig=svgoConfig1'] },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        cacheDirectory: true,
        query: {
          plugins: ['lodash'],
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  stats: {
    colors: true
  },
  svgoConfig1: {
    plugins: [
      {removeTitle: true},
      {convertColors: {shorthex: false}},
      {convertPathData: false}
    ]
  },
  target: 'electron-renderer'
  // watch: true
};
