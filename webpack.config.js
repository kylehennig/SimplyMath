const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

// Supported file extensions for resources.
const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    background: path.resolve(__dirname, 'src', 'background-scripts', 'background.js'),
    simplymath: path.resolve(__dirname, 'src', 'content-scripts', 'simplymath.js'),
    options: path.resolve(__dirname, 'src', 'options-page', 'options.js'),
    popup: path.resolve(__dirname, 'src', 'popup', 'popup.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          'css-loader'
        ],
        // exclude: /node_modules/
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        // exclude: /node_modules/
      },
      {
        test: new RegExp(`.(${fileExtensions.join('|')})$`),
        type: 'asset/resource',
        // exclude: /node_modules/
      },
      {
        test: require.resolve('./node_modules/mathquill/build/mathquill.js'),
        use: [
          'imports-loader?additionalCode=window.jQuery%20=%20require("jquery");',
          'exports-loader?exports=default|window.MathQuill'
        ]
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '' },
        { from: 'icons', to: '' }
      ],
    }),
    // new webpack.ProvidePlugin({
    //   'window.jQuery': path.resolve(__dirname, 'vendor', 'jquery.min.js')
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'popup', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'options-page', 'options.html'),
      filename: 'options.html',
      chunks: ['options']
    }),
    new webpack.SourceMapDevToolPlugin({
      include: ['popup.js', 'background.js'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new WriteFilePlugin()
  ]
};
