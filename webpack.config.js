const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist'
  },
  resolve: {
    extensions: ['.js', '.glsl', 'vs', 'fs']
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'raw-loader'
      }
    ],
  },
  watchOptions: {
    ignored: /node_modules/
  }
}
