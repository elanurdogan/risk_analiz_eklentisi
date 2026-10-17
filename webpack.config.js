const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    content: './content/page_parser.js',
    background: './background/service_worker.js',
    popup: './popup/popup.js',
    options: './options/options.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  }
};