const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const deps = require("../package.json").dependencies;
const AssetsPlugin = require("assets-webpack-plugin");
const assetsPluginInstance = new AssetsPlugin();
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    main: [
      "./src/index.js",
      devMode && "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true",
    ].filter(Boolean),
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(svg)$/,
        use: "file-loader",
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".css"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Post Order",
      template: path.resolve(__dirname, "..", "./src/index.html"),
    }),
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      name: "postOrder",
      library: { type: "var", name: "postOrder" },
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      // shared: {
      //   ...deps,
      //   react: {
      //     eager: true,
      //     import: "react", // the "react" package will be used a provided and fallback module
      //     shareKey: "react", // under this name the shared module will be placed in the share scope
      //     shareScope: "legacy", // share scope with this name will be used
      //     singleton: true, // only a single version of the shared module is allowed
      //   },
      //   "react-dom": {
      //     eager: true,
      //     import: "react-dom", // the "react" package will be used a provided and fallback module
      //     shareKey: "react-dom", // under this name the shared module will be placed in the share scope
      //     shareScope: "legacy", // share scope with this name will be used
      //     singleton: true, // only a single version of the shared module is allowed
      //   },
      // },
    }),
    assetsPluginInstance,
  ],
  output: {
    path: path.resolve(__dirname, "..", "dist"),
    publicPath: "/dist/",
  },
  externals: {
    "react-native": true,
    "react-native-svg": true,
    "react-native-web": true,
    "react-native-safe-area-context": true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};
