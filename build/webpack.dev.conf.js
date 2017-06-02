let utils = require('./utils')
let path = require('path')
let webpack = require('webpack')
let config = require('../config')
let merge = require('webpack-merge')
let baseWebpackConfig = require('./webpack.base.conf')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')


Object.keys(baseWebpackConfig.entry).forEach(name => {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(config.entry[name])
})




let webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.sourceMap
    })
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})

let pages = utils.getEntries(path.join(config.pro_path, './**/html/**/*.html'))
for (var page in pages) {
  let conf = {
    filename: page + '.html',
    template: pages[page],
    inject: true,
    chunkSortMode: 'dependency',
    minify: {
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: false
    },
    chunks: Object.keys(config.entry).filter(x => x === page)
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}


let VConsolePlugin = require('vconsole-webpack-plugin')
webpackConfig.plugins.push(
  new VConsolePlugin({
    enable: true
  })
)

module.exports = webpackConfig
