const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const fs = require('fs')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  //devtool: 'source-map',
  devServer: {
    hot: true,
    contentBase: path.resolve('./dist'),
    index: 'index.html',
    port: 443,
    historyApiFallback: true, // 서버사이드렌더링 문제 해결 코드 express 를 사용할 경우 nodejs 에서 해결
    disableHostCheck: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key/privkey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'key/fullchain.pem'))
    }
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: '/node_modules',
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true}
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        loader: 'url-loader',
        options: {
          //name: '[name].[ext]?[hash]',
          publicPath: './dist',
          name: 'images/[name].[ext]',
          limit: 10000, // 10kb
          fallback: 'file-loader' // 파일사이즈가 10k보다 큰 경우, file-loader 이용하여 파일 복사
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico|woff|woff2|ttf|eot)$/i, // 이미지 로더
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: './dist',
              name: 'images/[name].[ext]'
              //name: '[name].[ext]?[hash]'
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '*.jsx'],
    alias: {
      Context: path.resolve(__dirname, 'src/context/'),
      Pages: path.resolve(__dirname, 'src/pages/'),
      App: path.resolve(__dirname, 'src/pages/app/'),
      Contents: path.resolve(__dirname, 'src/contents/'),
      Styles: path.resolve(__dirname, 'src/styles/'),
      Components: path.resolve(__dirname, 'src/components/'),
      '@': path.resolve(__dirname, 'src/')
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html', // public/index.html 파일을 읽는다.
      filename: 'index.html' // output으로 출력할 파일은 index.html 이다.
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new webpack.HotModuleReplacementPlugin()
    //new BundleAnalyzerPlugin()
  ]
}
