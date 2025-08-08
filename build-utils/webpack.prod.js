const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      "process.env.BABEL_TYPES_8_BREAKING": "false",
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.MY_ENV": JSON.stringify(process.env.MY_ENV),
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
  ],
};

module.exports = config;
