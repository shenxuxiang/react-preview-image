const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'production',
	entry: './src/PreviewImage', 
  output: {
    filename: 'boundle.js',
    path: path.resolve('./dist'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: path.resolve('./src'),
        options: {
          presets: [
            [ '@babel/preset-env', { modules: false, useBuiltIns: 'usage', debug: false } ],
            '@babel/preset-react'
          ],
          plugins: [
            ['@babel/plugin-transform-runtime', { 'corejs': 2 }],
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
        test: /\.css$/,
        include: path.resolve('./src'),
        loader: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
        ],
      },
      {
        test: /\.less$/,
        include: path.resolve('./src'),
        loader: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          require.resolve('less-loader'),
        ],
      },
    ],
  },
  // 打包的时候不将node_modules中的模块进行打包
  externals: [nodeExternals()],
}
