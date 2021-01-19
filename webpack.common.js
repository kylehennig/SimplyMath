const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");

// Supported file extensions for resources.
const assetFiles = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "eot",
  "otf",
  "svg",
  "ttf",
  "woff",
  "woff2",
];

module.exports = {
  entry: {
    background: path.resolve(
      __dirname,
      "src",
      "background-scripts",
      "background.ts"
    ),
    simplymath: path.resolve(
      __dirname,
      "src",
      "content-scripts",
      "simplymath.ts"
    ),
    options: path.resolve(__dirname, "src", "options-page", "options.ts"),
    popup: {
      import: path.resolve(__dirname, "src", "popup", "popup.ts"),
      dependOn: "vendor",
    },
    vendor: [
      "mathquill/build/mathquill",
      "mathquill/build/mathquill.css",
      "dom-to-image",
    ],
  },
  output: {
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(js|ts)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/,
      },
      {
        test: new RegExp(`.(${assetFiles.join("|")})$`),
        type: "asset/resource",
      },
      {
        test: require.resolve("mathquill/build/mathquill"),
        use: [
          'imports-loader?additionalCode=window.jQuery%20=%20require("jquery");',
          "exports-loader?exports=default|window.MathQuill",
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "" },
        { from: "icons", to: "" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "popup", "popup.html"),
      filename: "popup.html",
      chunks: ["popup", "vendor"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "options-page", "options.html"),
      filename: "options.html",
      chunks: ["options"],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
};
