const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + "/src/index.html",
  filename: "index.html",
  inject: "body",
});

var entrypoint =
  process.env.npm_lifecycle_event === "dev"
    ? "webpack-dev-server/client?http://localhost:8080"
    : "./src/index.js";

module.exports = {
  entry: entrypoint,
  output: {
    path: __dirname + "/dist",
    filename: "rubberducky.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{ loader: "css-loader", options: { minimize: true } }],
        }),
      },
      {
        test: /\.ico$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /liquidfun\.min\.js$/,
        use: ["script-loader"],
      },
    ],
  },
  plugins: [HtmlWebpackPluginConfig, new ExtractTextPlugin("index.css")],
};
