const baseConfig = require("./webpack.common");
const devConfig = require("./webpack.dev");
const prodConfig = require("./webpack.prod");
const { merge } = require("webpack-merge");

let config;

if (process.env.NODE_ENV === "production") {
  config = merge(baseConfig, prodConfig);
} else {
  config = merge(baseConfig, devConfig);
}

module.exports = config;
