const path = require('path');

module.exports = {
  entry: './src/javascript/index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  }

};
