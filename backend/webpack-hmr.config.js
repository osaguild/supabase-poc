const { join } = require('path');

module.exports = {
  entry: ['./src/main'],
  stats: 'normal',
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: 'main.js',
  },
};
