const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  mode: "development",
  watch: true,
  // devtool: "inline-source-map",

  // Faster for dev
  devtool: "eval-cheap-module-source-map",
  cache: { type: "filesystem" },
  output: {
    hotUpdateChunkFilename: ".hot/hot-update.js",
    hotUpdateMainFilename: ".hot/hot-update.json",
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      "process.env.BABEL_TYPES_8_BREAKING": "false",
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.MY_ENV": JSON.stringify(process.env.MY_ENV || "development"),
      "process.env.RAZORPAY_KEY": JSON.stringify(process.env.RAZORPAY_KEY),
      "process.env.RAZORPAY_SECRET": JSON.stringify(
        process.env.RAZORPAY_SECRET
      ),
      "process.env.GEO_API_KEY": JSON.stringify(process.env.GEO_API_KEY),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "../dist"),
    },
    port: 3002,
    hot: true,
    cache: false,
    client: {
      webSocketURL: "ws://localhost:3002/ws",
    },
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       use: ["style-loader", "css-loader"], // Use style-loader for dev
  //     },
  //   ],
  // },
};

module.exports = config;
