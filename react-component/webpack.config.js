const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  filename: './index.html',
  template: path.join(__dirname, 'examples/src/index.html'),
})

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'index.css',
  ignoreOrder: false,
})

module.exports = {
  entry: path.join(__dirname, 'examples/src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      }
    ]
  },
  plugins: [
    htmlWebpackPlugin,
    miniCssExtractPlugin,
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    port: 3001
  }
}
