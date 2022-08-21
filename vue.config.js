const path = require("path");
const webpack = require("webpack");

/* eslint-disable prettier/prettier */
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass")
      }
    }
  },
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin(),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    ],
    resolve: {
      alias: {
        sass: path.resolve(__dirname, "./src/assets/sass")
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader")
      .options({
        svgo: {
          plugins: [
            { removeViewBox: false },
            { convertStyleToAttrs: false },
            { removeStyleElement: true }
          ]
        }
      });

    config.plugin("compression").use(CompressionPlugin);

    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer("terser").tap(args => {
        args[0].terserOptions.keep_fnames = true;
        return args;
      });
    }
  }
};
