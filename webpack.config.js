const path = require('path');

module.exports = {
  // entry: './index.html',
  entry: './src/javascript/app.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  }

};
