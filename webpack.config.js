/*
 * @Author: haobin.wang
 * @Date: 2024-12-17 11:43:12
 * @LastEditors: haobin.wang
 * @LastEditTime: 2025-04-25 10:20:30
 * @Description: Do not edit
 */
//@ts-check

"use strict";

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const extensionConfig = {
    target: "node", // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    mode: "production", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    entry: "./src/extension.ts", // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: {
      // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, "dist"),
      filename: "extension.js",
      libraryTarget: "commonjs2",
    },
    externals: {
      vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
      // modules added here also need to be added in the .vscodeignore file
    },
    resolve: {
      // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      extensions: [".ts", ".js"],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./src/webview"),
            to: path.resolve(__dirname, "./dist/webview"),
          },
        ],
      }),
      new HtmlWebpackPlugin({
        favicon: path.resolve(__dirname, "./favicon.ico"),
        minify: {
          caseSensitive: false, // 是否大小写敏感
          collapseBooleanAttributes: true, // 是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
          conservativeCollapse: true, // 折叠成一行
          collapseWhitespace: true, //删除空格、换行
        },
      }),
    ],
    optimization: {
      minimize: true, // 启用压缩
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction, // 移除所有 console
              drop_debugger: isProduction, // 移除 debugger
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
            },
          ],
        },
      ],
    },
    devtool: "nosources-source-map",
    infrastructureLogging: {
      level: "log", // enables logging required for problem matchers
    },
  };
  return [extensionConfig];
}
