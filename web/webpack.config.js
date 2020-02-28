const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const fs = require('fs')

module.exports = (env, options) => {
  const config = {
    entry: {
      vendor: ['react', 'styled-components', 'react-router-dom'],
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)|(dist)/,
          use: {
            loader: 'babel-loader',
            options: {
              env: {
                development: {
                  compact: false
                }
              }
            }
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {minimize: false}
            }
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.scss$/,
          //use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],  // css 파일 단독 파일로 추출하고 싶을때 사용
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: /node_modules/
        },

        {
          // images css에서 background-image 속성 loader
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
          // font loader
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          loader: 'file-loader'
        }
      ]
    },
    // optimization: {
    //   // https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks
    //   splitChunks: {
    //     chunks: 'all',
    //     cacheGroups: {
    //       vendor: {
    //         chunks: 'all',
    //         name: 'vendor',
    //         enforce: true,
    //         test: /[\\/]node_modules[\\/]/,
    //       },
    //     },
    //   },
    // },
    resolve: {
      extensions: ['*', '.js', '*.jsx'],
      modules: [path.resolve(__dirname, './src'), 'node_modules']
    }
  }
  if (options.mode === 'development') {
    config.devtool = 'source-map'
    config.devServer = {
      hot: true,
      contentBase: path.resolve('./'),
      index: 'index.html',
      port: 443,
      host: '0.0.0.0',
      historyApiFallback: true, // 서버사이드렌더링 문제 해결 코드 express 를 사용할 경우 nodejs 에서 해결
      disableHostCheck: true,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'key/privkey.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'key/fullchain.pem'))
      }
    }
    config.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebPackPlugin({
        template: './public/index.html', // public/index.html 파일을 읽는다.
        filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
        showErrors: true // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      }),
      new CopyWebpackPlugin([{from: './public/static'}])
    ]

    config.output = {
      path: path.resolve(__dirname),
      publicPath: '/',
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js'
    }
  } else {
    config.plugins = [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
      }),
      new HtmlWebPackPlugin({
        template: './public/index.html', // public/index.html 파일을 읽는다.
        filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
        title: 'Production',
        showErrors: false // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
      }),
      new CopyWebpackPlugin([{from: './public/static'}])
    ]
    if (options.env !== 'deploy') {
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  }

  return config
}
