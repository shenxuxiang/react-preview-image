const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
  output: {
    filename: 'boundle.js',
    path: path.resolve('./dist'),
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
        loader: require.resolve('babel-loader'),
        include: path.resolve('./src'),
        options: {
          presets: [
            [ '@babel/preset-env', { modules: false, useBuiltIns: 'usage', debug: true } ],
            '@babel/preset-react',
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
        loaders: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              plugins: [
                require('autoprefixer')({
                  "browsers": [
                    "defaults",
                    "not ie < 11",
                    "last 2 versions",
                    "> 1%",
                    "iOS 7",
                    "last 3 iOS versions"
                  ]
                })
              ]
            }
          },
        ],
      },
      {
        test: /\.less$/,
        include: path.resolve('./src'),
        loaders: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              plugins: [
                require('autoprefixer')({
                  "browsers": [
                    "defaults",
                    "not ie < 11",
                    "last 2 versions",
                    "> 1%",
                    "iOS 7",
                    "last 3 iOS versions"
                  ]
                })
              ]
            }
          },
          require.resolve('less-loader'),
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve('./dist'),
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
    }),
  ],
}
